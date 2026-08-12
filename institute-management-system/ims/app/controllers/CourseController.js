const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Enrollment = require('../models/Enrollment');

class CourseController {
  constructor() {
    this.addCourse = this.addCourse.bind(this);
    this.editCourse = this.editCourse.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.listCourses = this.listCourses.bind(this);
    this.getCourseById = this.getCourseById.bind(this);
  }

 
  async addCourse(req, res) {
    const { name, description, duration, fees } = req.body;

    if (!name || !duration || fees === undefined) {
      return res.status(400).json({ success: false, message: 'name, duration and fees are required' });
    }

    const course = await Course.create({
      name,
      description,
      duration,
      fees,
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, message: 'Course created', data: course });
  }

  
  async editCourse(req, res) {
    const { name, description, duration, fees, isActive } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (name !== undefined) course.name = name;
    if (description !== undefined) course.description = description;
    if (duration !== undefined) course.duration = duration;
    if (fees !== undefined) course.fees = fees;
    if (isActive !== undefined) course.isActive = isActive;

    await course.save();

    return res.status(200).json({ success: true, message: 'Course updated', data: course });
  }

  async deleteCourse(req, res) {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await course.deleteOne();

    return res.status(200).json({ success: true, message: 'Course deleted' });
  }


 
  async listCourses(req, res) {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const [totalBatches, totalEnrolled] = await Promise.all([
          Batch.countDocuments({ course: course._id }),
          Enrollment.countDocuments({ course: course._id, status: 'active' }),
        ]);
        return { ...course, totalBatches, totalEnrolledStudents: totalEnrolled };
      })
    );

    return res.status(200).json({ success: true, count: coursesWithStats.length, data: coursesWithStats });
  }

  
  async getCourseById(req, res) {
    const course = await Course.findById(req.params.id).lean();
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const [totalBatches, totalEnrolled] = await Promise.all([
      Batch.countDocuments({ course: course._id }),
      Enrollment.countDocuments({ course: course._id, status: 'active' }),
    ]);

    return res.status(200).json({
      success: true,
      data: { ...course, totalBatches, totalEnrolledStudents: totalEnrolled },
    });
  }
}

module.exports = new CourseController();
