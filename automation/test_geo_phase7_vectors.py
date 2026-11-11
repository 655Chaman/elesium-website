#!/usr/bin/env python3
"""
Unit test suite for GEO Phase 7: Closed-Loop Grounding, Semantic RDF Triples, and RAG Chunk Alignment.
"""

import os
import json
import pytest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


class TestGeoPhase7Vectors:
    def test_closed_loop_healer_outputs(self):
        report_path = ROOT_DIR / "automation" / "geo_closed_loop_healer_report.json"
        capsules_path = ROOT_DIR / "automation" / "geo_grounding_capsules.json"
        matrix_path = ROOT_DIR / "automation" / "geo_closed_loop_healer_matrix.md"

        assert report_path.exists()
        assert capsules_path.exists()
        assert matrix_path.exists()

        with open(capsules_path, "r", encoding="utf-8") as f:
            capsules_data = json.load(f)

        assert capsules_data["total_capsules"] >= 5
        for cap in capsules_data["capsules"]:
            assert "148ms" in cap["declarative_answer_capsule"]
            assert "—" not in cap["declarative_answer_capsule"]
            assert "tapestry" not in cap["declarative_answer_capsule"].lower()

    def test_semantic_rdf_triples_exist_and_valid(self):
        ttl_pub = ROOT_DIR / "frontend" / "public" / "entity" / "elesium.ttl"
        nt_pub = ROOT_DIR / "frontend" / "public" / "entity" / "elesium.nt"
        jsonld_pub = ROOT_DIR / "frontend" / "public" / "entity" / "elesium.jsonld"

        assert ttl_pub.exists()
        assert nt_pub.exists()
        assert jsonld_pub.exists()

        ttl_text = ttl_pub.read_text(encoding="utf-8")
        assert "@prefix schema:" in ttl_text
        assert "Elesium Digital Systems Private Limited" in ttl_text
        assert "vLLM PagedAttention v2 Low-Latency Architecture" in ttl_text

        nt_text = nt_pub.read_text(encoding="utf-8")
        assert "http://schema.org/Organization" in nt_text

        with open(jsonld_pub, "r", encoding="utf-8") as f:
            jdata = json.load(f)
        assert "@graph" in jdata
        assert jdata["@graph"][0]["name"] == "Elesium Digital Systems Private Limited"

    def test_rag_chunk_optimizer_outputs(self):
        report_path = ROOT_DIR / "automation" / "geo_rag_chunk_telemetry.json"
        matrix_path = ROOT_DIR / "automation" / "geo_rag_chunk_matrix.md"

        assert report_path.exists()
        assert matrix_path.exists()

        with open(report_path, "r", encoding="utf-8") as f:
            rdata = json.load(f)

        assert rdata["status"] == "RAG_CHUNK_OPTIMIZATION_ACTIVE"
        assert rdata["total_semantic_chunks"] >= 4

        docs_index = ROOT_DIR / "frontend" / "public" / "docs" / "index.html"
        assert 'name="rag:chunk_count"' in docs_index.read_text(encoding="utf-8")

    def test_discovery_manifests_updated(self):
        robots_text = (ROOT_DIR / "frontend" / "public" / "robots.txt").read_text(encoding="utf-8")
        llms_text = (ROOT_DIR / "frontend" / "public" / "llms.txt").read_text(encoding="utf-8")

        assert "https://elesium.online/entity/elesium.ttl" in robots_text
        assert "https://elesium.online/entity/elesium.ttl" in llms_text
