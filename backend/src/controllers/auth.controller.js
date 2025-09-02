const authService = require('../services/auth.service');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role = 'STUDENT' } = req.body;

    // Check if user already exists
    const existingUser = await authService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await authService.createUser({
      email,
      password,
      firstName,
      lastName,
      role
    });

    // Generate token
    const token = authService.generateToken(user.id);

    // Send welcome email
    await emailService.sendWelcomeEmail(user);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    logger.error('Registration error', error);
    res.status(500).json({
      message: 'Error creating user',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await authService.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = authService.generateToken(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
        _count: {
          enrollments: true,
          courses: true
        }
      }
    });

    res.json({ user });
  } catch (error) {
    logger.error('Get profile error', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        avatar
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    logger.error('Update profile error', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};