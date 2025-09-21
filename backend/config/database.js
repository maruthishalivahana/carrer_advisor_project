const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/carrerAdvisor";

        const conn = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5,
            minPoolSize: 0,
            maxIdleTimeMS: 10000,
            connectTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
};

module.exports = connectDB;
