const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    color:{type:[String],required:true},
    size:{type:[String],enum:['s', 'm', 'l', 'xl', 'xxl']},
    isDelted:{type:Boolean,default:false},
    createdAt:{ type: Date, default: Date.now },
})


module.exports = mongoose.model('productModels',productSchema)