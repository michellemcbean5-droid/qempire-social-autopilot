"""
Q-Empire Social Autopilot - Database Models
SQLAlchemy models for platforms, posts, schedules, and analytics.
"""

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Float,
    ForeignKey, Enum, JSON, create_engine
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from datetime import datetime
import enum

Base = declarative_base()


class PostStatus(enum.Enum):
    DRAFT = "draft"
    QUEUED = "queued"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PlatformStatus(enum.Enum):
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"
    ERROR = "error"
    RATE_LIMITED = "rate_limited"


class ScheduleFrequency(enum.Enum):
    HOURLY = "hourly"
    DAILY = "daily"
    TWICE_DAILY = "twice_daily"
    WEEKLY = "weekly"
    CUSTOM = "custom"


class User(Base):
    """Application user who owns platform connections and posts."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(320), unique=True, nullable=False)
    hashed_password = Column(String(256), nullable=False)
    name = Column(String(128))
    website_url = Column(String(512))
    brand_profile = Column(JSON)  # Extracted brand data from website
    autopilot_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    platforms = relationship("PlatformConnection", back_populates="user")
    posts = relationship("Post", back_populates="user")
    schedules = relationship("Schedule", back_populates="user")


class WebsiteProfile(Base):
    """Stores analyzed website data for AI content generation."""
    __tablename__ = "website_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    url = Column(String(512), nullable=False)
    brand_name = Column(String(256))
    brand_description = Column(Text)
    brand_keywords = Column(JSON)  # List of extracted keywords
    brand_tone = Column(String(64))  # professional, casual, playful, etc.
    products_services = Column(JSON)  # List of products/services found
    target_audience = Column(Text)
    color_scheme = Column(JSON)  # Extracted colors
    content_themes = Column(JSON)  # Main content themes
    last_analyzed = Column(DateTime, default=datetime.utcnow)
    raw_content = Column(Text)  # Scraped text content
    created_at = Column(DateTime, default=datetime.utcnow)


class PlatformConnection(Base):
    """Stores credentials and status for each connected social platform."""
    __tablename__ = "platform_connections"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform_name = Column(String(64), nullable=False)  # e.g., "facebook", "twitter"
    platform_display_name = Column(String(128))
    status = Column(Enum(PlatformStatus), default=PlatformStatus.DISCONNECTED)
    credentials = Column(Text)  # Encrypted JSON credentials
    profile_url = Column(String(512))
    profile_name = Column(String(256))
    last_post_at = Column(DateTime)
    last_error = Column(Text)
    posts_today = Column(Integer, default=0)
    total_posts = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="platforms")
    posts = relationship("Post", back_populates="platform")


class Post(Base):
    """Individual post content generated for a specific platform."""
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform_id = Column(Integer, ForeignKey("platform_connections.id"), nullable=False)
    batch_id = Column(String(64))  # Groups posts from same generation run

    # Content
    content_text = Column(Text, nullable=False)
    hashtags = Column(JSON)  # List of hashtags
    media_urls = Column(JSON)  # List of media URLs
    link_url = Column(String(512))
    image_description = Column(Text)  # AI-generated image description

    # Metadata
    platform_name = Column(String(64), nullable=False)
    status = Column(Enum(PostStatus), default=PostStatus.DRAFT)
    scheduled_at = Column(DateTime)
    published_at = Column(DateTime)
    error_message = Column(Text)
    platform_post_id = Column(String(256))  # ID returned by platform after posting

    # AI Generation metadata
    ai_model_used = Column(String(128))
    generation_prompt = Column(Text)
    content_score = Column(Float)  # AI confidence score

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="posts")
    platform = relationship("PlatformConnection", back_populates="posts")
    analytics = relationship("PostAnalytics", back_populates="post", uselist=False)


class PostAnalytics(Base):
    """Performance metrics for published posts."""
    __tablename__ = "post_analytics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, unique=True)

    # Engagement metrics
    impressions = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)

    # Calculated
    score = Column(Float, default=0.0)  # Overall performance score

    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    post = relationship("Post", back_populates="analytics")


class Schedule(Base):
    """Autopilot scheduling configuration."""
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(128), nullable=False)
    frequency = Column(Enum(ScheduleFrequency), default=ScheduleFrequency.DAILY)
    cron_expression = Column(String(64))  # For custom schedules
    time_utc = Column(String(8))  # HH:MM format
    timezone = Column(String(64), default="UTC")
    platforms = Column(JSON)  # List of platform names to post to
    is_active = Column(Boolean, default=True)
    posts_per_run = Column(Integer, default=1)
    last_run_at = Column(DateTime)
    next_run_at = Column(DateTime)
    total_runs = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="schedules")


class NotificationLog(Base):
    """Log of all notifications sent to the owner."""
    __tablename__ = "notification_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notification_type = Column(String(64))  # success, error, warning
    title = Column(String(256))
    message = Column(Text)
    platform_name = Column(String(64))
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    is_read = Column(Boolean, default=False)
    sent_at = Column(DateTime, default=datetime.utcnow)


# Database initialization
def get_engine(database_url: str):
    """Create database engine."""
    if "sqlite" in database_url:
        return create_async_engine(database_url, echo=False)
    return create_async_engine(database_url, echo=False, pool_pre_ping=True)


async def init_db(database_url: str):
    """Initialize database and create all tables."""
    engine = get_engine(database_url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    return engine


def get_session_factory(engine):
    """Create async session factory."""
    return sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
