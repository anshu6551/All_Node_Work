
const { Product } = require("../model/index");
const {sequelize} = require("../config/db");





class ProductController {

    async createProduct(req, res) {
        try{
            const { name, price, description } = req.body;
            
            const product = await Product.create({ name, price, description });
            return res.status(201).json({
                message: "Product created successfully",
                product
            });
        }catch(err){
            console.error("Error creating product:", err);
            res.status(500).json({ error: "Failed to create product" });
        }
    }

}




module.exports = new ProductController();