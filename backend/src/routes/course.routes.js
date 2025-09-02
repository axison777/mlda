const express = require('express');
const router = express.Router();

const courseController = require('../controllers/course.controller');
const { validate, courseSchemas } = require('../utils/validators');
const { authenticateToken, requireTeacher, requireAdmin } = require('../middleware/auth');

// Public routes (for visitors to browse published courses)
router.get('/', authenticateToken, courseController.getCourses);
router.get('/:id', authenticateToken, courseController.getCourseById);

// Teacher/Admin routes
router.post('/', authenticateToken, requireTeacher, validate(courseSchemas.create), courseController.createCourse);
router.put('/:id', authenticateToken, requireTeacher, validate(courseSchemas.update), courseController.updateCourse);
router.delete('/:id', authenticateToken, requireTeacher, courseController.deleteCourse);

module.exports = router;