const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseApp;

/**
 * Validates Firebase configuration for production environments
 */
const validateProductionFirebaseConfig = (config) => {
  const env = process.env.NODE_ENV;
  
  // Only validate in production and staging environments
  if (env !== 'production' && env !== 'staging') {
    return;
  }

  // Check for prohibited emulator/mock settings
  if (process.env.FIREBASE_EMULATOR_HOST) {
    throw new Error(
      `Firebase emulator host is configured (${process.env.FIREBASE_EMULATOR_HOST}) ` +
      `but NODE_ENV is ${env}. Emulators are prohibited in ${env} environments.`
    );
  }

  if (process.env.USE_MOCKS && process.env.USE_MOCKS !== 'false') {
    throw new Error(
      `USE_MOCKS is enabled (${process.env.USE_MOCKS}) but NODE_ENV is ${env}. ` +
      `Mocks are prohibited in ${env} environments.`
    );
  }

  // Validate that project ID doesn't contain demo/test values
  const projectId = config.projectId;
  if (!projectId) {
    throw new Error(`Firebase project ID is required in ${env} environment`);
  }

  const prohibitedPatterns = ['demo', 'test', 'mock', 'localhost', 'emulator', 'example', 'your_', 'changeme'];
  const hasProhibitedPattern = prohibitedPatterns.some(pattern => 
    projectId.toLowerCase().includes(pattern)
  );

  if (hasProhibitedPattern) {
    throw new Error(
      `Firebase project ID "${projectId}" contains prohibited pattern for ${env} environment. ` +
      `Production and staging must use live Firebase projects only.`
    );
  }

  // Validate project ID format (Firebase project IDs are lowercase alphanumeric with hyphens)
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    throw new Error(
      `Firebase project ID "${projectId}" has invalid format. ` +
      `Project IDs must be lowercase alphanumeric with hyphens only.`
    );
  }

  logger.info(`✅ Firebase configuration validated for ${env} environment`);
  logger.info(`🔥 Using Firebase project: ${projectId}`);
};

const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      // In CI/CD or environments where credentials are provided as discrete variables,
      // we must construct the service account object manually.
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // This is the critical fix for CI environments. It correctly formats the
        // private key by replacing escaped newlines with actual newlines.
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      };

      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        // The application uses both Firestore AND Realtime Database
        // Routes like angels.js, skills.js, auth.js use Realtime Database via getDatabase()
        // Routes like connect.js use Firestore via getFirestore()
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        
        // Conditionally add the credential object ONLY if the necessary secrets are present.
        // This ensures the code remains compatible with environments (like Railway)
        // that use GOOGLE_APPLICATION_CREDENTIALS, where these vars won't be set.
        // For test environment, skip credentials if they're empty to allow graceful testing
        ...(serviceAccount.clientEmail && serviceAccount.privateKey && 
            serviceAccount.clientEmail.trim() !== '' && serviceAccount.privateKey.trim() !== '' && {
          credential: admin.credential.cert(serviceAccount)
        })
      };

      // Validate configuration for production environments only
      // Test environment uses real Firebase but with relaxed validation
      if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        validateProductionFirebaseConfig(firebaseConfig);
      }

      firebaseApp = admin.initializeApp(firebaseConfig);
      logger.info('Firebase Admin SDK initialized successfully');
      
      // Log environment and configuration status
      const env = process.env.NODE_ENV || 'development';
      logger.info(`Environment: ${env}`);
      
      if (env === 'production' || env === 'staging') {
        logger.info('🚀 Running with live Firebase configuration (production-ready)');
      } else if (env === 'test') {
        if (!serviceAccount.clientEmail || !serviceAccount.privateKey) {
          logger.info('🧪 Running with test Firebase configuration (minimal setup for testing)');
        } else {
          logger.info('🧪 Running with test Firebase configuration (real Firebase, test environment)');
        }
      } else {
        logger.info('🛠️  Running with development Firebase configuration');
      }
    } else {
      // If the app is already initialized (e.g., in another part of the test suite),
      // get the default app instance to ensure our module's state is correct.
      firebaseApp = admin.app();
    }
    
    return firebaseApp;
  } catch (error) {
    // In test environment, log warning but don't fail completely
    if (process.env.NODE_ENV === 'test') {
      logger.warn('Firebase initialization failed in test environment:', error.message);
      logger.info('Tests will continue with limited Firebase functionality');
      // Return a minimal app object for testing
      return null;
    }
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!firebaseApp) {
    if (process.env.NODE_ENV === 'test') {
      // Return null in test environment so tests can handle Firebase gracefully
      logger.warn('Firebase not initialized for testing - returning null');
      return null;
    }
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  // This is a safety check. If the app was initialized without a databaseURL,
  // it means it's configured for Firestore only. This prevents silent failures.
  if (!firebaseApp.options.databaseURL) {
    throw new Error(
      'Firebase Realtime Database is not configured for this application. ' +
      'The application is initialized for Firestore. Use getFirestore() instead.'
    );
  }
  return admin.database();
};

const getAuth = () => {
  if (!firebaseApp) {
    if (process.env.NODE_ENV === 'test') {
      // Return null in test environment so tests can handle Firebase gracefully
      logger.warn('Firebase not initialized for testing - returning null');
      return null;
    }
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
};

const getFirestore = () => {
  if (!firebaseApp) {
    if (process.env.NODE_ENV === 'test') {
      // Return null in test environment so tests can handle Firebase gracefully
      logger.warn('Firebase not initialized for testing - returning null');
      return null;
    }
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getDatabase,
  getAuth,
  getFirestore
};
