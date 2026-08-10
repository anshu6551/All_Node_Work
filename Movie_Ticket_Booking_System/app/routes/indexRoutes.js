const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const movieRoutes = require('./movieRoutes');
const bookingRoutes = require('./bookingRoutes');
const reportRoutes = require('./reportRoutes');

// Bound cleanly to singular resource collections
router.use('/user', userRoutes);
router.use('/movie', movieRoutes);
router.use('/booking', bookingRoutes);
router.use('/report', reportRoutes);

module.exports = router;