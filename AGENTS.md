# Q-Empire Social Autopilot — Agent Guide

> **For AI assistants and automation agents working on this repository.**

---

## Project Identity

- **Name:** Q-Empire Social Autopilot
- **Purpose:** AI-powered social media marketing platform that generates platform-optimized content and publishes to 25 platforms on autopilot.
- **Owner:** Q-Empire AI Automation Division
- **Language:** Python 3.11+
- **License:** MIT

---

## Architecture Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  FastAPI    │───▶│  AI Engine   │───▶│ 25 Platform │
│  Backend    │    │  (HF Models) │    │  Connectors │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Gradio    │    │  Scheduler   │    │  Analytics  │
│  HF Space   │    │  (APScheduler│    │  & Notif.   │
└─────────────┘    └──────────────┘    └─────────────┘
```

### Key Modules

| Module | Path | Responsibility |
|--------|------|----------------|
| API Routes | `app/main.py` | FastAPI entry, all REST endpoints |
| Config | `app/core/config.py` | Platform registry, settings |
| Database | `app/core/database.py` | SQLAlchemy models, connection |
| Scheduler | `app/core/scheduler.py` | APScheduler autopilot jobs |
| AI Engine | `app/services/ai_engine.py` | HF transformer inference |
| Post Manager | `app/services/post_manager.py` | Queue, publish, history |
| Website Analyzer | `app/services/website_analyzer.py` | Scraping, brand extraction |
| Content Optimizer | `app/services/content_optimizer.py` | Per-platform formatting |
| Notifications | `app/services/notifications.py` | Email, webhook alerts |
| Platform Base | `platforms/base.py` | Abstract connector |
| Platform Connectors | `platforms/*.py` | API-specific implementations |
| HF Space | `huggingface_space/app.py` | Gradio client portal |
| Model Wrapper | `models/social_content_model.py` | Custom HF model wrapper |

---

## Tech Stack

- **Backend:** FastAPI, Uvicorn, Pydantic v2, Pydantic-Settings
- **AI/ML:** Hugging Face Transformers, InferenceClient, torch, sentence-transformers
- **Database:** SQLAlchemy 2.0, aiosqlite (dev), PostgreSQL (prod), Alembic migrations
- **Scheduler:** APScheduler (in-process), Celery + Redis (background workers)
- **Frontend:** Gradio (Hugging Face Space)
- **Platform APIs:** tweepy, facebook-sdk, python-linkedin-v2, google-api-python-client, praw, atproto, mastodon.py, python-telegram-bot, discord.py
- **Scraping:** beautifulsoup4, httpx, aiohttp, lxml, trafilatura
- **Security:** cryptography, python-jose, passlib[bcrypt]
- **Testing:** pytest, pytest-asyncio, pytest-cov, httpx
- **Linting:** ruff, mypy

---

## Brand & Visual Identity

| Role | Color | Hex |
|------|-------|-----|
| Deep Obsidian | Primary dark | `#0A0A1A` |
| Royal Blue | Primary accent | `#4169E1` |
| Electric Purple | Secondary accent | `#BF00FF` |
| Neon Aqua | Highlight | `#00FFFF` |
| Warm Gold | Text/CTA | `#D4AF37` |
| Midnight Navy | Background | `#0D0D2B` |
| Soft White | Body text | `#F0F0FF` |

These colors are hardcoded in the Gradio UI and must remain consistent across all UI changes.

---

## Configuration

### Environment Variables (`.env`)

- `HUGGINGFACE_API_TOKEN` — HF token for model inference
- `MODEL_ID` — Default: `qempire/social-autopilot-ai`
- `DATABASE_URL` — Default: `sqlite+aiosqlite:///./qempire_autopilot.db`
- `REDIS_URL` — Default: `redis://localhost:6379/0`
- `AUTOPILOT_ENABLED` — `true`/`false`
- `POSTING_SCHEDULE` — `daily`, `weekly`, `custom`
- `POSTING_TIME_UTC` — e.g., `09:00`
- `NOTIFICATION_EMAIL` — Alert destination
- Platform API keys per platform (see `.env.example` for all 25)

### YAML Config Files

- `config/platforms.yaml` — Platform metadata (char limits, hashtag rules, best times)
- `config/schedules.yaml` — Schedule templates for autopilot

---

## Development Workflow

### Local Setup

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp env_example.txt .env
# Edit .env with your credentials
python -m app.main
```

### Running Tests

```bash
pytest tests/ -v --cov=app --cov=platforms --cov=models
```

### Docker

```bash
docker-compose up --build
```

Services: `app` (FastAPI), `redis` (task queue), `worker` (Celery)

### HuggingFace Space

The `huggingface_space/` directory is deployed as a standalone HF Space. It uses `gradio` and `huggingface_hub` only. Do not import from `app/` in the Space code.

---

## Coding Conventions

- **Python:** PEP 8, type hints on public functions, async for I/O-bound code
- **Imports:** `isort` style (stdlib, third-party, local)
- **Docstrings:** Google style for all public APIs
- **Logging:** `loguru` with structured output
- **Errors:** Raise `HTTPException` in routes; use custom exceptions in services
- **Security:** Never commit `.env`; encrypt credentials at rest using Fernet

---

## Testing Strategy

| Layer | Tests | Notes |
|-------|-------|-------|
| Unit | `tests/test_ai_engine.py` | AI engine logic, mock HF client |
| Unit | `tests/test_platforms.py` | Platform connectors, mock APIs |
| Unit | `tests/test_scheduler.py` | Scheduler job logic, mock triggers |
| Integration | `tests/test_api.py` | FastAPI routes with `TestClient` |
| Coverage Target | ≥ 80% | Reported in CI |

Use `pytest-asyncio` for async tests. Use `unittest.mock` or `pytest-mock` for external API mocking.

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`):
1. **Python Tests** — pytest on Python 3.11 and 3.12, coverage upload
2. **Lint** — ruff check + format check, mypy type check
3. **Docker Build** — `docker build` and smoke test
4. **Security Scan** — Trivy vulnerability scan
5. **HF Space Check** — syntax check + README validation

---

## Platform Registry

25 platforms are registered in `app/core/config.py` via `PLATFORM_REGISTRY`. Each platform entry must have:
- `name` (human-readable)
- `max_chars` (int)
- `supports_images` (bool)
- `supports_video` (bool)
- `supports_links` (bool)
- `hashtag_limit` (int)
- `best_posting_times` (list of hour strings)

When adding a new platform, add to:
1. `app/core/config.py` — `PLATFORM_REGISTRY`
2. `platforms/<platform>.py` — connector class inheriting from `BasePlatform`
3. `config/platforms.yaml` — YAML metadata
4. `tests/test_platforms.py` — connector tests

---

## AI Model Notes

- **Primary:** `mistralai/Mistral-7B-Instruct-v0.3` (Hugging Face Inference API)
- **Fallback:** `HuggingFaceH4/zephyr-7b-beta`
- **Custom model:** `qempire/social-autopilot-ai` (future fine-tuned model)
- All prompts use the `<s>[INST] ... [/INST]` format for Mistral instruction tuning.
- Prompts must include platform-specific rules (char limits, style, hashtags).

---

## Common Pitfalls

- **HF Token:** The HF Space runs without a token if none is set, but rate limits apply. Backend requires a token for production.
- **Celery:** Redis must be running before Celery workers start. `docker-compose.yml` handles this.
- **Database:** SQLite is used in development; use PostgreSQL in production. Update `DATABASE_URL` accordingly.
- **Platform Credentials:** Always encrypt before storing. Use `cryptography.fernet`.
- **Rate Limits:** Each platform connector implements its own rate limiting via `tenacity` retries.

---

## Useful Commands

```bash
# Run server with hot reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run Celery worker
celery -A app.worker worker --loglevel=info

# Alembic migrations
alembic revision --autogenerate -m "description"
alembic upgrade head

# Ruff lint + format
ruff check . && ruff format .

# Mypy type check
mypy app/ platforms/ models/ --ignore-missing-imports
```

---

## Contact & Support

- **Website:** [qempireai.com](https://qempireai.com)
- **Email:** support@qempireai.com
- **Phone:** (928) 490-0209
- **GitHub:** [michellemcbean5-droid/qempire-social-autopilot](https://github.com/michellemcbean5-droid/qempire-social-autopilot)

---

*Built by Q-Empire AI Automation Division | MIT License*
