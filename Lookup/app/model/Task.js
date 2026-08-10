const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['pending', 'completed'], required: true },
  hoursWorked: { type: Number, required: true }
});

module.exports = mongoose.model('Task', TaskSchema);