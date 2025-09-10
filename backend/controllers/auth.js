const express = require('express');
const app = express();
// this is a controller function to handle user registration

const authController = ('/register', (req, res) => {
    const { fullname, email, password } = req.body;
    const user = { id: Date.now(), fullname, email, password };
    //  we acn use database to store user info
    res.status(201).json({ message: 'User registered successfully', user });

})

// this is a controller function to handle user login

const login = ('/login', (req, res) => {

    const { email, password } = req.body;
    if (email === req.body.email && password === req.body.password) {
        res.status(200).json({ message: 'Login successful' });
    } else {

        res.status(401).json({ message: 'Invalid credentials' });
    }

})

module.exports = { authController, login };