// const { User } = require("../models/user.model");
// const { AIRoadmap } = require("../models/aiRoadmap.model");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const generateAIRoadmap = async (id) => {
//   try {

//     if (!id) throw new Error("User ID is required");
//     const user = await User.findById(id);
//     if (!user) return "User not found";


//     // Init Gemini client
//     const genAI = new GoogleGenerativeAI("AIzaSyCGoifAIBCvrjhxXqT2xJWqswOsfamoZRA");
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Prompt for JSON roadmap
//     const prompt = `
//     Generate a 4-week learning roadmap in JSON.
//     - Each week must contain exactly 3 tasks (total 12 tasks).
//     - Each task should have: "task" (string) and "status" ("pending").
//     - Personalize using:
//       Interests: ${user.onboarding?.interests?.join(", ")}
//       Skills: ${user.onboarding?.skills?.join(", ")}
//       Goals: ${user.onboarding?.goals?.join(", ")}
//     - Return only valid JSON, no markdown, no explanations.

//     Example format:
//     {
//       "roadmap": {
//         "week1": [
//           { "task": "Learn basics of JavaScript", "status": "pending" },
//           { "task": "Practice 5 coding problems", "status": "pending" },
//           { "task": "Read about DOM manipulation", "status": "pending" }
//         ],
//         "week2": [
//           { "task": "Build a small project", "status": "pending" },
//           { "task": "Learn Git & GitHub basics", "status": "pending" },
//           { "task": "Solve 5 more coding problems", "status": "pending" }
//         ],
//         "week3": [
//           { "task": "Learn Node.js fundamentals", "status": "pending" },
//           { "task": "Build a simple API with Express", "status": "pending" },
//           { "task": "Deploy project to Vercel/Heroku", "status": "pending" }
//         ],
//         "week4": [
//           { "task": "Contribute to open-source", "status": "pending" },
//           { "task": "Create portfolio project", "status": "pending" },
//           { "task": "Prepare for coding interviews", "status": "pending" }
//         ]
//       }
//     }
//     `;

//     // Call Gemini API
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     // ✅ Extract JSON only
//     let roadmap;
//     try {
//       const jsonMatch = text.match(/\{[\s\S]*\}/);
//       roadmap = JSON.parse(jsonMatch[0]);
//     } catch (e) {
//       console.error("Gemini raw output:", text);
//       return e;
//     }

//     const aiRoadmap = new AIRoadmap({
//       user: id,
//       roadmap: roadmap.roadmap, // only store roadmap part
//     });

//     await aiRoadmap.save();

//     return aiRoadmap;

//   } catch (err) {
//     console.error("Error generating roadmap:", err);
//     ;
//   }
// };


// // GET /user/:id/roadmap (uses authenticated user id)
// const getUserRoadmap = async (req, res) => {
//   try {
//     const authenticatedUserId = req.user?.id;
//     if (!authenticatedUserId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     let aiRoadmap = await AIRoadmap.findOne({ user: authenticatedUserId });

//     // Auto-generate if missing
//     if (!aiRoadmap) {
//       aiRoadmap = await generateAIRoadmap(authenticatedUserId);
//       if (!aiRoadmap || !aiRoadmap.roadmap) {
//         return res.status(404).json({ message: "No roadmap found" });
//       }
//     }

//     // Always return a stable shape for the frontend
//     return res.status(200).json({ roadmap: aiRoadmap.roadmap });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// }

// module.exports = { generateAIRoadmap, getUserRoadmap };


// controllers/roadmap.controller.js
const { User } = require("../models/user.model");
const { AIRoadmap } = require("../models/aiRoadmap.model");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");

// Environment-configured values (with sensible defaults from user)
const PROJECT_ID = process.env.GOOGLE_PROJECT_ID || "46920913764";
const LOCATION = process.env.VERTEX_LOCATION || "us-central1";
// Optional tuned model id; if not provided we will use the base model
const TUNED_MODEL_ID = process.env.VERTEX_TUNED_MODEL || "";
const BASE_MODEL = process.env.VERTEX_BASE_MODEL || "gemini-2.5-flash-lite";

if (!PROJECT_ID) {
  console.warn("⚠️ GOOGLE_PROJECT_ID not set in env; using default");
}

// 🔹 Call Vertex AI Generative endpoint for Gemini (tuned or base) using generateContent
async function predictWithFineTunedModel(prompt) {
  const client = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
  });

  let accessToken;
  try {
    const accessTokenObj = await client.getAccessToken();
    accessToken = accessTokenObj?.token || accessTokenObj;
  } catch (e) {
    const msg = `Failed to obtain Google access token: ${e.message}`;
    console.error(msg);
    throw new Error(msg);
  }

  const resource = TUNED_MODEL_ID
    ? `projects/${PROJECT_ID}/locations/${LOCATION}/tunedModels/${TUNED_MODEL_ID}:generateContent`
    : `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${BASE_MODEL}:generateContent`;
  const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/${resource}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: String(prompt || "") }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2048,
    },
    safetySettings: [],
  };

  try {
    const resp = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 45000,
    });
    return resp.data;
  } catch (e) {
    const details = e.response?.data || e.message;
    console.error("Vertex generateContent error:", details);
    throw new Error(typeof details === "string" ? details : JSON.stringify(details));
  }
}

// 🔹 Extract text/string payload from prediction
function extractTextFromPrediction(prediction) {
  if (!prediction) return "";
  try {
    if (prediction.candidates?.length) {
      const cand = prediction.candidates[0];
      const part = cand?.content?.parts?.[0];
      if (part?.text) return String(part.text);
    }
  } catch (_) { }
  if (typeof prediction === "string") return prediction;
  if (prediction.text) return prediction.text;
  if (prediction.output) return prediction.output;
  try {
    return JSON.stringify(prediction);
  } catch {
    return "";
  }
}

// 🔹 Internal: generate and save roadmap for a user id
async function generateAndSaveRoadmapForUser(userId) {
  if (!userId) throw new Error("User ID is required");
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const ob = user.onboarding || {};
  const prompt = `
Generate a 4-week learning roadmap in JSON.
- Each week must contain exactly 3 tasks (total 12 tasks).
- Each task should have: "task" (string) and "status" ("pending").
- Personalize using:
  Age: ${ob.age ?? ""}
  Current Role: ${ob.currentRole ?? ""}
  Experience: ${ob.experience ?? ""}
  Interests: ${(ob.interests || []).join(", ")}
  Skills: ${(ob.skills || []).join(", ")}
  Goals: ${(ob.goals || []).join(", ")}
- Return ONLY valid JSON (an object with key "roadmap"), no markdown, no explanations.
`;

  const apiResult = await predictWithFineTunedModel(prompt);
  const text = extractTextFromPrediction(apiResult);
  if (!text) throw new Error("Empty model response");

  let roadmapObj;
  try {
    const cleaned = String(text)
      .replace(/^```(json)?/gi, "")
      .replace(/```$/g, "")
      .trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found in model output");
    roadmapObj = JSON.parse(match[0]);
  } catch (e) {
    console.error("❌ Failed to parse JSON. Raw:", text);
    throw new Error("Failed to parse JSON: " + e.message);
  }

  if (!roadmapObj?.roadmap || typeof roadmapObj.roadmap !== "object") {
    throw new Error("Parsed JSON missing 'roadmap' object");
  }

  let aiRoadmap;
  try {
    aiRoadmap = await AIRoadmap.findOneAndUpdate(
      { user: userId },
      { user: userId, roadmap: roadmapObj.roadmap, generatedAt: new Date() },
      { new: true, upsert: true }
    );
  } catch (e) {
    console.error("❌ Failed to save roadmap:", e);
    throw new Error("Database error while saving roadmap");
  }

  try {
    if (!user.careerRoadmap || String(user.careerRoadmap) !== String(aiRoadmap._id)) {
      user.careerRoadmap = aiRoadmap._id;
      await user.save();
    }
  } catch (e) {
    console.warn("⚠️ Failed to link roadmap to user:", e?.message || e);
  }

  return aiRoadmap;
}

// 🔹 Express handler: POST /user/roadmap
const generateAIRoadmap = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const aiRoadmap = await generateAndSaveRoadmapForUser(authenticatedUserId);
    return res.status(200).json({ roadmap: aiRoadmap.roadmap });
  } catch (err) {
    console.error("generateAIRoadmap error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// 🔹 Express handler
const getUserRoadmap = async (req, res) => {
  try {
    const authenticatedUserId = req.user?.id;
    if (!authenticatedUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let aiRoadmap = await AIRoadmap.findOne({ user: authenticatedUserId });
    if (!aiRoadmap) {
      aiRoadmap = await generateAndSaveRoadmapForUser(authenticatedUserId);
    }

    return res.status(200).json({ roadmap: aiRoadmap.roadmap });
  } catch (err) {
    console.error("getUserRoadmap error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { generateAIRoadmap, getUserRoadmap };
