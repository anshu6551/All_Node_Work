 require ("dotenv").config();

 
const express=require('express')
const ejs=require('ejs')
const DBCon=require('./app/config/db')


const app=express();

DBCon()

//configure ejs
app.set('view engine','ejs')
app.set('views','views')

//static folder
app.use(express.static('public'))

// to get data from form and json data from request body
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); //

//json define
app.use(express.json())

//define routes
// student api routes
const ApiRoutes=require('./app/routes/ApiRoute')
app.use('/api',ApiRoutes)


//ejs routes
const routerejs = require('./app/routes/crud.EJS.router');
app.use(routerejs);



const PORT=2026;

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})