# Deployment Guide

## Deployment Options

| Option | Best For | Difficulty |
|--------|----------|------------|
| Docker Compose | Single server, development | Easy |
| Hugging Face Space | Client demo, UI access | Easy |
| Railway/Render | Small production workloads | Medium |
| AWS/GCP/Azure | Large-scale production | Advanced |
| Kubernetes | Enterprise, multi-instance | Advanced |

---

## 1. Docker Compose Deployment (Recommended for Self-Hosting)

### Prerequisites

- Docker + Docker Compose
- Linux server (Ubuntu 22.04+ recommended)
- 4GB+ RAM, 2 CPU cores

### Steps

```bash
# Clone repo
git clone https://github.com/michellemcbean5-droid/qempire-social-autopilot.git
cd qempire-social-autopilot

# Create .env
cp .env.example .env
nano .env

# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f app
```

### Services

| Service | Port | Purpose |
|---------|------|---------|
| `app` | 8000 | FastAPI backend |
| `redis` | 6379 | Task queue |
| `worker` | — | Celery background worker |

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 2. Hugging Face Space Deployment

The `huggingface_space/` directory is designed as a standalone HF Space.

### Steps

1. Create a new Space on [huggingface.co](https://huggingface.co)
2. Select **Gradio** SDK
3. Upload files from `huggingface_space/`:
   - `app.py`
   - `requirements.txt`
   - `README.md`
4. Set `HF_TOKEN` as a Space secret (optional but recommended)
5. Deploy

### Environment Variables (HF Space Secrets)

- `HF_TOKEN` — Hugging Face API token for model inference

### Notes

- The HF Space does **not** require the backend API
- It generates content directly via `InferenceClient`
- For autopilot, users must set up the backend separately

---

## 3. Railway/Render Deployment

### Railway

1. Connect GitHub repo to Railway
2. Add environment variables from `.env.example`
3. Add Redis plugin
4. Deploy

### Render

1. Create Web Service from GitHub repo
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Add Redis service (Redis Cloud or Upstash)
5. Set environment variables

---

## 4. Cloud Deployment (AWS/GCP/Azure)

### AWS (ECS + RDS + ElastiCache)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  ECS Task   │────▶│  RDS        │────▶│ ElastiCache │
│  (FastAPI)  │     │  (PostgreSQL)│     │  (Redis)    │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Key resources:**
- ECS Fargate for FastAPI container
- RDS PostgreSQL for database
- ElastiCache Redis for Celery
- Application Load Balancer for HTTPS

### GCP (Cloud Run + Cloud SQL + Memorystore)

- Cloud Run for containerized FastAPI
- Cloud SQL (PostgreSQL) for database
- Memorystore for Redis
- Cloud Load Balancing for HTTPS

---

## 5. Kubernetes Deployment

### Manifests

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: qempire-social-autopilot
spec:
  replicas: 3
  selector:
    matchLabels:
      app: qempire
  template:
    metadata:
      labels:
        app: qempire
    spec:
      containers:
      - name: app
        image: ghcr.io/michellemcbean5-droid/qempire-social-autopilot:latest
        ports:
        - containerPort: 8000
        envFrom:
        - secretRef:
            name: qempire-secrets
```

### Helm Chart (Future)

A Helm chart is planned for simplified Kubernetes deployment with:
- Auto-scaling HPA
- Ingress with TLS
- PostgreSQL subchart
- Redis subchart

---

## Environment-Specific Configuration

### Development

```env
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./qempire_autopilot.db
REDIS_URL=redis://localhost:6379/0
AUTOPILOT_ENABLED=false
```

### Staging

```env
DEBUG=false
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/qempire_staging
REDIS_URL=redis://redis:6379/0
AUTOPILOT_ENABLED=true
```

### Production

```env
DEBUG=false
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/qempire_prod
REDIS_URL=redis://redis:6379/0
AUTOPILOT_ENABLED=true
POSTING_SCHEDULE=daily
POSTING_TIME_UTC=09:00
NOTIFICATION_EMAIL=alerts@yourdomain.com
```

---

## CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`):

1. **Test** — pytest on Python 3.11, 3.12
2. **Lint** — ruff + mypy
3. **Build** — Docker image build
4. **Security** — Trivy vulnerability scan
5. **Deploy** — (Add your deploy step here)

### Release Process

1. Update version in `setup.py` and `app/main.py`
2. Update `CHANGELOG.md`
3. Tag release: `git tag v1.0.1`
4. Push: `git push origin v1.0.1`
5. CI builds and pushes Docker image

---

## Monitoring & Alerts

| Tool | Integration | Purpose |
|------|-------------|---------|
| Loguru | Built-in | Structured logging |
| Sentry | Add DSN to `.env` | Error tracking |
| Prometheus | Metrics endpoint | Performance monitoring |
| Grafana | Dashboard | Visualization |

### Health Check Endpoint

```bash
curl http://localhost:8000/
```

Docker health check is configured in `Dockerfile`:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1
```

---

## Backup & Recovery

### Database

```bash
# SQLite backup
cp qempire_autopilot.db qempire_autopilot.db.backup

# PostgreSQL backup
pg_dump -h db_host -U user qempire_prod > backup.sql
```

### Environment Variables

Store `.env` in a secure vault (AWS Secrets Manager, HashiCorp Vault, etc.). Never commit to git.

---

*Q-Empire AI Automation Division | support@qempireai.com*
