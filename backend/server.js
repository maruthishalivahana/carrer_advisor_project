const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database')
const { register, loginUser, authMiddleware, logout } = require("./controllers/auth.js")
const { userdata } = require("./controllers/user.js");
const { onBoarding } = require("./controllers/onBoarding.js")
const { generateAIRoadmap, getUserRoadmap } = require("./controllers/roadmap.js")
const cors = require('cors');
const { chatbotController } = require('./controllers/chatbot.js');
const { getCareerRecommendations } = require('./controllers/carrerRecommedation.js');


const app = express();
app.use(bodyParser.json());
app.use(express.json())
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // allow cookies/auth headers if needed
}));


connectDB().then(() => {
    console.log("Database connected successfully")
    app.listen(port, () => {
        console.log(`server running on port ${port}`)
    })
}).catch((err) => {
    console.log("Database connection failed", err)
})

/// routes
app.post("/user/register", register);
app.post('/user/login', loginUser)
app.post('/user/onboarding', authMiddleware, onBoarding)
app.get("/user/me", authMiddleware, userdata)
app.post("/logout", authMiddleware, logout)
app.post("/user/roadmap", authMiddleware, generateAIRoadmap)
app.get('/user/roadmap', authMiddleware, getUserRoadmap)
app.post('/user/chatbot/:id', chatbotController)
app.post('/user/career-recommendations/me', getCareerRecommendations)


app.post("/predict", async (req, res) => {
    try {
        const { input_text } = req.body;

        if (!input_text) {
            return res.status(400).json({ error: "Missing input_text in request body" });
        }

        const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/endpoints/${ENDPOINT_ID}`;

        const request = {
            endpoint,
            instances: [{ content: input_text }],
        };

        console.log("📤 Sending request to Vertex AI:", JSON.stringify(request, null, 2));

        const [response] = await vertexClient.predict(request);
        res.json({ predictions: response.predictions });
    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Prediction failed", details: error.message });
    }
});