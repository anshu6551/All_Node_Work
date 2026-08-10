const Movie = require('../models/Movie');
const Theater = require('../models/Theater');

exports.addMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.addTheater = async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    res.status(201).json(theater);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.assignMovieToTheater = async (req, res) => {
  try {
    const { theaterId, screenNumber, movieId, timing, totalSeats } = req.body;
    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: 'Theater not found' });

    theater.shows.push({ movie: movieId, screenNumber, timing, totalSeats, availableSeats: totalSeats });
    await theater.save();
    res.status(200).json({ message: 'Movie assigned to theater successfully', theater });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.listMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    const results = await Promise.all(movies.map(async (movie) => {
      const theaters = await Theater.find({ 'shows.movie': movie._id }, 'name location shows');
      
      const filteredTheaters = theaters.map(t => ({
        name: t.name,
        location: t.location,
        timings: t.shows.filter(s => s.movie.toString() === movie._id.toString()).map(s => s.timing)
      }));

      return {
        ...movie._doc,
        totalTheatersPlaying: filteredTheaters.length,
        theaters: filteredTheaters
      };
    }));
    res.status(200).json(results);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.editMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMovie);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    // Optionally clean up assigned shows in theaters here
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};