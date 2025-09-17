const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require("../models/user.model");
const { message } = require('statuses');
// const { authMiddleware } = ('../middlewares/auth.middleware.js')
const app = express();


const register = async (req, res) => {

    try {

        const { fullname, email, password } = req.body;
        const isUserRegister = await User.findOne({ email });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        if (isUserRegister) {
            res.status(400).json({
                message: "user already exits !"

            })
        } else {
            const newUser = new User({
                fullname,
                email,
                password: hashedPassword
            })
            await newUser.save();
            res.status(201).json({
                message: "user created sucessfully please login!"
            })
        }

    } catch (error) {
        res.status(400).json({
            message: "something went wrong " + error.message
        })

    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const isUserRegister = await User.findOne({ email }).select("+password");
        if (!isUserRegister) {
            return res.status(400).json({
                message: "User not found. Please register first!"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, isUserRegister.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: isUserRegister._id, email: isUserRegister.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send success response with token and full onboarding info
        return res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: isUserRegister._id,
                fullname: isUserRegister.fullname,
                email: isUserRegister.email,
                onboarding: isUserRegister.onboarding // ✅ this includes isOnboarded + other details
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
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
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};


module.exports = { register, loginUser, authMiddleware, logout };