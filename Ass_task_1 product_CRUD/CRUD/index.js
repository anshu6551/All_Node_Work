
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./app/config/db');


dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Body parser middleware (to handle JSON payloads)
app.use(express.json());

// Mount Routes
app.use('/api/products', require('./app/routes/product'));


app.get('/', (req, res) => {
    res.send('Product CRUD API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});