const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Product name is required'] 
    },
    description: { 
        type: String 
    },
    price: { 
        type: Number, 
        required: [true, 'Product price is required'] 
    },
    category: { 
        type: String 
    },
    inStock: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Product', ProductSchema);