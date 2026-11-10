"""Google Gemini Search Grounding API provider."""

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
from automation.aeo_probe.providers.base import BaseSearchProvider, parse_retry_after
from automation.aeo_probe.providers.mock_engine import MockProbeEngine


class GeminiGroundingProvider(BaseSearchProvider):
    """Integrates with Google Gemini API using Google Search Grounding."""

    name: str = "gemini"
    model: str = "gemini-2.0-flash"
    api_key_env: str = "GEMINI_API_KEY"

    def __init__(self, config: Optional[ProviderConfig] = None):
        super().__init__(config)
        if config:
            self.model = config.model
            self.endpoint = config.endpoint
            self.timeout = config.timeout_seconds
        else:
            self.endpoint = (
                "https://generativelanguage.googleapis.com/v1beta/models/"
                "gemini-2.0-flash:generateContent"
            )
            self.timeout = 30.0

    def format_request_payload(self, query: ProcurementQuery) -> Dict[str, Any]:
        """Builds standard request payload for Gemini GenerateContent with Search Grounding."""
        return {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": query.query}],
                }
            ],
            "tools": [{"googleSearch": {}}],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 1024,
            },
        }

    def format_headers(self) -> Dict[str, str]:
        """Builds HTTP headers with x-goog-api-key."""
        return {
            "x-goog-api-key": self.get_api_key(),
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

        await self.rate_limiter.acquire()
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
                    candidates = data.get("candidates", [])
                    text = ""
                    if candidates and isinstance(candidates, list):
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts and isinstance(parts, list):
                            text = parts[0].get("text", "")

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
                        execution_mode="live",
                        raw_response=data,
                    )
                else:
                    retry_after = parse_retry_after(resp.headers)
                    return ProviderSearchResult(
                        provider=self.name,
                        model=self.model,
                        query_id=query.id,
                        raw_text="",
                        citations=[],
                        elesium_cited=False,
                        elesium_recommended=False,
                        recommendation_rank=None,
                        matched_entities=[],
                        grounding_density=0.0,
                        latency_ms=latency,
                        is_mock=False,
                        error=f"HTTP {resp.status_code}: {resp.text[:200]}",
                        retry_after=retry_after,
                        execution_mode="live",
                        raw_response=None,
                    )

            finally:
                if close_client:
                    await client.aclose()

        except Exception as exc:
            latency = round((time.perf_counter() - start_time) * 1000, 1)
            return ProviderSearchResult(
                provider=self.name,
                model=self.model,
                query_id=query.id,
                raw_text="",
                citations=[],
                elesium_cited=False,
                elesium_recommended=False,
                recommendation_rank=None,
                matched_entities=[],
                grounding_density=0.0,
                latency_ms=latency,
                is_mock=False,
                error=f"Exception {exc.__class__.__name__}: {str(exc)}",
                retry_after=None,
                execution_mode="live",
                raw_response=None,
            )
