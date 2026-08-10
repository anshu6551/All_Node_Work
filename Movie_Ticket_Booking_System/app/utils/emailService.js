const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  // Configured to match the singular /api/user routing structure
  const url = `http://localhost:${process.env.PORT || 5000}/api/user/verify/${token}`;
  
  await transporter.sendMail({
    from: '"Ticket Booking" <no-reply@ticketbooking.com>',
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`
  });
};

const sendBookingTableEmail = async (email, bookings) => {
  let rows = bookings.map(b => `
    <tr>
      <td>${b.movie.name}</td>
      <td>${b.theater.name}</td>
      <td>${b.showTiming}</td>
      <td>${b.ticketsBooked}</td>
      <td>${b.status}</td>
    </tr>`).join('');

  const htmlContent = `
    <h3>Your Booking History Summary</h3>
    <table border="1" cellpadding="5" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Movie</th><th>Theater</th><th>Timing</th><th>Tickets</th><th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;

  await transporter.sendMail({
    from: '"Ticket Booking" <no-reply@ticketbooking.com>',
    to: email,
    subject: 'Your Booking Summary Report',
    html: htmlContent
  });
};

module.exports = { sendVerificationEmail, sendBookingTableEmail };