const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const DBCon = require('./app/config/db');
const userRoutes = require('./app/routes/authRoutes')
const productRoutes = require('./app/routes/productRoutes')

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))


DBCon()




app.use('/api',userRoutes);
app.use('/api',productRoutes);

app.get('/', (req,res)=>{
       res.send("Welcome to Authentication")
  })


const PORT = process.env.PORT || 3000

app.listen(PORT , () => console.log(`The Port is Running on ${PORT}`))