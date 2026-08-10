const express = require('express');
const AdminController = require('../controller/admin.controller');

// const AdminAuthCheck = require('../middleware/adminAuthCheck');

const router = express.Router();

// admin

router.post('/admin/register', AdminController.AdminRegister);
router.post('/admin/login', AdminController.AdminLogin);





module.exports = router