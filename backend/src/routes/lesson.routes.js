const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lesson.controller');
const { validate, lessonSchemas } = require('../utils/validators');
const { authenticateToken, requireTeacher } = require('../middleware/auth');

// Get lessons for a course
router.get('/course/:courseId', authenticateToken, lessonController.getLessonsByCourse);

// Get lesson by ID
router.get('/:id', authenticateToken, lessonController.getLessonById);

// Create lesson
router.post('/', authenticateToken, requireTeacher, validate(lessonSchemas.create), lessonController.createLesson);

// Update lesson
router.put('/:id', authenticateToken, requireTeacher, validate(lessonSchemas.update), lessonController.updateLesson);

// Delete lesson
router.delete('/:id', authenticateToken, requireTeacher, lessonController.deleteLesson);

module.exports = router;