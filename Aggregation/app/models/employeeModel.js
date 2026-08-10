const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({

    name:
    {
        type: String,
        required: true
    },
    department: { 
        type: String,
        required: true 
    },
    salary: { 
        type: Number,
        required: true
     },
    age: { 
        type: Number, 
        required: true },
    skills: [{ 
        type: String
     }],
    address: {
        city: { 
            type: String, 
            required: true },
        state: {
             type: String, 
             required: true }
    },
    projects: [
        {
            
            name: { 
                type: String,
                 required: true },
            status: {
                 type: String,
                  required: true },
            budget: { 
                type: Number, 
                required: true }
        }
    ]
}, {
    versionKey: false
});

const Employee = mongoose.model('Employees', employeeSchema);

module.exports = Employee;