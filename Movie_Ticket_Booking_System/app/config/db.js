const mongoose = require('mongoose');
const dbConfig=async()=>{
    try{
      const db= await mongoose.connect(process.env.MONGODB_URL)
      if(db){
        console.log("database connected");
      }else{
        console.log("database not connected");
      }

    }catch(err){
        console.log(err);
    }
}

module.exports=dbConfig;