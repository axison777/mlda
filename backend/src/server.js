require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const lessonRoutes = require('./routes/lesson.routes');
const quizRoutes = require('./routes/quiz.routes');
const progressRoutes = require('./routes/progress.routes');
const paymentRoutes = require('./routes/payment.routes');
const announcementRoutes = require('./routes/announcement.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const uploadRoutes = require('./routes/upload.routes');
const statsRoutes = require('./routes/stats.routes');
const webhookRoutes = require('./routes/webhook.routes');
const productRoutes = require('./routes/product.routes');

const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
app.use(generalLimiter);

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Webhook routes (before JSON parsing)
app.use('/api/webhooks', webhookRoutes);

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 MLDA Backend Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;