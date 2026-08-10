const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Check for both lowercase 'authorization' and capitalized 'Authorization'
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  let token;

  if (authHeader && authHeader.toLowerCase().startsWith('bearer')) {
    try {
      // Split the space between 'Bearer' and the token string
      token = authHeader.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_testing');
      
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access Denied' });
    }
    next();
  };
};

module.exports = { protect, authorize };