const express = require('express');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * Admin Login - Validate ADMIN_KEY and set session cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { key } = req.body;
    const adminKey = process.env.ADMIN_KEY;
    
    if (!adminKey) {
      logger.error('ADMIN_KEY not configured');
      return res.status(500).json({ 
        success: false, 
        error: { message: 'ADMIN_KEY not set' } 
      });
    }
    
    if (key !== adminKey) {
      logger.warn('Failed admin login attempt', { ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid admin key' } 
      });
    }

    // Set httpOnly cookie for simple admin session (4 hours)
    res.cookie('yoohoo_admin', '1', { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production', 
      path: '/', 
      maxAge: 60 * 60 * 4 * 1000 // 4 hours
    });

    logger.info('Successful admin login', { ip: req.ip });
    res.json({ success: true, message: 'Admin login successful' });
  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
});

/**
 * Admin Ping - Check if admin session is valid
 */
router.get('/ping', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie === '1') {
    res.json({ success: true, authenticated: true });
  } else {
    res.status(401).json({ success: false, authenticated: false });
  }
});

/**
 * Admin Logout - Clear admin session
 */
router.post('/logout', (req, res) => {
  res.clearCookie('yoohoo_admin', { path: '/' });
  res.json({ success: true, message: 'Admin logout successful' });
});

/**
 * Admin Dashboard Data - Get system overview (protected route)
 */
router.get('/dashboard', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  // Return mock dashboard data for now
  // In a real implementation, this would query your database
  res.json({
    success: true,
    data: {
      users: {
        total: 0,
        active: 0,
        newThisWeek: 0
      },
      listings: {
        total: 0,
        active: 0,
        categories: {}
      },
      sessions: {
        total: 0,
        completed: 0,
        pending: 0
      },
      reports: {
        total: 0,
        pending: 0,
        resolved: 0
      },
      featureFlags: {
        booking: true,
        messaging: true,
        reviews: true,
        communityEvents: false,
        certifications: false,
        orgTools: false,
        dataProducts: false
      }
    }
  });
});

module.exports = router;