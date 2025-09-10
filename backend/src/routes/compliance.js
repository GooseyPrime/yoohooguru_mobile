const express = require('express');
const { getDatabase } = require('../config/firebase');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Profile compliance requirements by skill category
const COMPLIANCE_REQUIREMENTS = {
  'physical-training': {
    name: 'Physical Training & Fitness',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['liability_insurance', 'first_aid_cert'],
      badges: ['safety-certified', 'insured-provider'],
      verification: ['background_check'],
      insurance: {
        types: ['general_liability'],
        minimumCoverage: 1000000
      }
    },
    restrictions: {
      minAge: 18,
      maxParticipants: 8,
      requiresWaiver: true,
      emergencyContactRequired: true
    }
  },
  'childcare': {
    name: 'Childcare & Education',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo', 'references'],
      documents: ['background_check', 'child_protection_training'],
      badges: ['background-verified'],
      verification: ['criminal_background_check', 'child_abuse_clearance'],
      insurance: {
        types: ['general_liability', 'professional_liability'],
        minimumCoverage: 1000000
      }
    },
    restrictions: {
      minAge: 21,
      maxParticipants: 6,
      requiresWaiver: true,
      parentalConsentRequired: true
    }
  },
  'medical': {
    name: 'Medical & Health Services',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo', 'credentials'],
      documents: ['professional_license', 'malpractice_insurance'],
      badges: ['licensed-professional', 'insured-provider'],
      verification: ['license_verification', 'education_verification'],
      insurance: {
        types: ['malpractice', 'general_liability'],
        minimumCoverage: 2000000
      }
    },
    restrictions: {
      minAge: 25,
      scopeOfPractice: 'must_match_license',
      requiresWaiver: true,
      medicalHistoryRequired: true
    }
  },
  'construction': {
    name: 'Construction & Home Repair',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['contractors_license', 'liability_insurance', 'workers_comp'],
      badges: ['licensed-professional', 'insured-provider'],
      verification: ['license_verification'],
      insurance: {
        types: ['general_liability', 'workers_compensation'],
        minimumCoverage: 1000000
      }
    },
    restrictions: {
      minAge: 18,
      requiresWaiver: true,
      propertyWaiverRequired: true
    }
  },
  'automotive': {
    name: 'Automotive Services',
    riskLevel: 'medium',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['auto_insurance', 'mechanic_certification'],
      badges: ['insured-provider'],
      verification: ['certification_verification'],
      insurance: {
        types: ['auto_liability', 'garage_liability'],
        minimumCoverage: 500000
      }
    },
    restrictions: {
      minAge: 18,
      requiresWaiver: true,
      vehicleInspectionRequired: true
    }
  },
  'tutoring': {
    name: 'Tutoring & Education',
    riskLevel: 'medium',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo', 'education'],
      documents: ['background_check', 'education_verification'],
      badges: ['background-verified'],
      verification: ['background_check'],
      insurance: {
        types: ['general_liability'],
        minimumCoverage: 500000
      }
    },
    restrictions: {
      minAge: 18,
      requiresWaiver: false,
      parentalConsentRequired: true
    }
  },
  'cooking': {
    name: 'Cooking & Food Services',
    riskLevel: 'medium',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['food_handlers_permit', 'kitchen_insurance'],
      badges: [],
      verification: ['food_safety_certification'],
      insurance: {
        types: ['general_liability'],
        minimumCoverage: 500000
      }
    },
    restrictions: {
      minAge: 18,
      allergyDisclosureRequired: true,
      kitchenInspectionRequired: true
    }
  },
  'arts-crafts': {
    name: 'Arts & Crafts',
    riskLevel: 'low',
    required: {
      profile: ['displayName', 'bio', 'location'],
      documents: [],
      badges: [],
      verification: [],
      insurance: {
        types: [],
        minimumCoverage: 0
      }
    },
    restrictions: {
      minAge: 16,
      requiresWaiver: false
    }
  },
  'technology': {
    name: 'Technology & IT',
    riskLevel: 'low',
    required: {
      profile: ['displayName', 'bio', 'location'],
      documents: [],
      badges: [],
      verification: [],
      insurance: {
        types: [],
        minimumCoverage: 0
      }
    },
    restrictions: {
      minAge: 16,
      requiresWaiver: false
    }
  }
};

// @desc    Get compliance requirements for skill category
// @route   GET /api/compliance/requirements/:skillCategory
// @access  Public
router.get('/requirements/:skillCategory', async (req, res) => {
  try {
    const { skillCategory } = req.params;
    
    const requirements = COMPLIANCE_REQUIREMENTS[skillCategory];
    if (!requirements) {
      return res.status(404).json({
        success: false,
        error: { message: 'Skill category not found' }
      });
    }

    res.json({
      success: true,
      data: {
        skillCategory,
        requirements,
        lastUpdated: '2024-12-01'
      }
    });

  } catch (error) {
    logger.error('Get compliance requirements error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch compliance requirements' }
    });
  }
});

// @desc    Check user compliance status
// @route   GET /api/compliance/status/:skillCategory
// @access  Private
router.get('/status/:skillCategory', authenticateUser, async (req, res) => {
  try {
    const { skillCategory } = req.params;
    const userId = req.user.uid;
    
    const requirements = COMPLIANCE_REQUIREMENTS[skillCategory];
    if (!requirements) {
      return res.status(404).json({
        success: false,
        error: { message: 'Skill category not found' }
      });
    }

    const db = getDatabase();
    
    // Get user profile, documents, badges, and verification status
    const [profileSnap, docsSnap, badgesSnap, verificationSnap] = await Promise.all([
      db.ref(`profiles/${userId}`).once('value'),
      db.ref(`profile_documents/${userId}`).once('value'),
      db.ref('user_badges').orderByChild('userId').equalTo(userId).once('value'),
      db.ref(`user_verifications/${userId}`).once('value')
    ]);

    const profile = profileSnap.val() || {};
    const documents = docsSnap.val() || {};
    const verifications = verificationSnap.val() || {};
    
    const userBadges = [];
    badgesSnap.forEach(childSnapshot => {
      const badge = childSnapshot.val();
      if (badge.status === 'approved') {
        userBadges.push(badge.badgeType);
      }
    });

    // Check compliance for each requirement type
    const complianceStatus = {
      profile: checkProfileCompliance(profile, requirements.required.profile),
      documents: checkDocumentCompliance(documents, requirements.required.documents),
      badges: checkBadgeCompliance(userBadges, requirements.required.badges),
      verification: checkVerificationCompliance(verifications, requirements.required.verification),
      insurance: checkInsuranceCompliance(documents, requirements.required.insurance),
      overall: false
    };

    // Calculate overall compliance
    const allCompliant = Object.entries(complianceStatus)
      .filter(([key]) => key !== 'overall')
      .every(([, status]) => status.compliant);

    complianceStatus.overall = {
      compliant: allCompliant,
      score: calculateComplianceScore(complianceStatus),
      canParticipate: allCompliant,
      restrictions: allCompliant ? [] : getApplicableRestrictions(complianceStatus)
    };

    res.json({
      success: true,
      data: {
        skillCategory,
        riskLevel: requirements.riskLevel,
        complianceStatus,
        requirements: requirements.required,
        restrictions: requirements.restrictions,
        lastChecked: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Compliance status check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check compliance status' }
    });
  }
});

// @desc    Get user's overall compliance dashboard
// @route   GET /api/compliance/dashboard
// @access  Private
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const db = getDatabase();

    // Get user's selected skill categories
    const categoriesSnap = await db.ref(`profile_categories/${userId}`).once('value');
    const userCategories = Object.keys(categoriesSnap.val() || {});

    // Check compliance for each category
    const complianceResults = await Promise.all(
      userCategories.map(async (category) => {
        if (!COMPLIANCE_REQUIREMENTS[category]) return null;
        
        try {
          // Reuse the compliance checking logic
          const [profileSnap, docsSnap, badgesSnap, verificationSnap] = await Promise.all([
            db.ref(`profiles/${userId}`).once('value'),
            db.ref(`profile_documents/${userId}`).once('value'),
            db.ref('user_badges').orderByChild('userId').equalTo(userId).once('value'),
            db.ref(`user_verifications/${userId}`).once('value')
          ]);

          const profile = profileSnap.val() || {};
          const documents = docsSnap.val() || {};
          const verifications = verificationSnap.val() || {};
          
          const userBadges = [];
          badgesSnap.forEach(childSnapshot => {
            const badge = childSnapshot.val();
            if (badge.status === 'approved') {
              userBadges.push(badge.badgeType);
            }
          });

          const requirements = COMPLIANCE_REQUIREMENTS[category].required;
          
          const complianceStatus = {
            profile: checkProfileCompliance(profile, requirements.profile),
            documents: checkDocumentCompliance(documents, requirements.documents),
            badges: checkBadgeCompliance(userBadges, requirements.badges),
            verification: checkVerificationCompliance(verifications, requirements.verification),
            insurance: checkInsuranceCompliance(documents, requirements.insurance)
          };

          const overallCompliant = Object.values(complianceStatus).every(status => status.compliant);
          const score = calculateComplianceScore(complianceStatus);

          return {
            category,
            name: COMPLIANCE_REQUIREMENTS[category].name,
            riskLevel: COMPLIANCE_REQUIREMENTS[category].riskLevel,
            compliant: overallCompliant,
            score,
            status: complianceStatus,
            canParticipate: overallCompliant
          };
        } catch (err) {
          logger.error(`Compliance check failed for category ${category}:`, err);
          return {
            category,
            name: COMPLIANCE_REQUIREMENTS[category].name,
            error: 'Failed to check compliance'
          };
        }
      })
    );

    const validResults = complianceResults.filter(result => result !== null);
    
    // Calculate overall metrics
    const totalCategories = validResults.length;
    const compliantCategories = validResults.filter(r => r.compliant).length;
    const averageScore = totalCategories > 0 ? 
      Math.round(validResults.reduce((sum, r) => sum + (r.score || 0), 0) / totalCategories) : 0;

    const highRiskCategories = validResults.filter(r => r.riskLevel === 'high');
    const highRiskCompliant = highRiskCategories.filter(r => r.compliant).length;

    res.json({
      success: true,
      data: {
        overview: {
          totalCategories,
          compliantCategories,
          complianceRate: totalCategories > 0 ? Math.round((compliantCategories / totalCategories) * 100) : 0,
          averageScore,
          highRiskCategories: highRiskCategories.length,
          highRiskCompliant
        },
        categories: validResults,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Compliance dashboard error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to load compliance dashboard' }
    });
  }
});

// @desc    Update user verification status (admin only)
// @route   PUT /api/compliance/verification/:userId
// @access  Private (Admin)
router.put('/verification/:userId', authenticateUser, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Admin access required' }
      });
    }

    const { userId } = req.params;
    const { verificationType, status, notes = '' } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid verification status' }
      });
    }

    const db = getDatabase();
    const verificationUpdate = {
      [verificationType]: {
        status,
        verifiedAt: status === 'approved' ? new Date().toISOString() : null,
        verifiedBy: req.user.uid,
        notes,
        updatedAt: new Date().toISOString()
      }
    };

    await db.ref(`user_verifications/${userId}`).update(verificationUpdate);

    logger.info(`Verification ${verificationType} ${status} for user ${userId} by admin ${req.user.uid}`);

    res.json({
      success: true,
      data: {
        userId,
        verificationType,
        status,
        updatedAt: verificationUpdate[verificationType].updatedAt,
        message: `Verification ${status} successfully`
      }
    });

  } catch (error) {
    logger.error('Update verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update verification status' }
    });
  }
});

// Helper functions
function checkProfileCompliance(profile, requiredFields) {
  const missingFields = requiredFields.filter(field => !profile[field] || profile[field].trim() === '');
  return {
    compliant: missingFields.length === 0,
    missingFields,
    completedFields: requiredFields.filter(field => profile[field] && profile[field].trim() !== '')
  };
}

function checkDocumentCompliance(documents, requiredDocs) {
  const missingDocs = requiredDocs.filter(docType => {
    const userDocs = Object.values(documents).filter(doc => 
      doc.type === docType && doc.status === 'approved'
    );
    return userDocs.length === 0;
  });
  
  return {
    compliant: missingDocs.length === 0,
    missingDocuments: missingDocs,
    approvedDocuments: requiredDocs.filter(docType => {
      const userDocs = Object.values(documents).filter(doc => 
        doc.type === docType && doc.status === 'approved'
      );
      return userDocs.length > 0;
    })
  };
}

function checkBadgeCompliance(userBadges, requiredBadges) {
  const missingBadges = requiredBadges.filter(badge => !userBadges.includes(badge));
  return {
    compliant: missingBadges.length === 0,
    missingBadges,
    earnedBadges: requiredBadges.filter(badge => userBadges.includes(badge))
  };
}

function checkVerificationCompliance(verifications, requiredVerifications) {
  const missingVerifications = requiredVerifications.filter(verification => 
    !verifications[verification] || verifications[verification].status !== 'approved'
  );
  
  return {
    compliant: missingVerifications.length === 0,
    missingVerifications,
    completedVerifications: requiredVerifications.filter(verification => 
      verifications[verification] && verifications[verification].status === 'approved'
    )
  };
}

function checkInsuranceCompliance(documents, insuranceReq) {
  if (!insuranceReq.types || insuranceReq.types.length === 0) {
    return { compliant: true, missingInsurance: [], approvedInsurance: [] };
  }

  const missingInsurance = insuranceReq.types.filter(type => {
    const insuranceDocs = Object.values(documents).filter(doc => 
      doc.type === 'insurance' && 
      doc.insuranceType === type && 
      doc.status === 'approved' &&
      (!insuranceReq.minimumCoverage || doc.coverageAmount >= insuranceReq.minimumCoverage)
    );
    return insuranceDocs.length === 0;
  });

  return {
    compliant: missingInsurance.length === 0,
    missingInsurance,
    approvedInsurance: insuranceReq.types.filter(type => !missingInsurance.includes(type))
  };
}

function calculateComplianceScore(complianceStatus) {
  const categories = Object.keys(complianceStatus).filter(key => key !== 'overall');
  const compliantCount = categories.filter(cat => complianceStatus[cat].compliant).length;
  return Math.round((compliantCount / categories.length) * 100);
}

function getApplicableRestrictions(complianceStatus) {
  const restrictions = [];
  
  if (!complianceStatus.profile.compliant) {
    restrictions.push('Complete profile required');
  }
  
  if (!complianceStatus.documents.compliant) {
    restrictions.push('Required documents missing');
  }
  
  if (!complianceStatus.badges.compliant) {
    restrictions.push('Required badges not earned');
  }
  
  if (!complianceStatus.verification.compliant) {
    restrictions.push('Background verification required');
  }
  
  if (!complianceStatus.insurance.compliant) {
    restrictions.push('Insurance verification required');
  }

  return restrictions;
}

module.exports = router;