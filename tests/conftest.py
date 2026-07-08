"""Shared pytest fixtures for Q-Empire Social Autopilot."""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def sample_brand_profile():
    """Standard brand profile for testing."""
    return {
        "brand_name": "Q-Empire AI",
        "description": "AI-powered automation solutions for businesses",
        "keywords": ["AI", "automation", "business", "growth", "marketing"],
        "tone": "professional",
        "products_services": ["AI Chatbots", "Marketing Automation", "Social Media Management"],
        "target_audience": "Small business owners",
        "content_themes": ["technology", "marketing", "ai_automation"],
    }


@pytest.fixture
def sample_platform_credentials():
    """Mock credentials for platform testing."""
    return {
        "facebook": {"access_token": "fb_token", "page_id": "123"},
        "instagram": {"access_token": "ig_token", "business_id": "456"},
        "twitter": {"api_key": "tw_key", "api_secret": "tw_secret"},
        "linkedin": {"access_token": "li_token", "organization_id": "789"},
    }


@pytest.fixture(autouse=True)
def clear_app_state():
    """Reset app state between tests."""
    from app.main import app_state
    app_state["user_brand_profile"] = None
    app_state["connected_platforms"] = []
    app_state["autopilot_enabled"] = False
    app_state["autopilot_config"] = None
    yield
    app_state["user_brand_profile"] = None
    app_state["connected_platforms"] = []
    app_state["autopilot_enabled"] = False
    app_state["autopilot_config"] = None
