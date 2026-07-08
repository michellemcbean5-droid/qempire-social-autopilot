"""LinkedIn Platform Connector - Posts articles and updates."""

from typing import Dict, List, Optional
from platforms.base import BasePlatformConnector, PlatformAnalytics


class LinkedInConnector(BasePlatformConnector):
    def __init__(self, credentials: Dict = None):
        super().__init__("linkedin", credentials)
        self.api_base = "https://api.linkedin.com/v2"

    async def connect(self, credentials: Dict) -> bool:
        self.credentials = credentials
        self._is_connected = bool(credentials.get("access_token"))
        return self._is_connected

    async def publish(self, content: str, media: Optional[List[str]] = None, hashtags: Optional[List[str]] = None, **kwargs) -> Dict:
        if not self._is_connected:
            return {"success": False, "error": "Not connected"}
        try:
            import httpx
            access_token = self.credentials.get("access_token")
            org_id = self.credentials.get("organization_id", "")
            author = f"urn:li:organization:{org_id}" if org_id else "urn:li:person:me"
            payload = {
                "author": author,
                "lifecycleState": "PUBLISHED",
                "specificContent": {
                    "com.linkedin.ugc.ShareContent": {
                        "shareCommentary": {"text": content},
                        "shareMediaCategory": "NONE",
                    }
                },
                "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_base}/ugcPosts",
                    headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
                    json=payload,
                )
                if response.status_code in [200, 201]:
                    return {"success": True, "post_id": response.json().get("id", ""), "url": "https://linkedin.com"}
                return {"success": False, "error": response.text}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def get_analytics(self, post_id: str) -> PlatformAnalytics:
        return PlatformAnalytics()
