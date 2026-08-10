const mongoose = require('mongoose');

const dbCon = async () => {

    try {
        const res = await mongoose.connect(process.env.MONGODB_URL)
        console.log("DB Connected")

    }
    catch (err) {
        console.log(err)
    }
}
module.exports = dbCon