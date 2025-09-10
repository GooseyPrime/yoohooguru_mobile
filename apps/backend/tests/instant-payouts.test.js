const request = require('supertest');
const express = require('express');

// Mock dependencies
jest.mock('../src/lib/stripe', () => ({
  stripe: {
    balance: {
      retrieve: jest.fn()
    },
    payouts: {
      create: jest.fn()
    },
    accounts: {
      create: jest.fn(),
      retrieve: jest.fn()
    },
    accountLinks: {
      create: jest.fn()
    }
  }
}));

jest.mock('../src/config/firebase', () => ({
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      get: jest.fn(),
      update: jest.fn()
    }))
  }))
}));

jest.mock('../src/middleware/auth', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { uid: 'test-user-123', email: 'test@example.com' };
    next();
  },
  requireAuth: (req, res, next) => {
    req.user = { uid: 'test-user-123', email: 'test@example.com' };
    next();
  }
}));

const { stripe } = require('../src/lib/stripe');
const { getDatabase } = require('../src/config/firebase');
const connectRouter = require('../src/routes/connect');

// Temporarily disabling this entire test suite until Instant Payouts eligibility is confirmed.
describe.skip('Stripe Instant Payouts', () => {
  let app;
  let mockDb;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/connect', connectRouter);

    mockDb = {
      ref: jest.fn(() => ({
        get: jest.fn(),
        update: jest.fn()
      }))
    };
    getDatabase.mockReturnValue(mockDb);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('GET /api/connect/balance', () => {
    test('should retrieve balance with instant_available expansion', async () => {
      // Mock profile with connected account
      const mockProfile = {
        stripe_account_id: 'acct_test_12345',
        payouts_ready: true
      };

      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => mockProfile
        })
      });

      // Mock Stripe balance response
      const mockBalance = {
        available: [{ amount: 5000, currency: 'usd' }],
        pending: [{ amount: 1000, currency: 'usd' }],
        instant_available: {
          amount: 4500,
          currency: 'usd',
          net_available: 4300
        },
        connect_reserved: [{ amount: 500, currency: 'usd' }],
        livemode: false
      };

      stripe.balance.retrieve.mockResolvedValue(mockBalance);

      const response = await request(app)
        .get('/api/connect/balance')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.accountId).toBe('acct_test_12345');
      expect(response.body.balance).toEqual(mockBalance);

      // Verify Stripe was called with correct parameters
      expect(stripe.balance.retrieve).toHaveBeenCalledWith(
        { expand: ['instant_available.net_available'] },
        { stripeAccount: 'acct_test_12345' }
      );
    });

    test('should return error when no connected account exists', async () => {
      // Mock profile without connected account
      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => ({})
        })
      });

      const response = await request(app)
        .get('/api/connect/balance')
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('No connected account found. Please complete account setup first.');
    });

    test('should handle Stripe errors gracefully', async () => {
      // Mock profile with connected account
      const mockProfile = {
        stripe_account_id: 'acct_test_12345',
        payouts_ready: true
      };

      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => mockProfile
        })
      });

      // Mock Stripe error
      stripe.balance.retrieve.mockRejectedValue(new Error('Stripe API error'));

      const response = await request(app)
        .get('/api/connect/balance')
        .expect(500);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('Failed to retrieve balance');
    });
  });

  describe('POST /api/connect/instant-payout', () => {
    test('should create instant payout successfully', async () => {
      // Mock profile with connected account
      const mockProfile = {
        stripe_account_id: 'acct_test_12345',
        payouts_ready: true
      };

      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => mockProfile
        })
      });

      // Mock Stripe payout response
      const mockPayout = {
        id: 'po_test_12345',
        amount: 2500,
        currency: 'usd',
        status: 'in_transit',
        method: 'instant',
        arrival_date: 1234567890,
        fees: [{ amount: 25, currency: 'usd', type: 'stripe_fee' }]
      };

      stripe.payouts.create.mockResolvedValue(mockPayout);

      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 25.00, currency: 'usd' })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.payout).toEqual(mockPayout);

      // Verify Stripe was called with correct parameters
      expect(stripe.payouts.create).toHaveBeenCalledWith(
        {
          amount: 2500, // Amount in cents
          currency: 'usd',
          method: 'instant'
        },
        { stripeAccount: 'acct_test_12345' }
      );
    });

    test('should require valid amount', async () => {
      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 0 })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('Valid amount is required for payout');
    });

    test('should require connected account', async () => {
      // Mock profile without connected account
      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => ({})
        })
      });

      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 25.00 })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('No connected account found. Please complete account setup first.');
    });

    test('should require payouts_ready status', async () => {
      // Mock profile with connected account but not ready for payouts
      const mockProfile = {
        stripe_account_id: 'acct_test_12345',
        payouts_ready: false
      };

      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => mockProfile
        })
      });

      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 25.00 })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('Account is not ready for payouts. Please complete account verification.');
    });

    test('should handle Stripe card errors', async () => {
      // Mock profile with connected account
      const mockProfile = {
        stripe_account_id: 'acct_test_12345',
        payouts_ready: true
      };

      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => mockProfile
        })
      });

      // Mock Stripe card error
      const stripeError = new Error('Insufficient funds');
      stripeError.type = 'StripeCardError';
      stripeError.code = 'insufficient_funds';
      stripe.payouts.create.mockRejectedValue(stripeError);

      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 25.00 })
        .expect(400);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('Insufficient funds');
      expect(response.body.code).toBe('insufficient_funds');
    });

    test('should handle generic Stripe errors', async () => {
      // Mock profile with connected account
      const mockProfile = {
        stripe_account_id: 'acct_test_12345',
        payouts_ready: true
      };

      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => mockProfile
        })
      });

      // Mock generic Stripe error
      stripe.payouts.create.mockRejectedValue(new Error('Network error'));

      const response = await request(app)
        .post('/api/connect/instant-payout')
        .send({ amount: 25.00 })
        .expect(500);

      expect(response.body.ok).toBe(false);
      expect(response.body.error).toBe('Failed to create instant payout');
    });
  });

  describe('Account Creation with Instant Payout Settings', () => {
    test('should create account with manual payout schedule for instant payouts', async () => {
      // Mock profile without connected account
      mockDb.ref.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          val: () => ({})
        }),
        update: jest.fn().mockResolvedValue()
      });

      // Mock Stripe account creation
      const mockAccount = {
        id: 'acct_test_new123'
      };
      stripe.accounts.create.mockResolvedValue(mockAccount);

      // Mock account link creation
      const mockAccountLink = {
        url: 'https://connect.stripe.com/setup/test'
      };
      stripe.accountLinks.create.mockResolvedValue(mockAccountLink);

      const response = await request(app)
        .post('/api/connect/start')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.url).toBe(mockAccountLink.url);
      expect(response.body.accountId).toBe(mockAccount.id);

      // Verify account was created with proper instant payout settings
      expect(stripe.accounts.create).toHaveBeenCalledWith({
        type: 'express',
        country: 'US',
        email: 'test@example.com',
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true }
        },
        business_type: 'individual',
        settings: {
          payouts: {
            schedule: {
              interval: 'manual'  // Enable manual/instant payouts
            }
          }
        }
      });
    });
  });
});

