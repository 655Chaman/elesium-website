#!/usr/bin/env python3
"""
Unit test suite for PR Wire Syndication Suite and Navboost CTR Amplifier.
"""

import os
import json
import pytest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent


class TestPRWireAndNavboost:
    def test_newsroom_and_releases_exist(self):
        slugs = [
            "",
            "pr-2026-01-bfsi-vllm-infrastructure",
            "pr-2026-02-dpdp-memory-zeroization",
            "pr-2026-03-h100-benchmark-audit"
        ]
        for slug in slugs:
            pub_path = ROOT_DIR / "frontend" / "public" / "news" / slug / "index.html" if slug else ROOT_DIR / "frontend" / "public" / "news" / "index.html"
            dist_path = ROOT_DIR / "frontend" / "dist" / "news" / slug / "index.html" if slug else ROOT_DIR / "frontend" / "dist" / "news" / "index.html"

            assert pub_path.exists(), f"Missing public news file: {pub_path}"
            assert dist_path.exists(), f"Missing dist news file: {dist_path}"

            html = pub_path.read_text(encoding="utf-8")
            assert "NewsArticle" in html or "Newsroom" in html
            assert "BreadcrumbList" in html
            assert "—" not in html, f"Em dash found in news page: {slug}"

    def test_rss_feed_and_dispatch_payload_exist(self):
        rss_pub = ROOT_DIR / "frontend" / "public" / "news" / "feed.xml"
        rss_dist = ROOT_DIR / "frontend" / "dist" / "news" / "feed.xml"
        payload_path = ROOT_DIR / "authority_assets" / "press_releases" / "pr_wire_dispatch_payload.json"

        assert rss_pub.exists()
        assert rss_dist.exists()
        assert payload_path.exists()

        rss_text = rss_pub.read_text(encoding="utf-8")
        assert "<rss version=\"2.0\"" in rss_text
        assert "Elesium Official Newsroom" in rss_text

        with open(payload_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        assert data["issuer"] == "Elesium Digital Systems Private Limited"
        assert len(data["releases"]) == 3

    def test_navboost_dwell_lock_injected(self):
        docs_index = ROOT_DIR / "frontend" / "public" / "docs" / "index.html"
        news_index = ROOT_DIR / "frontend" / "public" / "news" / "index.html"

        assert "/navboost_dwell_lock.js" in docs_index.read_text(encoding="utf-8")
        assert "/navboost_dwell_lock.js" in news_index.read_text(encoding="utf-8")

        telemetry = ROOT_DIR / "automation" / "navboost_amplification_report.json"
        assert telemetry.exists()
        with open(telemetry, "r", encoding="utf-8") as f:
            tel_data = json.load(f)
        assert tel_data["status"] == "NAVBOOST_AMPLIFICATION_ACTIVE"
        assert tel_data["striking_distance_clusters_optimized"] == 5
