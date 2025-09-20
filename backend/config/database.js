// const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/carrerAdvisor");
}
const mongoose = require("mongoose");

// const connectDB = async () => {
//     const conn = await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/carrerAdvisor"{
//         // useNewUrlParser: true,
//         // useUnifiedTopology: true,
//     });

// };

module.exports = connectDB;



// module.exports = connectDB;