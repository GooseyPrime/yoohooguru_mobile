#!/bin/bash

# Build Optimization Script for yoohoo.guru
# This script optimizes the build process and provides accurate timing

echo "🔧 Optimizing build performance..."

# Clean previous builds and caches
echo "🧹 Cleaning previous builds..."
rm -rf frontend/dist
rm -rf frontend/.webpack-cache
rm -rf frontend/node_modules/.cache

# Ensure all dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "Installing dependencies..."
    npm run install:all
fi

# Run optimized build with timing
echo "⏱️  Starting build process..."
time npm run build

echo "✅ Build optimization complete!"
echo ""
echo "📊 Build Performance Notes:"
echo "- First-time builds (cold cache): 30 seconds - 6+ minutes depending on hardware"
echo "- Subsequent builds (warm cache): 10-30 seconds"
echo "- Environment factors affecting build time:"
echo "  • CPU speed and cores"
echo "  • Available RAM"
echo "  • Storage type (SSD vs HDD)"
echo "  • Operating system"
echo "  • Node.js version"
echo "  • Network speed (for dependency resolution)"
echo ""
echo "🚀 To improve build performance:"
echo "1. Use SSD storage"
echo "2. Ensure adequate RAM (8GB+ recommended)"
echo "3. Close unnecessary applications during build"
echo "4. Use Node.js 18+ for better performance"