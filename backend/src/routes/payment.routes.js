const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');
const { validate, paymentSchemas } = require('../utils/validators');
const { authenticateToken, requireStudent } = require('../middleware/auth');
const { paymentLimiter } = require('../middleware/rateLimiter');

// Create payment intent
router.post('/create-intent', 
  authenticateToken, 
  requireStudent, 
  paymentLimiter,
  validate(paymentSchemas.createIntent), 
  async (req, res) => {
  try {
    const { courseId, amount } = req.body;

    const result = await paymentService.createPaymentIntent(req.user.id, courseId, amount);

    res.json(result);
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent', 
      error: error.message 
    });
  }
});

// Confirm payment
router.post('/confirm', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { paymentIntentId, courseId } = req.body;

    const result = await paymentService.confirmPayment(paymentIntentId, req.user.id, courseId);

    res.json({
      message: 'Payment confirmed and enrollment created',
      ...result
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      message: 'Error confirming payment',
      error: error.message
    });
  }
});

// Get user payments
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };

    const payments = await prisma.payment.findMany({
      where,
      include: req.user.role === 'ADMIN' ? {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      } : {},
      orderBy: { createdAt: 'desc' }
    });

    res.json({ payments });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ 
      message: 'Error fetching payment history', 
      error: error.message 
    });
  }
});

module.exports = router;