const express = require('express');
const router = express.Router();
const categoryLabelController = require('../controllers/categoryLabelController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/category', categoryLabelController.addCategory);
router.put('/category/:id', categoryLabelController.editCategory);
router.delete('/category/:id', categoryLabelController.deleteCategory);
router.post('/label', categoryLabelController.addLabel);
router.get('/', categoryLabelController.listCategoriesAndLabels);

module.exports = router;