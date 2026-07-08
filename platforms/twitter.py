"""X/Twitter Platform Connector - Posts tweets and threads."""

from typing import Dict, List, Optional
from loguru import logger
from platforms.base import BasePlatformConnector, PlatformAnalytics


class TwitterConnector(BasePlatformConnector):
    """Connector for X/Twitter API v2."""

    def __init__(self, credentials: Dict = None):
        super().__init__("twitter", credentials)
        self.api_base = "https://api.twitter.com/2"

    async def connect(self, credentials: Dict) -> bool:
        """Connect using Twitter OAuth2 Bearer Token."""
        self.credentials = credentials
        bearer_token = credentials.get("bearer_token") or credentials.get("api_key")

        if not bearer_token:
            self._last_error = "Missing bearer_token or api_key"
            return False

        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_base}/users/me",
                    headers={"Authorization": f"Bearer {bearer_token}"},
                )
                if response.status_code == 200:
                    self._is_connected = True
                    logger.info("✅ Connected to X/Twitter")
                    return True
                else:
                    self._last_error = f"Auth failed: {response.status_code}"
                    return False
        except Exception as e:
            self._handle_error(e, "connect")
            return False

    async def publish(
        self,
        content: str,
        media: Optional[List[str]] = None,
        hashtags: Optional[List[str]] = None,
        **kwargs,
    ) -> Dict:
        """Publish a tweet."""
        if not self._is_connected:
            return {"success": False, "error": "Not connected to X/Twitter"}

        # Ensure within character limit
        if len(content) > 280:
            content = content[:277] + "..."

        try:
            import httpx
            bearer_token = self.credentials.get("bearer_token") or self.credentials.get("api_key")

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_base}/tweets",
                    headers={
                        "Authorization": f"Bearer {bearer_token}",
                        "Content-Type": "application/json",
                    },
                    json={"text": content},
                )

                if response.status_code in [200, 201]:
                    data = response.json().get("data", {})
                    tweet_id = data.get("id")
                    return {
                        "success": True,
                        "post_id": tweet_id,
                        "url": f"https://x.com/i/status/{tweet_id}",
                    }
                else:
                    return {"success": False, "error": response.text}

        except Exception as e:
            self._handle_error(e, "publish")
            return {"success": False, "error": str(e)}

    async def get_analytics(self, post_id: str) -> PlatformAnalytics:
        """Get tweet analytics."""
        try:
            import httpx
            bearer_token = self.credentials.get("bearer_token") or self.credentials.get("api_key")
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_base}/tweets/{post_id}",
                    headers={"Authorization": f"Bearer {bearer_token}"},
                    params={"tweet.fields": "public_metrics"},
                )
                if response.status_code == 200:
                    metrics = response.json().get("data", {}).get("public_metrics", {})
                    return PlatformAnalytics(
                        impressions=metrics.get("impression_count", 0),
                        likes=metrics.get("like_count", 0),
                        comments=metrics.get("reply_count", 0),
                        shares=metrics.get("retweet_count", 0),
                    )
        except Exception as e:
            self._handle_error(e, "get_analytics")

        return PlatformAnalytics()
