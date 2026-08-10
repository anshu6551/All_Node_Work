// const express = require('express');
// const router = express.Router();

// // Import the product logic
// const { 
//     createProduct, 
//     getProducts, 
//     getSingleProduct, 
//     updateProduct, 
//     softDeleteProduct, 
//     restoreProduct, 
//     permanentDelete 
// } = require('../controller/productController');

// // Import Auth Middleware to protect these routes
// const { protect } = require('../middleware/authMiddleware');

// // Import Multer for product image uploads
// const upload = require('../middleware/multer');

// // --- ROUTES ---

// // 1. Create a product (Protected + Image Upload)
// router.post('/', protect, upload.single('image'), createProduct);

// // 2. Get all products (Protected - only shows non-deleted ones)
// router.get('/', protect, getProducts);

// // 3. Get single product by ID
// router.get('/:id', protect, getSingleProduct);

// // 4. Update product (Protected + Optional Image Upload)
// router.put('/:id', protect, upload.single('image'), updateProduct);

// // 5. Soft Delete (Move to trash)
// router.delete('/:id', protect, softDeleteProduct);

// // 6. Restore Product (Bring back from trash)
// router.patch('/:id/restore', protect, restoreProduct);

// // 7. Permanent Delete (Hard delete from Database)
// router.delete('/:id/force', protect, permanentDelete);

// module.exports = router;



const express = require('express');
const router = express.Router();
const { 
    createProduct, 
    getProducts, 
    getSingleProduct, 
    updateProduct, 
    softDeleteProduct, 
    restoreProduct, 
    permanentDelete 
} = require('../controller/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

// All product routes are protected in this scope
router.use(protect);

// Standard CRUD
router.post('/', upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/:id', getSingleProduct);
router.put('/:id', upload.single('image'), updateProduct);

// Soft Delete & Trash Management
router.delete('/:id', softDeleteProduct);           // Moves to trash (isDeleted: true)
router.patch('/:id/restore', restoreProduct);       // Restores (isDeleted: false)
router.delete('/:id/force', permanentDelete);       // Hard delete from DB

module.exports = router;