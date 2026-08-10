const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, // duplicate name not allow
        minlength: [3, "Product name must be at least 3 characters"] // Product name must 3 chr 
    },
    size: { 
        type: [String], 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    color: { 
        type: [String], 
        required: true 
    },
    desc: { 
        type: String, 
        required: true,
        minlength: [20, "Product desc must be at least 20 characters"] // Product desc must 20 chr
    },
    image: { 
        type: String,
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    isDelete: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Product', ProductSchema);