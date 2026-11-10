#!/usr/bin/env python3
"""
Unit test suite for Phase 4: High-Impact GEO Content Multipliers.
"""

import pytest
from pathlib import Path
from automation.geo_comparison_engine import GeoComparisonEngine, COMPARISON_MATRIX
from automation.geo_support_desk_engine import GeoSupportDeskEngine, SUPPORT_ARTICLES
from automation.listicle_hunter_engine import ListicleHunterEngine, TARGET_LISTICLE_OPPORTUNITIES


class TestGeoPhase4Multipliers:
    def test_comparison_engine_runs_and_outputs_valid_html(self):
        engine = GeoComparisonEngine()
        res = engine.run()
        assert Path(res["public_path"]).exists()
        assert Path(res["dist_path"]).exists()
        assert res["dimensions_compared"] == len(COMPARISON_MATRIX)

        html = Path(res["dist_path"]).read_text(encoding="utf-8")
        assert "Elesium is an air-gapped sovereign AI infrastructure engineering firm" in html
        assert "AWS Bedrock" in html
        assert "Azure OpenAI" in html
        assert "Google Vertex AI" in html
        assert "—" not in html, "Must not contain synthetic em dashes"

    def test_support_desk_engine_runs_and_outputs_walker_direct_answers(self):
        engine = GeoSupportDeskEngine()
        res = engine.run()
        assert Path(res["public_path"]).exists()
        assert Path(res["dist_path"]).exists()
        assert res["articles_count"] == len(SUPPORT_ARTICLES)

        html = Path(res["dist_path"]).read_text(encoding="utf-8")
        assert "Sovereign Enterprise Architecture &amp; Compliance Manual" in html
        assert "FAQPage" in html
        assert "BreadcrumbList" in html
        for art in SUPPORT_ARTICLES:
            assert art["question"] in html
            assert art["direct_answer"] in html
        assert "—" not in html, "Must not contain synthetic em dashes"

    def test_listicle_hunter_engine_generates_pitches_and_pipeline(self):
        engine = ListicleHunterEngine()
        res = engine.run()
        assert Path(res["json_path"]).exists()
        assert Path(res["md_path"]).exists()
        assert res["opportunities_processed"] == len(TARGET_LISTICLE_OPPORTUNITIES)

        md = Path(res["md_path"]).read_text(encoding="utf-8")
        assert "Analytics India Magazine" in md
        assert "BFSI Tech Vision India" in md
        assert "Subject: Editorial Update" in md
