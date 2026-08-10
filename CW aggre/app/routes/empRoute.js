const express = require('express');
const router = express.Router();
const Employee = require('../model/empModel');
const EmpController = require('../controller/emplController');



router.post('/create',EmpController.createEmp)


module.exports = router;