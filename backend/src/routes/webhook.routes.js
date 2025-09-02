const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({ message: 'Missing stripe signature' });
    }

    const result = await paymentService.handleWebhook(signature, req.body);
    
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      message: 'Webhook error',
      error: error.message
    });
  }
});

module.exports = router;