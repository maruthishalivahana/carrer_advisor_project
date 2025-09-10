// models/user.model.js
import mongoose from "mongoose";
import onboardingSchema from ".models/onBoarding.schema.js";

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

export default User;
