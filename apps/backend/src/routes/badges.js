const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Badge categories and requirements
const BADGE_CATEGORIES = {
  'safety-certified': {
    name: 'Safety Certified',
    description: 'Verified safety training and certification',
    icon: '🛡️',
    color: '#FF6B35',
    requirements: ['safety_training_cert', 'first_aid_cert'],
    skillCategories: ['physical-training', 'construction', 'automotive']
  },
  'licensed-professional': {
    name: 'Licensed Professional',
    description: 'Professional license verification',
    icon: '📋',
    color: '#4ECDC4', 
    requirements: ['professional_license'],
    skillCategories: ['legal', 'medical', 'financial', 'construction']
  },
  'insured-provider': {
    name: 'Insured Provider',
    description: 'General liability insurance verified',
    icon: '🏛️',
    color: '#45B7D1',
    requirements: ['general_liability_insurance'],
    skillCategories: ['physical-training', 'home-repair', 'automotive', 'construction']
  },
  'background-verified': {
    name: 'Background Verified',
    description: 'Background check completed',
    icon: '✅',
    color: '#96CEB4',
    requirements: ['background_check'],
    skillCategories: ['childcare', 'eldercare', 'tutoring', 'home-services']
  },
  'expert-level': {
    name: 'Expert Level',
    description: 'Demonstrated expertise and positive reviews',
    icon: '⭐',
    color: '#FFEAA7',
    requirements: ['min_reviews_25', 'avg_rating_4_5'],
    skillCategories: ['all']
  },
  'master-craftsperson': {
    name: 'Master Craftsperson',
    description: 'Advanced skill certification and portfolio',
    icon: '🔨',
    color: '#DDA0DD',
    requirements: ['portfolio_verified', 'skill_assessment_passed'],
    skillCategories: ['arts-crafts', 'woodworking', 'construction', 'design']
  }
};

// Validation middleware
const validateBadgeRequest = [
  body('badgeType').isIn(Object.keys(BADGE_CATEGORIES)),
  body('documentIds').isArray().isLength({ min: 1 }),
  body('notes').optional().trim().isLength({ max: 500 })
];

// @desc    Get available badge types
// @route   GET /api/badges/types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const { skillCategory } = req.query;
    
    let availableBadges = Object.entries(BADGE_CATEGORIES);
    
    if (skillCategory) {
      availableBadges = availableBadges.filter(([, badge]) => 
        badge.skillCategories.includes(skillCategory) || 
        badge.skillCategories.includes('all')
      );
    }
    
    const badgeTypes = Object.fromEntries(availableBadges);
    
    res.json({
      success: true,
      data: {
        badgeTypes,
        totalAvailable: Object.keys(badgeTypes).length
      }
    });

  } catch (error) {
    logger.error('Get badge types error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch badge types' }
    });
  }
});

// @desc    Request a new badge
// @route   POST /api/badges/request
// @access  Private
router.post('/request', authenticateUser, validateBadgeRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { badgeType, documentIds, notes = '' } = req.body;
    const userId = req.user.uid;
    
    const db = getDatabase();
    
    // Check if user already has this badge
    const existingBadgeSnapshot = await db.ref('user_badges')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
      
    let hasExistingBadge = false;
    existingBadgeSnapshot.forEach(childSnapshot => {
      const badge = childSnapshot.val();
      if (badge.badgeType === badgeType && ['approved', 'pending'].includes(badge.status)) {
        hasExistingBadge = true;
      }
    });
    
    if (hasExistingBadge) {
      return res.status(400).json({
        success: false,
        error: { message: 'Badge already requested or earned' }
      });
    }

    // Verify documents exist and belong to user
    const documentsValid = await Promise.all(
      documentIds.map(async (docId) => {
        const docSnapshot = await db.ref(`profile_documents/${userId}/${docId}`).once('value');
        return docSnapshot.exists();
      })
    );
    
    if (documentsValid.some(valid => !valid)) {
      return res.status(400).json({
        success: false,
        error: { message: 'One or more document IDs are invalid' }
      });
    }

    // Create badge request
    const badgeRequestRef = db.ref('badge_requests').push();
    const requestId = badgeRequestRef.key;
    
    const badgeRequest = {
      id: requestId,
      userId,
      badgeType,
      documentIds,
      notes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNotes: '',
      badgeInfo: BADGE_CATEGORIES[badgeType]
    };

    await badgeRequestRef.set(badgeRequest);
    
    // Add to user's badge requests
    await db.ref(`user_badge_requests/${userId}/${requestId}`).set({
      badgeType,
      status: 'pending',
      submittedAt: badgeRequest.submittedAt
    });

    logger.info(`Badge request submitted by user ${userId} for ${badgeType}`);

    res.status(201).json({
      success: true,
      data: {
        requestId,
        badgeType,
        status: 'pending',
        submittedAt: badgeRequest.submittedAt,
        message: 'Badge request submitted successfully'
      }
    });

  } catch (error) {
    logger.error('Badge request error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit badge request' }
    });
  }
});

// @desc    Get user's badges and requests
// @route   GET /api/badges/my-badges
// @access  Private
router.get('/my-badges', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const db = getDatabase();

    // Get approved badges
    const badgesSnapshot = await db.ref('user_badges')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
      
    const approvedBadges = [];
    badgesSnapshot.forEach(childSnapshot => {
      const badge = childSnapshot.val();
      if (badge.status === 'approved') {
        approvedBadges.push({
          id: childSnapshot.key,
          ...badge,
          badgeInfo: BADGE_CATEGORIES[badge.badgeType]
        });
      }
    });

    // Get pending requests
    const requestsSnapshot = await db.ref('badge_requests')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
      
    const pendingRequests = [];
    requestsSnapshot.forEach(childSnapshot => {
      const request = childSnapshot.val();
      if (request.status === 'pending') {
        pendingRequests.push({
          id: childSnapshot.key,
          ...request
        });
      }
    });

    res.json({
      success: true,
      data: {
        approvedBadges: approvedBadges.sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt)),
        pendingRequests: pendingRequests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
        totalBadges: approvedBadges.length,
        pendingCount: pendingRequests.length
      }
    });

  } catch (error) {
    logger.error('Get user badges error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user badges' }
    });
  }
});

// @desc    Get user's badges for public profile
// @route   GET /api/badges/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDatabase();

    const badgesSnapshot = await db.ref('user_badges')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
      
    const publicBadges = [];
    badgesSnapshot.forEach(childSnapshot => {
      const badge = childSnapshot.val();
      if (badge.status === 'approved' && badge.public !== false) {
        publicBadges.push({
          badgeType: badge.badgeType,
          approvedAt: badge.approvedAt,
          badgeInfo: BADGE_CATEGORIES[badge.badgeType]
        });
      }
    });

    res.json({
      success: true,
      data: {
        badges: publicBadges.sort((a, b) => new Date(b.approvedAt) - new Date(a.approvedAt)),
        totalBadges: publicBadges.length
      }
    });

  } catch (error) {
    logger.error('Get public badges error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user badges' }
    });
  }
});

// @desc    Check badge requirements for skill category
// @route   GET /api/badges/requirements/:skillCategory
// @access  Public
router.get('/requirements/:skillCategory', async (req, res) => {
  try {
    const { skillCategory } = req.params;
    const { userId } = req.query;
    
    const db = getDatabase();
    
    // Get required badges for this skill category
    const requiredBadges = Object.entries(BADGE_CATEGORIES)
      .filter(([, badge]) => 
        badge.skillCategories.includes(skillCategory) || 
        badge.skillCategories.includes('all')
      )
      .map(([key, badge]) => ({ 
        badgeType: key, 
        ...badge, 
        required: ['physical-training', 'construction', 'childcare'].includes(skillCategory)
      }));

    let userBadgeStatus = {};
    
    if (userId) {
      const userBadgesSnapshot = await db.ref('user_badges')
        .orderByChild('userId')
        .equalTo(userId)
        .once('value');
        
      userBadgesSnapshot.forEach(childSnapshot => {
        const badge = childSnapshot.val();
        if (badge.status === 'approved') {
          userBadgeStatus[badge.badgeType] = {
            status: 'earned',
            approvedAt: badge.approvedAt
          };
        }
      });
      
      // Check pending requests
      const requestsSnapshot = await db.ref('badge_requests')
        .orderByChild('userId')
        .equalTo(userId)
        .once('value');
        
      requestsSnapshot.forEach(childSnapshot => {
        const request = childSnapshot.val();
        if (request.status === 'pending' && !userBadgeStatus[request.badgeType]) {
          userBadgeStatus[request.badgeType] = {
            status: 'pending',
            submittedAt: request.submittedAt
          };
        }
      });
    }

    res.json({
      success: true,
      data: {
        skillCategory,
        requiredBadges,
        recommendedBadges: requiredBadges.filter(b => !b.required),
        userBadgeStatus,
        complianceScore: calculateComplianceScore(requiredBadges, userBadgeStatus)
      }
    });

  } catch (error) {
    logger.error('Get badge requirements error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch badge requirements' }
    });
  }
});

// @desc    Admin: Review badge request
// @route   PUT /api/badges/admin/review/:requestId
// @access  Private (Admin)
router.put('/admin/review/:requestId', authenticateUser, async (req, res) => {
  try {
    // Basic admin check (in production, implement proper role-based auth)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    const { requestId } = req.params;
    const { action, reviewNotes = '' } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Action must be approve or reject' }
      });
    }

    const db = getDatabase();
    const requestSnapshot = await db.ref(`badge_requests/${requestId}`).once('value');
    
    if (!requestSnapshot.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Badge request not found' }
      });
    }

    const request = requestSnapshot.val();
    const reviewData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.user.uid,
      reviewNotes
    };

    // Update request
    await db.ref(`badge_requests/${requestId}`).update(reviewData);
    
    if (action === 'approve') {
      // Create approved badge
      const badgeRef = db.ref('user_badges').push();
      await badgeRef.set({
        userId: request.userId,
        badgeType: request.badgeType,
        status: 'approved',
        approvedAt: reviewData.reviewedAt,
        approvedBy: req.user.uid,
        requestId,
        public: true,
        badgeInfo: BADGE_CATEGORIES[request.badgeType]
      });
      
      // Update user badge requests
      await db.ref(`user_badge_requests/${request.userId}/${requestId}`).update({
        status: 'approved',
        approvedAt: reviewData.reviewedAt
      });
    }

    logger.info(`Badge request ${requestId} ${action}d by admin ${req.user.uid}`);

    res.json({
      success: true,
      data: {
        requestId,
        action,
        reviewedAt: reviewData.reviewedAt,
        message: `Badge request ${action}d successfully`
      }
    });

  } catch (error) {
    logger.error('Badge review error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to review badge request' }
    });
  }
});

// Helper function to calculate compliance score
function calculateComplianceScore(requiredBadges, userBadgeStatus) {
  const totalRequired = requiredBadges.filter(b => b.required).length;
  const earnedRequired = requiredBadges.filter(b => 
    b.required && userBadgeStatus[b.badgeType]?.status === 'earned'
  ).length;
  
  if (totalRequired === 0) return 100;
  return Math.round((earnedRequired / totalRequired) * 100);
}

module.exports = router;