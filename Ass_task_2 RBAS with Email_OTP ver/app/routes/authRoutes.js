const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Register User
router.post('/register', AuthController.register);

// Verify OTP
router.post('/verify-otp', AuthController.verifyOtp);

// Login User
router.post('/login', AuthController.login);

// Resend OTP
router.post('/resend-otp', AuthController.resendOtp);

module.exports = router;