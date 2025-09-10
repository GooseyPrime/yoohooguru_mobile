const express = require('express');
const { getDatabase } = require('../config/firebase');
const { requireGuru } = require('../middleware/subdomainHandler');
const { logger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Apply subdomain requirement to all routes
router.use(requireGuru);

/**
 * GET /:subdomain/home
 * Get guru homepage data including featured posts and character info
 */
router.get('/:subdomain/home', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getDatabase();
    
    // Validate subdomain matches middleware
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch',
        message: 'Request subdomain does not match detected subdomain'
      });
    }
    
    // Get featured posts for the guru
    const postsRef = db.ref(`gurus/${subdomain}/posts`);
    const postsSnapshot = await postsRef
      .orderByChild('featured')
      .equalTo(true)
      .limitToFirst(6)
      .once('value');
    
    const featuredPosts = [];
    postsSnapshot.forEach(child => {
      featuredPosts.push({
        id: child.key,
        ...child.val()
      });
    });
    
    // If we don't have enough featured posts, get recent ones
    if (featuredPosts.length < 6) {
      const recentPostsSnapshot = await postsRef
        .orderByChild('publishedAt')
        .limitToFirst(6 - featuredPosts.length)
        .once('value');
      
      recentPostsSnapshot.forEach(child => {
        const post = { id: child.key, ...child.val() };
        if (!featuredPosts.find(p => p.id === post.id)) {
          featuredPosts.push(post);
        }
      });
    }
    
    // Get guru stats
    const statsRef = db.ref(`gurus/${subdomain}/stats`);
    const statsSnapshot = await statsRef.once('value');
    const stats = statsSnapshot.val() || {
      totalPosts: 0,
      totalViews: 0,
      totalLeads: 0,
      monthlyVisitors: 0
    };
    
    res.json({
      guru: guru.config,
      featuredPosts,
      stats,
      subdomain,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru home data:', error);
    res.status(500).json({
      error: 'Failed to fetch guru home data',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/posts
 * Get all blog posts for a guru subdomain with filtering and pagination
 */
router.get('/:subdomain/posts', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { 
      page = 1, 
      limit = 12, 
      tag, 
      search, 
      category,
      featured 
    } = req.query;
    
    const guru = req.guru;
    const db = getDatabase();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get all posts for the subdomain
    const postsRef = db.ref(`gurus/${subdomain}/posts`);
    const postsSnapshot = await postsRef
      .orderByChild('publishedAt')
      .once('value');
    
    let postsArray = [];
    postsSnapshot.forEach(child => {
      const post = {
        id: child.key,
        ...child.val()
      };
      
      // Only include published posts
      if (post.status === 'published') {
        postsArray.push(post);
      }
    });
    
    // Sort by publishedAt descending (newest first)
    postsArray.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    
    // Apply filters
    if (featured === 'true') {
      postsArray = postsArray.filter(post => post.featured === true);
    }
    
    if (tag && tag !== 'all') {
      postsArray = postsArray.filter(post => 
        post.tags && post.tags.includes(tag)
      );
    }
    
    if (category && category !== 'all') {
      postsArray = postsArray.filter(post => 
        post.category === category
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      postsArray = postsArray.filter(post => 
        (post.title && post.title.toLowerCase().includes(searchLower)) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
        (post.content && post.content.toLowerCase().includes(searchLower))
      );
    }
    
    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedPosts = postsArray.slice(startIndex, endIndex);
    
    // Get available tags and categories for filtering
    const allTags = new Set();
    const allCategories = new Set();
    postsArray.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => allTags.add(tag));
      }
      if (post.category) {
        allCategories.add(post.category);
      }
    });
    
    res.json({
      posts: paginatedPosts,
      pagination: {
        totalPosts: postsArray.length,
        totalPages: Math.ceil(postsArray.length / limitNumber),
        currentPage: pageNumber,
        limit: limitNumber,
        hasNext: endIndex < postsArray.length,
        hasPrev: pageNumber > 1
      },
      filters: {
        availableTags: Array.from(allTags),
        availableCategories: Array.from(allCategories)
      },
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru posts:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/posts/:slug
 * Get a specific blog post by slug
 */
router.get('/:subdomain/posts/:slug', async (req, res) => {
  try {
    const { subdomain, slug } = req.params;
    const guru = req.guru;
    const db = getDatabase();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Find post by slug
    const postsRef = db.ref(`gurus/${subdomain}/posts`);
    const postsSnapshot = await postsRef
      .orderByChild('slug')
      .equalTo(slug)
      .once('value');
    
    let post = null;
    postsSnapshot.forEach(child => {
      post = {
        id: child.key,
        ...child.val()
      };
    });
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: `Post with slug "${slug}" not found`
      });
    }
    
    if (post.status !== 'published') {
      return res.status(404).json({
        error: 'Post not available',
        message: 'This post is not published'
      });
    }
    
    // Increment view count
    const viewsRef = db.ref(`gurus/${subdomain}/posts/${post.id}/views`);
    await viewsRef.transaction(currentViews => (currentViews || 0) + 1);
    
    // Track analytics
    const analyticsRef = db.ref(`analytics/post-views`);
    await analyticsRef.push({
      subdomain,
      postId: post.id,
      slug,
      timestamp: Date.now(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    // Get related posts (same tags, excluding current post)
    const relatedPosts = [];
    if (post.tags && post.tags.length > 0) {
      const allPostsSnapshot = await postsRef
        .orderByChild('publishedAt')
        .limitToLast(20)
        .once('value');
      
      allPostsSnapshot.forEach(child => {
        const relatedPost = {
          id: child.key,
          ...child.val()
        };
        
        if (relatedPost.id !== post.id && 
            relatedPost.status === 'published' &&
            relatedPost.tags &&
            relatedPost.tags.some(tag => post.tags.includes(tag))) {
          relatedPosts.push(relatedPost);
        }
      });
    }
    
    res.json({
      post: {
        ...post,
        views: (post.views || 0) + 1
      },
      relatedPosts: relatedPosts.slice(0, 3),
      guru: guru.config,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru post:', error);
    res.status(500).json({
      error: 'Failed to fetch post',
      message: error.message
    });
  }
});

/**
 * POST /:subdomain/leads
 * Submit a lead form for a guru subdomain
 */
router.post('/:subdomain/leads', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const { name, email, service, message, phone } = req.body;
    const guru = req.guru;
    const db = getDatabase();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Validate required fields
    if (!name || !email || !service) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and service are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }
    
    const leadId = uuidv4();
    const leadData = {
      id: leadId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service,
      message: message ? message.trim() : '',
      phone: phone ? phone.trim() : null,
      subdomain,
      guruCharacter: guru.config.character,
      createdAt: Date.now(),
      status: 'new',
      source: 'guru-website',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    // Save lead to Firebase
    const leadsRef = db.ref(`gurus/${subdomain}/leads/${leadId}`);
    await leadsRef.set(leadData);
    
    // Also save to global leads for admin dashboard
    const globalLeadsRef = db.ref(`leads/${leadId}`);
    await globalLeadsRef.set(leadData);
    
    // Update guru stats
    const statsRef = db.ref(`gurus/${subdomain}/stats/totalLeads`);
    await statsRef.transaction(currentLeads => (currentLeads || 0) + 1);
    
    // Log lead for analytics
    logger.info(`New lead submitted for ${guru.config.character}`, {
      subdomain,
      leadId,
      service,
      email: email.replace(/(.{3}).*@/, '$1***@') // Masked email for privacy
    });
    
    res.json({
      success: true,
      message: 'Lead submitted successfully',
      leadId,
      guru: guru.config.character
    });
    
  } catch (error) {
    logger.error('Error submitting lead:', error);
    res.status(500).json({
      error: 'Failed to submit lead',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/services
 * Get available services for a guru subdomain
 */
router.get('/:subdomain/services', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getDatabase();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get services from Firebase
    const servicesRef = db.ref(`gurus/${subdomain}/services`);
    const servicesSnapshot = await servicesRef.once('value');
    
    const services = [];
    servicesSnapshot.forEach(child => {
      services.push({
        id: child.key,
        ...child.val()
      });
    });
    
    // Sort by display order or price
    services.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    res.json({
      services,
      guru: guru.config,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru services:', error);
    res.status(500).json({
      error: 'Failed to fetch services',
      message: error.message
    });
  }
});

/**
 * GET /:subdomain/about
 * Get about page content for a guru subdomain
 */
router.get('/:subdomain/about', async (req, res) => {
  try {
    const { subdomain } = req.params;
    const guru = req.guru;
    const db = getDatabase();
    
    if (guru.subdomain !== subdomain) {
      return res.status(400).json({
        error: 'Subdomain mismatch'
      });
    }
    
    // Get about page content
    const aboutRef = db.ref(`gurus/${subdomain}/pages/about`);
    const aboutSnapshot = await aboutRef.once('value');
    
    const aboutContent = aboutSnapshot.val() || {
      title: `About ${guru.config.character}`,
      content: `Meet ${guru.config.character}, your expert guide in ${guru.config.category}. 
                With years of experience and a passion for teaching, they're here to help you 
                master ${guru.config.primarySkills.join(', ')} and achieve your goals.`,
      cta: 'Book a Session',
      ctaLink: '/contact',
      features: guru.config.primarySkills.map(skill => ({
        title: skill.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: `Expert guidance in ${skill}`
      }))
    };
    
    res.json({
      about: aboutContent,
      guru: guru.config,
      success: true
    });
    
  } catch (error) {
    logger.error('Error fetching guru about content:', error);
    res.status(500).json({
      error: 'Failed to fetch about content',
      message: error.message
    });
  }
});

module.exports = router;