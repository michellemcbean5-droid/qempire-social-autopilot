"""
Q-Empire Social Autopilot - Platform Connectors
Provides unified interface to post content to 25 social media platforms.
"""

from platforms.base import BasePlatformConnector
from typing import Optional


# Platform connector registry
_connectors = {}


def get_connector(platform_name: str) -> Optional[BasePlatformConnector]:
    """Get the connector instance for a platform."""
    return _connectors.get(platform_name)


def register_connector(platform_name: str, connector: BasePlatformConnector):
    """Register a platform connector."""
    _connectors[platform_name] = connector


def get_all_connectors() -> dict:
    """Get all registered connectors."""
    return _connectors


# Supported platforms list
SUPPORTED_PLATFORMS = [
    "facebook",
    "instagram",
    "twitter",
    "linkedin",
    "tiktok",
    "pinterest",
    "youtube",
    "reddit",
    "threads",
    "tumblr",
    "medium",
    "mastodon",
    "discord",
    "telegram",
    "whatsapp",
    "snapchat",
    "bluesky",
    "wordpress",
    "blogger",
    "mix",
    "quora",
    "vk",
    "weibo",
    "line",
    "kakao",
]
