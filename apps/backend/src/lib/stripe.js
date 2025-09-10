// Lightweight Stripe client
const Stripe = require('stripe');

let stripe;

if (!process.env.STRIPE_SECRET_KEY) {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) {
    // In test environment, don't show warnings and create a placeholder client
    // The actual stripe object will be replaced by Jest mocks
    stripe = {};
  } else if (isDevelopment) {
    console.warn('[stripe] STRIPE_SECRET_KEY not set. For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file. Stripe features will be disabled.');
    stripe = null;
  } else {
    console.warn('[stripe] STRIPE_SECRET_KEY not set. Set this in Railway or your production environment.');
    stripe = null;
  }
} else {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
  });
}

module.exports = { stripe };