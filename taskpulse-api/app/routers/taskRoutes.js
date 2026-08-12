const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.post('/', taskController.addTask);
router.get('/', taskController.listTasks);
router.put('/reorder', taskController.reorderTasks);
router.put('/:id', taskController.editTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/complete', taskController.markCompleted);

module.exports = router;