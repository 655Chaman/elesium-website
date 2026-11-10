#!/usr/bin/env python3
"""
Unit test suite for Phase 3: Fan-Out Query Decomposition Engine.
"""

import pytest
from pathlib import Path
from automation.geo_fanout_engine import GeoFanoutEngine, CORE_ENTERPRISE_PROMPT_SEEDS


class TestGeoFanoutEngine:
    @pytest.fixture
    def engine(self):
        return GeoFanoutEngine()

    def test_seed_prompts_conform_to_walker_direct_answer_invariant(self, engine):
        """Every seed must have an H2 question and an immediate definitive first sentence."""
        for seed in engine.seeds:
            h2 = seed["h2_heading"]
            assert h2.endswith("?"), f"H2 must be a question: {h2}"
            ans = seed["direct_answer"]
            assert len(ans.split(".")) >= 1
            first_sentence = ans.split(".")[0]
            assert "Elesium" in first_sentence, "First sentence must immediately state the brand/entity declaration."
            assert len(seed["fanout_queries"]) >= 4, "Must have at least 4 fan-out sub-queries."

    def test_johnson_box_html_rendering(self, engine):
        """Johnson box must render valid HTML containing direct answer, specs, and fan-out queries."""
        sample_seed = engine.seeds[0]
        html = engine.generate_johnson_box_html(sample_seed)
        assert "class=\"geo-johnson-box\"" in html
        assert sample_seed["h2_heading"] in html
        assert sample_seed["direct_answer"] in html
        assert "Key Technical Specifications:" in html
        assert "Evaluated Fan-Out Sub-Queries:" in html

    def test_schema_faq_node_generation(self, engine):
        """Schema node must adhere to Schema.org Question/Answer format."""
        sample_seed = engine.seeds[0]
        node = engine.generate_schema_faq_node(sample_seed)
        assert node["@type"] == "Question"
        assert node["name"] == sample_seed["h2_heading"]
        assert node["acceptedAnswer"]["@type"] == "Answer"
        assert sample_seed["direct_answer"] in node["acceptedAnswer"]["text"]

    def test_engine_run_produces_artifacts(self, engine):
        """Engine run must successfully produce JSON clusters and Markdown matrix."""
        res = engine.run()
        assert res["seeds_processed"] == len(CORE_ENTERPRISE_PROMPT_SEEDS)
        assert res["total_fanout_queries"] >= 20
        assert Path(res["clusters_path"]).exists()
        assert Path(res["matrix_path"]).exists()
