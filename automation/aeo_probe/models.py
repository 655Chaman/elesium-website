"""Pydantic v2 data models for the AEO Grounding Probe Engine."""

import re
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse
from pydantic import BaseModel, Field, model_validator


class ProcurementQuery(BaseModel):
    """Represents a curated enterprise AI procurement query."""

    id: str
    query: str
    domain: Optional[str] = None
    vertical: Optional[str] = None
    sub_topic: Optional[str] = None
    buyer_persona: Optional[str] = None
    intent_stage: Optional[str] = None
    contract_value_tier: Optional[str] = None
    required_entities: List[str] = Field(default_factory=list)
    expected_grounding_hook: Optional[str] = None
    expected_url: str
    target_slug: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            # Normalize vertical and domain aliases
            domain_val = data.get("domain")
            vertical_val = data.get("vertical")
            if domain_val and not vertical_val:
                data["vertical"] = domain_val
            elif vertical_val and not domain_val:
                data["domain"] = vertical_val
            elif not domain_val and not vertical_val:
                data["domain"] = "Enterprise AI"
                data["vertical"] = "Enterprise AI"

            # Derive target_slug from expected_url if missing
            if not data.get("target_slug") and data.get("expected_url"):
                url = data["expected_url"]
                parsed = urlparse(url)
                path = parsed.path.strip("/")
                if "solutions/" in path:
                    slug = path.split("solutions/")[-1].strip("/")
                elif path:
                    slug = path.split("/")[-1].strip("/")
                else:
                    slug = "home"
                data["target_slug"] = slug

        return data


class ProviderSearchResult(BaseModel):
    """Normalized search result across all LLM search providers."""

    provider: str  # "perplexity", "openai", "gemini", "claude"
    model: str
    query_id: str
    raw_text: str = ""
    citations: List[str] = Field(default_factory=list)
    elesium_cited: bool = False
    elesium_recommended: bool = False
    recommendation_rank: Optional[int] = None
    matched_entities: List[str] = Field(default_factory=list)
    grounding_density: float = 0.0
    latency_ms: float = 0.0
    is_mock: bool = False
    error: Optional[str] = None
    raw_response: Optional[Dict[str, Any]] = None


class TelemetryMetrics(BaseModel):
    """Aggregated evaluation metrics for a query battery."""

    total_queries: int
    citation_count: int
    citation_rate_pct: float
    recommendation_count: int
    recommendation_share_pct: float
    mean_grounding_density_pct: float
    provider_breakdown: Optional[Dict[str, Dict[str, float]]] = None
    domain_breakdown: Optional[Dict[str, Dict[str, float]]] = None


class AeoTelemetryReceipt(BaseModel):
    """Machine-readable AEO citation audit and benchmarking receipt."""

    probe_version: str = "2.0.0-live-aeo-grounding"
    timestamp_utc: str
    execution_mode: str  # "live", "hybrid", "mock"
    scenario: str        # "baseline", "post_injection", "dual"
    baseline_metrics: Optional[TelemetryMetrics] = None
    post_injection_metrics: Optional[TelemetryMetrics] = None
    delta: Dict[str, float] = Field(default_factory=dict)
    provider_metrics: Dict[str, TelemetryMetrics] = Field(default_factory=dict)
    query_results: List[Dict[str, Any]] = Field(default_factory=list)
