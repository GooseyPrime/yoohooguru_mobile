# CI/CD Environment Configuration Guide

This guide documents the specific environment variable requirements for CI/CD workflows and automated deployments.

## Required Environment Variables for CI/CD

### All CI Workflows

The following environment variables **MUST** be set for all CI workflows:

```yaml
env:
  NODE_ENV: production  # REQUIRED for all non-test CI workflows
  FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3  # REQUIRED - production Firebase project
  FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}  # REQUIRED - from secrets
  FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}    # REQUIRED - from secrets with proper escaping
```

### Production Deployment

```yaml
env:
  NODE_ENV: production
  FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3
  FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
  FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
  FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
  FIREBASE_DATABASE_URL: ${{ secrets.FIREBASE_DATABASE_URL }}
  FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
  FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
  FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  STRIPE_PUBLISHABLE_KEY: ${{ secrets.STRIPE_PUBLISHABLE_KEY }}
  STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET }}
```

### Staging Deployment

```yaml
env:
  NODE_ENV: staging
  FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3  # Same as production
  # ... other variables same as production
```

## Prohibited in CI/CD

The following variables are **PROHIBITED** in all CI workflows except local testing:

- `FIREBASE_EMULATOR_HOST` - Emulators not allowed in CI
- `USE_MOCKS=true` - Mocks not allowed in CI  
- `NODE_ENV=development` - Only for local development
- Any hardcoded secret values

## Firebase Private Key Handling

The `FIREBASE_PRIVATE_KEY` requires special handling in CI environments:

```javascript
// Correct handling in application code:
privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
```

In GitHub secrets, store the private key with literal `\n` characters that will be replaced at runtime.

## Validation

All deployments should run the Firebase validation script:

```yaml
- name: Validate Firebase Production Configuration
  run: ./scripts/validate-firebase-production.sh
  env:
    NODE_ENV: production
    FIREBASE_PROJECT_ID: ceremonial-tea-470904-f3
    # ... other Firebase variables
```

## Testing Configuration

Test environments use a separate project but still require **real Firebase connections**:

```yaml
env:
  NODE_ENV: test
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}  # Test project, not ceremonial-tea
  # ... other test Firebase variables
```

## Security Best Practices

1. **Never commit secret values** - Always use `${{ secrets.SECRET_NAME }}`
2. **Validate configurations** - Run validation scripts before deployment
3. **Use live services** - No mocks/emulators in CI except unit tests
4. **Proper escaping** - Handle Firebase private key escaping correctly
5. **Environment separation** - Use different Firebase projects for test vs production

## Troubleshooting

### Common Issues

1. **Firebase private key errors**: Ensure proper `\n` escaping
2. **Validation failures**: Check all required environment variables are set
3. **Emulator detected**: Remove any `FIREBASE_EMULATOR_HOST` variables from CI
4. **Project ID validation**: Ensure using `ceremonial-tea-470904-f3` for production

### Debug Commands

```bash
# Validate Firebase configuration
npm run firebase:validate

# Check for prohibited variables
./scripts/validate-firebase-production.sh

# Test with production environment
NODE_ENV=production FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3 npm test
```