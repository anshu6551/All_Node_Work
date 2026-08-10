const express = require('express');
const router = express.Router();

// CHANGE THIS LINE: Point it to authController, not productController
const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    updateProfileImage 
} = require('../controller/authController'); // Also check if your folder is 'controller' or 'controllers'

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); 

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/image', protect, upload.single('profileImage'), updateProfileImage);

module.exports = router;