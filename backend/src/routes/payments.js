const express = require('express');
const { getConfig } = require('../config/appConfig');

const router = express.Router();

// Get payment configuration
router.get('/config', (req, res) => {
  const config = getConfig();
  
  res.json({
    success: true,
    data: {
      publishableKey: config.stripePublishableKey,
      priceIds: {
        guruPass: config.stripeGuruPassPriceId,
        skillVerification: config.stripeSkillVerificationPriceId,
        trustSafety: config.stripeTrustSafetyPriceId
      },
      webhookEndpoint: '/api/webhooks/stripe'
    }
  });
});

// Main payments endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: { 
      message: 'Payments endpoint - Available',
      endpoints: {
        config: '/api/payments/config',
        webhook: '/api/webhooks/stripe'
      }
    }
  });
});

// Create payment intent (placeholder for future implementation)
router.post('/create-payment-intent', (req, res) => {
  // TODO: Implement Stripe payment intent creation
  res.json({
    success: false,
    message: 'Payment intent creation - Coming soon'
  });
});

// Get subscription status (placeholder for future implementation)
router.get('/subscription/:userId', (req, res) => {
  // TODO: Implement subscription status check
  res.json({
    success: false,
    message: 'Subscription status check - Coming soon'
  });
});

module.exports = router;