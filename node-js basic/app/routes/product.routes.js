const express = require('express');
const router = express.Router();

const productController = require('../controller/product.controller');

// URL → /products
router.get('/products', productController.products);

module.exports = router;