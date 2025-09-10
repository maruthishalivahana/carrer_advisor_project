const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.route');
app.use(express.json());
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})