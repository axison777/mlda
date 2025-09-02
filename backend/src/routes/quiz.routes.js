const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { validate, quizSchemas } = require('../utils/validators');
const { authenticateToken, requireTeacher, requireStudent } = require('../middleware/auth');

// Get quiz by ID
router.get('/:id', authenticateToken, quizController.getQuizById);

// Create quiz
router.post('/', authenticateToken, requireTeacher, validate(quizSchemas.create), quizController.createQuiz);

// Submit quiz attempt
router.post('/:id/attempt', authenticateToken, requireStudent, validate(quizSchemas.attempt), quizController.submitQuizAttempt);

// Get quiz attempts
router.get('/:id/attempts', authenticateToken, quizController.getQuizAttempts);

module.exports = router;