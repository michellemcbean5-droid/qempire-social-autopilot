# AI_CONTEXT.md — Technical Context for Claude & AI Assistants

> This file provides deep technical context for Claude (Anthropic), GPT, Gemini,
> or any AI assistant working on this codebase. It documents data flows,
> design decisions, known limitations, and the update changelog.

---

## Project Summary for AI Assistants

You are working on **Q-Empire Social Autopilot** — an AI-powered social media marketing
automation platform built for Q-Empire Automation's clients. The system:

- Takes a website URL → scrapes/analyzes brand info → generates unique AI content
- Posts to 25 social media platforms on a fully automated schedule
- Uses Hugging Face Inference API (Mistral-7B) as the AI backbone
- Is deployed on GitHub (backend) and Hugging Face Spaces (client-facing UI)

**Always maintain Q-Empire brand colors and tone when modifying UI or content.**

---

## Data Flow Architecture

```
CLIENT INPUT
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/onboarding/analyze-website                        │
│  Input: { url: "https://clientsite.com" }                   │
│  → WebsiteAnalyzer.analyze_website(url)                     │
│  → Returns: brand_profile dict                              │
│    { brand_name, description, keywords, tone,               │
│      products_services, content_themes, social_links }      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/content/generate                                  │
│  Input: { platforms: [...], content_theme: "..." }          │
│  → PostManager.generate_and_queue_posts(...)                │
│    → QEmpireAIEngine.generate_content_for_all_platforms()  │
│      → For each platform:                                   │
│        1. _build_generation_prompt(brand, platform, config) │
│        2. _invoke_model(prompt) → HF Inference API          │
│        3. _optimize_for_platform(content, platform)         │
│        4. _generate_hashtags(brand, platform, limit)        │
│        5. _generate_image_description(brand, platform)      │
│    → ContentOptimizer.optimize(content, platform, ...)      │
│  → Returns: { batch_id, posts: [...] }                      │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  POST /api/content/publish/{batch_id}                        │
│  → PostManager.publish_batch(batch_id)                      │
│    → For each post in batch:                                │
│      → _dispatch_to_platform(post)                          │
│        → PlatformConnector.publish(content, media, tags)    │
│      → On success: NotificationService.notify_post_success  │
│      → On failure: NotificationService.notify_post_failure  │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTOPILOT (Scheduled)                                       │
│  POST /api/autopilot/configure { enabled: true, ... }       │
│  → AutopilotScheduler.add_autopilot_job(user_id, ...)       │
│  → On trigger: PostManager.run_autopilot_cycle(...)         │
│    → generate_and_queue_posts → publish_batch               │
│    → NotificationService.notify_autopilot_complete(...)     │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Classes and Their Responsibilities

### `QEmpireAIEngine` (`app/services/ai_engine.py`)
The core AI content generation engine.

**Key methods:**
- `generate_content_for_all_platforms(brand_profile, platforms, theme)` — Main entry point
- `_generate_for_platform(brand_profile, platform, theme)` — Single platform generation
- `_build_generation_prompt(brand, platform, config, theme)` — Constructs LLM prompt
- `_invoke_model(prompt, max_length)` — Calls HF Inference API
- `_optimize_for_platform(content, platform, max_chars)` — Applies platform rules
- `_generate_hashtags(brand, platform, limit)` — Creates hashtag list
- `_template_generation(prompt)` — Fallback when model unavailable

**HF Model constants:**
```python
QEMPIRE_HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
QEMPIRE_FALLBACK_MODEL = "HuggingFaceH4/zephyr-7b-beta"
QEMPIRE_MODEL_CARD = "Qempireautomation/social-autopilot-ai"
QEMPIRE_SPACE = "Qempireautomation/qempire-social-autopilot"
```

### `WebsiteAnalyzer` (`app/services/website_analyzer.py`)
Scrapes and analyzes client websites.

**Key methods:**
- `analyze_website(url)` — Full analysis, returns brand_profile dict
- `_extract_brand_name(soup, url)` — Gets brand name from title/og tags
- `_extract_keywords(soup, text)` — Extracts relevant keywords
- `_analyze_tone(text)` — Detects: professional/casual/playful/authoritative/friendly
- `_extract_products(soup, text)` — Finds products/services listed

### `ContentOptimizer` (`app/services/content_optimizer.py`)
Applies platform-specific optimization rules.

**Platform rules dict** covers: style, emoji_density, line_breaks, tips
**Key method:** `optimize(content, platform, hashtags, brand_profile)` → `OptimizationResult`

### `PostManager` (`app/services/post_manager.py`)
Manages the full post lifecycle.

**Key methods:**
- `generate_and_queue_posts(user_id, brand_profile, platforms, theme, schedule_time)` → batch
- `publish_batch(batch_id)` → results dict
- `run_autopilot_cycle(user_id, brand_profile, platforms)` → called by scheduler
- `get_queue(user_id)`, `get_history(user_id, limit)`, `get_stats(user_id)`

### `AutopilotScheduler` (`app/core/scheduler.py`)
Manages cron-based autopilot jobs using APScheduler.

**Frequency options:** `hourly`, `daily`, `twice_daily`, `weekly`, `custom`
**Key methods:** `add_autopilot_job()`, `remove_job()`, `pause_job()`, `resume_job()`, `get_next_run()`

### `BasePlatformConnector` (`platforms/base.py`)
Abstract base for all 25 platform connectors.

**Required implementations:** `connect(credentials)`, `publish(content, media, hashtags)`, `get_analytics(post_id)`
**Provided:** `health_check()`, `disconnect()`, `_handle_error()`, `_check_rate_limit()`

---

## Platform Connector Implementation Status

| Platform | Auth Type | Full Implementation | Notes |
|----------|-----------|---------------------|-------|
| Facebook | OAuth2 | ✅ Full | Graph API v19.0 |
| Instagram | OAuth2 | ✅ Full | Graph API v19.0 |
| X/Twitter | OAuth2 | ✅ Full | API v2 |
| LinkedIn | OAuth2 | ✅ Full | UGC Posts API |
| TikTok | OAuth2 | ⚠️ Partial | Video requires separate upload |
| Pinterest | OAuth2 | ✅ Full | Pins API v5 |
| YouTube | OAuth2 | ⚠️ Partial | Community posts only |
| Reddit | OAuth2 | ⚠️ Partial | Subreddit required |
| Threads | OAuth2 | ⚠️ Partial | Meta API |
| Tumblr | OAuth2 | ⚠️ Partial | Basic posts |
| Medium | Bearer | ✅ Full | Articles API |
| Mastodon | OAuth2 | ✅ Full | Instance URL required |
| Discord | Bot Token | ✅ Full | Channel messages |
| Telegram | Bot Token | ✅ Full | Broadcast messages |
| WhatsApp | Bearer | ⚠️ Partial | Business API |
| Snapchat | OAuth2 | ⚠️ Partial | Story posts |
| Bluesky | App Password | ✅ Full | AT Protocol |
| WordPress | App Password | ✅ Full | REST API |
| Blogger | OAuth2 | ⚠️ Partial | Basic posts |
| Mix | OAuth2 | ⚠️ Partial | Share API |
| Quora | Bearer | ⚠️ Partial | Spaces API |
| VK | Bearer | ✅ Full | Wall posts |
| Weibo | OAuth2 | ⚠️ Partial | Status posts |
| LINE | Bearer | ✅ Full | Broadcast API |
| KakaoTalk | OAuth2 | ⚠️ Partial | Story posts |

Legend: ✅ Full = production-ready | ⚠️ Partial = functional but may need API key setup

---

## Database Schema (SQLAlchemy Models)

Defined in `app/core/database.py`:

```
users                    → App users (clients)
website_profiles         → Analyzed website/brand data
platform_connections     → Stored credentials per platform per user
posts                    → Generated content items
post_analytics           → Engagement metrics per post
schedules                → Autopilot schedule configurations
notification_logs        → History of all owner notifications
```

---

## Environment Variables Required

See `env_example.txt` for the full list. Key variables:

```bash
HUGGINGFACE_API_TOKEN=hf_...    # For HF Inference API (optional, uses public if absent)
DATABASE_URL=sqlite+aiosqlite:///./qempire_autopilot.db
AUTOPILOT_ENABLED=true
POSTING_SCHEDULE=daily
POSTING_TIME_UTC=09:00
NOTIFICATION_EMAIL=owner@qempireai.com
NOTIFICATION_WEBHOOK_URL=https://...
# + credentials for each of the 25 platforms
```

---

## Hugging Face Deployments

### Space (Client-Facing Gradio App)
- **URL:** https://huggingface.co/spaces/Qempireautomation/qempire-social-autopilot
- **File:** `huggingface_space/app.py`
- **SDK:** Gradio 4.44.0
- **Features:** Website analysis, platform selection, AI content generation, platform guide, autopilot setup instructions

### Model Card
- **URL:** https://huggingface.co/Qempireautomation/social-autopilot-ai
- **File:** `models/model_card.md`
- **Purpose:** Documents the AI architecture for the Q-Empire content generation model

---

## Update Changelog

### v1.2 — July 8, 2026 (Latest)
- **Added:** Real Hugging Face model inference (Mistral-7B-Instruct-v0.3)
- **Added:** Fallback model (Zephyr-7B-beta) when primary is unavailable
- **Added:** `QEMPIRE_HF_MODEL`, `QEMPIRE_FALLBACK_MODEL`, `QEMPIRE_MODEL_CARD`, `QEMPIRE_SPACE` constants
- **Added:** Public model access (no token required for basic use)
- **Added:** `CLAUDE.md` and `AI_CONTEXT.md` for AI assistant context
- **Updated:** Gradio Space rebranded for Q-Empire clients
- **Updated:** AI engine initialization logs HF model and Space URLs
- **Deployed:** HF Space live at `Qempireautomation/qempire-social-autopilot`
- **Deployed:** HF Model Card live at `Qempireautomation/social-autopilot-ai`

### v1.1 — July 8, 2026
- **Added:** Hugging Face Space with Gradio UI (client-facing)
- **Added:** Q-Empire brand styling (Deep Obsidian, Royal Blue, Electric Purple, Neon Aqua, Gold)
- **Added:** Client-specific branding and Q-Empire contact info
- **Updated:** README with full architecture diagram

### v1.0 — July 8, 2026
- **Initial release:** Full FastAPI application
- **Added:** 25 platform connectors
- **Added:** AI content generation engine
- **Added:** Website analyzer
- **Added:** Autopilot scheduler (APScheduler)
- **Added:** Owner notification system
- **Added:** SQLAlchemy database models
- **Added:** Docker + docker-compose deployment
- **Added:** Test suite

---

## Known Limitations & Future Work

1. **Platform connectors marked ⚠️ Partial** need their respective API keys and may require additional OAuth flow implementation for production use
2. **In-process scheduler** (APScheduler) works locally but should be replaced with Heartbeat/cron for Cloud Run deployment (see `references/periodic-updates.md` pattern)
3. **Website analyzer** uses trafilatura for text extraction — some JavaScript-heavy sites may not scrape well; consider adding Playwright for dynamic sites
4. **Analytics** are currently placeholder — real analytics require platform webhook integrations
5. **Media generation** (images/videos) is described but not generated — integrate with DALL-E, Stable Diffusion, or HeyGen for visual content

---

## Instructions for Claude When Modifying This Project

1. **Always read `CLAUDE.md` first** before making any changes
2. **Preserve brand colors** — never change the Q-Empire color palette
3. **Keep the 25-platform structure** — all platforms must remain supported
4. **Use HF Inference API** for all AI generation — do not swap to OpenAI without explicit instruction
5. **Test changes** with `pytest tests/` before committing
6. **Update this file** (`AI_CONTEXT.md`) when making significant architectural changes
7. **Commit messages** should be descriptive and reference the component changed
8. **Never expose credentials** — all secrets go in `.env` (gitignored)

---

*This file is maintained by Q-Empire AI Automation Division.*
*GitHub: https://github.com/michellemcbean5-droid/qempire-social-autopilot*
*HF Space: https://huggingface.co/spaces/Qempireautomation/qempire-social-autopilot*
