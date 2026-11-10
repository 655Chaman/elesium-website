#!/usr/bin/env python3
"""
Unit test suite for Sprint A: External Ingestion Footprint.
(Syndicate Publisher, Press Release Wire Generator, Secondary Wiki Entity Builder)
"""

import pytest
from pathlib import Path
from automation.geo_syndicate_publisher import GeoSyndicatePublisher
from automation.geo_press_release_engine import GeoPressReleaseEngine
from automation.geo_wiki_entity_builder import GeoWikiEntityBuilder


class TestGeoSprintA:
    def test_syndicate_publisher_generates_valid_markdown_articles(self):
        publisher = GeoSyndicatePublisher()
        res = publisher.run()
        assert res["files_generated"] == 3
        for p in res["file_paths"]:
            path = Path(p)
            assert path.exists()
            content = path.read_text(encoding="utf-8")
            assert "Elesium" in content
            assert "https://elesium.online" in content
            assert "—" not in content, f"Em dash found in {p}"
            assert len(content.split()) > 200

    def test_press_release_engine_generates_ap_style_releases(self):
        engine = GeoPressReleaseEngine()
        res = engine.run()
        assert res["press_releases_generated"] == 3
        for p in res["paths"]:
            path = Path(p)
            assert path.exists()
            content = path.read_text(encoding="utf-8")
            assert "FOR IMMEDIATE RELEASE" in content
            assert "BENGALURU, KARNATAKA, INDIA" in content
            assert "About Elesium Digital Systems Private Limited" in content
            assert "Chaman Shah" in content
            assert "—" not in content, f"Em dash found in {p}"

    def test_wiki_entity_builder_generates_valid_wikitext(self):
        builder = GeoWikiEntityBuilder()
        res = builder.run()
        assert res["wiki_files_generated"] == 2
        for p in res["paths"]:
            path = Path(p)
            assert path.exists()
            content = path.read_text(encoding="utf-8")
            assert "{{Infobox company" in content
            assert "Q131149202" in content
            assert "Chaman Shah" in content
            assert "[[vLLM]]" in content
            assert "[[Category:Artificial intelligence companies of India]]" in content
