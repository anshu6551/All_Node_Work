const express = require('express');
const router = express.Router();
const { addMovie, addTheater, assignMovieToTheater, listMovies, editMovie, deleteMovie } = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public Route
router.get('/', listMovies);

// 🎬 1. Add Movie Endpoint
router.post('/add-movie', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Add a new movie (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: {
           "application/json": {
              schema: {
                 type: "object",
                 properties: {
                    name: { type: "string", example: "Inception" },
                    genre: { type: "string", example: "Sci-Fi" },
                    duration: { type: "number", example: 148 },
                    language: { type: "string", example: "English" }
                 },
                 required: ["name", "genre"]
              }
           }
        }
     } 
  */
   //  #swagger.tags = ['Admin']
  addMovie(req, res);
});

// 🏛️ 2. Add Theater Endpoint
router.post('/add-theater', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Add a new theater location (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: {
           "application/json": {
              schema: {
                 type: "object",
                 properties: {
                    name: { type: "string", example: "PVR Cinemas" },
                    location: { type: "string", example: "Downtown Mall" },
                    totalSeats: { type: "number", example: 120 }
                 },
                 required: ["name", "location"]
              }
           }
        }
     } 
  */
  addTheater(req, res);
});

// 🔗 3. Assign Movie To Theater Endpoint
router.post('/assign-movie', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Map a movie to a theater show timing (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = {
        required: true,
        content: {
           "application/json": {
              schema: {
                 type: "object",
                 properties: {
                    movieId: { type: "string", example: "60c72b2f9b1d8b2bad7f1234" },
                    theaterId: { type: "string", example: "60c72b2f9b1d8b2bad7f5678" },
                    showTiming: { type: "string", example: "18:30" },
                    ticketPrice: { type: "number", example: 250 }
                 },
                 required: ["movieId", "theaterId", "showTiming"]
              }
           }
        }
     } 
  */
  assignMovieToTheater(req, res);
});

// ✏️ 4. Edit Movie Endpoint
router.put('/:id', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Update an existing movie details (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The MongoDB ObjectId of the movie',
        required: true,
        type: 'string'
     }
     #swagger.requestBody = {
        required: true,
        content: {
           "application/json": {
              schema: {
                 type: "object",
                 properties: {
                    name: { type: "string", example: "Inception - Updated" },
                    genre: { type: "string", example: "Sci-Fi/Thriller" },
                    duration: { type: "number", example: 150 },
                    language: { type: "string", example: "English" }
                 }
              }
           }
        }
     } 
  */
  editMovie(req, res);
});

// 🗑️ 5. Delete Movie Endpoint
router.delete('/:id', protect, authorize('Admin'), (req, res) => {
  /* #swagger.summary = 'Delete a movie by ID (Admin Only)'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = {
        in: 'path',
        description: 'The MongoDB ObjectId of the movie to delete',
        required: true,
        type: 'string'
     }
  */
  deleteMovie(req, res);
});

module.exports = router;