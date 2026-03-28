import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default async (req, res, next) => {
    try {
        // 1. Get token from header
        const jwtToken = req.header("token");

        // 2. Check if token exists
        if (!jwtToken) {
            return res.status(403).json({ error: "Access Denied: No Token Provided" });
        }

        // 3. Verify token
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);

        // 4. Add the user ID to the request object so routes can use it
        req.user = payload.id;

        // 5. Move to the next function (the actual route)
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(403).json({ error: "Token is not valid" });
    }
};