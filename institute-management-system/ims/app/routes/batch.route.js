const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const authCheckMiddleware = require('../middlewares/authCheckMiddleware');
const batchController = require('../controllers/BatchController');

router.use(authMiddleware);

router.get('/', asyncHandler(batchController.listBatches));
router.post('/', authCheckMiddleware('Admin', 'Teacher'), asyncHandler(batchController.addBatch));
router.put('/:id', authCheckMiddleware('Admin', 'Teacher'), asyncHandler(batchController.updateBatch));
router.delete('/:id', authCheckMiddleware('Admin'), asyncHandler(batchController.deleteBatch));
router.post('/:id/assign-students', authCheckMiddleware('Admin'), asyncHandler(batchController.assignStudentsToBatch));

module.exports = router;
