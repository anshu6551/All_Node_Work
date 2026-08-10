const express = require('express');
const router = express.Router();
const { listTheatersForMovie, bookTickets, cancelBooking, getBookingHistory } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Public Route (No protection needed)
router.get('/movie/:movieId', listTheatersForMovie);

// 🎟️ 1. Book Tickets Endpoint
router.post('/book', protect, (req, res) => {
  /* #swagger.summary = 'Book a movie ticket'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: {
           "application/json": {
              schema: {
                 type: "object",
                 properties: {
                    movieId: { type: "string", example: "6a513735821d33d1cb4f452b" },
                    theaterId: { type: "string", example: "6a51379b821d33d1cb4f452e" },
                    showTiming: { type: "string", example: "05:20" },
                    ticketsBooked: { type: "string", example: "4" },
                    screenNumber: { type: "number", example: 2 }
                 },
                 required: ["movieId", "theaterId", "showTiming", "ticketsBooked"]
              }
           }
        }
     } 
  */
  bookTickets(req, res);
});

// ❌ 2. Cancel Booking Endpoint
router.put('/cancel/:id', protect, (req, res) => {
  /* #swagger.summary = 'Cancel an existing booking'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The Booking ID to cancel',
        required: true,
        type: 'string'
     }
  */
  cancelBooking(req, res);
});

// 📜 3. Booking History Endpoint
router.get('/history', protect, (req, res) => {
  /* #swagger.summary = 'Get user booking history'
     #swagger.security = [{ "bearerAuth": [] }]
  */
  getBookingHistory(req, res);
});

module.exports = router;