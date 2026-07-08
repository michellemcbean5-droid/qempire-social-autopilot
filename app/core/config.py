"""
Q-Empire Social Autopilot - Application Configuration
Manages all environment variables, API keys, and platform settings.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Q-Empire Social Autopilot"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str = Field(default="change-me-in-production")

    # AI Model Configuration
    HUGGINGFACE_API_TOKEN: Optional[str] = None
    MODEL_ID: str = "qempire/social-autopilot-ai"
    AI_MODEL_TEMPERATURE: float = 0.7
    AI_MODEL_MAX_TOKENS: int = 1024

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./qempire_autopilot.db"

    # Redis (for Celery task queue)
    REDIS_URL: str = "redis://localhost:6379/0"

    # Scheduling
    AUTOPILOT_ENABLED: bool = True
    POSTING_SCHEDULE: str = "daily"  # daily, weekly, custom
    POSTING_TIME_UTC: str = "09:00"
    POSTING_TIMEZONE: str = "UTC"

    # Notification Settings
    NOTIFICATION_EMAIL: Optional[str] = None
    NOTIFICATION_WEBHOOK_URL: Optional[str] = None
    NOTIFICATIONS_ENABLED: bool = True

    # Platform API Keys
    # Facebook / Meta
    FACEBOOK_ACCESS_TOKEN: Optional[str] = None
    FACEBOOK_PAGE_ID: Optional[str] = None
    INSTAGRAM_ACCESS_TOKEN: Optional[str] = None
    INSTAGRAM_BUSINESS_ID: Optional[str] = None

    # X / Twitter
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_ACCESS_TOKEN: Optional[str] = None
    TWITTER_ACCESS_SECRET: Optional[str] = None

    # LinkedIn
    LINKEDIN_ACCESS_TOKEN: Optional[str] = None
    LINKEDIN_ORGANIZATION_ID: Optional[str] = None

    # TikTok
    TIKTOK_ACCESS_TOKEN: Optional[str] = None
    TIKTOK_OPEN_ID: Optional[str] = None

    # Pinterest
    PINTEREST_ACCESS_TOKEN: Optional[str] = None
    PINTEREST_BOARD_ID: Optional[str] = None

    # YouTube
    YOUTUBE_API_KEY: Optional[str] = None
    YOUTUBE_CHANNEL_ID: Optional[str] = None

    # Reddit
    REDDIT_CLIENT_ID: Optional[str] = None
    REDDIT_CLIENT_SECRET: Optional[str] = None
    REDDIT_USERNAME: Optional[str] = None
    REDDIT_PASSWORD: Optional[str] = None

    # Threads
    THREADS_ACCESS_TOKEN: Optional[str] = None

    # Tumblr
    TUMBLR_API_KEY: Optional[str] = None
    TUMBLR_API_SECRET: Optional[str] = None
    TUMBLR_BLOG_NAME: Optional[str] = None

    # Medium
    MEDIUM_ACCESS_TOKEN: Optional[str] = None

    # Mastodon
    MASTODON_ACCESS_TOKEN: Optional[str] = None
    MASTODON_INSTANCE_URL: Optional[str] = None

    # Discord
    DISCORD_BOT_TOKEN: Optional[str] = None
    DISCORD_CHANNEL_ID: Optional[str] = None

    # Telegram
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_CHANNEL_ID: Optional[str] = None

    # WhatsApp Business
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_ID: Optional[str] = None

    # Snapchat
    SNAPCHAT_ACCESS_TOKEN: Optional[str] = None

    # Bluesky
    BLUESKY_HANDLE: Optional[str] = None
    BLUESKY_APP_PASSWORD: Optional[str] = None

    # WordPress
    WORDPRESS_URL: Optional[str] = None
    WORDPRESS_USERNAME: Optional[str] = None
    WORDPRESS_APP_PASSWORD: Optional[str] = None

    # Blogger
    BLOGGER_API_KEY: Optional[str] = None
    BLOGGER_BLOG_ID: Optional[str] = None

    # Mix
    MIX_ACCESS_TOKEN: Optional[str] = None

    # Quora
    QUORA_ACCESS_TOKEN: Optional[str] = None

    # VK
    VK_ACCESS_TOKEN: Optional[str] = None
    VK_GROUP_ID: Optional[str] = None

    # Weibo
    WEIBO_ACCESS_TOKEN: Optional[str] = None

    # LINE
    LINE_CHANNEL_TOKEN: Optional[str] = None

    # KakaoTalk
    KAKAO_ACCESS_TOKEN: Optional[str] = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()


# Platform registry with metadata
PLATFORM_REGISTRY = {
    "facebook": {
        "name": "Facebook",
        "max_chars": 63206,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 30,
        "best_posting_times": ["09:00", "13:00", "16:00"],
    },
    "instagram": {
        "name": "Instagram",
        "max_chars": 2200,
        "supports_images": True,
        "supports_video": True,
        "supports_links": False,
        "hashtag_limit": 30,
        "best_posting_times": ["11:00", "14:00", "17:00"],
    },
    "twitter": {
        "name": "X/Twitter",
        "max_chars": 280,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 5,
        "best_posting_times": ["08:00", "12:00", "17:00"],
    },
    "linkedin": {
        "name": "LinkedIn",
        "max_chars": 3000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 5,
        "best_posting_times": ["07:30", "12:00", "17:30"],
    },
    "tiktok": {
        "name": "TikTok",
        "max_chars": 2200,
        "supports_images": False,
        "supports_video": True,
        "supports_links": False,
        "hashtag_limit": 10,
        "best_posting_times": ["07:00", "12:00", "19:00"],
    },
    "pinterest": {
        "name": "Pinterest",
        "max_chars": 500,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 20,
        "best_posting_times": ["14:00", "20:00", "21:00"],
    },
    "youtube": {
        "name": "YouTube",
        "max_chars": 5000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 15,
        "best_posting_times": ["12:00", "15:00", "18:00"],
    },
    "reddit": {
        "name": "Reddit",
        "max_chars": 40000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 0,
        "best_posting_times": ["06:00", "08:00", "12:00"],
    },
    "threads": {
        "name": "Threads",
        "max_chars": 500,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 10,
        "best_posting_times": ["08:00", "12:00", "18:00"],
    },
    "tumblr": {
        "name": "Tumblr",
        "max_chars": 4096,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 30,
        "best_posting_times": ["19:00", "22:00", "23:00"],
    },
    "medium": {
        "name": "Medium",
        "max_chars": 100000,
        "supports_images": True,
        "supports_video": False,
        "supports_links": True,
        "hashtag_limit": 5,
        "best_posting_times": ["07:00", "10:00", "20:00"],
    },
    "mastodon": {
        "name": "Mastodon",
        "max_chars": 500,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 10,
        "best_posting_times": ["09:00", "12:00", "18:00"],
    },
    "discord": {
        "name": "Discord",
        "max_chars": 2000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 0,
        "best_posting_times": ["15:00", "19:00", "21:00"],
    },
    "telegram": {
        "name": "Telegram",
        "max_chars": 4096,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 10,
        "best_posting_times": ["09:00", "12:00", "18:00"],
    },
    "whatsapp": {
        "name": "WhatsApp Business",
        "max_chars": 4096,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 0,
        "best_posting_times": ["08:00", "12:00", "18:00"],
    },
    "snapchat": {
        "name": "Snapchat",
        "max_chars": 250,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 0,
        "best_posting_times": ["10:00", "13:00", "22:00"],
    },
    "bluesky": {
        "name": "Bluesky",
        "max_chars": 300,
        "supports_images": True,
        "supports_video": False,
        "supports_links": True,
        "hashtag_limit": 5,
        "best_posting_times": ["08:00", "12:00", "17:00"],
    },
    "wordpress": {
        "name": "WordPress",
        "max_chars": 100000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 15,
        "best_posting_times": ["07:00", "11:00", "16:00"],
    },
    "blogger": {
        "name": "Blogger",
        "max_chars": 100000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 10,
        "best_posting_times": ["09:00", "14:00", "19:00"],
    },
    "mix": {
        "name": "Mix",
        "max_chars": 500,
        "supports_images": True,
        "supports_video": False,
        "supports_links": True,
        "hashtag_limit": 10,
        "best_posting_times": ["10:00", "14:00", "20:00"],
    },
    "quora": {
        "name": "Quora",
        "max_chars": 10000,
        "supports_images": True,
        "supports_video": False,
        "supports_links": True,
        "hashtag_limit": 5,
        "best_posting_times": ["09:00", "11:00", "14:00"],
    },
    "vk": {
        "name": "VK",
        "max_chars": 15895,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 10,
        "best_posting_times": ["09:00", "13:00", "19:00"],
    },
    "weibo": {
        "name": "Weibo",
        "max_chars": 2000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 5,
        "best_posting_times": ["08:00", "12:00", "21:00"],
    },
    "line": {
        "name": "LINE",
        "max_chars": 5000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 0,
        "best_posting_times": ["08:00", "12:00", "20:00"],
    },
    "kakao": {
        "name": "KakaoTalk",
        "max_chars": 2000,
        "supports_images": True,
        "supports_video": True,
        "supports_links": True,
        "hashtag_limit": 0,
        "best_posting_times": ["09:00", "12:00", "18:00"],
    },
}
