const request = require('supertest');
const app = require('../src/index');

// Mock Firebase Firestore
jest.mock('../src/config/firebase', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn((collectionName) => ({
      doc: jest.fn((docId) => ({
        get: jest.fn().mockResolvedValue({
          exists: false,
          data: () => ({})
        })
      }))
    }))
  })),
  initializeFirebase: jest.fn(() => {
    // Mock initialization
    console.log('Mock Firebase initialized for test');
  })
}));

// Mock authentication for testing
jest.mock('../src/middleware/auth', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { uid: 'test-user-id' };
    next();
  },
  requireAuth: (req, res, next) => {
    req.user = { uid: 'test-user-id' };
    next();
  },
  optionalAuth: (req, res, next) => {
    // Optional auth doesn't require a user
    next();
  },
  requireRole: (roles) => (req, res, next) => {
    next();
  }
}));

describe('Payouts API Tests', () => {
  let server;

  beforeAll(async () => {
    // Start server for integration tests
    server = app.listen(0); // Use port 0 to get a random available port
  });

  afterAll(async () => {
    // Clean shutdown of server
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  });
  describe('GET /api/connect/balance', () => {
    it('should return not connected when no Stripe account', async () => {
      const response = await request(app)
        .get('/api/connect/balance')
        .expect(400); // Expect 400 because no connected account

      expect(response.body).toEqual({
        ok: false,
        error: 'No connected account found. Please complete account setup first.'
      });
    });
  });

  describe('POST /api/payouts/instant', () => {
    it('should return 404 when instant payouts feature is disabled', async () => {
      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 10.00, currency: 'usd' })
        .expect(404);

      expect(response.body).toEqual({
        ok: false,
        error: 'Instant payouts are not available at this time'
      });
    });
  });

  describe('POST /api/connect/express-login', () => {
    it('should return error when not connected to Stripe', async () => {
      const response = await request(app)
        .post('/api/connect/express-login')
        .expect(400);

      expect(response.body).toEqual({
        ok: false,
        error: 'Not connected to Stripe'
      });
    });
  });
});

describe('Feature Flags API Tests', () => {
  let server;

  beforeAll(async () => {
    // Start server for integration tests
    server = app.listen(0); // Use port 0 to get a random available port
  });

  afterAll(async () => {
    // Clean shutdown of server
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
  });
  describe('GET /api/feature-flags', () => {
    it('should include instantPayouts flag as disabled', async () => {
      const response = await request(app)
        .get('/api/feature-flags')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.flags.instantPayouts).toBe(false);
    });
  });
});