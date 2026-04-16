const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'Auth route is working 🚀' });
});

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

module.exports = router;