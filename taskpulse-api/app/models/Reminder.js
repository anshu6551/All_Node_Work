const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  remindAt: { type: Date, required: true },
  type: { type: String, enum: ['one-time', 'daily', 'weekly'], default: 'one-time' },
  isSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);