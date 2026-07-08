"""
Q-Empire Social Autopilot - Notification Service
Sends automated notifications to the app owner when:
- Autopilot posts are successfully published
- A platform connection fails
- A posting error occurs
"""

from typing import Optional
from datetime import datetime
from loguru import logger
import json

from app.core.config import settings


class NotificationService:
    """
    Handles all owner notifications for the autopilot system.
    Supports email, webhook, and in-app notification channels.
    """

    def __init__(self):
        self._notifications: list = []
        self._notification_count = 0

    async def notify_post_success(self, platform: str, content_preview: str):
        """Notify owner that a post was successfully published."""
        notification = {
            "id": self._notification_count + 1,
            "type": "success",
            "title": f"✅ Post Published to {platform}",
            "message": f"Your autopilot post was successfully published to {platform}.\n\nPreview: {content_preview}...",
            "platform": platform,
            "timestamp": datetime.utcnow().isoformat(),
            "read": False,
        }
        self._notifications.append(notification)
        self._notification_count += 1
        logger.info(f"📬 Notification: Post published to {platform}")

        # Send via configured channels
        await self._dispatch_notification(notification)

    async def notify_post_failure(self, platform: str, error: str):
        """Notify owner that a post failed to publish."""
        notification = {
            "id": self._notification_count + 1,
            "type": "error",
            "title": f"❌ Posting Failed on {platform}",
            "message": f"Failed to publish to {platform}.\n\nError: {error}\n\nPlease check your platform credentials.",
            "platform": platform,
            "timestamp": datetime.utcnow().isoformat(),
            "read": False,
        }
        self._notifications.append(notification)
        self._notification_count += 1
        logger.error(f"📬 Notification: Post failed on {platform} - {error}")

        await self._dispatch_notification(notification)

    async def notify_connection_failure(self, platform: str, error: str):
        """Notify owner that a platform connection has failed."""
        notification = {
            "id": self._notification_count + 1,
            "type": "warning",
            "title": f"⚠️ Connection Lost: {platform}",
            "message": f"The connection to {platform} has been lost.\n\nError: {error}\n\nPlease reconnect your account.",
            "platform": platform,
            "timestamp": datetime.utcnow().isoformat(),
            "read": False,
        }
        self._notifications.append(notification)
        self._notification_count += 1
        logger.warning(f"📬 Notification: Connection lost to {platform}")

        await self._dispatch_notification(notification)

    async def notify_autopilot_complete(
        self, total: int, successful: int, failed: int
    ):
        """Notify owner that an autopilot cycle completed."""
        status = "✅" if failed == 0 else "⚠️"
        notification = {
            "id": self._notification_count + 1,
            "type": "info",
            "title": f"{status} Autopilot Cycle Complete",
            "message": (
                f"Autopilot posting cycle finished.\n\n"
                f"📊 Results:\n"
                f"  • Total platforms: {total}\n"
                f"  • Successfully posted: {successful}\n"
                f"  • Failed: {failed}\n\n"
                f"{'All posts published successfully!' if failed == 0 else 'Some posts failed. Check the dashboard for details.'}"
            ),
            "timestamp": datetime.utcnow().isoformat(),
            "read": False,
        }
        self._notifications.append(notification)
        self._notification_count += 1
        logger.info(f"📬 Notification: Autopilot cycle complete ({successful}/{total})")

        await self._dispatch_notification(notification)

    async def notify_system_error(self, error: str, context: str = ""):
        """Notify owner of a system-level error."""
        notification = {
            "id": self._notification_count + 1,
            "type": "critical",
            "title": "🚨 System Error",
            "message": f"A system error occurred in the autopilot engine.\n\nContext: {context}\nError: {error}",
            "timestamp": datetime.utcnow().isoformat(),
            "read": False,
        }
        self._notifications.append(notification)
        self._notification_count += 1
        logger.critical(f"📬 Notification: System error - {error}")

        await self._dispatch_notification(notification)

    async def _dispatch_notification(self, notification: Dict):
        """Dispatch notification via configured channels."""

        # Channel 1: Webhook (if configured)
        if settings.NOTIFICATION_WEBHOOK_URL:
            await self._send_webhook(notification)

        # Channel 2: Email (if configured)
        if settings.NOTIFICATION_EMAIL:
            await self._send_email(notification)

    async def _send_webhook(self, notification: Dict):
        """Send notification via webhook."""
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                await client.post(
                    settings.NOTIFICATION_WEBHOOK_URL,
                    json=notification,
                    timeout=10.0,
                )
        except Exception as e:
            logger.error(f"Failed to send webhook notification: {e}")

    async def _send_email(self, notification: Dict):
        """Send notification via email (placeholder for SMTP integration)."""
        # In production, integrate with SendGrid, SES, or SMTP
        logger.info(
            f"📧 Email notification queued to {settings.NOTIFICATION_EMAIL}: "
            f"{notification['title']}"
        )

    def get_notifications(self, limit: int = 50, unread_only: bool = False) -> list:
        """Get recent notifications."""
        notifications = self._notifications
        if unread_only:
            notifications = [n for n in notifications if not n["read"]]
        return sorted(notifications, key=lambda x: x["timestamp"], reverse=True)[:limit]

    def mark_read(self, notification_id: int):
        """Mark a notification as read."""
        for n in self._notifications:
            if n["id"] == notification_id:
                n["read"] = True
                break

    def get_unread_count(self) -> int:
        """Get count of unread notifications."""
        return len([n for n in self._notifications if not n["read"]])


# Global notification service instance
notification_service = NotificationService()
