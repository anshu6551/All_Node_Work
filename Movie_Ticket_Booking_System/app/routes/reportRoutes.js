const express = require('express');
const router = express.Router();
const { getMovieBookingReport, getTheaterBookingReport, emailSummaryToUser } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// 📊 1. Movies Summary Report
router.get('/movies-summary', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Get movie booking summary report (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  getMovieBookingReport(req, res);
});

// 🏛️ 2. Theaters Summary Report
router.get('/theaters-summary', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Get theater booking summary report (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }] 
  */
  getTheaterBookingReport(req, res);
});

// 📧 3. Email Summary to User
router.post('/email-summary', protect, (req, res) => {
  /* #swagger.summary = 'Email summary report to user'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: {
           "application/json": {
              schema: {
                 type: "object",
                 properties: {
                    email: { type: "string", example: "user@example.com" }
                 },
                 required: ["email"]
              }
           }
        }
     }
  */
  emailSummaryToUser(req, res);
});

module.exports = router;