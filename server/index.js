import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authorize from "./middleware/authorize.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetchDestinationImages from "./imageService.js";


dotenv.config(); // This looks for .env in the folder where you run the command

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Using Pool for better performance
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
    res.send('API is working!');
});

// REGISTER ROUTE
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const table = role === "admin" ? "admins" : "users";

        // 1. Check if admin exists
        const user = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
        if (user.rows.length > 0) return res.status(401).json({ error: "Admin already exists" });

        // 2. Hash the password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Insert into DB
        const newUser = await pool.query(
            `INSERT INTO ${table} (username, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [username, email, bcryptPassword]
        );

        res.json({ message: "Admin registered successfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const table = role === "admin" ? "admins" : "users";

        // 1. Find the user by email
        const user = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // 2. Compare the "Typed" password with the "Hashed" password in DB
        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // 3. Generate the JWT "Passport"
        const token = jwt.sign(
            { id: user.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, username: user.rows[0].username });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// CREATE a new trip
app.post('/api/trips', authorize, async (req, res) => {
    try {
        // 1. Destructure the data coming from the frontend (req.body)
        const { title, description, location, price, category, itinerary, images } = req.body;

        // 2. Insert into PostgreSQL using parameterized queries ($1, $2, etc.)
        const newTrip = await pool.query(
            "INSERT INTO trips (title, description, location, price, category, itinerary, images) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [title, description, location, Number(price), category, JSON.stringify(itinerary),images]
        );

        // 3. Send back the newly created trip as JSON
        res.status(201).json(newTrip.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while creating trip" });
    }
});

// GET all trips
app.get('/api/trips', async (req, res) => {
    try {
        const allTrips = await pool.query("SELECT * FROM trips ORDER BY created_at DESC");
        res.json(allTrips.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching trips" });
    }
});

// 3. UPDATE a trip
app.put('/api/trips/:id', authorize, async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL
        const { title, description, location, price, category, itinerary, images } = req.body;

        const updatedTrip = await pool.query(
            "UPDATE trips SET title = $1, description = $2, location = $3, price = $4, category = $5, itinerary = $6, images = $7 WHERE id = $8 RETURNING *",
            [title, description, location, price, category, JSON.stringify(itinerary), images, id]
        );

        if (updatedTrip.rows.length === 0) {
            return res.status(404).json({ error: "Trip not found" });
        }

        res.json(updatedTrip.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during update" });
    }
});

// 4. DELETE a trip
app.delete('/api/trips/:id', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTrip = await pool.query("DELETE FROM trips WHERE id = $1", [id]);

        res.json({ message: "Trip was deleted!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during deletion" });
    }
});

// GET all customers
app.get('/api/customers', async (req, res) => {
    try {
        const allUsers = await pool.query(
            "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC"
        );
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Could not fetch customers" });
    }
});


//AI trip generations
app.post("/api/trips/ai-generate", async (req, res) => {

    console.log("Body received:", req.body); // Check if this is empty or nested!
    const { location, duration, criteria, category, price} = req.body;

    if (!location || !duration) {
        return res.status(400).json({ error: "Missing location or duration" });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const prompt = `Generate a highly detailed travel itinerary for ${location}.
        Duration: ${duration} days.
        Category: ${category}.
        Price: ${price}.
        Criteria: ${criteria}.
        Format the response strictly as a JSON object with:
        {
          "title": "A catchy name",
          "description": "Short summary",
          "price": 0, 
          "location": "..."
          "itinerary": [
            {"day": 1, "activities": "morning, afternoon, evening plans"},
            ... (repeat for exactly ${duration} days)
          ]
        }`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const jsonMatch = responseText.match(/\{[\s\S]*\}/); // Finds the first '{' and last '}'

        if (jsonMatch) {
            const tripData = JSON.parse(jsonMatch[0]);

            const imageUrls = await fetchDestinationImages(location);

            // 3. Insert into DB (Ensure 'price' is a number)
            const newTrip = await pool.query(
                "INSERT INTO trips (title, description, location, price, category,itinerary,images) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
                [
                    tripData.title,
                    tripData.description,
                    tripData.location,
                    Number(price),
                    category,
                    JSON.stringify(tripData.itinerary),
                    imageUrls
                ]
            );

            res.json(newTrip.rows[0]);
        } else {
            throw new Error("No JSON found in AI response");
        }



    } catch (err) {
        // This will print the EXACT error in your VS Code Terminal
        console.error("SERVER CRASH ERROR:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/bookings", authorize, async (req, res) => {
    const { trip_id } = req.body;
    const user_id = req.user; // Extracted from JWT by authorize middleware

    try {
        // Check if already booked (optional)
        const existing = await pool.query(
            "SELECT * FROM bookings WHERE user_id = $1 AND trip_id = $2",
            [user_id, trip_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: "You have already booked this trip!" });
        }

        const newBooking = await pool.query(
            "INSERT INTO bookings (user_id, trip_id) VALUES ($1, $2) RETURNING *",
            [user_id, trip_id]
        );

        res.json({ message: "Booking confirmed!", booking: newBooking.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// GET user-specific bookings
app.get("/api/my-bookings", authorize, async (req, res) => {
    try {
        const user_id = req.user; // From the JWT via authorize middleware

        const userBookings = await pool.query(
            `SELECT 
                bookings.id as booking_id, 
                bookings.status, 
                bookings.booking_date, 
                trips.title, 
                trips.location, 
                trips.price, 
                trips.images
             FROM bookings 
             JOIN trips ON bookings.trip_id = trips.id 
             WHERE bookings.user_id = $1 
             ORDER BY bookings.booking_date DESC`,
            [user_id]
        );

        res.json(userBookings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error fetching bookings");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});