const mongoose = require('mongoose');

const showTimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  screenNumber: {
    type: Number,
    required: true
  },
  timing: {
    type: String,
    required: true
  }, // e.g., "14:30"
  totalSeats: {
    type: Number,
    default: 100
  },
  availableSeats: {
    type: Number,
    default: 100
  }
});

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  numberOfScreens: { type: Number, required: true },
  shows: [showTimeSchema]
}, { timestamps: true });

module.exports = mongoose.model('Theater', theaterSchema);