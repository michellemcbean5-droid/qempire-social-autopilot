# 📱 Testing Q-Empire on Your Phone

## Before You Start

Make sure you have:
- ✅ A computer (Windows, Mac, or Linux)
- ✅ Your phone (Android or iPhone)
- ✅ Both on the **same WiFi network**
- ✅ Node.js installed (see Step 1 below)

---

## 🚀 METHOD 1: Expo Go (Fastest - 5 Minutes)

This is the **quickest way** to test. No build required. Just scan a QR code.

### Step 1: Install Node.js on Your Computer

**If you DON'T have Node.js:**

1. Go to https://nodejs.org
2. Download **LTS version** (the big green button)
3. Install it (click Next, Next, Next...)
4. Open **Command Prompt** (Windows) or **Terminal** (Mac)
5. Type: `node -v`
6. You should see a version number like `v20.x.x`

### Step 2: Install Expo Go on Your Phone

**Android:**
1. Open Google Play Store
2. Search **"Expo Go"**
3. Install it (by Expo — the orange icon)

**iPhone:**
1. Open App Store
2. Search **"Expo Go"**
3. Install it (by Expo — the orange icon)

### Step 3: Open Your Project on Computer

1. Open **Command Prompt** (Windows) or **Terminal** (Mac)
2. Navigate to your project folder:
   ```bash
   cd qempire-social-autopilot/mobile
   ```
   *(Type `cd ` then drag the mobile folder into the terminal window)*

3. Install dependencies:
   ```bash
   npm install
   ```
   *(Wait 2-3 minutes for this to finish)*

4. Start the app:
   ```bash
   npx expo start
   ```

5. A QR code will appear in your terminal. **DON'T CLOSE THIS WINDOW.**

### Step 4: Scan QR Code with Your Phone

1. Open the **Expo Go** app on your phone
2. Tap **"Scan QR Code"**
3. Point your camera at the QR code on your computer screen
4. The app will load on your phone!

### Step 5: Test Everything

Try these flows:
- ✅ Splash screen with animated characters (Mermaid, Son, Q-Bot)
- ✅ Swipe through onboarding slides
- ✅ Dashboard with stats and platform list
- ✅ Content tab with AI-generated posts
- ✅ Analytics with growth bars
- ✅ Settings screen

### 🔄 Live Reload

Every time you save a file on your computer, the app **automatically updates** on your phone! No need to rescan.

### ❌ To Stop

Press `Ctrl + C` in the terminal window to stop the server.

---

## 📦 METHOD 2: Build APK for Android (15-20 Minutes)

This creates a **real APK file** you can install directly on any Android phone. More realistic than Expo Go.

### Prerequisites

1. Complete Method 1 Steps 1-3 first (install Node.js, run `npm install`)
2. Create an **Expo account**:
   - Go to https://expo.dev
   - Click "Sign Up" (free)
   - Remember your username and password

### Step 1: Login to Expo

In your terminal:
```bash
npx eas login
```
Type your Expo username and password when prompted.

### Step 2: Configure EAS Project

In your terminal:
```bash
cd mobile
npx eas build:configure
```
- Select **"Android"**
- This creates your EAS project automatically

### Step 3: Build the APK

```bash
npx eas build --platform android --profile preview
```

This will:
- Build your app in the cloud (Expo's servers)
- Take about **15-20 minutes**
- Give you a download link when done

### Step 4: Download & Install

1. When the build finishes, you'll get a URL like:
   ```
   https://expo.dev/artifacts/xxxxxxxx
   ```
2. Open that link on your **computer browser**
3. Download the `.apk` file
4. Send it to your phone (email, Google Drive, USB cable, or AirDrop)
5. On your Android phone, tap the APK file to install
6. If it says "Install from unknown sources" — tap **Settings** and allow it

### ✅ Done!

You now have a real app icon on your phone. Tap it to open Q-Empire!

---

## 🍎 METHOD 3: Test on iPhone (Expo Go or TestFlight)

### Option A: Expo Go (Same as Method 1)

Follow Method 1 exactly. The Expo Go app works the same on iPhone.

### Option B: TestFlight (Real App Experience)

For a real iOS build, you need:
- An **Apple Developer Account** ($99/year)
- This is ONLY needed for the App Store version

For now, use **Expo Go** (Method 1) to test everything.

---

## 🐛 Common Issues & Fixes

### "Command not found: npm"
**Fix:** Node.js isn't installed. Go back to Method 1 Step 1.

### "Cannot find module '@expo/vector-icons'"
**Fix:** Run this in terminal:
```bash
cd mobile
npm install
```

### QR Code won't scan
**Fix:** Make sure your phone and computer are on the **same WiFi network**.

### App crashes on splash screen
**Fix:** The animated characters use SVG. Make sure you ran `npm install`.

### "Network response timed out"
**Fix:** Your firewall might be blocking. Try:
```bash
npx expo start --tunnel
```
This uses a different connection method.

### Build fails with "assets not found"
**Fix:** You need to add app icons. For testing, create these files in `mobile/assets/`:
- `icon.png` (1024x1024)
- `splash.png` (1242x2436)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

Or use placeholder images from https://placeholder.com

---

## ✅ Pre-Launch Checklist (Before Google Play)

Before submitting to Google Play, verify:

- [ ] App opens without crashes
- [ ] Splash screen animations work
- [ ] All 4 onboarding slides show
- [ ] Dashboard loads with stats
- [ ] All 5 tabs work (Dashboard, Platforms, Content, Analytics, Settings)
- [ ] No console errors (check terminal while testing)
- [ ] App works on both WiFi and mobile data
- [ ] Tested on at least 2 different screen sizes

---

## 🚀 Next Step: Google Play Store

Once testing looks good:

1. Add your **real app icons** to `mobile/assets/`
2. Update `mobile/app.json` with your real info
3. Run:
   ```bash
   npx eas build --platform android --profile production
   ```
4. Download the AAB file (Android App Bundle)
5. Go to https://play.google.com/console
6. Create a new app, upload your AAB
7. Fill in store listing, screenshots, description
8. Submit for review!

---

## 📞 Need Help?

- **Expo Docs:** https://docs.expo.dev
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **GitHub Repo:** https://github.com/michellemcbean5-droid/qempire-social-autopilot

**Happy Testing! 🎉**
