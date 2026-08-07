@echo off
REM Q-Empire Build & Deploy Script for Windows
REM Run this to build the AAB and get instructions for Google Play upload

echo 🚀 Q-Empire Social Autopilot - Build Script
echo ==============================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo 👉 Download from: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node -v

REM Check if EAS CLI is installed
eas --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing EAS CLI...
    call npm install -g eas-cli
)

echo ✅ EAS CLI installed

REM Check if user is logged in
echo.
echo 🔐 Checking Expo login...
eas whoami >nul 2>&1
if errorlevel 1 (
    echo Please login to Expo:
    call eas login
)

REM Navigate to mobile directory
cd /d "%~dp0..\mobile"

echo.
echo 📦 Installing dependencies...
call npm install

echo.
echo 🏗️ Building Production AAB (Android App Bundle)...
echo ⏳ This will take 15-30 minutes. Don't close this window!
echo.

call eas build --platform android --profile production --non-interactive

echo.
echo ✅ Build initiated!
echo.
echo 📧 You will receive an email when the build is complete.
echo 📥 Or check the build status at: https://expo.dev/builds
echo.
echo 📝 NEXT STEPS:
echo 1. Download the .aab file from the build page
echo 2. Go to https://play.google.com/console
echo 3. Upload the .aab file to Production track
echo 4. Complete store listing (see docs/GOOGLE_PLAY_DEPLOYMENT.md)
echo 5. Publish!
echo.
echo 🔐 Admin Portal Credentials:
echo    Email: admin@qempire.ai
echo    Password: QEmpire2024!
echo.

pause
