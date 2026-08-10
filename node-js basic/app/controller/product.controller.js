class ProductController {

    async products(req, res) {

        const products = [
            {
                name: "T-Shirt",
                price: "500",
                desc: "Good t-shirt",
                size: ["S","M","L"],
                color: ["Red"],
                category: "Clothing",
                rating: 4,
                
            },
            {
                name: "Jeans",
                price: "1200",
                desc: "Blue jeans",
                size: ["M","L"],
                color: ["Blue"],
                category: "Clothing",
                rating: 5,
                
            },
            {
                name: "Shoes",
                price: "2000",
                desc: "Running shoes",
                size: ["8","9","10"],
                color: ["Black"],
                category: "Footwear",
                rating: 4,
                
            },
            {
                name: "Watch",
                price: "1500",
                desc: "Nice watch",
                size: ["S","L"],
                color: ["Black"],
                category: "Accessories",
                rating: 5,
                
            },
            {
                name: "Bag",
                price: "800",
                desc: "Travel bag",
                size: [],
                color: ["Grey"],
                category: "Accessories",
                rating: 3,
                
            },
            {
                name: "Jacket",
                price: "2500",
                desc: "Winter jacket",
                size: ["M","L"],
                color: ["Brown"],
                category: "Clothing",
                rating: 5,
                
            },
            {
                name: "Cap",
                price: "300",
                desc: "Cool cap",
                size: ["S","M","L"],
                color: ["Red"],
                category: "Accessories",
                rating: 4,
                
            },
            {
                name: "Sunglasses",
                price: "700",
                desc: "UV glasses",
                size: ["M","L"],
                color: ["Black"],
                category: "Accessories",
                rating: 4,
                
            },
            {
                name: "Shirt",
                price: "900",
                desc: "Formal shirt",
                size: ["S","M","L"],
                color: ["White"],
                category: "Clothing",
                rating: 5,
                
            },
            {
                name: "Sneakers",
                price: "1800",
                desc: "Casual shoes",
                size: ["8","9"],
                color: ["White"],
                category: "Footwear",
                rating: 4,
                
            }
        ];

        

        res.render('product', {
            title: "Product Page",
            products: products
        });
    }
}

module.exports = new ProductController();