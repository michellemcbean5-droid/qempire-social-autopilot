"""Facebook Platform Connector - Posts to Facebook Pages and Profiles."""

from typing import Dict, List, Optional
from loguru import logger
from platforms.base import BasePlatformConnector, PlatformAnalytics


class FacebookConnector(BasePlatformConnector):
    """Connector for Facebook Pages API."""

    def __init__(self, credentials: Dict = None):
        super().__init__("facebook", credentials)
        self.api_base = "https://graph.facebook.com/v19.0"

    async def connect(self, credentials: Dict) -> bool:
        """Connect using Facebook Page Access Token."""
        self.credentials = credentials
        access_token = credentials.get("access_token")
        page_id = credentials.get("page_id")

        if not access_token or not page_id:
            self._last_error = "Missing access_token or page_id"
            return False

        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_base}/{page_id}",
                    params={"access_token": access_token},
                )
                if response.status_code == 200:
                    self._is_connected = True
                    logger.info("✅ Connected to Facebook")
                    return True
                else:
                    self._last_error = f"API error: {response.text}"
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
        """Publish a post to Facebook Page."""
        if not self._is_connected:
            return {"success": False, "error": "Not connected to Facebook"}

        page_id = self.credentials.get("page_id")
        access_token = self.credentials.get("access_token")

        try:
            import httpx
            async with httpx.AsyncClient() as client:
                payload = {"message": content, "access_token": access_token}

                if media:
                    # Photo post
                    payload["url"] = media[0]
                    endpoint = f"{self.api_base}/{page_id}/photos"
                else:
                    endpoint = f"{self.api_base}/{page_id}/feed"

                response = await client.post(endpoint, data=payload)

                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "post_id": data.get("id"),
                        "url": f"https://facebook.com/{data.get('id')}",
                    }
                else:
                    return {"success": False, "error": response.text}

        except Exception as e:
            self._handle_error(e, "publish")
            return {"success": False, "error": str(e)}

    async def get_analytics(self, post_id: str) -> PlatformAnalytics:
        """Get analytics for a Facebook post."""
        try:
            import httpx
            access_token = self.credentials.get("access_token")
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_base}/{post_id}/insights",
                    params={
                        "metric": "post_impressions,post_engaged_users,post_clicks",
                        "access_token": access_token,
                    },
                )
                if response.status_code == 200:
                    data = response.json().get("data", [])
                    return PlatformAnalytics(
                        impressions=self._get_metric(data, "post_impressions"),
                        reach=self._get_metric(data, "post_engaged_users"),
                        clicks=self._get_metric(data, "post_clicks"),
                    )
        except Exception as e:
            self._handle_error(e, "get_analytics")

        return PlatformAnalytics()

    def _get_metric(self, data: list, metric_name: str) -> int:
        for item in data:
            if item.get("name") == metric_name:
                values = item.get("values", [{}])
                return values[0].get("value", 0) if values else 0
        return 0
