const express = require('express');
const router = express.Router();

const enrollmentController = require('../controllers/enrollment.controller');
const { authenticateToken, requireStudent } = require('../middleware/auth');

// Enroll in course
router.post('/', authenticateToken, requireStudent, enrollmentController.enrollInCourse);

// Get user enrollments
router.get('/my-courses', authenticateToken, requireStudent, enrollmentController.getUserEnrollments);

module.exports = router;