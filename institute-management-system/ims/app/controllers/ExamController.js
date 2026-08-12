const Exam = require('../models/Exam');
const Batch = require('../models/Batch');

class ExamController {
  constructor() {
    this.createExam = this.createExam.bind(this);
    this.assignMarks = this.assignMarks.bind(this);
    this.getStudentResults = this.getStudentResults.bind(this);
    this.getBatchResults = this.getBatchResults.bind(this);
    this.updateExam = this.updateExam.bind(this);
  }

 
  async createExam(req, res) {
    const { name, batch, date, duration, totalMarks } = req.body;

    if (!name || !batch || !date || !duration || !totalMarks) {
      return res.status(400).json({ success: false, message: 'name, batch, date, duration and totalMarks are required' });
    }

    const batchExists = await Batch.findById(batch);
    if (!batchExists) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const exam = await Exam.create({ name, batch, date, duration, totalMarks, createdBy: req.user._id });

    return res.status(201).json({ success: true, message: 'Exam created', data: exam });
  }

  
  async assignMarks(req, res) {
    const { marks } = req.body; 

    if (!Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ success: false, message: 'marks must be a non-empty array of { student, marksObtained }' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    for (const entry of marks) {
      if (entry.marksObtained > exam.totalMarks) {
        return res.status(400).json({
          success: false,
          message: `marksObtained (${entry.marksObtained}) cannot exceed totalMarks (${exam.totalMarks}) for student ${entry.student}`,
        });
      }
    }

    marks.forEach(({ student, marksObtained }) => {
      const existingIndex = exam.marks.findIndex((m) => String(m.student) === String(student));
      if (existingIndex >= 0) {
        exam.marks[existingIndex].marksObtained = marksObtained;
      } else {
        exam.marks.push({ student, marksObtained });
      }
    });

    await exam.save();

    return res.status(200).json({ success: true, message: 'Marks recorded', data: exam });
  }


  async getStudentResults(req, res) {
    const { studentId } = req.params;
    const { batch } = req.query;

    if (req.user.role === 'Student' && String(req.user._id) !== String(studentId)) {
      return res.status(403).json({ success: false, message: 'Students may only view their own results' });
    }

    const filter = {};
    if (batch) filter.batch = batch;

    const exams = await Exam.find(filter).populate('batch', 'name course');

    const results = exams
      .map((exam) => {
        const markEntry = exam.marks.find((m) => String(m.student) === String(studentId));
        if (!markEntry) return null;
        return {
          examId: exam._id,
          examName: exam.name,
          batch: exam.batch,
          date: exam.date,
          marksObtained: markEntry.marksObtained,
          totalMarks: exam.totalMarks,
          percentage: Number(((markEntry.marksObtained / exam.totalMarks) * 100).toFixed(2)),
        };
      })
      .filter(Boolean);

    return res.status(200).json({ success: true, count: results.length, data: results });
  }

 
  async getBatchResults(req, res) {
    const { batchId } = req.params;
    const { examId } = req.query;

    const filter = { batch: batchId };
    if (examId) filter._id = examId;

    const exams = await Exam.find(filter).populate('marks.student', 'name email');

    const data = exams.map((exam) => ({
      examId: exam._id,
      examName: exam.name,
      date: exam.date,
      totalMarks: exam.totalMarks,
      results: exam.marks.map((m) => ({
        student: m.student,
        marksObtained: m.marksObtained,
        percentage: Number(((m.marksObtained / exam.totalMarks) * 100).toFixed(2)),
      })),
    }));

    return res.status(200).json({ success: true, count: data.length, data });
  }

 
  async updateExam(req, res) {
    const { name, date, duration, totalMarks } = req.body;

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (name !== undefined) exam.name = name;
    if (date !== undefined) exam.date = date;
    if (duration !== undefined) exam.duration = duration;
    if (totalMarks !== undefined) exam.totalMarks = totalMarks;

    await exam.save();

    return res.status(200).json({ success: true, message: 'Exam updated', data: exam });
  }
}

module.exports = new ExamController();
