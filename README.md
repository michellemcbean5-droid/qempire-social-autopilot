## 🔐 Admin Portal (Post-Launch Management)

Q-Empire includes a **built-in admin portal** so you can manage, test, and correct the app after it goes live on Google Play.

### Accessing the Admin Portal:
1. Open the app
2. Go to **Settings** tab
3. Scroll down to **"Admin Portal"**
4. Tap to enter

### Default Admin Credentials:
- **Email:** `admin@qempire.ai`
- **Password:** `QEmpire2024!`

### What You Can Manage:
- ✅ **System Status** — Monitor all API connections (Facebook, Instagram, X, TikTok, etc.)
- ✅ **Content Manager** — Edit, approve, or delete AI-generated posts before they go live
- ✅ **Platform Controls** — Enable/disable platforms, check API health
- ✅ **User Management** — View user accounts, manage subscriptions
- ✅ **Scheduler Control** — Pause/resume autopilot, clear queues
- ✅ **Emergency Controls** — Toggle debug mode, enable maintenance mode, reset APIs
- ✅ **Build Info** — View current version, environment, last deploy date

### Changing the Admin Password:
Edit `mobile/src/screens/AdminLoginScreen.tsx`:
```typescript
const ADMIN_CREDENTIALS = {
  email: 'admin@qempire.ai',
  password: 'YOUR_NEW_PASSWORD',
};
```
Then rebuild and update the app.

---

## 🚀 Deploy to Google Play Store

### Quick Start (Build AAB + Upload):

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build production AAB (Android App Bundle)
cd mobile
eas build --platform android --profile production

# 4. Download the .aab file from the link provided
# 5. Upload to Google Play Console: https://play.google.com/console
```

### Full Deployment Guide:
📖 See [docs/GOOGLE_PLAY_DEPLOYMENT.md](docs/GOOGLE_PLAY_DEPLOYMENT.md) for complete step-by-step instructions.

---

## 🌐 Live Web Preview

Test the app right now in your browser — no download needed!

**👉 [Click here to test Q-Empire](https://raw.githack.com/michellemcbean5-droid/qempire-social-autopilot/main/preview.html)**

Or use this direct link:
```
https://raw.githack.com/michellemcbean5-droid/qempire-social-autopilot/main/preview.html
```

### What You Can Test:
- 🎬 **Animated Splash Screen** with Q-Bot, Mermaid (blonde hair), and Human Son
- 📱 **Onboarding Flow** with 4 animated slides
- 🏠 **Dashboard** with live stats, autopilot status, and platform list
- ✨ **AI Generated Content** preview
- 📊 **Analytics** with performance charts
- ⚙️ **Settings** screen
- 🎨 **Bright colors**: Electric Yellow, Hot Pink, Electric Blue

---

## 🎨 What's New in v1.0.0

### Animated Characters
- **🧜🏾‍♀️ Black Mermaid** with flowing blonde hair
- **👦 Human Son** with golden hair and bright outfit
- **🤖 Q-Bot Agent** with glowing antenna and waving arms

### Vibrant Color Palette
- Electric Yellow `#FFE600`
- Hot Pink `#FF1493`
- Electric Blue `#00D4FF`
- Neon Green `#39FF14`
- Coral `#FF6B6B`

### Animations
- Floating particles on splash screen
- Character swaying, bouncing, and floating
- Staggered card entrance animations
- Pulsing autopilot status
- Glowing badges and buttons
- Animated progress bars

---

# 🚀 Q-Empire Social Media Autopilot

**AI-Powered Social Media Marketing That Runs While You Sleep**

[![CI](https://github.com/michellemcbean5-droid/qempire-social-autopilot/actions/workflows/ci.yml/badge.svg)](https://github.com/michellemcbean5-droid/qempire-social-autopilot/actions/workflows/ci.yml)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hugging Face](https://img.shields.io/badge/Hugging%20Face-Spaces-orange)](https://huggingface.co/spaces/qempire/social-autopilot)

Q-Empire Social Autopilot is a fully autonomous AI-powered social media marketing platform that generates platform-optimized content and publishes to up to **25 different social media platforms** on a recurring schedule — completely on autopilot.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Q-EMPIRE SOCIAL AUTOPILOT                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────────┐    ┌───────────┐ │
│  │  Website     │───▶│  AI Content      │───▶│  Platform │ │
│  │  Analyzer    │    │  Generation      │    │  Router   │ │
│  │  (Scraper)   │    │  Engine (LLM)    │    │  (25 APIs)│ │
│  └──────────────┘    └──────────────────┘    └───────────┘ │
│         │                     │                      │       │
│         ▼                     ▼                      ▼       │
│  ┌──────────────┐    ┌──────────────────┐    ┌───────────┐ │
│  │  Brand       │    │  Content         │    │  Post     │ │
│  │  Profile     │    │  Optimizer       │    │  Queue    │ │
│  │  Database    │    │  (Per-Platform)  │    │  Manager  │ │
│  └──────────────┘    └──────────────────┐    └───────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AUTOPILOT SCHEDULER (CRON)               │   │
│  │  Daily/Weekly/Custom → Generate → Optimize → Post    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ANALYTICS & NOTIFICATIONS                │   │
│  │  Performance Metrics │ Error Alerts │ Success Reports │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

- **AI Content Generation** — Uses Hugging Face transformer models to generate platform-specific social media posts from your website content
- **25-Platform Support** — Posts to Facebook, Instagram, X/Twitter, LinkedIn, TikTok, Pinterest, YouTube, Reddit, Threads, Tumblr, Medium, Mastodon, Discord, Telegram, WhatsApp Business, Snapchat, Bluesky, WordPress, Blogger, Mix, Quora, VK, Weibo, LINE, and KakaoTalk
- **Autopilot Scheduling** — Set it and forget it. Daily, weekly, or custom cron schedules
- **Website Intelligence** — Scrapes and analyzes your website to understand your brand voice, products, and messaging
- **Platform Optimization** — Each post is uniquely tailored for the specific platform (character limits, hashtag strategies, media formats)
- **Analytics Dashboard** — Track reach, engagement, and performance across all platforms
- **Owner Notifications** — Get alerts on successful posts, connection failures, and errors

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend API | FastAPI (Python 3.11+) |
| AI Engine | Hugging Face Transformers + Custom Fine-tuned Model |
| Task Scheduler | APScheduler + Celery |
| Database | SQLite (local) / PostgreSQL (production) |
| Frontend | Gradio (Hugging Face Space) |
| **Mobile App** | **Expo SDK 52 + React Native + TypeScript** |
| Platform APIs | Custom connector library for 25 platforms |
| Deployment | Hugging Face Spaces + GitHub Actions + Docker + EAS |

---

## 📱 Mobile App

A complete cross-platform mobile app built with **Expo SDK 52** and **React Native**.

### Features
- 🤖 **AI Content Generation** — Powered by Mistral-7B via Hugging Face Inference API (free tier)
- 🔍 **Website Analysis** — Enter any URL, AI extracts brand voice and profile
- 📅 **Autopilot Mode** — Auto-schedule posts at optimal times
- 📊 **Analytics Dashboard** — Track performance across all platforms
- 🔗 **25 Platforms** — Connect and manage all major social networks
- 💎 **4 Subscription Tiers** — Free, Basic ($19.99), Pro ($49.99), Elite ($199.99)
- 🎟️ **Promo Codes** — Launch discounts, referral codes, master codes
- 🔔 **Push Notifications** — Post success/failure alerts, autopilot updates
- 🔗 **Deep Links** — `qempire://` URL scheme for seamless sharing

### Mobile Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 52 |
| Runtime | React Native 0.76 |
| Language | TypeScript 5.3+ |
| State | Zustand + AsyncStorage |
| UI | React Native Paper |
| Navigation | React Navigation v6 |
| Charts | React Native Chart Kit |
| AI API | Hugging Face Inference (free) |
| Backend | FastAPI (Python) |

### Mobile Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start development server
npm start        # Metro bundler
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web preview
```

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build iOS (TestFlight)
eas build --platform ios --profile preview

# Build Android (Internal Testing)
eas build --platform android --profile preview

# Build for production stores
eas build --platform ios --profile production
eas build --platform android --profile production
```

### Mobile Project Structure

```
mobile/
├── App.tsx                    # Entry point
├── src/
│   ├── api/
│   │   ├── huggingface.ts     # AI content generation (Mistral-7B)
│   │   └── websiteAnalyzer.ts # Website scraping + brand extraction
│   ├── components/
│   │   ├── ErrorBoundary.tsx  # Global error handling
│   │   ├── SkeletonDashboard.tsx # Loading shimmer
│   │   └── UpgradePrompt.tsx  # Subscription upsell
│   ├── constants/
│   │   ├── theme.ts           # Q-Empire brand colors
│   │   └── config.ts          # API URLs, tiers, platform registry
│   ├── navigation/
│   │   └── index.tsx          # Stack + Tab navigator (18 screens)
│   ├── screens/               # 18 full-featured screens
│   ├── store/                 # 6 Zustand stores with persistence
│   └── utils/
│       ├── deepLinks.ts       # URL scheme handling
│       └── notifications.ts   # Push notification setup
```

See [docs/mobile-architecture.md](docs/mobile-architecture.md) for full technical details.

---

## 📦 Installation

### Prerequisites

- Python 3.11+
- Docker (optional, for containerized deployment)
- Redis (for background Celery workers)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/michellemcbean5-droid/qempire-social-autopilot.git
cd qempire-social-autopilot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys and platform credentials

# Run the application
python -m app.main
```

The API will be available at [http://localhost:8000](http://localhost:8000)

- API Docs (Swagger UI): [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- ReDoc: [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)

### Docker (Recommended for Production)

```bash
# Build and run all services
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

Services started:
- **FastAPI app** on port 8000
- **Redis** on port 6379 (task queue)
- **Celery worker** for background tasks

### Hugging Face Space (Standalone UI)

The `huggingface_space/` directory can be deployed directly as a Hugging Face Space for client demos. See [docs/deployment.md](docs/deployment.md) for details.

---

## 🔧 Configuration

### Environment Variables

```env
# AI Model Configuration
HUGGINGFACE_API_TOKEN=your_hf_token
MODEL_ID=qempire/social-autopilot-ai

# Platform API Keys (add credentials for each platform)
FACEBOOK_ACCESS_TOKEN=
INSTAGRAM_ACCESS_TOKEN=
TWITTER_API_KEY=
TWITTER_API_SECRET=
LINKEDIN_ACCESS_TOKEN=
TIKTOK_ACCESS_TOKEN=
PINTEREST_ACCESS_TOKEN=
YOUTUBE_API_KEY=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
# ... (see .env.example for all 25 platforms)

# Scheduling
AUTOPILOT_ENABLED=true
POSTING_SCHEDULE=daily
POSTING_TIME_UTC=09:00

# Notifications
NOTIFICATION_EMAIL=your@email.com
NOTIFICATION_WEBHOOK_URL=
```

Get your Hugging Face token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

## 🚀 Quick Start

1. **Enter your website URL** — The AI analyzes your site to understand your brand
2. **Connect your platforms** — Add credentials for up to 25 social media accounts
3. **Enable Autopilot** — Toggle on and set your preferred schedule
4. **Sleep** — The AI generates and posts content automatically

### API Quick Start

```bash
# 1. Analyze website
curl -X POST http://localhost:8000/api/onboarding/analyze-website \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourwebsite.com"}'

# 2. Connect platforms
curl -X POST http://localhost:8000/api/onboarding/connect-platforms \
  -H "Content-Type: application/json" \
  -d '{
    "platforms": [
      {"platform": "twitter", "credentials": {"api_key": "xxx"}},
      {"platform": "facebook", "credentials": {"access_token": "xxx"}}
    ]
  }'

# 3. Enable autopilot
curl -X POST http://localhost:8000/api/autopilot/configure \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "frequency": "daily",
    "time_utc": "09:00"
  }'
```

---

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ -v --cov=app --cov=platforms --cov=models --cov-report=term

# Run specific test file
pytest tests/test_ai_engine.py -v

# Run with async support
pytest tests/ -v --asyncio-mode=auto
```

Coverage target: **≥ 80%**

---

## 📁 Project Structure

```
qempire-social-autopilot/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py        # API endpoints
│   │   ├── auth.py          # Authentication
│   │   └── websocket.py     # Real-time updates
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # App configuration
│   │   ├── database.py      # Database models & connection
│   │   └── scheduler.py     # Autopilot cron scheduler
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_engine.py     # AI content generation
│   │   ├── website_analyzer.py  # Website scraping & analysis
│   │   ├── content_optimizer.py # Platform-specific optimization
│   │   ├── post_manager.py  # Post queue management
│   │   └── notifications.py # Owner notification system
│   └── ui/
│       ├── __init__.py
│       └── gradio_app.py    # Gradio frontend interface
├── models/
│   ├── __init__.py
│   ├── social_content_model.py  # Custom HF model wrapper
│   └── model_card.md        # Hugging Face model card
├── platforms/
│   ├── __init__.py
│   ├── base.py              # Base platform connector
│   ├── facebook.py
│   ├── instagram.py
│   ├── twitter.py
│   ├── linkedin.py
│   ├── tiktok.py
│   ├── pinterest.py
│   ├── youtube.py
│   ├── reddit.py
│   ├── threads.py
│   ├── tumblr.py
│   ├── medium.py
│   ├── mastodon.py
│   ├── discord.py
│   ├── telegram.py
│   ├── whatsapp.py
│   ├── snapchat.py
│   ├── bluesky.py
│   ├── wordpress.py
│   ├── blogger.py
│   ├── mix.py
│   ├── quora.py
│   ├── vk.py
│   ├── weibo.py
│   ├── line.py
│   └── kakao.py
├── config/
│   ├── platforms.yaml       # Platform configurations
│   └── schedules.yaml       # Schedule templates
├── huggingface_space/
│   ├── app.py               # Gradio Space app
│   ├── requirements.txt     # Space dependencies
│   └── README.md            # Space README
├── docs/
│   ├── getting-started.md   # Installation & setup guide
│   ├── architecture.md      # System architecture overview
│   ├── deployment.md        # Deployment guides
│   ├── mobile-architecture.md  # Mobile app technical docs
│   ├── api-reference.md     # API contracts & data models
│   ├── competitor-analysis.md  # Competitive intelligence
│   ├── user-simulation.md   # 5 persona user journeys
│   ├── store-deployment.md  # App Store / Play Store submission
│   └── monetization.md      # Subscription tiers & revenue model
├── mobile/
│   ├── App.tsx              # Mobile app entry point
│   ├── package.json         # Expo dependencies
│   ├── src/
│   │   ├── api/             # HuggingFace + website analyzer
│   │   ├── components/      # Reusable UI components
│   │   ├── constants/       # Theme, config, platform registry
│   │   ├── navigation/      # Stack + tab navigator
│   │   ├── screens/         # 18 feature screens
│   │   ├── store/           # 6 Zustand stores
│   │   └── utils/           # Deep links, notifications
│   └── __tests__/           # Jest + RNTL test suite
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_ai_engine.py    # AI engine tests
│   ├── test_platforms.py    # Platform connector tests
│   └── test_scheduler.py    # Scheduler tests
├── .github/
│   ├── workflows/
│   │   ├── ci.yml           # Python backend CI
│   │   └── mobile-build.yml # Mobile EAS build CI/CD
│   ├── ISSUE_TEMPLATE/
│   │   └── bug_report.md
│   └── PULL_REQUEST_TEMPLATE.md
├── fastlane/
│   ├── Fastfile             # iOS/Android deployment automation
│   └── Appfile              # App identifiers
├── .env.example             # Environment variables template
├── .gitignore
├── AGENTS.md                # Agent/AI assistant context
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
├── Dockerfile
├── docker-compose.yml
├── env_example.txt          # Legacy env template (kept for compatibility)
├── requirements.txt         # Production dependencies
├── requirements-dev.txt     # Development dependencies
├── setup.py
└── README.md                # This file
```

---

## 🤖 Hugging Face Model

The AI content generation engine is available as a Hugging Face model:

**Model:** `qempire/social-autopilot-ai`

The model is fine-tuned for social media content generation with platform-specific optimization. It understands:
- Platform character limits and formatting rules
- Hashtag strategies per platform
- Engagement optimization techniques
- Brand voice consistency
- Content variation generation

**Primary inference model:** `mistralai/Mistral-7B-Instruct-v0.3`  
**Fallback:** `HuggingFaceH4/zephyr-7b-beta`

---

## 📊 Supported Platforms (25)

| # | Platform | Post Types | Status |
|---|----------|-----------|--------|
| 1 | Facebook | Text, Image, Video, Link | ✅ |
| 2 | Instagram | Image, Carousel, Reels, Stories | ✅ |
| 3 | X/Twitter | Text, Image, Thread | ✅ |
| 4 | LinkedIn | Text, Article, Image | ✅ |
| 5 | TikTok | Video, Text | ✅ |
| 6 | Pinterest | Pin, Image | ✅ |
| 7 | YouTube | Video, Shorts, Community | ✅ |
| 8 | Reddit | Text, Link, Image | ✅ |
| 9 | Threads | Text, Image | ✅ |
| 10 | Tumblr | Text, Image, Quote | ✅ |
| 11 | Medium | Article, Story | ✅ |
| 12 | Mastodon | Toot, Image | ✅ |
| 13 | Discord | Message, Embed | ✅ |
| 14 | Telegram | Message, Image, Channel | ✅ |
| 15 | WhatsApp Business | Message, Status | ✅ |
| 16 | Snapchat | Story, Snap | ✅ |
| 17 | Bluesky | Post, Image | ✅ |
| 18 | WordPress | Blog Post, Page | ✅ |
| 19 | Blogger | Blog Post | ✅ |
| 20 | Mix | Share, Collection | ✅ |
| 21 | Quora | Answer, Post | ✅ |
| 22 | VK | Post, Image | ✅ |
| 23 | Weibo | Post, Image | ✅ |
| 24 | LINE | Message, Timeline | ✅ |
| 25 | KakaoTalk | Message, Story | ✅ |

---

## 🔐 Security

- All credentials are encrypted at rest using Fernet symmetric encryption
- API keys are never stored in plain text
- OAuth2 flows used where available
- Rate limiting per platform to avoid bans
- `.env` and credential files are never committed to git

---

## 🤖 Automation & CI/CD

This repository is fully automated:

- **GitHub Actions CI** (`.github/workflows/ci.yml`):
  - Python tests on 3.11 and 3.12
  - Ruff linting and formatting checks
  - MyPy type checking
  - Docker build validation
  - Security vulnerability scanning (Trivy)
  - HuggingFace Space syntax validation
- **Mobile CI/CD** (`.github/workflows/mobile-build.yml`):
  - TypeScript compilation checks
  - Jest unit tests with coverage
  - EAS build for iOS and Android
  - Automated store submission on `[deploy]` commits
- **Code Coverage** reporting via Codecov
- **Issue Templates** for bug reports
- **Pull Request Templates** with testing checklist
- **Fastlane** automation for iOS TestFlight and Google Play Internal Testing

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [docs/getting-started.md](docs/getting-started.md) | Installation, setup, and quick start |
| [docs/architecture.md](docs/architecture.md) | System architecture and data flow |
| [docs/deployment.md](docs/deployment.md) | Deployment guides for Docker, HF Space, cloud |
| [docs/mobile-architecture.md](docs/mobile-architecture.md) | Mobile app architecture and technical details |
| [docs/api-reference.md](docs/api-reference.md) | API contracts, data models, and SDK starter |
| [docs/competitor-analysis.md](docs/competitor-analysis.md) | Competitive intelligence on 5 key competitors |
| [docs/user-simulation.md](docs/user-simulation.md) | 5 persona user journeys with pain points and fixes |
| [docs/store-deployment.md](docs/store-deployment.md) | Step-by-step App Store and Google Play submission |
| [docs/monetization.md](docs/monetization.md) | Subscription tiers, promo codes, and revenue projections |
| [AGENTS.md](AGENTS.md) | Agent/AI assistant context for this project |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to the project |

---

## 📄 License

MIT License — Built by Q-Empire AI Automation Division

---

## 🌐 Links

- **GitHub:** [github.com/michellemcbean5-droid/qempire-social-autopilot](https://github.com/michellemcbean5-droid/qempire-social-autopilot)
- **Hugging Face Space:** [huggingface.co/spaces/qempire/social-autopilot](https://huggingface.co/spaces/qempire/social-autopilot)
- **Q-Empire Website:** [qempireai.com](https://qempireai.com)
- **Support:** support@qempireai.com | (928) 490-0209

---

*Built by Q-Empire AI Automation Division | Exclusively for Q-Empire Automation Clients*
