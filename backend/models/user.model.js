// models/user.model.js
const mongoose = require('mongoose');
const { onboardingSchema } = require("./onBoarding.schema.js");


const userSchema = new mongoose.Schema(
    {
        // Basic Auth Info
        fullname: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false, // hide password in queries
        },

        // Embedded onboarding
        onboarding: onboardingSchema,

        // Reference to AI Roadmap
        careerRoadmap: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AIRoadmap",
            default: null,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User }
