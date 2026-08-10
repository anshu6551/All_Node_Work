
require('dotenv').config(); 



const express = require('express');
const connectDB = require('./app/config/db');


connectDB();

const app = express();


app.use(express.json());

// // Mount Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
    res.send('MondoDb Database with Collections');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});