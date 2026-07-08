# Getting Started with Q-Empire Social Autopilot

> **Prerequisites:** Python 3.11+, Docker (optional), Redis (for Celery)

---

## 1. Clone the Repository

```bash
git clone https://github.com/michellemcbean5-droid/qempire-social-autopilot.git
cd qempire-social-autopilot
```

---

## 2. Set Up Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

---

## 3. Configure Environment

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or your preferred editor
```

### Minimum Required Variables

```env
HUGGINGFACE_API_TOKEN=hf_your_token_here
DATABASE_URL=sqlite+aiosqlite:///./qempire_autopilot.db
REDIS_URL=redis://localhost:6379/0
AUTOPILOT_ENABLED=true
POSTING_SCHEDULE=daily
POSTING_TIME_UTC=09:00
NOTIFICATION_EMAIL=your@email.com
```

**Get a HuggingFace token:** [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

---

## 4. Run the Application

### Option A: Direct Python

```bash
python -m app.main
```

The API will be available at: [http://localhost:8000](http://localhost:8000)

- API Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- ReDoc: [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)

### Option B: Docker Compose

```bash
docker-compose up --build
```

This starts:
- FastAPI app on port 8000
- Redis on port 6379
- Celery worker for background tasks

### Option C: Uvicorn with Hot Reload

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 5. Verify Installation

```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "app": "Q-Empire Social Autopilot",
  "version": "1.0.0",
  "status": "running",
  "autopilot": false,
  "connected_platforms": 0,
  "ai_engine": "demo_mode"
}
```

---

## 6. Run Tests

```bash
pytest tests/ -v
```

With coverage:
```bash
pytest tests/ -v --cov=app --cov=platforms --cov=models --cov-report=term
```

---

## 7. Quick Onboarding (API)

### Step 1: Analyze Your Website

```bash
curl -X POST http://localhost:8000/api/onboarding/analyze-website \
  -H "Content-Type: application/json" \
  -d '{"url": "https://yourwebsite.com"}'
```

### Step 2: Connect Platforms

```bash
curl -X POST http://localhost:8000/api/onboarding/connect-platforms \
  -H "Content-Type: application/json" \
  -d '{
    "platforms": [
      {"platform": "twitter", "credentials": {"api_key": "xxx"}},
      {"platform": "facebook", "credentials": {"access_token": "xxx"}}
    ]
  }'
```

### Step 3: Enable Autopilot

```bash
curl -X POST http://localhost:8000/api/autopilot/configure \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "frequency": "daily",
    "time_utc": "09:00",
    "platforms": ["twitter", "facebook", "instagram"]
  }'
```

---

## 8. Next Steps

- Read [Architecture Overview](architecture.md)
- Read [Deployment Guide](deployment.md)
- Explore the API docs at `/api/docs`
- Customize `config/platforms.yaml` for your posting preferences

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Ensure you activated the virtual environment |
| `AI Engine: demo_mode` | Set `HUGGINGFACE_API_TOKEN` in `.env` |
| Redis connection error | Start Redis: `docker run -d -p 6379:6379 redis:7-alpine` |
| Port 8000 in use | Change port: `uvicorn app.main:app --port 8001` |

---

*Q-Empire AI Automation Division | support@qempireai.com*
