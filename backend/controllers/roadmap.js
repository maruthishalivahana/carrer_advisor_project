const { User } = require("../models/user.model")
const { AIRoadmap } = require("../models/aiRoadmap.model")
// const roadmap = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { roadmap } = req.body;

//         console.log("Received body:", req.body);  // <-- check here

//         if (!roadmap) {
//             return res.status(400).json({ error: "roadmap JSON is required" });
//         }

//         const aiRoadmap = new AIRoadmap({
//             user: id,
//             roadmap
//         });

//         await aiRoadmap.save();
//         res.status(201).json(aiRoadmap);

//     } catch (err) {
//         console.error("Error saving roadmap:", err);
//         res.status(500).json({ error: err.message });
//     }


// }


const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateAIRoadmap = async (req, res) => {
    try {
        const { id } = req.params; // userId
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Init Gemini client
        const genAI = new GoogleGenerativeAI("AIzaSyCGoifAIBCvrjhxXqT2xJWqswOsfamoZRA");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Prepare prompt
        const prompt = `
    Generate a structured 4-week learning roadmap in JSON format.
    Each week should contain 3 tasks (total 12 tasks).
    Personalize it using:
    Interests: ${user.onboarding?.interests?.join(", ")}
    Skills: ${user.onboarding?.skills?.join(", ")}
    Goals: ${user.onboarding?.goals?.join(", ")}
    Strictly return only JSON.
Do NOT include markdown ticks, explanations, or text before/after.
Format:

{
  "week1": [{"task": "..."}],
  "week2": [{"task": "..."}],
  "week3": [{"task": "..."}],
  "week4": [{"task": "..."}]
}
    `;

        // Call Gemini
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse JSON from Gemini
        let roadmap;
        try {
            roadmap = JSON.parse(text);
        } catch (e) {
            console.error("Gemini raw output:", text);
            return res.status(500).json({ error: "Failed to parse AI roadmap JSON" });
        }

        // Save to MongoDB
        const aiRoadmap = new AIRoadmap({
            user: id,
            roadmap,
        });

        await aiRoadmap.save();

        res.status(201).json(aiRoadmap);
    } catch (err) {
        console.error("Error generating roadmap:", err);
        res.status(500).json({ error: err.message });
    }
};
module.exports = {
    generateAIRoadmap
}