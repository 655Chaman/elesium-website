#!/usr/bin/env python3
"""
=============================================================================
GSC STRIKING DISTANCE ENGINE — FLAW REMEDIATION REGRESSION TEST BATTERY
=============================================================================
Classification: Unit & Integration Regression Suite (Post-Audit Flaws B-F1 to B-F13)
Reference: audit_report.md Section 2.2 & 3.2
=============================================================================
"""

import pytest
from pathlib import Path

from automation.gsc_engine.config import (
    TIER_1_POS_MIN,
    TIER_1_POS_MAX,
    TIER_2_POS_MIN,
    TIER_2_POS_MAX,
    PROJECTED_TOP_3_CTR,
)
from automation.gsc_engine.models import IntentCategory, OptimizationPayload
from automation.gsc_engine.striking_distance import (
    extract_slug_from_page,
    wilson_score_interval,
    calculate_opportunity_score,
)
from automation.gsc_engine.html_injector import HTMLInjector


class TestGSCFlawRemediations:
    """Regression tests verifying all Option B flaws identified in audit_report.md are resolved."""

    def test_flaw_b_f1_wilson_score_interval(self):
        """B-F1: Wilson score interval must bound CTR confidence correctly."""
        # 10 clicks out of 1000 impressions -> observed CTR = 0.01
        lower, upper = wilson_score_interval(clicks=10, impressions=1000, confidence=0.95)
        assert 0.005 < lower < 0.010
        assert 0.010 < upper < 0.020

    def test_flaw_b_f2_empirical_ctr_gap_opportunity_scoring(self):
        """B-F2: Empirical CTR gap mode must reward actionable delta rather than zero clicks."""
        score, unrealized, rank_weight, intent_mult, proj_clicks = calculate_opportunity_score(
            impressions=2000,
            ctr=0.01,
            position=8.0,
            intent=IntentCategory.TECHNICAL_ARCHITECTURE,
            use_empirical_ctr_gap=True,
        )
        # Expected CTR is ~0.285. Actual is 0.01. Delta is 0.275.
        # Unrealized clicks = 2000 * 0.275 = 550.0
        assert abs(unrealized - 550.0) < 1.0
        assert rank_weight > 0.0
        assert score > 0.0

    def test_flaw_b_f3_slug_extraction_extensions_and_prefixes(self):
        """B-F3: extract_slug_from_page must handle .html extensions, decoded spaces, and prefixes."""
        assert extract_slug_from_page("https://elesium.online/solutions/custom-vllm.html") == "custom-vllm"
        assert extract_slug_from_page("https://elesium.online/markets/banking-cloud.htm") == "banking-cloud"
        assert extract_slug_from_page("https://elesium.online/solutions/ai%20agents/") == "ai agents"
        assert extract_slug_from_page("https://elesium.online/case-studies/hdfc-latency") == "hdfc-latency"

    def test_flaw_b_f4_html_injector_strips_duplicate_sections(self, tmp_path):
        """B-F4: HTMLInjector must idempotently clean duplicate striking distance sections."""
        dist_dir = tmp_path / "solutions"
        dist_dir.mkdir(parents=True)
        slug = "sample-clean-slug"
        slug_dir = dist_dir / slug
        slug_dir.mkdir()
        html_file = slug_dir / "index.html"

        # Create HTML with two existing duplicate sections
        duplicate_html = """<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <main>
    <section id="striking-distance-optimization">Old Content 1</section>
    <section id="striking-distance-optimization">Old Content 2</section>
  </main>
</body>
</html>"""
        html_file.write_text(duplicate_html, encoding="utf-8")

        injector = HTMLInjector(dist_dir=dist_dir)
        payload = OptimizationPayload(
            slug=slug,
            page_url=f"https://elesium.online/solutions/{slug}",
            primary_query="test query",
            secondary_queries=[],
            answer_capsule_html="Clean capsule",
            answer_capsule_word_count=45,
            technical_spec_callout_html="<div>specs</div>",
            faq_section_html="<div>faq</div>",
            json_ld_schema={"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": []},
            container_section_html='<section id="striking-distance-optimization">Clean Single Content</section>',
        )

        success, count, msg = injector.inject_payload(payload)
        assert success is True
        content = html_file.read_text(encoding="utf-8")
        assert content.count('id="striking-distance-optimization"') == 1
        assert "Clean Single Content" in content
