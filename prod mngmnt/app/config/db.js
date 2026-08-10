const mongoose = require('mongoose');


const DBcon = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected");
        
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = DBcon
