const Reminder = require('../models/Reminder');

class ReminderController {
  async setReminder(req, res) {
    try {
      const reminder = await Reminder.create({ ...req.body, userId: req.user.id });
      res.status(201).json({ success: true, reminder });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async editReminder(req, res) {
    try {
      const reminder = await Reminder.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        req.body,
        { new: true }
      );
      if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
      res.json({ success: true, reminder });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteReminder(req, res) {
    try {
      const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
      res.json({ success: true, message: 'Reminder deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ReminderController();