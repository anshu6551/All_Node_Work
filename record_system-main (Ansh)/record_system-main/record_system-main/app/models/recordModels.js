const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const RecordSchema = new Schema({
    heading :{
        type : String,
        default : "abc"
    },
    
    content :{
        type : String,
        default : "New Version"
    },
    createdBy :{
        type : String,
        default : "abc"
    },
    
    isVarified :{
        type : Boolean,
        default : false
    },

    isDeleted :{
        type : Boolean,
        default : false
    },
}, {
    timestamps: true,
    versionKey: false

})


const RecordModel = mongoose.model('Record', RecordSchema)

module.exports = RecordModel;