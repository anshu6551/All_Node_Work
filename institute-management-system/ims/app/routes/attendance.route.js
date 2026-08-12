const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const attendanceController = require('../controllers/AttendanceController');

router.use(authMiddleware);

router.post('/', authCheckMiddleware('Teacher', 'Admin'), asyncHandler(attendanceController.markAttendance));
// Student self / Teacher / Admin -- self-vs-other check happens inside the controller
router.get('/student/:studentId', asyncHandler(attendanceController.getStudentAttendance));
router.get('/batch/:batchId', authCheckMiddleware('Teacher', 'Admin'), asyncHandler(attendanceController.getBatchAttendance));

module.exports = router;
