"""Abstract base class for LLM search providers."""

from abc import ABC, abstractmethod
import asyncio
import os
import time
from typing import Any, Dict, List, Optional
import httpx

from automation.aeo_probe.config import ProviderConfig
from automation.aeo_probe.models import ProcurementQuery, ProviderSearchResult


class AsyncRateLimiter:
    """Token-bucket rate limiter enforcing rate_limit_per_min."""

    def __init__(self, rate_limit_per_min: int = 60):
        self.rate_limit_per_min = max(1, rate_limit_per_min)
        self.capacity = float(self.rate_limit_per_min)
        self.tokens = float(self.rate_limit_per_min)
        self.fill_rate = self.rate_limit_per_min / 60.0  # tokens per second
        self.last_update = time.monotonic()
        self.lock = asyncio.Lock()

    async def acquire(self) -> None:
        async with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_update
            self.last_update = now
            self.tokens = min(self.capacity, self.tokens + elapsed * self.fill_rate)
            if self.tokens < 1.0:
                needed = 1.0 - self.tokens
                wait_time = needed / self.fill_rate
                await asyncio.sleep(wait_time)
                self.tokens = 0.0
                self.last_update = time.monotonic()
            else:
                self.tokens -= 1.0


def parse_retry_after(headers: Any) -> Optional[float]:
    """Extracts wait duration in seconds from Retry-After or rate-limit reset headers."""
    if not headers:
        return None

    # 1. Standard HTTP Retry-After
    retry_after = headers.get("retry-after") or headers.get("Retry-After")
    if retry_after:
        try:
            return max(0.0, float(retry_after))
        except (ValueError, TypeError):
            pass

    # 2. Provider-specific reset headers
    reset_headers = [
        "x-ratelimit-reset",
        "x-ratelimit-reset-requests",
        "anthropic-ratelimit-requests-reset",
        "x-ratelimit-reset-tokens",
    ]
    for h in reset_headers:
        val = headers.get(h)
        if val:
            try:
                val_f = float(val)
                # If unix epoch in future
                if val_f > 1_000_000_000:
                    delta = val_f - time.time()
                    return max(0.0, delta)
                return max(0.0, val_f)
            except (ValueError, TypeError):
                pass

    return None


class BaseSearchProvider(ABC):
    """Abstract interface defining operations for live search grounding providers."""

    name: str
    model: str
    api_key_env: str

    def __init__(self, config: Optional[ProviderConfig] = None):
        self.config = config
        rate_limit = config.rate_limit_per_min if config else 60
        self.rate_limiter = AsyncRateLimiter(rate_limit)

    def is_live_available(self) -> bool:
        """Checks if a valid live API key is set in the environment or config."""
        if self.config and self.config.api_key:
            return bool(self.config.api_key.strip())
        return bool(os.getenv(self.api_key_env, "").strip())

    def get_api_key(self) -> str:
        """Retrieves the active API key."""
        if self.config and self.config.api_key:
            return self.config.api_key.strip()
        return os.getenv(self.api_key_env, "").strip()

    @abstractmethod
    async def query(
        self,
        query: ProcurementQuery,
        scenario: str = "post_injection",
        client: Optional[httpx.AsyncClient] = None,
    ) -> ProviderSearchResult:
        """Executes a search query against live API or falls back to mock."""
        pass

    @abstractmethod
    def build_mock_response(
        self, query: ProcurementQuery, scenario: str = "post_injection"
    ) -> ProviderSearchResult:
        """Constructs a deterministic mock ProviderSearchResult."""
        pass
