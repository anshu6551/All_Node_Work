const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const examController = require('../controllers/ExamController');

router.use(authMiddleware);

router.post('/', authCheckMiddleware('Admin', 'Teacher'), asyncHandler(examController.createExam));
router.put('/:id', authCheckMiddleware('Admin', 'Teacher'), asyncHandler(examController.updateExam));
router.post('/:id/marks', authCheckMiddleware('Teacher'), asyncHandler(examController.assignMarks));

// Student self / Teacher / Admin -- self-vs-other check happens inside the controller
router.get('/results/student/:studentId', asyncHandler(examController.getStudentResults));
router.get('/results/batch/:batchId', authCheckMiddleware('Teacher', 'Admin'), asyncHandler(examController.getBatchResults));

module.exports = router;
