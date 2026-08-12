const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

class EnrollmentController {
  constructor() {
    this.enrollStudent = this.enrollStudent.bind(this);
    this.listEnrollments = this.listEnrollments.bind(this);
  }

  async enrollStudent(req, res) {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ success: false, message: 'studentId and courseId are required' });
    }

    if (req.user.role === 'Student' && String(req.user._id) !== String(studentId)) {
      return res.status(403).json({ success: false, message: 'Students may only enroll themselves' });
    }

    const [student, course] = await Promise.all([
      User.findOne({ _id: studentId, role: 'Student' }),
      Course.findById(courseId),
    ]);

    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const existing = await Enrollment.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student is already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ student: studentId, course: courseId });

    return res.status(201).json({ success: true, message: 'Enrollment successful', data: enrollment });
  }

 
  async listEnrollments(req, res) {
    const { student, course, batch } = req.query;
    const filter = {};
    if (student) filter.student = student;
    if (course) filter.course = course;
    if (batch) filter.batch = batch;

    const enrollments = await Enrollment.find(filter)
      .populate('student', 'name email')
      .populate('course', 'name')
      .populate('batch', 'name');

    return res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  }
}

module.exports = new EnrollmentController();
