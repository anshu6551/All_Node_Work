const Task = require('../models/Task');

class TaskController {
  async addTask(req, res) {
    try {
      const task = await Task.create({ ...req.body, userId: req.user.id });
      res.status(201).json({ success: true, task });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async editTask(req, res) {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json({ success: true, task });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async markCompleted(req, res) {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { status: 'Completed', completedAt: new Date() },
        { new: true }
      );
      res.json({ success: true, task });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async listTasks(req, res) {
    try {
      const { status, categoryId, labelId, dueDate } = req.query;
      let filter = { userId: req.user.id };

      if (status) filter.status = status;
      if (categoryId) filter.categoryId = categoryId;
      if (labelId) filter.labels = labelId;

      if (dueDate === 'today') {
        const start = new Date(); start.setHours(0,0,0,0);
        const end = new Date(); end.setHours(23,59,59,999);
        filter.dueDate = { $gte: start, $lte: end };
      }

      const tasks = await Task.find(filter).sort({ order: 1, dueDate: 1 });
      res.json({ success: true, count: tasks.length, tasks });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async reorderTasks(req, res) {
    try {
      const { taskOrders } = req.body;
      const operations = taskOrders.map(item => ({
        updateOne: {
          filter: { _id: item.id, userId: req.user.id },
          update: { order: item.order }
        }
      }));

      await Task.bulkWrite(operations);
      res.json({ success: true, message: 'Tasks reordered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

// Single instance export
module.exports = new TaskController();