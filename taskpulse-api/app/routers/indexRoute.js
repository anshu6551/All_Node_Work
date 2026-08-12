const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const categoryLabelRoutes = require('./categoryLabelRoutes');
const reminderRoutes = require('./reminderRoutes');
const reportRoutes = require('./reportRoutes');

// Mount sub-routes
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/category-labels', categoryLabelRoutes);
router.use('/reminders', reminderRoutes);
router.use('/reports', reportRoutes);

module.exports = router;