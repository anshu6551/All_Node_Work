require ("dotenv").config();


const express = require("express");
const ejs = require("ejs");
const connectDB = require("./app/config/db")


const app = express();


connectDB()

//configure ejs

app.set("view engine", "ejs");
app.set("views", "views");

//static folder

app.use(express.static("public"));

app.use(express.json())

const ProductRoute = require('./app/routes/ProductRoute')
app.use('/api',ProductRoute)

const PORT = 3009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})