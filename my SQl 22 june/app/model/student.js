const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Student = sequelize.define('student', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: true
})

module.exports = Student;