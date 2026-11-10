"""
=============================================================================
TEST TED KUBAITIS CORA SERP CORRELATOR — AUTOMATED TEST BATTERY
=============================================================================
Classification: Pytest Unit & Integration Tests for Cora SERP Engine
Methodology: Ted Kubaitis (SEO Rockstars 2026 Day 1 - Cora 20,000+ Ranking Factors)
=============================================================================
"""

import os
import json
import pytest
from pathlib import Path

from automation.cora_engine.config import (
    VIEWPORT_HEIGHT_PX,
    CORRELATION_SIGNIFICANCE_THRESHOLD,
    CURATED_SOLUTIONS_PATH,
)
from automation.cora_engine.models import (
    SERPCompetitorRecord,
    ATFLayoutProfile,
    ATFChannelTriage,
    FactorCorrelationResult,
    FactorDeficit,
    DeficitReport,
    CoraOptimizationPlan,
)
from automation.cora_engine.correlation_math import (
    calculate_spearman_and_pearson,
    evaluate_factor_correlation,
)
from automation.cora_engine.atf_triage import (
    calculate_interaction_depth,
    triage_serp_layout,
)
from automation.cora_engine.factor_extractor import extract_algorithmic_factors
from automation.cora_engine.serp_harvester import SERPHarvester
from automation.cora_engine.deficit_calculator import DeficitCalculator
from automation.cora_engine.onpage_calibrator import OnPageCalibrator
from automation.cora_engine.pipeline import CoraCorrelationPipeline


# ---------------------------------------------------------------------------
# Test 1: Correlation Mathematics
# ---------------------------------------------------------------------------
class TestCorrelationMath:
    def test_perfect_positive_correlation(self):
        # Higher factor value = better rank (Rank 1 has highest factor value)
        factor_values = [3000.0, 2500.0, 2000.0, 1500.0, 1000.0]
        ranks = [1, 2, 3, 4, 5]
        rs, r, p_val = calculate_spearman_and_pearson(factor_values, ranks)
        assert abs(rs - 1.0) < 0.001
        assert abs(r - 1.0) < 0.001
        assert p_val < 0.05

    def test_inverse_correlation(self):
        # Higher factor value = worse rank (Rank 1 has lowest factor value)
        factor_values = [100.0, 200.0, 300.0, 400.0, 500.0]
        ranks = [1, 2, 3, 4, 5]
        rs, r, p_val = calculate_spearman_and_pearson(factor_values, ranks)
        assert abs(rs - (-1.0)) < 0.001

    def test_significant_factor_evaluation(self):
        factor_values = [2800.0, 2600.0, 2400.0, 1800.0, 1200.0, 900.0]
        ranks = [1, 2, 3, 4, 5, 6]
        res = evaluate_factor_correlation("body_word_count", factor_values, ranks)
        assert res.factor_name == "body_word_count"
        assert res.is_significant is True
        assert res.correlation_direction == "POSITIVE_CORRELATION"
        assert res.spearman_rs >= CORRELATION_SIGNIFICANCE_THRESHOLD


# ---------------------------------------------------------------------------
# Test 2: Above-The-Fold (ATF) Real Estate & Interaction Depth
# ---------------------------------------------------------------------------
class TestATFLayoutAndInteractionDepth:
    def test_interaction_depth_scroll_buckets(self):
        assert calculate_interaction_depth(300) == 0    # Immediately visible
        assert calculate_interaction_depth(844) == 0    # Exactly fold limit
        assert calculate_interaction_depth(950) == 1    # 1 scroll action
        assert calculate_interaction_depth(1800) == 2   # 2 scroll actions
        assert calculate_interaction_depth(2800) == 3   # 3+ scroll actions (Functionally Dead)

    def test_channel_triage_organic_dominant(self):
        profile = triage_serp_layout(
            query="enterprise ai agents bangalore",
            ai_overview=False,
            ads_count=1,
            local_pack=False,
            forums_present=False,
        )
        assert profile.channel_triage == ATFChannelTriage.ORGANIC_ATF
        assert profile.interaction_depth_scrolls == 0

    def test_channel_triage_ai_overview_dominated(self):
        profile = triage_serp_layout(
            query="what is pagedattention kernel latency",
            ai_overview=True,
            ai_overview_height=550,
            ads_count=1,
            local_pack=False,
            forums_present=False,
        )
        assert profile.channel_triage == ATFChannelTriage.AI_OVERVIEW_HYBRID
        assert profile.ai_overview_present is True

    def test_channel_triage_local_pack_dominated(self):
        profile = triage_serp_layout(
            query="ai automation company in bangalore",
            ai_overview=False,
            ads_count=1,
            local_pack=True,
            local_pack_height=460,
            forums_present=False,
        )
        assert profile.channel_triage == ATFChannelTriage.LOCAL_PACK_HYBRID
        assert profile.local_pack_present is True


# ---------------------------------------------------------------------------
# Test 3: Factor Extraction from HTML
# ---------------------------------------------------------------------------
class TestFactorExtractor:
    def test_extract_factors_comprehensive(self):
        sample_html = """<!DOCTYPE html>
<html>
<head>
  <title>Custom PagedAttention Kernel Deployment</title>
  <meta name="description" content="Custom PagedAttention Kernel Deployment guide for banking." />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {"@type": "FAQPage", "mainEntity": []},
      {"@type": "Service", "name": "Banking AI"}
    ]
  }
  </script>
</head>
<body>
  <h1>Custom PagedAttention Kernel Deployment</h1>
  <h2>Enterprise Banking Latency Benchmarks</h2>
  <h2>Kernel Architecture Verification</h2>
  <p>Here is body text discussing kernel execution and hardware memory bandwidth on dedicated hosts.</p>
  <strong>pagedattention</strong>
  <a href="https://www.rbi.org.in">RBI Guidelines</a>
  <a href="/internal-link">Internal</a>
  <table>
    <tr><th>Metric</th><th>Val</th></tr>
    <tr><td>Latency</td><td>138ms</td></tr>
    <tr><td>Throughput</td><td>3450</td></tr>
  </table>
</body>
</html>"""

        factors = extract_algorithmic_factors(sample_html, "pagedattention kernel")
        assert factors["exact_kw_in_title"] == 1.0
        assert factors["exact_kw_in_h1"] == 1.0
        assert factors["h2_count"] == 2.0
        assert factors["exact_kw_in_h2"] >= 1.0
        assert factors["exact_kw_in_bold"] >= 1.0
        assert factors["table_count"] == 1.0
        assert factors["table_row_count"] == 3.0
        assert factors["outbound_statutory_citations"] == 1.0
        assert factors["has_faq_page"] == 1.0
        assert factors["schema_entities_count"] == 2.0
        assert factors["body_word_count"] > 10


# ---------------------------------------------------------------------------
# Test 4: Deficit Calculator & Top 3 Benchmarking
# ---------------------------------------------------------------------------
class TestDeficitCalculator:
    def test_deficit_calculation_and_prescriptions(self):
        elesium_factors = {
            "body_word_count": 2100.0,
            "exact_kw_in_h2": 1.0,
            "table_row_count": 12.0,
            "outbound_statutory_citations": 1.0,
        }

        # Create mock competitors where top 3 have higher numbers
        competitors = [
            SERPCompetitorRecord(1, "https://comp1.com", "Title 1", "Snip 1", 300, {"body_word_count": 3200.0, "exact_kw_in_h2": 3.0, "table_row_count": 24.0, "outbound_statutory_citations": 4.0}),
            SERPCompetitorRecord(2, "https://comp2.com", "Title 2", "Snip 2", 480, {"body_word_count": 3000.0, "exact_kw_in_h2": 3.0, "table_row_count": 22.0, "outbound_statutory_citations": 3.0}),
            SERPCompetitorRecord(3, "https://comp3.com", "Title 3", "Snip 3", 660, {"body_word_count": 2800.0, "exact_kw_in_h2": 3.0, "table_row_count": 20.0, "outbound_statutory_citations": 3.0}),
            SERPCompetitorRecord(9, "https://elesium.online", "Elesium", "Snip", 1700, dict(elesium_factors)),
            SERPCompetitorRecord(15, "https://comp15.com", "Title 15", "Snip", 2700, {"body_word_count": 1200.0, "exact_kw_in_h2": 0.0, "table_row_count": 4.0, "outbound_statutory_citations": 0.0}),
        ]

        atf_profile = triage_serp_layout("test query")
        calc = DeficitCalculator(sig_threshold=0.20)
        report = calc.analyze_deficits(
            slug="test-slug",
            query="test query",
            current_position=9.2,
            atf_profile=atf_profile,
            competitors=competitors,
            elesium_factors=elesium_factors,
        )

        assert report.critical_deficits_count > 0
        def_map = {d.factor_name: d for d in report.deficits}
        assert "body_word_count" in def_map
        # Top 3 mean = (3200 + 3000 + 2800) / 3 = 3000.0. Current = 2100. Deficit = 900.
        assert def_map["body_word_count"].deficit == 900.0
        assert "Expand body copy by +900 words" in def_map["body_word_count"].tuning_action


# ---------------------------------------------------------------------------
# Test 5: On-Page Calibrator & Idempotent HTML Injection
# ---------------------------------------------------------------------------
class TestOnPageCalibrator:
    def test_idempotent_cora_injection(self, tmp_path):
        sample_html = """<!DOCTYPE html>
<html>
<head><title>Sample</title></head>
<body>
  <header>Header</header>
  <main>
    <h1>Title</h1>
    <section id="striking-distance-optimization">Striking distance content</section>
    <section id="aeo-empirical-benchmarks">AEO benchmarks</section>
  </main>
  <footer>Footer</footer>
</body>
</html>"""

        dist_dir = tmp_path / "solutions"
        dist_dir.mkdir(parents=True)
        slug = "sample-slug"
        slug_dir = dist_dir / slug
        slug_dir.mkdir()
        html_file = slug_dir / "index.html"
        html_file.write_text(sample_html, encoding="utf-8")

        calibrator = OnPageCalibrator(dist_dir=dist_dir)
        atf_profile = triage_serp_layout("test query")
        report = DeficitReport(
            slug=slug,
            query="test query",
            current_estimated_position=9.0,
            atf_profile=atf_profile,
            deficits=[
                FactorDeficit("body_word_count", 3000.0, 2100.0, 900.0, True, "Add +900 words"),
            ],
            critical_deficits_count=1,
            recommended_tuning_actions=["Add +900 words"],
        )

        plan = calibrator.build_calibration_plan(
            slug=slug,
            page_url=f"https://elesium.online/solutions/{slug}",
            solution_data={"keyword": "sample query", "complianceBadges": ["DPDP Act 2023"]},
            deficit_report=report,
        )

        assert plan.words_added > 100
        assert "cora-serp-calibration" in plan.calibrated_html_section

        # First injection
        success, count, msg = calibrator.inject_calibration(plan)
        assert success is True
        assert count == 1

        content_1 = html_file.read_text(encoding="utf-8")
        assert 'id="cora-serp-calibration"' in content_1

        # Second injection (Idempotency)
        success_2, count_2, msg_2 = calibrator.inject_calibration(plan)
        assert success_2 is True
        content_2 = html_file.read_text(encoding="utf-8")
        assert content_2.count('id="cora-serp-calibration"') == 1


# ---------------------------------------------------------------------------
# Test 6: End-to-End Pipeline Dry Run
# ---------------------------------------------------------------------------
class TestCoraPipelineExecution:
    def test_dry_run_pipeline(self):
        pipeline = CoraCorrelationPipeline(dry_run=True)
        summary = pipeline.run()

        assert summary.total_queries_analyzed == 100
        assert summary.total_competitors_measured > 1000
        assert summary.total_factors_evaluated > 1000
        assert summary.total_significant_factors_isolated > 0
        assert summary.total_pages_calibrated == 100
        assert len(summary.top_deficit_interventions) > 0
