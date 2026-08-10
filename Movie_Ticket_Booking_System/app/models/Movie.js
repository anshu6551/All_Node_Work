const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  genre: [String],
  language: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }, // in minutes
  cast: [String],
  director: {
    type: String
  },
  releaseDate: {
    type: Date,
    required: true
  }
},
  { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);