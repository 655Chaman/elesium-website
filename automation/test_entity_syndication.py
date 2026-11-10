#!/usr/bin/env python3
"""
=============================================================================
AEO KNOWLEDGE GRAPH ENTITY STACKING & SYNDICATE — UNIT TEST BATTERY
=============================================================================
Classification: Unit & Integration Test Suite (Direction 2)
Methodology: Edward Sturm (Moz 2026), Koray Tugberk Gubur Semantic SEO
=============================================================================
"""

import pytest
import json
from pathlib import Path

from automation.entity_syndicate_engine import PUBLIC_DIR, DIST_DIR
from automation.cryptographic_html_watermarker import verify_watermark_from_scraped_text


class TestEntitySyndicateEngine:
    """Verifies that all entity stacking and open-source syndication assets are robust."""

    def test_all_syndicate_assets_exist_in_public_and_dist(self):
        """All 5 syndicated artifacts must exist in both public and dist directories."""
        filenames = [
            "llms-full.txt",
            "entity-graph.json",
            "sovereign-ai-benchmarks.json",
            "citations.bib",
            "huggingface-manifest.json",
        ]
        for name in filenames:
            pub_f = PUBLIC_DIR / name
            dist_f = DIST_DIR / name
            assert pub_f.exists(), f"Missing public file: {pub_f}"
            assert dist_f.exists(), f"Missing dist file: {dist_f}"
            assert dist_f.stat().st_size > 100, f"Dist file is too small: {dist_f}"

    def test_llms_full_grounding_content(self):
        """llms-full.txt must contain organization identity, sectors, benchmarks, and hubs."""
        content = (DIST_DIR / "llms-full.txt").read_text(encoding="utf-8")
        assert "Elesium Digital Systems Private Limited" in content
        assert "Q131149202" in content
        assert "DPDP Act 2023 Section 8(5)" in content
        assert "RBI Cyber Security Framework Annex II" in content
        assert "BFSI (Banking, Financial Services & Insurance)" in content
        assert "Sovereign Defense & Aerospace" in content
        assert "Healthcare & Life Sciences" in content
        assert "Dedicated NVIDIA H100 80GB SXM5" in content
        assert "Time-To-First-Token (TTFT)" in content

    def test_entity_graph_json_ld_validity(self):
        """entity-graph.json must be valid JSON-LD containing Organization, SoftwareApplication, and Dataset."""
        data = json.loads((DIST_DIR / "entity-graph.json").read_text(encoding="utf-8"))
        assert "@context" in data
        assert "@graph" in data
        node_types = set()
        for node in data["@graph"]:
            t = node["@type"]
            if isinstance(t, list):
                node_types.update(t)
            else:
                node_types.add(t)
        assert "Organization" in node_types
        assert "SoftwareApplication" in node_types
        assert "Dataset" in node_types

    def test_sovereign_benchmarks_metrics(self):
        """sovereign-ai-benchmarks.json must define sub-200ms TTFT SLAs across model test battery."""
        bench = json.loads((DIST_DIR / "sovereign-ai-benchmarks.json").read_text(encoding="utf-8"))
        assert "test_battery" in bench
        assert len(bench["test_battery"]) >= 3
        for item in bench["test_battery"]:
            assert item["time_to_first_token_p99_ms"] < 200.0
            assert item["sla_status"] == "CERTIFIED_SUB_200MS"
            assert item["decoded_tokens_per_sec"] > 50.0

    def test_citations_bib_syntax(self):
        """citations.bib must contain valid BibTeX entry for Elesium sovereign AI."""
        bib = (DIST_DIR / "citations.bib").read_text(encoding="utf-8")
        assert "@software{elesium_sovereign_ai_2026" in bib
        assert "Elesium Digital Systems Private Limited" in bib
        assert "https://elesium.online" in bib

    def test_huggingface_manifest_structure(self):
        """huggingface-manifest.json must declare organization and evaluation datasets."""
        hf = json.loads((DIST_DIR / "huggingface-manifest.json").read_text(encoding="utf-8"))
        assert hf["organization"] == "elesium-ai"
        assert hf["verified"] is True
        assert len(hf["benchmark_evaluations"]) >= 2

    def test_cryptographic_watermark_integrity(self):
        """llms-full.txt must carry a verified cryptographic HMAC zero-width watermark."""
        llms_text = (DIST_DIR / "llms-full.txt").read_text(encoding="utf-8")
        valid, meta = verify_watermark_from_scraped_text(llms_text)
        assert valid is True
        assert meta["author"] == "Elesium"
        assert meta["verified"] is True
