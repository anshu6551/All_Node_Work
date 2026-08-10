const express = require('express');

const AdminAuthCheck = require('../middleware/adminAuthCheck');
const RoleAuthCheck = require('../middleware/roleAuthCheck');

const RecordController = require('../controller/crud.controller');

const router = express.Router();

// 1. Create Record (All roles)
router.post('/create', AdminAuthCheck, RecordController.createRecord);

// 2. Read Record (All roles)
router.get('/read', AdminAuthCheck, RecordController.readRecord);

// 3. Update Record (Admin & Manager)
router.put('/update/:id', AdminAuthCheck, RoleAuthCheck('admin', 'manager'), RecordController.updateRecord);

// 4. Delete Record (Admin Only)
router.delete('/delete/:id', AdminAuthCheck, RoleAuthCheck('admin'), RecordController.deleteRecord);

module.exports = router;