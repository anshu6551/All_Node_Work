const Task = require('../models/Task');

class ReportController {
  async getTaskSummary(req, res) {
    try {
      const userId = req.user.id;
      const total = await Task.countDocuments({ userId });
      const completed = await Task.countDocuments({ userId, status: 'Completed' });
      const pending = await Task.countDocuments({ userId, status: 'Pending' });

      res.json({ success: true, summary: { total, completed, pending } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStatistics(req, res) {
    try {
      const userId = req.user.id;
      const total = await Task.countDocuments({ userId });
      const completed = await Task.countDocuments({ userId, status: 'Completed' });
      const rate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

      res.json({ 
        success: true, 
        statistics: { completionRate: `${rate}%`, totalTasks: total, completedTasks: completed } 
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ReportController();