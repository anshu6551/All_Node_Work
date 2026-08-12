const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/', reminderController.setReminder);
router.put('/:id', reminderController.editReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;