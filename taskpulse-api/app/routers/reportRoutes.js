const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/summary', reportController.getTaskSummary);
router.get('/stats', reportController.getStatistics);

module.exports = router;