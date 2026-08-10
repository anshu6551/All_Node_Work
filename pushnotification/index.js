// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.set("view engine", "ejs");
// app.set("views", "views");
// app.use(express.urlencoded({ extended: true }));

// const products = [];

// app.get("/admin", (req, res) => {
//     res.render("admin");
// });

// app.get("/user", (req, res) => {
//     res.render("user", { products });
// });

// app.post("/product", (req, res) => {

//     const product = {
//         id: Date.now(),
//         name: req.body.name,
//         price: req.body.price
//     };

//     products.push(product);

//     io.emit("newProduct", product);
    

//     res.redirect("/admin");
// });


// io.on("connection", (socket) => {

//     console.log("Connected socket :", socket.id);

//     socket.on("disconnect", () => {
//         console.log("Disconnected");
//     });

// });

// server.listen(3000, () => {
//     console.log("Server Running at http://localhost:3000");
// });
















// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // In-memory data store for testing
// const products = [];

// // Routes
// app.get('/user', (req, res) => {
//     res.render('user', { products });
// });

// app.get('/admin', (req, res) => {
//     res.render('admin');
// });

// // New page route showing all products
// app.get('/all-products', (req, res) => {
//     res.render('all-products', { products });
// });

// // Socket.io Connection Logic
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     socket.on('admin-add-product', (productData) => {
//         // Add timestamp or unique ID if needed
//         const newProduct = {
//             name: productData.name,
//             price: productData.price,
//             addedAt: new Date().toLocaleTimeString()
//         };
//         products.push(newProduct);
        
//         // Broadcast the specific product details alongside total count
//         io.emit('product-notification', {
//             product: newProduct,
//             totalProducts: products.length
//         });
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server running smoothly on http://localhost:${PORT}`);
// });

















const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Added fs to auto-generate folders if missing

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Safe check: Automatically create the uploads folder if you accidentally delete it
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Configure Multer for Image Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // FIXED: Using safe absolute path mapping
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// In-memory data store
const products = [];

// Routes
app.get('/user', (req, res) => {
    res.render('user', { products });
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/all-products', (req, res) => {
    res.render('all-products', { products });
});

// Post route to handle form submit with image
app.post('/admin/add-product', upload.single('productImage'), (req, res) => {
    const { name, price } = req.body;
    
    // NOTE: Make sure a dummy "default.png" file actually exists inside your /uploads folder!
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png'; 

    const newProduct = {
        name,
        price,
        image: imagePath,
        addedAt: new Date().toLocaleTimeString()
    };

    products.push(newProduct);

    // Broadcast the new product details with its image path to all users
    io.emit('product-notification', {
        product: newProduct,
        totalProducts: products.length
    });

    res.status(200).json({ success: true, message: "Product successfully created!" });
});

// Socket connection just for tracking logs now
io.on('connection', (socket) => {
    console.log('Client connected to real-time sync channel:', socket.id);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});