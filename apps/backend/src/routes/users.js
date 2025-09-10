const express = require('express');
const { getDatabase } = require('../config/firebase');
const { authenticateUser, optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @desc    Get all users (with optional filters)
// @route   GET /api/users
// @access  Public/Private
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { tier, skills, location, limit = 50, offset = 0 } = req.query;
    
    const db = getDatabase();
    let usersRef = db.ref('users');
    
    // Apply basic ordering and limiting
    if (limit) {
      usersRef = usersRef.limitToFirst(parseInt(limit));
    }

    const snapshot = await usersRef.once('value');
    let users = [];

    snapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      
      // Remove sensitive information
      delete user.email;
      delete user.lastLoginAt;
      
      // Apply filters
      if (tier && user.tier !== tier) return;
      if (location && !user.location.toLowerCase().includes(location.toLowerCase())) return;
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
        const userSkills = [...(user.skillsOffered || []), ...(user.skillsWanted || [])]
          .map(s => s.toLowerCase());
        
        if (!skillsArray.some(skill => userSkills.some(userSkill => userSkill.includes(skill)))) {
          return;
        }
      }
      
      users.push(user);
    });

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        total: users.length,
        page: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(users.length / limit)
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users' }
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDatabase();
    const userSnapshot = await db.ref(`users/${id}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Remove sensitive information
    delete userData.email;
    delete userData.lastLoginAt;

    res.json({
      success: true,
      data: { id, ...userData }
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user' }
    });
  }
});

// @desc    Search users by skills
// @route   GET /api/users/search/skills
// @access  Public
router.get('/search/skills', async (req, res) => {
  try {
    const { q: query, type = 'both' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search query is required' }
      });
    }

    const searchTerm = query.toLowerCase();
    const db = getDatabase();
    const snapshot = await db.ref('users').once('value');
    const results = [];

    snapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      
      // Remove sensitive information
      delete user.email;
      delete user.lastLoginAt;
      
      let matchFound = false;
      
      if (type === 'offered' || type === 'both') {
        const offeredSkills = user.skillsOffered || [];
        if (offeredSkills.some(skill => skill.toLowerCase().includes(searchTerm))) {
          matchFound = true;
        }
      }
      
      if (type === 'wanted' || type === 'both') {
        const wantedSkills = user.skillsWanted || [];
        if (wantedSkills.some(skill => skill.toLowerCase().includes(searchTerm))) {
          matchFound = true;
        }
      }
      
      if (matchFound) {
        results.push(user);
      }
    });

    res.json({
      success: true,
      data: {
        users: results,
        query: query,
        total: results.length
      }
    });

  } catch (error) {
    logger.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Search failed' }
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getDatabase();
    
    // Get user data
    const userSnapshot = await db.ref(`users/${id}`).once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get user's exchanges
    const exchangesSnapshot = await db.ref('exchanges')
      .orderByChild('teacherId')
      .equalTo(id)
      .once('value');
    
    let totalExchanges = 0;
    let totalRating = 0;
    let ratingCount = 0;

    exchangesSnapshot.forEach(childSnapshot => {
      const exchange = childSnapshot.val();
      totalExchanges++;
      
      if (exchange.ratings && exchange.ratings.teacherRating) {
        totalRating += exchange.ratings.teacherRating;
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        exchangesCompleted: totalExchanges,
        averageRating: parseFloat(averageRating),
        totalHoursTaught: userData.totalHoursTaught || 0,
        tier: userData.tier || 'Stone Dropper',
        joinDate: userData.joinDate,
        skillsOfferedCount: (userData.skillsOffered || []).length,
        skillsWantedCount: (userData.skillsWanted || []).length
      }
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user statistics' }
    });
  }
});

// @desc    Update user tier
// @route   PUT /api/users/:id/tier
// @access  Private (admin or self)
router.put('/:id/tier', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { tier } = req.body;
    
    const validTiers = ['Stone Dropper', 'Wave Maker', 'Current Creator', 'Tide Turner'];
    
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid tier' }
      });
    }

    // Check if user can update this profile
    if (req.user.uid !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized to update this user' }
      });
    }

    const db = getDatabase();
    await db.ref(`users/${id}`).update({
      tier,
      updatedAt: new Date().toISOString()
    });

    logger.info(`Tier updated for user ${id}: ${tier}`);

    res.json({
      success: true,
      data: { message: 'Tier updated successfully', tier }
    });

  } catch (error) {
    logger.error('Update tier error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update tier' }
    });
  }
});

module.exports = router;