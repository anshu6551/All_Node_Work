const express = require('express');
const StudentController = require('../controller/StudentController');

const router = express.Router();


router.post('/create',StudentController.createStudent)
router.get('/allstudent',StudentController.getStudent)
router.get('/student/:id',StudentController.getStudentById)
router.put('/student/update/:id',StudentController.updateStudentById)
router.delete('/student/delete/:id',StudentController.deleteStudentById)


module.exports = router;