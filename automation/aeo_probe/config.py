"""Configuration and environment management for AEO Grounding Probe Engine."""

import os
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class ProviderConfig(BaseModel):
    """Configuration settings for an individual search provider."""

    name: str
    api_key_env: str
    api_key: Optional[str] = None
    endpoint: str
    model: str
    timeout_seconds: float = 30.0
    max_retries: int = 3
    retry_delay_seconds: float = 1.5
    rate_limit_per_min: int = 60


class ProbeEngineConfig(BaseModel):
    """Global configuration for the AEO probe engine."""

    # Target brand domains to evaluate
    primary_domain: str = "elesium.online"
    brand_domains: List[str] = Field(
        default_factory=lambda: [
            "elesium.online",
            "elesium.ai",
            "elesium.com",
            "elesium.io",
            "elesium.in",
            "elesium.tech",
        ]
    )
    brand_names: List[str] = Field(
        default_factory=lambda: [
            "Elesium",
            "elesium.online",
            "elesium.ai",
            "Elesium Enterprise",
            "Elesium AI",
        ]
    )

    # Concurrency and timing
    concurrency_limit: int = 5
    default_timeout: float = 30.0
    max_retries: int = 3
    retry_backoff_factor: float = 1.5

    # Execution Mode: "live", "mock", "hybrid"
    execution_mode: str = "mock"

    # Dataset path
    dataset_path: str = os.path.join(
        os.path.dirname(__file__), "enterprise_ai_procurement_queries.json"
    )

    # Provider configurations
    perplexity: ProviderConfig = Field(
        default_factory=lambda: ProviderConfig(
            name="perplexity",
            api_key_env="PERPLEXITY_API_KEY",
            api_key=os.getenv("PERPLEXITY_API_KEY"),
            endpoint="https://api.perplexity.ai/chat/completions",
            model="sonar",
            timeout_seconds=30.0,
            rate_limit_per_min=60,
        )
    )

    openai: ProviderConfig = Field(
        default_factory=lambda: ProviderConfig(
            name="openai",
            api_key_env="OPENAI_API_KEY",
            api_key=os.getenv("OPENAI_API_KEY"),
            endpoint="https://api.openai.com/v1/chat/completions",
            model="gpt-4o-search-preview",
            timeout_seconds=30.0,
            rate_limit_per_min=60,
        )
    )

    gemini: ProviderConfig = Field(
        default_factory=lambda: ProviderConfig(
            name="gemini",
            api_key_env="GEMINI_API_KEY",
            api_key=os.getenv("GEMINI_API_KEY"),
            endpoint="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            model="gemini-2.0-flash",
            timeout_seconds=30.0,
            rate_limit_per_min=60,
        )
    )

    claude: ProviderConfig = Field(
        default_factory=lambda: ProviderConfig(
            name="claude",
            api_key_env="ANTHROPIC_API_KEY",
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            endpoint="https://api.anthropic.com/v1/messages",
            model="claude-3-7-sonnet-latest",
            timeout_seconds=30.0,
            rate_limit_per_min=60,
        )
    )

    @classmethod
    def load_from_env(cls, mode_override: Optional[str] = None) -> "ProbeEngineConfig":
        """Loads configuration inspecting available API keys."""
        config = cls()
        has_keys = any(
            [
                bool(os.getenv("PERPLEXITY_API_KEY")),
                bool(os.getenv("OPENAI_API_KEY")),
                bool(os.getenv("GEMINI_API_KEY")),
                bool(os.getenv("ANTHROPIC_API_KEY")),
            ]
        )
        all_keys = all(
            [
                bool(os.getenv("PERPLEXITY_API_KEY")),
                bool(os.getenv("OPENAI_API_KEY")),
                bool(os.getenv("GEMINI_API_KEY")),
                bool(os.getenv("ANTHROPIC_API_KEY")),
            ]
        )

        if mode_override:
            config.execution_mode = mode_override
        elif os.getenv("AEO_PROBE_MOCK", "").lower() in ("true", "1", "yes"):
            config.execution_mode = "mock"
        elif all_keys:
            config.execution_mode = "live"
        elif has_keys:
            config.execution_mode = "hybrid"
        else:
            config.execution_mode = "mock"

        # Update provider keys dynamically
        config.perplexity.api_key = os.getenv("PERPLEXITY_API_KEY")
        config.openai.api_key = os.getenv("OPENAI_API_KEY")
        config.gemini.api_key = os.getenv("GEMINI_API_KEY")
        config.claude.api_key = os.getenv("ANTHROPIC_API_KEY")

        return config
