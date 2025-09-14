const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database')
const { register, loginUser, authMiddleware, logout } = require("./controllers/auth.js")
const { userdata } = require("./controllers/user.js");
const { onBoarding } = require("./controllers/onBoarding.js")
const { generateAIRoadmap } = require("./controllers/roadmap.js")
const cors = require('cors');


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
app.post("/user/:id/roadmap", authMiddleware, generateAIRoadmap)


