const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Insurance types and requirements
const INSURANCE_TYPES = {
  'general_liability': {
    name: 'General Liability Insurance',
    description: 'Protects against claims of bodily injury or property damage',
    requiredFor: ['physical-training', 'construction', 'home-repair', 'childcare'],
    minimumCoverage: 1000000,
    documents: ['policy_certificate', 'policy_schedule'],
    verificationRequired: true
  },
  'professional_liability': {
    name: 'Professional Liability Insurance',
    description: 'Covers claims related to professional errors or negligence',
    requiredFor: ['medical', 'legal', 'financial', 'consulting'],
    minimumCoverage: 1000000,
    documents: ['policy_certificate', 'policy_schedule'],
    verificationRequired: true
  },
  'malpractice': {
    name: 'Medical Malpractice Insurance',
    description: 'Specific coverage for medical professionals',
    requiredFor: ['medical', 'nursing', 'therapy'],
    minimumCoverage: 2000000,
    documents: ['policy_certificate', 'policy_schedule', 'claims_history'],
    verificationRequired: true
  },
  'workers_compensation': {
    name: 'Workers Compensation Insurance',
    description: 'Required for businesses with employees',
    requiredFor: ['construction', 'cleaning', 'landscaping'],
    minimumCoverage: 500000,
    documents: ['policy_certificate', 'coverage_verification'],
    verificationRequired: true
  },
  'auto_liability': {
    name: 'Automotive Liability Insurance',
    description: 'Coverage for vehicle-related services',
    requiredFor: ['automotive', 'delivery', 'transportation'],
    minimumCoverage: 500000,
    documents: ['policy_certificate', 'vehicle_registration'],
    verificationRequired: false
  },
  'garage_liability': {
    name: 'Garage Liability Insurance',
    description: 'Specialized coverage for automotive services',
    requiredFor: ['automotive', 'mechanic'],
    minimumCoverage: 1000000,
    documents: ['policy_certificate', 'garage_keeper_coverage'],
    verificationRequired: true
  }
};

// Validation middleware
const validateInsuranceSubmission = [
  body('insuranceType').isIn(Object.keys(INSURANCE_TYPES)),
  body('policyNumber').trim().isLength({ min: 1, max: 50 }),
  body('insuranceCompany').trim().isLength({ min: 1, max: 100 }),
  body('coverageAmount').isNumeric().toFloat(),
  body('effectiveDate').isISO8601(),
  body('expirationDate').isISO8601(),
  body('documentIds').isArray().isLength({ min: 1 }),
  body('additionalDetails').optional().trim().isLength({ max: 1000 })
];

// @desc    Get insurance types and requirements
// @route   GET /api/insurance/types
// @access  Public
router.get('/types', async (req, res) => {
  try {
    const { skillCategory } = req.query;
    
    let relevantInsurance = INSURANCE_TYPES;
    
    if (skillCategory) {
      relevantInsurance = Object.fromEntries(
        Object.entries(INSURANCE_TYPES).filter(([, insurance]) => 
          insurance.requiredFor.includes(skillCategory)
        )
      );
    }

    res.json({
      success: true,
      data: {
        insuranceTypes: relevantInsurance,
        skillCategory,
        totalTypes: Object.keys(relevantInsurance).length
      }
    });

  } catch (error) {
    logger.error('Get insurance types error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch insurance types' }
    });
  }
});

// @desc    Submit insurance information
// @route   POST /api/insurance/submit
// @access  Private
router.post('/submit', authenticateUser, validateInsuranceSubmission, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const {
      insuranceType,
      policyNumber,
      insuranceCompany,
      coverageAmount,
      effectiveDate,
      expirationDate,
      documentIds,
      additionalDetails = ''
    } = req.body;

    const userId = req.user.uid;
    const insuranceInfo = INSURANCE_TYPES[insuranceType];

    // Validate coverage amount meets minimum requirements
    if (coverageAmount < insuranceInfo.minimumCoverage) {
      return res.status(400).json({
        success: false,
        error: { 
          message: `Coverage amount must be at least $${insuranceInfo.minimumCoverage.toLocaleString()}`,
          minimumRequired: insuranceInfo.minimumCoverage,
          provided: coverageAmount
        }
      });
    }

    // Validate dates
    const effective = new Date(effectiveDate);
    const expiration = new Date(expirationDate);
    const now = new Date();

    if (effective > now) {
      return res.status(400).json({
        success: false,
        error: { message: 'Insurance must be currently effective' }
      });
    }

    if (expiration < now) {
      return res.status(400).json({
        success: false,
        error: { message: 'Insurance policy has expired' }
      });
    }

    const db = getDatabase();
    
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

    // Create insurance record
    const insuranceRef = db.ref('user_insurance').push();
    const insuranceId = insuranceRef.key;
    
    const insuranceRecord = {
      id: insuranceId,
      userId,
      insuranceType,
      policyNumber,
      insuranceCompany,
      coverageAmount,
      effectiveDate,
      expirationDate,
      documentIds,
      additionalDetails,
      status: insuranceInfo.verificationRequired ? 'pending_verification' : 'approved',
      submittedAt: new Date().toISOString(),
      verifiedAt: insuranceInfo.verificationRequired ? null : new Date().toISOString(),
      verifiedBy: insuranceInfo.verificationRequired ? null : 'system',
      insuranceInfo
    };

    await insuranceRef.set(insuranceRecord);

    // Update user's insurance status
    await db.ref(`user_insurance_status/${userId}/${insuranceType}`).set({
      status: insuranceRecord.status,
      insuranceId,
      expirationDate,
      lastUpdated: new Date().toISOString()
    });

    // Schedule expiration reminder (30 days before expiration)
    const reminderDate = new Date(expiration);
    reminderDate.setDate(reminderDate.getDate() - 30);
    
    if (reminderDate > now) {
      await db.ref(`insurance_reminders/${insuranceId}`).set({
        userId,
        insuranceType,
        expirationDate,
        reminderDate: reminderDate.toISOString(),
        status: 'scheduled'
      });
    }

    logger.info(`Insurance submitted by user ${userId} for ${insuranceType}`);

    res.status(201).json({
      success: true,
      data: {
        insuranceId,
        status: insuranceRecord.status,
        submittedAt: insuranceRecord.submittedAt,
        requiresVerification: insuranceInfo.verificationRequired,
        message: 'Insurance information submitted successfully'
      }
    });

  } catch (error) {
    logger.error('Insurance submission error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit insurance information' }
    });
  }
});

// @desc    Get user's insurance status
// @route   GET /api/insurance/status
// @access  Private
router.get('/status', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const db = getDatabase();

    // Get all insurance records for user
    const insuranceSnapshot = await db.ref('user_insurance')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const insuranceRecords = [];
    insuranceSnapshot.forEach(childSnapshot => {
      insuranceRecords.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });

    // Get current status summary
    const statusSnapshot = await db.ref(`user_insurance_status/${userId}`).once('value');
    const statusSummary = statusSnapshot.val() || {};

    // Check for expiring insurance (next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringInsurance = insuranceRecords.filter(record => 
      record.status === 'approved' && 
      new Date(record.expirationDate) <= thirtyDaysFromNow
    );

    // Calculate compliance score
    const totalRequired = Object.keys(INSURANCE_TYPES).length;
    const approved = Object.values(statusSummary).filter(status => status.status === 'approved').length;
    const complianceScore = totalRequired > 0 ? Math.round((approved / totalRequired) * 100) : 100;

    res.json({
      success: true,
      data: {
        insuranceRecords: insuranceRecords.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
        statusSummary,
        expiringInsurance,
        complianceScore,
        totalRecords: insuranceRecords.length,
        approvedCount: approved,
        expiringCount: expiringInsurance.length
      }
    });

  } catch (error) {
    logger.error('Get insurance status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch insurance status' }
    });
  }
});

// @desc    Check insurance requirements for skill category
// @route   GET /api/insurance/requirements/:skillCategory
// @access  Public
router.get('/requirements/:skillCategory', async (req, res) => {
  try {
    const { skillCategory } = req.params;
    const { userId } = req.query;

    // Get required insurance types for this skill category
    const requiredInsurance = Object.entries(INSURANCE_TYPES)
      .filter(([, insurance]) => insurance.requiredFor.includes(skillCategory))
      .map(([key, insurance]) => ({ 
        type: key, 
        ...insurance,
        required: true
      }));

    let userInsuranceStatus = {};
    
    if (userId) {
      const db = getDatabase();
      const statusSnapshot = await db.ref(`user_insurance_status/${userId}`).once('value');
      userInsuranceStatus = statusSnapshot.val() || {};
    }

    // Calculate compliance
    const compliantInsurance = requiredInsurance.filter(insurance => 
      userInsuranceStatus[insurance.type]?.status === 'approved'
    ).length;
    
    const complianceScore = requiredInsurance.length > 0 ? 
      Math.round((compliantInsurance / requiredInsurance.length) * 100) : 100;

    res.json({
      success: true,
      data: {
        skillCategory,
        requiredInsurance,
        userInsuranceStatus,
        complianceScore,
        isCompliant: complianceScore === 100,
        totalRequired: requiredInsurance.length,
        userCompliant: compliantInsurance
      }
    });

  } catch (error) {
    logger.error('Get insurance requirements error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch insurance requirements' }
    });
  }
});

// @desc    Admin: Verify insurance record
// @route   PUT /api/insurance/admin/verify/:insuranceId
// @access  Private (Admin)
router.put('/admin/verify/:insuranceId', authenticateUser, async (req, res) => {
  try {
    // Basic admin check
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    const { insuranceId } = req.params;
    const { action, notes = '' } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Action must be approve or reject' }
      });
    }

    const db = getDatabase();
    const insuranceSnapshot = await db.ref(`user_insurance/${insuranceId}`).once('value');
    
    if (!insuranceSnapshot.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'Insurance record not found' }
      });
    }

    const insurance = insuranceSnapshot.val();
    const verificationData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      verifiedAt: new Date().toISOString(),
      verifiedBy: req.user.uid,
      verificationNotes: notes
    };

    // Update insurance record
    await db.ref(`user_insurance/${insuranceId}`).update(verificationData);
    
    // Update user status
    await db.ref(`user_insurance_status/${insurance.userId}/${insurance.insuranceType}`).update({
      status: verificationData.status,
      verifiedAt: verificationData.verifiedAt,
      lastUpdated: verificationData.verifiedAt
    });

    logger.info(`Insurance ${insuranceId} ${action}d by admin ${req.user.uid}`);

    res.json({
      success: true,
      data: {
        insuranceId,
        action,
        verifiedAt: verificationData.verifiedAt,
        message: `Insurance ${action}d successfully`
      }
    });

  } catch (error) {
    logger.error('Insurance verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to verify insurance' }
    });
  }
});

// @desc    Get expiring insurance alerts
// @route   GET /api/insurance/expiring
// @access  Private
router.get('/expiring', authenticateUser, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const userId = req.user.uid;
    const db = getDatabase();

    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + parseInt(days));

    const insuranceSnapshot = await db.ref('user_insurance')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const expiringInsurance = [];
    insuranceSnapshot.forEach(childSnapshot => {
      const insurance = childSnapshot.val();
      if (insurance.status === 'approved' && 
          new Date(insurance.expirationDate) <= alertDate) {
        expiringInsurance.push({
          id: childSnapshot.key,
          ...insurance,
          daysUntilExpiration: Math.ceil(
            (new Date(insurance.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
          )
        });
      }
    });

    // Sort by expiration date (soonest first)
    expiringInsurance.sort((a, b) => 
      new Date(a.expirationDate) - new Date(b.expirationDate)
    );

    res.json({
      success: true,
      data: {
        expiringInsurance,
        alertThreshold: parseInt(days),
        totalExpiring: expiringInsurance.length,
        urgentCount: expiringInsurance.filter(ins => ins.daysUntilExpiration <= 7).length
      }
    });

  } catch (error) {
    logger.error('Get expiring insurance error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch expiring insurance' }
    });
  }
});

// @desc    Update insurance expiration reminder preferences
// @route   PUT /api/insurance/reminder-preferences
// @access  Private
router.put('/reminder-preferences', authenticateUser, async (req, res) => {
  try {
    const { emailReminders = true, smsReminders = false, reminderDays = [30, 14, 7] } = req.body;
    const userId = req.user.uid;
    const db = getDatabase();

    const preferences = {
      emailReminders,
      smsReminders,
      reminderDays: reminderDays.filter(days => days > 0 && days <= 90),
      updatedAt: new Date().toISOString()
    };

    await db.ref(`user_preferences/${userId}/insurance_reminders`).set(preferences);

    res.json({
      success: true,
      data: {
        preferences,
        message: 'Reminder preferences updated successfully'
      }
    });

  } catch (error) {
    logger.error('Update reminder preferences error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update reminder preferences' }
    });
  }
});

// @desc    Get insurance statistics (admin only)
// @route   GET /api/insurance/stats
// @access  Private (Admin)
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    const db = getDatabase();
    const insuranceSnapshot = await db.ref('user_insurance').once('value');
    
    const stats = {
      totalRecords: 0,
      byType: {},
      byStatus: { pending_verification: 0, approved: 0, rejected: 0, expired: 0 },
      expiringIn30Days: 0,
      averageCoverage: {},
      recentSubmissions: 0
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    insuranceSnapshot.forEach(childSnapshot => {
      const insurance = childSnapshot.val();
      stats.totalRecords++;
      
      // Count by type
      stats.byType[insurance.insuranceType] = (stats.byType[insurance.insuranceType] || 0) + 1;
      
      // Count by status
      const isExpired = new Date(insurance.expirationDate) < new Date();
      if (isExpired) {
        stats.byStatus.expired++;
      } else {
        stats.byStatus[insurance.status]++;
      }
      
      // Count expiring
      if (new Date(insurance.expirationDate) <= thirtyDaysFromNow && !isExpired) {
        stats.expiringIn30Days++;
      }
      
      // Recent submissions
      if (new Date(insurance.submittedAt) > thirtyDaysAgo) {
        stats.recentSubmissions++;
      }
      
      // Average coverage by type
      if (!stats.averageCoverage[insurance.insuranceType]) {
        stats.averageCoverage[insurance.insuranceType] = { total: 0, count: 0 };
      }
      stats.averageCoverage[insurance.insuranceType].total += insurance.coverageAmount;
      stats.averageCoverage[insurance.insuranceType].count++;
    });

    // Calculate averages
    Object.keys(stats.averageCoverage).forEach(type => {
      const data = stats.averageCoverage[type];
      stats.averageCoverage[type] = Math.round(data.total / data.count);
    });

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Insurance stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch insurance statistics' }
    });
  }
});

module.exports = router;