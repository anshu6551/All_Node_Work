

require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./app/config/db');

const app = express();

// Connect to Database
connectDB();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Session Middleware for Testing Roles (Change to 'Admin' or 'User' to test restrictions)
app.use((req, res, next) => {
  req.user = {
    _id: "65f1a2b3c4d5e6f7a8b9c0d1",
    name: "Anshu Test",
    roleName: "Super Admin" 
  };
  next();
});

// Routes
app.use('/dashboard', require('./app/routes/dashboardRoutes'));
app.use('/dashboard/users', require('./app/routes/userRoutes'));
app.use('/dashboard/products', require('./app/routes/productRoutes'));
app.use('/dashboard/categories', require('./app/routes/categoryRoutes'));

// Redirect root to dashboard
app.get('/', (req, res) => res.redirect('/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));