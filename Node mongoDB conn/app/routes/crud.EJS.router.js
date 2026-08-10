const express = require('express');
const router = express.Router();

const ejsController = require('../controller/ejsController');

// All students list
router.get('/studentlist', ejsController.listStudent);

//  Add new student
router.get('/student/add', ejsController.addStudentForm);
router.post('/student/create', ejsController.createStudent);

// edit student
router.get('/student/edit/:id', ejsController.editStudentForm);
router.post('/student/update/:id', ejsController.updateStudent);

// delete student
router.get('/student/delete/:id', ejsController.deleteStudent);

module.exports = router;