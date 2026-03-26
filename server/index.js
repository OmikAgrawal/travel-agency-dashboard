import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config(); // This looks for .env in the folder where you run the command

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

// Test the database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: "Success!", data: result.rows[0] });
    } catch (err) {
        // This will print the EXACT reason in your terminal (black screen)
        console.error("DETAILED ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// REGISTER ROUTE (To create your Admin account)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length > 0) return res.status(401).json({ error: "User already exists" });

        // 2. Hash the password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Insert into DB
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, bcryptPassword]
        );

        res.json({ message: "Admin registered successfully!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// CREATE a new trip
app.post('/api/trips', async (req, res) => {
    try {
        // 1. Destructure the data coming from the frontend (req.body)
        const { title, description, location, price, image_url, category } = req.body;

        // 2. Insert into PostgreSQL using parameterized queries ($1, $2, etc.)
        const newTrip = await pool.query(
            "INSERT INTO trips (title, description, location, price, image_url, category) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, description, location, price, image_url, category]
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
app.put('/api/trips/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get ID from URL
        const { title, description, location, price, image_url, category } = req.body;

        const updatedTrip = await pool.query(
            "UPDATE trips SET title = $1, description = $2, location = $3, price = $4, image_url = $5, category = $6 WHERE id = $7 RETURNING *",
            [title, description, location, price, image_url, category, id]
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
app.delete('/api/trips/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTrip = await pool.query("DELETE FROM trips WHERE id = $1", [id]);

        res.json({ message: "Trip was deleted!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error during deletion" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});