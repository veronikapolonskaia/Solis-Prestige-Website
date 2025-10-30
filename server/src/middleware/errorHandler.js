/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message: 'Validation Error',
      details: message
    };
    return res.status(400).json({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message: 'Duplicate Field Error',
      details: message
    };
    return res.status(400).json({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token',
      details: 'The provided token is invalid'
    };
    return res.status(401).json({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired',
      details: 'The provided token has expired'
    };
    return res.status(401).json({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File too large',
      details: 'The uploaded file exceeds the maximum allowed size'
    };
    return res.status(400).json({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field',
      details: 'An unexpected file field was provided'
    };
    return res.status(400).json({
      success: false,
      error: error.message,
      details: error.details
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 