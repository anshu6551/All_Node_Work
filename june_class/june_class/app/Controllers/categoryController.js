let Category;
try {
  Category = require('../models/Category');
} catch (e) {
  Category = require('../models/category');
}

exports.getCategoriesPage = async (req, res) => {
  try {
    const categoriesMapped = await Category.aggregate([
      { $match: { parentId: null } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "parentId", as: "subs" } }
    ]);
    
    const plainCategories = await Category.find({ parentId: null });
    res.render('dashboard/categories', { categories: categoriesMapped, plainCategories });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.addCategoryOrSub = async (req, res) => {
  const { name, parentId } = req.body;
  const item = new Category({ name, parentId: parentId || null });
  await item.save();
  res.redirect('/dashboard/categories');
};

exports.deleteCategoryOrSub = async (req, res) => {
  await Category.deleteMany({ $or: [{ _id: req.params.id }, { parentId: req.params.id }] });
  res.redirect('/dashboard/categories');
};