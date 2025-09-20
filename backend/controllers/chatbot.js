const { User } = require("../models/user.model");
const { GoogleAuth } = require("google-auth-library");

// Load env vars
const PROJECT_ID = process.env.GOOGLE_PROJECT_ID || "46920913764";
const LOCATION = process.env.VERTEX_LOCATION || "us-central1";
const TUNED_MODEL_ID = process.env.VERTEX_TUNED_MODEL || ""; // e.g. "5787238770868748288"
const BASE_MODEL = process.env.VERTEX_BASE_MODEL || "gemini-2.0-flash";

// Helper: call Vertex AI (fine-tuned or base)
async function predictWithVertexAI(prompt) {
    const client = new GoogleAuth({
        scopes: "https://www.googleapis.com/auth/cloud-platform",
    });

    // 🔑 get access token for service account
    const accessToken = await client.getAccessToken();

    // Choose tuned model if available, else base model
    const resource = TUNED_MODEL_ID
        ? `projects/${PROJECT_ID}/locations/${LOCATION}/models/${TUNED_MODEL_ID}:generateContent`
        : `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${BASE_MODEL}:generateContent`;

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/${resource}`;

    // Send request
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Vertex AI error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No reply from model";
    return reply;
}

// Controller
const chatbotController = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: "Message is required" });

        const user = await User.findById(req.params.id).select("onboarding fullname");
        if (!user) return res.status(404).json({ message: "User not found" });

        const context = `
User Info:
Name: ${user.fullname || "Unknown"}
Role: ${user.onboarding?.currentRole || "Not provided"}
Experience: ${user.onboarding?.experience || "Not provided"}
Interests: ${user.onboarding?.interests?.join(", ") || "None"}
Skills: ${user.onboarding?.skills?.join(", ") || "None"}
Goals: ${user.onboarding?.goals?.join(", ") || "None"}
    `;

        const prompt = `
You are a career assistant chatbot. Use the user's onboarding info to personalize replies.
Do not use Markdown, or special formatting. 
Reply in plain natural language, like a modern chat assistant.
${context}

User's message: ${message}
`;


        const reply = await predictWithVertexAI(prompt);

        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ message: error.message || "Something went wrong" });
    }
};

module.exports = { chatbotController };
