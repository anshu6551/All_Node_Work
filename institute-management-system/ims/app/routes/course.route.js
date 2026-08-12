const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const courseController = require('../controllers/CourseController');

// Public: browse courses
router.get('/', asyncHandler(courseController.listCourses));
router.get('/:id', asyncHandler(courseController.getCourseById));

// Admin only
router.post('/', authMiddleware, authCheckMiddleware('Admin'), asyncHandler(courseController.addCourse));
router.put('/:id', authMiddleware, authCheckMiddleware('Admin'), asyncHandler(courseController.editCourse));
router.delete('/:id', authMiddleware, authCheckMiddleware('Admin'), asyncHandler(courseController.deleteCourse));

module.exports = router;
