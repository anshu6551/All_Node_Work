const mongoose = require('mongoose')

const schema = mongoose.Schema;

const studentSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true     
    },
    city:{
        type:String,
        required:true
    }
})
    
const studentModel= mongoose.model('student',studentSchema)

module.exports=studentModel;