"""Tests for Q-Empire AI Content Generation Engine."""

import pytest
import asyncio
from app.services.ai_engine import QEmpireAIEngine, GeneratedPost
from app.core.config import PLATFORM_REGISTRY


@pytest.fixture
def ai_engine():
    return QEmpireAIEngine()


@pytest.fixture
def sample_brand_profile():
    return {
        "brand_name": "Q-Empire AI",
        "description": "AI-powered automation solutions for businesses",
        "keywords": ["AI", "automation", "business", "growth", "marketing"],
        "tone": "professional",
        "products_services": ["AI Chatbots", "Marketing Automation", "Social Media Management"],
        "target_audience": "Small business owners",
        "content_themes": ["technology", "marketing", "ai_automation"],
    }


class TestAIEngine:
    """Test suite for the AI content generation engine."""

    def test_engine_initialization(self, ai_engine):
        """Test that the AI engine initializes correctly."""
        assert ai_engine is not None
        assert ai_engine.model_id == "qempire/social-autopilot-ai"

    def test_platform_registry_has_25_platforms(self):
        """Test that all 25 platforms are registered."""
        assert len(PLATFORM_REGISTRY) == 25

    def test_all_platforms_have_required_fields(self):
        """Test that each platform has all required configuration fields."""
        required_fields = [
            "name", "max_chars", "supports_images",
            "supports_video", "supports_links", "hashtag_limit",
            "best_posting_times",
        ]
        for platform_id, config in PLATFORM_REGISTRY.items():
            for field in required_fields:
                assert field in config, f"{platform_id} missing field: {field}"

    @pytest.mark.asyncio
    async def test_generate_content_for_single_platform(self, ai_engine, sample_brand_profile):
        """Test content generation for a single platform."""
        posts = await ai_engine.generate_content_for_all_platforms(
            brand_profile=sample_brand_profile,
            platforms=["twitter"],
        )
        assert len(posts) == 1
        assert posts[0].platform == "twitter"
        assert len(posts[0].content) <= 280  # Twitter limit
        assert isinstance(posts[0].hashtags, list)

    @pytest.mark.asyncio
    async def test_generate_content_for_multiple_platforms(self, ai_engine, sample_brand_profile):
        """Test content generation for multiple platforms."""
        platforms = ["twitter", "instagram", "linkedin", "facebook"]
        posts = await ai_engine.generate_content_for_all_platforms(
            brand_profile=sample_brand_profile,
            platforms=platforms,
        )
        assert len(posts) == 4
        # Each post should be for a different platform
        post_platforms = [p.platform for p in posts]
        assert set(post_platforms) == set(platforms)

    @pytest.mark.asyncio
    async def test_content_respects_character_limits(self, ai_engine, sample_brand_profile):
        """Test that generated content respects platform character limits."""
        for platform_id, config in list(PLATFORM_REGISTRY.items())[:5]:
            posts = await ai_engine.generate_content_for_all_platforms(
                brand_profile=sample_brand_profile,
                platforms=[platform_id],
            )
            if posts:
                assert len(posts[0].content) <= config["max_chars"], \
                    f"{platform_id} content exceeds {config['max_chars']} chars"

    def test_hashtag_generation(self, ai_engine, sample_brand_profile):
        """Test hashtag generation respects platform limits."""
        hashtags = ai_engine._generate_hashtags(sample_brand_profile, "instagram", 30)
        assert len(hashtags) <= 30
        assert all(h.startswith("#") for h in hashtags)

        # Reddit should have no hashtags
        hashtags_reddit = ai_engine._generate_hashtags(sample_brand_profile, "reddit", 0)
        assert len(hashtags_reddit) == 0

    def test_image_description_generation(self, ai_engine, sample_brand_profile):
        """Test AI image description generation."""
        desc = ai_engine._generate_image_description(
            sample_brand_profile, "instagram", "Test content"
        )
        assert len(desc) > 0
        assert "Q-Empire AI" in desc

    def test_fallback_post_creation(self, ai_engine, sample_brand_profile):
        """Test fallback post when generation fails."""
        post = ai_engine._create_fallback_post("twitter", sample_brand_profile)
        assert post.platform == "twitter"
        assert len(post.content) > 0
        assert post.confidence_score == 0.5
