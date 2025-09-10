const express = require('express');
const { authController, login } = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController);
router.post('/login', login);


module.exports = router;