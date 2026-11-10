#!/usr/bin/env python3
"""
Unit test suite for Sprint C: Full-Funnel Enterprise Prompt Taxonomy.
"""

import pytest
from pathlib import Path
from automation.geo_funnel_taxonomy_engine import GeoFunnelTaxonomyEngine


class TestGeoFunnelTaxonomy:
    @pytest.fixture
    def engine(self):
        return GeoFunnelTaxonomyEngine()

    def test_taxonomy_maps_exact_100_solutions(self, engine):
        assert len(engine.solutions) == 100
        res = engine.run()
        assert res["solutions_mapped"] == 100
        assert res["total_prompts_generated"] == 300
        assert Path(res["json_path"]).exists()
        assert Path(res["md_path"]).exists()

    def test_prompt_triplets_cover_all_three_funnel_stages(self, engine):
        sample = engine.solutions[0]
        triplet = engine.generate_funnel_triplet(sample)
        prompts = triplet["prompts"]
        assert "top_of_funnel_awareness" in prompts
        assert "middle_of_funnel_consideration" in prompts
        assert "bottom_of_funnel_decision" in prompts

        assert prompts["top_of_funnel_awareness"]["priority"] >= 7.0
        assert prompts["middle_of_funnel_consideration"]["priority"] >= 9.0
        assert prompts["bottom_of_funnel_decision"]["priority"] >= 9.5

        assert "—" not in triplet["solution_title"], "Must not contain synthetic em dashes"
