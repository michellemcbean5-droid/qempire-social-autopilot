# CLAUDE.md — Q-Empire Social Autopilot AI Context

> This file is written for Claude AI (and any other AI assistant) to fully understand
> the Q-Empire Social Autopilot project, its architecture, purpose, latest updates,
> and how to contribute or extend it.

---

## Project Identity

**Name:** Q-Empire Social Autopilot
**Owner:** Q-Empire AI Automation Division
**Client Base:** Q-Empire Automation clients (business owners seeking AI-powered marketing)
**Website:** https://qempireai.com
**Contact:** support@qempireai.com | (928) 490-0209
**Address:** 1642 McCulloch Blvd N #466, Lake Havasu City, AZ 86403

---

## What This Project Does

Q-Empire Social Autopilot is a **fully autonomous AI-powered social media marketing platform** that:

1. Accepts a client's website URL as input
2. Uses AI to analyze the website and extract brand voice, keywords, tone, and products
3. Generates **unique, platform-optimized** social media posts for up to **25 platforms**
4. Posts content automatically on a recurring schedule (daily, weekly, or custom cron)
5. Sends the owner notifications on success, failure, or platform connection issues
6. Tracks analytics and engagement per platform

The system is designed to **run completely on autopilot** — once configured, no human intervention is required.

---

## Repository Structure

```
qempire-social-autopilot/
├── CLAUDE.md                    ← You are reading this file
├── AI_CONTEXT.md                ← Detailed technical context for AI assistants
├── README.md                    ← User-facing documentation
├── requirements.txt             ← Python dependencies
├── setup.py                     ← Package setup
├── Dockerfile                   ← Container deployment
├── docker-compose.yml           ← Full stack (app + Redis)
├── env_example.txt              ← Environment variable template
│
├── app/                         ← Main FastAPI application
│   ├── main.py                  ← Entry point, all API routes
│   ├── core/
│   │   ├── config.py            ← Settings + PLATFORM_REGISTRY (25 platforms)
│   │   ├── database.py          ← SQLAlchemy models
│   │   └── scheduler.py        ← APScheduler autopilot engine
│   └── services/
│       ├── ai_engine.py         ← HF Inference API content generation
│       ├── website_analyzer.py  ← Brand extraction from URLs
│       ├── content_optimizer.py ← Platform-specific optimization
│       ├── post_manager.py      ← Queue, dispatch, lifecycle
│       └── notifications.py    ← Owner alert system
│
├── platforms/                   ← 25 platform connectors
│   ├── base.py                  ← Abstract base class
│   ├── facebook.py              ← Facebook Graph API
│   ├── instagram.py             ← Instagram Graph API
│   ├── twitter.py               ← X/Twitter API v2
│   ├── linkedin.py              ← LinkedIn UGC API
│   └── all_platforms.py        ← TikTok, Pinterest, YouTube, Reddit,
│                                   Threads, Tumblr, Medium, Mastodon,
│                                   Discord, Telegram, WhatsApp, Snapchat,
│                                   Bluesky, WordPress, Blogger, Mix,
│                                   Quora, VK, Weibo, LINE, KakaoTalk
│
├── models/
│   ├── social_content_model.py  ← HF model wrapper
│   └── model_card.md            ← HF model card
│
├── config/
│   ├── platforms.yaml           ← Platform API configs
│   └── schedules.yaml           ← Schedule templates
│
├── huggingface_space/           ← Gradio app for HF Spaces
│   ├── app.py                   ← Full client-facing UI
│   └── requirements.txt
│
└── tests/
    └── test_ai_engine.py        ← AI engine test suite
```

---

## AI Model Integration

### Primary Model
- **Model ID:** `mistralai/Mistral-7B-Instruct-v0.3`
- **Provider:** Hugging Face Inference API
- **Access:** Via `huggingface_hub.InferenceClient`

### Fallback Model
- **Model ID:** `HuggingFaceH4/zephyr-7b-beta`
- **Used when:** Primary model is unavailable or rate-limited

### Q-Empire HF Accounts
- **Space:** `Qempireautomation/qempire-social-autopilot`
  - URL: https://huggingface.co/spaces/Qempireautomation/qempire-social-autopilot
- **Model Card:** `Qempireautomation/social-autopilot-ai`
  - URL: https://huggingface.co/Qempireautomation/social-autopilot-ai

### How Content Generation Works

```python
# In app/services/ai_engine.py
QEMPIRE_HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
QEMPIRE_FALLBACK_MODEL = "HuggingFaceH4/zephyr-7b-beta"

client = InferenceClient(token=HF_TOKEN)

response = client.text_generation(
    prompt,                          # Platform-specific prompt
    model=QEMPIRE_HF_MODEL,
    max_new_tokens=1024,
    temperature=0.7,
    top_p=0.9,
    do_sample=True,
    repetition_penalty=1.1,
)
```

Each platform gets a **unique prompt** that includes:
- Brand name, description, tone, keywords
- Platform-specific rules (character limits, hashtag limits, content style)
- Content theme (if provided)
- Engagement optimization instructions

---

## API Endpoints

All endpoints are in `app/main.py`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check + status |
| POST | `/api/onboarding/analyze-website` | Analyze website for brand profile |
| POST | `/api/onboarding/connect-platforms` | Connect platform credentials |
| GET | `/api/platforms/supported` | List all 25 platforms |
| POST | `/api/content/generate` | Generate AI content for platforms |
| POST | `/api/content/publish/{batch_id}` | Publish a content batch |
| PUT | `/api/content/edit` | Edit post before publishing |
| GET | `/api/dashboard` | Full dashboard data |
| POST | `/api/autopilot/configure` | Enable/disable autopilot |
| GET | `/api/autopilot/status` | Autopilot status + next run |
| POST | `/api/autopilot/trigger-now` | Manual autopilot trigger |
| GET | `/api/analytics` | Performance analytics |
| GET | `/api/notifications` | Owner notifications |
| POST | `/api/notifications/{id}/read` | Mark notification read |

---

## 25 Supported Platforms

| # | Platform | Max Chars | Hashtags | Connector File |
|---|----------|-----------|----------|----------------|
| 1 | Facebook | 63,206 | 30 | `platforms/facebook.py` |
| 2 | Instagram | 2,200 | 30 | `platforms/instagram.py` |
| 3 | X/Twitter | 280 | 5 | `platforms/twitter.py` |
| 4 | LinkedIn | 3,000 | 5 | `platforms/linkedin.py` |
| 5 | TikTok | 2,200 | 10 | `platforms/all_platforms.py` |
| 6 | Pinterest | 500 | 20 | `platforms/all_platforms.py` |
| 7 | YouTube | 5,000 | 15 | `platforms/all_platforms.py` |
| 8 | Reddit | 40,000 | 0 | `platforms/all_platforms.py` |
| 9 | Threads | 500 | 10 | `platforms/all_platforms.py` |
| 10 | Tumblr | 4,096 | 30 | `platforms/all_platforms.py` |
| 11 | Medium | 100,000 | 5 | `platforms/all_platforms.py` |
| 12 | Mastodon | 500 | 10 | `platforms/all_platforms.py` |
| 13 | Discord | 2,000 | 0 | `platforms/all_platforms.py` |
| 14 | Telegram | 4,096 | 10 | `platforms/all_platforms.py` |
| 15 | WhatsApp Business | 4,096 | 0 | `platforms/all_platforms.py` |
| 16 | Snapchat | 250 | 0 | `platforms/all_platforms.py` |
| 17 | Bluesky | 300 | 5 | `platforms/all_platforms.py` |
| 18 | WordPress | 100,000 | 15 | `platforms/all_platforms.py` |
| 19 | Blogger | 100,000 | 10 | `platforms/all_platforms.py` |
| 20 | Mix | 500 | 10 | `platforms/all_platforms.py` |
| 21 | Quora | 10,000 | 5 | `platforms/all_platforms.py` |
| 22 | VK | 15,895 | 10 | `platforms/all_platforms.py` |
| 23 | Weibo | 2,000 | 5 | `platforms/all_platforms.py` |
| 24 | LINE | 5,000 | 0 | `platforms/all_platforms.py` |
| 25 | KakaoTalk | 2,000 | 0 | `platforms/all_platforms.py` |

---

## Brand Identity (Apply to All UI/Content)

```
Deep Obsidian:    #0A0A1A  (primary background)
Royal Blue:       #4169E1  (primary brand color, buttons, headings)
Electric Purple:  #BF00FF  (secondary brand, gradients)
Neon Aqua:        #00FFFF  (interactive elements, highlights)
Warm Gold:        #D4AF37  (premium accents, crowns, borders)
Midnight Navy:    #0D0D2B  (card backgrounds)
Soft White:       #F0F0FF  (body text on dark backgrounds)

Gradient — Ocean Royale: linear-gradient(135deg, #4169E1, #BF00FF)
Gradient — Neon Tide:    linear-gradient(90deg, #00FFFF, #4169E1)
```

---

## Autopilot Scheduler

The scheduler lives in `app/core/scheduler.py` using **APScheduler**:

```python
# Enable autopilot via API
POST /api/autopilot/configure
{
    "enabled": true,
    "frequency": "daily",    # hourly | daily | twice_daily | weekly | custom
    "time_utc": "09:00",
    "platforms": ["facebook", "instagram", "twitter", "linkedin"]
}
```

On each trigger, the scheduler calls `post_manager.run_autopilot_cycle()` which:
1. Generates fresh AI content for all connected platforms
2. Optimizes each post for its platform
3. Dispatches to all platform connectors
4. Sends owner notifications on results

**Important:** In production, use the Heartbeat/cron system (not in-process timers) for Cloud Run compatibility.

---

## Notification System

`app/services/notifications.py` sends alerts for:
- `notify_post_success(platform, content_preview)` — Post published
- `notify_post_failure(platform, error)` — Post failed
- `notify_connection_failure(platform, error)` — Platform disconnected
- `notify_autopilot_complete(total, successful, failed)` — Cycle summary
- `notify_system_error(error, context)` — Critical system error

Supports webhook and email channels (configure in `.env`).

---

## Commit History

```
711c2dd  feat: Wire Hugging Face model references (Mistral-7B + Zephyr fallback)
a10e932  Update: Integrate real Hugging Face model inference and rebrand for clients
424c1ea  Remove CI workflow (add manually via GitHub UI)
ceb49b7  Initial commit: Full application with 25 platform support
```

---

## How to Run Locally

```bash
git clone https://github.com/michellemcbean5-droid/qempire-social-autopilot.git
cd qempire-social-autopilot
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp env_example.txt .env
# Edit .env: add HUGGINGFACE_API_TOKEN and platform credentials
python -m app.main
# API docs: http://localhost:8000/api/docs
```

---

## How to Extend This Project (for Claude)

### Adding a New Platform
1. Create `platforms/newplatform.py` inheriting from `BasePlatformConnector`
2. Implement `connect()`, `publish()`, and `get_analytics()` methods
3. Add platform config to `PLATFORM_REGISTRY` in `app/core/config.py`
4. Register in `platforms/__init__.py`

### Changing the AI Model
In `app/services/ai_engine.py`, update:
```python
QEMPIRE_HF_MODEL = "your-new-model-id"
```

### Adding a New API Endpoint
In `app/main.py`, add a new FastAPI route following the existing pattern.

### Updating the Gradio Space
Edit `huggingface_space/app.py` and re-upload to:
`hf://spaces/Qempireautomation/qempire-social-autopilot/app.py`

---

## Security Notes

- All platform credentials should be stored encrypted in production
- The `env_example.txt` shows all required environment variables
- Never commit `.env` files (already in `.gitignore`)
- Use `cryptography.fernet` for credential encryption (see `app/core/config.py`)

---

## Links

| Resource | URL |
|----------|-----|
| GitHub Repo | https://github.com/michellemcbean5-droid/qempire-social-autopilot |
| HF Space (Live App) | https://huggingface.co/spaces/Qempireautomation/qempire-social-autopilot |
| HF Model Card | https://huggingface.co/Qempireautomation/social-autopilot-ai |
| Q-Empire Website | https://qempireai.com |
| API Docs (local) | http://localhost:8000/api/docs |

---

*Last updated: July 8, 2026*
*Maintained by: Q-Empire AI Automation Division*
*For Claude and all AI assistants: This file is your primary context. Read it before making any changes to this codebase.*
