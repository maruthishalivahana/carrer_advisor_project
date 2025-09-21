const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/carrerAdvisor";

        // Optimize connection settings for Cloud Run
        const conn = await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 1, // Maintain up to 1 socket connection
            minPoolSize: 0, // Allow no connections when idle
            maxIdleTimeMS: 10000, // Close connections after 10 seconds of inactivity
            connectTimeoutMS: 10000, // 10 seconds connection timeout
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (error) {
        console.error("Database connection error:", error);
        console.log("Server will continue running without database connection");
    }
};

module.exports = connectDB;



// module.exports = connectDB;