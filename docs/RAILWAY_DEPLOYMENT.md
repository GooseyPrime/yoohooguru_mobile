# Railway Deployment Guide for yoohoo.guru

This guide provides step-by-step instructions for deploying yoohoo.guru to Railway.

## Prerequisites

- Railway account (sign up at [railway.app](https://railway.app))
- Railway CLI installed
- Environment variables configured

## Quick Start

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

This will open your browser for authentication.

### 3. Deploy from Repository Root

```bash
# Navigate to your yoohoo.guru repository
cd /path/to/yoohooguru

# Deploy the backend service
railway up .
```

The deployment will:
- Automatically detect the Node.js backend
- Install dependencies
- Build the application
- Start the server on Railway's assigned port

## Environment Variables

Set these required environment variables in your Railway project:

**📋 For complete variable documentation, see [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)**

### Core Configuration
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001  # Railway will override this

# App Branding (customize for your deployment)
railway variables set APP_BRAND_NAME=yoohoo.guru
railway variables set APP_DISPLAY_NAME=yoohoo.guru
railway variables set APP_LEGAL_EMAIL=legal@yoohoo.guru
railway variables set APP_PRIVACY_EMAIL=privacy@yoohoo.guru
railway variables set APP_SUPPORT_EMAIL=support@yoohoo.guru

# CORS Origins (update with your Railway domain)
railway variables set CORS_ORIGIN_PRODUCTION=https://your-app.railway.app,https://your-custom-domain.com
```

### Firebase Configuration
```bash
railway variables set FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
railway variables set FIREBASE_API_KEY=your_api_key
railway variables set FIREBASE_AUTH_DOMAIN=ceremonial-tea-470904-f3.firebaseapp.com
railway variables set FIREBASE_DATABASE_URL=https://ceremonial-tea-470904-f3-default-rtdb.firebaseio.com
railway variables set FIREBASE_STORAGE_BUCKET=ceremonial-tea-470904-f3.appspot.com
railway variables set FIREBASE_MESSAGING_SENDER_ID=your_sender_id
railway variables set FIREBASE_APP_ID=your_app_id
railway variables set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@ceremonial-tea-470904-f3.iam.gserviceaccount.com
railway variables set FIREBASE_PRIVATE_KEY=your_firebase_private_key_here
```

### Security & JWT
```bash
railway variables set JWT_SECRET=your_super_secret_jwt_key_change_this
railway variables set JWT_EXPIRES_IN=7d
```

### External API Keys
```bash
railway variables set OPENROUTER_API_KEY=your_openrouter_api_key
railway variables set STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Rate Limiting
```bash
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100
```

## Project Configuration Files

The repository includes pre-configured Railway deployment files:

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run install:all && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Important**: The build command uses `npm run install:all && npm run build` to ensure all workspace dependencies are properly installed before building. This is essential for monorepo deployments where the backend serves the frontend static files.

### `nixpacks.toml`
```toml
# Nixpacks configuration for yoohoo.guru monorepo
[variables]
NIXPACKS_NODE_VERSION = "20"
NPM_CONFIG_PRODUCTION = "false"

[phases.setup]
nixPkgs = ["nodejs-20_x", "npm-9_x"]

[phases.install]
cmds = ["npm run install:all"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

**Note**: This configuration ensures Nixpacks properly handles the monorepo workspace structure with explicit dependency installation phases.

### `Procfile`
```
web: node backend/src/index.js
```

## Common Commands

| Command | Description |
|---------|-------------|
| `railway up .` | Deploy from current directory |
| `railway deploy` | Redeploy with existing config |
| `railway logs` | View application logs |
| `railway status` | Check deployment status |
| `railway variables list` | View environment variables |
| `railway variables set KEY=value` | Set environment variable |
| `railway domain add yourdomain.com` | Add custom domain |
| `railway restart` | Restart the service |

## Health Check

Railway will automatically monitor the `/health` endpoint. The backend includes a health check that returns:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

## Custom Domain Setup

1. **Add Domain**
   ```bash
   railway domain add yourdomain.com
   ```

2. **Configure DNS**
   Point your domain's DNS to the Railway-provided CNAME.

3. **SSL Certificate**
   Railway automatically provisions SSL certificates for custom domains.

## Monitoring and Logs

### View Logs
```bash
# Real-time logs
railway logs --tail

# Historical logs
railway logs --limit 100
```

### Application Metrics
Access metrics in the Railway dashboard:
- CPU usage
- Memory consumption
- Request response times
- Error rates

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Ensure all dependencies are listed in `package.json`
   - Check build logs: `railway logs --build`

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names for typos

3. **Port Configuration**
   - Railway automatically assigns PORT
   - Don't hardcode port numbers

4. **Health Check Failures**
   - Ensure `/health` endpoint returns 200 status
   - Check server startup logs

### Getting Help

1. **Railway Logs**
   ```bash
   railway logs --tail
   ```

2. **Deployment Status**
   ```bash
   railway status
   ```

3. **Railway Documentation**
   Visit [docs.railway.app](https://docs.railway.app)

## Advanced Configuration

### Database Integration
If using Railway's database services:

```bash
# Add PostgreSQL database
railway add postgresql

# Connect to database
railway variables set DATABASE_URL=$DATABASE_URL
```

### Redis Cache
```bash
# Add Redis service
railway add redis

# Connect to Redis
railway variables set REDIS_URL=$REDIS_URL
```

### Environment Separation
```bash
# Create different environments
railway environment create staging
railway environment create production

# Deploy to specific environment
railway deploy --environment production
```

This completes the Railway deployment setup for yoohoo.guru. The backend will be accessible at the Railway-provided URL and ready to serve API requests.