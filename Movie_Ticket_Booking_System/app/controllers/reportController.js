const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const { sendBookingTableEmail } = require('../utils/emailService');

exports.getMovieBookingReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      { $match: { status: 'Booked' } },
      { $group: { _id: '$movie', totalTickets: { $sum: '$ticketsBooked' } } },
      { $lookup: { from: 'movies', localField: '_id', foreignField: '_id', as: 'movieDetails' } },
      { $unwind: '$movieDetails' }
    ]);
    res.status(200).json(report);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTheaterBookingReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      { $match: { status: 'Booked' } },
      { $group: { 
          _id: { theater: '$theater', movie: '$movie', show: '$showTiming' }, 
          totalTickets: { $sum: '$ticketsBooked' } 
        } 
      },
      { $lookup: { from: 'theaters', localField: '_id.theater', foreignField: '_id', as: 'theater' } },
      { $lookup: { from: 'movies', localField: '_id.movie', foreignField: '_id', as: 'movie' } },
      { $unwind: '$theater' },
      { $unwind: '$movie' }
    ]);
    res.status(200).json(report);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.emailSummaryToUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id, status: 'Booked' }).populate('movie theater');
    if (!bookings.length) return res.status(404).json({ message: 'No active bookings found for this user.' });

    await sendBookingTableEmail(req.user.email, bookings);
    res.status(200).json({ message: 'Booking summary table sent successfully via email.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};