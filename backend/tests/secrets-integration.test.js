const request = require('supertest');
const express = require('express');
const { getConfig } = require('../src/config/appConfig');

// Create test app
const app = express();

// Simulated app configuration
app.use(express.json());

// Mock payments config endpoint
app.get('/api/payments/config', (req, res) => {
  const config = getConfig();
  
  res.json({
    success: true,
    data: {
      publishableKey: config.stripePublishableKey,
      priceIds: {
        guruPass: config.stripeGuruPassPriceId,
        skillVerification: config.stripeSkillVerificationPriceId,
        trustSafety: config.stripeTrustSafetyPriceId
      },
      webhookEndpoint: '/api/webhooks/stripe'
    }
  });
});

describe('Secrets Integration Tests', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Complete Stripe Configuration', () => {
    test('should properly configure all Stripe secrets mentioned in the issue', () => {
      // Set all the environment variables mentioned in the issue
      process.env.FIREBASE_API_KEY = 'test_firebase_api_key';
      process.env.FIREBASE_APP_ID = 'test_firebase_app_id';
      process.env.FIREBASE_AUTH_DOMAIN = 'test.firebaseapp.com';
      process.env.FIREBASE_DATABASE_URL = 'https://test.firebaseio.com';
      process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789';
      process.env.FIREBASE_PROJECT_ID = 'test-project';
      process.env.FIREBASE_STORAGE_BUCKET = 'test.appspot.com';
      
      process.env.JWT_SECRET = 'fake_jwt_key_for_testing_only';
      
      process.env.STRIPE_GURU_PASS_PRICE_ID = 'price_guru_pass_test';
      process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_publishable';
      process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_for_testing';
      process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID = 'price_skill_verification_test';
      process.env.STRIPE_TRUST_SAFETY_PRICE_ID = 'price_trust_safety_test';
      process.env.STRIPE_WEBHOOK_ID = 'we_1S3nQHJF6bibA8neDupDJ3j4';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake_webhook_secret_for_testing';
      
      // Google OAuth Configuration
      process.env.GOOGLE_OAUTH_CLIENT_ID = 'test_google_oauth_client_id';
      process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'test_google_oauth_client_secret';

      const config = getConfig();
      
      // Verify Firebase configuration
      expect(config.firebaseApiKey).toBe('test_firebase_api_key');
      expect(config.firebaseAppId).toBe('test_firebase_app_id');
      expect(config.firebaseAuthDomain).toBe('test.firebaseapp.com');
      expect(config.firebaseDatabaseUrl).toBe('https://test.firebaseio.com');
      expect(config.firebaseMessagingSenderId).toBe('123456789');
      expect(config.firebaseProjectId).toBe('test-project');
      expect(config.firebaseStorageBucket).toBe('test.appspot.com');
      
      // Verify JWT configuration
      expect(config.jwtSecret).toBe('fake_jwt_key_for_testing_only');
      
      // Verify Stripe configuration
      expect(config.stripeGuruPassPriceId).toBe('price_guru_pass_test');
      expect(config.stripePublishableKey).toBe('pk_test_publishable');
      expect(config.stripeSecretKey).toBe('sk_test_fake_key_for_testing');
      expect(config.stripeSkillVerificationPriceId).toBe('price_skill_verification_test');
      expect(config.stripeTrustSafetyPriceId).toBe('price_trust_safety_test');
      expect(config.stripeWebhookId).toBe('we_1S3nQHJF6bibA8neDupDJ3j4');
      expect(config.stripeWebhookSecret).toBe('whsec_fake_webhook_secret_for_testing');
      
      // Verify Google OAuth configuration
      expect(config.googleOAuthClientId).toBe('test_google_oauth_client_id');
      expect(config.googleOAuthClientSecret).toBe('test_google_oauth_client_secret');
    });

    test('should expose payment configuration via API endpoint', async () => {
      // Set Stripe environment variables
      process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_api_endpoint';
      process.env.STRIPE_GURU_PASS_PRICE_ID = 'price_guru_api_test';
      process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID = 'price_skill_api_test';
      process.env.STRIPE_TRUST_SAFETY_PRICE_ID = 'price_safety_api_test';

      const response = await request(app)
        .get('/api/payments/config');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.publishableKey).toBe('pk_test_api_endpoint');
      expect(response.body.data.priceIds.guruPass).toBe('price_guru_api_test');
      expect(response.body.data.priceIds.skillVerification).toBe('price_skill_api_test');
      expect(response.body.data.priceIds.trustSafety).toBe('price_safety_api_test');
      expect(response.body.data.webhookEndpoint).toBe('/api/webhooks/stripe');
    });

    test('should handle webhook configuration correctly', () => {
      // Set webhook configuration as mentioned in the issue
      process.env.STRIPE_WEBHOOK_ID = 'we_1S3nQHJF6bibA8neDupDJ3j4';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake_webhook_from_issue_test';

      const config = getConfig();
      
      expect(config.stripeWebhookId).toBe('we_1S3nQHJF6bibA8neDupDJ3j4');
      expect(config.stripeWebhookSecret).toBe('whsec_fake_webhook_from_issue_test');
    });
  });

  describe('Google OAuth Configuration', () => {
    test('should properly configure Google OAuth secrets', () => {
      // Set Google OAuth environment variables
      process.env.GOOGLE_OAUTH_CLIENT_ID = 'test_google_client_id_12345';
      process.env.GOOGLE_OAUTH_CLIENT_SECRET = 'test_google_client_secret_abcdef';

      const config = getConfig();
      
      expect(config.googleOAuthClientId).toBe('test_google_client_id_12345');
      expect(config.googleOAuthClientSecret).toBe('test_google_client_secret_abcdef');
    });

    test('should handle missing Google OAuth configuration gracefully', () => {
      // Don't set Google OAuth environment variables
      delete process.env.GOOGLE_OAUTH_CLIENT_ID;
      delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;

      const config = getConfig();
      
      expect(config.googleOAuthClientId).toBeUndefined();
      expect(config.googleOAuthClientSecret).toBeUndefined();
    });
  });

  describe('Production Environment Validation', () => {
    test('should validate required secrets in production mode', () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'fake_production_jwt_key_for_testing';
      process.env.FIREBASE_PROJECT_ID = 'production_project';
      process.env.FIREBASE_API_KEY = 'production_api_key';

      // Should not throw with required variables set
      expect(() => getConfig()).not.toThrow();
    });

    test('should fail validation when required secrets are missing in production', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.JWT_SECRET;
      delete process.env.FIREBASE_PROJECT_ID;
      delete process.env.FIREBASE_API_KEY;

      // Should throw when required variables are missing
      expect(() => getConfig()).toThrow('Missing required environment variables');
    });
  });
});