const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true
    },
    phone :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    image :{
        type : String,
        // required : true
        default : "https://ambraee.com/cdn/shop/files/JBL07574.jpg?v=1736702438&width=1080"
    },
    role :{
        type : String,
        enum : ["employee", "admin", "manager"],
        default : "employee",
        required:"true"
    },
    isVarified :{
        type : Boolean,
        default : false
    },
    isBlocked :{
        type : Boolean,
        default : false
    },
});


const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;