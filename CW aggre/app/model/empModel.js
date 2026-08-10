const mongooose = require('mongoose');

const empSchema = new mongooose.Schema({

name:{
    type: String,
    required: true
},
depaertment:{
    type:String,
    required:true
},
salary:{
    type:Number,
    required:true,
},
age:{
    type:Number,
    required:true
},
// skills:{
//     type:["node.js","MondoDB","Express"],
//     required:true
// } 
// adress:{
//     city:{
//         type:String,
//         required:true
//     },
//     state:{
//         type:String,
//         required:true
//     }
// },
// projects:[
//     {
//         name:{
//             type:String,
//             required:true
//         },
//         status:{
//             type:String,
//             required:true
//         },
//         budget: {
//             type:Number,
//             required:true
//         }
//     },
    
// ],




})
module.exports = mongooose.model('Employee',empSchema);