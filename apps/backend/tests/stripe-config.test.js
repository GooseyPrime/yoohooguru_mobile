const { getConfig } = require('../src/config/appConfig');

describe('Stripe Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Stripe Price IDs Configuration', () => {
    test('should load all Stripe price ID configurations', () => {
      // Clean environment first
      delete process.env.STRIPE_GURU_PASS_PRICE_ID;
      delete process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID;
      delete process.env.STRIPE_TRUST_SAFETY_PRICE_ID;
      
      process.env.STRIPE_GURU_PASS_PRICE_ID = 'price_test_guru_pass';
      process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID = 'price_test_skill_verification';
      process.env.STRIPE_TRUST_SAFETY_PRICE_ID = 'price_test_trust_safety';
      
      const config = getConfig();
      
      expect(config.stripeGuruPassPriceId).toBe('price_test_guru_pass');
      expect(config.stripeSkillVerificationPriceId).toBe('price_test_skill_verification');
      expect(config.stripeTrustSafetyPriceId).toBe('price_test_trust_safety');
    });

    test('should handle missing Stripe price IDs gracefully', () => {
      // Clean environment first
      delete process.env.STRIPE_GURU_PASS_PRICE_ID;
      delete process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID;
      delete process.env.STRIPE_TRUST_SAFETY_PRICE_ID;
      
      const config = getConfig();
      
      expect(config.stripeGuruPassPriceId).toBeUndefined();
      expect(config.stripeSkillVerificationPriceId).toBeUndefined();
      expect(config.stripeTrustSafetyPriceId).toBeUndefined();
    });
  });

  describe('Stripe General Configuration', () => {
    test('should load all Stripe configurations', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key_12345';
      process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_12345';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake_test_12345';
      process.env.STRIPE_WEBHOOK_ID = 'we_test_12345';
      
      const config = getConfig();
      
      expect(config.stripeSecretKey).toBe('sk_test_fake_key_12345');
      expect(config.stripePublishableKey).toBe('pk_test_12345');
      expect(config.stripeWebhookSecret).toBe('whsec_fake_test_12345');
      expect(config.stripeWebhookId).toBe('we_test_12345');
    });
  });

  describe('Production Environment Validation', () => {
    test('should not require Stripe configurations in development', () => {
      process.env.NODE_ENV = 'development';
      delete process.env.STRIPE_SECRET_KEY;
      
      expect(() => getConfig()).not.toThrow();
    });

    test('should validate required configurations in production', () => {
      process.env.NODE_ENV = 'production';
      process.env.JWT_SECRET = 'test_jwt_secret';
      process.env.FIREBASE_PROJECT_ID = 'test_project';
      process.env.FIREBASE_API_KEY = 'test_api_key';
      
      expect(() => getConfig()).not.toThrow();
    });
  });
});

describe('Firebase Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('should load all Firebase configurations', () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_API_KEY = 'test-api-key';
    process.env.FIREBASE_AUTH_DOMAIN = 'test-project.firebaseapp.com';
    process.env.FIREBASE_DATABASE_URL = 'https://test-project.firebaseio.com';
    process.env.FIREBASE_STORAGE_BUCKET = 'test-project.appspot.com';
    process.env.FIREBASE_MESSAGING_SENDER_ID = '123456789';
    process.env.FIREBASE_APP_ID = '1:123456789:web:abcdef';
    
    const config = getConfig();
    
    expect(config.firebaseProjectId).toBe('test-project');
    expect(config.firebaseApiKey).toBe('test-api-key');
    expect(config.firebaseAuthDomain).toBe('test-project.firebaseapp.com');
    expect(config.firebaseDatabaseUrl).toBe('https://test-project.firebaseio.com');
    expect(config.firebaseStorageBucket).toBe('test-project.appspot.com');
    expect(config.firebaseMessagingSenderId).toBe('123456789');
    expect(config.firebaseAppId).toBe('1:123456789:web:abcdef');
  });
});