"""
Q-Empire Social Autopilot - Base Platform Connector
Abstract base class that all 25 platform connectors inherit from.
Provides unified interface for authentication, posting, and analytics.
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
from loguru import logger


@dataclass
class PostResult:
    """Result of a platform post attempt."""
    success: bool
    post_id: Optional[str] = None
    url: Optional[str] = None
    error: Optional[str] = None
    platform: str = ""
    timestamp: str = ""


@dataclass
class PlatformAnalytics:
    """Analytics data from a platform."""
    impressions: int = 0
    reach: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    clicks: int = 0
    engagement_rate: float = 0.0


class BasePlatformConnector(ABC):
    """
    Base class for all social media platform connectors.
    Each platform implements this interface to provide:
    - Authentication/connection
    - Content publishing
    - Analytics retrieval
    - Health checking
    """

    def __init__(self, platform_name: str, credentials: Dict = None):
        self.platform_name = platform_name
        self.credentials = credentials or {}
        self._is_connected = False
        self._last_error = None
        self._rate_limit_remaining = None

    @property
    def is_connected(self) -> bool:
        return self._is_connected

    @property
    def last_error(self) -> Optional[str]:
        return self._last_error

    @abstractmethod
    async def connect(self, credentials: Dict) -> bool:
        """
        Establish connection to the platform using provided credentials.
        Returns True if connection is successful.
        """
        pass

    @abstractmethod
    async def publish(
        self,
        content: str,
        media: Optional[List[str]] = None,
        hashtags: Optional[List[str]] = None,
        **kwargs,
    ) -> Dict:
        """
        Publish content to the platform.

        Args:
            content: The post text content
            media: Optional list of media URLs
            hashtags: Optional list of hashtags
            **kwargs: Platform-specific parameters

        Returns:
            Dict with 'success', 'post_id', 'url', and optionally 'error'
        """
        pass

    @abstractmethod
    async def get_analytics(self, post_id: str) -> PlatformAnalytics:
        """Retrieve analytics for a specific post."""
        pass

    async def health_check(self) -> Dict:
        """Check if the platform connection is healthy."""
        try:
            is_healthy = await self._verify_connection()
            return {
                "platform": self.platform_name,
                "healthy": is_healthy,
                "connected": self._is_connected,
                "rate_limit_remaining": self._rate_limit_remaining,
                "last_error": self._last_error,
                "checked_at": datetime.utcnow().isoformat(),
            }
        except Exception as e:
            return {
                "platform": self.platform_name,
                "healthy": False,
                "connected": False,
                "error": str(e),
                "checked_at": datetime.utcnow().isoformat(),
            }

    async def _verify_connection(self) -> bool:
        """Verify the connection is still valid. Override in subclasses."""
        return self._is_connected

    async def disconnect(self):
        """Disconnect from the platform."""
        self._is_connected = False
        logger.info(f"Disconnected from {self.platform_name}")

    def _handle_error(self, error: Exception, context: str = ""):
        """Handle and log errors consistently."""
        self._last_error = f"{context}: {str(error)}" if context else str(error)
        logger.error(f"[{self.platform_name}] {self._last_error}")

    def _check_rate_limit(self) -> bool:
        """Check if we're within rate limits."""
        if self._rate_limit_remaining is not None:
            return self._rate_limit_remaining > 0
        return True
