const express = require('express');
const ejs = require('ejs')

const app = express(); // express all functionality is stored in app variable



//congiguring ejs
app.set('view engine', 'ejs')
app.set('views','views')

 //static folder
app.use(express.static('public'))

// define routes
const homeRoutes = require('./app/routes/home.routes');
app.use(homeRoutes);

const productRoutes = require('./app/routes/product.routes');
app.use(productRoutes); 



// app.get('/portfolio',(req,res)=>{
//     res.send('<h1>portfolio page</h1>')
// })

// app.get('/sevices',(req,res)=>{
//     res.send('<h1>Services page</h1>')
// })

// app.get('/details',(req,res)=>{
//     res.send('<h1>details page</h1>')
// })

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});