"""
Health Check & Monitoring Endpoints
Production-ready status, metrics, and readiness probes.
"""

from fastapi import APIRouter
from datetime import datetime
from typing import Dict, Any

from app.core.config import settings, PLATFORM_REGISTRY
from app.core.scheduler import autopilot_scheduler
from app.services.ai_engine import ai_engine

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("")
async def health_check() -> Dict[str, Any]:
    """Basic health check."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.APP_VERSION,
        "app_name": settings.APP_NAME,
    }

@router.get("/ready")
async def readiness_check() -> Dict[str, Any]:
    """Kubernetes-style readiness probe."""
    checks = {
        "ai_engine": ai_engine.client is not None,
        "scheduler": autopilot_scheduler.is_running,
        "platforms_loaded": len(PLATFORM_REGISTRY) == 25,
    }

    all_ready = all(checks.values())

    return {
        "ready": all_ready,
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat(),
    }

@router.get("/live")
async def liveness_check() -> Dict[str, Any]:
    """Kubernetes-style liveness probe."""
    return {
        "alive": True,
        "timestamp": datetime.utcnow().isoformat(),
    }

@router.get("/metrics")
async def metrics() -> Dict[str, Any]:
    """Basic application metrics."""
    return {
        "platforms": {
            "total": len(PLATFORM_REGISTRY),
            "names": list(PLATFORM_REGISTRY.keys()),
        },
        "ai_engine": {
            "initialized": ai_engine.client is not None,
            "model_id": settings.MODEL_ID,
        },
        "scheduler": {
            "running": autopilot_scheduler.is_running,
            "jobs": len(autopilot_scheduler.get_all_jobs()),
        },
        "timestamp": datetime.utcnow().isoformat(),
    }
