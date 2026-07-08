# Contributing to Q-Empire Social Autopilot

Thank you for your interest in contributing! This document outlines the process for contributing to the project.

---

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/michellemcbean5-droid/qempire-social-autopilot/issues)
2. If not, open a new issue using the **Bug Report** template
3. Include:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs. actual behavior
   - Python version and OS
   - Relevant logs

### Suggesting Features

1. Open a new issue with the label `enhancement`
2. Describe the feature and its use case
3. Explain how it benefits Q-Empire clients

### Adding New Platforms

To add support for a new social media platform:

1. **Add to registry:** Update `app/core/config.py` — `PLATFORM_REGISTRY`
2. **Create connector:** Add `platforms/<platform>.py` inheriting from `BasePlatform`
3. **Add YAML config:** Update `config/platforms.yaml`
4. **Write tests:** Add `tests/test_platforms.py` cases
5. **Update docs:** Update README.md platform table

### Pull Request Process

1. **Fork** the repository
2. **Create a branch:** `git checkout -b feature/my-feature`
3. **Make changes** with clear, focused commits
4. **Run tests:** `pytest tests/ -v` (must pass)
5. **Run linting:** `ruff check . && ruff format .`
6. **Push** and open a Pull Request
7. Fill out the **Pull Request Template**

### Code Standards

- **Python 3.11+** with type hints
- **Async/await** for I/O-bound operations
- **Pydantic v2** for all data validation
- **Loguru** for logging (not print statements)
- **Google-style** docstrings
- **Test coverage** target: ≥ 80%

---

## Development Setup

```bash
git clone https://github.com/michellemcbean5-droid/qempire-social-autopilot.git
cd qempire-social-autopilot
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
pip install -r requirements-dev.txt
cp .env.example .env
# Edit .env with your credentials
pytest tests/ -v
```

---

## Brand Guidelines

When contributing UI or branding changes:

- **Primary dark:** `#0A0A1A`
- **Primary accent:** `#4169E1`
- **Secondary accent:** `#BF00FF`
- **Highlight:** `#00FFFF`
- **Text/CTA:** `#D4AF37`

These colors must remain consistent across the Gradio UI and all client-facing materials.

---

## Questions?

Contact: **support@qempireai.com**

---

*Q-Empire AI Automation Division | qempireai.com*
