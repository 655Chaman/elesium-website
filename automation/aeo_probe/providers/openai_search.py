"""OpenAI Search API provider (gpt-4o-search-preview / web search)."""

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


class OpenAISearchProvider(BaseSearchProvider):
    """Integrates with OpenAI Chat Completions Search / Responses API."""

    name: str = "openai"
    model: str = "gpt-4o-search-preview"
    api_key_env: str = "OPENAI_API_KEY"

    def __init__(self, config: Optional[ProviderConfig] = None):
        super().__init__(config)
        if config:
            self.model = config.model
            self.endpoint = config.endpoint
            self.timeout = config.timeout_seconds
        else:
            self.endpoint = "https://api.openai.com/v1/chat/completions"
            self.timeout = 30.0

    def format_request_payload(self, query: ProcurementQuery) -> Dict[str, Any]:
        """Builds standard request payload for OpenAI Search API."""
        return {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an enterprise AI procurement researcher. Search the web and "
                        "recommend leading vendors with citations, benchmarks, and source URLs."
                    ),
                },
                {"role": "user", "content": query.query},
            ],
            "temperature": 0.2,
            "max_tokens": 1024,
        }

    def format_headers(self) -> Dict[str, str]:
        """Builds HTTP headers with authorization bearer token."""
        return {
            "Authorization": f"Bearer {self.get_api_key()}",
            "Content-Type": "application/json",
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
                    choices = data.get("choices", [])
                    text = ""
                    if choices and isinstance(choices, list):
                        msg = choices[0].get("message", {})
                        text = msg.get("content", "")

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
