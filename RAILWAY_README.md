# 🚂 Railway Deployment - Quick Start

Deploy yoohoo.guru backend to Railway in 3 commands:

```bash
npm install -g @railway/cli
railway login
railway up .
```

## ⚡ Environment Variables Required

Set these in Railway dashboard before deployment:

```bash
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key
JWT_SECRET=your_super_secret_key
```

## 📚 Full Documentation

- [Complete Railway Guide](docs/RAILWAY_DEPLOYMENT.md)
- [Environment Variables Reference](.env.example)
- [General Deployment Guide](docs/DEPLOYMENT.md)

## ✅ Health Check

After deployment, verify at: `https://your-app.railway.app/health`