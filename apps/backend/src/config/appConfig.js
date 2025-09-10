/**
 * Application Configuration
 * Central configuration management with environment variable validation
 */

const { logger } = require('../utils/logger');

/**
 * Get and validate required environment variables
 */
function getConfig() {
  const config = {
    // Server Configuration
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // App Branding
    appBrandName: process.env.APP_BRAND_NAME || 'yoohoo.guru',
    appDisplayName: process.env.APP_DISPLAY_NAME || 'yoohoo.guru',
    appLegalEmail: process.env.APP_LEGAL_EMAIL || 'legal@yoohoo.guru',
    appPrivacyEmail: process.env.APP_PRIVACY_EMAIL || 'privacy@yoohoo.guru',
    appSupportEmail: process.env.APP_SUPPORT_EMAIL || 'support@yoohoo.guru',
    appContactAddress: process.env.APP_CONTACT_ADDRESS || 'yoohoo.guru, Legal Department',
    
    // CORS Configuration
    corsOriginProduction: process.env.CORS_ORIGIN_PRODUCTION 
      ? process.env.CORS_ORIGIN_PRODUCTION.split(',').map(origin => origin.trim())
      : ['https://yoohoo.guru', 'https://www.yoohoo.guru'],
    corsOriginDevelopment: process.env.CORS_ORIGIN_DEVELOPMENT 
      ? process.env.CORS_ORIGIN_DEVELOPMENT.split(',').map(origin => origin.trim())
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    
    // Express Configuration
    expressJsonLimit: process.env.EXPRESS_JSON_LIMIT || '10mb',
    expressUrlLimit: process.env.EXPRESS_URL_LIMIT || '10mb',
    
    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    rateLimitMessage: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
    
    // API Configuration
    apiWelcomeMessage: process.env.API_WELCOME_MESSAGE || 'Welcome to yoohoo.guru API',
    apiVersion: process.env.API_VERSION || '1.0.0',
    apiDescription: process.env.API_DESCRIPTION || 'Skill-sharing platform backend',
    
    // External API Keys (with validation)
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    
    // Google OAuth Configuration
    googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    
    // Stripe Configuration
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripeWebhookId: process.env.STRIPE_WEBHOOK_ID,
    
    // Stripe Price IDs
    stripeGuruPassPriceId: process.env.STRIPE_GURU_PASS_PRICE_ID,
    stripeSkillVerificationPriceId: process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID,
    stripeTrustSafetyPriceId: process.env.STRIPE_TRUST_SAFETY_PRICE_ID,
    
    // Firebase Configuration
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
  };

  // Validate required environment variables in production
  if (config.nodeEnv === 'production') {
    const requiredVars = [
      'JWT_SECRET',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_API_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  return config;
}

/**
 * Get CORS origins based on environment
 */
function getCorsOrigins(config) {
  return config.nodeEnv === 'production' 
    ? config.corsOriginProduction 
    : config.corsOriginDevelopment;
}

/**
 * Validate configuration and log warnings for missing optional variables
 */
function validateConfig(config) {
  const warnings = [];
  
  // Check for optional but recommended variables
  if (config.nodeEnv === 'production') {
    if (!process.env.OPENROUTER_API_KEY) {
      warnings.push('OPENROUTER_API_KEY not set - AI features may not work');
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      warnings.push('STRIPE_SECRET_KEY not set - payment features may not work');
    }
  }
  
  // Log warnings
  warnings.forEach(warning => logger.warn(warning));
  
  // Log configuration summary
  logger.info(`Configuration loaded for environment: ${config.nodeEnv}`);
  logger.info(`App brand: ${config.appBrandName}`);
  logger.info(`CORS origins: ${getCorsOrigins(config).join(', ')}`);
  
  return warnings;
}

module.exports = {
  getConfig,
  getCorsOrigins,
  validateConfig
};