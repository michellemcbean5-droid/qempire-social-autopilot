"""
Q-Empire Social Autopilot - Hugging Face Space
Gradio demo interface for the AI content generation engine.
"""

import gradio as gr
from typing import List

SPACE_TITLE = "🚀 Q-Empire Social Autopilot"
SPACE_DESCRIPTION = """
## AI-Powered Social Media Marketing That Runs While You Sleep

Enter your website URL and watch the AI analyze your brand, then generate 
platform-optimized content for up to 25 social media platforms.

**Supported Platforms:** Facebook, Instagram, X/Twitter, LinkedIn, TikTok, 
Pinterest, YouTube, Reddit, Threads, Tumblr, Medium, Mastodon, Discord, 
Telegram, WhatsApp, Snapchat, Bluesky, WordPress, Blogger, Mix, Quora, 
VK, Weibo, LINE, KakaoTalk
"""

PLATFORM_OPTIONS = [
    "Facebook", "Instagram", "X/Twitter", "LinkedIn", "TikTok",
    "Pinterest", "YouTube", "Reddit", "Threads", "Tumblr",
    "Medium", "Mastodon", "Discord", "Telegram", "WhatsApp",
    "Snapchat", "Bluesky", "WordPress", "Blogger", "Mix",
    "Quora", "VK", "Weibo", "LINE", "KakaoTalk"
]

PLATFORM_LIMITS = {
    "Facebook": 63206, "Instagram": 2200, "X/Twitter": 280,
    "LinkedIn": 3000, "TikTok": 2200, "Pinterest": 500,
    "YouTube": 5000, "Reddit": 40000, "Threads": 500,
    "Tumblr": 4096, "Medium": 100000, "Mastodon": 500,
    "Discord": 2000, "Telegram": 4096, "WhatsApp": 4096,
    "Snapchat": 250, "Bluesky": 300, "WordPress": 100000,
    "Blogger": 100000, "Mix": 500, "Quora": 10000,
    "VK": 15895, "Weibo": 2000, "LINE": 5000, "KakaoTalk": 2000,
}

def analyze_website(url: str) -> str:
    """Simulate website analysis."""
    domain = url.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
    brand_name = domain.split(".")[0].title()

    return f"""
## 📊 Brand Analysis Complete

**Brand Name:** {brand_name}
**Domain:** {domain}
**Tone Detected:** Professional / Growth-Oriented
**Keywords:** AI, Automation, Social Media, Marketing, Growth
**Target Audience:** Business owners, marketers, entrepreneurs

The AI has extracted your brand voice and is ready to generate content.
"""

def generate_content(website_url: str, platforms: List[str], theme: str, tone: str) -> str:
    """Generate platform-specific content."""
    if not platforms:
        return "⚠️ Please select at least one platform."

    results = []
    brand_name = website_url.split(".")[0].replace("https://", "").replace("http://", "").title()

    templates = {
        "Facebook": f"🚀 Big news from {brand_name}! We're revolutionizing how businesses approach social media with AI-powered automation. Ready to scale your presence? Drop a 🔥 if you're ready! #AI #SocialMedia #Growth",
        "Instagram": f"✨ The future of marketing is here ✨\n\n{brand_name} helps you post to 25 platforms while you sleep 😴🚀\n\nNo more manual posting. No more missed opportunities.\n\nLink in bio 👆\n\n#AI #Automation #SocialMedia #Entrepreneur #GrowthHacking",
        "X/Twitter": f"🤖 AI just replaced my social media manager.\n\n{brand_name} posts to 25 platforms on autopilot.\n\nI just set it and sleep.\n\nGame changer. 🚀",
        "LinkedIn": f"I'm excited to share how {brand_name} is transforming social media strategy for modern businesses.\n\nIn today's digital landscape, consistency is everything. Yet managing 25+ platforms manually is unsustainable.\n\nOur AI-powered autopilot system analyzes your brand voice, generates platform-optimized content, and publishes on schedule — completely autonomously.\n\nThe results speak for themselves:\n• 3x content output\n• 60% time savings\n• 40% engagement increase\n\nWould love to hear your thoughts on AI-driven social automation in the comments.\n\n#AI #SocialMedia #Automation #BusinessGrowth",
        "TikTok": f"POV: You finally found the AI tool that posts to ALL your socials while you sleep 😴✨\n\n{brand_name} = 25 platforms, zero effort\n\n#AITools #SocialMedia #Automation #SideHustle",
    }

    for platform in platforms:
        limit = PLATFORM_LIMITS.get(platform, 500)
        content = templates.get(platform, f"🚀 {brand_name} is transforming the game with AI-powered social automation! #Innovation #Growth")

        if len(content) > limit:
            content = content[:limit-3] + "..."

        hashtag_count = content.count("#")
        char_count = len(content)

        results.append(f"""
### 📱 {platform}
**Characters:** {char_count}/{limit} | **Hashtags:** {hashtag_count}

{content}

---
""")

    return f"""
## ✨ Generated Content for {len(platforms)} Platforms

{"" .join(results)}

**Theme:** {theme}
**Tone:** {tone}
**Next Step:** Click "Queue Posts" to schedule these for publishing.
"""

def create_demo_interface():
    with gr.Blocks(theme=gr.themes.Soft(), title=SPACE_TITLE) as demo:
        gr.Markdown(f"# {SPACE_TITLE}")
        gr.Markdown(SPACE_DESCRIPTION)

        with gr.Tab("🚀 Quick Start"):
            with gr.Row():
                with gr.Column(scale=1):
                    website_input = gr.Textbox(
                        label="Your Website URL",
                        placeholder="https://yourbusiness.com",
                        value="https://qempireai.com"
                    )
                    analyze_btn = gr.Button("🔍 Analyze Website", variant="primary")
                    analysis_output = gr.Markdown(label="Brand Profile")

                with gr.Column(scale=2):
                    platform_dropdown = gr.Dropdown(
                        choices=PLATFORM_OPTIONS,
                        label="Select Platforms",
                        multiselect=True,
                        value=["Facebook", "Instagram", "X/Twitter", "LinkedIn"]
                    )
                    theme_input = gr.Textbox(
                        label="Content Theme (Optional)",
                        placeholder="Product launch, tips, behind-the-scenes...",
                        value="AI-powered automation"
                    )
                    tone_dropdown = gr.Dropdown(
                        choices=["Professional", "Casual", "Playful", "Authoritative", "Friendly", "Luxury", "Edgy"],
                        label="Brand Tone",
                        value="Professional"
                    )
                    generate_btn = gr.Button("✨ Generate Content", variant="primary")
                    content_output = gr.Markdown(label="Generated Content")

        with gr.Tab("📊 Platform Limits"):
            limits_data = [[p, PLATFORM_LIMITS[p]] for p in PLATFORM_OPTIONS]
            gr.Dataframe(
                headers=["Platform", "Max Characters"],
                value=limits_data,
                label="Character Limits by Platform"
            )

        with gr.Tab("ℹ️ About"):
            gr.Markdown("""
            ## Q-Empire Social Autopilot

            **Version:** 1.0.0  
            **Model:** Mistral-7B-Instruct-v0.3  
            **Fallback:** Zephyr-7b-beta

            ### Features
            - 🤖 AI Content Generation
            - 🔍 Website Brand Analysis
            - 📅 Autopilot Scheduling
            - 📊 Analytics Dashboard
            - 🔗 25 Platform Support

            ### Links
            - GitHub: github.com/michellemcbean5-droid/qempire-social-autopilot
            - Support: support@qempireai.com
            """)

        analyze_btn.click(
            fn=analyze_website,
            inputs=website_input,
            outputs=analysis_output
        )

        generate_btn.click(
            fn=generate_content,
            inputs=[website_input, platform_dropdown, theme_input, tone_dropdown],
            outputs=content_output
        )

    return demo

demo = create_demo_interface()

if __name__ == "__main__":
    demo.launch()
