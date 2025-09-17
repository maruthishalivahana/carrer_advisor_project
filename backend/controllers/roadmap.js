const { User } = require("../models/user.model");
const { AIRoadmap } = require("../models/aiRoadmap.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateAIRoadmap = async (id) => {
  try {

    if (!id) throw new Error("User ID is required");
    const user = await User.findById(id);
    if (!user) return "User not found";


    // Init Gemini client
    const genAI = new GoogleGenerativeAI("AIzaSyCGoifAIBCvrjhxXqT2xJWqswOsfamoZRA");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prompt for JSON roadmap
    const prompt = `
    Generate a 4-week learning roadmap in JSON.
    - Each week must contain exactly 3 tasks (total 12 tasks).
    - Each task should have: "task" (string) and "status" ("pending").
    - Personalize using:
      Interests: ${user.onboarding?.interests?.join(", ")}
      Skills: ${user.onboarding?.skills?.join(", ")}
      Goals: ${user.onboarding?.goals?.join(", ")}
    - Return only valid JSON, no markdown, no explanations.

    Example format:
    {
      "roadmap": {
        "week1": [
          { "task": "Learn basics of JavaScript", "status": "pending" },
          { "task": "Practice 5 coding problems", "status": "pending" },
          { "task": "Read about DOM manipulation", "status": "pending" }
        ],
        "week2": [
          { "task": "Build a small project", "status": "pending" },
          { "task": "Learn Git & GitHub basics", "status": "pending" },
          { "task": "Solve 5 more coding problems", "status": "pending" }
        ],
        "week3": [
          { "task": "Learn Node.js fundamentals", "status": "pending" },
          { "task": "Build a simple API with Express", "status": "pending" },
          { "task": "Deploy project to Vercel/Heroku", "status": "pending" }
        ],
        "week4": [
          { "task": "Contribute to open-source", "status": "pending" },
          { "task": "Create portfolio project", "status": "pending" },
          { "task": "Prepare for coding interviews", "status": "pending" }
        ]
      }
    }
    `;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // ✅ Extract JSON only
    let roadmap;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      roadmap = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Gemini raw output:", text);
      return e;
    }

    const aiRoadmap = new AIRoadmap({
      user: id,
      roadmap: roadmap.roadmap, // only store roadmap part
    });

    await aiRoadmap.save();

    return aiRoadmap;

  } catch (err) {
    console.error("Error generating roadmap:", err);
    ;
  }
};


// GET /user/:id/roadmap (uses authenticated user id)
const getUserRoadmap = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let aiRoadmap = await AIRoadmap.findOne({ user: authenticatedUserId });

    // Auto-generate if missing
    if (!aiRoadmap) {
      aiRoadmap = await generateAIRoadmap(authenticatedUserId);
      if (!aiRoadmap || !aiRoadmap.roadmap) {
        return res.status(404).json({ message: "No roadmap found" });
      }
    }

    // Always return a stable shape for the frontend
    return res.status(200).json({ roadmap: aiRoadmap.roadmap });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generateAIRoadmap, getUserRoadmap };
