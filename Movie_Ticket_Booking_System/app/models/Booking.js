const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  showTiming: {
    type: String,
    required: true
  },
  screenNumber: {
    type: Number,
    required: true
  },
  ticketsBooked: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Booked', 'Cancelled'],
    default: 'Booked'
  }
},
  { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);