const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
       
    }
};

module.exports = connectDB;