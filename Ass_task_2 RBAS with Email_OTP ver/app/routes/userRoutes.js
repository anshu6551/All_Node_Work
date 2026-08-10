const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Standard User Profile (Accessible to both Verified Users and Admins)
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Admin Exclusive Route
router.get('/admin-dashboard', protect, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: `Access granted. Welcome to the administrative dashboard panel, ${req.user.name}.` 
  });
});

module.exports = router;