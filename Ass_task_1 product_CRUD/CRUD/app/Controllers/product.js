const Product = require('../models/Product');
const httpStatusCode = require('../utils/httpsStatusCode');

class ProductController {

    //    Create Product
    //   POST /api/products
    async createProduct(req, res) {
        try {
            const product = await Product.create(req.body);
            res.status(httpStatusCode.CREATED).json({ success: true, data: product });
        } catch (error) {
            res.status(httpStatusCode.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    //    Read All Products
    //    GET /api/products
    async getProducts(req, res) {
        try {
            const products = await Product.find();
            res.status(httpStatusCode.OK).json({ success: true, count: products.length, data: products });
        } catch (error) {
            res.status(httpStatusCode.SERVER_ERROR).json({ success: false, error: 'Server Error' });
        }
    }

    //    Read Single Product
    //    GET /api/products/:id
    async getProductById(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(httpStatusCode.BAD_REQUEST).json({ success: false, error: 'Product not found' });
            }
            res.status(httpStatusCode.OK).json({ success: true, data: product });
        } catch (error) {
            res.status(httpStatusCode.BAD_REQUEST).json({ success: false, error: 'Invalid Product ID format' });
        }
    }

    //    Update Product
    //    PUT /api/products/:id
    async updateProduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true 
            });

            if (!product) {
                return res.status(httpStatusCode.NOT_FOUND).json({ success: false, error: 'Product not found' });
            }
            res.status(httpStatusCode.OK).json({ success: true, data: product });
        } catch (error) {
            res.status(httpStatusCode.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }

    //    Delete Product
    //   DELETE /api/products/:id
    async deleteProduct(req, res) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(httpStatusCode.NOT_FOUND).json({ success: false, error: 'Product not found' });
            }
            res.status(httpStatusCode.OK).json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            res.status(httpStatusCode.BAD_REQUEST).json({ success: false, error: 'Invalid Product ID format' });
        }
    }
}

module.exports = new ProductController();