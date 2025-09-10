const express = require('express');
const router = express.Router();

// Placeholder routes for exchanges
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: { message: 'Exchanges endpoint - Coming soon' }
  });
});

module.exports = router;