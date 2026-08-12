const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const enrollmentController = require('../controllers/EnrollmentController');

router.use(authMiddleware);

router.post('/', authCheckMiddleware('Student', 'Admin'), asyncHandler(enrollmentController.enrollStudent));
router.get('/', authCheckMiddleware('Admin', 'Teacher'), asyncHandler(enrollmentController.listEnrollments));

module.exports = router;
