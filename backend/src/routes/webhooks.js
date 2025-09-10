const express = require('express');
const crypto = require('crypto');
const { logger } = require('../utils/logger');
const { getConfig } = require('../config/appConfig');

const router = express.Router();

/**
 * Stripe webhook endpoint
 * Handles all Stripe events with proper signature verification
 */
router.post('/stripe', (req, res) => {
  const config = getConfig();
  const sig = req.headers['stripe-signature'];
  let payload;
  
  // Handle raw body for signature verification
  if (Buffer.isBuffer(req.body)) {
    payload = req.body;
  } else {
    payload = Buffer.from(req.body || '', 'utf8');
  }
  
  const endpointSecret = config.stripeWebhookSecret;

  if (!endpointSecret) {
    logger.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    // Verify webhook signature
    const elements = sig.split(',');
    const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1];
    const signature = elements.find(el => el.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !signature) {
      throw new Error('Invalid signature format');
    }

    const expectedSignature = crypto
      .createHmac('sha256', endpointSecret)
      .update(timestamp + '.' + payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    event = JSON.parse(payload);
    logger.info(`Stripe webhook received: ${event.type}`);

  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle different event types
  try {
    switch (event.type) {
      // Payment events
      case 'payment_intent.succeeded':
        handlePaymentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        handlePaymentFailed(event.data.object);
        break;
      case 'payment_intent.created':
        handlePaymentCreated(event.data.object);
        break;

      // Charge events
      case 'charge.succeeded':
        handleChargeSucceeded(event.data.object);
        break;
      case 'charge.failed':
        handleChargeFailed(event.data.object);
        break;
      case 'charge.refunded':
        handleChargeRefunded(event.data.object);
        break;

      // Customer events
      case 'customer.created':
        handleCustomerCreated(event.data.object);
        break;
      case 'customer.updated':
        handleCustomerUpdated(event.data.object);
        break;
      case 'customer.deleted':
        handleCustomerDeleted(event.data.object);
        break;

      // Subscription events
      case 'customer.subscription.created':
        handleSubscriptionCreated(event.data.object);
        break;
      case 'customer.subscription.updated':
        handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        handleSubscriptionDeleted(event.data.object);
        break;

      // Checkout events
      case 'checkout.session.completed':
        handleCheckoutCompleted(event.data.object);
        break;
      case 'checkout.session.expired':
        handleCheckoutExpired(event.data.object);
        break;

      // Invoice events
      case 'invoice.paid':
        handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        handleInvoicePaymentFailed(event.data.object);
        break;

      // Dispute events
      case 'charge.dispute.created':
        handleDisputeCreated(event.data.object);
        break;
      case 'charge.dispute.updated':
        handleDisputeUpdated(event.data.object);
        break;

      // Account events
      case 'account.updated':
        handleAccountUpdated(event.data.object);
        break;
      case 'account.application.authorized':
        handleAccountApplicationAuthorized(event.data.object);
        break;

      // Payout events
      case 'payout.paid':
        handlePayoutPaid(event.data.object);
        break;
      case 'payout.failed':
        handlePayoutFailed(event.data.object);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error(`Error processing webhook: ${error.message}`);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Event handlers
function handlePaymentSucceeded(paymentIntent) {
  logger.info(`Payment succeeded: ${paymentIntent.id} for amount: ${paymentIntent.amount}`);
  // TODO: Update database with successful payment
  // TODO: Send confirmation email
  // TODO: Update user subscription/purchase status
}

function handlePaymentFailed(paymentIntent) {
  logger.warn(`Payment failed: ${paymentIntent.id}`);
  // TODO: Update database with failed payment
  // TODO: Send failure notification
}

function handlePaymentCreated(paymentIntent) {
  logger.info(`Payment intent created: ${paymentIntent.id}`);
  // TODO: Log payment attempt
}

function handleChargeSucceeded(charge) {
  logger.info(`Charge succeeded: ${charge.id} for ${charge.amount}`);
  // TODO: Update transaction records
}

function handleChargeFailed(charge) {
  logger.warn(`Charge failed: ${charge.id}`);
  // TODO: Handle failed charge
}

function handleChargeRefunded(charge) {
  logger.info(`Charge refunded: ${charge.id}`);
  // TODO: Process refund in system
}

function handleCustomerCreated(customer) {
  logger.info(`Customer created: ${customer.id}`);
  // TODO: Link Stripe customer to user account
}

function handleCustomerUpdated(customer) {
  logger.info(`Customer updated: ${customer.id}`);
  // TODO: Update customer information
}

function handleCustomerDeleted(customer) {
  logger.info(`Customer deleted: ${customer.id}`);
  // TODO: Handle customer deletion
}

function handleSubscriptionCreated(subscription) {
  logger.info(`Subscription created: ${subscription.id}`);
  // TODO: Activate user subscription features
  // TODO: Handle guru pass, skill verification, or trust safety subscriptions
}

function handleSubscriptionUpdated(subscription) {
  logger.info(`Subscription updated: ${subscription.id}`);
  // TODO: Update subscription status
}

function handleSubscriptionDeleted(subscription) {
  logger.info(`Subscription deleted: ${subscription.id}`);
  // TODO: Deactivate subscription features
}

function handleCheckoutCompleted(session) {
  logger.info(`Checkout completed: ${session.id}`);
  // TODO: Process completed purchase
  // TODO: Grant access to purchased features
}

function handleCheckoutExpired(session) {
  logger.info(`Checkout expired: ${session.id}`);
  // TODO: Clean up expired checkout session
}

function handleInvoicePaid(invoice) {
  logger.info(`Invoice paid: ${invoice.id}`);
  // TODO: Mark invoice as paid in system
}

function handleInvoicePaymentFailed(invoice) {
  logger.warn(`Invoice payment failed: ${invoice.id}`);
  // TODO: Handle failed invoice payment
}

function handleDisputeCreated(dispute) {
  logger.warn(`Dispute created: ${dispute.id}`);
  // TODO: Alert admin team about dispute
  // TODO: Gather evidence for dispute response
}

function handleDisputeUpdated(dispute) {
  logger.info(`Dispute updated: ${dispute.id} - Status: ${dispute.status}`);
  // TODO: Update dispute status in system
}

function handleAccountUpdated(account) {
  logger.info(`Account updated: ${account.id}`);
  // TODO: Update connected account information
}

function handleAccountApplicationAuthorized(application) {
  logger.info(`Account application authorized: ${application.id}`);
  // TODO: Complete account connection process
}

function handlePayoutPaid(payout) {
  logger.info(`Payout paid: ${payout.id} for ${payout.amount}`);
  // TODO: Update payout status for gurus
}

function handlePayoutFailed(payout) {
  logger.warn(`Payout failed: ${payout.id}`);
  // TODO: Handle failed payout and notify guru
}

module.exports = router;