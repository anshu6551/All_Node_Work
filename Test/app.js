const express = require('express');
const dotenv = require('dotenv');
const dbCon = require('./app/config/db');






dotenv.config();
dbCon();

const app = express()
app.use(express.json())

app.use('/',(req,res)=>{
  res.send ("Runing")
})

const PORT = 5000;
app.listen(PORT , ()=>{
console.log(`port is runing on ${PORT}`)
})