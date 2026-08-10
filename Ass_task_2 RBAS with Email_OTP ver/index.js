// 1. Sabse pehle environment variables load hone chahiye!
require('dotenv').config(); 



const express = require('express');
const connectDB = require('./app/config/db');
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');

// Connect to Database
connectDB();

const app = express();

// Body parser middleware (to handle JSON payloads)
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send('Role Based Project is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});