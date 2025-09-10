// models/onboarding.schema.js
import mongoose from "mongoose";

const onboardingSchema = new mongoose.Schema(
    {
        age: {
            type: Number,
            min: 10,
            max: 100,
        },
        currentRole: {
            type: String,
            trim: true,
        },
        experience: {
            type: String,
            enum: [
                "Complete beginner - Just starting out",
                "Some experience - 1-2 years",
                "Intermediate - 3-5 years",
                "Experienced - 5+ years",
                "Expert - 10+ years",
            ],
        },
        interests: {
            type: [String],
            default: [],
            validate: [(val) => val.length <= 20, "Too many interests"],
        },
        skills: {
            type: [String],
            default: [],
            validate: [(val) => val.length <= 30, "Too many skills"],
        },
        goals: {
            type: [String],
            default: [],
            validate: [(val) => val.length <= 15, "Too many goals"],
        },
        isOnboarded: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false } // don’t create separate _id for embedded docs
);

export default onboardingSchema;
