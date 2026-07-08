"""
Q-Empire Social Content AI Model
Custom model wrapper for social media content generation.
Integrates with Hugging Face Transformers for inference.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
import json


@dataclass
class ContentGenerationConfig:
    """Configuration for the content generation model."""
    model_name: str = "qempire/social-autopilot-ai"
    base_model: str = "mistralai/Mistral-7B-Instruct-v0.3"
    max_new_tokens: int = 1024
    temperature: float = 0.7
    top_p: float = 0.9
    top_k: int = 50
    repetition_penalty: float = 1.1
    do_sample: bool = True


class SocialContentModel:
    """
    Q-Empire Social Content Generation Model.

    This model is specifically designed for generating social media content
    that is optimized for each platform's unique requirements.

    Features:
    - Platform-aware content generation
    - Brand voice consistency
    - Engagement optimization
    - Multi-format output (text, hashtags, image descriptions)
    """

    def __init__(self, config: ContentGenerationConfig = None):
        self.config = config or ContentGenerationConfig()
        self._model = None
        self._tokenizer = None

    def load_model(self):
        """Load the model and tokenizer."""
        try:
            from transformers import AutoTokenizer, AutoModelForCausalLM
            import torch

            self._tokenizer = AutoTokenizer.from_pretrained(self.config.base_model)
            self._model = AutoModelForCausalLM.from_pretrained(
                self.config.base_model,
                torch_dtype=torch.float16,
                device_map="auto",
            )
            return True
        except Exception as e:
            print(f"Could not load model: {e}")
            return False

    def generate(
        self,
        brand_profile: Dict,
        platform: str,
        platform_config: Dict,
        content_theme: Optional[str] = None,
    ) -> Dict:
        """
        Generate content for a specific platform.

        Args:
            brand_profile: Brand information dict
            platform: Target platform name
            platform_config: Platform rules (max_chars, hashtags, etc.)
            content_theme: Optional content theme

        Returns:
            Dict with generated content, hashtags, and metadata
        """
        prompt = self._build_prompt(brand_profile, platform, platform_config, content_theme)

        if self._model and self._tokenizer:
            return self._model_generate(prompt, platform_config)
        else:
            return self._template_generate(brand_profile, platform, platform_config)

    def _build_prompt(
        self,
        brand_profile: Dict,
        platform: str,
        platform_config: Dict,
        content_theme: Optional[str],
    ) -> str:
        """Build the generation prompt."""
        brand_name = brand_profile.get("brand_name", "the brand")
        description = brand_profile.get("description", "")
        tone = brand_profile.get("tone", "professional")
        max_chars = platform_config.get("max_chars", 500)

        prompt = f"""<s>[INST] You are Q-Empire's AI Social Media Content Engine.

Generate a highly engaging social media post for {platform}.

Brand: {brand_name}
Description: {description}
Tone: {tone}
Max characters: {max_chars}
Theme: {content_theme or 'general brand promotion'}

Rules:
- Content must be unique to {platform}
- Stay within {max_chars} characters
- Match {platform}'s native style
- Include a call-to-action
- Be engaging, not salesy

Generate the post now: [/INST]"""

        return prompt

    def _model_generate(self, prompt: str, platform_config: Dict) -> Dict:
        """Generate using the loaded model."""
        import torch

        inputs = self._tokenizer(prompt, return_tensors="pt").to(self._model.device)

        with torch.no_grad():
            outputs = self._model.generate(
                **inputs,
                max_new_tokens=self.config.max_new_tokens,
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                do_sample=self.config.do_sample,
                repetition_penalty=self.config.repetition_penalty,
            )

        generated = self._tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Extract only the generated part (after the prompt)
        content = generated.split("[/INST]")[-1].strip()

        # Truncate to platform limit
        max_chars = platform_config.get("max_chars", 500)
        if len(content) > max_chars:
            content = content[:max_chars - 3] + "..."

        return {
            "content": content,
            "model_used": self.config.model_name,
            "tokens_generated": len(outputs[0]) - len(inputs["input_ids"][0]),
        }

    def _template_generate(
        self, brand_profile: Dict, platform: str, platform_config: Dict
    ) -> Dict:
        """Template-based fallback generation."""
        import random

        brand_name = brand_profile.get("brand_name", "Our Brand")
        max_chars = platform_config.get("max_chars", 500)

        templates = [
            f"🚀 {brand_name} is transforming the game with AI-powered solutions. Ready to automate your success? The future starts now!",
            f"💡 Stop working harder — start working smarter. {brand_name} delivers AI automation that works while you sleep.",
            f"⚡ 3x your productivity without 3x the effort. That's the {brand_name} difference. Discover how →",
            f"🌟 The future of business is automated. {brand_name} helps you get there faster. Join thousands who've made the switch!",
            f"🎯 {brand_name} — Where innovation meets execution. Transform your business with AI-powered automation.",
        ]

        content = random.choice(templates)
        if len(content) > max_chars:
            content = content[:max_chars - 3] + "..."

        return {
            "content": content,
            "model_used": "template_fallback",
            "tokens_generated": 0,
        }

    def get_model_info(self) -> Dict:
        """Get model information."""
        return {
            "model_name": self.config.model_name,
            "base_model": self.config.base_model,
            "loaded": self._model is not None,
            "config": {
                "max_new_tokens": self.config.max_new_tokens,
                "temperature": self.config.temperature,
                "top_p": self.config.top_p,
            },
        }
