const mongoose = require('mongoose');

const EmpSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Employee name is required']
    },
    department: {
        type: String,
        required: [true, 'Employee department is required'] 
    },
    salary: {
        type: Number,
        required: [true, 'Employee salary is required']
    },
    age: {
        type: Number,
        required: [true, 'Employee age is required']
    },
    city: {
        type: String,
        required: [true, 'Employee city is required']       
    },
    joiningDate: {
        type: Date,
        default: Date.now,
        required: [true, 'Employee joining date is required']   

    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: [true, 'Employee status is required']

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Employee', EmpSchema);