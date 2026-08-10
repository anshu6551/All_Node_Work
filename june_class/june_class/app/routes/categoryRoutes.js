const router = require('express').Router();
const categoryController = require('../Controllers/categoryController');
const { permitRoles } = require('../middleware/auth');

router.get('/', permitRoles('Super Admin', 'Admin', 'User'), categoryController.getCategoriesPage);
router.post('/add', permitRoles('Super Admin', 'Admin', 'User'), categoryController.addCategoryOrSub);
router.post('/delete/:id', permitRoles('Super Admin', 'Admin', 'User'), categoryController.deleteCategoryOrSub);
module.exports = router;