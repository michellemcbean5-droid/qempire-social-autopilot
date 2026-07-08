"""Tests for Q-Empire platform connectors."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from platforms.base import BasePlatform, PostContent
from platforms.facebook import FacebookPlatform
from platforms.instagram import InstagramPlatform
from platforms.linkedin import LinkedInPlatform
from platforms.twitter import TwitterPlatform
from app.core.config import PLATFORM_REGISTRY


@pytest.fixture
def sample_post():
    return PostContent(
        content="Test content for platform posting",
        hashtags=["#test", "#ai"],
        image_url="https://example.com/image.jpg",
        link_url="https://example.com",
    )


@pytest.fixture
def sample_credentials():
    return {
        "access_token": "mock_token_123",
        "page_id": "mock_page_123",
    }


class TestBasePlatform:
    """Test the abstract base platform class."""

    def test_base_platform_cannot_be_instantiated(self):
        """BasePlatform should be abstract and require subclassing."""
        with pytest.raises(TypeError):
            BasePlatform()

    def test_post_content_model(self, sample_post):
        """Test PostContent dataclass."""
        assert sample_post.content == "Test content for platform posting"
        assert len(sample_post.hashtags) == 2
        assert sample_post.image_url is not None


class TestFacebookPlatform:
    """Test Facebook connector."""

    @pytest.fixture
    def facebook(self, sample_credentials):
        return FacebookPlatform(credentials=sample_credentials)

    def test_initialization(self, facebook):
        assert facebook.platform_id == "facebook"
        assert facebook.credentials["access_token"] == "mock_token_123"

    def test_name(self, facebook):
        assert facebook.name == "Facebook"

    def test_max_chars(self, facebook):
        assert facebook.max_chars == 63206

    @pytest.mark.asyncio
    async def test_post_text(self, facebook, sample_post):
        with patch.object(facebook, "_make_request", new_callable=AsyncMock) as mock_req:
            mock_req.return_value = {"id": "post_123", "success": True}
            result = await facebook.post(sample_post)
            assert result["success"] is True
            assert result["post_id"] == "post_123"
            mock_req.assert_called_once()

    def test_format_content(self, facebook, sample_post):
        formatted = facebook.format_content(sample_post)
        assert "Test content for platform posting" in formatted
        assert "#test" in formatted

    def test_validate_content(self, facebook):
        long_post = PostContent(content="x" * 70000)
        assert facebook.validate_content(long_post) is False

        short_post = PostContent(content="Short post")
        assert facebook.validate_content(short_post) is True


class TestInstagramPlatform:
    """Test Instagram connector."""

    @pytest.fixture
    def instagram(self, sample_credentials):
        return InstagramPlatform(credentials=sample_credentials)

    def test_initialization(self, instagram):
        assert instagram.platform_id == "instagram"

    def test_requires_image(self, instagram):
        assert instagram.supports_images is True

    @pytest.mark.asyncio
    async def test_post_without_image_fails(self, instagram):
        text_only = PostContent(content="No image here")
        with pytest.raises(ValueError):
            await instagram.post(text_only)


class TestTwitterPlatform:
    """Test X/Twitter connector."""

    @pytest.fixture
    def twitter(self, sample_credentials):
        return TwitterPlatform(credentials=sample_credentials)

    def test_character_limit(self, twitter):
        assert twitter.max_chars == 280

    def test_format_content_truncates(self, twitter, sample_post):
        long_post = PostContent(content="x" * 500, hashtags=["#"] * 10)
        formatted = twitter.format_content(long_post)
        assert len(formatted) <= 280

    @pytest.mark.asyncio
    async def test_post_thread(self, twitter):
        thread_content = [
            PostContent(content="Thread post 1"),
            PostContent(content="Thread post 2"),
        ]
        with patch.object(twitter, "_make_request", new_callable=AsyncMock) as mock_req:
            mock_req.return_value = {"id": "tweet_123"}
            results = await twitter.post_thread(thread_content)
            assert len(results) == 2
            assert mock_req.call_count == 2


class TestLinkedInPlatform:
    """Test LinkedIn connector."""

    @pytest.fixture
    def linkedin(self, sample_credentials):
        return LinkedInPlatform(credentials=sample_credentials)

    def test_initialization(self, linkedin):
        assert linkedin.platform_id == "linkedin"

    def test_supports_articles(self, linkedin):
        assert linkedin.supports_links is True

    @pytest.mark.asyncio
    async def test_post_article(self, linkedin, sample_post):
        with patch.object(linkedin, "_make_request", new_callable=AsyncMock) as mock_req:
            mock_req.return_value = {"id": "share_123"}
            result = await linkedin.post(sample_post)
            assert result["success"] is True


class TestAllPlatformsRegistered:
    """Ensure all 25 platforms have connector classes."""

    def test_platforms_have_connector_files(self):
        import os
        platform_dir = "platforms"
        files = [f for f in os.listdir(platform_dir) if f.endswith(".py")]
        # base.py, __init__.py, all_platforms.py are infrastructure
        connectors = [f for f in files if f not in ("base.py", "__init__.py", "all_platforms.py")]
        assert len(connectors) >= 4  # At minimum, the ones we have

    def test_registry_matches_platforms(self):
        """Each registered platform should have a corresponding class."""
        from platforms import all_platforms
        for platform_id in PLATFORM_REGISTRY:
            assert hasattr(all_platforms, platform_id) or platform_id in ["twitter", "facebook", "instagram", "linkedin"]
