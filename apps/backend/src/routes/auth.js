const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase, getAuth } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').trim().isLength({ min: 2, max: 50 }),
  body('skills').optional().isArray(),
  body('location').optional().trim()
];

// Validation rules for login (currently unused but may be needed later)
// const validateLogin = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').exists()
// ];

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { email, password, displayName, skills = [], location = '' } = req.body;

    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName
    });

    // Create user profile in database
    const db = getDatabase();
    const userProfile = {
      uid: userRecord.uid,
      email,
      displayName,
      skillsOffered: skills.offered || [],
      skillsWanted: skills.wanted || [],
      tier: 'Stone Dropper',
      exchangesCompleted: 0,
      averageRating: 0,
      totalHoursTaught: 0,
      location,
      availability: [],
      purposeStory: '',
      joinDate: new Date().toISOString(),
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      liability: {
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        lastWaiverAccepted: null,
        lastWaiverId: null,
        totalWaivers: 0
      }
    };

    await db.ref(`users/${userRecord.uid}`).set(userProfile);

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        tier: userProfile.tier
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    
    let message = 'Registration failed';
    if (error.code === 'auth/email-already-exists') {
      message = 'Email already registered';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    }

    res.status(400).json({
      success: false,
      error: { message }
    });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const db = getDatabase();
    const userSnapshot = await db.ref(`users/${req.user.uid}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: { message: 'User profile not found' }
      });
    }

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch profile' }
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const allowedUpdates = [
      'displayName', 'skillsOffered', 'skillsWanted', 
      'location', 'availability', 'purposeStory'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    updates.updatedAt = new Date().toISOString();

    const db = getDatabase();
    await db.ref(`users/${req.user.uid}`).update(updates);

    logger.info(`Profile updated for user: ${req.user.uid}`);

    res.json({
      success: true,
      data: { message: 'Profile updated successfully' }
    });

  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update profile' }
    });
  }
});

// @desc    Verify token
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token is required' }
      });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    
    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    });

  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token' }
    });
  }
});

module.exports = router;