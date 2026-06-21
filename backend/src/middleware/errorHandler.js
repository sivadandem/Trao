const { sendError } = require('../utils/response');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, 'Validation Error', { errors: messages });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `An account with this ${field} already exists.`);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 400, `Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred'
    : err.message || 'Internal Server Error';

  return sendError(res, statusCode, message);
};

// 404 handler
const notFound = (req, res, next) => {
  return sendError(res, 404, `Route not found: ${req.originalUrl}`);
};

module.exports = { errorHandler, notFound };
