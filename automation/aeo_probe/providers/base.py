"""Abstract base class for LLM search providers."""

from abc import ABC, abstractmethod
import os
import time
from typing import Any, Dict, List, Optional
import httpx

from automation.aeo_probe.config import ProviderConfig
from automation.aeo_probe.models import ProcurementQuery, ProviderSearchResult


class BaseSearchProvider(ABC):
    """Abstract interface defining operations for live search grounding providers."""

    name: str
    model: str
    api_key_env: str

    def __init__(self, config: Optional[ProviderConfig] = None):
        self.config = config

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
