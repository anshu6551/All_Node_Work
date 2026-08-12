const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Enrollment = require('../models/Enrollment');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { studentReportEmailTemplate } = require('../utils/emailTemplates');

class ReportController {
  constructor() {
    this.coursesWithEnrollments = this.coursesWithEnrollments.bind(this);
    this.batchPerformanceReport = this.batchPerformanceReport.bind(this);
    this.studentPerformanceReport = this.studentPerformanceReport.bind(this);
    this.emailStudentReport = this.emailStudentReport.bind(this);
  }

  
  async _buildStudentPerformance(studentId, batchId = null) {
    const enrollmentFilter = { student: studentId, status: 'active' };
    if (batchId) enrollmentFilter.batch = batchId;
    const enrollments = await Enrollment.find(enrollmentFilter).populate('course', 'name').populate('batch', 'name');

    const attendanceByBatch = [];
    let totalPresent = 0;
    let totalSessions = 0;

    for (const enrollment of enrollments) {
      if (!enrollment.batch) continue;
      const sessions = await Attendance.find({ batch: enrollment.batch._id });
      let present = 0;
      let absent = 0;
      sessions.forEach((s) => {
        const rec = s.records.find((r) => String(r.student) === String(studentId));
        if (rec) {
          if (rec.status === 'present') present += 1;
          else absent += 1;
        }
      });
      const total = present + absent;
      attendanceByBatch.push({
        courseName: enrollment.course?.name || 'N/A',
        batchName: enrollment.batch?.name || 'N/A',
        totalClasses: total,
        present,
        absent,
        percentage: total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0,
      });
      totalPresent += present;
      totalSessions += total;
    }

    const batchIds = enrollments.map((e) => e.batch?._id).filter(Boolean);
    const exams = await Exam.find({ batch: { $in: batchIds } }).populate('batch', 'name');

    const examResults = [];
    let marksSum = 0;
    let totalPossible = 0;

    exams.forEach((exam) => {
      const markEntry = exam.marks.find((m) => String(m.student) === String(studentId));
      if (markEntry) {
        examResults.push({
          examName: exam.name,
          batchName: exam.batch?.name || 'N/A',
          marksObtained: markEntry.marksObtained,
          totalMarks: exam.totalMarks,
          percentage: Number(((markEntry.marksObtained / exam.totalMarks) * 100).toFixed(2)),
        });
        marksSum += markEntry.marksObtained;
        totalPossible += exam.totalMarks;
      }
    });

    return {
      attendance: attendanceByBatch,
      exams: examResults,
      overallAttendancePercentage: totalSessions > 0 ? Number(((totalPresent / totalSessions) * 100).toFixed(2)) : 0,
      overallAverageMarks: totalPossible > 0 ? Number(((marksSum / totalPossible) * 100).toFixed(2)) : 0,
    };
  }


  async coursesWithEnrollments(req, res) {
    const courses = await Course.find().lean();

    const data = await Promise.all(
      courses.map(async (course) => {
        const totalEnrollments = await Enrollment.countDocuments({ course: course._id, status: 'active' });
        return { courseId: course._id, name: course.name, totalEnrollments };
      })
    );

    return res.status(200).json({ success: true, data });
  }

  
  async batchPerformanceReport(req, res) {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId).populate('course', 'name');
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const enrollments = await Enrollment.find({ batch: batchId, status: 'active' }).populate('student', 'name email');

    const studentReports = await Promise.all(
      enrollments.map(async (enrollment) => {
        const perf = await this._buildStudentPerformance(enrollment.student._id, batchId);
        return {
          student: enrollment.student,
          attendancePercentage: perf.overallAttendancePercentage,
          averageMarksPercentage: perf.overallAverageMarks,
        };
      })
    );

    const batchAvgAttendance =
      studentReports.reduce((sum, s) => sum + s.attendancePercentage, 0) / (studentReports.length || 1);
    const batchAvgMarks =
      studentReports.reduce((sum, s) => sum + s.averageMarksPercentage, 0) / (studentReports.length || 1);

    return res.status(200).json({
      success: true,
      data: {
        batch: { id: batch._id, name: batch.name, course: batch.course?.name },
        totalStudents: studentReports.length,
        batchAverageAttendance: Number(batchAvgAttendance.toFixed(2)),
        batchAverageExamPerformance: Number(batchAvgMarks.toFixed(2)),
        students: studentReports,
      },
    });
  }


  async studentPerformanceReport(req, res) {
    const { studentId } = req.params;

    if (req.user.role === 'Student' && String(req.user._id) !== String(studentId)) {
      return res.status(403).json({ success: false, message: 'Students may only view their own report' });
    }

    const student = await User.findOne({ _id: studentId, role: 'Student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const perf = await this._buildStudentPerformance(studentId);

    return res.status(200).json({
      success: true,
      data: { student: { id: student._id, name: student.name, email: student.email }, ...perf },
    });
  }


  async emailStudentReport(req, res) {
    const { studentId } = req.params;

    if (req.user.role === 'Student' && String(req.user._id) !== String(studentId)) {
      return res.status(403).json({ success: false, message: 'Students may only email their own report' });
    }

    const student = await User.findOne({ _id: studentId, role: 'Student' });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const perf = await this._buildStudentPerformance(studentId);

    await sendEmail({
      to: student.email,
      subject: `Your Performance Report - ${student.name}`,
      html: studentReportEmailTemplate(student, perf),
    });

    return res.status(200).json({ success: true, message: `Performance report emailed to ${student.email}` });
  }
}

module.exports = new ReportController();
