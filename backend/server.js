const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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
const PORT = process.env.PORT || 8080

// app.use(cors({
//     origin: "http://localhost:5173" || "https://carrer-advisor-project.vercel.app", // frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true // allow cookies/auth headers if needed
// }));
// CORS configuration - more flexible for production
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        "http://localhost:5173",
        "https://carrer-advisor-project.vercel.app"
    ];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        // In production, you might want to be more restrictive
        if (process.env.NODE_ENV === 'production') {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // if you're sending cookies/auth headers
}));

// Connect to database first, then start server
async function startServer() {
    try {
        // Try to connect to database first
        await connectDB();
        console.log("Database connected successfully");
    } catch (err) {
        console.log("Database connection failed", err);
        console.log("Server will continue running without database connection");
    }

    // Start the server
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
        console.log(`Health check available at: http://localhost:${PORT}/health`);
    });
}

// Start the application
startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});

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

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database status endpoint
app.get('/db-status', (req, res) => {
    const dbStatus = {
        connected: mongoose.connection.readyState === 1,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
        timestamp: new Date().toISOString()
    };
    res.status(200).json(dbStatus);
});

// Test database connection endpoint
app.get('/test-db-connection', async (req, res) => {
    try {
        const dbStatus = {
            connected: mongoose.connection.readyState === 1,
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name,
            timestamp: new Date().toISOString()
        };

        if (mongoose.connection.readyState === 1) {
            // Test a simple database operation
            const { User } = require('./models/user.model');
            const userCount = await User.countDocuments();

            res.status(200).json({
                success: true,
                message: "Database connection is working properly",
                dbStatus,
                userCount,
                testQuery: "Successfully executed count query"
            });
        } else {
            res.status(503).json({
                success: false,
                message: "Database is not connected",
                dbStatus
            });
        }
    } catch (error) {
        console.error("Database test error:", error);
        res.status(500).json({
            success: false,
            message: "Database test failed",
            error: error.message,
            dbStatus: {
                connected: mongoose.connection.readyState === 1,
                readyState: mongoose.connection.readyState
            }
        });
    }
});

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