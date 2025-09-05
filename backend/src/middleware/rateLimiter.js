const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

// No-op middleware for development to avoid noisy 429s
const passThrough = (req, res, next) => next();

// General API rate limiter
const generalLimiter = isDev
  ? passThrough
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false
    });

// Strict limiter for authentication endpoints
const authLimiter = isDev
  ? passThrough
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // limit each IP to 5 requests per windowMs
      message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
      },
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true // Don't count successful requests
    });

// Upload limiter
const uploadLimiter = isDev
  ? passThrough
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // limit each IP to 20 uploads per hour
      message: {
        error: 'Too many file uploads, please try again later.',
        retryAfter: '1 hour'
      }
    });

// Payment limiter
const paymentLimiter = isDev
  ? passThrough
  : rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // limit each IP to 10 payment attempts per hour
      message: {
        error: 'Too many payment attempts, please try again later.',
        retryAfter: '1 hour'
      }
    });

module.exports = {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  paymentLimiter
};