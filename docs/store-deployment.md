# Q-Empire Social Autopilot — Store Deployment Guide

> Step-by-step submission guide for App Store (iOS) and Google Play (Android). Updated: July 2025.

---

## Prerequisites

### Before You Start
- [ ] Apple Developer Account ($99/year) — [developer.apple.com](https://developer.apple.com)
- [ ] Google Play Developer Account ($25 one-time) — [play.google.com/console](https://play.google.com/console)
- [ ] EAS (Expo Application Services) account — [expo.dev](https://expo.dev)
- [ ] App icons in all required sizes (see Asset Checklist below)
- [ ] Screenshot templates for all device sizes
- [ ] Privacy policy page live on website
- [ ] Terms of service page live on website
- [ ] Support email configured (support@qempireai.com)

### Asset Checklist

| Asset | iOS | Android | Notes |
|-------|-----|---------|-------|
| App Icon (1024×1024) | ✅ | ✅ | Used for all sizes via EAS |
| Splash Screen | ✅ | ✅ | 1242×2438 recommended |
| Screenshots (5 min) | iPhone 6.5", 5.5", iPad | Phone, Tablet 7", 10" | Use EAS automated screenshots |
| Feature Graphic | ❌ | ✅ | 1024×500 PNG |
| Promo Video | Optional | Optional | 30-120 seconds |

---

## iOS App Store — Step by Step

### Step 1: Configure App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: Q-Empire Social Autopilot
   - **Primary Language**: English
   - **Bundle ID**: `com.qempire.socialautopilot` (must match `app.json`)
   - **SKU**: `qempire-social-autopilot-001`

### Step 2: Prepare App Information

| Field | Value |
|-------|-------|
| Subtitle | AI-Powered Social Media Autopilot |
| Category | Social Networking (Primary), Business (Secondary) |
| Content Rights | Contains AI-generated content |
| Age Rating | 4+ (no mature content) |
| License Agreement | Standard Apple EULA |

### Step 3: Build with EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build (already in eas.json)
# Build for production
eas build --platform ios --profile production

# Or build locally for testing
eas build --platform ios --profile production --local
```

### Step 4: Upload to App Store Connect

EAS automatically uploads the `.ipa` to App Store Connect after build.

If manual:
```bash
# Use Transporter app or altool
xcrun altool --upload-app --type ios --file "build.ipa" --apiKey "YOUR_API_KEY" --apiIssuer "YOUR_ISSUER_ID"
```

### Step 5: Fill in App Store Listing

**Description:**
```
Q-Empire Social Autopilot is the AI-powered social media management platform that writes, schedules, and posts content across 25 platforms while you sleep.

KEY FEATURES:
🤖 AI Content Generation — Powered by Mistral-7B, generates platform-optimized posts
🔍 Website Analysis — Enter your URL, AI extracts your brand voice automatically
📅 Autopilot Mode — Auto-schedules posts at optimal times for maximum engagement
📊 Analytics Dashboard — Track performance across all platforms in one view
🔗 25 Platforms — Facebook, Instagram, X, LinkedIn, TikTok, YouTube, Reddit, Bluesky, and more

FREE TIER:
• 3 connected platforms
• 5 posts per day
• 10 AI generations per day
• 7-day analytics history

SUBSCRIPTIONS:
• Basic ($19.99/mo): 10 platforms, 25 posts/day, autopilot
• Pro ($49.99/mo): 25 platforms, 100 posts/day, team of 3, API access
• Elite ($199.99/mo): Unlimited posts, team of 10, priority support

Download now and let AI handle your social media.
```

**Keywords:** social media, AI, automation, scheduler, content generator, Instagram, Twitter, LinkedIn, TikTok, marketing

**Support URL:** https://qempireai.com/support
**Marketing URL:** https://qempireai.com
**Privacy Policy:** https://qempireai.com/privacy

### Step 6: App Review Information

| Field | Value |
|-------|-------|
| Sign-in Required? | Yes (free account) |
| Demo Account | test@qempireai.com / TestPass123! |
| Notes for Reviewer | "This app uses AI to generate social media content. All content is user-reviewed before posting. Free tier available without subscription." |
| Contact Info | support@qempireai.com, (928) 490-0209 |

### Step 7: Submit for Review

1. Select the build in App Store Connect
2. Click "Add for Review"
3. Answer export compliance questions (uses encryption for HTTPS — answer YES)
4. Submit

**Expected Review Time:** 24-48 hours for first submission, 12-24 hours for updates

---

## Google Play Store — Step by Step

### Step 1: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - **App Name**: Q-Empire Social Autopilot
   - **Default Language**: English
   - **App or Game**: App
   - **Free or Paid**: Free (with in-app subscriptions)

### Step 2: Set Up Store Listing

**Short Description (80 chars):**
```
AI writes & schedules social posts for 25 platforms. Try free.
```

**Full Description (4000 chars):**
```
Q-Empire Social Autopilot — Let AI handle your social media.

🤖 AI-POWERED CONTENT
Enter your website URL and our AI (powered by Mistral-7B) analyzes your brand, extracts your voice, and generates platform-optimized posts for Facebook, Instagram, X, LinkedIn, TikTok, YouTube, and 19 more platforms.

📅 AUTOPILOT MODE
Set it and forget it. The AI schedules posts at optimal times based on your audience engagement patterns. Wake up to published content.

📊 ANALYTICS DASHBOARD
Track likes, shares, comments, and engagement across all platforms in one unified view. See what works and double down.

✨ FREE FOREVER TIER
• 3 platforms (pick your favorites)
• 5 posts per day
• 10 AI content generations per day
• 7-day analytics

💎 PREMIUM PLANS
• Basic ($19.99/mo): 10 platforms, autopilot, 25 posts/day
• Pro ($49.99/mo): 25 platforms, team collaboration, API access
• Elite ($199.99/mo): Unlimited everything, 10 team members, priority support

🔒 YOUR DATA IS YOURS
We never post without your approval. All AI-generated content is reviewed in your queue before going live.

Download Q-Empire Social Autopilot today and reclaim hours every week.
```

### Step 3: Upload App Bundle (AAB)

```bash
# Build Android AAB with EAS
eas build --platform android --profile production

# EAS automatically uploads to Play Console if configured
# Or download and upload manually:
# Play Console → Release → Production → Create Release → Upload AAB
```

### Step 4: Content Rating

1. Go to "Content Rating" in Play Console
2. Fill out questionnaire:
   - Category: Social Networking
   - Violence: None
   - Sexual Content: None
   - Language: Mild (AI may generate business language)
   - Controlled Substances: None
   - Gambling: None
   - Result: **PEGI 3 / ESRB E**

### Step 5: Set Pricing & Distribution

| Setting | Value |
|---------|-------|
| Countries | All 175+ countries |
| Price | Free |
| In-app Products | 3 subscriptions (Basic, Pro, Elite) |
| Ads | Yes (banner + interstitial on free tier) |
| Content Guidelines | Compliant |

### Step 6: Set Up In-App Subscriptions

In Play Console → Monetization → Products → Subscriptions:

**Basic Plan:**
- ID: `basic_monthly`
- Price: $19.99 USD
- Billing Period: Monthly
- Free Trial: 7 days

**Pro Plan:**
- ID: `pro_monthly`
- Price: $49.99 USD
- Billing Period: Monthly
- Free Trial: 7 days

**Elite Plan:**
- ID: `elite_monthly`
- Price: $199.99 USD
- Billing Period: Monthly
- Free Trial: 14 days

### Step 7: Submit for Review

1. Go to "Publishing Overview"
2. Click "Send 1 change for review"
3. Review checklist:
   - [ ] Store listing complete
   - [ ] Content rating assigned
   - [ ] Privacy policy linked
   - [ ] App bundle uploaded
   - [ ] In-app products configured
   - [ ] Targeting and distribution set

**Expected Review Time:** 1-3 days for new apps, hours for updates

---

## Post-Launch Checklist

### Week 1
- [ ] Monitor crash reports (Firebase Crashlytics)
- [ ] Respond to all reviews within 24 hours
- [ ] Track conversion rate (download → signup → subscription)
- [ ] A/B test app store screenshots
- [ ] Push first update with any critical fixes

### Month 1
- [ ] Analyze retention curves (Day 1, 7, 30)
- [ ] Optimize onboarding funnel based on analytics
- [ ] Run first promotional campaign
- [ ] Collect and act on user feedback
- [ ] Plan first feature update

### Ongoing
- [ ] Monthly app updates (bug fixes + features)
- [ ] Quarterly screenshot refresh
- [ ] Seasonal promotional graphics
- [ ] Maintain 4.5+ star rating
- [ ] Respond to 100% of reviews

---

## Fastlane Automation (Optional)

```bash
# Install Fastlane
bundle install

# iOS
cd mobile
fastlane ios beta    # Upload to TestFlight
fastlane ios release # Upload to App Store

# Android
fastlane android beta    # Upload to Internal Testing
fastlane android release # Upload to Production
```

See `mobile/fastlane/Fastfile` for full configuration.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails with signing error | Verify certificates in Apple Developer / Play Console |
| App rejected for "minimal functionality" | Ensure AI generation works, add more screens |
| Subscription not working in test | Use sandbox test accounts |
| Screenshot sizes wrong | Use EAS `eas build --auto-submit` with screenshot generation |
| Privacy policy rejected | Ensure it's a real page, not placeholder |

---

*Document version: 1.0 | Last updated: July 2025*
