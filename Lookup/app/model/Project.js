const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  budget: { type: Number, required: true },
  status: { type: String, enum: ['active', 'completed'], required: true }
});

module.exports = mongoose.model('Project', ProjectSchema);