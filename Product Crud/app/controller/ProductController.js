const Product = require("../model/Product")


class ProductController {
    async createProduct(req, res) {

        try {
            const { name, size, price, color, desc, image, category } = req.body;
            if (!name || !size || !price || !color || !desc || !image || !category) {
                return res.status(400).json({
                    sucess: false,
                    message: "All fields are required"
                });
            }
            const product = await Product({
                name,
                size,
                price,
                color,
                desc,
                image,
                category
            })
            const result = await product.save()
            if (result) {
                return res.status(201).json({
                    sucess: true,
                    message: "Product created successfully",
                    data: result
                })
            }
        }
        catch (error) {
            return res.status(500).json({
                sucess: false,
                message: "Error creating product",
                error: error.message
            });
        }
    }

    //get all Product data
    async getProducts(req, res) {
        try {
            const data = await Product.find()
            return res.status(200).json({
                sucess: true,
                message: " all product data get successfully",
                total: data.length,
                data: data
            })

        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: error.message
            })
        }
    }

    // get single product data

    async getProductById(req, res) {
        {
            try {

                const id = req.params.id

                const data = await Product.findById(id)
                return res.status(200).json({
                    sucess: true,
                    message: " product data get successfully",
                    data: data
                })

            } catch (error) {
                return res.status(500).json({
                    sucess: false,
                    message: error.message
                })
            }
        }

    }

    //update product data

    async updateProductById(req, res) {
        try {
            const { name, size, price, color, desc, image, category } = req.body;
            if (desc.length < 20) {
                return res.status(400).json({ 
                    sucess: false,
                    message: "Description must be at least 20 characters long"
                });
            }
            else if (name.length < 3) {
                return res.status(400).json({
                    sucess: false,
                    message: "Name must be at least 3 characters long"
                });
            }

            const id = req.params.id
            const data = await Product.findByIdAndUpdate(id, req.body, { new: true })
            return res.status(200).json({
                sucess: true,
                message: " product data update successfully",
                data: data
            })
        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: error.message
            })
        }
    }

    // delete product data

    async deleteProductById(req, res) {
        try {
            const id = req.params.id
            const data = await Product.findByIdAndDelete(id)
            return res.status(200).json({
                success: true,
                message: " product data delete successfully",
            })
        } catch (error) {
            return res.status(500).json({
                sucess: false,
                message: error.message
            })
        }

    }

}

module.exports = new ProductController()