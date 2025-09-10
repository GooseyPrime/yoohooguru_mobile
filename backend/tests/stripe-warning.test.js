const { spawn } = require('child_process');
const path = require('path');

describe('Stripe Warning Messages', () => {
  const stripePath = path.join(__dirname, '../src/lib/stripe.js');
  
  test('should show development warning when NODE_ENV is development', (done) => {
    const child = spawn('node', ['-e', `
      process.env.NODE_ENV = 'development';
      delete process.env.STRIPE_SECRET_KEY;
      require('${stripePath}');
    `]);
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).toContain('For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file');
      expect(stderr).toContain('Stripe features will be disabled');
      expect(stderr).not.toContain('Set this in Railway');
      done();
    });
  });
  
  test('should show production warning when NODE_ENV is production', (done) => {
    const child = spawn('node', ['-e', `
      process.env.NODE_ENV = 'production';
      delete process.env.STRIPE_SECRET_KEY;
      require('${stripePath}');
    `]);
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).toContain('Set this in Railway or your production environment');
      expect(stderr).not.toContain('For local development');
      done();
    });
  });
  
  test('should show development warning when NODE_ENV is not set', (done) => {
    const child = spawn('node', ['-e', `
      delete process.env.NODE_ENV;
      delete process.env.STRIPE_SECRET_KEY;
      require('${stripePath}');
    `]);
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).toContain('For local development, add STRIPE_SECRET_KEY=sk_test_... to your .env file');
      expect(stderr).toContain('Stripe features will be disabled');
      done();
    });
  });
  
  test('should not show warning when STRIPE_SECRET_KEY is set', (done) => {
    const child = spawn('node', ['-e', `
      process.env.NODE_ENV = 'development';
      process.env.STRIPE_SECRET_KEY = 'sk_test_fake_key';
      require('${stripePath}');
    `]);
    
    let stderr = '';
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', () => {
      expect(stderr).not.toContain('STRIPE_SECRET_KEY not set');
      done();
    });
  });
});