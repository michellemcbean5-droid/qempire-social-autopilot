## [1.0.0] - 2025-01-15

### 🚀 Initial Release

#### Added
- Complete FastAPI backend with 25 platform connectors
- React Native mobile app (Expo SDK 52) with 18 screens
- AI content generation via Hugging Face Mistral-7B
- Website brand analysis and voice extraction
- Autopilot scheduler with cron support
- 4-tier subscription system (Free/Basic/Pro/Elite)
- Promo code and referral system
- Analytics dashboard with platform breakdown
- Push notifications for post success/failure
- Deep link support (`qempire://`)
- Gradio Hugging Face Space demo
- Docker + docker-compose deployment
- GitHub Actions CI/CD
- Fastlane store deployment automation
- Production health check endpoints (/api/health)
- Animated splash screen with gradient and pulse
- App Store & Play Store submission documentation

#### Fixed
- Mobile App.tsx empty render bug — now has full provider tree
- Navigation Stack/Tab broken JSX — all 18 screens properly wired
- Missing Hugging Face Space demo interface
- Missing babel module-resolver for @/ aliases
- Missing expo-notifications import in config.ts

#### Security
- Fernet encryption for API credentials
- OAuth2 flows where available
- Rate limiting per platform

---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Actions CI/CD pipeline (`ci.yml`) with Python tests, Docker build, linting, and security scanning
- Comprehensive documentation in `docs/`:
  - `getting-started.md` — Installation and setup guide
  - `architecture.md` — System architecture and data flow overview
  - `deployment.md` — Deployment guides for Docker, HuggingFace Space, Railway, cloud, and Kubernetes
- `AGENTS.md` — Tailored agent context for AI assistants working on this project
- `tests/conftest.py` — Shared pytest fixtures for FastAPI client, brand profiles, and platform credentials
- `tests/test_platforms.py` — Unit tests for platform connectors (Facebook, Instagram, Twitter, LinkedIn)
- `tests/test_scheduler.py` — Unit tests for APScheduler autopilot job management
- `requirements-dev.txt` — Development dependencies (pytest, ruff, mypy, pre-commit)
- `.env.example` — Environment variables template (mirrors `env_example.txt`)
- Standard repository files: `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- GitHub issue templates: `bug_report.md`, `feature_request.md`
- Pull request template with testing checklist

### Changed
- Updated `README.md` with:
  - CI badge and technology badges
  - Expanded installation instructions (local, Docker, HF Space)
  - Testing section with coverage commands
  - API quick start examples
  - Automation & CI/CD notes
  - Documentation links table
  - Updated project structure to include new files

### Deprecated
- `env_example.txt` — Kept for backward compatibility; use `.env.example` going forward

## [1.0.0] - 2024-07-08

### Added
- Initial release of Q-Empire Social Autopilot
- FastAPI backend with full REST API
- AI content generation using Hugging Face Transformers (Mistral-7B + Zephyr fallback)
- Support for 25 social media platforms
- Website analyzer for brand profile extraction
- Content optimizer for per-platform formatting
- Autopilot scheduler with APScheduler
- Post manager with queue and history
- Notification system for owner alerts
- Gradio frontend for HuggingFace Space
- Docker and docker-compose support
- Celery + Redis integration for background tasks
- SQLAlchemy database with SQLite/PostgreSQL support
- Platform connectors: Facebook, Instagram, Twitter/X, LinkedIn
- `CLAUDE.md` and `AI_CONTEXT.md` for AI assistant context
- `setup.py` for package distribution

---
*Q-Empire AI Automation Division | qempireai.com*
