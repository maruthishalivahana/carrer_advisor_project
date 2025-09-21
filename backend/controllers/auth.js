const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { User } = require("../models/user.model");
const { message } = require('statuses');
// const { authMiddleware } = ('../middlewares/auth.middleware.js')
const app = express();


const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Validate request payload
        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "Missing required fields: fullname, email, and password are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.error("Database not connected during registration attempt");
            return res.status(503).json({
                message: "Database connection not available. Please try again later."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email }).maxTimeMS(5000);
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists!"
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            fullname: fullname.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        await newUser.save();

        console.log(`New user registered: ${email}`);
        res.status(201).json({
            message: "User created successfully! Please login."
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({
                message: "User with this email already exists!"
            });
        }

        if (error.name === 'MongoTimeoutError') {
            return res.status(503).json({
                message: "Database connection timeout. Please try again."
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Invalid data provided: " + Object.values(error.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({
            message: "Registration failed. Please try again later."
        });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request payload
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        // Check if JWT_SECRET is available
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return res.status(500).json({
                message: "Server configuration error. Please contact support."
            });
        }

        // Check if database is connected
        if (mongoose.connection.readyState !== 1) {
            console.error("Database not connected during login attempt");
            return res.status(503).json({
                message: "Database connection not available. Please try again later."
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password").maxTimeMS(5000);
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                fullname: user.fullname
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" } // Extended token expiry
        );

        console.log(`User logged in successfully: ${email}`);

        // Send success response with token and full user info
        return res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                onboarding: user.onboarding || { isOnboarded: false }
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        if (error.name === 'MongoTimeoutError') {
            return res.status(503).json({
                message: "Database connection timeout. Please try again."
            });
        }

        if (error.name === 'JsonWebTokenError') {
            console.error("JWT error:", error.message);
            return res.status(500).json({
                message: "Token generation failed. Please contact support."
            });
        }

        res.status(500).json({
            message: "Login failed. Please try again later."
        });
    }
};

const logout = (req, res) => {
    try {
        // Since JWT is stateless, logout just means "forget the token" on client side
        // You can optionally invalidate the token in DB/Redis if you want a blacklist system
        res.status(200).json({
            success: true,
            message: "Logout successful. Please clear token on client side.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message,
        });
    }
}

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            message: "No token provided, authorization denied"
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured in authMiddleware");
        return res.status(500).json({
            message: "Server configuration error"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired, please login again"
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        res.status(401).json({
            message: "Token verification failed"
        });
    }
};


module.exports = { register, loginUser, authMiddleware, logout };