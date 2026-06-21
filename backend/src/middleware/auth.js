const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Access denied. No token provided.');
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 401, 'Token has expired. Please log in again.');
      }
      return sendError(res, 401, 'Invalid token. Please log in again.');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return sendError(res, 401, 'User no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
