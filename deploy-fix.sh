#!/bin/bash

# Production Fix Deployment Script
echo "🔧 Deploying production fixes for yoohoo.guru..."

# Navigate to project directory
cd "C:\The-Almagest-Project\yoohooguru" || exit 1

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "➕ Adding all changes..."
git add .

# Commit the fixes
echo "💾 Committing production fixes..."
git commit -m "fix: resolve production errors

- Fix Firebase configuration to gracefully handle missing env vars
- Fix CSS variables in LoadingScreen and Footer components
- Add .env file with default values
- Improve AuthContext error handling
- Update GlobalStyle with font fallbacks

Fixes:
- White screen on production
- Firebase configuration errors
- useTheme CSS variable errors
- Font loading failures
- App crashes from missing environment variables"

# Push to main branch (Railway auto-deploys)
echo "🚀 Pushing to Railway..."
git push origin main

echo "✅ Production fixes deployed!"
echo "🕐 Railway will auto-deploy in 2-3 minutes"
echo "🌐 Check https://yoohoo.guru in ~5 minutes"
