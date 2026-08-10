// const Product = require('../models/Product');

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, color, size } = req.body;
//     const productData = {
//       name,
//       description,
//       price,
//       color: color ? color.split(',') : [], // Convert string to array
//       size: size ? size.split(',') : [],
//       user: req.user.id
//     };

//     if (req.file) {
//       productData.image = req.file.path; // Local path
//     }

//     const product = await Product.create(productData);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ user: req.user.id, isDeleted: false });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getSingleProduct = async (req, res) => {
//   try {
//     const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     let product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Not found" });

//     if (req.file) req.body.image = req.file.path;
    
//     product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.softDeleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
    
//     product.isDeleted = true;
//     await product.save();
//     res.json({ message: "Moved to trash" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.restoreProduct = async (req, res) => {
//   try {
//     // const product = await Product.findOneAndUpdate(
//     //   { _id: req.params.id, isDeleted: true },
//     //   { isDeleted: false },
//     //   { new: true }

//     // THIS WILL FAIL IF THE MIDDLEWARE IS ACTIVE
// const product = await Product.findOneAndUpdate(
//   { _id: req.params.id, isDeleted: true }, 
//   { isDeleted: false }
// );
    
//     if (!product) return res.status(404).json({ message: "Product not in trash" });
//     res.json({ message: "Product restored", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.permanentDelete = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Permanently deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




// const Product = require('../models/Product');

// // @desc    Create a new product
// // @route   POST /api/products
// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price, color, size } = req.body;
    
//     const productData = {
//       name,
//       description,
//       price,
//       // Handle array conversion if sent as strings from form-data
//       color: typeof color === 'string' ? color.split(',') : color,
//       size: typeof size === 'string' ? size.split(',') : size,
//       user: req.user.id
//     };

//     // If Multer successfully uploaded an image, save the path
//     if (req.file) {
//       productData.image = req.file.path;
//     }

//     const product = await Product.create(productData);
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Get all active products for logged-in user
// // @route   GET /api/products
// exports.getProducts = async (req, res) => {
//   try {
//     // Note: The 'isDeleted: false' filter is handled automatically by Model Middleware
//     const products = await Product.find({ user: req.user.id });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Get single product
// // @route   GET /api/products/:id
// exports.getSingleProduct = async (req, res) => {
//   try {
//     const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Update product
// // @route   PUT /api/products/:id
// exports.updateProduct = async (req, res) => {
//   try {
//     let product = await Product.findOne({ _id: req.params.id, user: req.user.id });
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     // If a new image is uploaded, update the path
//     if (req.file) {
//       req.body.image = req.file.path;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Soft Delete Product (Move to Trash)
// // @route   DELETE /api/products/:id
// exports.softDeleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id },
//       { isDeleted: true },
//       { new: true }
//     );

//     if (!product) return res.status(404).json({ message: "Product not found" });
    
//     res.json({ message: "Product moved to trash" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Restore Product from Trash
// // @route   PATCH /api/products/:id/restore
// // exports.restoreProduct = async (req, res) => {
// //   try {
// //     // IMPORTANT: We use findOneAndUpdate with the isDeleted filter.
// //     // Mongoose query middleware will normally hide isDeleted:true, 
// //     // so we use a regular update or set the middleware to skip.
// //     const product = await Product.findOneAndUpdate(
// //       { _id: req.params.id, user: req.user.id, isDeleted: true },
// //       { isDeleted: false },
// //       { new: true }
// //     ).setOptions({ skipMiddleware: true }); // Bypasses the filter in Product.js

// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found in trash" });
// //     }

// //     res.json({ message: "Product restored successfully", product });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// exports.restoreProduct = async (req, res) => {
//   try {
//     // 1. Find the product including deleted ones
//     const product = await Product.findOne({ 
//       _id: req.params.id, 
//       isDeleted: true 
//     }).setOptions({ skipMiddleware: true });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found in trash" });
//     }

//     // 2. Manually change the status and save
//     product.isDeleted = false;
//     await product.save();

//     res.json({ message: "Product restored successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // @desc    Permanently delete from DB
// // @route   DELETE /api/products/:id/force
// exports.permanentDelete = async (req, res) => {
//   try {
//     const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id })
//                                  .setOptions({ skipMiddleware: true });
                                 
//     if (!product) return res.status(404).json({ message: "Product not found" });
    
//     res.json({ message: "Product permanently removed from database" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




const Product = require('../models/Product');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, color, size } = req.body;
    
    const productData = {
      name,
      description,
      price,
      // Handle array conversion for form-data inputs
      color: typeof color === 'string' ? color.split(',') : color,
      size: typeof size === 'string' ? size.split(',') : size,
      user: req.user.id
    };

    if (req.file) {
      productData.image = req.file.path;
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get all active products for the logged-in user
 * @route   GET /api/products
 */
exports.getProducts = async (req, res) => {
  try {
    // Just pass the query object, nothing else
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    // If the error happens here, it's a 500 status
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 */
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Soft Delete (Move to Trash)
 * @route   DELETE /api/products/:id
 */
exports.softDeleteProduct = async (req, res) => {
  try {
    // const product = await Product.findOneAndUpdate(
    //   { _id: req.params.id, user: req.user.id },
    //   { $set: { isDeleted: true } },
    //   { new: true }
    // );
    const product = await Product.findOneAndUpdate(
  { _id: req.params.id, isDeleted: true }, // Removed user: req.user.id
  { $set: { isDeleted: false } },
  { new: true }
).setOptions({ skipMiddleware: true });

    if (!product) return res.status(404).json({ message: "Product not found" });
    
    res.json({ message: "Product moved to trash successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Restore Product from Trash
 * @route   PATCH /api/products/:id/restore
 */
// exports.restoreProduct = async (req, res) => {
//   try {
//     // We use findOneAndUpdate + skipMiddleware to find the hidden 'isDeleted: true' doc
//     const product = await Product.findOneAndUpdate(
//       { _id: req.params.id, user: req.user.id, isDeleted: true },
//       { $set: { isDeleted: false } },
//       { new: true }
//     ).setOptions({ skipMiddleware: true }); 

//     if (!product) {
//       return res.status(404).json({ message: "Product not found in trash" });
//     }

//     res.json({ message: "Product restored successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

/**
 * @desc    Permanently delete from DB
 * @route   DELETE /api/products/:id/force
 */


// exports.restoreProduct = async (req, res) => {
//   try {
//     // We use findOne with a raw query to bypass everything
//     const product = await Product.findOne({ 
//       _id: req.params.id 
//     }).setOptions({ skipMiddleware: true });

//     if (!product) {
//       return res.status(404).json({ message: "Product ID not found in database at all" });
//     }

//     if (!product.isDeleted) {
//       return res.status(400).json({ message: "Product is already active (not in trash)" });
//     }

//     // Manually update and save
//     product.isDeleted = false;
//     await product.save();

//     res.json({ message: "Product restored successfully", product });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };





exports.restoreProduct = async (req, res) => {
  try {
    // We use .setOptions({ skipMiddleware: true }) to bypass the filter in Product.js
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true },
      { $set: { isDeleted: false } },
      { new: true }
    ).setOptions({ skipMiddleware: true }); 

    if (!product) {
      return res.status(404).json({ message: "Product not found in trash" });
    }

    res.json({ message: "Product restored successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






exports.permanentDelete = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    }).setOptions({ skipMiddleware: true });
                                 
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    res.json({ message: "Product permanently removed from database" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};