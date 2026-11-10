#!/usr/bin/env python3
"""
Unit test suite for Tier-1 Enterprise Documentation Engine and Open-Source Assets.
"""

import os
import json
import pytest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


class TestEnterpriseDocsAndOpenSource:
    def test_all_six_docs_pages_exist(self):
        slugs = ["", "quickstart", "vllm-runtime", "compliance-hsm", "benchmarks", "api-reference"]
        for slug in slugs:
            pub_path = ROOT_DIR / "frontend" / "public" / "docs" / slug / "index.html" if slug else ROOT_DIR / "frontend" / "public" / "docs" / "index.html"
            dist_path = ROOT_DIR / "frontend" / "dist" / "docs" / slug / "index.html" if slug else ROOT_DIR / "frontend" / "dist" / "docs" / "index.html"

            assert pub_path.exists(), f"Missing public docs file: {pub_path}"
            assert dist_path.exists(), f"Missing dist docs file: {dist_path}"

            pub_html = pub_path.read_text(encoding="utf-8")
            assert "TechArticle" in pub_html
            assert "BreadcrumbList" in pub_html
            assert "—" not in pub_html, f"Em dash found in public docs: {slug}"

    def test_docs_registered_in_sitemap_core(self):
        sitemap_pub = ROOT_DIR / "frontend" / "public" / "sitemap-core.xml"
        sitemap_dist = ROOT_DIR / "frontend" / "dist" / "sitemap-core.xml"

        content_pub = sitemap_pub.read_text(encoding="utf-8")
        content_dist = sitemap_dist.read_text(encoding="utf-8")

        expected_urls = [
            "https://elesium.online/docs/",
            "https://elesium.online/docs/quickstart/",
            "https://elesium.online/docs/vllm-runtime/",
            "https://elesium.online/docs/compliance-hsm/",
            "https://elesium.online/docs/benchmarks/",
            "https://elesium.online/docs/api-reference/"
        ]

        for u in expected_urls:
            assert u in content_pub, f"URL missing from public sitemap-core: {u}"
            assert u in content_dist, f"URL missing from dist sitemap-core: {u}"

    def test_open_source_repository_assets(self):
        bench_dir = ROOT_DIR / "open_source_assets" / "elesium-sovereign-vllm-benchmarks"
        hf_dir = ROOT_DIR / "open_source_assets" / "huggingface_hub"

        assert (bench_dir / "README.md").exists()
        assert (bench_dir / "benchmark_serving.py").exists()
        assert (bench_dir / "CITATION.cff").exists()
        assert (hf_dir / "MODEL_CARD_Elesium_Indic_Sovereign_FP8.md").exists()
        assert (hf_dir / "DATASET_CARD_DPDP_2023_Compliance_Bench.md").exists()

        readme_text = (bench_dir / "README.md").read_text(encoding="utf-8")
        assert "—" not in readme_text
        assert "vLLM" in readme_text
        assert "148 ms" in readme_text

    def test_llms_txt_contains_docs_hub(self):
        llms_path = ROOT_DIR / "frontend" / "public" / "llms.txt"
        text = llms_path.read_text(encoding="utf-8")
        assert "https://elesium.online/docs/" in text
        assert "https://elesium.online/docs/benchmarks/" in text
