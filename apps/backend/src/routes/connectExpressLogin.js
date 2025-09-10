const express = require('express');
const { stripe } = require('../lib/stripe');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// POST /api/connect/express-login
router.post('/express-login', authenticateUser, async (req, res) => {
  try {
    if (!stripe && process.env.NODE_ENV !== 'test') {
      return res.status(503).json({ 
        ok: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }

    const db = getDatabase();
    const snap = await db.ref(`profiles/${req.user.uid}`).once('value');
    const profile = snap.val() || {};
    if (!profile.stripe_account_id) return res.status(400).json({ ok: false, error: 'Not connected to Stripe' });

    const link = await stripe.accounts.createLoginLink(profile.stripe_account_id);
    res.json({ ok: true, url: link.url });
  } catch (e) {
    console.error('express-login', e);
    res.status(500).json({ ok: false, error: 'Failed to create login link' });
  }
});

module.exports = router;