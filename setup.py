"""Q-Empire Social Autopilot - Package Setup"""

from setuptools import setup, find_packages

setup(
    name="qempire-social-autopilot",
    version="1.0.0",
    author="Q-Empire AI Automation Division",
    author_email="support@qempireai.com",
    description="AI-Powered Social Media Marketing That Runs While You Sleep",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/michellemcbean5-droid/qempire-social-autopilot",
    packages=find_packages(),
    python_requires=">=3.11",
    install_requires=[
        "fastapi>=0.111.0",
        "uvicorn[standard]>=0.30.0",
        "pydantic>=2.7.0",
        "pydantic-settings>=2.3.0",
        "huggingface-hub>=0.23.0",
        "transformers>=4.40.0",
        "apscheduler>=3.10.4",
        "httpx>=0.27.0",
        "beautifulsoup4>=4.12.0",
        "sqlalchemy>=2.0.30",
        "loguru>=0.7.0",
        "python-dotenv>=1.0.0",
        "gradio>=4.36.0",
    ],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.11",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
)
