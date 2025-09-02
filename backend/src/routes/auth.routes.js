const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { validate, authSchemas } = require('../utils/validators');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);

// Protected routes
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;