const express = require('express');
const router = express.Router();

const statsController = require('../controllers/stats.controller');
const { authenticateToken, requireAdmin, requireTeacher, requireStudent } = require('../middleware/auth');

// Admin statistics
router.get('/admin', authenticateToken, requireAdmin, statsController.getAdminStats);

// Teacher statistics
router.get('/teacher', authenticateToken, requireTeacher, statsController.getTeacherStats);

// Student statistics
router.get('/student', authenticateToken, requireStudent, statsController.getStudentStats);

module.exports = router;