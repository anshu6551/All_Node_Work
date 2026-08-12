const Category = require('../models/Category');
const Label = require('../models/Label');

class CategoryLabelController {
  async addCategory(req, res) {
    try {
      const category = await Category.create({ ...req.body, userId: req.user.id });
      res.status(201).json({ success: true, category });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async editCategory(req, res) {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json({ success: true, category });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!category) return res.status(404).json({ message: 'Category not found' });
      res.json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async addLabel(req, res) {
    try {
      const label = await Label.create({ ...req.body, userId: req.user.id });
      res.status(201).json({ success: true, label });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async listCategoriesAndLabels(req, res) {
    try {
      const categories = await Category.find({ userId: req.user.id });
      const labels = await Label.find({ userId: req.user.id });
      res.json({ success: true, categories, labels });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CategoryLabelController();