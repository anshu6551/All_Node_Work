const mongoose = require('mongoose');

const DBCon = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
            
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = DBCon;