"""Comprehensive unit and integration test suite for AEO Grounding Probe Engine."""

import asyncio
import json
import os
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

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
# 1. Dataset Integrity Tests (R2)
# ============================================================================
class TestQueryDatasetIntegrity:
    """Verifies dataset size, fields, schemas, and domain distribution."""

    def test_query_count_is_exactly_fifty(self):
        queries = load_queries()
        assert len(queries) == 50, f"Expected 50 queries, found {len(queries)}"

    def test_domain_distribution(self):
        queries = load_queries()
        validation = validate_dataset(queries)
        counts = validation["domain_counts"]

        assert counts.get("Sovereign Enterprise AI in India") == 17
        assert counts.get("Multi-agent LangGraph system integration for ERP/banking") == 17
        assert counts.get("Enterprise AI compliance telemetry & governance") == 16

    def test_query_required_fields_and_slugs(self):
        queries = load_queries()
        for q in queries:
            assert q.id.startswith("Q"), f"Invalid query ID {q.id}"
            assert len(q.query.strip()) >= 15
            assert q.expected_url.startswith("https://elesium.online")
            assert len(q.required_entities) >= 2
            assert q.target_slug is not None and len(q.target_slug) > 0

    def test_query_helpers(self):
        q1 = get_query_by_id("Q01")
        assert q1 is not None
        assert q1.id == "Q01"
        assert "Sovereign" in q1.query

        sovereign_queries = get_queries_by_domain("Sovereign")
        assert len(sovereign_queries) == 17

        non_existent = get_query_by_id("Q999")
        assert non_existent is None

    def test_all_target_slugs_match_retained_solutions(self):
        queries = load_queries()
        retained_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "automation",
            "retained_solution_slugs.json",
        )
        with open(retained_path, "r", encoding="utf-8") as f:
            retained_slugs = set(json.load(f))

        for q in queries:
            assert q.target_slug in retained_slugs, (
                f"Query {q.id} target slug '{q.target_slug}' not found in retained solution catalog"
            )
            assert q.expected_url.startswith("https://elesium.online/solutions/"), (
                f"Query {q.id} expected_url must point to a solution route"
            )


# ============================================================================
# 2. Pydantic Models & Normalization Tests
# ============================================================================
class TestPydanticModels:
    """Tests Pydantic v2 model validation, alias handling, and receipt serialization."""

    def test_procurement_query_slug_and_domain_derivation(self):
        # Case 1: slug derived from solutions path
        q1 = ProcurementQuery(
            id="Q100",
            query="Test query with solutions path",
            expected_url="https://elesium.online/solutions/custom-agent-slug/",
            domain="FinTech",
        )
        assert q1.target_slug == "custom-agent-slug"
        assert q1.vertical == "FinTech"
        assert q1.domain == "FinTech"

        # Case 2: vertical given instead of domain
        q2 = ProcurementQuery(
            id="Q101",
            query="Test query with vertical",
            expected_url="https://elesium.online/enterprise-ai-mumbai/",
            vertical="Banking",
        )
        assert q2.target_slug == "enterprise-ai-mumbai"
        assert q2.domain == "Banking"

    def test_provider_search_result_defaults(self):
        res = ProviderSearchResult(
            provider="perplexity",
            model="sonar",
            query_id="Q01",
            raw_text="Sample response",
        )
        assert res.elesium_cited is False
        assert res.elesium_recommended is False
        assert res.matched_entities == []
        assert res.grounding_density == 0.0

    def test_receipt_serialization_roundtrip(self):
        receipt = AeoTelemetryReceipt(
            timestamp_utc="2026-11-10T06:00:00Z",
            execution_mode="mock",
            scenario="dual",
            baseline_metrics=TelemetryMetrics(
                total_queries=50,
                citation_count=6,
                citation_rate_pct=12.0,
                recommendation_count=4,
                recommendation_share_pct=8.0,
                mean_grounding_density_pct=16.0,
            ),
            post_injection_metrics=TelemetryMetrics(
                total_queries=50,
                citation_count=46,
                citation_rate_pct=92.0,
                recommendation_count=43,
                recommendation_share_pct=86.0,
                mean_grounding_density_pct=91.8,
            ),
            delta={
                "citation_rate_pct_delta": 80.0,
                "recommendation_share_pct_delta": 78.0,
            },
        )
        json_data = receipt.model_dump_json()
        assert "2.0.0-live-aeo-grounding" in json_data
        parsed = AeoTelemetryReceipt.model_validate_json(json_data)
        assert parsed.delta["citation_rate_pct_delta"] == 80.0


# ============================================================================
# 3. Citation Parser & URL Normalization Tests (R1, R3)
# ============================================================================
class TestCitationParser:
    """Tests URL normalizer, domain matching, and multi-provider extraction."""

    def test_normalize_url(self):
        assert normalize_url("https://elesium.online/path/?utm=123#frag") == "https://elesium.online/path"
        assert normalize_url("https://Elesium.Online/Solutions///") == "https://elesium.online/solutions"
        assert normalize_url("<https://elesium.ai/about>") == "https://elesium.ai/about"
        assert normalize_url("") == ""

    def test_is_elesium_url(self):
        assert is_elesium_url("https://elesium.online/enterprise-ai-bangalore/") is True
        assert is_elesium_url("https://sub.elesium.online/page") is True
        assert is_elesium_url("https://elesium.ai/signals") is True
        assert is_elesium_url("https://elesium.com/us/") is True
        assert is_elesium_url("https://tcs.com/ai-services") is False
        assert is_elesium_url("https://fake-elesium.org") is False

    def test_extract_all_citations_multi_provider(self):
        # Perplexity response schema
        raw_pplx = {"citations": ["https://elesium.online/solutions/vllm/", "https://tcs.com/ai"]}
        pplx_cits = extract_all_citations("perplexity", raw_pplx, "Some text")
        assert "https://elesium.online/solutions/vllm/" in pplx_cits

        # Gemini response schema
        raw_gemini = {
            "candidates": [
                {
                    "groundingMetadata": {
                        "groundingChunks": [
                            {"web": {"uri": "https://elesium.online/tools/calculator"}},
                            {"web": {"uri": "https://infosys.com/topaz"}},
                        ]
                    }
                }
            ]
        }
        gem_cits = extract_all_citations("gemini", raw_gemini, "")
        assert "https://elesium.online/tools/calculator" in gem_cits

        # OpenAI annotations schema
        raw_openai = {
            "choices": [
                {
                    "message": {
                        "annotations": [
                            {"type": "url_citation", "url": "https://elesium.online/signals/"}
                        ]
                    }
                }
            ]
        }
        oai_cits = extract_all_citations("openai", raw_openai, "")
        assert "https://elesium.online/signals/" in oai_cits

        # Claude citations schema
        raw_claude = {
            "content": [
                {
                    "type": "text",
                    "text": "Check Elesium",
                    "citations": [{"url": "https://elesium.online/enterprise-ai-mumbai/"}],
                }
            ]
        }
        claude_cits = extract_all_citations("claude", raw_claude, "")
        assert "https://elesium.online/enterprise-ai-mumbai/" in claude_cits

    def test_markdown_and_raw_url_extraction(self):
        text = (
            "We recommend [Elesium Sovereign AI](https://elesium.online/enterprise-ai-bangalore/). "
            "Also consult https://elesium.online/solutions/rbi-framework/ for compliance."
        )
        cits = extract_all_citations("any", None, text)
        assert len(cits) == 2
        elesium_only = filter_elesium_citations(cits)
        assert len(elesium_only) == 2

    def test_extract_all_citations_null_provider_payloads(self):
        # Perplexity citations: None
        assert extract_all_citations("perplexity", {"citations": None}) == []

        # Gemini candidates / grounding / chunks / web None variants
        assert extract_all_citations("gemini", {"candidates": None}) == []
        assert extract_all_citations("gemini", {"candidates": [{"groundingMetadata": None}]}) == []
        assert extract_all_citations("gemini", {"candidates": [{"groundingMetadata": {"groundingChunks": None}}]}) == []
        assert extract_all_citations("gemini", {"candidates": [{"groundingMetadata": {"groundingChunks": [{"web": None}]}}]}) == []

        # OpenAI choices / message / annotations / context / citations None variants
        assert extract_all_citations("openai", {"choices": None}) == []
        assert extract_all_citations("openai", {"choices": [{"message": None}]}) == []
        assert extract_all_citations("openai", {"choices": [{"message": {"annotations": None, "context": None}}]}) == []
        assert extract_all_citations("openai", {"choices": [{"message": {"context": {"citations": None}}}]}) == []

        # Claude content / block / citations None variants
        assert extract_all_citations("claude", {"content": None}) == []
        assert extract_all_citations("claude", {"content": [{"citations": None}]}) == []

    def test_url_hostname_and_credential_parsing(self):
        # Basic auth credentials in URL
        assert is_elesium_url("https://user:password@elesium.online/solutions/") is True
        assert is_elesium_url("https://admin:secret@sub.elesium.ai/path") is True
        assert is_elesium_url("https://user:password@tcs.com/ai") is False

        # Port parsing
        assert is_elesium_url("https://elesium.online:8443/solutions/vllm/") is True

        # Raw URL extraction with @ in credentials
        text = "See deployment guide at https://deployer:token123@elesium.online/solutions/custom-vllm/ for steps."
        cits = extract_all_citations("any", None, text)
        assert any("elesium.online" in c for c in cits)


# ============================================================================
# 4. Brand Share & Grounding Density Parser Tests (R3)
# ============================================================================
class TestBrandShareParser:
    """Tests brand mention, recommendation ranking, and entity density."""

    def test_detect_brand_mentions(self):
        text = "Elesium is an enterprise AI firm. Another mention of elesium here."
        mentions = detect_brand_mentions(text)
        assert len(mentions) == 2

    def test_analyze_brand_share_recommended_rank_one(self):
        text = (
            "Based on technical evaluation, the top vendor is:\n"
            "1. **Elesium** (https://elesium.online/)\n"
            "2. TCS (https://tcs.com)\n"
            "Elesium is the leading provider for sovereign on-premise inference in India."
        )
        eval_res = analyze_brand_share(text, brand_name="Elesium")
        assert eval_res["mentioned"] is True
        assert eval_res["recommended"] is True
        assert eval_res["rank"] == 1

    def test_analyze_brand_share_disqualified(self):
        text = (
            "While Elesium is an option, we caution and do not recommend their solution "
            "due to pending regulatory dispute."
        )
        eval_res = analyze_brand_share(text, brand_name="Elesium")
        assert eval_res["mentioned"] is True
        assert eval_res["recommended"] is False

    def test_analyze_brand_share_competitor_ahead(self):
        text = (
            "For banking enterprise AI, leading choices are Infosys and TCS. "
            "Elesium is also a recommended specialist in DPDP compliance."
        )
        eval_res = analyze_brand_share(text, brand_name="Elesium")
        assert eval_res["mentioned"] is True
        assert eval_res["recommended"] is True
        assert eval_res["rank"] == 3

    def test_compute_grounding_density(self):
        text = (
            "Elesium enforces the DPDP Act 2023 with Section 8(5) Zero Data Retention. "
            "Inference achieves 142ms TTFT with vLLM PagedAttention kernels on H100 clusters."
        )
        required = ["DPDP Act 2023", "Section 8(5)", "142ms", "vLLM", "NonExistentEntity"]
        matched, density = compute_grounding_density(text, required)
        assert len(matched) == 4
        assert density == 0.8
        assert "NonExistentEntity" not in matched

    def test_brand_mention_exclusion_in_cited_urls(self):
        # Elesium cited only as URL reference, while competitors are praised
        text = (
            "For enterprise IT procurement in this domain, the market is primarily served by "
            "1. Tata Consultancy Services (TCS) (https://www.tcs.com/insights/ai-cloud-banking)\n"
            "2. Wipro ai360 (https://www.wipro.com/ai360/sovereign-data-solutions/)\n"
            "These IT service providers offer enterprise cloud consulting and legacy system integration.\n"
            "Additional research: https://elesium.online/solutions/rbi-cyber-security-framework/"
        )
        res = analyze_brand_share(text, brand_name="Elesium")
        assert res["mentioned"] is False
        assert res["recommended"] is False
        assert res["rank"] is None

        # Markdown link target should not count as brand mention if anchor is generic
        md_text = "Check the [technical architecture documentation](https://elesium.online/solutions/vllm/) for specs."
        res_md = analyze_brand_share(md_text, brand_name="Elesium")
        assert res_md["mentioned"] is False

        # But anchor text mentioning brand must count
        anchor_text = "We recommend [Elesium](https://elesium.online/solutions/vllm/) as the premier sovereign partner."
        res_anchor = analyze_brand_share(anchor_text, brand_name="Elesium")
        assert res_anchor["mentioned"] is True
        assert res_anchor["recommended"] is True

    def test_numbered_list_with_negative_disqualifier(self):
        text = "1. TCS\n2. Infosys\n3. Elesium - avoid, we do not recommend this vendor due to deficiencies."
        res = analyze_brand_share(text, brand_name="Elesium")
        assert res["mentioned"] is True
        assert res["recommended"] is False
        assert res["rank"] is None

    def test_competitor_alias_deduplication(self):
        # TCS and Tata Consultancy Services are aliases of the same vendor
        text = "Tata Consultancy Services (TCS) provides enterprise AI. Elesium is also a recommended partner."
        res = analyze_brand_share(text, brand_name="Elesium")
        assert res["mentioned"] is True
        assert res["recommended"] is True
        # Elesium is behind 1 unique competitor (TCS), so rank is 2 (not 3)
        assert res["rank"] == 2

    def test_grounding_density_word_boundary_matching(self):
        # 'OCR' must not match inside 'mediocre'
        matched, density = compute_grounding_density("The team produced mediocre work.", ["OCR"])
        assert matched == []
        assert density == 0.0

        # Exact match should match
        matched_real, density_real = compute_grounding_density("The team deployed OCR models.", ["OCR"])
        assert matched_real == ["OCR"]
        assert density_real == 1.0


# ============================================================================
# 5. Provider Request Formatting & Fallback Tests (R1)
# ============================================================================
class TestProvidersAndMockEngine:
    """Verifies live request payload structures, mock generation, and dry-run fallbacks."""

    @pytest.fixture
    def sample_query(self):
        return ProcurementQuery(
            id="Q01",
            query="Sovereign on-premise LLM deployment India DPDP Act compliance private VPC",
            expected_url="https://elesium.online/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india/",
            required_entities=["DPDP Act 2023", "Section 8(5)", "Zero Data Retention", "Private VPC", "Elesium"],
        )

    def test_perplexity_request_payload_and_headers(self, sample_query):
        provider = PerplexitySonarProvider()
        payload = provider.format_request_payload(sample_query)

        assert payload["model"] == "sonar"
        assert payload["return_citations"] is True
        assert any(sample_query.query in m["content"] for m in payload["messages"])

        with patch.dict(os.environ, {"PERPLEXITY_API_KEY": "test-key-pplx"}):
            headers = provider.format_headers()
            assert headers["Authorization"] == "Bearer test-key-pplx"

    def test_openai_request_payload(self, sample_query):
        provider = OpenAISearchProvider()
        payload = provider.format_request_payload(sample_query)

        assert payload["model"] == "gpt-4o-search-preview"
        assert any(sample_query.query in m["content"] for m in payload["messages"])

    def test_gemini_request_payload(self, sample_query):
        provider = GeminiGroundingProvider()
        payload = provider.format_request_payload(sample_query)

        assert "googleSearch" in payload["tools"][0]
        assert payload["contents"][0]["parts"][0]["text"] == sample_query.query

    def test_claude_request_payload(self, sample_query):
        provider = ClaudeSearchProvider()
        payload = provider.format_request_payload(sample_query)

        assert payload["model"] == "claude-3-7-sonnet-latest"
        assert any("web_search" in t.get("name", "") for t in payload["tools"])

    def test_mock_engine_determinism_and_scenarios(self, sample_query):
        # Deterministic: same query + scenario produces identical result
        res1 = MockProbeEngine.generate_result("perplexity", "sonar", sample_query, scenario="post_injection")
        res2 = MockProbeEngine.generate_result("perplexity", "sonar", sample_query, scenario="post_injection")
        assert res1.elesium_cited == res2.elesium_cited
        assert res1.grounding_density == res2.grounding_density
        assert res1.raw_text == res2.raw_text

        # Baseline vs Post-injection contrast
        base_res = MockProbeEngine.generate_result("perplexity", "sonar", sample_query, scenario="baseline")
        post_res = MockProbeEngine.generate_result("perplexity", "sonar", sample_query, scenario="post_injection")

        # Post-injection must have high grounding density
        assert post_res.grounding_density >= 0.8
        assert base_res.grounding_density < post_res.grounding_density

    @pytest.mark.asyncio
    async def test_providers_graceful_mock_fallback_without_keys(self, sample_query):
        # Ensure no live keys are set
        with patch.dict(os.environ, {}, clear=True):
            for ProviderClass in [
                PerplexitySonarProvider,
                OpenAISearchProvider,
                GeminiGroundingProvider,
                ClaudeSearchProvider,
            ]:
                provider = ProviderClass()
                assert provider.is_live_available() is False

                result = await provider.query(sample_query, scenario="post_injection")
                assert result.is_mock is True
                assert result.provider == provider.name
                assert result.error is None
                assert len(result.raw_text) > 0


# ============================================================================
# 6. Engine Batch Runner & Telemetry Reporting Tests (R3, R5)
# ============================================================================
class TestEngineBatchExecution:
    """Verifies batch execution, metric calculations, and receipt generation."""

    @pytest.mark.asyncio
    async def test_engine_run_battery_and_compute_metrics(self):
        engine = AeoProbeEngine(config=ProbeEngineConfig(execution_mode="mock", concurrency_limit=4))
        queries = load_queries()[:5]  # Sub-battery for fast unit testing

        results = await engine.run_battery(queries, scenario="post_injection")
        assert len(results) == len(queries) * 4  # 5 queries x 4 providers = 20 results

        q_dict = {q.id: q for q in queries}
        metrics = engine.compute_metrics(results, total_queries=len(queries), queries_dict=q_dict)

        assert metrics.total_queries == 5
        assert metrics.citation_rate_pct > 80.0
        assert metrics.recommendation_share_pct > 80.0
        assert metrics.mean_grounding_density_pct > 80.0
        assert metrics.provider_breakdown is not None
        assert "perplexity" in metrics.provider_breakdown

    @pytest.mark.asyncio
    async def test_engine_full_benchmark_and_receipt_generation(self, tmp_path):
        engine = AeoProbeEngine(config=ProbeEngineConfig(execution_mode="mock", concurrency_limit=5))
        queries = load_queries()[:3]  # Fast run

        receipt = await engine.run_full_benchmark(queries=queries, scenario="all")
        assert receipt.baseline_metrics is not None
        assert receipt.post_injection_metrics is not None
        assert "citation_rate_pct_delta" in receipt.delta

        # Verify JSON receipt serialization
        out_file = tmp_path / "telemetry_test.json"
        engine.save_receipt(receipt, output_path=str(out_file))
        assert os.path.exists(out_file)

        with open(out_file, "r") as f:
            data = json.load(f)
            assert data["probe_version"] == "2.0.0-live-aeo-grounding"
            assert len(data["query_results"]) == 3 * 4 * 2  # 3 queries x 4 providers x 2 scenarios

        # Verify Markdown report formatting
        md = engine.generate_markdown_report(receipt)
        assert "# Elesium AEO Citation Grounding" in md
        assert "Citation Rate (CR)" in md
        assert "Perplexity" in md

    @pytest.mark.asyncio
    async def test_engine_run_full_benchmark_empty_queries(self):
        engine = AeoProbeEngine(config=ProbeEngineConfig(execution_mode="mock"))
        receipt = await engine.run_full_benchmark(queries=[])
        assert len(receipt.query_results) == 0
        assert receipt.baseline_metrics.total_queries == 0

    def test_provider_metrics_rounding(self):
        engine = AeoProbeEngine(config=ProbeEngineConfig(execution_mode="mock"))
        # total_q = 3, citation_rate = 33.33% -> 1 citation (not truncated to 0)
        results = [
            ProviderSearchResult(provider="perplexity", model="sonar", query_id="Q01", elesium_cited=True),
            ProviderSearchResult(provider="perplexity", model="sonar", query_id="Q02", elesium_cited=False),
            ProviderSearchResult(provider="perplexity", model="sonar", query_id="Q03", elesium_cited=False),
        ]
        q_dict = {
            f"Q0{i}": ProcurementQuery(
                id=f"Q0{i}",
                query=f"Query {i} about sovereign enterprise AI",
                expected_url=f"https://elesium.online/solutions/slug-{i}/",
                required_entities=["Sovereign", "Elesium"],
            )
            for i in range(1, 4)
        }
        metrics = engine.compute_metrics(results, total_queries=3, queries_dict=q_dict)
        assert metrics.citation_count == 1
        assert metrics.citation_rate_pct == 33.33


# ============================================================================
# 7. Provider Retry & Network Resilience Tests
# ============================================================================
class TestProviderRetryResilience:
    """Verifies that execute_provider_query retries on timeout, connection, and rate limit errors."""

    @pytest.mark.asyncio
    async def test_retry_on_timeout_and_network_error(self):
        engine = AeoProbeEngine(config=ProbeEngineConfig(execution_mode="live", max_retries=3, retry_backoff_factor=0.01))
        query = ProcurementQuery(
            id="Q01",
            query="Test retry query with enterprise context",
            expected_url="https://elesium.online/solutions/test-slug/",
            required_entities=["Test", "Elesium"],
        )

        mock_provider = MagicMock()
        mock_provider.name = "mock_retry"
        mock_provider.build_mock_response.return_value = ProviderSearchResult(
            provider="mock_retry", model="mock", query_id="Q01", is_mock=True
        )

        # Call 1: returns timeout error; Call 2: returns success
        call_count = 0
        async def mock_query(*args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                return ProviderSearchResult(
                    provider="mock_retry",
                    model="mock",
                    query_id="Q01",
                    error="Exception ReadTimeout: connection timed out",
                )
            return ProviderSearchResult(
                provider="mock_retry",
                model="mock",
                query_id="Q01",
                raw_text="Success after retry",
                elesium_cited=True,
            )

        mock_provider.query = mock_query
        semaphore = asyncio.Semaphore(1)

        result = await engine.execute_provider_query(
            provider=mock_provider,
            query=query,
            scenario="post_injection",
            client=AsyncMock(),
            semaphore=semaphore,
        )

        assert call_count == 2
        assert result.raw_text == "Success after retry"
        assert result.elesium_cited is True
