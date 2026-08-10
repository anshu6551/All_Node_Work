const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const DBCon = async()=>{
   try{
     mongoose.connect(process.env.MONGODB_URL);
     console.log("MongoDb Connect Successfully")
   }
   catch(err){
     console.log(err)
   }
}
module.exports = DBCon