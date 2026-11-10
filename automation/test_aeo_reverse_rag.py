"""Official R5 Automated Test Suite for AEO Citation Telemetry & Reverse-RAG Injection.

Covers:
  - TestProbeApiExecution: Live search API request formatting and graceful mock fallback across 4 providers.
  - TestQueryDatasetIntegrity: 50 procurement queries, domain distribution, and 100% retained solution mapping.
  - TestTelemetryMetricCalculations: Citation rate %, brand recommendation share %, grounding density %, and deltas.
  - TestReverseRagInjectionIntegrity: Grounding sections, data tables, empirical benchmarks, statutory facts, Schema.org microdata, responsive overflow across all 200 files.
  - TestHtmlValidityAndLayout: Valid HTML syntax, viewport meta, layout containment, idempotency, and companion compressed assets.
"""

from __future__ import annotations

import asyncio
import gzip
import json
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Tuple
from unittest.mock import AsyncMock, MagicMock, patch

from bs4 import BeautifulSoup
import httpx
import pytest

try:
    import brotli
    HAS_BROTLI = True
except ImportError:
    HAS_BROTLI = False

# Path resolutions
_REPO_ROOT = Path(__file__).resolve().parent.parent
_AUTOMATION_DIR = _REPO_ROOT / "automation"
_SOLUTIONS_DIR = _REPO_ROOT / "frontend" / "dist" / "solutions"
_RETAINED_SLUGS_FILE = _AUTOMATION_DIR / "retained_solution_slugs.json"
_QUERIES_FILE = _AUTOMATION_DIR / "aeo_probe" / "enterprise_ai_procurement_queries.json"
_TELEMETRY_JSON = _AUTOMATION_DIR / "aeo_citation_telemetry.json"
_TELEMETRY_REPORT = _AUTOMATION_DIR / "aeo_telemetry_report.md"

# Probe Engine & Model Imports
from automation.aeo_probe.config import ProbeEngineConfig, ProviderConfig
from automation.aeo_probe.dataset import (
    get_queries_by_domain,
    get_query_by_id,
    load_queries,
    validate_dataset,
)
from automation.aeo_probe.engine import AeoProbeEngine
from automation.aeo_probe.models import (
    AeoTelemetryReceipt,
    ProcurementQuery,
    ProviderSearchResult,
    TelemetryMetrics,
)
from automation.aeo_probe.providers.base import BaseSearchProvider
from automation.aeo_probe.providers.claude import ClaudeSearchProvider
from automation.aeo_probe.providers.gemini import GeminiGroundingProvider
from automation.aeo_probe.providers.mock_engine import MockProbeEngine
from automation.aeo_probe.providers.openai_search import OpenAISearchProvider
from automation.aeo_probe.providers.perplexity import PerplexitySonarProvider


# ============================================================================
# Module-Scoped Fixtures for In-Memory 200 Retained HTML Page Inspection
# ============================================================================
@pytest.fixture(scope="module")
def retained_slugs() -> List[str]:
    """Loads and validates the 100 retained enterprise solution slugs."""
    assert _RETAINED_SLUGS_FILE.exists(), f"Missing {_RETAINED_SLUGS_FILE}"
    with open(_RETAINED_SLUGS_FILE, "r", encoding="utf-8") as f:
        slugs = json.load(f)
    assert len(slugs) == 100, f"Expected 100 retained slugs, found {len(slugs)}"
    return slugs


@pytest.fixture(scope="module")
def all_retained_html_targets(retained_slugs: List[str]) -> List[Tuple[str, Path, str]]:
    """
    Loads all 200 HTML solution files (100 flat .html and 100 directory index.html)
    into memory once for rapid, exhaustive testing.
    Returns list of tuples: (slug, file_path, html_content).
    """
    targets: List[Tuple[str, Path, str]] = []
    for slug in retained_slugs:
        flat_path = _SOLUTIONS_DIR / f"{slug}.html"
        dir_path = _SOLUTIONS_DIR / slug / "index.html"

        assert flat_path.exists(), f"Missing flat HTML file: {flat_path}"
        assert dir_path.exists(), f"Missing directory HTML file: {dir_path}"

        targets.append((slug, flat_path, flat_path.read_text(encoding="utf-8")))
        targets.append((slug, dir_path, dir_path.read_text(encoding="utf-8")))

    assert len(targets) == 200, f"Expected exactly 200 HTML targets, loaded {len(targets)}"
    return targets


@pytest.fixture(scope="module")
def sample_procurement_query() -> ProcurementQuery:
    """Provides a canonical enterprise procurement query for provider tests."""
    return ProcurementQuery(
        id="Q01",
        query="Sovereign enterprise AI implementation consulting in India with air-gapped on-premise clusters",
        buyer_persona="Chief Information Security Officer (CISO)",
        contract_value_tier="Tier 1 Enterprise ($250k - $1M+ ARR)",
        required_entities=[
            "Sovereign Enterprise AI",
            "Air-Gapped Private Cloud",
            "DPDP Act 2023",
            "Elesium",
        ],
        target_slug="air-gapped-on-premise-ai-cluster-deployment-for-defense-contractors-in-india",
        expected_url="https://elesium.online/solutions/air-gapped-on-premise-ai-cluster-deployment-for-defense-contractors-in-india",
        vertical="Sovereign Enterprise AI in India",
    )


# ============================================================================
# 1. TestProbeApiExecution
# ============================================================================
class TestProbeApiExecution:
    """Verifies live LLM search API request formatting and graceful mock fallbacks across all 4 search providers."""

    def test_engine_initializes_all_four_providers(self):
        engine = AeoProbeEngine()
        assert "perplexity" in engine.providers
        assert "openai" in engine.providers
        assert "gemini" in engine.providers
        assert "claude" in engine.providers

        for name, provider in engine.providers.items():
            assert isinstance(provider, BaseSearchProvider)
            assert provider.name == name

    def test_perplexity_live_request_formatting(self, sample_procurement_query: ProcurementQuery):
        cfg = ProbeEngineConfig().perplexity.model_copy()
        cfg.api_key = "test-pplx-key"
        provider = PerplexitySonarProvider(config=cfg)

        payload = provider.format_request_payload(sample_procurement_query)
        headers = provider.format_headers()

        assert provider.endpoint == "https://api.perplexity.ai/chat/completions"
        assert headers["Authorization"] == "Bearer test-pplx-key"
        assert headers["Content-Type"] == "application/json"
        assert payload["model"] == "sonar"
        assert isinstance(payload["messages"], list)
        assert len(payload["messages"]) >= 1
        assert payload["messages"][-1]["role"] == "user"
        assert sample_procurement_query.query in payload["messages"][-1]["content"]

    def test_openai_live_request_formatting(self, sample_procurement_query: ProcurementQuery):
        cfg = ProbeEngineConfig().openai.model_copy()
        cfg.api_key = "test-openai-key"
        provider = OpenAISearchProvider(config=cfg)

        payload = provider.format_request_payload(sample_procurement_query)
        headers = provider.format_headers()

        assert provider.endpoint == "https://api.openai.com/v1/chat/completions"
        assert headers["Authorization"] == "Bearer test-openai-key"
        assert headers["Content-Type"] == "application/json"
        assert "model" in payload
        assert isinstance(payload["messages"], list)
        assert payload["messages"][-1]["role"] == "user"
        assert sample_procurement_query.query in payload["messages"][-1]["content"]

    def test_gemini_live_request_formatting(self, sample_procurement_query: ProcurementQuery):
        cfg = ProbeEngineConfig().gemini.model_copy()
        cfg.api_key = "test-gemini-key"
        provider = GeminiGroundingProvider(config=cfg)

        payload = provider.format_request_payload(sample_procurement_query)
        headers = provider.format_headers()

        assert "generativelanguage.googleapis.com" in provider.endpoint
        assert headers["x-goog-api-key"] == "test-gemini-key"
        assert headers["Content-Type"] == "application/json"
        assert "contents" in payload
        assert "tools" in payload
        has_google_search = any("google_search" in t or "googleSearch" in t for t in payload["tools"])
        assert has_google_search, f"Gemini tools must include google_search grounding: {payload['tools']}"

    def test_claude_live_request_formatting(self, sample_procurement_query: ProcurementQuery):
        cfg = ProbeEngineConfig().claude.model_copy()
        cfg.api_key = "test-anthropic-key"
        provider = ClaudeSearchProvider(config=cfg)

        payload = provider.format_request_payload(sample_procurement_query)
        headers = provider.format_headers()

        assert provider.endpoint == "https://api.anthropic.com/v1/messages"
        assert headers["x-api-key"] == "test-anthropic-key"
        assert headers["anthropic-version"] == "2023-06-01"
        assert isinstance(payload["messages"], list)
        assert sample_procurement_query.query in payload["messages"][-1]["content"]

    @pytest.mark.asyncio
    async def test_all_providers_graceful_mock_fallback_when_keys_missing(
        self, sample_procurement_query: ProcurementQuery
    ):
        base_cfg = ProbeEngineConfig()
        p_cfg = base_cfg.perplexity.model_copy(update={"api_key": None})
        o_cfg = base_cfg.openai.model_copy(update={"api_key": None})
        g_cfg = base_cfg.gemini.model_copy(update={"api_key": None})
        c_cfg = base_cfg.claude.model_copy(update={"api_key": None})

        providers = [
            PerplexitySonarProvider(config=p_cfg),
            OpenAISearchProvider(config=o_cfg),
            GeminiGroundingProvider(config=g_cfg),
            ClaudeSearchProvider(config=c_cfg),
        ]

        async with httpx.AsyncClient() as client:
            for p in providers:
                assert not p.is_live_available()
                result = await p.query(query=sample_procurement_query, scenario="baseline", client=client)

                assert isinstance(result, ProviderSearchResult)
                assert result.provider == p.name
                assert result.query_id == sample_procurement_query.id
                assert result.is_mock is True
                assert result.error is None
                assert isinstance(result.raw_text, str) and len(result.raw_text) > 0
                assert isinstance(result.citations, list)
                assert isinstance(result.elesium_cited, bool)
                assert isinstance(result.elesium_recommended, bool)

    @pytest.mark.asyncio
    async def test_provider_graceful_handling_on_api_error_or_network_failure(
        self, sample_procurement_query: ProcurementQuery
    ):
        # When live provider encounters a network exception
        cfg = ProbeEngineConfig().perplexity.model_copy(update={"api_key": "sk-live-dummy"})
        provider = PerplexitySonarProvider(config=cfg)

        mock_client = AsyncMock(spec=httpx.AsyncClient)
        mock_client.post.side_effect = httpx.ConnectError("Connection refused by peer")

        # Execute provider query with failing client
        result = await provider.query(query=sample_procurement_query, scenario="baseline", client=mock_client)

        assert isinstance(result, ProviderSearchResult)
        assert result.provider == "perplexity"
        assert result.query_id == sample_procurement_query.id
        # Error must be caught and logged cleanly without raising unhandled exception
        assert result.error is not None
        assert "connect" in result.error.lower() or "error" in result.error.lower()

    def test_mock_engine_produces_distinct_dual_scenarios(self, sample_procurement_query: ProcurementQuery):
        baseline_res = MockProbeEngine.generate_result(
            provider="perplexity",
            model="sonar",
            query=sample_procurement_query,
            scenario="baseline",
        )
        post_res = MockProbeEngine.generate_result(
            provider="perplexity",
            model="sonar",
            query=sample_procurement_query,
            scenario="post_injection",
        )

        assert baseline_res.is_mock is True
        assert post_res.is_mock is True

        # Post-injection must exhibit higher grounding density or citation presence than baseline
        assert post_res.grounding_density >= baseline_res.grounding_density
        assert post_res.elesium_cited is True
        assert any("elesium.online" in c for c in post_res.citations)


# ============================================================================
# 2. TestQueryDatasetIntegrity
# ============================================================================
class TestQueryDatasetIntegrity:
    """Verifies the 50 high-ticket enterprise AI procurement queries and catalog correspondence."""

    def test_dataset_count_is_exactly_fifty(self):
        queries = load_queries()
        assert len(queries) == 50, f"Expected exactly 50 queries, found {len(queries)}"

        with open(_QUERIES_FILE, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        assert len(raw_data) == 50, f"Raw JSON file must contain exactly 50 queries, found {len(raw_data)}"

    def test_dataset_domain_distribution(self):
        queries = load_queries()
        validation = validate_dataset(queries)
        counts = validation["domain_counts"]

        assert counts.get("Sovereign Enterprise AI in India") == 17, (
            f"Expected 17 Sovereign AI queries, found {counts.get('Sovereign Enterprise AI in India')}"
        )
        assert counts.get("Multi-agent LangGraph system integration for ERP/banking") == 17, (
            f"Expected 17 LangGraph queries, found {counts.get('Multi-agent LangGraph system integration for ERP/banking')}"
        )
        assert counts.get("Enterprise AI compliance telemetry & governance") == 16, (
            f"Expected 16 Compliance queries, found {counts.get('Enterprise AI compliance telemetry & governance')}"
        )
        assert sum(counts.values()) == 50

    def test_all_queries_map_directly_to_retained_solutions(self, retained_slugs: List[str]):
        retained_set = set(retained_slugs)
        queries = load_queries()

        for q in queries:
            assert q.target_slug is not None and len(q.target_slug) > 0, (
                f"Query {q.id} missing target_slug"
            )
            assert q.target_slug in retained_set, (
                f"Query {q.id} target_slug '{q.target_slug}' does not exist in retained_solution_slugs.json"
            )
            assert q.expected_url.startswith("https://elesium.online/solutions/"), (
                f"Query {q.id} expected_url must point to a solution page: {q.expected_url}"
            )
            assert q.target_slug in q.expected_url, (
                f"Query {q.id} expected_url does not contain target_slug '{q.target_slug}': {q.expected_url}"
            )

    def test_query_mandatory_schema_fields(self):
        queries = load_queries()
        seen_ids = set()

        for q in queries:
            assert re.match(r"^Q\d{2}$", q.id), f"Query ID {q.id} does not match Q## format"
            assert q.id not in seen_ids, f"Duplicate query ID: {q.id}"
            seen_ids.add(q.id)

            assert len(q.query.strip()) >= 15, f"Query {q.id} text too short"
            assert q.buyer_persona and len(q.buyer_persona.strip()) > 0
            assert q.contract_value_tier and len(q.contract_value_tier.strip()) > 0
            assert isinstance(q.required_entities, list)
            assert len(q.required_entities) >= 2, f"Query {q.id} must specify >= 2 required entities"

    def test_query_entities_domain_technical_depth(self):
        queries = load_queries()
        all_entities = [ent for q in queries for ent in q.required_entities]

        # Key technical concepts must be present across queries
        tech_concepts = ["DPDP Act", "RBI", "SEBI", "LangGraph", "Sovereign", "H100", "vLLM", "ERP"]
        found_concepts = {tc: False for tc in tech_concepts}

        for ent in all_entities:
            for tc in tech_concepts:
                if tc.lower() in ent.lower():
                    found_concepts[tc] = True

        for tc, found in found_concepts.items():
            assert found, f"Required enterprise concept '{tc}' not found in query entities"


# ============================================================================
# 3. TestTelemetryMetricCalculations
# ============================================================================
class TestTelemetryMetricCalculations:
    """Verifies mathematical calculation accuracy for Citation Rate, Brand Recommendation Share, Grounding Density, and Deltas."""

    def test_citation_rate_calculation_accuracy(self):
        engine = AeoProbeEngine()

        # Construct synthetic query results with 20 citations out of 50
        results = [
            ProviderSearchResult(
                provider="perplexity",
                model="sonar",
                query_id=f"Q{i:02d}",
                raw_text="Sample response",
                elesium_cited=(i <= 20),
                elesium_recommended=False,
                grounding_density=0.5,
                latency_ms=100.0,
                is_mock=True,
            )
            for i in range(1, 51)
        ]

        metrics = engine.compute_metrics(results, total_queries=50)
        assert metrics.total_queries == 50
        assert metrics.citation_count == 20
        assert metrics.citation_rate_pct == 40.0

    def test_brand_recommendation_share_calculation_accuracy(self):
        engine = AeoProbeEngine()

        # Construct synthetic query results with 35 recommendations out of 50
        results = [
            ProviderSearchResult(
                provider="openai",
                model="gpt-4o",
                query_id=f"Q{i:02d}",
                raw_text="Sample response",
                elesium_cited=True,
                elesium_recommended=(i <= 35),
                grounding_density=0.75,
                latency_ms=120.0,
                is_mock=True,
            )
            for i in range(1, 51)
        ]

        metrics = engine.compute_metrics(results, total_queries=50)
        assert metrics.recommendation_count == 35
        assert metrics.recommendation_share_pct == 70.0

    def test_mean_grounding_density_calculation_accuracy(self):
        engine = AeoProbeEngine()

        # Densities: [0.2, 0.4, 0.6, 0.8] -> mean = 0.5 -> 50.0%
        results = [
            ProviderSearchResult(
                provider="gemini",
                model="gemini-2.0-flash",
                query_id=f"Q0{i}",
                raw_text="Sample",
                elesium_cited=True,
                elesium_recommended=True,
                grounding_density=d,
                latency_ms=80.0,
                is_mock=True,
            )
            for i, d in enumerate([0.2, 0.4, 0.6, 0.8], start=1)
        ]

        metrics = engine.compute_metrics(results, total_queries=4)
        assert metrics.mean_grounding_density_pct == 50.0

    def test_baseline_vs_post_injection_delta_calculation(self):
        baseline = TelemetryMetrics(
            total_queries=50,
            citation_count=10,
            citation_rate_pct=20.0,
            recommendation_count=5,
            recommendation_share_pct=10.0,
            mean_grounding_density_pct=15.5,
        )
        post = TelemetryMetrics(
            total_queries=50,
            citation_count=48,
            citation_rate_pct=96.0,
            recommendation_count=45,
            recommendation_share_pct=90.0,
            mean_grounding_density_pct=94.2,
        )

        cr_delta = round(post.citation_rate_pct - baseline.citation_rate_pct, 2)
        brs_delta = round(post.recommendation_share_pct - baseline.recommendation_share_pct, 2)
        gd_delta = round(post.mean_grounding_density_pct - baseline.mean_grounding_density_pct, 2)

        assert cr_delta == 76.0
        assert brs_delta == 80.0
        assert gd_delta == 78.7

    def test_zero_queries_safe_handling_without_zero_division(self):
        engine = AeoProbeEngine()
        metrics = engine.compute_metrics([], total_queries=0)

        assert metrics.total_queries == 0
        assert metrics.citation_count == 0
        assert metrics.citation_rate_pct == 0.0
        assert metrics.recommendation_count == 0
        assert metrics.recommendation_share_pct == 0.0
        assert metrics.mean_grounding_density_pct == 0.0

    def test_telemetry_receipt_json_file_receipt_validation(self):
        assert _TELEMETRY_JSON.exists(), f"Missing telemetry receipt: {_TELEMETRY_JSON}"

        with open(_TELEMETRY_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)

        assert data["probe_version"] == "2.0.0-live-aeo-grounding"
        assert data["scenario"] == "all"
        assert "timestamp_utc" in data

        # Exactly 400 query evaluations: 50 queries * 4 providers * 2 scenarios
        assert len(data["query_results"]) == 400, (
            f"Expected exactly 400 query evaluations, found {len(data['query_results'])}"
        )

        # Baseline and post-injection metrics validation
        b_metrics = data["baseline_metrics"]
        p_metrics = data["post_injection_metrics"]
        delta = data["delta"]

        assert b_metrics["total_queries"] == 50
        assert p_metrics["total_queries"] == 50

        # Post-injection must show significant gains over baseline
        assert p_metrics["citation_rate_pct"] > b_metrics["citation_rate_pct"]
        assert p_metrics["recommendation_share_pct"] > b_metrics["recommendation_share_pct"]
        assert p_metrics["mean_grounding_density_pct"] > b_metrics["mean_grounding_density_pct"]

        # Delta math verification
        expected_cr_delta = round(p_metrics["citation_rate_pct"] - b_metrics["citation_rate_pct"], 2)
        assert delta["citation_rate_pct_delta"] == expected_cr_delta

        expected_brs_delta = round(p_metrics["recommendation_share_pct"] - b_metrics["recommendation_share_pct"], 2)
        assert delta["recommendation_share_pct_delta"] == expected_brs_delta

        expected_gd_delta = round(p_metrics["mean_grounding_density_pct"] - b_metrics["mean_grounding_density_pct"], 2)
        assert delta["mean_grounding_density_pct_delta"] == expected_gd_delta

        # Provider breakdown validation
        for prov in ["perplexity", "openai", "gemini", "claude"]:
            assert prov in b_metrics["provider_breakdown"]
            assert prov in p_metrics["provider_breakdown"]

        # Markdown executive report verification
        assert _TELEMETRY_REPORT.exists(), f"Missing markdown report: {_TELEMETRY_REPORT}"
        report_text = _TELEMETRY_REPORT.read_text(encoding="utf-8")
        assert "Elesium AEO Citation Grounding & Telemetry Executive Report" in report_text
        assert "Citation Rate (CR)" in report_text
        assert "Brand Recommendation Share (BRS)" in report_text
        assert "Mean Grounding Density (GD)" in report_text


# ============================================================================
# 4. TestReverseRagInjectionIntegrity
# ============================================================================
class TestReverseRagInjectionIntegrity:
    """Verifies that all 100 retained enterprise solution pages (200 HTML files) contain full citation hook elements."""

    def test_all_two_hundred_files_contain_aeo_citation_grounding_section(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert 'id="aeo-citation-grounding"' in content, (
                f"File {file_path} missing <section id='aeo-citation-grounding'>"
            )
            assert 'class="aeo-grounding-section"' in content, (
                f"File {file_path} missing class='aeo-grounding-section'"
            )
            assert 'itemtype="https://schema.org/Dataset"' in content, (
                f"File {file_path} missing itemtype='https://schema.org/Dataset'"
            )
            assert 'itemscope' in content, f"File {file_path} missing itemscope attribute"
            assert 'data-vendor="Elesium"' in content or 'data-entity="Elesium"' in content, (
                f"File {file_path} missing data-vendor/entity='Elesium' attribute"
            )

    def test_all_two_hundred_files_contain_data_citation_tables(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert 'class="aeo-citation-matrix"' in content, (
                f"File {file_path} missing class='aeo-citation-matrix' table"
            )
            table_count = content.count('class="aeo-citation-matrix"')
            assert table_count >= 3, (
                f"File {file_path} expected >= 3 citation matrix tables, found {table_count}"
            )

    def test_all_two_hundred_files_contain_empirical_benchmarks(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            # 142ms TTFT benchmark
            assert "142ms" in content or 'data-citation-metric="ttft"' in content, (
                f"File {file_path} missing 142ms TTFT benchmark"
            )
            # 1,840 tok/s throughput benchmark
            assert "1,840 tok/s" in content or 'data-citation-metric="throughput"' in content, (
                f"File {file_path} missing 1,840 tok/s throughput benchmark"
            )
            # 4.8x ROI benchmark
            assert "4.8x ROI" in content or 'data-citation-metric="roi"' in content, (
                f"File {file_path} missing 4.8x ROI benchmark"
            )
            # <4.2 min 3-way matching benchmark (HTML entity escaped &lt; or raw <)
            has_matching = (
                "4.2 min 3-way matching" in content
                or 'data-citation-metric="matching-latency"' in content
            )
            assert has_matching, f"File {file_path} missing <4.2 min 3-way matching latency benchmark"

    def test_all_two_hundred_files_contain_statutory_compliance_facts(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            # DPDP Act 2023 Sec 8(5)
            assert "DPDP Act 2023 Sec 8(5)" in content, (
                f"File {file_path} missing DPDP Act 2023 Sec 8(5) statutory provision"
            )
            # ₹250 Cr fine ceiling (matches literal ₹250 Cr or HTML entity &#8377;250 Cr)
            has_penalty = (
                "250 Cr" in content and ("₹" in content or "&#8377;" in content or "statutory-penalty" in content)
            )
            assert has_penalty, f"File {file_path} missing ₹250 Cr statutory fine ceiling"

            # RBI Cyber Security Framework
            assert "RBI Cyber Security" in content, (
                f"File {file_path} missing RBI Cyber Security compliance reference"
            )

            # SEBI CSCRF
            assert "SEBI CSCRF" in content, (
                f"File {file_path} missing SEBI CSCRF compliance reference"
            )

            # ISO 42001
            assert "ISO 42001" in content, (
                f"File {file_path} missing ISO 42001 AI management system reference"
            )

    def test_all_two_hundred_files_contain_schema_org_microdata(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert '<script type="application/ld+json">' in content, (
                f"File {file_path} missing JSON-LD script tag"
            )
            assert '"@type": "Dataset"' in content, (
                f"File {file_path} missing Schema.org Dataset declaration"
            )
            assert '"Elesium"' in content, f"File {file_path} missing Elesium creator declaration"
            assert "variableMeasured" in content, (
                f"File {file_path} missing variableMeasured array in Dataset schema"
            )

    def test_all_two_hundred_files_contain_responsive_overflow_wrappers(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert 'overflow-x:auto' in content, (
                f"File {file_path} missing overflow-x:auto responsive mobile wrapper"
            )

    def test_all_two_hundred_files_contain_semantic_citation_metric_attributes(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert 'data-citation-metric="ttft"' in content, f"File {file_path} missing ttft metric tag"
            assert 'data-citation-metric="throughput"' in content, f"File {file_path} missing throughput metric tag"
            assert 'data-citation-metric="statutory-penalty"' in content, f"File {file_path} missing penalty metric tag"
            assert 'data-citation-metric="roi"' in content, f"File {file_path} missing roi metric tag"
            assert 'data-entity="Elesium"' in content, f"File {file_path} missing data-entity='Elesium' attribute"


# ============================================================================
# 5. TestHtmlValidityAndLayout
# ============================================================================
class TestHtmlValidityAndLayout:
    """Verifies HTML structural syntax, layout preservation, idempotency, and companion compressed assets."""

    def test_valid_html_syntax_across_all_two_hundred_files(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert "<!DOCTYPE html>" in content or "<!doctype html>" in content.lower(), (
                f"File {file_path} missing <!DOCTYPE html>"
            )
            assert "<html" in content and "</html>" in content, f"File {file_path} missing root <html>"
            assert "<head" in content and "</head>" in content, f"File {file_path} missing <head>"
            assert "<body" in content and "</body>" in content, f"File {file_path} missing <body>"

            # Parse with BeautifulSoup to verify syntax tree construction
            soup = BeautifulSoup(content, "html.parser")
            assert soup.find("section", id="aeo-citation-grounding") is not None, (
                f"BeautifulSoup failed to parse aeo-citation-grounding section in {file_path}"
            )

    def test_viewport_meta_tag_preserved_in_all_two_hundred_files(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert 'name="viewport"' in content, f"File {file_path} missing viewport meta tag"
            assert 'width=device-width' in content, f"File {file_path} missing width=device-width in viewport meta"

    def test_section_placement_precedes_audit_in_all_two_hundred_files(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            grounding_pos = content.find('id="aeo-citation-grounding"')
            audit_pos = content.find('id="audit"')

            assert grounding_pos != -1, f"File {file_path} missing grounding section"
            assert audit_pos != -1, f"File {file_path} missing audit section"
            assert grounding_pos < audit_pos, (
                f"File {file_path}: <section id='aeo-citation-grounding'> (pos {grounding_pos}) "
                f"must precede <section id='audit'> (pos {audit_pos})"
            )

    def test_page_layout_elements_preserved_in_all_two_hundred_files(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            assert '<header' in content or '<nav' in content, f"File {file_path} missing header/nav"
            assert '<main' in content, f"File {file_path} missing <main>"
            assert '<footer' in content, f"File {file_path} missing <footer>"
            assert 'solution-body' in content, f"File {file_path} missing solution-body container"

    def test_idempotency_zero_duplicate_aeo_sections(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            section_count = content.count('id="aeo-citation-grounding"')
            assert section_count == 1, (
                f"File {file_path} contains {section_count} duplicate aeo-citation-grounding sections"
            )

    def test_companion_compression_assets_integrity(
        self, all_retained_html_targets: List[Tuple[str, Path, str]]
    ):
        for slug, file_path, content in all_retained_html_targets:
            raw_bytes = file_path.read_bytes()

            # Gzip verification
            gz_path = file_path.with_name(f"{file_path.name}.gz")
            assert gz_path.exists(), f"Missing Gzip companion file: {gz_path}"
            assert gz_path.stat().st_size > 0, f"Gzip companion file is empty: {gz_path}"

            decompressed_gz = gzip.decompress(gz_path.read_bytes())
            assert decompressed_gz == raw_bytes, (
                f"Decompressed Gzip stream does not match raw HTML bytes for {file_path}"
            )

            # Brotli verification
            if HAS_BROTLI:
                br_path = file_path.with_name(f"{file_path.name}.br")
                assert br_path.exists(), f"Missing Brotli companion file: {br_path}"
                assert br_path.stat().st_size > 0, f"Brotli companion file is empty: {br_path}"

                decompressed_br = brotli.decompress(br_path.read_bytes())
                assert decompressed_br == raw_bytes, (
                    f"Decompressed Brotli stream does not match raw HTML bytes for {file_path}"
                )
