// models/aiRoadmap.model.js
import mongoose from "mongoose";

const aiRoadmapSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roadmap: {
            type: Object, // AI JSON response from Gemini/OpenAI
            required: true,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const AIRoadmap = mongoose.model("AIRoadmap", aiRoadmapSchema);

export default AIRoadmap;
