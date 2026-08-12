const Attendance = require('../models/Attendance');
const Batch = require('../models/Batch');
const Enrollment = require('../models/Enrollment');

class AttendanceController {
  constructor() {
    this.markAttendance = this.markAttendance.bind(this);
    this.getStudentAttendance = this.getStudentAttendance.bind(this);
    this.getBatchAttendance = this.getBatchAttendance.bind(this);
  }

 
  async markAttendance(req, res) {
    const { batchId, date, presentStudentIds = [], absentStudentIds = [] } = req.body;

    if (!batchId || !date) {
      return res.status(400).json({ success: false, message: 'batchId and date are required' });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const records = [
      ...presentStudentIds.map((student) => ({ student, status: 'present' })),
      ...absentStudentIds.map((student) => ({ student, status: 'absent' })),
    ];

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { batch: batchId, date: day },
      { batch: batchId, date: day, records, markedBy: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({ success: true, message: 'Attendance recorded', data: attendance });
  }

  
  async getStudentAttendance(req, res) {
    const { studentId } = req.params;
    const { course, batch } = req.query;

    if (req.user.role === 'Student' && String(req.user._id) !== String(studentId)) {
      return res.status(403).json({ success: false, message: 'Students may only view their own attendance' });
    }

    const batchFilter = {};
    if (batch) batchFilter._id = batch;
    if (course) batchFilter.course = course;

    let batchIds = [];
    if (batch || course) {
      const batches = await Batch.find(batchFilter).select('_id');
      batchIds = batches.map((b) => b._id);
    }

    const attendanceFilter = { 'records.student': studentId };
    if (batchIds.length) attendanceFilter.batch = { $in: batchIds };

    const attendanceEntries = await Attendance.find(attendanceFilter).populate('batch', 'name course').sort({ date: 1 });

    let present = 0;
    let absent = 0;
    const history = [];

    attendanceEntries.forEach((entry) => {
      const record = entry.records.find((r) => String(r.student) === String(studentId));
      if (record) {
        if (record.status === 'present') present += 1;
        else absent += 1;
        history.push({ date: entry.date, batch: entry.batch, status: record.status });
      }
    });

    const total = present + absent;
    const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      success: true,
      data: { studentId, totalClasses: total, present, absent, attendancePercentage: percentage, history },
    });
  }


  async getBatchAttendance(req, res) {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const [attendanceEntries, enrollments] = await Promise.all([
      Attendance.find({ batch: batchId }),
      Enrollment.find({ batch: batchId, status: 'active' }).populate('student', 'name email'),
    ]);

    const totalsByStudent = {};
    enrollments.forEach((e) => {
      totalsByStudent[e.student._id] = { student: e.student, present: 0, absent: 0 };
    });

    attendanceEntries.forEach((entry) => {
      entry.records.forEach((r) => {
        if (!totalsByStudent[r.student]) return;
        if (r.status === 'present') totalsByStudent[r.student].present += 1;
        else totalsByStudent[r.student].absent += 1;
      });
    });

    const report = Object.values(totalsByStudent).map((entry) => {
      const total = entry.present + entry.absent;
      const percentage = total > 0 ? Number(((entry.present / total) * 100).toFixed(2)) : 0;
      return {
        student: entry.student,
        totalClasses: total,
        present: entry.present,
        absent: entry.absent,
        attendancePercentage: percentage,
      };
    });

    return res.status(200).json({ success: true, batchId, totalSessions: attendanceEntries.length, data: report });
  }
}

module.exports = new AttendanceController();
