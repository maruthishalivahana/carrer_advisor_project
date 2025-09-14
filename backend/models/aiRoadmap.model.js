// models/aiRoadmap.model.js
const mongoose = require("mongoose");

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

module.exports = { AIRoadmap };
