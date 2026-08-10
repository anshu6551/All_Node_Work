const express = require('express');
const ejs = require('ejs')
const DBCon = require('./app/config/db')

DBCon() 

const app = express(); 



app.use(express.json()) 

app.set('view engine', 'ejs');    
app.set('views', './app/views');

app.use('/api/employees',require('./app/routes/empRoute'))

// define routes
app.get('/', (req, res) => {
    res.send('Aggregation')
})

const PORT = 3009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});