# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Q-Empire Social Autopilot                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────┐ │
│  │   FastAPI Backend  │◀──▶│  AI Content Engine │◀──▶│  Platform APIs │ │
│  │   (app/main.py)    │    │  (HF Transformers) │    │  (25 Connectors)│ │
│  └────────────────────┘    └────────────────────┘    └────────────────┘ │
│           │                        │                        │          │
│           ▼                        ▼                        ▼          │
│  ┌────────────────────┐    ┌────────────────────┐    ┌────────────────┐ │
│  │  Gradio Frontend   │    │  APScheduler       │    │  Notification  │ │
│  │  (HF Space)        │    │  + Celery Worker   │    │  Service       │ │
│  └────────────────────┘    └────────────────────┘    └────────────────┘ │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  SQLAlchemy Database (SQLite dev / PostgreSQL prod) + Alembic    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. FastAPI Backend (`app/`)

| Module | File | Purpose |
|--------|------|---------|
| Entry Point | `app/main.py` | FastAPI app, routes, lifecycle |
| Config | `app/core/config.py` | Settings, platform registry |
| Database | `app/core/database.py` | SQLAlchemy models, async session |
| Scheduler | `app/core/scheduler.py` | APScheduler job management |
| API Routes | `app/api/routes.py` | REST endpoints (if split from main) |
| Auth | `app/api/auth.py` | JWT, OAuth2 flows |

### 2. AI Engine (`app/services/`)

| Module | File | Purpose |
|--------|------|---------|
| AI Engine | `app/services/ai_engine.py` | HF inference, content generation |
| Website Analyzer | `app/services/website_analyzer.py` | Scraping, brand extraction |
| Content Optimizer | `app/services/content_optimizer.py` | Per-platform formatting |
| Post Manager | `app/services/post_manager.py` | Queue, publish, history |
| Notifications | `app/services/notifications.py` | Email, webhook alerts |

**AI Flow:**
```
Website URL → Analyzer → Brand Profile
                              ↓
Platform List → AI Engine → Generated Posts
                              ↓
Content Optimizer → Platform-Specific Posts
                              ↓
Post Manager → Queue → Publish → History
```

### 3. Platform Connectors (`platforms/`)

All connectors inherit from `BasePlatform`:

```python
class BasePlatform(ABC):
    @abstractmethod
    async def post(self, content: PostContent) -> dict: ...
    
    def format_content(self, content: PostContent) -> str: ...
    def validate_content(self, content: PostContent) -> bool: ...
```

| Platform | File | Status |
|----------|------|--------|
| Facebook | `platforms/facebook.py` | ✅ Implemented |
| Instagram | `platforms/instagram.py` | ✅ Implemented |
| Twitter/X | `platforms/twitter.py` | ✅ Implemented |
| LinkedIn | `platforms/linkedin.py` | ✅ Implemented |
| Others | `platforms/all_platforms.py` | 🔄 Stubs |

### 4. Database Layer

**Models:**
- `User` — Brand profile, credentials (encrypted)
- `Post` — Generated content, platform, status, timestamps
- `PlatformAccount` — Connected platform credentials
- `Schedule` — Autopilot configuration
- `Notification` — Alert log

**Technology:**
- Development: SQLite with `aiosqlite`
- Production: PostgreSQL
- Migrations: Alembic

### 5. Scheduler

**APScheduler** (in-process):
- Handles daily/weekly/custom cron triggers
- Stores jobs in memory (dev) or database (prod)

**Celery + Redis** (background):
- Handles long-running tasks (image generation, batch posting)
- Worker container in `docker-compose.yml`

### 6. Hugging Face Space (`huggingface_space/`)

Standalone Gradio application deployed to HF Spaces:
- No dependency on `app/` modules
- Uses `huggingface_hub.InferenceClient` directly
- Supports the Mistral-7B and Zephyr-7B models
- Generates content for all 25 platforms with platform-specific prompts

---

## Data Flow

### Content Generation Flow

```
User Website
    ↓
[Website Analyzer] → Brand Profile (keywords, tone, products)
    ↓
[AI Engine] + Brand Profile + Platform Rules → Raw Content
    ↓
[Content Optimizer] → Platform-Optimized Content
    ↓
[Post Manager] → Queue
    ↓
[Platform Connector] → Publish to API
    ↓
[Database] → History + Analytics
    ↓
[Notification Service] → Success/Failure Alert
```

### Autopilot Flow

```
[Scheduler Trigger] → Callback
    ↓
[Post Manager] → run_autopilot_cycle()
    ↓
[AI Engine] → generate new content
    ↓
[Content Optimizer] → optimize per platform
    ↓
[Post Manager] → publish_batch()
    ↓
[Platform Connectors] → parallel publish
    ↓
[Analytics] → update metrics
    ↓
[Notification] → report to owner
```

---

## Configuration

### `config/platforms.yaml`

```yaml
platforms:
  facebook:
    name: "Facebook"
    max_chars: 63206
    supports_images: true
    supports_video: true
    supports_links: true
    hashtag_limit: 30
    best_posting_times: ["09:00", "13:00", "15:00"]
```

### `config/schedules.yaml`

```yaml
schedules:
  daily:
    description: "One post per day"
    cron: "0 9 * * *"
  
  aggressive:
    description: "4 posts per day"
    cron: "0 9,12,15,18 * * *"
```

---

## Security Model

- **Credential Encryption:** Fernet symmetric encryption for all platform tokens
- **API Authentication:** JWT tokens for internal API access
- **OAuth2:** Used where platforms support it (Facebook, LinkedIn, Twitter)
- **Rate Limiting:** Per-platform with `tenacity` exponential backoff
- **Input Validation:** Pydantic models for all request/response schemas
- **CORS:** Configured for HF Space origin

---

## Scalability Considerations

| Bottleneck | Solution |
|------------|----------|
| AI inference latency | HF Inference API (async) + Celery workers |
| Database throughput | Migrate to PostgreSQL + connection pooling |
| Platform rate limits | Per-platform queue with backoff |
| Memory (model loading) | Use HF API, not local model loading |
| Concurrent posts | Celery workers + Redis queue |

---

*Q-Empire AI Automation Division | support@qempireai.com*
