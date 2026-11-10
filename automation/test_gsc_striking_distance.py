"""
=============================================================================
TEST GSC STRIKING DISTANCE ENGINE (MODULE 4) — AUTOMATED TEST BATTERY
=============================================================================
Classification: Pytest Unit & Integration Tests for Brian Kato GSC Engine
Methodology: Brian Kato (SEO Rockstars 2026 Day 2) & Edward Sturm On-Page Calibration
=============================================================================
"""

import os
import json
import pytest
from pathlib import Path

from automation.gsc_engine.config import (
    SITE_URL,
    STRIKING_DISTANCE_POS_MIN,
    STRIKING_DISTANCE_POS_MAX,
    CAPSULE_MIN_WORDS,
    CAPSULE_MAX_WORDS,
    CURATED_SOLUTIONS_PATH,
)
from automation.gsc_engine.models import (
    GSCQueryRecord,
    StrikingDistanceOpportunity,
    IntentCategory,
    OptimizationPayload,
)
from automation.gsc_engine.regex_classifier import (
    classify_query,
    get_intent_multiplier,
    INTENT_MULTIPLIERS,
)
from automation.gsc_engine.connector import GSCConnector
from automation.gsc_engine.striking_distance import (
    StrikingDistanceAnalyzer,
    calculate_opportunity_score,
    extract_slug_from_page,
)
from automation.gsc_engine.content_synthesizer import (
    ContentSynthesizer,
    calibrate_answer_capsule,
    count_words,
)
from automation.gsc_engine.html_injector import HTMLInjector
from automation.gsc_engine.pipeline import StrikingDistancePipeline


# ---------------------------------------------------------------------------
# Test 1: Regex RE2 Intent Classification (Brian Kato Methodology)
# ---------------------------------------------------------------------------
class TestRegexClassification:
    def test_ai_conversational_queries(self):
        queries = [
            "how to deploy vllm custom kernels in private vpc",
            "what is the certified p99 latency for rbi hsm telemetry",
            "why use air gapped vpc for banking ai agents in india",
            "can enterprise ai agents meet dpdp act 2023 compliance",
        ]
        for q in queries:
            intent, pat = classify_query(q)
            assert intent in (IntentCategory.AI_CONVERSATIONAL, IntentCategory.TECHNICAL_ARCHITECTURE)
            assert pat is not None

    def test_commercial_investigation_queries(self):
        queries = [
            "vllm vs tgi enterprise latency comparison",
            "best ai automation agency in india for manufacturing",
            "top sovereign llm deployment pricing breakdown india",
            "on premise llm alternative to openai for banking",
        ]
        for q in queries:
            intent, pat = classify_query(q)
            assert intent in (IntentCategory.COMMERCIAL_INVESTIGATION, IntentCategory.TECHNICAL_ARCHITECTURE)

    def test_technical_architecture_precedence(self):
        q = "pagedattention custom kernel latency benchmark on nvidia h100"
        intent, pat = classify_query(q)
        assert intent == IntentCategory.TECHNICAL_ARCHITECTURE
        assert pat in ("pagedattention", "kernel", "latency", "h100", "benchmark")

    def test_enterprise_procurement_queries(self):
        q = "enterprise ai deployment contractor bangalore rbi compliance"
        intent, pat = classify_query(q)
        assert intent in (IntentCategory.ENTERPRISE_PROCUREMENT, IntentCategory.TECHNICAL_ARCHITECTURE)

    def test_intent_multipliers(self):
        assert get_intent_multiplier(IntentCategory.TECHNICAL_ARCHITECTURE) == 1.25
        assert get_intent_multiplier(IntentCategory.ENTERPRISE_PROCUREMENT) == 1.20
        assert get_intent_multiplier(IntentCategory.COMMERCIAL_INVESTIGATION) == 1.15
        assert get_intent_multiplier(IntentCategory.AI_CONVERSATIONAL) == 1.05
        assert get_intent_multiplier(IntentCategory.INFORMATIONAL) == 1.00


# ---------------------------------------------------------------------------
# Test 2: GSC Connector & Mock Simulator
# ---------------------------------------------------------------------------
class TestGSCConnector:
    def test_mock_initialization_when_no_credentials(self, monkeypatch):
        # Ensure env vars are empty
        monkeypatch.delenv("GSC_SERVICE_ACCOUNT_JSON", raising=False)
        monkeypatch.delenv("GSC_CLIENT_ID", raising=False)
        connector = GSCConnector()
        assert connector.auth_mode == "MOCK_SIMULATOR"

    def test_fetch_search_analytics_generation(self):
        connector = GSCConnector()
        records = connector.fetch_search_analytics()
        assert len(records) >= 100
        # Check first record structure
        r = records[0]
        assert isinstance(r, GSCQueryRecord)
        assert r.query
        assert r.page.startswith("https://")
        assert r.impressions > 0
        assert 0.0 <= r.ctr <= 1.0
        assert r.position > 0.0
        assert isinstance(r.intent, IntentCategory)


# ---------------------------------------------------------------------------
# Test 3: Striking Distance Scoring & Filtering (Positions 8.0 to 20.0)
# ---------------------------------------------------------------------------
class TestStrikingDistanceAnalyzer:
    def test_position_boundaries(self):
        records = [
            GSCQueryRecord("query-top3", f"{SITE_URL}/solutions/test-slug", 50, 200, 0.25, 2.1),   # Out of bound (< 8.0)
            GSCQueryRecord("query-strike-1", f"{SITE_URL}/solutions/test-slug", 10, 1500, 0.007, 8.5), # In bound (8.5)
            GSCQueryRecord("query-strike-2", f"{SITE_URL}/solutions/test-slug", 5, 1200, 0.004, 19.8), # In bound (19.8)
            GSCQueryRecord("query-under", f"{SITE_URL}/solutions/test-slug", 1, 300, 0.003, 24.5),   # Out of bound (> 20.0)
        ]
        analyzer = StrikingDistanceAnalyzer(pos_min=8.0, pos_max=20.0, min_impressions=500, max_ctr=0.03)
        opps = analyzer.filter_striking_distance_queries(records)

        assert len(opps) == 2
        opp_queries = [o.query for o in opps]
        assert "query-strike-1" in opp_queries
        assert "query-strike-2" in opp_queries
        assert "query-top3" not in opp_queries
        assert "query-under" not in opp_queries

    def test_mathematical_opportunity_formula(self):
        score, unrealized, rank_weight, intent_mult, proj_clicks = calculate_opportunity_score(
            impressions=2000,
            ctr=0.01,
            position=8.0,
            intent=IntentCategory.TECHNICAL_ARCHITECTURE,
        )
        # Unrealized = 2000 * 0.99 = 1980
        assert abs(unrealized - 1980.0) < 0.01
        # Rank weight = 1 / log2(8) = 1 / 3 = 0.3333...
        assert abs(rank_weight - (1.0 / 3.0)) < 0.001
        # Intent multiplier = 1.25
        assert intent_mult == 1.25
        # Expected score = 1980 * (1/3) * 1.25 = 825.0
        assert abs(score - 825.0) < 0.5
        # Projected top 3 clicks = 2000 * 0.285 = 570
        assert proj_clicks == 570

    def test_slug_extraction(self):
        assert extract_slug_from_page(f"{SITE_URL}/solutions/vllm-deployment") == "vllm-deployment"
        assert extract_slug_from_page("https://elesium.online/solutions/vllm-deployment/") == "vllm-deployment"
        assert extract_slug_from_page("https://elesium.online/markets") == "markets"


# ---------------------------------------------------------------------------
# Test 4: Answer Capsule Word Count Assertion (Edward Sturm 42–48 Words)
# ---------------------------------------------------------------------------
class TestAnswerCapsuleCalibration:
    def test_word_count_strictly_within_sweet_spot(self):
        with open(CURATED_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
            solutions = json.load(f)

        # Test across first 20 solutions
        for sol in solutions[:20]:
            slug = sol.get("slug")
            capsule, wc = calibrate_answer_capsule(
                query=f"{sol.get('keyword')} benchmark",
                slug=slug,
                solution=sol,
            )
            assert (
                CAPSULE_MIN_WORDS <= wc <= CAPSULE_MAX_WORDS
            ), f"Slug '{slug}' capsule word count {wc} out of range [{CAPSULE_MIN_WORDS}, {CAPSULE_MAX_WORDS}]! Text: {capsule}"


# ---------------------------------------------------------------------------
# Test 5: Content Synthesizer Non-Generic Technical Assertions
# ---------------------------------------------------------------------------
class TestContentSynthesizer:
    def test_technical_hardware_and_statutory_grounding(self):
        with open(CURATED_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
            solutions = json.load(f)

        synthesizer = ContentSynthesizer(solutions)
        sol = solutions[0]
        slug = sol["slug"]

        opp = StrikingDistanceOpportunity(
            query=f"{sol['keyword']} benchmark latency",
            page=f"{SITE_URL}/solutions/{slug}",
            slug=slug,
            clicks=14,
            impressions=2400,
            ctr=0.0058,
            position=9.2,
            intent=IntentCategory.TECHNICAL_ARCHITECTURE,
            opportunity_score=850.0,
            unrealized_clicks=2386.0,
            rank_distance_weight=0.31,
            intent_multiplier=1.25,
            projected_top3_clicks=684,
        )

        payload = synthesizer.synthesize_optimization_payload(
            slug=slug,
            page_url=f"{SITE_URL}/solutions/{slug}",
            primary_opp=opp,
            secondary_opps=[],
        )

        # Verify payload fields
        assert payload.slug == slug
        assert CAPSULE_MIN_WORDS <= payload.answer_capsule_word_count <= CAPSULE_MAX_WORDS
        # Check non-generic engineering terminology presence
        html = payload.container_section_html
        assert "striking-distance-optimization" in html
        assert "data-gsc-query" in html
        assert "p99" in html
        # Check JSON-LD schema
        schema = payload.json_ld_schema
        assert schema["@context"] == "https://schema.org"
        assert schema["@type"] == "FAQPage"
        assert len(schema["mainEntity"]) >= 2
        for item in schema["mainEntity"]:
            assert item["@type"] == "Question"
            assert "acceptedAnswer" in item
            assert item["acceptedAnswer"]["@type"] == "Answer"


# ---------------------------------------------------------------------------
# Test 6: HTML Injector Idempotency & Schema AST Integrity
# ---------------------------------------------------------------------------
class TestHTMLInjector:
    def test_idempotent_injection(self, tmp_path):
        sample_html = """<!DOCTYPE html>
<html>
<head>
  <title>Sample Solution</title>
</head>
<body>
  <header>Header</header>
  <main>
    <h1>Solution Title</h1>
    <p>Existing content paragraph.</p>
    <section id="aeo-empirical-benchmarks">AEO benchmarks</section>
  </main>
  <footer>Footer</footer>
</body>
</html>"""

        dist_dir = tmp_path / "solutions"
        dist_dir.mkdir(parents=True)
        slug = "test-solution-slug"
        slug_dir = dist_dir / slug
        slug_dir.mkdir()
        html_file = slug_dir / "index.html"
        html_file.write_text(sample_html, encoding="utf-8")

        injector = HTMLInjector(dist_dir=dist_dir)

        payload = OptimizationPayload(
            slug=slug,
            page_url=f"{SITE_URL}/solutions/{slug}",
            primary_query="test striking query",
            secondary_queries=[],
            answer_capsule_html="Sample capsule text for testing purposes.",
            answer_capsule_word_count=45,
            technical_spec_callout_html="<div>Tech specs</div>",
            faq_section_html="<div>FAQ section</div>",
            json_ld_schema={"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": []},
            container_section_html='<section id="striking-distance-optimization">Container Content</section>',
        )

        # First injection
        success, count, msg = injector.inject_payload(payload)
        assert success is True
        assert count == 1

        content_1 = html_file.read_text(encoding="utf-8")
        assert 'id="striking-distance-faq-schema"' in content_1
        assert '<section id="striking-distance-optimization">' in content_1

        # Second injection (Idempotency test)
        success_2, count_2, msg_2 = injector.inject_payload(payload)
        assert success_2 is True
        content_2 = html_file.read_text(encoding="utf-8")

        # Must not duplicate sections or schemas
        assert content_2.count('id="striking-distance-faq-schema"') == 1
        assert content_2.count('<section id="striking-distance-optimization">') == 1


# ---------------------------------------------------------------------------
# Test 7: End-to-End Pipeline Dry Run
# ---------------------------------------------------------------------------
class TestPipelineExecution:
    def test_dry_run_pipeline(self):
        pipeline = StrikingDistancePipeline(dry_run=True)
        summary = pipeline.run()

        assert summary.total_gsc_queries_ingested > 0
        assert summary.total_striking_distance_queries > 0
        assert summary.total_impressions_pool > 0
        assert summary.total_unrealized_clicks > 0
        assert summary.projected_monthly_traffic_uplift > 0
        assert summary.total_pages_optimized == 100
        assert len(summary.top_opportunities) > 0
