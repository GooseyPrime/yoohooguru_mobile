const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { getDatabase } = require('../config/firebase');
const { logger } = require('../utils/logger');

const router = express.Router();

// Compute step-by-step status for UI wizard
router.get('/status', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = getDatabase();

    const [profileSnap, picksSnap, docsSnap] = await Promise.all([
      db.ref(`profiles/${uid}`).once('value'),
      db.ref(`profile_categories/${uid}`).once('value'),
      db.ref(`profile_documents/${uid}`).once('value')
    ]);

    const profile = profileSnap.val() || {};
    const picks   = picksSnap.val()   || {};
    const docs    = docsSnap.val()    || {};

    const step = {
      profileComplete: Boolean(profile.displayName && profile.city && profile.zip && profile.bio),
      categoriesComplete: Object.keys(picks).length > 0,
      requirementsComplete: true, // will be set false if missing required docs
      payoutConnected: Boolean(profile.stripe_account_id || profile.payout_ready),
      reviewReady: false,
    };

    // Check requirements for selected categories
    const reqsSnap = await db.ref('category_requirements').once('value');
    const reqs = reqsSnap.val() || {};
    for (const slug of Object.keys(picks)) {
      const r = reqs[slug] || {};
      if (r.requires_license && !hasApproved(docs, 'license', slug)) step.requirementsComplete = false;
      if (r.requires_gl && !hasApproved(docs, 'insurance', slug))   step.requirementsComplete = false;
      if (r.requires_auto_insurance && !hasApproved(docs, 'auto', slug)) step.requirementsComplete = false;
    }

    step.reviewReady = step.profileComplete && step.categoriesComplete && step.requirementsComplete && step.payoutConnected;

    res.json({ success:true, data:{ step, profile, picks, docs }});
  } catch (e) {
    logger.error('onboarding/status error', e);
    res.status(500).json({ success:false, error:{ message:'Failed to load onboarding status' }});
  }
});

function hasApproved(docs, type, slug) {
  const list = Object.values(docs || {}).filter(d => d.type===type && (!d.category || d.category===slug));
  return list.some(d => d.status === 'approved' && (!d.expires_on || Date.parse(d.expires_on) > Date.now()));
}

// Save basic profile
router.post('/profile', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { displayName, photoUrl, city, zip, bio } = req.body;
    const db = getDatabase();
    await db.ref(`profiles/${uid}`).update({
      displayName, photoUrl, city, zip, bio,
      updatedAt: Date.now(),
      // surface badge placeholders
      is_id_verified: !!req.body.is_id_verified || false,
      insurance_status: 'unknown',
      license_status: 'unknown',
    });
    res.json({ success:true });
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to save profile' }});
  }
});

// Save category selections
router.post('/categories', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { categories } = req.body; // array of slugs
    const db = getDatabase();

    // Normalize to map for quick lookup
    const picks = {};
    (categories || []).forEach(slug => picks[slug] = { selectedAt: Date.now() });

    await db.ref(`profile_categories/${uid}`).set(picks);
    res.json({ success:true });
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to save categories' }});
  }
});

// Get requirements for selected categories
router.get('/requirements', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = getDatabase();
    const [picksSnap, reqsSnap] = await Promise.all([
      db.ref(`profile_categories/${uid}`).once('value'),
      db.ref('category_requirements').once('value')
    ]);
    const picks = Object.keys(picksSnap.val() || {});
    const reqs  = reqsSnap.val() || {};
    const needed = picks.map(slug => ({ slug, requirements: reqs[slug] || {} }));
    res.json({ success:true, data:{ needed }});
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to load requirements' }});
  }
});

// Add document metadata (file upload storage integration can be phased)
router.post('/documents', authenticateUser, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { type, category, provider, number, issued_on, expires_on, file_url } = req.body;
    const db = getDatabase();
    const ref = db.ref(`profile_documents/${uid}`).push();
    await ref.set({
      id: ref.key,
      type, category: category || null,
      provider: provider || null,
      number: number || null,
      issued_on: issued_on || null,
      expires_on: expires_on || null,
      file_url: file_url || null,
      status: 'pending',
      created_at: Date.now()
    });
    res.json({ success:true, data:{ id: ref.key }});
  } catch (e) {
    res.status(500).json({ success:false, error:{ message:'Failed to add document' }});
  }
});

module.exports = router;