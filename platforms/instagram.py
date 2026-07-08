"""Instagram Platform Connector - Posts images, carousels, and reels."""

from typing import Dict, List, Optional
from loguru import logger
from platforms.base import BasePlatformConnector, PlatformAnalytics


class InstagramConnector(BasePlatformConnector):
    """Connector for Instagram Graph API (Business/Creator accounts)."""

    def __init__(self, credentials: Dict = None):
        super().__init__("instagram", credentials)
        self.api_base = "https://graph.facebook.com/v19.0"

    async def connect(self, credentials: Dict) -> bool:
        self.credentials = credentials
        access_token = credentials.get("access_token")
        business_id = credentials.get("business_id")
        if not access_token or not business_id:
            self._last_error = "Missing access_token or business_id"
            return False
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.api_base}/{business_id}",
                    params={"access_token": access_token, "fields": "id,username"},
                )
                self._is_connected = response.status_code == 200
                return self._is_connected
        except Exception as e:
            self._handle_error(e, "connect")
            return False

    async def publish(self, content: str, media: Optional[List[str]] = None, hashtags: Optional[List[str]] = None, **kwargs) -> Dict:
        if not self._is_connected:
            return {"success": False, "error": "Not connected"}
        business_id = self.credentials.get("business_id")
        access_token = self.credentials.get("access_token")
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                # Step 1: Create media container
                container_data = {"caption": content, "access_token": access_token}
                if media:
                    container_data["image_url"] = media[0]
                response = await client.post(f"{self.api_base}/{business_id}/media", data=container_data)
                if response.status_code == 200:
                    container_id = response.json().get("id")
                    # Step 2: Publish container
                    pub_response = await client.post(
                        f"{self.api_base}/{business_id}/media_publish",
                        data={"creation_id": container_id, "access_token": access_token},
                    )
                    if pub_response.status_code == 200:
                        post_id = pub_response.json().get("id")
                        return {"success": True, "post_id": post_id, "url": f"https://instagram.com/p/{post_id}"}
                return {"success": False, "error": response.text}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_analytics(self, post_id: str) -> PlatformAnalytics:
        return PlatformAnalytics()
