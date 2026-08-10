const express = require('express');
const productController = require("../controllers/productController");

const router = express.Router();

router.post('/products', productController.addProduct)
router.get('/products', productController.getProduct)
router.get('/products/:id', productController.getPrductByid)
router.put('/products/:id', productController.updateProduct) 
router.delete('/products/:id', productController.softDeleteProduct)
router.patch('/products/:id/restore', productController.restoreProduct)
router.delete('/products/:id/force', productController.permanentDeleteProduct)


module.exports = router