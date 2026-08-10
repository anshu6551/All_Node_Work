const router = require('express').Router();
const userController = require('../Controllers/userController');
const { permitRoles } = require('../Middleware/auth'); // 'Middleware' ka 'M' capital hai aapke folder structure mein

router.get('/', permitRoles('Super Admin', 'Admin'), userController.getUsersPage);
router.post('/add', permitRoles('Super Admin'), userController.createUser);
router.post('/toggle/:id', permitRoles('Super Admin', 'Admin'), userController.toggleUserStatus);
router.post('/delete/:id', permitRoles('Super Admin', 'Admin'), userController.deleteUser);

module.exports = router;