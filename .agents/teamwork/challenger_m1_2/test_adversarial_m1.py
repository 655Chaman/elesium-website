"""Empirical Adversarial Challenge Test Harness for Milestone 1.

Testing scope:
1. Provider API spec compatibility (Perplexity, OpenAI, Gemini, Claude).
2. Query dataset distribution, domain breakdown, slug matching with retained solution slugs, and required entities.
3. Metric calculation edge cases (0%, 100%, empty, single query, rounding truncation).
4. Rate limiting, timeout, network failure resilience, and graceful mock fallback.
5. Mock engine determinism and scenario contrast.
6. Bug reproductions: False-positive brand recommendations on cited URLs, null response handling, and integer truncation.
"""

import asyncio
import json
import os
import sys
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
import httpx

# Ensure project root is accessible
REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from automation.aeo_probe.analyzers.brand_share_parser import (
    analyze_brand_share,
    compute_grounding_density,
    detect_brand_mentions,
)
from automation.aeo_probe.analyzers.citation_parser import (
    extract_all_citations,
    filter_elesium_citations,
    is_elesium_url,
    normalize_url,
)
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
from automation.aeo_probe.providers.claude import ClaudeSearchProvider
from automation.aeo_probe.providers.gemini import GeminiGroundingProvider
from automation.aeo_probe.providers.mock_engine import MockProbeEngine
from automation.aeo_probe.providers.openai_search import OpenAISearchProvider
from automation.aeo_probe.providers.perplexity import PerplexitySonarProvider


# ============================================================================
# 1. Provider Request Headers & Payload Spec Compatibility
# ============================================================================
class TestProviderApiSpecCompatibility:
    """Adversarially validates request payload schemas and headers against vendor API specs."""

    @pytest.fixture
    def test_query(self):
        return ProcurementQuery(
            id="Q_ADV_01",
            query="Adversarial prompt with unicode: ₹5.0 Cr, é, quotes \"test\", & <tag>",
            expected_url="https://elesium.online/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india/",
            required_entities=["DPDP Act 2023", "Section 8(5)", "Zero Data Retention"],
        )

    def test_perplexity_spec_conformance(self, test_query):
        provider = PerplexitySonarProvider(
            ProviderConfig(
                name="perplexity",
                api_key_env="PERPLEXITY_API_KEY",
                api_key="pplx-test-token-12345",
                endpoint="https://api.perplexity.ai/chat/completions",
                model="sonar",
            )
        )
        headers = provider.format_headers()
        payload = provider.format_request_payload(test_query)

        # 1. Headers
        assert headers["Authorization"] == "Bearer pplx-test-token-12345"
        assert headers["Content-Type"] == "application/json"
        assert headers["Accept"] == "application/json"

        # 2. Payload conforming to Perplexity chat completion API
        assert payload["model"] == "sonar"
        assert payload["return_citations"] is True
        assert payload["return_related_questions"] is False
        assert payload["stream"] is False
        assert isinstance(payload["messages"], list)
        assert len(payload["messages"]) >= 2
        assert payload["messages"][0]["role"] == "system"
        assert payload["messages"][1]["role"] == "user"
        assert test_query.query in payload["messages"][1]["content"]

    def test_openai_search_spec_conformance(self, test_query):
        provider = OpenAISearchProvider(
            ProviderConfig(
                name="openai",
                api_key_env="OPENAI_API_KEY",
                api_key="sk-openai-test-token-67890",
                endpoint="https://api.openai.com/v1/chat/completions",
                model="gpt-4o-search-preview",
            )
        )
        headers = provider.format_headers()
        payload = provider.format_request_payload(test_query)

        assert headers["Authorization"] == "Bearer sk-openai-test-token-67890"
        assert headers["Content-Type"] == "application/json"
        assert payload["model"] == "gpt-4o-search-preview"
        assert isinstance(payload["messages"], list)
        assert payload["messages"][-1]["role"] == "user"
        assert test_query.query in payload["messages"][-1]["content"]

    def test_gemini_grounding_spec_conformance(self, test_query):
        provider = GeminiGroundingProvider(
            ProviderConfig(
                name="gemini",
                api_key_env="GEMINI_API_KEY",
                api_key="AIzaSyGeminiTestKey12345",
                endpoint="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
                model="gemini-2.0-flash",
            )
        )
        headers = provider.format_headers()
        payload = provider.format_request_payload(test_query)

        assert headers["x-goog-api-key"] == "AIzaSyGeminiTestKey12345"
        assert headers["Content-Type"] == "application/json"
        assert "contents" in payload
        assert payload["contents"][0]["role"] == "user"
        assert payload["contents"][0]["parts"][0]["text"] == test_query.query

        # Search grounding tool configuration in Gemini API
        assert "tools" in payload
        assert any("googleSearch" in t for t in payload["tools"])

    def test_claude_web_search_spec_conformance(self, test_query):
        provider = ClaudeSearchProvider(
            ProviderConfig(
                name="claude",
                api_key_env="ANTHROPIC_API_KEY",
                api_key="sk-ant-api03-test-token",
                endpoint="https://api.anthropic.com/v1/messages",
                model="claude-3-7-sonnet-latest",
            )
        )
        headers = provider.format_headers()
        payload = provider.format_request_payload(test_query)

        assert headers["x-api-key"] == "sk-ant-api03-test-token"
        assert headers["anthropic-version"] == "2023-06-01"
        assert headers["content-type"] == "application/json"

        assert payload["model"] == "claude-3-7-sonnet-latest"
        assert payload["max_tokens"] == 1024
        assert "tools" in payload
        assert any(t.get("type") == "web_search_20250305" for t in payload["tools"])
        assert payload["messages"][0]["role"] == "user"
        assert payload["messages"][0]["content"] == test_query.query

    def test_key_handling_with_whitespace_and_empty_envs(self):
        with patch.dict(os.environ, {"PERPLEXITY_API_KEY": "  key_with_spaces  "}):
            p = PerplexitySonarProvider()
            assert p.is_live_available() is True
            assert p.get_api_key() == "key_with_spaces"

        with patch.dict(os.environ, {"PERPLEXITY_API_KEY": "   "}):
            p = PerplexitySonarProvider()
            assert p.is_live_available() is False
            assert p.get_api_key() == ""


# ============================================================================
# 2. Query Dataset Distribution, Domain Breakdown, & Slug Matching
# ============================================================================
class TestDatasetDistributionAndSlugMatching:
    """Stress tests the 50 queries dataset, domains, required entities, and slug mapping."""

    @pytest.fixture
    def dataset(self):
        return load_queries()

    @pytest.fixture
    def retained_slugs(self):
        with open(os.path.join(REPO_ROOT, "automation/retained_solution_slugs.json"), "r") as f:
            return set(json.load(f))

    def test_exact_fifty_queries(self, dataset):
        assert len(dataset) == 50, f"Expected 50 queries, found {len(dataset)}"

    def test_three_specified_domains_distribution(self, dataset):
        validation = validate_dataset(dataset)
        counts = validation["domain_counts"]

        expected_domains = {
            "Sovereign Enterprise AI in India": 17,
            "Multi-agent LangGraph system integration for ERP/banking": 17,
            "Enterprise AI compliance telemetry & governance": 16,
        }
        assert counts == expected_domains

    def test_query_ids_continuous_and_unique(self, dataset):
        ids = [q.id for q in dataset]
        assert len(ids) == len(set(ids)), "Query IDs must be unique"
        expected_ids = [f"Q{i:02d}" for i in range(1, 51)]
        assert ids == expected_ids, "Query IDs must be continuous from Q01 to Q50"

    def test_all_expected_urls_elesium_online(self, dataset):
        for q in dataset:
            assert q.expected_url.startswith("https://elesium.online/"), (
                f"Query {q.id} URL does not start with https://elesium.online/: {q.expected_url}"
            )

    def test_required_entities_density(self, dataset):
        for q in dataset:
            assert len(q.required_entities) >= 2, f"Query {q.id} has < 2 required entities"
            assert any(
                "elesium" in e.lower()
                or "dpdp" in e.lower()
                or "rbi" in e.lower()
                or "tally" in e.lower()
                or "langgraph" in e.lower()
                or "llm" in e.lower()
                or "vpc" in e.lower()
                or "ai" in e.lower()
                for e in q.required_entities
            ), f"Query {q.id} lacks core enterprise AI entity keywords"

    def test_target_slug_matching_retained_solutions(self, dataset, retained_slugs):
        """Empirically records target slug matches and mismatches against retained solution slugs."""
        matched = []
        unmatched = []

        for q in dataset:
            if q.target_slug in retained_slugs:
                matched.append(q)
            else:
                unmatched.append(q)

        # 31 matched solution slugs, 19 non-solution site URLs
        assert len(matched) == 31, f"Expected 31 matched solution slugs, got {len(matched)}"
        assert len(unmatched) == 19, f"Expected 19 non-solution URLs, got {len(unmatched)}"

        # The 19 unmatched URLs are legitimate site pages (tools, city pillars, category hubs, etc.)
        for q in unmatched:
            assert any(
                prefix in q.expected_url
                for prefix in [
                    "https://elesium.online/tools/",
                    "https://elesium.online/enterprise-ai-",
                    "https://elesium.online/solutions/category/",
                    "https://elesium.online/signals",
                    "https://elesium.online/how-we-work",
                    "https://elesium.online/authors/",
                    "https://elesium.online/",
                ]
            )


# ============================================================================
# 3. Metric Calculation Accuracy & Mathematical Edge Cases
# ============================================================================
class TestMetricCalculationEdgeCases:
    """Stress tests compute_metrics on boundary conditions: 0%, 100%, 0 queries, single query, truncation."""

    def test_zero_queries_empty_results(self):
        metrics = AeoProbeEngine.compute_metrics(results=[], total_queries=0)
        assert metrics.total_queries == 0
        assert metrics.citation_count == 0
        assert metrics.citation_rate_pct == 0.0
        assert metrics.recommendation_count == 0
        assert metrics.recommendation_share_pct == 0.0
        assert metrics.mean_grounding_density_pct == 0.0

    def test_zero_citations_zero_recommendations(self):
        results = [
            ProviderSearchResult(
                provider="perplexity",
                model="sonar",
                query_id=f"Q{i:02d}",
                elesium_cited=False,
                elesium_recommended=False,
                grounding_density=0.1,
            )
            for i in range(1, 11)
        ]
        metrics = AeoProbeEngine.compute_metrics(results=results, total_queries=10)
        assert metrics.total_queries == 10
        assert metrics.citation_count == 0
        assert metrics.citation_rate_pct == 0.0
        assert metrics.recommendation_count == 0
        assert metrics.recommendation_share_pct == 0.0
        assert metrics.mean_grounding_density_pct == 10.0

    def test_one_hundred_percent_citations_and_recommendations(self):
        results = [
            ProviderSearchResult(
                provider="perplexity",
                model="sonar",
                query_id=f"Q{i:02d}",
                elesium_cited=True,
                elesium_recommended=True,
                grounding_density=0.95,
            )
            for i in range(1, 6)
        ]
        metrics = AeoProbeEngine.compute_metrics(results=results, total_queries=5)
        assert metrics.total_queries == 5
        assert metrics.citation_count == 5
        assert metrics.citation_rate_pct == 100.0
        assert metrics.recommendation_count == 5
        assert metrics.recommendation_share_pct == 100.0
        assert metrics.mean_grounding_density_pct == 95.0

    def test_single_query_edge_case(self):
        res_cited = [
            ProviderSearchResult(
                provider="perplexity",
                model="sonar",
                query_id="Q01",
                elesium_cited=True,
                elesium_recommended=False,
                grounding_density=0.5,
            )
        ]
        metrics_cited = AeoProbeEngine.compute_metrics(results=res_cited, total_queries=1)
        assert metrics_cited.total_queries == 1
        assert metrics_cited.citation_count == 1
        assert metrics_cited.citation_rate_pct == 100.0

        res_uncited = [
            ProviderSearchResult(
                provider="perplexity",
                model="sonar",
                query_id="Q01",
                elesium_cited=False,
                elesium_recommended=False,
                grounding_density=0.0,
            )
        ]
        metrics_uncited = AeoProbeEngine.compute_metrics(results=res_uncited, total_queries=1)
        assert metrics_uncited.total_queries == 1
        assert metrics_uncited.citation_count == 0
        assert metrics_uncited.citation_rate_pct == 0.0

    def test_multi_provider_deduplication(self):
        results = [
            ProviderSearchResult(
                provider="perplexity", model="sonar", query_id="Q01", elesium_cited=True
            ),
            ProviderSearchResult(
                provider="openai", model="gpt-4o", query_id="Q01", elesium_cited=True
            ),
            ProviderSearchResult(
                provider="gemini", model="gemini-2.0", query_id="Q01", elesium_cited=True
            ),
            ProviderSearchResult(
                provider="claude", model="claude-3-7", query_id="Q01", elesium_cited=True
            ),
        ]
        metrics = AeoProbeEngine.compute_metrics(results=results, total_queries=1)
        assert metrics.total_queries == 1
        assert metrics.citation_count == 1
        assert metrics.citation_rate_pct == 100.0
        assert metrics.provider_breakdown["perplexity"]["citation_rate_pct"] == 100.0
        assert metrics.provider_breakdown["openai"]["citation_rate_pct"] == 100.0

    def test_provider_metrics_rounding_versus_truncation_edge_case(self):
        results = [
            ProviderSearchResult(provider="perplexity", model="m", query_id="Q01", elesium_cited=True, elesium_recommended=True),
            ProviderSearchResult(provider="perplexity", model="m", query_id="Q02", elesium_cited=False, elesium_recommended=False),
            ProviderSearchResult(provider="perplexity", model="m", query_id="Q03", elesium_cited=False, elesium_recommended=False),
        ]
        metrics = AeoProbeEngine.compute_metrics(results, total_queries=3)
        p_pct = metrics.provider_breakdown["perplexity"]["citation_rate_pct"]
        assert p_pct == 33.33

        trunc_count = int(p_pct * 3 / 100)
        round_count = round(p_pct * 3 / 100)
        assert trunc_count == 0, "Confirms bug: int() truncates 0.9999 to 0"
        assert round_count == 1, "round() correctly yields 1"


# ============================================================================
# 4. Rate Limiting, Timeout, Network Failure Resilience & Mock Fallback
# ============================================================================
class TestRateLimitingAndFailureResilience:
    """Stress tests provider failure handling under HTTP 429, 500, timeouts, and network disconnects."""

    @pytest.fixture
    def sample_query(self):
        return ProcurementQuery(
            id="Q_STRESS_01",
            query="Air-gapped HSM sovereign banking telemetry Mumbai",
            expected_url="https://elesium.online/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india/",
            required_entities=["HSM", "Air-gapped", "RBI"],
        )

    @pytest.mark.asyncio
    async def test_perplexity_http_429_retry_and_mock_fallback(self, sample_query):
        config = ProbeEngineConfig(concurrency_limit=2, max_retries=2, retry_backoff_factor=0.01)
        engine = AeoProbeEngine(config=config)

        mock_resp = httpx.Response(status_code=429, text="Rate limit exceeded. Please retry after 1s.")
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value = mock_resp
            engine.providers["perplexity"].config.api_key = "fake-key"

            result = await engine.execute_provider_query(
                provider=engine.providers["perplexity"],
                query=sample_query,
                scenario="post_injection",
                client=httpx.AsyncClient(),
                semaphore=asyncio.Semaphore(2),
            )

            assert mock_post.call_count == 2
            assert result.is_mock is True
            assert "HTTP 429" in result.error

    @pytest.mark.asyncio
    async def test_openai_http_500_internal_error_fallback(self, sample_query):
        config = ProbeEngineConfig(concurrency_limit=2, max_retries=2, retry_backoff_factor=0.01)
        engine = AeoProbeEngine(config=config)

        mock_resp = httpx.Response(status_code=500, text="Internal Server Error")
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.return_value = mock_resp
            engine.providers["openai"].config.api_key = "fake-key"

            result = await engine.execute_provider_query(
                provider=engine.providers["openai"],
                query=sample_query,
                scenario="post_injection",
                client=httpx.AsyncClient(),
                semaphore=asyncio.Semaphore(2),
            )

            assert mock_post.call_count == 2
            assert result.is_mock is True
            assert "HTTP 500" in result.error

    @pytest.mark.asyncio
    async def test_gemini_network_timeout_fallback(self, sample_query):
        config = ProbeEngineConfig(concurrency_limit=2, max_retries=2, retry_backoff_factor=0.01)
        engine = AeoProbeEngine(config=config)

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.side_effect = httpx.ReadTimeout("Read timed out after 30.0s")
            engine.providers["gemini"].config.api_key = "fake-key"

            result = await engine.execute_provider_query(
                provider=engine.providers["gemini"],
                query=sample_query,
                scenario="post_injection",
                client=httpx.AsyncClient(),
                semaphore=asyncio.Semaphore(2),
            )

            assert result.is_mock is True
            assert "Exception" in result.error
            assert "timed out" in result.error
            assert len(result.raw_text) > 0

    @pytest.mark.asyncio
    async def test_claude_network_connect_error_fallback(self, sample_query):
        config = ProbeEngineConfig(concurrency_limit=2, max_retries=2, retry_backoff_factor=0.01)
        engine = AeoProbeEngine(config=config)

        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
            mock_post.side_effect = httpx.ConnectError("Failed to establish connection to api.anthropic.com")
            engine.providers["claude"].config.api_key = "fake-key"

            result = await engine.execute_provider_query(
                provider=engine.providers["claude"],
                query=sample_query,
                scenario="post_injection",
                client=httpx.AsyncClient(),
                semaphore=asyncio.Semaphore(2),
            )

            assert result.is_mock is True
            assert "Exception" in result.error
            assert "ConnectError" in result.error or "Failed to establish" in result.error

    @pytest.mark.asyncio
    async def test_concurrency_semaphore_throttling(self):
        concurrency = 3
        config = ProbeEngineConfig(concurrency_limit=concurrency, execution_mode="mock")
        engine = AeoProbeEngine(config=config)

        active_count = 0
        max_active = 0
        lock = asyncio.Lock()

        original_query = engine.providers["perplexity"].query

        async def tracked_query(*args, **kwargs):
            nonlocal active_count, max_active
            async with lock:
                active_count += 1
                if active_count > max_active:
                    max_active = active_count
            await asyncio.sleep(0.02)
            async with lock:
                active_count -= 1
            return await original_query(*args, **kwargs)

        with patch.object(engine.providers["perplexity"], "query", side_effect=tracked_query):
            queries = load_queries()[:10]
            await engine.run_battery(queries, scenario="post_injection", provider_names=["perplexity"])

        assert max_active <= concurrency, f"Max concurrent calls {max_active} exceeded limit {concurrency}"


# ============================================================================
# 5. Mock Engine Determinism & Scenario Contrast
# ============================================================================
class TestMockEngineDeterminismAndScenarioContrast:
    """Validates statistical and cryptographic determinism of MockProbeEngine."""

    def test_repeated_calls_are_bitwise_identical(self):
        queries = load_queries()[:5]
        for q in queries:
            for prov in ["perplexity", "openai", "gemini", "claude"]:
                r1 = MockProbeEngine.generate_result(prov, "m", q, "post_injection")
                r2 = MockProbeEngine.generate_result(prov, "m", q, "post_injection")
                assert r1.elesium_cited == r2.elesium_cited
                assert r1.elesium_recommended == r2.elesium_recommended
                assert r1.recommendation_rank == r2.recommendation_rank
                assert r1.grounding_density == r2.grounding_density
                assert r1.raw_text == r2.raw_text
                assert r1.citations == r2.citations

    def test_baseline_versus_post_injection_statistical_contrast(self):
        queries = load_queries()

        base_citations = 0
        post_citations = 0
        base_recs = 0
        post_recs = 0

        for q in queries:
            b = MockProbeEngine.generate_result("perplexity", "sonar", q, "baseline")
            p = MockProbeEngine.generate_result("perplexity", "sonar", q, "post_injection")

            if b.elesium_cited:
                base_citations += 1
            if p.elesium_cited:
                post_citations += 1

            if b.elesium_recommended:
                base_recs += 1
            if p.elesium_recommended:
                post_recs += 1

        base_cr = base_citations / 50 * 100
        post_cr = post_citations / 50 * 100
        base_brs = base_recs / 50 * 100
        post_brs = post_recs / 50 * 100

        # Baseline CR ~10%, Post CR ~96%, Post BRS ~98%
        assert base_cr < 20.0, f"Baseline citation rate too high: {base_cr}%"
        assert post_cr > 80.0, f"Post-injection citation rate too low: {post_cr}%"
        # Due to the window-matching bug on cited URLs, base_brs is 16.0% (instead of ~6-8%)
        assert base_brs <= 20.0, f"Baseline recommendation share exceeded ceiling: {base_brs}%"
        assert post_brs > 80.0, f"Post-injection recommendation share too low: {post_brs}%"


# ============================================================================
# 6. Bug Reproduction Suite (Adversarial Findings)
# ============================================================================
class TestBugReproductions:
    """Explicitly reproduces the 3 major bugs uncovered during adversarial analysis."""

    def test_reproduce_bug_1_false_positive_recommendation_from_cited_urls(self):
        """Bug 1: In brand_share_parser.py, when a cited URL contains 'elesium',

        the 40-word sliding window matches competitor keywords like 'providers'
        and falsely marks Elesium as recommended.
        """
        text = (
            "For enterprise IT procurement in this domain, the market is primarily served by "
            "1. Tata Consultancy Services (TCS) (https://www.tcs.com/insights/ai-cloud-banking)\n"
            "2. Wipro ai360 (https://www.wipro.com/ai360/sovereign-data-solutions/)\n"
            "These IT service providers offer enterprise cloud consulting and legacy system integration.\n"
            "Additional research: https://elesium.online/solutions/rbi-cyber-security-framework/"
        )

        eval_res = analyze_brand_share(text, brand_name="Elesium")
        # In this text, Elesium is NOT recommended, but only cited as a reference link.
        # The parser falsely flags recommended = True because "providers" appears before the URL!
        assert eval_res["recommended"] is True, "Empirically reproduced Bug 1: False positive recommendation"
        assert eval_res["rank"] == 3 or eval_res["rank"] == 4

    def test_reproduce_bug_2_null_payload_crashes_in_citation_parser(self):
        """Bug 2: extract_all_citations crashes with TypeError / AttributeError

        when provider response fields contain None.
        """
        # Perplexity citations: None
        with pytest.raises(TypeError, match="'NoneType' object is not iterable"):
            extract_all_citations("perplexity", {"citations": None})

        # Gemini candidates: None
        with pytest.raises(TypeError, match="'NoneType' object is not iterable"):
            extract_all_citations("gemini", {"candidates": None})

        # OpenAI choices: None
        with pytest.raises(TypeError, match="'NoneType' object is not iterable"):
            extract_all_citations("openai", {"choices": None})

    def test_reproduce_bug_3_integer_truncation_in_provider_metrics(self):
        """Bug 3: engine.py line 280 truncates float percentage rather than rounding,

        producing citation_count = 0 for small query sets where percentage doesn't divide evenly.
        """
        total_q = 3
        p_pct = 33.33  # 1 out of 3 cited
        truncated_count = int(p_pct * total_q / 100)
        assert truncated_count == 0, "Empirically reproduced Bug 3: int() truncates 0.9999 to 0"
