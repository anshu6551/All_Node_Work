const express = require('express');
const router = express.Router();
const EmpCWController = require('../controller/empCWController');



router.post('/create', EmpCWController.createEmp);









module.exports = router;