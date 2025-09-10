const express = require('express');
const { getDatabase } = require('../config/firebase');
const { optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { categorizeSkill, getSkillCategories } = require('../utils/skillCategorization');

const router = express.Router();

// AI Skill Matching Algorithm
function calculateSkillMatchScore(userA, userB) {
  let matchScore = 0;
  let matchDetails = [];

  // Direct skill matches (user A offers what user B wants)
  const userAOffered = (userA.skillsOffered || []).map(s => s.toLowerCase());
  const userBWanted = (userB.skillsWanted || []).map(s => s.toLowerCase());
  
  userAOffered.forEach(skillA => {
    userBWanted.forEach(skillB => {
      if (skillA.includes(skillB) || skillB.includes(skillA)) {
        matchScore += 10; // High score for direct matches
        matchDetails.push({
          type: 'direct_match',
          teacherSkill: skillA,
          learnerWant: skillB,
          points: 10
        });
      }
    });
  });

  // Reverse matches (user B offers what user A wants)
  const userBOffered = (userB.skillsOffered || []).map(s => s.toLowerCase());
  const userAWanted = (userA.skillsWanted || []).map(s => s.toLowerCase());
  
  userBOffered.forEach(skillB => {
    userAWanted.forEach(skillA => {
      if (skillB.includes(skillA) || skillA.includes(skillB)) {
        matchScore += 10; // High score for mutual exchange potential
        matchDetails.push({
          type: 'reverse_match',
          teacherSkill: skillB,
          learnerWant: skillA,
          points: 10
        });
      }
    });
  });

  // Category-based matches (same category skills)
  userAOffered.forEach(skillA => {
    const categoryA = categorizeSkill(skillA);
    userBWanted.forEach(skillB => {
      const categoryB = categorizeSkill(skillB);
      if (categoryA === categoryB && categoryA !== 'Other') {
        matchScore += 3; // Lower score for category matches
        matchDetails.push({
          type: 'category_match',
          category: categoryA,
          points: 3
        });
      }
    });
  });

  // Location proximity bonus (if both have location data)
  if (userA.location && userB.location) {
    // Simple same-city check (can be enhanced with actual distance calculation)
    if (userA.location.city === userB.location.city) {
      matchScore += 5;
      matchDetails.push({
        type: 'location_bonus',
        city: userA.location.city,
        points: 5
      });
    }
  }

  return {
    score: matchScore,
    details: matchDetails
  };
}

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, popular = false } = req.query;
    
    const db = getDatabase();
    
    // Get all skills from users
    const usersSnapshot = await db.ref('users').once('value');
    const skillsMap = new Map();

    usersSnapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      
      // Count offered skills
      (user.skillsOffered || []).forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (!skillsMap.has(skillLower)) {
          skillsMap.set(skillLower, {
            name: skill,
            offeredBy: 0,
            wantedBy: 0,
            category: categorizeSkill(skill)
          });
        }
        skillsMap.get(skillLower).offeredBy++;
      });

      // Count wanted skills
      (user.skillsWanted || []).forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (!skillsMap.has(skillLower)) {
          skillsMap.set(skillLower, {
            name: skill,
            offeredBy: 0,
            wantedBy: 0,
            category: categorizeSkill(skill)
          });
        }
        skillsMap.get(skillLower).wantedBy++;
      });
    });

    let skills = Array.from(skillsMap.values());

    // Apply filters
    if (category) {
      skills = skills.filter(skill => skill.category === category);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      skills = skills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm)
      );
    }

    if (popular === 'true') {
      skills = skills.filter(skill => skill.offeredBy > 0 && skill.wantedBy > 0);
    }

    // Sort by popularity (total mentions)
    skills.sort((a, b) => (b.offeredBy + b.wantedBy) - (a.offeredBy + a.wantedBy));

    res.json({
      success: true,
      data: {
        skills,
        total: skills.length,
        categories: getSkillCategories()
      }
    });

  } catch (error) {
    logger.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skills' }
    });
  }
});

// @desc    Get skill details
// @route   GET /api/skills/:skillName
// @access  Public
router.get('/:skillName', async (req, res) => {
  try {
    const { skillName } = req.params;
    const skillLower = skillName.toLowerCase();
    
    const db = getDatabase();
    const usersSnapshot = await db.ref('users').once('value');
    
    const teachers = [];
    const learners = [];

    usersSnapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      
      // Remove sensitive information
      delete user.email;
      delete user.lastLoginAt;

      // Check if user offers this skill
      if (user.skillsOffered && user.skillsOffered.some(skill => 
        skill.toLowerCase().includes(skillLower))) {
        teachers.push({
          ...user,
          type: 'teacher'
        });
      }

      // Check if user wants this skill
      if (user.skillsWanted && user.skillsWanted.some(skill => 
        skill.toLowerCase().includes(skillLower))) {
        learners.push({
          ...user,
          type: 'learner'
        });
      }
    });

    res.json({
      success: true,
      data: {
        skill: skillName,
        category: categorizeSkill(skillName),
        teachers,
        learners,
        totalTeachers: teachers.length,
        totalLearners: learners.length
      }
    });

  } catch (error) {
    logger.error('Get skill details error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skill details' }
    });
  }
});

// @desc    Get skill suggestions
// @route   GET /api/skills/suggestions
// @access  Public
router.get('/suggestions/autocomplete', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const db = getDatabase();
    const usersSnapshot = await db.ref('users').once('value');
    const skillsSet = new Set();

    usersSnapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      
      (user.skillsOffered || []).forEach(skill => skillsSet.add(skill));
      (user.skillsWanted || []).forEach(skill => skillsSet.add(skill));
    });

    const searchTerm = query.toLowerCase();
    const suggestions = Array.from(skillsSet)
      .filter(skill => skill.toLowerCase().includes(searchTerm))
      .slice(0, parseInt(limit))
      .map(skill => ({
        name: skill,
        category: categorizeSkill(skill)
      }));

    res.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    logger.error('Get skill suggestions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch suggestions' }
    });
  }
});

// @desc    Get AI-powered skill matches for a user
// @route   GET /api/skills/matches/:userId
// @access  Public (with user ID)
router.get('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, minScore = 5 } = req.query;

    const db = getDatabase();
    
    // Get the target user
    const targetUserSnapshot = await db.ref(`users/${userId}`).once('value');
    if (!targetUserSnapshot.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const targetUser = { id: userId, ...targetUserSnapshot.val() };
    
    // Get all other users
    const usersSnapshot = await db.ref('users').once('value');
    const matches = [];

    usersSnapshot.forEach(childSnapshot => {
      const otherUserId = childSnapshot.key;
      if (otherUserId !== userId) {
        const otherUser = { id: otherUserId, ...childSnapshot.val() };
        
        // Calculate match score
        const matchResult = calculateSkillMatchScore(targetUser, otherUser);
        
        if (matchResult.score >= minScore) {
          // Remove sensitive information
          delete otherUser.email;
          delete otherUser.lastLoginAt;
          
          matches.push({
            user: otherUser,
            matchScore: matchResult.score,
            matchDetails: matchResult.details
          });
        }
      }
    });

    // Sort by match score (highest first) and limit results
    const sortedMatches = matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        targetUserId: userId,
        matches: sortedMatches,
        totalMatches: sortedMatches.length,
        algorithm: 'ai_skill_matching_v1'
      }
    });

  } catch (error) {
    logger.error('Get skill matches error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skill matches' }
    });
  }
});

// @desc    Get optimal skill exchange pairs in the community
// @route   GET /api/skills/exchange-pairs
// @access  Public
router.get('/exchange-pairs', async (req, res) => {
  try {
    const { limit = 20, minScore = 10 } = req.query;

    const db = getDatabase();
    const usersSnapshot = await db.ref('users').once('value');
    const users = [];
    
    // Collect all users
    usersSnapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      delete user.email;
      delete user.lastLoginAt;
      users.push(user);
    });

    const exchangePairs = [];

    // Calculate mutual exchange potential between all user pairs
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const userA = users[i];
        const userB = users[j];
        
        const matchResult = calculateSkillMatchScore(userA, userB);
        
        // Check for mutual exchange potential (both users can teach each other)
        const mutualExchange = matchResult.details.some(detail => 
          detail.type === 'direct_match'
        ) && matchResult.details.some(detail => 
          detail.type === 'reverse_match'
        );

        if (matchResult.score >= minScore && mutualExchange) {
          exchangePairs.push({
            userA: userA,
            userB: userB,
            exchangeScore: matchResult.score,
            exchangeDetails: matchResult.details,
            mutualExchange: true
          });
        }
      }
    }

    // Sort by exchange score and limit results
    const sortedPairs = exchangePairs
      .sort((a, b) => b.exchangeScore - a.exchangeScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        exchangePairs: sortedPairs,
        totalPairs: sortedPairs.length,
        algorithm: 'mutual_skill_exchange_v1'
      }
    });

  } catch (error) {
    logger.error('Get exchange pairs error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch exchange pairs' }
    });
  }
});

module.exports = router;