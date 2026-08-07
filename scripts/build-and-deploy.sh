#!/bin/bash
# Q-Empire Build & Deploy Script
# Run this to build the AAB and get instructions for Google Play upload

echo "🚀 Q-Empire Social Autopilot - Build Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "👉 Download from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

echo "✅ EAS CLI installed"

# Check if user is logged in
echo ""
echo "🔐 Checking Expo login..."
eas whoami || eas login

# Navigate to mobile directory
cd "$(dirname "$0")/../mobile" || exit 1

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️ Building Production AAB (Android App Bundle)..."
echo "⏳ This will take 15-30 minutes. Don't close this window!"
echo ""

eas build --platform android --profile production --non-interactive

echo ""
echo "✅ Build initiated!"
echo ""
echo "📧 You will receive an email when the build is complete."
echo "📥 Or check the build status at: https://expo.dev/builds"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Download the .aab file from the build page"
echo "2. Go to https://play.google.com/console"
echo "3. Upload the .aab file to Production track"
echo "4. Complete store listing (see docs/GOOGLE_PLAY_DEPLOYMENT.md)"
echo "5. Publish!"
echo ""
echo "🔐 Admin Portal Credentials:"
echo "   Email: admin@qempire.ai"
echo "   Password: QEmpire2024!"
echo ""
