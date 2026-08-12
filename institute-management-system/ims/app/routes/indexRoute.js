const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const courseRoute = require('./course.route');
const batchRoute = require('./batch.route');
const enrollmentRoute = require('./enrollment.route');
const attendanceRoute = require('./attendance.route');
const examRoute = require('./exam.route');
const reportRoute = require('./report.route');

/**
 * indexRoute
 * Single entry point that parents every feature router. app.js only ever
 * mounts this one router (at /api); everything else nests underneath it.
 */
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/courses', courseRoute);
router.use('/batches', batchRoute);
router.use('/enrollments', enrollmentRoute);
router.use('/attendance', attendanceRoute);
router.use('/exams', examRoute);
router.use('/reports', reportRoute);

module.exports = router;
