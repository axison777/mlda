const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PaymentService {
  async createPaymentIntent(userId, courseId, amount) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true, lastName: true }
      });

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true, price: true }
      });

      if (!course) {
        throw new Error('Course not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'eur',
        metadata: {
          userId,
          courseId,
          userEmail: user.email,
          courseTitle: course.title
        },
        description: `Achat du cours: ${course.title}`
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw new Error(`Payment intent creation failed: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId, userId, courseId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Record payment in database
        const payment = await prisma.payment.create({
          data: {
            userId,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: 'succeeded',
            paymentMethod: 'card',
            stripeId: paymentIntentId
          }
        });

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
          data: {
            userId,
            courseId
          }
        });

        return { payment, enrollment };
      }

      throw new Error('Payment not successful');
    } catch (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }
  }

  async createSubscription(userId, priceId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId }
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  async handleWebhook(signature, payload) {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPayment(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw new Error(`Webhook handling failed: ${error.message}`);
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    const { userId, courseId } = paymentIntent.metadata;

    if (userId && courseId) {
      await this.confirmPayment(paymentIntent.id, userId, courseId);
    }
  }

  async handleSubscriptionPayment(invoice) {
    // Handle subscription payment logic
    console.log('Subscription payment succeeded:', invoice.id);
  }
}

module.exports = new PaymentService();