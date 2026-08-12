const verificationEmailTemplate = (name, verificationUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2>Welcome to the Institute, ${name}!</h2>
    <p>Please verify your email address to activate your account.</p>
    <p>
      <a href="${verificationUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;
        text-decoration:none;border-radius:6px;display:inline-block;">
        Verify Email
      </a>
    </p>
    <p>Or copy this link into your browser: ${verificationUrl}</p>
    <p>This link expires in 24 hours.</p>
  </div>
`;

const studentReportEmailTemplate = (student, report) => `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto;">
    <h2>Performance Report - ${student.name}</h2>
    <p><strong>Email:</strong> ${student.email}</p>

    <h3>Attendance Summary</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <tr style="background:#f3f4f6;">
        <th>Course</th>
        <th>Batch</th>
        <th>Total Classes</th>
        <th>Present</th>
        <th>Absent</th>
        <th>Attendance %</th>
      </tr>
      ${report.attendance
        .map(
          (a) => `
        <tr>
          <td>${a.courseName}</td>
          <td>${a.batchName}</td>
          <td>${a.totalClasses}</td>
          <td>${a.present}</td>
          <td>${a.absent}</td>
          <td>${a.percentage}%</td>
        </tr>`
        )
        .join('')}
    </table>

    <h3 style="margin-top:24px;">Exam Performance</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <tr style="background:#f3f4f6;">
        <th>Exam</th>
        <th>Batch</th>
        <th>Marks Obtained</th>
        <th>Total Marks</th>
        <th>Percentage</th>
      </tr>
      ${report.exams
        .map(
          (e) => `
        <tr>
          <td>${e.examName}</td>
          <td>${e.batchName}</td>
          <td>${e.marksObtained}</td>
          <td>${e.totalMarks}</td>
          <td>${e.percentage}%</td>
        </tr>`
        )
        .join('')}
    </table>

    <p style="margin-top:24px;">
      <strong>Overall Attendance:</strong> ${report.overallAttendancePercentage}%<br/>
      <strong>Overall Average Marks:</strong> ${report.overallAverageMarks}%
    </p>
  </div>
`;

module.exports = { verificationEmailTemplate, studentReportEmailTemplate };
