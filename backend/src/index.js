require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const { initializeFirebase } = require('./config/firebase');
const { getConfig, getCorsOrigins, validateConfig } = require('./config/appConfig');
const { logger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { subdomainHandler } = require('./middleware/subdomainHandler');

// Route Imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const exchangeRoutes = require('./routes/exchanges');
const paymentRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const featureFlagRoutes = require('./routes/featureFlags');
const liabilityRoutes = require('./routes/liability');
const webhookRoutes = require('./routes/webhooks');
const stripeWebhooks = require('./routes/stripeWebhooks');
const angelsRoutes = require('./routes/angels');
const connectRoutes = require('./routes/connect');
const payoutsRoutes = require('./routes/payouts');
const onboardingRoutes = require('./routes/onboarding');
const documentsRoutes = require('./routes/documents');
const gurusRoutes = require('./routes/gurus');


const app = express();

// Load and validate configuration
const config = getConfig();
validateConfig(config);

const PORT = config.port;

// Initialize Firebase
initializeFirebase();

// --- Core Middleware Setup ---

// Security headers, CORS, and Compression
// FIX: Configure Content Security Policy to allow scripts from Stripe and Google
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://js.stripe.com", "https://apis.google.com"],
      "frame-src": ["'self'", "https://js.stripe.com", "https://accounts.google.com", "https://*.firebaseapp.com"],
      "connect-src": ["'self'", "https://api.stripe.com", "https://accounts.google.com", "https://www.googleapis.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com"],
    },
  },
}));
app.use(cors({
  origin: getCorsOrigins(config),
  credentials: true
}));
app.use(compression());
app.use(cookieParser());

// Rate limiting for API routes
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: config.rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Subdomain detection middleware (must come before routes)
app.use(subdomainHandler);

// --- Body Parsers ---

// Stripe webhook route MUST use a raw parser to verify signatures.
// It is critical this comes BEFORE the general express.json() parser.
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// General JSON and URL-encoded parsers for all other routes
app.use(express.json({ limit: config.expressJsonLimit }));
app.use(express.urlencoded({ extended: true, limit: config.expressUrlLimit }));

// --- Static File Serving ---

// Serve static files from the frontend build directory
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// --- Application Routes ---

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: config.apiVersion
  });
});

// Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feature-flags', featureFlagRoutes);
app.use('/api/liability', liabilityRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/angels', angelsRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/payouts', payoutsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/gurus', gurusRoutes);
app.use('/api/badges', require('./routes/badges'));
app.use('/api/compliance', require('./routes/compliance'));
app.use('/api/insurance', require('./routes/insurance'));

// API status endpoint
app.get('/api', (req, res) => {
  res.json({
    message: config.apiWelcomeMessage,
    version: config.apiVersion,
    description: config.apiDescription,
    documentation: '/api/docs',
    health: '/health'
  });
});

// --- Catch-all and Error Handling ---

// FIX: Catch-all for API routes. If a request starts with /api/ and hasn't been handled, it's a 404.
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API Route Not Found',
    message: `The requested API resource ${req.originalUrl} was not found on this server.`
  });
});

// FIX: Catch-all for frontend routes. Serves the React app for any other GET request.
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Global error handling middleware (must be the VERY LAST app.use call)
app.use(errorHandler);

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// --- Server Initialization ---
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🎯 ${config.appBrandName} Backend server running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
