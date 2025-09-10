@echo off
REM Production Fix Deployment Script for Windows
echo 🔧 Deploying production fixes for yoohoo.guru...

REM Navigate to project directory
cd /d "C:\The-Almagest-Project\yoohooguru"
if errorlevel 1 (
    echo ❌ Failed to navigate to project directory
    pause
    exit /b 1
)

REM Check git status
echo.
echo 📋 Checking git status...
git status

REM Add all changes
echo.
echo ➕ Adding all changes...
git add .

REM Commit the fixes
echo.
echo 💾 Committing production fixes...
git commit -m "fix: resolve production errors - Firebase config, CSS variables, accessibility"

if errorlevel 1 (
    echo ⚠️ No changes to commit or commit failed
    pause
    exit /b 1
)

REM Push to main branch (Railway auto-deploys)
echo.
echo 🚀 Pushing to Railway...
git push origin main

if errorlevel 1 (
    echo ❌ Failed to push to remote repository
    pause
    exit /b 1
)

echo.
echo ✅ Production fixes deployed!
echo 🕐 Railway will auto-deploy in 2-3 minutes
echo 🌐 Check https://yoohoo.guru in ~5 minutes
echo.
pause
