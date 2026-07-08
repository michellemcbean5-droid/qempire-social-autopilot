"""
Q-Empire Social Autopilot - Website Analyzer
Scrapes and analyzes user websites to extract brand information,
keywords, tone, products/services, and content themes for AI generation.
"""

from typing import Dict, List, Optional
from loguru import logger
import re
import json

try:
    import httpx
    from bs4 import BeautifulSoup
    import trafilatura
    HAS_SCRAPING = True
except ImportError:
    HAS_SCRAPING = False


class WebsiteAnalyzer:
    """
    Analyzes a user's website to build a comprehensive brand profile.
    This profile is used by the AI engine to generate on-brand content.
    """

    def __init__(self):
        self.headers = {
            "User-Agent": "Q-Empire Social Autopilot Bot/1.0 (+https://qempireai.com)"
        }

    async def analyze_website(self, url: str) -> Dict:
        """
        Perform full website analysis and return a brand profile.

        Args:
            url: The website URL to analyze

        Returns:
            Dict containing brand profile data
        """
        logger.info(f"🔍 Analyzing website: {url}")

        profile = {
            "url": url,
            "brand_name": "",
            "description": "",
            "keywords": [],
            "tone": "professional",
            "products_services": [],
            "target_audience": "",
            "content_themes": [],
            "color_scheme": [],
            "social_links": [],
            "raw_content": "",
        }

        if not HAS_SCRAPING:
            logger.warning("Scraping libraries not available, using URL-based analysis")
            profile["brand_name"] = self._extract_brand_from_url(url)
            return profile

        try:
            # Fetch the website content
            async with httpx.AsyncClient(
                follow_redirects=True, timeout=30.0
            ) as client:
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                html_content = response.text

            # Parse with BeautifulSoup
            soup = BeautifulSoup(html_content, "lxml")

            # Extract brand name
            profile["brand_name"] = self._extract_brand_name(soup, url)

            # Extract description
            profile["description"] = self._extract_description(soup)

            # Extract main text content
            text_content = trafilatura.extract(html_content) or ""
            profile["raw_content"] = text_content[:5000]  # Limit stored content

            # Extract keywords
            profile["keywords"] = self._extract_keywords(soup, text_content)

            # Analyze tone
            profile["tone"] = self._analyze_tone(text_content)

            # Extract products/services
            profile["products_services"] = self._extract_products(soup, text_content)

            # Extract content themes
            profile["content_themes"] = self._extract_themes(text_content)

            # Extract social media links
            profile["social_links"] = self._extract_social_links(soup)

            # Extract color scheme
            profile["color_scheme"] = self._extract_colors(html_content)

            logger.info(f"✅ Website analysis complete for: {profile['brand_name']}")

        except httpx.HTTPError as e:
            logger.error(f"❌ HTTP error analyzing {url}: {e}")
            profile["brand_name"] = self._extract_brand_from_url(url)
        except Exception as e:
            logger.error(f"❌ Error analyzing {url}: {e}")
            profile["brand_name"] = self._extract_brand_from_url(url)

        return profile

    def _extract_brand_name(self, soup: BeautifulSoup, url: str) -> str:
        """Extract the brand/company name from the website."""
        # Try <title> tag
        title = soup.find("title")
        if title and title.string:
            # Clean up common title patterns
            name = title.string.strip()
            # Remove common suffixes
            for sep in [" | ", " - ", " — ", " :: ", " · "]:
                if sep in name:
                    name = name.split(sep)[0].strip()
            if len(name) < 50:
                return name

        # Try og:site_name
        og_name = soup.find("meta", property="og:site_name")
        if og_name and og_name.get("content"):
            return og_name["content"]

        # Try h1
        h1 = soup.find("h1")
        if h1 and h1.get_text(strip=True):
            return h1.get_text(strip=True)[:100]

        # Fallback to domain
        return self._extract_brand_from_url(url)

    def _extract_brand_from_url(self, url: str) -> str:
        """Extract brand name from URL as fallback."""
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc.replace("www.", "")
        name = domain.split(".")[0]
        return name.title()

    def _extract_description(self, soup: BeautifulSoup) -> str:
        """Extract the website's meta description."""
        # Try meta description
        meta_desc = soup.find("meta", attrs={"name": "description"})
        if meta_desc and meta_desc.get("content"):
            return meta_desc["content"]

        # Try og:description
        og_desc = soup.find("meta", property="og:description")
        if og_desc and og_desc.get("content"):
            return og_desc["content"]

        # Try first paragraph
        first_p = soup.find("p")
        if first_p:
            text = first_p.get_text(strip=True)
            if len(text) > 20:
                return text[:300]

        return ""

    def _extract_keywords(self, soup: BeautifulSoup, text: str) -> List[str]:
        """Extract relevant keywords from the website."""
        keywords = []

        # Meta keywords
        meta_kw = soup.find("meta", attrs={"name": "keywords"})
        if meta_kw and meta_kw.get("content"):
            keywords.extend([k.strip() for k in meta_kw["content"].split(",")])

        # Extract from headings
        for heading in soup.find_all(["h1", "h2", "h3"])[:10]:
            text_content = heading.get_text(strip=True)
            if text_content and len(text_content) < 50:
                keywords.append(text_content)

        # Extract frequent meaningful words from content
        if text:
            words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
            word_freq = {}
            for word in words:
                if len(word) > 3:
                    word_freq[word] = word_freq.get(word, 0) + 1
            # Top frequent capitalized phrases
            sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
            keywords.extend([w[0] for w in sorted_words[:10]])

        # Deduplicate and limit
        seen = set()
        unique_keywords = []
        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower not in seen and len(kw) > 2:
                seen.add(kw_lower)
                unique_keywords.append(kw)

        return unique_keywords[:20]

    def _analyze_tone(self, text: str) -> str:
        """Analyze the writing tone of the website content."""
        if not text:
            return "professional"

        text_lower = text.lower()

        # Score different tones
        scores = {
            "professional": 0,
            "casual": 0,
            "playful": 0,
            "authoritative": 0,
            "friendly": 0,
        }

        # Professional indicators
        professional_words = ["solutions", "enterprise", "professional", "industry", "expertise", "strategic"]
        scores["professional"] += sum(1 for w in professional_words if w in text_lower)

        # Casual indicators
        casual_words = ["hey", "awesome", "cool", "check out", "gonna", "wanna"]
        scores["casual"] += sum(1 for w in casual_words if w in text_lower)

        # Playful indicators
        playful_words = ["fun", "exciting", "amazing", "love", "magic", "wow"]
        scores["playful"] += sum(1 for w in playful_words if w in text_lower)

        # Authoritative indicators
        auth_words = ["research", "data", "proven", "studies show", "expert", "leading"]
        scores["authoritative"] += sum(1 for w in auth_words if w in text_lower)

        # Friendly indicators
        friendly_words = ["we're here", "help you", "together", "community", "join us", "welcome"]
        scores["friendly"] += sum(1 for w in friendly_words if w in text_lower)

        return max(scores, key=scores.get)

    def _extract_products(self, soup: BeautifulSoup, text: str) -> List[str]:
        """Extract products or services mentioned on the website."""
        products = []

        # Look for common product/service sections
        for section in soup.find_all(["section", "div"], class_=re.compile(
            r"(product|service|offering|solution|feature)", re.I
        )):
            for item in section.find_all(["h2", "h3", "h4", "li"])[:10]:
                item_text = item.get_text(strip=True)
                if item_text and 3 < len(item_text) < 100:
                    products.append(item_text)

        # Look for list items in service/product areas
        if not products:
            for li in soup.find_all("li")[:20]:
                text_content = li.get_text(strip=True)
                if 10 < len(text_content) < 80:
                    products.append(text_content)

        return products[:15]

    def _extract_themes(self, text: str) -> List[str]:
        """Extract main content themes from the text."""
        if not text:
            return ["general business"]

        themes = []
        theme_keywords = {
            "technology": ["tech", "software", "digital", "app", "platform"],
            "marketing": ["marketing", "brand", "campaign", "audience", "engagement"],
            "e-commerce": ["shop", "store", "buy", "product", "cart", "price"],
            "education": ["learn", "course", "training", "tutorial", "guide"],
            "health": ["health", "wellness", "fitness", "medical", "care"],
            "finance": ["finance", "invest", "money", "banking", "payment"],
            "consulting": ["consult", "strategy", "advisory", "solution", "expertise"],
            "creative": ["design", "creative", "art", "visual", "media"],
            "ai_automation": ["ai", "automation", "machine learning", "artificial intelligence"],
        }

        text_lower = text.lower()
        for theme, keywords in theme_keywords.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            if score >= 2:
                themes.append(theme)

        return themes if themes else ["general business"]

    def _extract_social_links(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract existing social media links from the website."""
        social_platforms = {
            "facebook.com": "facebook",
            "instagram.com": "instagram",
            "twitter.com": "twitter",
            "x.com": "twitter",
            "linkedin.com": "linkedin",
            "tiktok.com": "tiktok",
            "pinterest.com": "pinterest",
            "youtube.com": "youtube",
            "reddit.com": "reddit",
            "tumblr.com": "tumblr",
            "medium.com": "medium",
        }

        found_links = []
        for link in soup.find_all("a", href=True):
            href = link["href"].lower()
            for domain, platform in social_platforms.items():
                if domain in href:
                    found_links.append({
                        "platform": platform,
                        "url": link["href"],
                    })
                    break

        return found_links

    def _extract_colors(self, html: str) -> List[str]:
        """Extract color scheme from CSS in the HTML."""
        colors = set()
        # Find hex colors
        hex_colors = re.findall(r'#[0-9a-fA-F]{6}', html)
        for color in hex_colors[:20]:
            colors.add(color.upper())

        return list(colors)[:10]


# Global analyzer instance
website_analyzer = WebsiteAnalyzer()
