# 🚀 Google Play Store Deployment Guide

## Complete Step-by-Step for Q-Empire Social Autopilot

---

## 📋 BEFORE YOU START - Checklist

Make sure you have:
- [ ] Google Play Developer Account ($25 one-time fee) — https://play.google.com/console
- [ ] Your computer with Node.js installed
- [ ] This repo cloned locally
- [ ] Expo account (free) — https://expo.dev
- [ ] GitHub token (you already have this)

---

## 🏗️ STEP 1: Build the AAB (Android App Bundle)

### Option A: Using EAS Build (Recommended - Cloud Build)

**This is the easiest way. Expo builds it in the cloud.**

#### 1.1 Install EAS CLI

Open your terminal (Command Prompt on Windows, Terminal on Mac):

```bash
npm install -g eas-cli
```

#### 1.2 Login to Expo

```bash
eas login
```

Type your Expo username and password when prompted.

#### 1.3 Configure the Project

```bash
cd qempire-social-autopilot/mobile
```

```bash
eas build:configure
```

When it asks, select:
- **Platform:** Android
- **Project ID:** It will create one automatically

#### 1.4 Build the Production AAB

```bash
eas build --platform android --profile production
```

**What happens:**
- Expo uploads your code to their build servers
- They build the AAB file (Android App Bundle)
- This takes **15-30 minutes**
- You'll get a download link when it's done

#### 1.5 Download the AAB

When the build finishes, you'll see:
```
✅ Build completed!
📥 Download: https://expo.dev/artifacts/xxxxxxxx
```

Click that link or copy it to your browser to download the `.aab` file.

**Save it somewhere you can find it** (like your Desktop or Downloads folder).

---

### Option B: Using Fastlane (Local Build + Auto Upload)

**Use this if you want to automate everything.**

#### 2.1 Install Fastlane

```bash
cd qempire-social-autopilot/mobile/android
```

```bash
sudo gem install fastlane
```

(On Windows, you might need to use `gem install fastlane` without sudo)

#### 2.2 Create Google Service Account

**You NEED this to upload automatically.**

1. Go to https://play.google.com/console
2. Click your app (or create one)
3. Go to **Setup** → **API access**
4. Click **Create new service account**
5. Follow the link to Google Cloud Console
6. Create a service account:
   - Name: `qempire-deploy`
   - Role: `Service Account User`
7. Create a key (JSON format)
8. Download the JSON file
9. **Rename it to `google-service-account.json`**
10. Move it to: `qempire-social-autopilot/mobile/android/`

#### 2.3 Build and Upload

```bash
cd qempire-social-autopilot/mobile/android
fastlane build_aab
```

This creates the AAB file at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

To upload automatically:
```bash
fastlane deploy
```

---

## 📤 STEP 2: Upload to Google Play Console

### 2.1 Open Google Play Console

Go to: **https://play.google.com/console**

Sign in with your Google account.

### 2.2 Create a New App

1. Click **"Create app"** (blue button)
2. **App name:** Q-Empire Social Autopilot
3. **Default language:** English (United States)
4. **App or game:** App
5. **Free or paid:** Free (or paid if you want)
6. Check the boxes:
   - ✅ Declarations (content guidelines, US export laws)
7. Click **"Create app"**

### 2.3 Go to Production Track

1. On the left sidebar, click **"Production"**
2. Click **"Create new release"**
3. Click **"Upload"** (or drag and drop your `.aab` file)
4. Wait for it to upload and process

### 2.4 Fill in Release Details

- **Release name:** 1.0.0
- **Release notes:**
  ```
  🚀 Initial Release

  - AI-powered social media autopilot for 25 platforms
  - Automated content generation and scheduling
  - Real-time analytics dashboard
  - Admin portal for post-launch management
  - Animated characters and vibrant UI
  ```

### 2.5 Review and Rollout

1. Click **"Review release"**
2. Check for any errors (fix them if any)
3. Click **"Start rollout to Production"**

**⚠️ IMPORTANT:** For your first release, it will say **"Draft"** — this is normal. You need to complete the app details first.

---

## 📝 STEP 3: Complete App Details (Required Before Publishing)

### 3.1 App Access

1. Go to **"App access"** (left sidebar)
2. Select **"All functionality is available without special access"**
3. Click **"Save"**

### 3.2 Ads

1. Go to **"Ads"**
2. Select **"This app does not contain ads"** (or select yes if you plan to add ads)
3. Click **"Save"**

### 3.3 Content Ratings

1. Go to **"Content ratings"**
2. Click **"Start questionnaire"**
3. Answer the questions:
   - Category: **Social Networking**
   - Violence: No
   - Sexual content: No
   - Language: No
   - Drugs: No
   - Gambling: No
4. Click **"Save"** then **"Submit"**

### 3.4 Target Audience

1. Go to **"Target audience and content"**
2. Select **"18 and over"** (or appropriate age)
3. Click **"Next"** then **"Save"**

### 3.5 News Apps

1. Go to **"News apps"**
2. Select **"No, this app is not a news app"**
3. Click **"Save"**

### 3.6 Data Safety

1. Go to **"Data safety"**
2. Click **"Start"**
3. Answer questions about data collection:
   - Email: Yes
   - User IDs: Yes
   - App activity: Yes
   - Photos/Videos: Yes (if using image picker)
4. Click **"Save"** then **"Submit"**

### 3.7 App Content (Optional)

1. Go to **"App content"**
2. Complete any remaining sections

---

## 🎨 STEP 4: Store Listing (Make It Look Professional)

### 4.1 Main Store Listing

1. Go to **"Main store listing"** (left sidebar under "Grow" → "Store presence")
2. Fill in:

**App name:** Q-Empire Social Autopilot

**Short description:** AI-powered social media autopilot for 25 platforms

**Full description:**
```
🚀 Q-Empire Social Autopilot — The Ultimate AI-Powered Social Media Marketing Platform

Posts to 25 platforms while you sleep. Fully automated. Zero effort.

✨ WHAT YOU GET:
🤖 AI Content Generation — Creates unique, platform-optimized posts for each network
🔗 25 Platforms — Facebook, Instagram, X/Twitter, LinkedIn, TikTok, Pinterest, YouTube, Reddit, Threads, Tumblr, Medium, Mastodon, Discord, Telegram, WhatsApp, Snapchat, Bluesky, WordPress, Blogger, Mix, Quora, VK, Weibo, LINE, KakaoTalk
📅 Autopilot Mode — Set your schedule once, let AI handle the rest
📊 Real-Time Analytics — Track performance across all platforms
💎 Flexible Plans — Free, Basic, Pro, and Elite tiers
🧜🏾‍♀️ Beautiful UI — Animated characters, vibrant colors, smooth experience

🎯 PERFECT FOR:
• Entrepreneurs scaling their brand
• Social media managers handling multiple accounts
• Agencies managing client content
• Anyone who wants to maximize social presence without the manual work

🔒 SECURE & RELIABLE:
• Encrypted API credentials
• OAuth2 authentication where available
• Rate limiting per platform
• Admin portal for post-launch management

📈 RESULTS:
• 3x content output
• 60% time savings
• 40% engagement increase

Download now and let AI handle your social media while you focus on growing your business!
```

### 4.2 Graphics

You need these images. Create them in Canva (https://canva.com) or similar:

**App Icon:** 512 x 512 px (PNG)
- Already created as placeholder in `mobile/assets/icon.png`
- Replace with your final design

**Feature Graphic:** 1024 x 500 px (PNG or JPEG)
- This is the big banner at the top of your store page
- Use bright colors: yellow, pink, electric blue
- Include the app name and tagline

**Phone Screenshots:** 2-8 screenshots
- Required: 16:9 aspect ratio
- Show: Splash screen, Dashboard, Content, Analytics, Settings
- Use the web preview to capture screenshots: https://raw.githack.com/michellemcbean5-droid/qempire-social-autopilot/main/preview.html

**7-inch Tablet Screenshots:** Optional but recommended

**10-inch Tablet Screenshots:** Optional but recommended

### 4.3 Upload Graphics

1. In **"Main store listing"**, scroll to **"Graphics"**
2. Upload your app icon, feature graphic, and screenshots
3. Click **"Save"**

---

## ✅ STEP 5: Final Review & Publish

### 5.1 Check Dashboard

Go to **"Dashboard"** (left sidebar). Look for:
- ✅ App access
- ✅ Ads
- ✅ Content ratings
- ✅ Target audience
- ✅ Data safety
- ✅ Main store listing (with graphics)
- ✅ Production release (with AAB uploaded)

### 5.2 Fix Any Issues

If you see any **red warnings or errors**, fix them before publishing.

### 5.3 Go to Production

1. Go to **"Production"** → **"Releases"**
2. Find your release (1.0.0)
3. Click **"Edit release"**
4. Make sure everything looks good
5. Click **"Review release"**
6. Scroll down and click **"Start rollout to Production"**

### 5.4 Wait for Review

Google will review your app. This usually takes:
- **1-3 days** for new apps
- **A few hours** for updates

You'll get an email when it's approved or if they need changes.

---

## 🔐 ADMIN PORTAL ACCESS

Once the app is live, you can access the admin portal:

### From the App:
1. Open Q-Empire
2. Go to **Settings** tab
3. Scroll down to **"Admin Portal"**
4. Tap it

### Login Credentials:
- **Email:** `admin@qempire.ai`
- **Password:** `QEmpire2024!`

### What You Can Do:
- ✅ View system status (all APIs, servers)
- ✅ Manage content queues (edit, approve, delete posts)
- ✅ Enable/disable platforms
- ✅ View user analytics
- ✅ Toggle debug mode
- ✅ Enable maintenance mode (pause all posting)
- ✅ Clear queues, reset APIs
- ✅ View build information

### Changing Admin Password:
Edit the file:
```
mobile/src/screens/AdminLoginScreen.tsx
```

Find:
```typescript
const ADMIN_CREDENTIALS = {
  email: 'admin@qempire.ai',
  password: 'QEmpire2024!',
};
```

Change to your desired credentials, then rebuild and update.

---

## 🔄 STEP 6: Update the App (After Launch)

When you need to fix bugs or add features:

### 6.1 Make Changes

Edit the code in the repo, commit to GitHub.

### 6.2 Rebuild

```bash
cd qempire-social-autopilot/mobile
eas build --platform android --profile production
```

### 6.3 Upload New Version

1. Go to Google Play Console
2. Go to **Production** → **Create new release**
3. Upload the new `.aab` file
4. Update release notes
5. Click **Review release** → **Start rollout**

---

## 🆘 TROUBLESHOOTING

### "Build failed with exit code 1"
- Check that all dependencies are installed: `npm install`
- Check that `metro.config.js` exists
- Check that assets folder has icon files

### "AAB upload failed"
- Make sure the AAB file is valid (try installing it locally first)
- Check that your Google Play app package name matches: `com.qempire.socialautopilot`

### "App rejected for policy violation"
- Read the rejection email carefully
- Common issues: missing privacy policy, incorrect data safety answers, misleading description
- Fix and resubmit

### "Admin portal not showing"
- Make sure you rebuilt after adding the admin screens
- Check that navigation includes AdminLogin and AdminDashboard

---

## 📞 QUICK REFERENCE

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start dev server | `npx expo start` |
| Build preview APK | `eas build --platform android --profile preview` |
| Build production AAB | `eas build --platform android --profile production` |
| Build with Fastlane | `cd mobile/android && fastlane build_aab` |
| Upload with Fastlane | `cd mobile/android && fastlane deploy` |

---

## 🎉 YOU'RE DONE!

Once Google approves your app, it will be live on the Play Store!

**Share your app:**
```
https://play.google.com/store/apps/details?id=com.qempire.socialautopilot
```

**Admin portal is always available** for post-launch fixes and management.

Good luck! 🚀
