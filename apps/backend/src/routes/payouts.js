const express = require('express');
const { stripe } = require('../lib/stripe');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

async function getAccountId(uid) {
  const db = getDatabase();
  const snap = await db.ref(`profiles/${uid}`).once('value');
  const profile = snap.val() || {};
  return profile.stripe_account_id || null;
}

// GET /api/payouts/balance
router.get('/balance', authenticateUser, async (req, res) => {
  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        ok: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    const accountId = await getAccountId(req.user.uid);
    if (!accountId) return res.json({ ok: true, connected: false });

    const bal = await stripe.balance.retrieve({ stripeAccount: accountId });
    res.json({
      ok: true,
      connected: true,
      balance: {
        available: bal.available || [],
        instant_available: bal.instant_available || [],
        pending: bal.pending || []
      }
    });
  } catch (e) {
    console.error('payouts/balance', e);
    res.status(500).json({ ok: false, error: 'Failed to load balance' });
  }
});

// POST /api/payouts/instant
// body: { amountCents?: number, currency?: 'usd' }
router.post('/instant', authenticateUser, async (req, res) => {
  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        ok: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    const accountId = await getAccountId(req.user.uid);
    if (!accountId) return res.status(400).json({ ok: false, error: 'Stripe account not connected' });

    const currency = (req.body.currency || 'usd').toLowerCase();
    const bal = await stripe.balance.retrieve({ stripeAccount: accountId });

    const instantForCurrency = (bal.instant_available || []).find(a => a.currency === currency);
    if (!instantForCurrency) {
      return res.status(400).json({ ok: false, error: 'No instant-available balance for this currency' });
    }

    const maxInstant = instantForCurrency.amount; // in cents
    if (maxInstant <= 0) {
      return res.status(400).json({ ok: false, error: 'No instant balance available for payout' });
    }

    // Determine payout amount
    let amountCents = req.body.amountCents;
    if (!amountCents || amountCents <= 0) {
      amountCents = maxInstant; // payout all
    }
    
    if (amountCents > maxInstant) {
      return res.status(400).json({ 
        ok: false, 
        error: `Amount exceeds instant-available balance. Max: ${maxInstant} cents` 
      });
    }

    // Create instant payout
    const payout = await stripe.payouts.create({
      amount: amountCents,
      currency,
      method: 'instant'
    }, {
      stripeAccount: accountId
    });

    res.json({
      ok: true,
      data: {
        id: payout.id,
        amountCents: payout.amount,
        currency: payout.currency,
        status: payout.status,
        method: payout.method
      }
    });
  } catch (e) {
    console.error('payouts/instant', e);
    
    // Handle common Stripe errors with user-friendly messages
    let errorMessage = 'Failed to create instant payout';
    if (e.code === 'insufficient_funds') {
      errorMessage = 'Insufficient funds for instant payout';
    } else if (e.code === 'instant_payouts_unsupported') {
      errorMessage = 'Instant payouts not supported. Please add a debit card in your Stripe Dashboard';
    } else if (e.code === 'debit_not_supported') {
      errorMessage = 'Debit card payouts not supported. Please add a supported debit card';
    }
    
    res.status(400).json({ ok: false, error: errorMessage });
  }
});

module.exports = router;