const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

class BatchController {
  constructor() {
    this.addBatch = this.addBatch.bind(this);
    this.assignStudentsToBatch = this.assignStudentsToBatch.bind(this);
    this.listBatches = this.listBatches.bind(this);
    this.updateBatch = this.updateBatch.bind(this);
    this.deleteBatch = this.deleteBatch.bind(this);
  }

  
  async addBatch(req, res) {
    const { name, course, startDate, endDate, teacher, schedule } = req.body;

    if (!name || !course || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'name, course, startDate and endDate are required' });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (teacher) {
      const teacherUser = await User.findOne({ _id: teacher, role: 'Teacher' });
      if (!teacherUser) {
        return res.status(400).json({ success: false, message: 'Assigned teacher not found or is not a Teacher' });
      }
    }

    const batch = await Batch.create({ name, course, startDate, endDate, teacher, schedule });

    return res.status(201).json({ success: true, message: 'Batch created', data: batch });
  }


  async assignStudentsToBatch(req, res) {
    const { studentIds } = req.body;

    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'studentIds must be a non-empty array' });
    }

    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const students = await User.find({ _id: { $in: studentIds }, role: 'Student' });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ success: false, message: 'One or more student IDs are invalid' });
    }

    const results = [];
    for (const studentId of studentIds) {
      const enrollment = await Enrollment.findOneAndUpdate(
        { student: studentId, course: batch.course },
        { student: studentId, course: batch.course, batch: batch._id, status: 'active' },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(enrollment);
    }

    return res.status(200).json({ success: true, message: 'Students assigned to batch', data: results });
  }


  async listBatches(req, res) {
    const { course } = req.query;
    const filter = {};
    if (course) filter.course = course;

    const batches = await Batch.find(filter).populate('teacher', 'name email').populate('course', 'name').lean();

    const batchesWithCount = await Promise.all(
      batches.map(async (batch) => {
        const totalStudents = await Enrollment.countDocuments({ batch: batch._id, status: 'active' });
        return { ...batch, totalStudents };
      })
    );

    return res.status(200).json({ success: true, count: batchesWithCount.length, data: batchesWithCount });
  }

  async updateBatch(req, res) {
    const { name, startDate, endDate, teacher, schedule, isActive } = req.body;

    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    if (name !== undefined) batch.name = name;
    if (startDate !== undefined) batch.startDate = startDate;
    if (endDate !== undefined) batch.endDate = endDate;
    if (schedule !== undefined) batch.schedule = schedule;
    if (isActive !== undefined) batch.isActive = isActive;
    if (teacher !== undefined) {
      const teacherUser = await User.findOne({ _id: teacher, role: 'Teacher' });
      if (!teacherUser) {
        return res.status(400).json({ success: false, message: 'Assigned teacher not found or is not a Teacher' });
      }
      batch.teacher = teacher;
    }

    await batch.save();

    return res.status(200).json({ success: true, message: 'Batch updated', data: batch });
  }


  async deleteBatch(req, res) {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    await batch.deleteOne();

    return res.status(200).json({ success: true, message: 'Batch deleted' });
  }
}

module.exports = new BatchController();
