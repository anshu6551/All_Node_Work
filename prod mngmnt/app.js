require('dotenv').config();

const express = require('express');
const DBCon = require('./app/config/db');



const app = express();
DBCon();

app.use(express.json());
app.get('/', (req, res) => {
    res.send("Our Product Management System");
});


const PORT = 2027;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});