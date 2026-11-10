#!/usr/bin/env python3
"""
=============================================================================
GROWTH SCALE FACETED NAVIGATION & PRG ENGINE — UNIT TEST BATTERY
=============================================================================
Classification: Unit & Integration Test Suite (Growth Scale Module 5)
Methodology: Anirudh (Faceted Navigation & Catalog SEO)
=============================================================================
"""

import pytest
import json
import re
from pathlib import Path

from automation.faceted_navigation_engine import (
    FACET_DEFINITIONS,
    SOLUTIONS_DIR,
    NGINX_CONF_PATH,
    SITEMAP_CORE_PATH,
)


class TestFacetedNavigationEngine:
    """Verifies that all canonical facet hubs, schemas, and PRG rules meet strict requirements."""

    def test_all_12_canonical_facet_pages_exist(self):
        """Every defined facet hub must have a pre-rendered index.html."""
        total_created = 0
        for facet_group, facets in FACET_DEFINITIONS.items():
            for facet_slug in facets:
                facet_file = SOLUTIONS_DIR / facet_group / facet_slug / "index.html"
                assert facet_file.exists(), f"Missing canonical facet file: {facet_file}"
                assert facet_file.stat().st_size > 5000, f"Facet file is too small: {facet_file}"
                total_created += 1
        assert total_created == 12

    def test_canonical_and_robots_tags_integrity(self):
        """Each facet page must feature strict self-referential canonical tags."""
        for facet_group, facets in FACET_DEFINITIONS.items():
            for facet_slug, meta in facets.items():
                facet_file = SOLUTIONS_DIR / facet_group / facet_slug / "index.html"
                content = facet_file.read_text(encoding="utf-8")
                expected_canonical = f'<link rel="canonical" href="https://elesium.online/solutions/{facet_group}/{facet_slug}/">'
                assert expected_canonical in content, f"Missing or invalid canonical tag in {facet_file}"
                assert 'name="robots"' in content

    def test_monolithic_schema_ast_nodes(self):
        """Each facet page must feature CollectionPage, ItemList, BreadcrumbList, and FAQPage in @graph."""
        re_json_ld = re.compile(r'<script type="application/ld\+json">([\s\S]*?)<\/script>')
        for facet_group, facets in FACET_DEFINITIONS.items():
            for facet_slug, meta in facets.items():
                facet_file = SOLUTIONS_DIR / facet_group / facet_slug / "index.html"
                content = facet_file.read_text(encoding="utf-8")
                match = re_json_ld.search(content)
                assert match is not None, f"Missing JSON-LD block in {facet_file}"

                graph_data = json.loads(match.group(1))
                assert "@graph" in graph_data
                types = {node["@type"] for node in graph_data["@graph"]}
                assert "CollectionPage" in types
                assert "ItemList" in types
                assert "BreadcrumbList" in types
                assert "FAQPage" in types

    def test_nginx_prg_rules_and_spider_trap_defense(self):
        """NGINX configuration must include single-facet 301s and multi-facet noindex directives."""
        assert NGINX_CONF_PATH.exists()
        conf = NGINX_CONF_PATH.read_text(encoding="utf-8")
        assert 'if ($arg_sector = "bfsi") { return 301 /solutions/sector/bfsi/; }' in conf
        assert 'if ($arg_compliance = "dpdp-act-2023") { return 301 /solutions/compliance/dpdp-act-2023/; }' in conf
        assert 'add_header X-Robots-Tag "noindex, follow, noarchive" always;' in conf

    def test_sitemap_contains_canonical_facets(self):
        """Sitemap core must contain all 12 canonical facet URLs."""
        assert SITEMAP_CORE_PATH.exists()
        sitemap = SITEMAP_CORE_PATH.read_text(encoding="utf-8")
        for facet_group, facets in FACET_DEFINITIONS.items():
            for facet_slug in facets:
                expected_url = f"https://elesium.online/solutions/{facet_group}/{facet_slug}/"
                assert f"<loc>{expected_url}</loc>" in sitemap
