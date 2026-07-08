"""
Q-Empire Social Autopilot - AI Content Generation Engine
Powers the autonomous content creation using Hugging Face transformer models.
Generates platform-specific, optimized social media posts from website analysis.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
from loguru import logger
import json
import re

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

try:
    from huggingface_hub import InferenceClient
    HAS_HF_HUB = True
except ImportError:
    HAS_HF_HUB = False

from app.core.config import settings, PLATFORM_REGISTRY

# Q-Empire Client Configuration - Hugging Face Models
QEMPIRE_HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
QEMPIRE_FALLBACK_MODEL = "HuggingFaceH4/zephyr-7b-beta"
QEMPIRE_MODEL_CARD = "Qempireautomation/social-autopilot-ai"
QEMPIRE_SPACE = "Qempireautomation/qempire-social-autopilot"


@dataclass
class GeneratedPost:
    """Represents a single AI-generated post for a specific platform."""
    platform: str
    content: str
    hashtags: List[str]
    image_description: str
    link_text: Optional[str] = None
    call_to_action: str = ""
    confidence_score: float = 0.0
    character_count: int = 0


class QEmpireAIEngine:
    """
    The Q-Empire AI Content Generation Engine.

    This engine analyzes website content and generates unique, platform-optimized
    social media posts for up to 25 different platforms. Each post is tailored
    to the specific platform's requirements, character limits, and best practices.

    Architecture:
    1. Website Analysis → Extract brand voice, keywords, products
    2. Content Strategy → Determine themes, angles, and messaging
    3. Platform Generation → Create unique content per platform
    4. Optimization → Apply platform-specific rules and limits
    5. Quality Scoring → Rate content quality and engagement potential
    """

    def __init__(self):
        self.client = None
        self.model_id = settings.MODEL_ID
        self._initialize_model()

    def _initialize_model(self):
        """Initialize the Hugging Face model client for Q-Empire clients."""
        if settings.HUGGINGFACE_API_TOKEN and HAS_HF_HUB:
            try:
                self.client = InferenceClient(
                    token=settings.HUGGINGFACE_API_TOKEN
                )
                logger.info(f"✅ Q-Empire AI Engine initialized")
                logger.info(f"   Model: {QEMPIRE_HF_MODEL}")
                logger.info(f"   Model Card: {QEMPIRE_MODEL_CARD}")
                logger.info(f"   HF Space: {QEMPIRE_SPACE}")
            except Exception as e:
                logger.warning(f"⚠️ Could not initialize HF client: {e}")
                self.client = None
        elif HAS_HF_HUB:
            try:
                self.client = InferenceClient()
                logger.info("✅ Q-Empire AI Engine initialized (public model access)")
            except Exception as e:
                logger.warning(f"⚠️ Could not initialize HF client: {e}")
                self.client = None
        else:
            logger.info("ℹ️ Running in template mode (install huggingface_hub for full AI)")

    async def generate_content_for_all_platforms(
        self,
        brand_profile: Dict,
        platforms: List[str],
        content_theme: str = None,
    ) -> List[GeneratedPost]:
        """
        Generate unique, optimized content for all connected platforms.

        Args:
            brand_profile: Analyzed website/brand data
            platforms: List of platform names to generate for
            content_theme: Optional specific theme/topic to focus on

        Returns:
            List of GeneratedPost objects, one per platform
        """
        generated_posts = []

        for platform in platforms:
            if platform not in PLATFORM_REGISTRY:
                logger.warning(f"Unknown platform: {platform}, skipping")
                continue

            try:
                post = await self._generate_for_platform(
                    brand_profile=brand_profile,
                    platform=platform,
                    content_theme=content_theme,
                )
                generated_posts.append(post)
                logger.info(f"✅ Generated content for {platform}")
            except Exception as e:
                logger.error(f"❌ Failed to generate for {platform}: {e}")
                # Create a fallback post
                generated_posts.append(self._create_fallback_post(
                    platform, brand_profile
                ))

        return generated_posts

    async def _generate_for_platform(
        self,
        brand_profile: Dict,
        platform: str,
        content_theme: str = None,
    ) -> GeneratedPost:
        """Generate content specifically optimized for one platform."""

        platform_config = PLATFORM_REGISTRY[platform]
        max_chars = platform_config["max_chars"]
        hashtag_limit = platform_config["hashtag_limit"]

        # Build the platform-specific prompt
        prompt = self._build_generation_prompt(
            brand_profile=brand_profile,
            platform=platform,
            platform_config=platform_config,
            content_theme=content_theme,
        )

        # Generate content using the AI model
        content = await self._invoke_model(prompt, max_chars)

        # Parse the generated content
        parsed = self._parse_generated_content(content, platform)

        # Apply platform-specific optimization
        optimized_content = self._optimize_for_platform(
            parsed["content"], platform, max_chars
        )

        # Generate hashtags
        hashtags = self._generate_hashtags(
            brand_profile, platform, hashtag_limit
        )

        # Generate image description
        image_desc = self._generate_image_description(
            brand_profile, platform, optimized_content
        )

        return GeneratedPost(
            platform=platform,
            content=optimized_content,
            hashtags=hashtags,
            image_description=image_desc,
            call_to_action=parsed.get("cta", ""),
            confidence_score=parsed.get("score", 0.85),
            character_count=len(optimized_content),
        )

    def _build_generation_prompt(
        self,
        brand_profile: Dict,
        platform: str,
        platform_config: Dict,
        content_theme: str = None,
    ) -> str:
        """Build a platform-specific content generation prompt."""

        brand_name = brand_profile.get("brand_name", "the brand")
        description = brand_profile.get("description", "")
        keywords = brand_profile.get("keywords", [])
        tone = brand_profile.get("tone", "professional")
        products = brand_profile.get("products_services", [])

        theme_instruction = ""
        if content_theme:
            theme_instruction = f"\nContent Theme/Topic: {content_theme}"

        prompt = f"""You are Q-Empire's AI Social Media Content Engine. Generate a highly engaging, 
platform-optimized social media post for {platform_config['name']}.

BRAND INFORMATION:
- Brand Name: {brand_name}
- Description: {description}
- Keywords: {', '.join(keywords[:10]) if keywords else 'N/A'}
- Tone: {tone}
- Products/Services: {', '.join(products[:5]) if products else 'N/A'}
{theme_instruction}

PLATFORM RULES FOR {platform_config['name'].upper()}:
- Maximum characters: {platform_config['max_chars']}
- Supports images: {platform_config['supports_images']}
- Supports video: {platform_config['supports_video']}
- Supports links: {platform_config['supports_links']}
- Max hashtags: {platform_config['hashtag_limit']}
- Best posting style: {"Short, punchy, conversational" if platform_config['max_chars'] < 500 else "Detailed, informative, value-driven"}

GENERATION RULES:
1. Content MUST be unique to this platform (not copy-pasted from others)
2. Respect the character limit strictly
3. Match the platform's native content style
4. Include a clear call-to-action
5. Be engaging, not salesy
6. Use the brand's tone of voice
7. {"Include relevant hashtags" if platform_config['hashtag_limit'] > 0 else "Do NOT include hashtags"}
8. {"Include a link placeholder [LINK]" if platform_config['supports_links'] else "Do NOT include links"}

Generate the post content now. Return ONLY the post text, nothing else."""

        return prompt

    async def _invoke_model(self, prompt: str, max_length: int = 500) -> str:
        """Invoke the AI model to generate content."""

        if self.client:
            try:
                response = self.client.text_generation(
                    prompt,
                    model=QEMPIRE_HF_MODEL,
                    max_new_tokens=min(max_length, 1024),
                    temperature=settings.AI_MODEL_TEMPERATURE,
                    do_sample=True,
                    top_p=0.9,
                )
                return response
            except Exception as e:
                logger.error(f"Model invocation failed: {e}")

        # Fallback: Generate content using template-based approach
        return self._template_generation(prompt)

    def _template_generation(self, prompt: str) -> str:
        """Template-based content generation fallback when model is unavailable."""
        # Extract brand info from prompt
        lines = prompt.split("\n")
        brand_name = "Your Brand"
        for line in lines:
            if "Brand Name:" in line:
                brand_name = line.split(":")[-1].strip()
                break

        templates = [
            f"🚀 Discover how {brand_name} is transforming the game! Our innovative solutions help you achieve more with less effort. Ready to level up? [LINK] #Innovation #Growth",
            f"💡 Did you know? {brand_name} helps businesses automate their success. Stop working harder — start working smarter. See how → [LINK]",
            f"🌟 The future of business is here. {brand_name} delivers AI-powered solutions that work while you sleep. Join thousands who've already made the switch! [LINK]",
            f"⚡ Transform your workflow with {brand_name}. Less manual work. More results. More time for what matters. Explore now → [LINK] #Automation #AI",
            f"🎯 {brand_name} — Where innovation meets execution. Our clients see 3x productivity gains in just 30 days. Your turn? [LINK]",
        ]

        import random
        return random.choice(templates)

    def _parse_generated_content(self, content: str, platform: str) -> Dict:
        """Parse and structure the generated content."""
        # Clean up the content
        content = content.strip()

        # Remove any meta-text the model might have added
        for prefix in ["Here's", "Here is", "Post:", "Content:"]:
            if content.startswith(prefix):
                content = content[len(prefix):].strip()

        return {
            "content": content,
            "cta": self._extract_cta(content),
            "score": 0.85,
        }

    def _optimize_for_platform(
        self, content: str, platform: str, max_chars: int
    ) -> str:
        """Apply platform-specific optimization rules."""

        # Truncate if over limit
        if len(content) > max_chars:
            content = content[:max_chars - 3] + "..."

        # Platform-specific adjustments
        if platform == "twitter":
            # Ensure tweet is under 280 chars
            if len(content) > 280:
                content = content[:277] + "..."

        elif platform == "instagram":
            # Instagram: front-load the hook, add line breaks
            if "\n\n" not in content and len(content) > 100:
                # Add a line break after the first sentence
                first_period = content.find(".")
                if first_period > 0 and first_period < 150:
                    content = content[:first_period + 1] + "\n\n" + content[first_period + 1:]

        elif platform == "linkedin":
            # LinkedIn: professional tone, add line breaks for readability
            content = content.replace("! ", ".\n\n")

        elif platform == "medium":
            # Medium: longer form, add structure
            if len(content) < 500:
                content = f"# {content.split('.')[0]}\n\n{content}"

        return content.strip()

    def _generate_hashtags(
        self, brand_profile: Dict, platform: str, limit: int
    ) -> List[str]:
        """Generate relevant hashtags for the platform."""
        if limit == 0:
            return []

        keywords = brand_profile.get("keywords", [])
        brand_name = brand_profile.get("brand_name", "").replace(" ", "")

        # Base hashtags from brand
        hashtags = []
        if brand_name:
            hashtags.append(f"#{brand_name}")

        # Add keyword-based hashtags
        common_tags = [
            "#AI", "#Automation", "#Business", "#Growth",
            "#Marketing", "#Digital", "#Innovation", "#Success",
            "#Entrepreneur", "#SmallBusiness", "#Tech", "#Future",
        ]

        for keyword in keywords[:5]:
            tag = f"#{keyword.replace(' ', '').title()}"
            if tag not in hashtags:
                hashtags.append(tag)

        # Fill remaining with common tags
        for tag in common_tags:
            if len(hashtags) >= limit:
                break
            if tag not in hashtags:
                hashtags.append(tag)

        return hashtags[:limit]

    def _generate_image_description(
        self, brand_profile: Dict, platform: str, content: str
    ) -> str:
        """Generate an AI image description for the post."""
        brand_name = brand_profile.get("brand_name", "the brand")
        return (
            f"Professional social media graphic for {brand_name}. "
            f"Modern design with brand colors. "
            f"Platform: {PLATFORM_REGISTRY.get(platform, {}).get('name', platform)}. "
            f"Style: Clean, engaging, scroll-stopping visual."
        )

    def _extract_cta(self, content: str) -> str:
        """Extract or generate a call-to-action from content."""
        cta_patterns = [
            r"(click|tap|visit|check out|learn more|sign up|get started|try|discover|explore).*?[.!]",
        ]
        for pattern in cta_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                return match.group(0)
        return "Learn more at our website!"

    def _create_fallback_post(
        self, platform: str, brand_profile: Dict
    ) -> GeneratedPost:
        """Create a basic fallback post when generation fails."""
        brand_name = brand_profile.get("brand_name", "Our Brand")
        return GeneratedPost(
            platform=platform,
            content=f"Discover what {brand_name} can do for you! Visit our website to learn more. #Innovation #Growth",
            hashtags=["#Innovation", "#Growth", "#Business"],
            image_description=f"Brand graphic for {brand_name}",
            confidence_score=0.5,
            character_count=80,
        )


# Global AI engine instance
ai_engine = QEmpireAIEngine()
