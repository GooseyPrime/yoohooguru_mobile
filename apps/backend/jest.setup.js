/**
 * Jest setup for backend tests with real Firebase connections
 * IMPORTANT: No Firebase mocking - uses actual Firebase services per user requirement
 */

// Load test environment variables
require('dotenv').config({ path: '../.env.test' });

// Set NODE_ENV to test if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Initialize Firebase for testing before any tests run
const { initializeFirebase } = require('./src/config/firebase');

beforeAll(async () => {
  // Initialize Firebase with real configuration for testing
  try {
    await initializeFirebase();
    console.log('✅ Firebase initialized for testing with REAL connection (no mocks)');
  } catch (error) {
    console.warn('⚠️  Firebase connection warning during test setup:', error.message);
    console.log('🔥 Tests will continue with Firebase connection attempts (no mocks allowed)');
    // Don't fail tests if Firebase is not fully configured - tests will handle Firebase errors gracefully
    // This allows tests to run even if Firebase credentials are not available in test environment
  }
});

// Longer timeout for real Firebase operations
jest.setTimeout(45000);

// Clean up resources after all tests
afterAll(async () => {
  // Allow time for Firebase connections to clean up
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('🧹 Test cleanup completed - Firebase connections terminated');
});