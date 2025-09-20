// controllers/career.js
const { User } = require("../models/user.model");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");

const PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const LOCATION = process.env.VERTEX_LOCATION || "us-central1";
const BASE_MODEL = process.env.VERTEX_BASE_MODEL || "gemini-2.5-flash-lite";

async function getCareerRecommendations(req, res) {
    try {
        const userId = req.user?.id; // ID from JWT
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        // Fetch user from DB
        const user = await User.findById(userId).lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        const client = new GoogleAuth({
            scopes: "https://www.googleapis.com/auth/cloud-platform",
        });
        const accessToken = await client.getAccessToken();

        const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${BASE_MODEL}:generateContent`;

        const prompt = `
      You are a career advisor AI.
      Based on this user's profile:
      - Skills: ${user.skills?.join(", ") || "None"}
      - Interests: ${user.interests?.join(", ") || "None"}
      - Goals: ${user.goals?.join(", ") || "None"}

      Suggest 3 career paths.
      Return response strictly in JSON like this:
      {
        "careers": [
          {
            "id": "unique-id",
            "title": "Software Engineer",
            "description": "Designs applications...",
            "salaryRange": "$70,000 - $120,000",
            "growthRate": "+25%",
            "requiredSkills": ["JavaScript", "Problem Solving"],
            "missingSkills": ["System Design"],
            "industries": ["Tech", "Finance"],
            "education": "Bachelor's degree in CS",
            "experience": "Entry level",
            "jobOutlook": "excellent"
          }
        ]
      }
    `;

        const response = await axios.post(
            url,
            { contents: [{ role: "user", parts: [{ text: prompt }] }] },
            { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
        );

        // Parse JSON safely
        let careers = [];
        try {
            const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            careers = JSON.parse(text).careers || [];
        } catch (err) {
            console.error("JSON Parse Error:", err);
        }

        res.json({ careers });
    } catch (err) {
        console.error("Career API Error:", err);
        res.status(500).json({ error: "Failed to fetch career recommendations" });
    }
}

module.exports = { getCareerRecommendations };
