const request = require('supertest');
const express = require('express');
const crypto = require('crypto');
const webhookRoutes = require('../src/routes/webhooks');

// Create test app
const app = express();
// Add raw body parser middleware specifically for webhooks
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));
app.use('/api/webhooks', webhookRoutes);

describe('Stripe Webhooks', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fake_webhook_secret_test';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  const createValidSignature = (payload, secret, timestamp) => {
    const signingString = timestamp + '.' + payload;
    const signature = crypto.createHmac('sha256', secret).update(signingString).digest('hex');
    return `t=${timestamp},v1=${signature}`;
  };

  describe('POST /api/webhooks/stripe', () => {
    test('should accept valid webhook with proper signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_12345',
            amount: 2000,
            currency: 'usd'
          }
        }
      });

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createValidSignature(payload, 'whsec_fake_webhook_secret_test', timestamp);

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', signature)
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });

    test('should reject webhook with invalid signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_12345' } }
      });

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', 'invalid_signature')
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid signature');
    });

    test('should reject webhook when secret is not configured', async () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_test_12345' } }
      });

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', 'some_signature')
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Webhook secret not configured');
    });

    test('should handle payment_intent.succeeded event', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_12345',
            amount: 2000,
            currency: 'usd'
          }
        }
      });

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createValidSignature(payload, 'whsec_fake_webhook_secret_test', timestamp);

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', signature)
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });

    test('should handle subscription events', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_test_12345',
            customer: 'cus_test_12345',
            status: 'active'
          }
        }
      });

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createValidSignature(payload, 'whsec_fake_webhook_secret_test', timestamp);

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', signature)
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });

    test('should handle unknown event types gracefully', async () => {
      const payload = JSON.stringify({
        id: 'evt_test_webhook',
        type: 'unknown.event.type',
        data: {
          object: {
            id: 'obj_test_12345'
          }
        }
      });

      const timestamp = Math.floor(Date.now() / 1000);
      const signature = createValidSignature(payload, 'whsec_fake_webhook_secret_test', timestamp);

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', signature)
        .set('content-type', 'application/json')
        .send(payload);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });
  });
});