"""
Q-Empire Social Autopilot - Content Optimizer
Applies platform-specific optimization rules to generated content.
Ensures each post is perfectly tailored for its target platform.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from loguru import logger

from app.core.config import PLATFORM_REGISTRY


@dataclass
class OptimizationResult:
    """Result of content optimization for a platform."""
    original_content: str
    optimized_content: str
    hashtags: List[str]
    media_suggestions: List[str]
    character_count: int
    is_within_limit: bool
    optimization_notes: List[str]
    engagement_score: float


class ContentOptimizer:
    """
    Optimizes AI-generated content for each specific platform.
    Applies character limits, formatting rules, hashtag strategies,
    and engagement optimization techniques.
    """

    # Platform-specific formatting rules
    PLATFORM_RULES = {
        "twitter": {
            "style": "concise",
            "emoji_density": "low",
            "line_breaks": False,
            "thread_threshold": 280,
            "tips": ["Use threads for longer content", "Quote tweets drive engagement"],
        },
        "instagram": {
            "style": "visual_storytelling",
            "emoji_density": "high",
            "line_breaks": True,
            "tips": ["Front-load the hook", "Use line breaks for readability", "CTA in first 125 chars"],
        },
        "linkedin": {
            "style": "professional",
            "emoji_density": "minimal",
            "line_breaks": True,
            "tips": ["Start with a hook line", "Use data/stats", "Professional tone"],
        },
        "facebook": {
            "style": "conversational",
            "emoji_density": "medium",
            "line_breaks": True,
            "tips": ["Ask questions", "Use storytelling", "Tag relevant pages"],
        },
        "tiktok": {
            "style": "trendy",
            "emoji_density": "high",
            "line_breaks": False,
            "tips": ["Use trending sounds reference", "Hook in first 3 seconds", "Gen-Z language OK"],
        },
        "pinterest": {
            "style": "descriptive",
            "emoji_density": "low",
            "line_breaks": False,
            "tips": ["SEO-rich descriptions", "Include keywords naturally", "Actionable language"],
        },
        "youtube": {
            "style": "seo_optimized",
            "emoji_density": "medium",
            "line_breaks": True,
            "tips": ["SEO title", "Timestamps", "Subscribe CTA"],
        },
        "reddit": {
            "style": "authentic",
            "emoji_density": "none",
            "line_breaks": True,
            "tips": ["No self-promotion feel", "Add value first", "Match subreddit tone"],
        },
        "medium": {
            "style": "longform",
            "emoji_density": "none",
            "line_breaks": True,
            "tips": ["Strong headline", "Subheadings", "Data-driven"],
        },
        "threads": {
            "style": "casual",
            "emoji_density": "medium",
            "line_breaks": False,
            "tips": ["Conversational", "Hot takes work", "Reply-bait"],
        },
        "mastodon": {
            "style": "community",
            "emoji_density": "low",
            "line_breaks": False,
            "tips": ["Use CW for sensitive topics", "Alt text for images", "Boost-worthy"],
        },
        "discord": {
            "style": "community",
            "emoji_density": "high",
            "line_breaks": True,
            "tips": ["Use embeds", "Ping sparingly", "Channel-appropriate"],
        },
        "telegram": {
            "style": "informative",
            "emoji_density": "medium",
            "line_breaks": True,
            "tips": ["Bold key points", "Use formatting", "Link previews"],
        },
        "bluesky": {
            "style": "concise",
            "emoji_density": "low",
            "line_breaks": False,
            "tips": ["Similar to early Twitter", "Authentic voice", "Community-first"],
        },
    }

    def optimize(
        self,
        content: str,
        platform: str,
        hashtags: List[str] = None,
        brand_profile: Dict = None,
    ) -> OptimizationResult:
        """
        Optimize content for a specific platform.

        Args:
            content: Raw generated content
            platform: Target platform name
            hashtags: List of hashtags to include
            brand_profile: Brand data for context

        Returns:
            OptimizationResult with optimized content
        """
        platform_config = PLATFORM_REGISTRY.get(platform, {})
        rules = self.PLATFORM_RULES.get(platform, {})
        max_chars = platform_config.get("max_chars", 5000)
        hashtag_limit = platform_config.get("hashtag_limit", 5)

        notes = []
        optimized = content

        # Step 1: Apply formatting rules
        optimized = self._apply_formatting(optimized, platform, rules)
        notes.append(f"Applied {platform} formatting rules")

        # Step 2: Optimize length
        if len(optimized) > max_chars:
            optimized = self._truncate_intelligently(optimized, max_chars)
            notes.append(f"Truncated to {max_chars} chars")

        # Step 3: Optimize hashtags
        if hashtags:
            hashtags = hashtags[:hashtag_limit]
            if platform in ["instagram", "facebook", "tiktok"]:
                # Append hashtags at the end
                hashtag_str = " ".join(hashtags)
                if len(optimized) + len(hashtag_str) + 2 <= max_chars:
                    optimized = f"{optimized}\n\n{hashtag_str}"
            elif platform in ["twitter", "threads", "bluesky"]:
                # Inline hashtags or append if space
                hashtag_str = " ".join(hashtags[:3])
                if len(optimized) + len(hashtag_str) + 1 <= max_chars:
                    optimized = f"{optimized} {hashtag_str}"

        # Step 4: Add engagement hooks
        optimized = self._add_engagement_hooks(optimized, platform, rules)

        # Step 5: Calculate engagement score
        score = self._calculate_engagement_score(optimized, platform)

        # Step 6: Generate media suggestions
        media_suggestions = self._suggest_media(platform, platform_config, brand_profile)

        return OptimizationResult(
            original_content=content,
            optimized_content=optimized,
            hashtags=hashtags or [],
            media_suggestions=media_suggestions,
            character_count=len(optimized),
            is_within_limit=len(optimized) <= max_chars,
            optimization_notes=notes,
            engagement_score=score,
        )

    def _apply_formatting(self, content: str, platform: str, rules: Dict) -> str:
        """Apply platform-specific formatting."""
        style = rules.get("style", "general")

        if style == "concise":
            # Remove unnecessary words for short-form platforms
            content = content.replace("In order to ", "To ")
            content = content.replace("It is important to note that ", "")
            content = content.replace("As a matter of fact, ", "")

        elif style == "visual_storytelling":
            # Add line breaks for Instagram readability
            sentences = content.split(". ")
            if len(sentences) > 2:
                content = ".\n\n".join(sentences[:2]) + ".\n\n" + ". ".join(sentences[2:])

        elif style == "professional":
            # LinkedIn: clean, structured
            if not content.startswith(("🔑", "💡", "📊", "🚀")):
                content = f"💡 {content}"

        elif style == "longform":
            # Medium: add structure
            lines = content.split("\n")
            if len(lines) < 3 and len(content) > 200:
                mid = len(content) // 2
                break_point = content.find(". ", mid)
                if break_point > 0:
                    content = content[:break_point + 1] + "\n\n" + content[break_point + 2:]

        return content

    def _truncate_intelligently(self, content: str, max_chars: int) -> str:
        """Truncate content at a natural break point."""
        if len(content) <= max_chars:
            return content

        # Try to break at sentence boundary
        truncated = content[:max_chars - 3]
        last_period = truncated.rfind(".")
        last_exclaim = truncated.rfind("!")
        last_question = truncated.rfind("?")

        break_point = max(last_period, last_exclaim, last_question)

        if break_point > max_chars * 0.7:  # Only if we keep 70%+ of content
            return content[:break_point + 1]

        return truncated + "..."

    def _add_engagement_hooks(self, content: str, platform: str, rules: Dict) -> str:
        """Add engagement-boosting elements."""
        # Don't modify if already has engagement elements
        if any(hook in content.lower() for hook in ["?", "comment", "share", "what do you think"]):
            return content

        # Platform-specific hooks
        if platform in ["facebook", "linkedin", "threads"]:
            if not content.endswith("?"):
                hooks = [
                    "\n\nWhat are your thoughts? 👇",
                    "\n\nAgree or disagree? Let me know below.",
                    "\n\nDrop a 🔥 if this resonates.",
                ]
                import random
                content += random.choice(hooks)

        return content

    def _calculate_engagement_score(self, content: str, platform: str) -> float:
        """Calculate predicted engagement score (0-1)."""
        score = 0.5  # Base score

        # Length optimization
        platform_config = PLATFORM_REGISTRY.get(platform, {})
        max_chars = platform_config.get("max_chars", 5000)
        ideal_length = max_chars * 0.6  # 60% of max is often ideal
        length_ratio = min(len(content) / ideal_length, 1.5)
        if 0.4 <= length_ratio <= 1.2:
            score += 0.1

        # Has emoji (engagement boost on most platforms)
        import re
        emoji_pattern = re.compile(
            "[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]"
        )
        if emoji_pattern.search(content):
            score += 0.05

        # Has question (drives comments)
        if "?" in content:
            score += 0.1

        # Has call-to-action
        cta_words = ["click", "visit", "learn", "discover", "try", "get", "join"]
        if any(word in content.lower() for word in cta_words):
            score += 0.1

        # Has hashtags
        if "#" in content:
            score += 0.05

        # Penalize all-caps (looks spammy)
        caps_ratio = sum(1 for c in content if c.isupper()) / max(len(content), 1)
        if caps_ratio > 0.3:
            score -= 0.15

        return min(max(score, 0.1), 1.0)

    def _suggest_media(
        self, platform: str, config: Dict, brand_profile: Dict = None
    ) -> List[str]:
        """Suggest media types for the post."""
        suggestions = []

        if config.get("supports_images"):
            suggestions.append("branded_graphic")
            suggestions.append("product_photo")

        if config.get("supports_video"):
            if platform in ["tiktok", "youtube", "instagram"]:
                suggestions.append("short_video_15s")
            suggestions.append("animated_graphic")

        if platform == "pinterest":
            suggestions.append("infographic_pin")
            suggestions.append("step_by_step_graphic")

        if platform == "instagram":
            suggestions.append("carousel_slides")
            suggestions.append("story_graphic")

        return suggestions[:3]


# Global optimizer instance
content_optimizer = ContentOptimizer()
