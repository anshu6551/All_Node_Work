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



