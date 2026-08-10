// require("dotenv").config();


// const express = require('express')
// const ejs = require('ejs')
// const DBCon = require('./app/config/db')


// const app = express();

// DBCon()

// //configure ejs
// // app.set('view engine','ejs')
// // app.set('views','views')

// //static folder
// app.use(express.static('public'))

// // to get data from form and json data from request body
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); //

// //json define
// app.use(express.json())





// const PORT = 2026;

// app.listen(PORT, () => {
//     console.log(`server is running on port ${PORT}`)
// })





const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Added for static files

// 1. Ensure .env is in the ROOT folder
dotenv.config();

console.log("DB URL Check:", process.env.MONGODB_URL ? "Loaded" : "Not Loaded");
console.log("JWT Check:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Static Folder for Images (CRITICAL to view uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routes (Cleaned up the double registration)
app.use('/api/auth', require('./app/routes/authRoutes'));
app.use('/api/products', require('./app/routes/productRoutes'));

// 5. Database Connection
// Add a check to see if the URI is actually there
if (!process.env.MONGODB_URL) {
    console.error("FATAL ERROR: MONGODB_URL is not defined in .env file.");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("  Database Connection Successfully to MongoDB"))
  .catch(err => {
      console.error(" Database Connection Error: ", err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));