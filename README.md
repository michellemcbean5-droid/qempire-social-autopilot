# 🚀 Q-Empire Social Media Autopilot

**AI-Powered Social Media Marketing That Runs While You Sleep**

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
│  └──────────────┘    └──────────────────┘    └───────────┘ │
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
| Platform APIs | Custom connector library for 25 platforms |
| Deployment | Hugging Face Spaces + GitHub Actions |

---

## 📦 Installation

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

# Configure environment
cp .env.example .env
# Edit .env with your API keys and platform credentials

# Run the application
python -m app.main
```

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

---

## 🚀 Quick Start

1. **Enter your website URL** — The AI analyzes your site to understand your brand
2. **Connect your platforms** — Add credentials for up to 25 social media accounts
3. **Enable Autopilot** — Toggle on and set your preferred schedule
4. **Sleep** — The AI generates and posts content automatically

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
├── tests/
│   ├── test_ai_engine.py
│   ├── test_platforms.py
│   └── test_scheduler.py
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── setup.py
└── README.md
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

---

## 📄 License

MIT License — Built by Q-Empire AI Automation Division

---

## 🌐 Links

- **GitHub:** [github.com/michellemcbean5-droid/qempire-social-autopilot](https://github.com/michellemcbean5-droid/qempire-social-autopilot)
- **Hugging Face Space:** [huggingface.co/spaces/qempire/social-autopilot](https://huggingface.co/spaces/qempire/social-autopilot)
- **Q-Empire Website:** [qempireai.com](https://qempireai.com)
