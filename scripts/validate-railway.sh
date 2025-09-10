#!/bin/bash

# Railway Deployment Validation Script
# This script validates that all Railway deployment files are in place

echo "🚂 Validating Railway Deployment Setup..."
echo "================================================"

# Check if required files exist
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 exists"
    else
        echo "❌ $1 missing"
        exit 1
    fi
}

# Validate files
check_file "railway.json"
check_file "Procfile"
check_file "package.json"
check_file "backend/package.json"
check_file "backend/src/index.js"
check_file ".env.example"

echo ""
echo "🔍 Checking package.json scripts..."

# Check if required scripts exist
if grep -q '"railway:build"' package.json; then
    echo "✅ railway:build script exists"
else
    echo "❌ railway:build script missing"
    exit 1
fi

if grep -q '"start"' package.json; then
    echo "✅ start script exists"
else
    echo "❌ start script missing"
    exit 1
fi

echo ""
echo "🏗️  Testing build process..."
npm run railway:build

if [ $? -eq 0 ]; then
    echo "✅ Build process successful"
else
    echo "❌ Build process failed"
    exit 1
fi

echo ""
echo "📋 Environment Variables Checklist:"
echo "    Set these in Railway dashboard:"
echo "    - NODE_ENV=production"
echo "    - FIREBASE_PROJECT_ID"
echo "    - FIREBASE_API_KEY"
echo "    - JWT_SECRET"
echo "    - OPENROUTER_API_KEY"
echo "    - STRIPE_SECRET_KEY"
echo ""

echo "🎉 Railway deployment setup is valid!"
echo ""
echo "📚 Next steps:"
echo "   1. Install Railway CLI: npm install -g @railway/cli"
echo "   2. Login to Railway: railway login"
echo "   3. Deploy: railway up ."
echo ""
echo "📖 Full documentation: docs/RAILWAY_DEPLOYMENT.md"