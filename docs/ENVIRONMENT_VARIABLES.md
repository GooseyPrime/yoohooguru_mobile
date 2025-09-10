# Environment Variables Guide

This guide documents all environment variables used in the yoohoo.guru skill-sharing platform. All variables are defined in `.env.example` with default values and descriptions.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` with your specific configuration

3. The application will load variables from `.env` automatically

## Environment Variable Categories

### Core Application Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Application environment (development/production) |
| `PORT` | `3001` | Backend server port |
| `API_BASE_URL` | `http://localhost:3001` | Backend API base URL |

### Application Branding & Contact

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_BRAND_NAME` | `yoohoo.guru` | Application brand name used throughout the platform |
| `APP_DISPLAY_NAME` | `yoohoo.guru` | Display name for headers and titles |
| `APP_LEGAL_EMAIL` | `legal@yoohoo.guru` | Legal contact email address |
| `APP_PRIVACY_EMAIL` | `privacy@yoohoo.guru` | Privacy contact email address |
| `APP_SUPPORT_EMAIL` | `support@yoohoo.guru` | Support contact email address |
| `APP_CONTACT_ADDRESS` | `yoohoo.guru, Legal Department` | Physical/legal address |

### CORS & Security Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ORIGIN_PRODUCTION` | `https://yoohoo.guru,https://www.yoohoo.guru` | Allowed origins in production (comma-separated) |
| `CORS_ORIGIN_DEVELOPMENT` | `http://localhost:3000,http://127.0.0.1:3000` | Allowed origins in development (comma-separated) |

### Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPRESS_JSON_LIMIT` | `10mb` | Maximum JSON payload size |
| `EXPRESS_URL_LIMIT` | `10mb` | Maximum URL-encoded payload size |

### Rate Limiting

| Variable | Default | Description |
|----------|---------|-------------|
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit time window in milliseconds (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Maximum requests per window |
| `RATE_LIMIT_MESSAGE` | `Too many requests from this IP, please try again later.` | Rate limit error message |

### API Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `API_WELCOME_MESSAGE` | `🎯 Welcome to yoohoo.guru API` | Welcome message for API root endpoint |
| `API_VERSION` | `1.0.0` | API version displayed in responses |
| `API_DESCRIPTION` | `Skill-sharing platform backend` | API description |

### Frontend Development

| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_DEV_PORT` | `3000` | Webpack dev server port |
| `WEBPACK_DEV_OPEN` | `true` | Auto-open browser on dev server start |
| `WEBPACK_DEV_HOT` | `true` | Enable hot module replacement |

### React App Variables (Frontend)

All React app variables must be prefixed with `REACT_APP_` to be accessible in the frontend:

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:3001/api` | Frontend API endpoint |
| `REACT_APP_ENVIRONMENT` | `development` | Frontend environment |
| `REACT_APP_BRAND_NAME` | `yoohoo.guru` | Brand name used in UI components |
| `REACT_APP_DISPLAY_NAME` | `yoohoo.guru` | Display name for headers |
| `REACT_APP_LEGAL_EMAIL` | `legal@yoohoo.guru` | Legal email for frontend contact forms |
| `REACT_APP_PRIVACY_EMAIL` | `privacy@yoohoo.guru` | Privacy email for frontend contact forms |
| `REACT_APP_SUPPORT_EMAIL` | `support@yoohoo.guru` | Support email for frontend contact forms |
| `REACT_APP_CONTACT_ADDRESS` | `yoohoo.guru, Legal Department` | Contact address for frontend |

### External Services

#### Firebase Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_API_KEY` | ✅ | Firebase API key |
| `FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `FIREBASE_DATABASE_URL` | ✅ | Firebase database URL |
| `FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase messaging sender ID |
| `FIREBASE_APP_ID` | ✅ | Firebase app ID |

#### Firebase for Frontend

All Firebase variables also need `REACT_APP_` prefixed versions for frontend use:

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_DATABASE_URL`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

#### JWT Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | ✅ | Secret key for JWT token signing |
| `JWT_EXPIRES_IN` | ❌ | JWT token expiration time (default: 7d) |

#### Stripe Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `STRIPE_SECRET_KEY` | ❌ | Stripe secret key for payments |
| `STRIPE_PUBLISHABLE_KEY` | ❌ | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | ❌ | Stripe webhook secret |
| `STRIPE_WEBHOOK_ID` | ❌ | Stripe webhook ID |
| `STRIPE_GURU_PASS_PRICE_ID` | ❌ | Price ID for Guru Pass subscription |
| `STRIPE_SKILL_VERIFICATION_PRICE_ID` | ❌ | Price ID for skill verification |
| `STRIPE_TRUST_SAFETY_PRICE_ID` | ❌ | Price ID for trust & safety features |

#### AI Services

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ❌ | OpenRouter API key for AI features |
| `OPENROUTER_API_URL` | ❌ | OpenRouter API URL (default: https://openrouter.ai/api/v1) |

### Caching & Performance

| Variable | Default | Description |
|----------|---------|-------------|
| `GOOGLE_FONTS_STYLESHEETS_URL` | `https://fonts.googleapis.com/` | Google Fonts stylesheets URL for caching |
| `GOOGLE_FONTS_WEBFONTS_URL` | `https://fonts.gstatic.com/` | Google Fonts webfonts URL for caching |
| `CACHE_MAX_ENTRIES` | `30` | Maximum cache entries for service worker |
| `CACHE_MAX_AGE_SECONDS` | `31536000` | Cache expiration time in seconds (1 year) |

### File Upload & Limits

| Variable | Default | Description |
|----------|----------|-------------|
| `MAX_FILE_SIZE` | `5242880` | Maximum file upload size in bytes (5MB) |
| `ALLOWED_FILE_TYPES` | `image/jpeg,image/png,image/gif,image/webp` | Allowed file types for uploads |

### Logging

| Variable | Default | Description |
|----------|----------|-------------|
| `LOG_LEVEL` | `info` | Logging level (error, warn, info, debug) |
| `LOG_FILE_PATH` | `./logs/app.log` | Log file path |

### Admin & Operations

| Variable | Default | Description |
|----------|----------|-------------|
| `ADMIN_KEY` | `change-me-in-prod` | Admin access key |
| `ADMIN_WRITE_ENABLED` | `false` | Enable admin write operations |

## Environment-Specific Configuration

### Development Environment

In development, most variables have sensible defaults. The minimum required setup is:

```env
# Copy .env.example to .env and add:
FIREBASE_PROJECT_ID=your_development_project
FIREBASE_API_KEY=your_development_key
JWT_SECRET=your_development_secret
```

### Production Environment

In production, these variables are **required**:

- `NODE_ENV=production` - Must be set for all CI workflows and production deployments
- `FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3` - Production Firebase project (REQUIRED - no placeholders allowed)
- `FIREBASE_CLIENT_EMAIL` - Service account email (REQUIRED - must be referenced from secrets)
- `FIREBASE_PRIVATE_KEY` - Service account private key (REQUIRED - must be referenced from secrets with proper escaping)
- `FIREBASE_API_KEY` - Your production Firebase API key
- `JWT_SECRET` - Must be a strong, unique secret
- `STRIPE_WEBHOOK_SECRET` - Must be referenced as environment variable (not hardcoded)
- All other Firebase configuration variables

#### ❌ Prohibited in Production/Staging:

- `FIREBASE_EMULATOR_HOST` - Emulators are prohibited in production/staging
- `USE_MOCKS=true` - Mocks are prohibited in production/staging
- Firebase project IDs containing: demo, test, mock, localhost, emulator, example, your_, changeme
- Any hardcoded secret values in configuration files

### Configuration Validation

The application includes configuration validation that:

- ✅ Ensures required variables are set in production
- ⚠️ Warns about missing optional variables that affect features
- 📝 Logs configuration summary on startup
- 🔒 Validates security-sensitive variables

## Deployment Examples

### Railway Deployment

```bash
# Set all required variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_production_secret
railway variables set FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
# ... other variables

# Deploy
railway up
```

### Netlify Frontend Deployment

Set these variables in Netlify dashboard:

```
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
# ... other REACT_APP_ variables
```

### Docker Deployment

```bash
# Using environment file
docker run --env-file .env your-app

# Using individual variables
docker run -e NODE_ENV=production -e JWT_SECRET=secret your-app
```

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` for documentation
2. **Use strong secrets** - Generate random JWT secrets for production
3. **Rotate secrets regularly** - Update API keys and secrets periodically
4. **Limit CORS origins** - Only allow your actual domains in production
5. **Use HTTPS** - Ensure all production URLs use HTTPS
6. **Validate configuration** - The app validates required variables automatically

## Troubleshooting

### Common Issues

1. **"Missing required environment variables" error**
   - Ensure all required variables are set in production
   - Check variable names for typos

2. **CORS errors in browser**
   - Verify `CORS_ORIGIN_PRODUCTION` includes your frontend domain
   - Check that URLs match exactly (including https/http)

3. **Frontend environment variables not updating**
   - Ensure variables are prefixed with `REACT_APP_`
   - Restart the frontend development server after changes

4. **Firebase connection issues**
   - Verify all Firebase variables are set correctly
   - Check Firebase project settings

### Debug Commands

```bash
# Check loaded configuration
curl http://localhost:3001/health

# View configuration logs
tail -f logs/app.log

# Test specific variables
NODE_ENV=production APP_BRAND_NAME="Test" npm start
```