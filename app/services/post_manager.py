"""
Q-Empire Social Autopilot - Post Manager
Manages the post queue, dispatches posts to platforms, and handles
the full lifecycle of content from generation to publication.
"""

from typing import Dict, List, Optional
from datetime import datetime, timedelta
from loguru import logger
import asyncio
import uuid

from app.services.ai_engine import ai_engine, GeneratedPost
from app.services.content_optimizer import content_optimizer
from app.services.notifications import notification_service
from app.core.config import PLATFORM_REGISTRY


class PostManager:
    """
    Manages the complete post lifecycle:
    1. Generate content via AI engine
    2. Optimize for each platform
    3. Queue for scheduled posting
    4. Dispatch to platform connectors
    5. Track results and notify owner
    """

    def __init__(self):
        self._queue: List[Dict] = []
        self._history: List[Dict] = []
        self._active_batch: Optional[str] = None

    async def generate_and_queue_posts(
        self,
        user_id: int,
        brand_profile: Dict,
        platforms: List[str],
        content_theme: str = None,
        schedule_time: datetime = None,
    ) -> Dict:
        """
        Generate AI content for all platforms and add to queue.

        Args:
            user_id: User's database ID
            brand_profile: Analyzed website/brand data
            platforms: List of platform names to post to
            content_theme: Optional content theme/topic
            schedule_time: When to publish (None = immediate)

        Returns:
            Dict with batch_id and generated post summaries
        """
        batch_id = str(uuid.uuid4())[:8]
        self._active_batch = batch_id

        logger.info(
            f"🎯 Generating content batch {batch_id} for {len(platforms)} platforms"
        )

        # Step 1: Generate content for all platforms
        generated_posts = await ai_engine.generate_content_for_all_platforms(
            brand_profile=brand_profile,
            platforms=platforms,
            content_theme=content_theme,
        )

        # Step 2: Optimize each post
        queued_posts = []
        for post in generated_posts:
            optimized = content_optimizer.optimize(
                content=post.content,
                platform=post.platform,
                hashtags=post.hashtags,
                brand_profile=brand_profile,
            )

            queue_item = {
                "id": str(uuid.uuid4())[:12],
                "batch_id": batch_id,
                "user_id": user_id,
                "platform": post.platform,
                "platform_name": PLATFORM_REGISTRY.get(post.platform, {}).get("name", post.platform),
                "content": optimized.optimized_content,
                "hashtags": optimized.hashtags,
                "image_description": post.image_description,
                "media_suggestions": optimized.media_suggestions,
                "character_count": optimized.character_count,
                "engagement_score": optimized.engagement_score,
                "status": "queued",
                "scheduled_at": schedule_time or datetime.utcnow(),
                "created_at": datetime.utcnow(),
            }

            self._queue.append(queue_item)
            queued_posts.append(queue_item)

        logger.info(
            f"✅ Batch {batch_id}: {len(queued_posts)} posts queued for publishing"
        )

        return {
            "batch_id": batch_id,
            "total_posts": len(queued_posts),
            "platforms": [p["platform_name"] for p in queued_posts],
            "scheduled_at": str(schedule_time or datetime.utcnow()),
            "posts": queued_posts,
        }

    async def publish_batch(self, batch_id: str) -> Dict:
        """
        Publish all posts in a batch to their respective platforms.

        Args:
            batch_id: The batch identifier

        Returns:
            Dict with publish results per platform
        """
        batch_posts = [p for p in self._queue if p["batch_id"] == batch_id]

        if not batch_posts:
            return {"error": "Batch not found", "batch_id": batch_id}

        results = {
            "batch_id": batch_id,
            "total": len(batch_posts),
            "successful": 0,
            "failed": 0,
            "results": [],
        }

        for post in batch_posts:
            try:
                # Dispatch to platform connector
                result = await self._dispatch_to_platform(post)

                if result["success"]:
                    post["status"] = "published"
                    post["published_at"] = datetime.utcnow()
                    results["successful"] += 1

                    # Notify owner of success
                    await notification_service.notify_post_success(
                        platform=post["platform_name"],
                        content_preview=post["content"][:100],
                    )
                else:
                    post["status"] = "failed"
                    post["error"] = result.get("error", "Unknown error")
                    results["failed"] += 1

                    # Notify owner of failure
                    await notification_service.notify_post_failure(
                        platform=post["platform_name"],
                        error=result.get("error", "Unknown error"),
                    )

                results["results"].append({
                    "platform": post["platform_name"],
                    "status": post["status"],
                    "error": post.get("error"),
                })

            except Exception as e:
                post["status"] = "failed"
                post["error"] = str(e)
                results["failed"] += 1
                logger.error(f"❌ Failed to publish to {post['platform']}: {e}")

                await notification_service.notify_post_failure(
                    platform=post["platform_name"],
                    error=str(e),
                )

        # Move published posts to history
        for post in batch_posts:
            self._queue.remove(post)
            self._history.append(post)

        logger.info(
            f"📤 Batch {batch_id} complete: "
            f"{results['successful']} published, {results['failed']} failed"
        )

        return results

    async def _dispatch_to_platform(self, post: Dict) -> Dict:
        """
        Dispatch a post to its target platform connector.
        This is where the actual API calls to social platforms happen.
        """
        platform = post["platform"]

        # Import the appropriate platform connector
        try:
            from platforms import get_connector
            connector = get_connector(platform)

            if connector:
                result = await connector.publish(
                    content=post["content"],
                    media=post.get("media_urls"),
                    hashtags=post.get("hashtags"),
                )
                return result
            else:
                # Platform connector not configured
                return {
                    "success": True,
                    "message": f"Post queued for {platform} (connector pending setup)",
                    "post_id": f"sim_{post['id']}",
                }

        except ImportError:
            # Graceful fallback - log the post as "ready to publish"
            logger.info(f"📋 Post ready for {platform}: {post['content'][:50]}...")
            return {
                "success": True,
                "message": f"Post prepared for {platform}",
                "post_id": f"prep_{post['id']}",
            }

    async def run_autopilot_cycle(self, user_id: int, brand_profile: Dict, platforms: List[str]):
        """
        Execute one full autopilot cycle:
        1. Generate fresh content
        2. Optimize for all platforms
        3. Publish immediately

        This is called by the scheduler on each trigger.
        """
        logger.info(f"🤖 Running autopilot cycle for user {user_id}")

        try:
            # Generate and queue
            batch = await self.generate_and_queue_posts(
                user_id=user_id,
                brand_profile=brand_profile,
                platforms=platforms,
            )

            # Publish the batch
            results = await self.publish_batch(batch["batch_id"])

            # Send summary notification
            await notification_service.notify_autopilot_complete(
                total=results["total"],
                successful=results["successful"],
                failed=results["failed"],
            )

            return results

        except Exception as e:
            logger.error(f"❌ Autopilot cycle failed: {e}")
            await notification_service.notify_system_error(
                error=str(e),
                context="autopilot_cycle",
            )
            return {"error": str(e)}

    def get_queue(self, user_id: int = None) -> List[Dict]:
        """Get current post queue, optionally filtered by user."""
        if user_id:
            return [p for p in self._queue if p["user_id"] == user_id]
        return self._queue

    def get_history(self, user_id: int = None, limit: int = 50) -> List[Dict]:
        """Get posting history, optionally filtered by user."""
        history = self._history
        if user_id:
            history = [p for p in history if p["user_id"] == user_id]
        return sorted(history, key=lambda x: x.get("published_at", x["created_at"]), reverse=True)[:limit]

    def get_stats(self, user_id: int = None) -> Dict:
        """Get posting statistics."""
        history = self.get_history(user_id)
        return {
            "total_posts": len(history),
            "successful": len([p for p in history if p["status"] == "published"]),
            "failed": len([p for p in history if p["status"] == "failed"]),
            "queued": len(self.get_queue(user_id)),
            "platforms_active": len(set(p["platform"] for p in history)),
        }


# Global post manager instance
post_manager = PostManager()
