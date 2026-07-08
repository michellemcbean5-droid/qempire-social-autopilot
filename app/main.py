"""
Q-Empire Social Autopilot - Main Application
FastAPI application entry point with all API routes.
AI-powered social media marketing that runs while you sleep.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from loguru import logger
import uvicorn
import sys

from app.core.config import settings, PLATFORM_REGISTRY
from app.core.scheduler import autopilot_scheduler
from app.services.ai_engine import ai_engine
from app.services.website_analyzer import website_analyzer
from app.services.post_manager import post_manager
from app.services.notifications import notification_service

# Configure logging
logger.remove()
logger.add(sys.stdout, level="INFO", format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | {message}")

# Initialize FastAPI app
app = FastAPI(
    title="Q-Empire Social Autopilot",
    description="AI-Powered Social Media Marketing That Runs While You Sleep",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST/RESPONSE MODELS
# ============================================================

class WebsiteAnalysisRequest(BaseModel):
    url: str


class PlatformCredentials(BaseModel):
    platform: str
    credentials: Dict


class ConnectPlatformsRequest(BaseModel):
    platforms: List[PlatformCredentials]


class GenerateContentRequest(BaseModel):
    platforms: Optional[List[str]] = None
    content_theme: Optional[str] = None


class AutopilotConfigRequest(BaseModel):
    enabled: bool
    frequency: str = "daily"
    time_utc: str = "09:00"
    platforms: Optional[List[str]] = None
    cron_expression: Optional[str] = None


class EditPostRequest(BaseModel):
    post_id: str
    content: str
    hashtags: Optional[List[str]] = None


# ============================================================
# IN-MEMORY STATE (Replace with DB in production)
# ============================================================

app_state = {
    "user_brand_profile": None,
    "connected_platforms": [],
    "autopilot_enabled": False,
    "autopilot_config": None,
}


# ============================================================
# API ROUTES
# ============================================================

@app.get("/")
async def root():
    """Health check and app info."""
    return {
        "app": "Q-Empire Social Autopilot",
        "version": "1.0.0",
        "status": "running",
        "autopilot": app_state["autopilot_enabled"],
        "connected_platforms": len(app_state["connected_platforms"]),
        "ai_engine": "active" if ai_engine.client else "demo_mode",
    }


# --- ONBOARDING ---

@app.post("/api/onboarding/analyze-website")
async def analyze_website(request: WebsiteAnalysisRequest):
    """
    Step 1 of onboarding: Analyze user's website to extract brand profile.
    The AI uses this data to generate on-brand content.
    """
    logger.info(f"🔍 Analyzing website: {request.url}")

    profile = await website_analyzer.analyze_website(request.url)
    app_state["user_brand_profile"] = profile

    return {
        "success": True,
        "brand_profile": {
            "brand_name": profile.get("brand_name"),
            "description": profile.get("description"),
            "keywords": profile.get("keywords", [])[:10],
            "tone": profile.get("tone"),
            "products_services": profile.get("products_services", [])[:10],
            "content_themes": profile.get("content_themes", []),
            "social_links_found": profile.get("social_links", []),
        },
        "message": f"Successfully analyzed {profile.get('brand_name', 'your website')}. Ready to connect platforms!",
    }


@app.post("/api/onboarding/connect-platforms")
async def connect_platforms(request: ConnectPlatformsRequest):
    """
    Step 2 of onboarding: Connect social media platform credentials.
    Supports up to 25 platforms.
    """
    results = []
    for platform_cred in request.platforms:
        platform_name = platform_cred.platform
        if platform_name not in PLATFORM_REGISTRY:
            results.append({
                "platform": platform_name,
                "connected": False,
                "error": f"Unsupported platform: {platform_name}",
            })
            continue

        # Store credentials (in production, encrypt these)
        app_state["connected_platforms"].append({
            "name": platform_name,
            "display_name": PLATFORM_REGISTRY[platform_name]["name"],
            "status": "connected",
            "connected_at": datetime.utcnow().isoformat(),
        })

        results.append({
            "platform": platform_name,
            "display_name": PLATFORM_REGISTRY[platform_name]["name"],
            "connected": True,
        })

    return {
        "success": True,
        "total_connected": len([r for r in results if r.get("connected")]),
        "results": results,
    }


@app.get("/api/platforms/supported")
async def get_supported_platforms():
    """Get list of all 25 supported platforms with their capabilities."""
    return {
        "total": len(PLATFORM_REGISTRY),
        "platforms": [
            {
                "id": key,
                "name": config["name"],
                "max_chars": config["max_chars"],
                "supports_images": config["supports_images"],
                "supports_video": config["supports_video"],
                "supports_links": config["supports_links"],
                "hashtag_limit": config["hashtag_limit"],
                "best_posting_times": config["best_posting_times"],
            }
            for key, config in PLATFORM_REGISTRY.items()
        ],
    }


# --- CONTENT GENERATION ---

@app.post("/api/content/generate")
async def generate_content(request: GenerateContentRequest):
    """
    Generate AI-powered, platform-optimized content for all connected platforms.
    Each platform gets unique, tailored content.
    """
    if not app_state["user_brand_profile"]:
        raise HTTPException(status_code=400, detail="Please analyze your website first")

    platforms = request.platforms or [p["name"] for p in app_state["connected_platforms"]]

    if not platforms:
        raise HTTPException(status_code=400, detail="No platforms connected")

    result = await post_manager.generate_and_queue_posts(
        user_id=1,
        brand_profile=app_state["user_brand_profile"],
        platforms=platforms,
        content_theme=request.content_theme,
    )

    return {
        "success": True,
        "batch_id": result["batch_id"],
        "total_posts": result["total_posts"],
        "platforms": result["platforms"],
        "posts": [
            {
                "id": p["id"],
                "platform": p["platform_name"],
                "content": p["content"],
                "hashtags": p["hashtags"],
                "character_count": p["character_count"],
                "engagement_score": p["engagement_score"],
                "image_description": p["image_description"],
            }
            for p in result["posts"]
        ],
    }


@app.post("/api/content/publish/{batch_id}")
async def publish_batch(batch_id: str, background_tasks: BackgroundTasks):
    """Publish all posts in a batch to their platforms."""
    results = await post_manager.publish_batch(batch_id)
    return results


@app.put("/api/content/edit")
async def edit_post(request: EditPostRequest):
    """Edit a generated post before publishing."""
    queue = post_manager.get_queue()
    for post in queue:
        if post["id"] == request.post_id:
            post["content"] = request.content
            if request.hashtags:
                post["hashtags"] = request.hashtags
            post["character_count"] = len(request.content)
            return {"success": True, "post": post}

    raise HTTPException(status_code=404, detail="Post not found in queue")


# --- DASHBOARD ---

@app.get("/api/dashboard")
async def get_dashboard():
    """Get the main dashboard data - platforms, queue, history, autopilot status."""
    return {
        "autopilot": {
            "enabled": app_state["autopilot_enabled"],
            "config": app_state["autopilot_config"],
            "next_run": str(autopilot_scheduler.get_next_run(1)) if app_state["autopilot_enabled"] else None,
        },
        "platforms": {
            "connected": app_state["connected_platforms"],
            "total_connected": len(app_state["connected_platforms"]),
            "total_available": len(PLATFORM_REGISTRY),
        },
        "queue": {
            "posts": post_manager.get_queue(user_id=1),
            "total": len(post_manager.get_queue(user_id=1)),
        },
        "history": {
            "posts": post_manager.get_history(user_id=1, limit=20),
            "total": len(post_manager.get_history(user_id=1)),
        },
        "stats": post_manager.get_stats(user_id=1),
        "notifications": {
            "unread": notification_service.get_unread_count(),
            "recent": notification_service.get_notifications(limit=5),
        },
    }


# --- AUTOPILOT ---

@app.post("/api/autopilot/configure")
async def configure_autopilot(config: AutopilotConfigRequest):
    """Configure and enable/disable the autopilot posting system."""
    app_state["autopilot_enabled"] = config.enabled
    app_state["autopilot_config"] = config.model_dump()

    if config.enabled:
        # Start the autopilot scheduler
        async def autopilot_callback(user_id: int):
            """Called by scheduler on each autopilot trigger."""
            platforms = config.platforms or [p["name"] for p in app_state["connected_platforms"]]
            await post_manager.run_autopilot_cycle(
                user_id=user_id,
                brand_profile=app_state["user_brand_profile"],
                platforms=platforms,
            )

        autopilot_scheduler.add_autopilot_job(
            user_id=1,
            frequency=config.frequency,
            time_utc=config.time_utc,
            cron_expression=config.cron_expression,
            callback=autopilot_callback,
        )
        autopilot_scheduler.start()

        return {
            "success": True,
            "message": f"🚀 Autopilot ENABLED! Posting {config.frequency} at {config.time_utc} UTC",
            "next_run": str(autopilot_scheduler.get_next_run(1)),
        }
    else:
        autopilot_scheduler.remove_job(1)
        return {
            "success": True,
            "message": "⏹️ Autopilot disabled",
        }


@app.get("/api/autopilot/status")
async def get_autopilot_status():
    """Get current autopilot status and next scheduled run."""
    return {
        "enabled": app_state["autopilot_enabled"],
        "config": app_state["autopilot_config"],
        "next_run": str(autopilot_scheduler.get_next_run(1)),
        "scheduler_running": autopilot_scheduler.is_running,
        "all_jobs": autopilot_scheduler.get_all_jobs(),
    }


@app.post("/api/autopilot/trigger-now")
async def trigger_autopilot_now():
    """Manually trigger one autopilot cycle immediately."""
    if not app_state["user_brand_profile"]:
        raise HTTPException(status_code=400, detail="No brand profile configured")

    platforms = [p["name"] for p in app_state["connected_platforms"]]
    if not platforms:
        raise HTTPException(status_code=400, detail="No platforms connected")

    results = await post_manager.run_autopilot_cycle(
        user_id=1,
        brand_profile=app_state["user_brand_profile"],
        platforms=platforms,
    )

    return results


# --- ANALYTICS ---

@app.get("/api/analytics")
async def get_analytics():
    """Get analytics data for all published posts."""
    history = post_manager.get_history(user_id=1)
    stats = post_manager.get_stats(user_id=1)

    # Aggregate by platform
    platform_stats = {}
    for post in history:
        platform = post.get("platform_name", post.get("platform"))
        if platform not in platform_stats:
            platform_stats[platform] = {
                "total_posts": 0,
                "successful": 0,
                "failed": 0,
                "avg_engagement": 0,
            }
        platform_stats[platform]["total_posts"] += 1
        if post["status"] == "published":
            platform_stats[platform]["successful"] += 1
        else:
            platform_stats[platform]["failed"] += 1
        platform_stats[platform]["avg_engagement"] += post.get("engagement_score", 0)

    # Calculate averages
    for platform in platform_stats:
        total = platform_stats[platform]["total_posts"]
        if total > 0:
            platform_stats[platform]["avg_engagement"] /= total

    return {
        "overview": stats,
        "by_platform": platform_stats,
        "recent_posts": history[:20],
    }


# --- NOTIFICATIONS ---

@app.get("/api/notifications")
async def get_notifications(unread_only: bool = False, limit: int = 50):
    """Get owner notifications."""
    return {
        "unread_count": notification_service.get_unread_count(),
        "notifications": notification_service.get_notifications(limit=limit, unread_only=unread_only),
    }


@app.post("/api/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: int):
    """Mark a notification as read."""
    notification_service.mark_read(notification_id)
    return {"success": True}


# ============================================================
# APP LIFECYCLE
# ============================================================

@app.on_event("startup")
async def startup():
    """Initialize services on app startup."""
    logger.info("🚀 Q-Empire Social Autopilot starting up...")
    logger.info(f"📊 {len(PLATFORM_REGISTRY)} platforms supported")
    logger.info(f"🤖 AI Engine: {'Connected' if ai_engine.client else 'Demo Mode'}")


@app.on_event("shutdown")
async def shutdown():
    """Clean up on shutdown."""
    autopilot_scheduler.stop()
    logger.info("👋 Q-Empire Social Autopilot shutting down")


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
