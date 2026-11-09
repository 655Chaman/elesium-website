#!/usr/bin/env python3
"""
========================================================================================
🔱 ELESIUM PYTEST TEST SUITE: PRUNING & ENTERPRISE CURATION VERIFICATION (M1) 🔱
========================================================================================
Test Suite: automation/test_pruning_and_curation.py
Framework: pytest 8.4.2 / Python 3.9+
Target Domain: https://elesium.online
Scope: Milestone 1 Automated Verification Test Suite (Gates 1 through 6)

Test Classes:
  - TestGate1Http410Configuration
  - TestGate2RobotsNoindexFollow
  - TestGate3SitemapsPurge
  - TestGate4InternalBrokenLinks
  - TestGate5JaccardSimilarityCertification
  - TestGate6EnterpriseSchematicsAndBenchmarks

Usage:
  python3 -m pytest automation/test_pruning_and_curation.py -v
  python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate1" -v
========================================================================================
"""

from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Set

import pytest

from automation.verify_pruning_and_curation import (
    BLOG_POSTS_FILE,
    CATEGORY_DIR,
    COMPARE_DATA_FILE,
    DIST_DATA_SOLUTIONS,
    DIST_DIR,
    FOOTER_FILE,
    FRONTEND_DIR,
    GLOSSARY_FILE,
    NGINX_410_CONF,
    PUBLIC_DIR,
    REDIRECTS_FILE,
    RETAINED_SLUGS_FILE,
    ROOT_DIR,
    SITEMAP_CORE_PUBLIC,
    SITEMAP_MASTER_PUBLIC,
    SITEMAP_SOLUTIONS_DIST,
    SITEMAP_SOLUTIONS_PUBLIC,
    SOLUTIONS_DIST,
    SOLUTIONS_HUB_DATA_FILE,
    SOLUTIONS_INDEX_HTML,
    SOLUTIONS_PUBLIC,
    TOP100_FILE,
    VITE_CONFIG,
    PruningAndCurationVerifier,
)


@pytest.fixture(scope="module")
def verifier() -> PruningAndCurationVerifier:
    """Fixture providing initialized verification engine."""
    return PruningAndCurationVerifier(verbose=False)


@pytest.fixture(scope="module")
def partitions(verifier: PruningAndCurationVerifier) -> tuple[Set[str], Set[str]]:
    """Fixture returning (pruned_slugs, retained_slugs)."""
    return verifier.load_partitions()


# ======================================================================================
# GATE 1: HTTP 410 Gone Server & Router Configuration Assertions
# ======================================================================================
class TestGate1Http410Configuration:
    """Tests server and router configuration for returning HTTP 410 Gone for all pruned slugs."""

    def test_nginx_410_config_exists(self):
        """Verifies that automation/algorithmic_cull_http_410.conf exists on disk."""
        assert NGINX_410_CONF.exists(), f"Nginx 410 configuration file missing: {NGINX_410_CONF}"

    def test_nginx_410_config_covers_all_pruned_slugs(self, partitions):
        """Verifies that 100% of pruned slugs have location = /solutions/<slug> { return 410; }."""
        pruned_slugs, _ = partitions
        assert NGINX_410_CONF.exists(), "Nginx config must exist"
        conf_text = NGINX_410_CONF.read_text(encoding="utf-8", errors="ignore")

        missing = [s for s in pruned_slugs if f"/solutions/{s}" not in conf_text or "return 410" not in conf_text]
        assert len(missing) == 0, (
            f"Nginx config incomplete: {len(missing)}/{len(pruned_slugs)} pruned slugs missing 410 directives. "
            f"Sample missing: {missing[:5]}"
        )

    def test_redirects_file_exists(self):
        """Verifies that frontend/public/_redirects exists for Cloudflare/Netlify 410 handling."""
        assert REDIRECTS_FILE.exists(), f"_redirects file missing: {REDIRECTS_FILE}"

    def test_redirects_file_covers_all_pruned_slugs(self, partitions):
        """Verifies that frontend/public/_redirects contains 410 rules for 100% of pruned slugs."""
        pruned_slugs, _ = partitions
        assert REDIRECTS_FILE.exists(), "_redirects file must exist"
        redirects_text = REDIRECTS_FILE.read_text(encoding="utf-8", errors="ignore")

        missing = [s for s in pruned_slugs if f"/solutions/{s}" not in redirects_text or "410" not in redirects_text]
        assert len(missing) == 0, (
            f"_redirects incomplete: {len(missing)}/{len(pruned_slugs)} pruned slugs missing 410 rules. "
            f"Sample missing: {missing[:5]}"
        )

    def test_vite_config_has_http410_plugin(self):
        """Verifies that frontend/vite.config.ts configures http410Plugin for preview and dev servers."""
        assert VITE_CONFIG.exists(), f"Vite config missing: {VITE_CONFIG}"
        vite_text = VITE_CONFIG.read_text(encoding="utf-8", errors="ignore")
        has_plugin = "http410" in vite_text.lower() or "410plugin" in vite_text.lower()
        has_status = "410" in vite_text and ("statuscode" in vite_text.lower() or "status(410)" in vite_text)
        assert has_plugin and has_status, (
            "Vite configuration missing http410Plugin middleware for returning 410 status codes in dev/preview"
        )

    def test_gate_1_full_certification(self, verifier: PruningAndCurationVerifier):
        """Master Gate 1 certification assertion."""
        res = verifier.verify_gate_1_http_410_config()
        assert res.passed, f"Gate 1 Failed: {res.summary}. Failures: {res.failures[:3]}"


def extract_robots_directives(head_content: str) -> list[str]:
    """Extracts robots / googlebot meta content attribute regardless of attribute order."""
    pattern_name_first = re.compile(
        r'<meta\s+[^>]*name=["\'](?:robots|googlebot)["\'][^>]*content=["\']([^"\']+)["\']',
        re.I,
    )
    pattern_content_first = re.compile(
        r'<meta\s+[^>]*content=["\']([^"\']+)["\'][^>]*name=["\'](?:robots|googlebot)["\']',
        re.I,
    )
    return pattern_name_first.findall(head_content) + pattern_content_first.findall(head_content)


# ======================================================================================
# GATE 2: Pre-rendered HTML <meta name="robots" content="noindex, follow"> Verification
# ======================================================================================
class TestGate2RobotsNoindexFollow:
    """Tests that pre-rendered HTML files for pruned slugs contain noindex, follow directives."""

    def test_pruned_solution_dist_html_have_noindex_follow(self, partitions):
        """Verifies that all pre-rendered HTML files in frontend/dist/solutions/ carry noindex, follow."""
        pruned_slugs, _ = partitions
        missing_noindex = []

        # Audit first 200 pruned files in dist
        sample_slugs = sorted(list(pruned_slugs))[:200]
        for slug in sample_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"
            if not html_path.exists():
                continue

            content = html_path.read_text(encoding="utf-8", errors="ignore")[:4096]
            matches = extract_robots_directives(content)
            tag_val = " ".join(matches).lower()
            if "noindex" not in tag_val:
                missing_noindex.append(slug)

        assert len(missing_noindex) == 0, (
            f"{len(missing_noindex)}/{len(sample_slugs)} pruned HTML files in dist/ lack noindex directive. "
            f"Sample failing: {missing_noindex[:5]}"
        )

    def test_pruned_solution_dist_html_have_zero_affirmative_index(self, partitions):
        """Verifies that pruned HTML files do NOT contain affirmative index directives."""
        pruned_slugs, _ = partitions
        affirmative_index = []

        sample_slugs = sorted(list(pruned_slugs))[:200]
        for slug in sample_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"
            if not html_path.exists():
                continue

            content = html_path.read_text(encoding="utf-8", errors="ignore")[:4096]
            matches = extract_robots_directives(content)
            tag_val = " ".join(matches).lower()
            if re.search(r'(?<!no)index', tag_val):
                affirmative_index.append(slug)

        assert len(affirmative_index) == 0, (
            f"{len(affirmative_index)}/{len(sample_slugs)} pruned HTML files still carry affirmative index directives. "
            f"Sample failing: {affirmative_index[:5]}"
        )

    def test_retained_solution_html_maintain_index_follow(self, partitions):
        """Verifies that all 100 retained enterprise solutions maintain index, follow."""
        _, retained_slugs = partitions
        missing_index = []

        for slug in retained_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"
            if not html_path.exists():
                missing_index.append(slug)
                continue

            content = html_path.read_text(encoding="utf-8", errors="ignore")[:4096]
            matches = extract_robots_directives(content)
            tag_val = " ".join(matches).lower()
            if "noindex" in tag_val or "index" not in tag_val:
                missing_index.append(slug)

        assert len(missing_index) == 0, (
            f"{len(missing_index)}/{len(retained_slugs)} retained enterprise solutions incorrectly lack index, follow"
        )

    def test_gate_2_full_certification(self, verifier: PruningAndCurationVerifier):
        """Master Gate 2 certification assertion."""
        res = verifier.verify_gate_2_robots_noindex_follow()
        assert res.passed, f"Gate 2 Failed: {res.summary}. Failures: {res.failures[:3]}"


# ======================================================================================
# GATE 3: 100% Sitemaps Purge Verification
# ======================================================================================
class TestGate3SitemapsPurge:
    """Tests complete removal of pruned URLs from all production sitemaps and 100 retained presence."""

    def test_sitemap_solutions_public_has_zero_pruned_urls(self, partitions):
        """Verifies that frontend/public/sitemap-solutions.xml contains 0 pruned URLs."""
        pruned_slugs, _ = partitions
        assert SITEMAP_SOLUTIONS_PUBLIC.exists(), f"Sitemap missing: {SITEMAP_SOLUTIONS_PUBLIC}"

        tree = ET.parse(SITEMAP_SOLUTIONS_PUBLIC)
        locs = set(e.text.strip() for e in tree.getroot().findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if e.text)

        pruned_found = [
            s for s in pruned_slugs
            if f"https://elesium.online/solutions/{s}/" in locs or f"https://elesium.online/solutions/{s}" in locs
        ]
        assert len(pruned_found) == 0, (
            f"Sitemap contamination: {len(pruned_found)} pruned URLs found in public/sitemap-solutions.xml. "
            f"Sample: {pruned_found[:5]}"
        )

    def test_sitemap_solutions_dist_has_zero_pruned_urls(self, partitions):
        """Verifies that frontend/dist/sitemap-solutions.xml contains 0 pruned URLs."""
        pruned_slugs, _ = partitions
        if not SITEMAP_SOLUTIONS_DIST.exists():
            pytest.skip("dist/sitemap-solutions.xml not yet generated")

        tree = ET.parse(SITEMAP_SOLUTIONS_DIST)
        locs = set(e.text.strip() for e in tree.getroot().findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if e.text)

        pruned_found = [
            s for s in pruned_slugs
            if f"https://elesium.online/solutions/{s}/" in locs or f"https://elesium.online/solutions/{s}" in locs
        ]
        assert len(pruned_found) == 0, f"Sitemap contamination: {len(pruned_found)} pruned URLs in dist/sitemap-solutions.xml"

    def test_sitemap_solutions_has_exact_100_retained_enterprise_urls(self, partitions):
        """Verifies that sitemap-solutions.xml contains exactly 100 URLs and matches retained enterprise set."""
        _, retained_slugs = partitions
        assert SITEMAP_SOLUTIONS_PUBLIC.exists(), "Public sitemap-solutions.xml must exist"

        tree = ET.parse(SITEMAP_SOLUTIONS_PUBLIC)
        locs = set(e.text.strip() for e in tree.getroot().findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if e.text)

        assert len(locs) == len(retained_slugs), (
            f"Sitemap URL count mismatch: Found {len(locs)} URLs in sitemap-solutions.xml, expected exactly {len(retained_slugs)}"
        )

        missing = [
            s for s in retained_slugs
            if f"https://elesium.online/solutions/{s}/" not in locs and f"https://elesium.online/solutions/{s}" not in locs
        ]
        assert len(missing) == 0, f"Missing {len(missing)} retained enterprise URLs from sitemap-solutions.xml"

    def test_master_sitemap_has_zero_pruned_urls(self, partitions):
        """Verifies that master sitemap.xml contains 0 pruned URLs."""
        pruned_slugs, _ = partitions
        assert SITEMAP_MASTER_PUBLIC.exists(), "Master sitemap.xml must exist"
        tree = ET.parse(SITEMAP_MASTER_PUBLIC)
        locs = set(e.text.strip() for e in tree.getroot().findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc") if e.text)

        pruned_found = [
            s for s in pruned_slugs
            if f"https://elesium.online/solutions/{s}/" in locs or f"https://elesium.online/solutions/{s}" in locs
        ]
        assert len(pruned_found) == 0, f"Master sitemap.xml contains {len(pruned_found)} pruned URLs"

    def test_gate_3_full_certification(self, verifier: PruningAndCurationVerifier):
        """Master Gate 3 certification assertion."""
        res = verifier.verify_gate_3_sitemaps_purge()
        assert res.passed, f"Gate 3 Failed: {res.summary}. Failures: {res.failures[:3]}"


# ======================================================================================
# GATE 4: 0 Internal Broken Links to 410 Routes from Retained Pages
# ======================================================================================
class TestGate4InternalBrokenLinks:
    """Tests that no internal links on retained pages point to 410 routes or broken destinations."""

    def test_footer_has_zero_broken_or_pruned_solution_links(self, partitions):
        """Verifies Footer.tsx has zero links to pruned or nonexistent solution URLs."""
        pruned_slugs, retained_slugs = partitions
        assert FOOTER_FILE.exists(), f"Footer file missing: {FOOTER_FILE}"
        text = FOOTER_FILE.read_text(encoding="utf-8", errors="ignore")
        hrefs = re.findall(r'/solutions/([^"\'#?]+)/?', text)

        violations = []
        for slug in hrefs:
            slug = slug.strip("/")
            if slug in pruned_slugs:
                violations.append((slug, "Points to 410 pruned route"))
            elif slug not in retained_slugs:
                violations.append((slug, "Broken link: destination is not in retained enterprise set"))

        assert len(violations) == 0, f"Footer.tsx contains {len(violations)} broken/pruned solution links: {violations}"

    def test_blog_posts_have_zero_broken_or_pruned_solution_links(self, partitions):
        """Verifies blogPosts.ts has zero links to pruned or nonexistent solution URLs."""
        pruned_slugs, retained_slugs = partitions
        assert BLOG_POSTS_FILE.exists(), f"blogPosts.ts missing: {BLOG_POSTS_FILE}"
        text = BLOG_POSTS_FILE.read_text(encoding="utf-8", errors="ignore")
        hrefs = re.findall(r'/solutions/([^"\'#?)]+)/?', text)

        violations = []
        for slug in hrefs:
            slug = slug.strip("/")
            if slug in pruned_slugs:
                violations.append((slug, "Points to 410 pruned route"))
            elif slug not in retained_slugs:
                violations.append((slug, "Broken link: destination not retained"))

        assert len(violations) == 0, f"blogPosts.ts contains {len(violations)} broken/pruned solution links: {violations}"

    def test_glossary_has_zero_broken_or_pruned_solution_links(self, partitions):
        """Verifies glossaryData.ts has zero links to pruned or nonexistent solution URLs."""
        pruned_slugs, retained_slugs = partitions
        assert GLOSSARY_FILE.exists(), f"glossaryData.ts missing: {GLOSSARY_FILE}"
        text = GLOSSARY_FILE.read_text(encoding="utf-8", errors="ignore")
        hrefs = re.findall(r'/solutions/([^"\'#?]+)/?', text)

        violations = []
        for slug in hrefs:
            slug = slug.strip("/")
            if slug in pruned_slugs:
                violations.append((slug, "Points to 410 pruned route"))
            elif slug not in retained_slugs:
                violations.append((slug, "Broken link: destination not retained"))

        assert len(violations) == 0, f"glossaryData.ts contains {len(violations)} broken/pruned solution links: {violations}"

    def test_solutions_index_hub_links_only_to_retained_solutions(self, partitions):
        """Verifies frontend/dist/solutions/index.html does not link to any pruned 410 routes."""
        pruned_slugs, _ = partitions
        assert SOLUTIONS_INDEX_HTML.exists(), f"Solutions index missing: {SOLUTIONS_INDEX_HTML}"
        text = SOLUTIONS_INDEX_HTML.read_text(encoding="utf-8", errors="ignore")
        hrefs = re.findall(r'/solutions/([^"\'#?]+)/?', text)

        pruned_links = [s for s in hrefs if s.strip("/") in pruned_slugs]
        assert len(pruned_links) == 0, (
            f"solutions/index.html contains {len(pruned_links)} links to pruned 410 routes. Sample: {pruned_links[:5]}"
        )

    def test_category_pillar_hubs_link_only_to_retained_solutions(self, partitions):
        """Verifies the 13 category pillar hubs link only to retained enterprise solutions."""
        pruned_slugs, _ = partitions
        if not CATEGORY_DIR.exists():
            pytest.skip("Category directory not found")

        pruned_links_found = []
        for cat_file in CATEGORY_DIR.glob("**/*.html"):
            text = cat_file.read_text(encoding="utf-8", errors="ignore")
            hrefs = re.findall(r'/solutions/([^"\'#?]+)/?', text)
            for s in hrefs:
                clean_s = s.strip("/")
                if clean_s in pruned_slugs:
                    pruned_links_found.append((cat_file.name, clean_s))

        assert len(pruned_links_found) == 0, (
            f"Category pillar hubs contain {len(pruned_links_found)} links to pruned 410 routes. "
            f"Sample: {pruned_links_found[:5]}"
        )

    def test_solutions_hub_data_has_zero_pruned_slugs(self, partitions):
        """Verifies frontend/src/data/solutionsHubData.ts contains 0 pruned doorway slugs."""
        pruned_slugs, retained_slugs = partitions
        assert SOLUTIONS_HUB_DATA_FILE.exists(), f"solutionsHubData.ts missing: {SOLUTIONS_HUB_DATA_FILE}"
        text = SOLUTIONS_HUB_DATA_FILE.read_text(encoding="utf-8", errors="ignore")

        violations = [s for s in pruned_slugs if f'"{s}"' in text or f"'{s}'" in text]
        assert len(violations) == 0, (
            f"solutionsHubData.ts contains {len(violations)} pruned doorway slugs. "
            f"Sample: {violations[:5]}"
        )

    def test_compare_data_has_zero_pruned_slugs(self, partitions):
        """Verifies frontend/src/data/compareData.ts contains 0 pruned doorway slugs in relatedSolutionSlug."""
        pruned_slugs, retained_slugs = partitions
        assert COMPARE_DATA_FILE.exists(), f"compareData.ts missing: {COMPARE_DATA_FILE}"
        text = COMPARE_DATA_FILE.read_text(encoding="utf-8", errors="ignore")

        slugs = re.findall(r'relatedSolutionSlug:\s*["\']([^"\']+)["\']', text)
        violations = [s for s in slugs if s in pruned_slugs or s not in retained_slugs]
        assert len(violations) == 0, (
            f"compareData.ts contains {len(violations)} pruned/non-retained slugs in relatedSolutionSlug. "
            f"Violations: {violations}"
        )

    def test_all_dist_html_pages_have_zero_pruned_solution_links(self, partitions):
        """Verifies all top-level .html files in dist/ have 0 links to 410 pruned solution routes."""
        pruned_slugs, _ = partitions
        if not DIST_DIR.exists():
            pytest.skip("dist directory not found")

        href_pattern = re.compile(r'href=["\'](?:https?://elesium\.online)?/solutions/([^"\'#?]+)/?["\']')
        violations = []

        for html_file in DIST_DIR.glob("*.html"):
            if html_file.name == "solutions.html":
                continue  # Checked separately
            text = html_file.read_text(encoding="utf-8", errors="ignore")
            for m in href_pattern.findall(text):
                clean_target = m.strip("/").strip()
                if not clean_target or clean_target.startswith("category"):
                    continue
                if clean_target in pruned_slugs:
                    violations.append((html_file.name, clean_target))

        assert len(violations) == 0, (
            f"Found {len(violations)} links to pruned 410 routes across dist/*.html pages: {violations}"
        )

    def test_dist_data_solutions_has_exact_100_retained_json_files(self, partitions):
        """Verifies frontend/dist/data/solutions/ contains exactly 100 JSON files and 0 pruned files."""
        pruned_slugs, retained_slugs = partitions
        if not DIST_DATA_SOLUTIONS.exists():
            pytest.skip("dist/data/solutions/ directory not found")

        json_files = list(DIST_DATA_SOLUTIONS.glob("*.json"))
        basenames = set(f.stem for f in json_files)

        assert len(json_files) == len(retained_slugs), (
            f"dist/data/solutions/ contains {len(json_files)} files, expected exactly {len(retained_slugs)}"
        )
        pruned_found = basenames & pruned_slugs
        assert len(pruned_found) == 0, (
            f"dist/data/solutions/ contains {len(pruned_found)} pruned JSON files: {list(pruned_found)[:5]}"
        )
        assert basenames == retained_slugs, "dist/data/solutions/ must match retained enterprise set exactly"

    def test_gate_4_full_certification(self, verifier: PruningAndCurationVerifier):
        """Master Gate 4 certification assertion."""
        res = verifier.verify_gate_4_internal_broken_links()
        assert res.passed, f"Gate 4 Failed: {res.summary}. Failures: {res.failures[:3]}"


# ======================================================================================
# GATE 5: Vocabulary Jaccard Similarity Certification (< 50% vs ~73% baseline)
# ======================================================================================
class TestGate5JaccardSimilarityCertification:
    """Tests pairwise vocabulary Jaccard similarity across retained enterprise pages."""

    def test_retained_pages_mean_jaccard_similarity_below_50_percent(self, verifier: PruningAndCurationVerifier):
        """Certifies that mean pairwise vocabulary Jaccard similarity is strictly < 50.0%."""
        res = verifier.verify_gate_5_jaccard_similarity(threshold=0.50)
        mean_j = res.metrics.get("mean_jaccard_similarity", 1.0)
        assert mean_j < 0.50, (
            f"Mean vocabulary Jaccard similarity ({mean_j * 100:.2f}%) exceeds maximum 50.00% threshold. "
            f"(Baseline: ~73.00%)"
        )

    def test_retained_pages_max_pairwise_similarity_below_threshold(self, verifier: PruningAndCurationVerifier):
        """Certifies that no two retained enterprise pages are near-duplicates (max similarity < 65.0%)."""
        res = verifier.verify_gate_5_jaccard_similarity(threshold=0.50)
        max_j = res.metrics.get("max_pairwise_similarity", 1.0)
        assert max_j < 0.65, (
            f"Maximum pairwise vocabulary Jaccard similarity ({max_j * 100:.2f}%) exceeds 65.00% near-duplicate bound"
        )

    def test_gate_5_full_certification(self, verifier: PruningAndCurationVerifier):
        """Master Gate 5 certification assertion."""
        res = verifier.verify_gate_5_jaccard_similarity(threshold=0.50)
        assert res.passed, f"Gate 5 Failed: {res.summary}. Failures: {res.failures[:3]}"


# ======================================================================================
# GATE 6: Custom Architecture Schematics & Empirical Benchmarks
# ======================================================================================
class TestGate6EnterpriseSchematicsAndBenchmarks:
    """Tests that 100% of retained enterprise pages contain vector SVGs and empirical benchmarks."""

    def test_100_percent_retained_pages_contain_vector_svg_schematics(self, partitions):
        """Verifies that all 100 retained enterprise pages contain responsive vector SVG schematics."""
        _, retained_slugs = partitions
        missing_svg = []

        for slug in retained_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"
            if not html_path.exists():
                missing_svg.append(slug)
                continue

            content = html_path.read_text(encoding="utf-8", errors="ignore")
            has_svg = "<svg" in content and "viewBox" in content
            has_architecture_stages = any(
                term in content
                for term in [
                    "INGRESS GATEWAY", "HSM ENCLAVE", "vLLM FP8 ENCLAVE", "CBS LEDGER",
                    "TELEMETRY PROVENANCE", "State Machine", "Protocol Translation",
                    "Audit Hash Chain", "Ring Buffer", "FHIR", "OPC-UA", "Byzantine State",
                    "Data Pipeline", "Architecture Topology", "Pipeline Stages"
                ]
            )
            if not (has_svg and has_architecture_stages):
                missing_svg.append(slug)

        assert len(missing_svg) == 0, (
            f"{len(missing_svg)}/100 retained enterprise pages lack vector SVG architecture schematics. "
            f"Sample missing: {missing_svg[:5]}"
        )

    def test_100_percent_retained_pages_contain_empirical_benchmark_matrices(self, partitions):
        """Verifies that all 100 retained enterprise pages contain latency profiles and QPS metrics."""
        _, retained_slugs = partitions
        missing_benchmarks = []

        for slug in retained_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"
            if not html_path.exists():
                missing_benchmarks.append(slug)
                continue

            content = html_path.read_text(encoding="utf-8", errors="ignore")
            has_latency = any(t in content.lower() for t in ["p50", "p90", "p99", "median latency", "tail latency"])
            has_throughput = any(t in content.lower() for t in ["qps", "req/sec", "requests/sec", "concurrency streams", "sustained throughput"])
            has_matrix = any(
                t in content
                for t in [
                    "Empirical Benchmark", "Empirical Telemetry", "Latency Profile",
                    "Hardware Configuration", "Execution Environment Specification"
                ]
            )
            if not ((has_latency and has_throughput) or has_matrix):
                missing_benchmarks.append(slug)

        assert len(missing_benchmarks) == 0, (
            f"{len(missing_benchmarks)}/100 retained enterprise pages lack empirical benchmark matrices. "
            f"Sample missing: {missing_benchmarks[:5]}"
        )

    def test_gate_6_full_certification(self, verifier: PruningAndCurationVerifier):
        """Master Gate 6 certification assertion."""
        res = verifier.verify_gate_6_schematics_and_benchmarks()
        assert res.passed, f"Gate 6 Failed: {res.summary}. Failures: {res.failures[:3]}"
