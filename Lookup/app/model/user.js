

// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true }
// });

// module.exports = mongoose.model('User', UserSchema);



const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  salary: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);


























//Order.js

// const OrderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//     totalAmount: Number,
//     createdAt: { type: Date, default: Date.now }
// });
// module.exports = mongoose.model('Order', OrderSchema);