const express = require('express');
const ejs = require('ejs')
const DBCon = require('./app/config/db')

DBCon() // calling the database connection function

const app = express(); // express all functionality is stored in app variable



app.use(express.json()) // to parse incoming JSON data

app.set('view engine', 'ejs');      // Tells Express to use EJS
app.set('views', './app/views');

app.use('/api/employees',require('./app/routes/empRoute'));
app.use('/api/employeesCW',require('./app/routes/empCWRoute'));

// define routes
app.get('/', (req, res) => {
    res.send('Aggregation')
})

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});