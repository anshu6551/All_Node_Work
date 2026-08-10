const User = require('../model/user');
const Order = require('../model/order');

class UserController {

    async createUser(req, res) {
        try {
            const { name, email } = req.body;
            const newUser = await User.create({ name, email });
            res.status(201).json({ message: "User created successfully", user: newUser });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createOrder(req, res) {
        try {
            const { userId, totalAmount } = req.body;

            const userExists = await User.findById(userId);
            if (!userExists) {
                return res.status(404).json({ error: "User not found. Cannot place order." });
            }

            const newOrder = await Order.create({ userId, totalAmount });
            res.status(201).json({ message: "Order placed successfully", order: newOrder });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

   
    async getUsersWithOrders(req, res) {
        try {
            const data = await User.aggregate([
                { $lookup: { from: 'orders', localField: '_id', foreignField: 'userId', as: 'orders' } }
            ]);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }   
    }
}


module.exports = new UserController();



// Q2: Find total order amount per user 

// exports.getTotalOrderAmountPerUser = async (req, res) => {
//     try {
//         const data = await User.aggregate([
//             { $lookup: { from: 'orders', localField: '_id', foreignField: 'userId', as: 'orders' } }, // [cite: 18]
//             { $project: { _id: 0, userName: "$name", totalAmount: { $sum: "$orders.totalAmount" } } } // [cite: 19, 20]
//         ]);
//         res.json(data);
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // Q3: Find users who never placed an order 

// exports.getUsersWithNoOrders = async (req, res) => {
//     try {
//         const data = await User.aggregate([
//             { $lookup: { from: 'orders', localField: '_id', foreignField: 'userId', as: 'orders' } }, 
//             { $match: { orders: { $size: 0 } } } 
//         ]);
//         res.json(data);
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };

// // Q4: Top 5 customers by purchase amount

// exports.getTopCustomers = async (req, res) => {
//     try {
//         const data = await User.aggregate([
//             { $lookup: { from: 'orders', localField: '_id', foreignField: 'userId', as: 'orders' } },
//             { $project: { userName: "$name", totalSpent: { $sum: "$orders.totalAmount" } } }, 
//             { $sort: { totalSpent: -1 } },
//             { $limit: 5 } 
//         ]);
//         res.json(data);
//     } catch (err) { res.status(500).json({ error: err.message }); }
// };