const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Authentication required. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found. Invalid token." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid token. Please log in again." });
        }

        return res.status(500).json({ message: "An error occurred during authentication." });
    }
};

module.exports = isAuthenticated;
