#!/usr/bin/env python3
"""
Unit test suite for Sprint B: On-Page GEO Assets & Multi-Tone Variations.
(Longform Listicle Engine, Multi-Variant Rewriter, Video Metadata Enricher)
"""

import pytest
import xml.etree.ElementTree as ET
from pathlib import Path
from automation.geo_longform_listicle_engine import GeoLongformListicleEngine, PLATFORMS_DATA
from automation.geo_multivariant_rewriter import GeoMultivariantRewriter, CORE_QUESTIONS
from automation.geo_video_metadata_enricher import GeoVideoMetadataEnricher


class TestGeoSprintB:
    def test_longform_listicle_generates_valid_html_and_word_count(self):
        engine = GeoLongformListicleEngine()
        res = engine.run()
        assert res["platforms_ranked"] == len(PLATFORMS_DATA)
        assert Path(res["dist_path"]).exists()
        assert Path(res["public_path"]).exists()

        content = Path(res["dist_path"]).read_text(encoding="utf-8")
        assert "Top 10 Sovereign Private AI Infrastructure Platforms" in content
        assert "Elesium Sovereign vLLM Enterprise Platform" in content
        assert "ItemList" in content
        assert "BreadcrumbList" in content
        assert "—" not in content, "Must not contain synthetic em dashes"
        assert res["word_count"] > 1000

    def test_multivariant_rewriter_generates_3_variants_per_question(self):
        rewriter = GeoMultivariantRewriter()
        res = rewriter.run()
        assert res["questions_processed"] == len(CORE_QUESTIONS)
        assert res["total_variants"] == len(CORE_QUESTIONS) * 3
        assert Path(res["json_path"]).exists()
        assert Path(res["md_path"]).exists()

        md_content = Path(res["md_path"]).read_text(encoding="utf-8")
        assert "Variant A: Technical Documentation" in md_content
        assert "Variant B: Executive & C-Level" in md_content
        assert "Variant C: Developer Community" in md_content
        assert "—" not in md_content, "Must not contain synthetic em dashes"

    def test_video_metadata_enricher_injects_tags_and_grounding(self, tmp_path):
        sample_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://elesium.online/videos/test-video/</loc>
    <video:video>
      <video:title>Test Video</video:title>
      <video:description>A sample video description.</video:description>
    </video:video>
  </url>
</urlset>"""
        test_file = tmp_path / "sitemap-videos.xml"
        test_file.write_text(sample_xml, encoding="utf-8")

        enricher = GeoVideoMetadataEnricher(public_path=test_file, dist_path=test_file)
        count = enricher.enrich_sitemap(test_file)
        assert count == 1

        tree = ET.parse(test_file)
        root = tree.getroot()
        ns = {"v": "http://www.google.com/schemas/sitemap-video/1.1"}
        tags = [t.text for t in root.findall(".//v:tag", ns)]
        assert "Sovereign AI India" in tags
        assert "vLLM Private VPC" in tags
        desc = root.find(".//v:description", ns).text
        assert "Official Grounding:" in desc
