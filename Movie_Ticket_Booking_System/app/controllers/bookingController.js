const Booking = require('../models/Booking');
const Theater = require('../models/Theater');

exports.listTheatersForMovie = async (req, res) => {
  try {
    const theaters = await Theater.find({ 'shows.movie': req.params.movieId });
    const formatted = theaters.map(t => ({
      theaterId: t._id,
      name: t.name,
      location: t.location,
      shows: t.shows.filter(s => s.movie.toString() === req.params.movieId)
    }));
    res.status(200).json(formatted);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.bookTickets = async (req, res) => {
  try {
    const { movieId, theaterId, showTiming, ticketsBooked, screenNumber } = req.body;
    
    const theater = await Theater.findById(theaterId);
    const show = theater.shows.find(s => s.movie.toString() === movieId && s.timing === showTiming && s.screenNumber === screenNumber);
    
    if (!show || show.availableSeats < ticketsBooked) {
      return res.status(400).json({ message: 'Insufficient seats available or invalid show details' });
    }

    show.availableSeats -= ticketsBooked;
    await theater.save();

    const booking = await Booking.create({
      user: req.user.id, movie: movieId, theater: theaterId, showTiming, screenNumber, ticketsBooked
    });

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(bookingId = req.params.id);
    if (!booking || booking.status === 'Cancelled') return res.status(400).json({ message: 'Booking already cancelled or not found' });

    const theater = await Theater.findById(booking.theater);
    const show = theater.shows.find(s => s.movie.toString() === booking.movie.toString() && s.timing === booking.showTiming);
    
    if (show) {
      show.availableSeats += booking.ticketsBooked;
      await theater.save();
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getBookingHistory = async (req, res) => {
  try {
    const history = await Booking.find({ user: req.user.id }).populate('movie theater');
    res.status(200).json(history);
  } catch (err) { res.status(500).json({ error: err.message }); }
};