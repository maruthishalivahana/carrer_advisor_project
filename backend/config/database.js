const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/carrerAdvisor";
        const conn = await mongoose.connect(mongoUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error);
        // Don't exit the process, just log the error
        console.log("Server will continue running without database connection");
    }
};

module.exports = connectDB;



// module.exports = connectDB;