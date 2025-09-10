const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware for waiver acceptance
const validateWaiverAcceptance = [
  body('skillCategory').trim().isLength({ min: 1 }),
  body('riskLevel').isIn(['low', 'medium', 'high']),
  body('activityDescription').optional().trim(),
  body('emergencyContact').optional().isObject(),
  body('emergencyContact.name').optional().trim().isLength({ min: 1 }),
  body('emergencyContact.phone').optional().trim().isLength({ min: 1 }),
  body('emergencyContact.relationship').optional().trim()
];

// @desc    Record liability waiver acceptance
// @route   POST /api/liability/waiver
// @access  Private
router.post('/waiver', authenticateUser, validateWaiverAcceptance, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const {
      skillCategory,
      riskLevel,
      activityDescription = '',
      emergencyContact = null,
      exchangeId = null
    } = req.body;

    // Validate emergency contact for high-risk activities
    if (riskLevel === 'high' && (!emergencyContact || !emergencyContact.name || !emergencyContact.phone)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Emergency contact information is required for high-risk activities' }
      });
    }

    const db = getDatabase();
    const waiverRecord = {
      userId: req.user.uid,
      skillCategory,
      riskLevel,
      activityDescription,
      emergencyContact,
      exchangeId,
      acceptedAt: new Date().toISOString(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      version: '1.0'
    };

    // Generate unique waiver ID
    const waiverRef = db.ref('liability_waivers').push();
    const waiverId = waiverRef.key;

    await waiverRef.set(waiverRecord);

    // Update user profile with latest waiver acceptance
    await db.ref(`users/${req.user.uid}/liability`).update({
      lastWaiverAccepted: new Date().toISOString(),
      lastWaiverId: waiverId,
      totalWaivers: ((await db.ref(`users/${req.user.uid}/liability/totalWaivers`).once('value')).val() || 0) + 1
    });

    logger.info(`Liability waiver accepted by user ${req.user.uid} for ${skillCategory} (${riskLevel} risk)`);

    res.status(201).json({
      success: true,
      data: {
        waiverId,
        acceptedAt: waiverRecord.acceptedAt,
        message: 'Liability waiver accepted successfully'
      }
    });

  } catch (error) {
    logger.error('Waiver acceptance error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to record waiver acceptance' }
    });
  }
});

// @desc    Get user's waiver history
// @route   GET /api/liability/waivers
// @access  Private
router.get('/waivers', authenticateUser, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const db = getDatabase();
    const waiversSnapshot = await db.ref('liability_waivers')
      .orderByChild('userId')
      .equalTo(req.user.uid)
      .limitToLast(parseInt(limit))
      .once('value');

    const waivers = [];
    waiversSnapshot.forEach(childSnapshot => {
      waivers.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    // Remove sensitive information
    const sanitizedWaivers = waivers.map(waiver => ({
      id: waiver.id,
      skillCategory: waiver.skillCategory,
      riskLevel: waiver.riskLevel,
      activityDescription: waiver.activityDescription,
      acceptedAt: waiver.acceptedAt,
      exchangeId: waiver.exchangeId,
      version: waiver.version
    }));

    res.json({
      success: true,
      data: {
        waivers: sanitizedWaivers.reverse(), // Most recent first
        total: waivers.length
      }
    });

  } catch (error) {
    logger.error('Get waivers error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch waiver history' }
    });
  }
});

// @desc    Check if user has valid waiver for activity
// @route   GET /api/liability/check/:skillCategory
// @access  Private
router.get('/check/:skillCategory', authenticateUser, async (req, res) => {
  try {
    const { skillCategory } = req.params;
    const { riskLevel = 'low' } = req.query;

    const db = getDatabase();
    
    // Check for recent waiver (within last 30 days for high-risk, 90 days for others)
    const validityDays = riskLevel === 'high' ? 30 : 90;
    const validSince = new Date();
    validSince.setDate(validSince.getDate() - validityDays);

    const waiversSnapshot = await db.ref('liability_waivers')
      .orderByChild('userId')
      .equalTo(req.user.uid)
      .once('value');

    let hasValidWaiver = false;
    let latestWaiver = null;

    waiversSnapshot.forEach(childSnapshot => {
      const waiver = childSnapshot.val();
      if (waiver.skillCategory === skillCategory && 
          new Date(waiver.acceptedAt) > validSince) {
        hasValidWaiver = true;
        if (!latestWaiver || new Date(waiver.acceptedAt) > new Date(latestWaiver.acceptedAt)) {
          latestWaiver = waiver;
        }
      }
    });

    res.json({
      success: true,
      data: {
        hasValidWaiver,
        requiresNewWaiver: !hasValidWaiver,
        validityDays,
        latestWaiver: latestWaiver ? {
          acceptedAt: latestWaiver.acceptedAt,
          riskLevel: latestWaiver.riskLevel,
          version: latestWaiver.version
        } : null
      }
    });

  } catch (error) {
    logger.error('Waiver check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check waiver status' }
    });
  }
});

// @desc    Get liability waiver template
// @route   GET /api/liability/template/:riskLevel
// @access  Public
router.get('/template/:riskLevel', async (req, res) => {
  try {
    const { riskLevel } = req.params;
    
    if (!['low', 'medium', 'high'].includes(riskLevel)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid risk level' }
      });
    }

    const templates = {
      low: {
        title: 'Basic Liability Acknowledgment',
        description: 'For low-risk digital and educational skill exchanges',
        emergencyContactRequired: false,
        validityDays: 90,
        keyPoints: [
          'Acknowledge basic risks in skill sharing',
          'Release platform from liability',
          'Assume personal responsibility'
        ]
      },
      medium: {
        title: 'Standard Liability Waiver',
        description: 'For moderate-risk activities involving tools or materials',
        emergencyContactRequired: false,
        validityDays: 90,
        keyPoints: [
          'Acknowledge moderate risks including tool use',
          'Release platform from liability',
          'Assume responsibility for property and safety',
          'Confirm adequate insurance coverage'
        ]
      },
      high: {
        title: 'Comprehensive Liability Waiver',
        description: 'For high-risk physical activities and training',
        emergencyContactRequired: true,
        validityDays: 30,
        keyPoints: [
          'Acknowledge significant physical risks',
          'Provide emergency contact information',
          'Confirm medical fitness for activity',
          'Comprehensive release and indemnification',
          'Mandatory insurance verification'
        ]
      }
    };

    res.json({
      success: true,
      data: {
        riskLevel,
        template: templates[riskLevel],
        lastUpdated: '2024-12-01',
        version: '1.0'
      }
    });

  } catch (error) {
    logger.error('Template fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch waiver template' }
    });
  }
});

// @desc    Get liability statistics (admin only)
// @route   GET /api/liability/stats
// @access  Private (admin)
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    // Check if user is admin (simplified check - in production, use proper role checking)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    const db = getDatabase();
    const waiversSnapshot = await db.ref('liability_waivers').once('value');
    
    const stats = {
      totalWaivers: 0,
      byRiskLevel: { low: 0, medium: 0, high: 0 },
      byCategory: {},
      recentWaivers: 0,
      uniqueUsers: new Set()
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    waiversSnapshot.forEach(childSnapshot => {
      const waiver = childSnapshot.val();
      stats.totalWaivers++;
      stats.byRiskLevel[waiver.riskLevel]++;
      stats.byCategory[waiver.skillCategory] = (stats.byCategory[waiver.skillCategory] || 0) + 1;
      stats.uniqueUsers.add(waiver.userId);
      
      if (new Date(waiver.acceptedAt) > thirtyDaysAgo) {
        stats.recentWaivers++;
      }
    });

    stats.uniqueUsers = stats.uniqueUsers.size;

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch liability statistics' }
    });
  }
});

// @desc    Check if user needs to accept updated terms
// @route   GET /api/liability/terms-status
// @access  Private
router.get('/terms-status', authenticateUser, async (req, res) => {
  try {
    const db = getDatabase();
    const userSnapshot = await db.ref(`users/${req.user.uid}/liability`).once('value');
    const userLiability = userSnapshot.val() || {};

    // Current terms version - update this when terms are modified
    const currentTermsVersion = '2024-12-01';
    const userTermsVersion = userLiability.termsVersion || '2024-01-01';
    
    const needsUpdate = userTermsVersion !== currentTermsVersion;

    res.json({
      success: true,
      data: {
        needsTermsUpdate: needsUpdate,
        currentVersion: currentTermsVersion,
        userVersion: userTermsVersion,
        termsAcceptedAt: userLiability.termsAcceptedAt,
        lastWaiverAccepted: userLiability.lastWaiverAccepted,
        totalWaivers: userLiability.totalWaivers || 0
      }
    });

  } catch (error) {
    logger.error('Terms status check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check terms status' }
    });
  }
});

// @desc    Check comprehensive compliance before activity
// @route   GET /api/liability/compliance-check/:skillCategory
// @access  Private
router.get('/compliance-check/:skillCategory', authenticateUser, async (req, res) => {
  try {
    const { skillCategory } = req.params;
    const userId = req.user.uid;
    const db = getDatabase();

    // Get compliance requirements
    const complianceResponse = await fetch(`http://localhost:${process.env.PORT || 3000}/api/compliance/status/${skillCategory}`, {
      headers: {
        'Authorization': req.headers.authorization
      }
    });

    let complianceData = null;
    if (complianceResponse.ok) {
      const complianceResult = await complianceResponse.json();
      complianceData = complianceResult.data;
    }

    // Check existing waiver status
    const validityDays = complianceData?.riskLevel === 'high' ? 30 : 90;
    const validSince = new Date();
    validSince.setDate(validSince.getDate() - validityDays);

    const waiversSnapshot = await db.ref('liability_waivers')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    let hasValidWaiver = false;
    let latestWaiver = null;

    waiversSnapshot.forEach(childSnapshot => {
      const waiver = childSnapshot.val();
      if (waiver.skillCategory === skillCategory && 
          new Date(waiver.acceptedAt) > validSince) {
        hasValidWaiver = true;
        if (!latestWaiver || new Date(waiver.acceptedAt) > new Date(latestWaiver.acceptedAt)) {
          latestWaiver = waiver;
        }
      }
    });

    // Comprehensive compliance check
    const complianceIssues = [];
    let canProceed = true;

    // Check profile compliance
    if (complianceData && !complianceData.complianceStatus.overall.compliant) {
      canProceed = false;
      complianceIssues.push({
        type: 'compliance',
        severity: 'high',
        message: 'Profile does not meet compliance requirements for this skill category',
        missingRequirements: complianceData.complianceStatus.overall.restrictions
      });
    }

    // Check waiver status
    if (!hasValidWaiver) {
      complianceIssues.push({
        type: 'waiver',
        severity: complianceData?.riskLevel === 'high' ? 'high' : 'medium',
        message: 'Liability waiver required',
        requiresAction: true
      });
    }

    // Check insurance for high-risk activities
    if (complianceData?.riskLevel === 'high') {
      const insuranceResponse = await fetch(`http://localhost:${process.env.PORT || 3000}/api/insurance/requirements/${skillCategory}?userId=${userId}`, {
        headers: {
          'Authorization': req.headers.authorization
        }
      });

      if (insuranceResponse.ok) {
        const insuranceResult = await insuranceResponse.json();
        if (!insuranceResult.data.isCompliant) {
          canProceed = false;
          complianceIssues.push({
            type: 'insurance',
            severity: 'high',
            message: 'Required insurance verification missing',
            missingInsurance: insuranceResult.data.requiredInsurance.filter(ins => 
              !insuranceResult.data.userInsuranceStatus[ins.type] || 
              insuranceResult.data.userInsuranceStatus[ins.type].status !== 'approved'
            )
          });
        }
      }
    }

    // Age verification for restricted categories
    const restrictedCategories = ['childcare', 'medical', 'construction'];
    if (restrictedCategories.includes(skillCategory)) {
      const profileSnapshot = await db.ref(`profiles/${userId}`).once('value');
      const profile = profileSnapshot.val() || {};
      
      if (!profile.dateOfBirth) {
        canProceed = false;
        complianceIssues.push({
          type: 'age_verification',
          severity: 'high',
          message: 'Age verification required for this skill category'
        });
      } else {
        const age = Math.floor((new Date() - new Date(profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
        const minAge = complianceData?.restrictions?.minAge || 18;
        
        if (age < minAge) {
          canProceed = false;
          complianceIssues.push({
            type: 'age_restriction',
            severity: 'high',
            message: `Minimum age requirement not met (required: ${minAge}, current: ${age})`
          });
        }
      }
    }

    res.json({
      success: true,
      data: {
        canProceed,
        skillCategory,
        riskLevel: complianceData?.riskLevel || 'low',
        hasValidWaiver,
        complianceIssues,
        waiver: {
          required: !hasValidWaiver,
          validUntil: latestWaiver ? new Date(new Date(latestWaiver.acceptedAt).getTime() + validityDays * 24 * 60 * 60 * 1000).toISOString() : null,
          latest: latestWaiver
        },
        complianceStatus: complianceData?.complianceStatus,
        nextSteps: generateNextSteps(complianceIssues, hasValidWaiver)
      }
    });

  } catch (error) {
    logger.error('Compliance check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to perform compliance check' }
    });
  }
});

// Helper function to generate next steps
function generateNextSteps(issues, hasValidWaiver) {
  const steps = [];
  
  // Priority order: compliance, insurance, waiver, age
  const complianceIssue = issues.find(i => i.type === 'compliance');
  if (complianceIssue) {
    steps.push({
      action: 'complete_compliance',
      title: 'Complete Profile Requirements',
      description: 'Your profile must meet all compliance requirements before participating in this skill category',
      priority: 'high',
      url: '/compliance/dashboard'
    });
  }

  const insuranceIssue = issues.find(i => i.type === 'insurance');
  if (insuranceIssue) {
    steps.push({
      action: 'verify_insurance',
      title: 'Verify Insurance Coverage',
      description: 'Required insurance documentation must be submitted and approved',
      priority: 'high',
      url: '/insurance/submit'
    });
  }

  const ageIssue = issues.find(i => i.type === 'age_verification' || i.type === 'age_restriction');
  if (ageIssue) {
    steps.push({
      action: 'verify_age',
      title: 'Age Verification Required',
      description: ageIssue.message,
      priority: 'high',
      url: '/profile/edit'
    });
  }

  if (!hasValidWaiver && !complianceIssue && !insuranceIssue && !ageIssue) {
    steps.push({
      action: 'accept_waiver',
      title: 'Accept Liability Waiver',
      description: 'Read and accept the liability waiver for this activity',
      priority: 'medium',
      url: null // Handled by modal
    });
  }

  return steps;
}

// @desc    Accept updated terms and conditions
// @route   POST /api/liability/accept-terms
// @access  Private
router.post('/accept-terms', authenticateUser, async (req, res) => {
  try {
    const { version = '2024-12-01' } = req.body;

    const db = getDatabase();
    await db.ref(`users/${req.user.uid}/liability`).update({
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: version,
      updatedAt: new Date().toISOString()
    });

    logger.info(`Terms accepted by user ${req.user.uid}, version ${version}`);

    res.json({
      success: true,
      data: {
        message: 'Terms and conditions accepted successfully',
        version,
        acceptedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Terms acceptance error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to record terms acceptance' }
    });
  }
});

module.exports = router;