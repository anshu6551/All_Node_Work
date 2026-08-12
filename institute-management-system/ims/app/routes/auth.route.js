const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authController = require('../controllers/AuthController');

router.post('/signup', authController.signup);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);

module.exports = router;
