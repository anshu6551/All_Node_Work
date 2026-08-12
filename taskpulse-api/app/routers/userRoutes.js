const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

router.post('/signup', userController.signup);
router.get('/verify/:token', userController.verifyAccount); // New verification route
router.post('/login', userController.login);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.editProfile);

module.exports = router;