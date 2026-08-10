const path = require('path');
const rootDir = path.join(__dirname, '..');

let Product, Category;
try {
  Product = require(path.join(rootDir, 'models', 'Product'));
} catch(e) {
  Product = require(path.join(rootDir, 'models', 'product'));
}

try {
  Category = require(path.join(rootDir, 'models', 'Category'));
} catch(e) {
  Category = require(path.join(rootDir, 'models', 'category'));
}

exports.getProductsPage = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "c" } },
      { $unwind: "$c" },
      { $lookup: { from: "categories", localField: "subcategoryId", foreignField: "_id", as: "s" } },
      { $unwind: "$s" },
      { $project: { name: 1, price: 1, categoryName: "$c.name", subcategoryName: "$s.name" } }
    ]);

    const categories = await Category.find({ parentId: null });
    const subcategories = await Category.find({ parentId: { $ne: null } });

    res.render('dashboard/products', { products, categories, subcategories });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, categoryId, subcategoryId } = req.body;
  const newProduct = new Product({ name, price, categoryId, subcategoryId });
  await newProduct.save();
  res.redirect('/dashboard/products');
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard/products');
};