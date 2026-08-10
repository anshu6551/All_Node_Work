const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validation: "Name is required"
    },
    email: {
        type: String,
        required: true,
        validation: "Emai; is required"
    },
    phone: {
        type: Number,
        required: true,
        validation: "phone no is required"
    },
    password: {
        type: String,
        required: true,
        validation: "Password is required"
    },
    isVerified: {
        type: Boolean,
        required: false
    }

},
{timestamps:true}
)

module.exports = mongoose.model('Auth', userSchema);