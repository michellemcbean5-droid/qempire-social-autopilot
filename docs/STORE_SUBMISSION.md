# App Store & Play Store Submission Guide

## Q-Empire Social Autopilot v1.0.0

---

### 📱 iOS App Store

**Bundle ID:** `com.qempire.socialautopilot`

**Required Assets:**
- [ ] App Icon (1024×1024px, PNG)
- [ ] Screenshot Set:
  - iPhone 6.7" (1290×2796) — 3 screenshots
  - iPhone 6.5" (1284×2778) — 3 screenshots  
  - iPad Pro 12.9" (2048×2732) — 3 screenshots
- [ ] App Preview Video (15-30 sec, optional)

**App Store Info:**
- **Name:** Q-Empire Social Autopilot
- **Subtitle:** AI Posts to 25 Social Platforms
- **Category:** Business / Social Networking
- **Keywords:** social media, automation, AI marketing, scheduler, autopilot, content

**Privacy Policy URL:** https://qempireai.com/privacy
**Support URL:** https://qempireai.com/support

**Age Rating:** 4+

---

### 🤖 Google Play Store

**Package:** `com.qempire.socialautopilot`

**Required Assets:**
- [ ] Feature Graphic (1024×500px)
- [ ] App Icon (512×512px)
- [ ] Screenshot Set:
  - Phone (16:9) — 2-8 screenshots
  - 7-inch tablet — 2-8 screenshots
  - 10-inch tablet — 2-8 screenshots
- [ ] Promo Video (YouTube URL, optional)

**Store Listing:**
- **Title:** Q-Empire Social Autopilot
- **Short Description:** AI-powered social media autopilot for 25 platforms
- **Full Description:** 
  ```
  Q-Empire Social Autopilot is the ultimate AI-powered social media 
  marketing platform that posts to 25 platforms while you sleep.

  🤖 AI Content Generation — Creates unique posts for each platform
  🔗 25 Platforms — Facebook, Instagram, X, LinkedIn, TikTok, and more
  📅 Autopilot Mode — Set schedule and forget
  📊 Analytics Dashboard — Track performance across all platforms
  💎 Flexible Plans — Free, Basic, Pro, and Elite tiers

  Perfect for entrepreneurs, agencies, and businesses who want to 
  maximize their social presence without the manual work.
  ```

**Content Rating:** Everyone

---

### 🚀 Submission Checklist

- [ ] Test on physical devices (iOS + Android)
- [ ] Verify all API keys use production endpoints
- [ ] Remove test/demo accounts from code
- [ ] Verify deep links work: `qempire://`
- [ ] Test push notifications on device
- [ ] Verify in-app purchases are configured in stores
- [ ] Run EAS build successfully
- [ ] Pass automated store review (no crashes, no prohibited content)
- [ ] Add App Store / Play Store screenshots to `fastlane/screenshots/`

---

### 🔄 Fastlane Deployment

```bash
# iOS
cd mobile
fastlane ios beta    # TestFlight
fastlane ios release # App Store

# Android
fastlane android beta    # Internal Testing
fastlane android release # Production
```
