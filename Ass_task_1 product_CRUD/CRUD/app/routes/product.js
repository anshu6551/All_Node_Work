const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.js');

// Create Product
router.post('/', ProductController.createProduct);

// Read All Products
router.get('/', ProductController.getProducts);

// Read Single Product
router.get('/:id', ProductController.getProductById);

// Update Product
router.put('/:id', ProductController.updateProduct);

// Delete Product
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;