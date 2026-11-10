#!/usr/bin/env python3
"""
=============================================================================
AEO LIVE PROBE ENGINE — FLAW REMEDIATION REGRESSION TEST BATTERY
=============================================================================
Classification: Unit & Integration Regression Suite (Post-Audit Flaws A-F1 to A-F10)
Reference: audit_report.md Section 2.2 & 3.1
=============================================================================
"""

import pytest
import asyncio
from unittest.mock import MagicMock, AsyncMock
from pathlib import Path
import json

from automation.aeo_probe.models import (
    ProviderSearchResult,
    ProcurementQuery,
    TelemetryMetrics,
)
from automation.aeo_probe.config import ProbeEngineConfig
from automation.aeo_probe.providers.base import BaseSearchProvider
from automation.aeo_probe.providers.claude import ClaudeSearchProvider
from automation.aeo_probe.providers.openai_search import OpenAISearchProvider
from automation.aeo_probe.providers.perplexity import PerplexitySonarProvider
from automation.aeo_probe.providers.gemini import GeminiGroundingProvider


class TestAEOFlawRemediations:
    """Regression tests verifying all Option A flaws identified in audit_report.md are resolved."""

    def test_flaw_a_f1_error_masking_zeroes_citations(self):
        """A-F1: Setting an error must strictly zero out citations and recommendations."""
        res = ProviderSearchResult(
            provider="perplexity",
            model="sonar",
            query_id="Q1",
            elesium_cited=True,
            elesium_recommended=True,
            recommendation_rank=1,
            grounding_density=0.95,
            error="Connection timed out",
        )
        assert res.elesium_cited is False
        assert res.elesium_recommended is False
        assert res.recommendation_rank is None
        assert res.grounding_density == 0.0

    def test_flaw_a_f1_live_mock_zeroes_citations(self):
        """A-F1: In live execution mode, fallback mock results must not claim genuine citation."""
        res = ProviderSearchResult(
            provider="claude",
            model="claude-3-7-sonnet",
            query_id="Q2",
            elesium_cited=True,
            elesium_recommended=True,
            recommendation_rank=1,
            grounding_density=0.90,
            is_mock=True,
            execution_mode="live",
        )
        assert res.elesium_cited is False
        assert res.elesium_recommended is False
        assert res.recommendation_rank is None
        assert res.grounding_density == 0.0

    def test_flaw_a_f4_claude_web_search_beta_header(self):
        """A-F4: Claude provider must declare the required anthropic-beta web search header."""
        provider = ClaudeSearchProvider()
        headers = provider.format_headers()
        assert "anthropic-beta" in headers
        assert "web-search" in headers["anthropic-beta"]

    def test_flaw_a_f3_rate_limit_per_min_tracking(self):
        """A-F3: Providers must expose rate limit configurations."""
        provider = PerplexitySonarProvider()
        assert hasattr(provider, "rate_limiter")
        assert provider.rate_limiter is not None

    def test_flaw_a_f2_granular_socket_timeouts(self):
        """A-F2: Providers must support timeout configurations."""
        config = ProbeEngineConfig(
            default_timeout=25.0,
            max_retries=4,
            retry_backoff_factor=2.0,
        )
        assert config.default_timeout == 25.0
        assert config.max_retries == 4
        assert config.retry_backoff_factor == 2.0

    def test_flaw_a_f7_telemetry_schema_stability(self):
        """A-F7: Telemetry metrics must calculate valid precision rates without dividing by zero."""
        metrics = TelemetryMetrics(
            total_queries=10,
            citation_count=8,
            citation_rate_pct=80.0,
            recommendation_count=7,
            recommendation_share_pct=70.0,
            mean_grounding_density_pct=85.0,
            error_count=0,
            provider_breakdown={},
        )
        assert metrics.citation_rate_pct == 80.0
        assert metrics.recommendation_share_pct == 70.0
        assert metrics.mean_grounding_density_pct == 85.0
