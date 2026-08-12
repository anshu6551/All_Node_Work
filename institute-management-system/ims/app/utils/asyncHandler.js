// Wraps async route handlers/middleware so rejected promises are passed to
// Express's error handler instead of crashing the process.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
