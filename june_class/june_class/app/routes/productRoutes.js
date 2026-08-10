const router = require('express').Router();
const productController = require('../Controllers/productController');
const { permitRoles } = require('../Middleware/auth');

router.get('/', permitRoles('Super Admin', 'User'), productController.getProductsPage);
router.post('/add', permitRoles('Super Admin', 'User'), productController.createProduct);
router.post('/delete/:id', permitRoles('Super Admin', 'User'), productController.deleteProduct);

module.exports = router;