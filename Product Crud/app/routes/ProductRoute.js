const express = require('express');
const ProductController = require('../controller/ProductController');

const router = express.Router();

router.post("/create-product", ProductController.createProduct);
router.get("/all-products", ProductController.getProducts);
router.get("/product/:id", ProductController.getProductById);
router.put("/product/update/:id", ProductController.updateProductById);
router.delete("/product/delete/:id", ProductController.deleteProductById);


module.exports = router;