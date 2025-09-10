const { getSubdomainConfig, isValidSubdomain } = require('../config/subdomains');
const { logger } = require('../utils/logger');

/**
 * Middleware to handle subdomain detection and routing
 * Extracts subdomain from request and sets guru context
 */
function subdomainHandler(req, res, next) {
  try {
    // Extract subdomain from request host
    const host = req.get('host') || req.get('x-forwarded-host') || '';
    const hostParts = host.split('.');
    
    // For local development, check for subdomain patterns
    // Examples: cooking.localhost:3000, music.yoohoo.guru
    let subdomain = null;
    
    if (hostParts.length >= 2) {
      const potentialSubdomain = hostParts[0];
      
      // Skip common non-guru subdomains
      const excludedSubdomains = ['www', 'api', 'admin', 'staging', 'dev', 'test'];
      
      if (!excludedSubdomains.includes(potentialSubdomain) && isValidSubdomain(potentialSubdomain)) {
        subdomain = potentialSubdomain;
      }
    }
    
    // Set guru context on request
    if (subdomain) {
      const config = getSubdomainConfig(subdomain);
      req.guru = {
        subdomain,
        config,
        isGuru: true,
        isMainSite: false
      };
      
      // Log subdomain access for analytics
      logger.info(`Guru subdomain accessed: ${subdomain} - ${config.character}`, {
        subdomain,
        character: config.character,
        host,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    } else {
      req.guru = {
        subdomain: null,
        config: null,
        isGuru: false,
        isMainSite: true
      };
    }
    
    // Add guru context to response locals for templates
    res.locals.guru = req.guru;
    
    next();
  } catch (error) {
    logger.error('Error in subdomain handler:', error);
    
    // Fallback to main site on error
    req.guru = {
      subdomain: null,
      config: null,
      isGuru: false,
      isMainSite: true,
      error: error.message
    };
    
    next();
  }
}

/**
 * Middleware to require guru subdomain access
 * Returns 404 if not accessed via a valid guru subdomain
 */
function requireGuru(req, res, next) {
  if (!req.guru || !req.guru.isGuru) {
    return res.status(404).json({
      error: 'Guru subdomain required',
      message: 'This endpoint is only available on guru subdomains',
      availableSubdomains: Object.keys(require('../config/subdomains').subdomainConfig)
    });
  }
  
  next();
}

/**
 * Middleware to require main site access
 * Returns 404 if accessed via a guru subdomain
 */
function requireMainSite(req, res, next) {
  if (req.guru && req.guru.isGuru) {
    return res.status(404).json({
      error: 'Main site required',
      message: 'This endpoint is not available on guru subdomains',
      redirectTo: 'https://yoohoo.guru' + req.originalUrl
    });
  }
  
  next();
}

module.exports = {
  subdomainHandler,
  requireGuru,
  requireMainSite
};