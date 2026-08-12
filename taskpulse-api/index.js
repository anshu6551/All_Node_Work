const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']) // Forces fallback to Google's public DNS
dns.setDefaultResultOrder('ipv4first');
const express = require("express");
const dotenv = require('dotenv');
dotenv.config();
const dbConnect = require("./app/config/db");
const indexRoutes = require('./app/routers/indexRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');


dbConnect();
const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());


app.use('/api', indexRoutes);


app.get('/',(req,res)=>{
   res.send("TaskPulse");
})


const PORT = 5000

app.listen(PORT , ()=>{
    console.log(`Localhost running on PORT ${PORT}`)
})