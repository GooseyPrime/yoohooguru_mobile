const express = require('express');
const { stripe } = require('../lib/stripe');
const { getDatabase } = require('../config/firebase');

const router = express.Router();

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const db = getDatabase();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Example booking fulfillment (adapt to your booking schema):
        // session.metadata could include jobId/listingId/etc.
        const jobId = session?.metadata?.jobId;
        if (jobId) {
          await db.ref(`job_bookings/${jobId}`).update({
            status: 'paid',
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent || null,
            updated_at: Date.now()
          });
        }
        // Subscriptions will also come here if you sell Guru Pass.
        break;
      }

      case 'account.updated': {
        const acct = event.data.object;
        // Find which profile has this accountId (store reverse index if you like)
        // Here we scan profiles once (ok for MVP scale). For scale, keep an index: accountId -> uid.
        const profilesSnap = await db.ref('profiles').once('value');
        profilesSnap.forEach(async (child) => {
          const p = child.val() || {};
          if (p.stripe_account_id === acct.id) {
            const ready = Boolean(acct.payouts_enabled && acct.charges_enabled && acct.details_submitted);
            await db.ref(`profiles/${child.key}`).update({ payouts_ready: ready });
          }
        });
        break;
      }

      default:
        // console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

module.exports = router;