# Firebase Usage Policy and Standards

## Overview

This document establishes the policy and standards for Firebase usage across all environments in the yoohoo.guru platform to ensure production deployments use live cloud infrastructure and not emulators or mocks.

## Policy Statement

**Mocks and emulators are prohibited in production, staging, and PR preview deployments. All cloud dependencies must be exercised live.**

## Environment-Specific Requirements

### 🚀 Production Environment
- **MUST** use live Firebase projects only
- **MUST** have all Firebase environment variables properly configured
- **MUST NOT** use any emulator or mock configurations
- **MUST NOT** contain demo, test, or placeholder values
- Firebase project ID must be production-ready (no demo/test patterns)

### 🔄 Staging Environment  
- **MUST** use live Firebase projects (separate from production)
- **MUST** have all Firebase environment variables properly configured
- **MUST NOT** use any emulator or mock configurations
- **MUST NOT** contain demo, test, or placeholder values
- Should use dedicated staging Firebase project

### 🔍 PR Preview Environments
- **MUST** use live Firebase projects for E2E/acceptance testing
- **MUST** validate that all API calls hit real Firebase services
- **MUST NOT** use mocks or emulators for deployed preview environments
- May use dedicated testing Firebase projects (but still live)

### 🛠️ Development Environment
- **MAY** use Firebase emulators for local development
- **MAY** use mock configurations for offline development
- **SHOULD** provide easy switch between live and emulator configurations
- Emulator usage must be explicitly configured and documented

### 🧪 Unit Testing Environment
- **MAY** use mocks and emulators
- **SHOULD** use mocks for isolated unit tests
- Test-specific configurations are permitted

## Implementation Standards

### Environment Variable Requirements

#### Required for Production/Staging:
```bash
# Backend Firebase Configuration
FIREBASE_PROJECT_ID=your-live-project-id
FIREBASE_API_KEY=your-live-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id

# Frontend Firebase Configuration
REACT_APP_FIREBASE_PROJECT_ID=your-live-project-id
REACT_APP_FIREBASE_API_KEY=your-live-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

#### Prohibited in Production/Staging:
```bash
# These variables are PROHIBITED in production/staging
FIREBASE_EMULATOR_HOST=localhost:9000  # ❌ NOT ALLOWED
USE_MOCKS=true                         # ❌ NOT ALLOWED
NODE_ENV=test                          # ❌ NOT ALLOWED in production
```

### Prohibited Patterns

The following patterns are **prohibited** in production and staging Firebase configurations:

- `demo*` - Demo project identifiers
- `test*` - Test project identifiers  
- `mock*` - Mock service identifiers
- `localhost*` - Local service references
- `emulator*` - Emulator service references
- `example*` - Example/placeholder values
- `your_*` - Template placeholder values
- `changeme*` - Placeholder values requiring change

### Validation Requirements

#### Automated Validation
1. **CI/CD Pipeline**: All production and staging deployments must pass Firebase validation
2. **PR Validation**: All pull requests must be checked for prohibited configurations
3. **Build-time Validation**: Frontend and backend must validate configurations at build time
4. **Runtime Validation**: Applications must validate Firebase configuration at startup

#### Manual Validation Checklist
- [ ] Firebase project ID is production-appropriate
- [ ] All Firebase environment variables are set
- [ ] No emulator hosts are configured
- [ ] No mock flags are enabled
- [ ] Firebase project exists and is accessible
- [ ] Database rules are properly configured
- [ ] Authentication settings are production-ready

## Enforcement Mechanisms

### 1. CI/CD Pipeline Enforcement
- `validate-pr-firebase` job blocks PRs with prohibited configurations
- `validate-firebase-staging` job blocks staging deployments with invalid configs
- `validate-firebase-production` job blocks production deployments with invalid configs

### 2. Application-Level Enforcement
- Backend Firebase initialization includes production validation
- Frontend AuthContext includes production validation
- Applications fail fast on invalid Firebase configurations in production

### 3. Validation Script
Use the provided validation script:
```bash
# Validate Firebase configuration
./scripts/validate-firebase-production.sh
```

## Development Workflow

### For Local Development
1. Copy `.env.example` to `.env`
2. Configure Firebase settings for your development needs
3. Use Firebase emulators if desired for offline development
4. Ensure production builds use live Firebase configuration

### For PR Creation
1. Ensure no prohibited Firebase configurations in code
2. Verify that preview environments will use live Firebase
3. Confirm all tests pass with live Firebase configuration
4. Review Firebase usage in code changes

### For Deployment
1. Verify all Firebase environment variables are set
2. Run Firebase validation script
3. Confirm deployment uses live Firebase project
4. Monitor Firebase usage after deployment

## Security Considerations

1. **Secrets Management**: Store Firebase configuration in secure environment variables
2. **Project Isolation**: Use separate Firebase projects for different environments
3. **Access Control**: Limit Firebase project access to authorized personnel
4. **Monitoring**: Monitor Firebase usage and costs across all environments
5. **Backup**: Ensure Firebase data is properly backed up

## Compliance and Monitoring

### Required Monitoring
- Firebase project usage across environments
- API call patterns to ensure live service usage
- Error rates from Firebase services
- Performance metrics for Firebase operations

### Audit Requirements
- Monthly review of Firebase project configurations
- Quarterly audit of environment variable settings
- Annual review of Firebase security rules and permissions

## Troubleshooting

### Common Issues

#### "Firebase not configured - using offline mode"
- **Cause**: Missing or invalid Firebase environment variables
- **Solution**: Set proper Firebase configuration for your environment
- **Production Impact**: Application will fail in production (by design)

#### "Firebase emulator host is configured but NODE_ENV is production"
- **Cause**: FIREBASE_EMULATOR_HOST is set in production environment
- **Solution**: Remove emulator configuration from production environment
- **Prevention**: Use environment-specific configuration files

#### "Firebase project ID contains prohibited pattern"
- **Cause**: Firebase project ID contains demo/test/mock patterns
- **Solution**: Use production-appropriate Firebase project ID
- **Prevention**: Validate project IDs before deployment

### Emergency Procedures

If Firebase validation blocks a critical deployment:

1. **DO NOT** disable Firebase validation
2. **DO NOT** bypass security checks
3. **DO** verify Firebase configuration is correct
4. **DO** use emergency Firebase project if main project is unavailable
5. **DO** escalate to infrastructure team if needed

## Related Documentation

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [README.md](../README.md)

## Policy Updates

This policy document is version-controlled and changes must be:
1. Reviewed by the development team
2. Approved by the infrastructure team
3. Tested in staging environment
4. Documented in CHANGELOG.md

---

**Last Updated**: 2024-01-XX  
**Version**: 1.0.0  
**Owner**: Infrastructure Team  
**Review Cycle**: Quarterly