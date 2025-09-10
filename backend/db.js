// const mongoose = require('mongoose');

// // Connect to your existing database
// mongoose.connect('mongodb://127.0.0.1:27017/userdata', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('✅ Connected to userdata database'))
//     .catch(err => console.error(err));

// // Define schema
// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     age: Number
// }, { collection: 'users' }); // Explicitly tell Mongoose to use the existing 'users' collection

// const User = mongoose.model('User', userSchema);

// async function run() {
//     // Insert new data into existing 'users' collection
//     const newUser = new User({ name: 'Maruthi', email: 'maruthi@example.com', age: 24 });
//     await newUser.save();
//     console.log('Data inserted into existing users collection!');

//     // Optional: fetch all data
//     const allUsers = await User.find();
//     console.log(allUsers);

//     mongoose.connection.close();
// }

// run();
