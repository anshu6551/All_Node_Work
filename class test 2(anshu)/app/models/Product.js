const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  color: [String],
  size: [String],
  isDeleted: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// CORRECTED MIDDLEWARE
// Use a standard function (not arrow function) to keep 'this' context
// models/Product.js

// This handles: find, findOne, findOneAndUpdate, findOneAndDelete, etc.
productSchema.pre(/^find/, function () {
  // Use 'this' to refer to the current query
  // We don't use 'next' here to avoid the "not a function" error
  this.where({ isDeleted: false });
});


module.exports = mongoose.model('Product', productSchema);