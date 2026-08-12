const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const reportController = require('../controllers/ReportController');

router.use(authMiddleware);

router.get('/courses-enrollments', authCheckMiddleware('Admin'), asyncHandler(reportController.coursesWithEnrollments));
router.get('/batch/:batchId', authCheckMiddleware('Admin', 'Teacher'), asyncHandler(reportController.batchPerformanceReport));
// Student self / Teacher / Admin -- self-vs-other check happens inside the controller
router.get('/student/:studentId', asyncHandler(reportController.studentPerformanceReport));
router.post('/student/:studentId/email', asyncHandler(reportController.emailStudentReport));

module.exports = router;
