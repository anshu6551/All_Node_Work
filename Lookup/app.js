const express = require('express');
const connectDB = require('./app/config/db');
const app = express();

// Connect to MongoDB
connectDB();


// Middleware to parse JSON
app.use(express.json());
// Define routes
// app.use('/api', require('./app/routes/allroutes'));
app.use('/api/dashboard', require('./app/routes/dashboardRoutes'));


app.get('/', (req, res) => {
    res.send('Lookup API is running');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

