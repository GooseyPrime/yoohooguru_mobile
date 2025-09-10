const express = require('express');
const { requireRole } = require('../middleware/auth');
const { getDatabase } = require('../config/firebase');

const router = express.Router();

// List pending docs (admin)
router.get('/pending', requireRole(['admin']), async (req, res) => {
  const db = getDatabase();
  const usersSnap = await db.ref('profile_documents').once('value');
  const pending = [];
  usersSnap.forEach(user => {
    const docs = user.val() || {};
    Object.values(docs).forEach(d => { if (d.status === 'pending') pending.push({ uid:user.key, ...d }); });
  });
  res.json({ success:true, data:{ pending }});
});

// Approve/reject a doc
router.post('/:uid/:docId/status', requireRole(['admin']), async (req, res) => {
  const { uid, docId } = req.params;
  const { status, reason } = req.body; // 'approved'|'rejected'
  if (!['approved','rejected'].includes(status)) return res.status(400).json({ success:false, error:{ message:'invalid status' }});
  const db = getDatabase();
  await db.ref(`profile_documents/${uid}/${docId}`).update({ status, reason: reason || null, reviewed_at: Date.now() });
  res.json({ success:true });
});

module.exports = router;