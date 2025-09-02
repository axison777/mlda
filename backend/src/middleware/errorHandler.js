const logger = require('../utils/logger');

const errorHandler = (error, req, res, next) => {
  logger.error('Unhandled error', error, {
    url: req.url,
    method: req.method,
    userId: req.user?.id
  });

  // Prisma errors
  if (error.code === 'P2002') {
    return res.status(409).json({
      message: 'Resource already exists',
      field: error.meta?.target?.[0]
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      message: 'Resource not found'
    });
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.details
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }

  // Default error
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;