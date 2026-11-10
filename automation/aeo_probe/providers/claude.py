"""Anthropic Claude Web Search API provider."""

import time
from typing import Any, Dict, Optional
import httpx

from automation.aeo_probe.analyzers.brand_share_parser import (
    analyze_brand_share,
    compute_grounding_density,
)
from automation.aeo_probe.analyzers.citation_parser import (
    extract_all_citations,
    is_elesium_url,
)
from automation.aeo_probe.config import ProviderConfig
from automation.aeo_probe.models import ProcurementQuery, ProviderSearchResult
from automation.aeo_probe.providers.base import BaseSearchProvider
from automation.aeo_probe.providers.mock_engine import MockProbeEngine


class ClaudeSearchProvider(BaseSearchProvider):
    """Integrates with Anthropic Claude Messages API using native web search."""

    name: str = "claude"
    model: str = "claude-3-7-sonnet-latest"
    api_key_env: str = "ANTHROPIC_API_KEY"

    def __init__(self, config: Optional[ProviderConfig] = None):
        super().__init__(config)
        if config:
            self.model = config.model
            self.endpoint = config.endpoint
            self.timeout = config.timeout_seconds
        else:
            self.endpoint = "https://api.anthropic.com/v1/messages"
            self.timeout = 30.0

    def format_request_payload(self, query: ProcurementQuery) -> Dict[str, Any]:
        """Builds standard request payload for Claude Messages API with web search tool."""
        return {
            "model": self.model,
            "max_tokens": 1024,
            "temperature": 0.2,
            "tools": [
                {
                    "type": "web_search_20250305",
                    "name": "web_search",
                    "max_uses": 5,
                }
            ],
            "messages": [
                {"role": "user", "content": query.query},
            ],
        }

    def format_headers(self) -> Dict[str, str]:
        """Builds HTTP headers with x-api-key and anthropic-version."""
        return {
            "x-api-key": self.get_api_key(),
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        }

    def build_mock_response(
        self, query: ProcurementQuery, scenario: str = "post_injection"
    ) -> ProviderSearchResult:
        """Centralized deterministic mock fallback."""
        return MockProbeEngine.generate_result(
            provider=self.name,
            model=self.model,
            query=query,
            scenario=scenario,
        )

    async def query(
        self,
        query: ProcurementQuery,
        scenario: str = "post_injection",
        client: Optional[httpx.AsyncClient] = None,
    ) -> ProviderSearchResult:
        """Executes query live if API key is set, otherwise falls back to deterministic mock."""
        if not self.is_live_available():
            return self.build_mock_response(query, scenario)

        payload = self.format_request_payload(query)
        headers = self.format_headers()
        start_time = time.perf_counter()

        try:
            close_client = False
            if client is None:
                client = httpx.AsyncClient(timeout=self.timeout)
                close_client = True

            try:
                resp = await client.post(self.endpoint, headers=headers, json=payload)
                latency = round((time.perf_counter() - start_time) * 1000, 1)

                if resp.status_code == 200:
                    data = resp.json()
                    content_blocks = data.get("content", [])
                    text_parts = []
                    if isinstance(content_blocks, list):
                        for block in content_blocks:
                            if isinstance(block, dict) and block.get("type") == "text":
                                text_parts.append(block.get("text", ""))
                    text = "\n".join(text_parts)

                    citations = extract_all_citations(
                        provider_name=self.name,
                        raw_response=data,
                        text_content=text,
                    )
                    has_elesium_cite = any(is_elesium_url(c) for c in citations)
                    brand_eval = analyze_brand_share(text, brand_name="Elesium")
                    matched_ent, density = compute_grounding_density(
                        text, query.required_entities
                    )

                    return ProviderSearchResult(
                        provider=self.name,
                        model=self.model,
                        query_id=query.id,
                        raw_text=text,
                        citations=citations,
                        elesium_cited=has_elesium_cite,
                        elesium_recommended=brand_eval["recommended"],
                        recommendation_rank=brand_eval["rank"],
                        matched_entities=matched_ent,
                        grounding_density=density,
                        latency_ms=latency,
                        is_mock=False,
                        error=None,
                        raw_response=data,
                    )
                else:
                    mock = self.build_mock_response(query, scenario)
                    mock.error = f"HTTP {resp.status_code}: {resp.text[:200]}"
                    mock.latency_ms = latency
                    return mock

            finally:
                if close_client:
                    await client.aclose()

        except Exception as exc:
            mock = self.build_mock_response(query, scenario)
            mock.error = f"Exception {exc.__class__.__name__}: {str(exc)}"
            return mock
