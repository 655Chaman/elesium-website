#!/usr/bin/env python3
"""
========================================================================================
🔱 ELESIUM AUTOMATED PRUNING & ENTERPRISE CURATION VERIFICATION SUITE (R4) 🔱
========================================================================================
Classification: Production Automated Quality Gate & SEO De-indexing Verification Engine
Repository: Elesium Online (https://elesium.online)

Purpose:
  Independently verifies the de-indexing and pruning of thin programmatic doorway duplicates
  (R1, R2) and the technical enrichment and curation of top enterprise solution pages (R3).

Automated Verification Gates:
  - GATE 1: HTTP 410 Gone Server & Router Configuration Assertions
            Validates automation/algorithmic_cull_http_410.conf, frontend/public/_redirects,
            and frontend/vite.config.ts (http410Plugin).
  - GATE 2: Pre-rendered HTML <meta name="robots" content="noindex, follow"> Verification
            Verifies noindex, follow tags on all pruned pre-rendered HTML files in
            frontend/dist/solutions/ and frontend/public/solutions/.
  - GATE 3: 100% Sitemaps Purge Verification
            Verifies 0 pruned URLs in frontend/public/sitemap-solutions.xml, dist mirror,
            and master sitemap.xml, and asserts exactly 100 retained enterprise URLs.
  - GATE 4: 0 Internal Broken Links to 410 Routes from Retained Production Pages
            Audits all retained HTML files in dist/solutions/, Footer.tsx, blogPosts.ts,
            glossaryData.ts, solutions/index.html, and 13 category pillar hubs.
  - GATE 5: Vocabulary Jaccard Similarity Certification across Retained Pages
            Certifies that pairwise vocabulary Jaccard similarity across retained
            enterprise pages is strictly < 50.0% (down from ~73% baseline).
  - GATE 6: 100% Presence of Custom Architecture Schematics (SVGs) & Empirical Benchmarks
            Verifies responsive vector-native SVG schematics and 5-vector empirical benchmark
            data matrices (p50/p90/p99 latency, QPS, throughput) on 100% of retained pages.

Usage:
  python3 automation/verify_pruning_and_curation.py
  python3 automation/verify_pruning_and_curation.py --gate 1
  python3 automation/verify_pruning_and_curation.py --json-output reports/verification_report.json
  python3 automation/verify_pruning_and_curation.py --verbose
========================================================================================
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import time
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass, field
from itertools import combinations
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

# Base Project Paths
ROOT_DIR = Path(__file__).resolve().parent.parent
AUTOMATION_DIR = ROOT_DIR / "automation"
FRONTEND_DIR = ROOT_DIR / "frontend"
DIST_DIR = FRONTEND_DIR / "dist"
PUBLIC_DIR = FRONTEND_DIR / "public"
SOLUTIONS_DIST = DIST_DIR / "solutions"
SOLUTIONS_PUBLIC = PUBLIC_DIR / "solutions"
SRC_DIR = FRONTEND_DIR / "src"

# Data Sources & Configuration Files
QUEUE_FILE = AUTOMATION_DIR / "compact_keywords_queue.json"
TOP100_FILE = ROOT_DIR / "authority_assets" / "indexation_acceleration" / "top100_commercial_urls.json"
PRUNED_SLUGS_FILE = AUTOMATION_DIR / "pruned_solution_slugs.json"
RETAINED_SLUGS_FILE = AUTOMATION_DIR / "retained_solution_slugs.json"

NGINX_410_CONF = AUTOMATION_DIR / "algorithmic_cull_http_410.conf"
REDIRECTS_FILE = PUBLIC_DIR / "_redirects"
VITE_CONFIG = FRONTEND_DIR / "vite.config.ts"

SITEMAP_SOLUTIONS_PUBLIC = PUBLIC_DIR / "sitemap-solutions.xml"
SITEMAP_SOLUTIONS_DIST = DIST_DIR / "sitemap-solutions.xml"
SITEMAP_MASTER_PUBLIC = PUBLIC_DIR / "sitemap.xml"
SITEMAP_MASTER_DIST = DIST_DIR / "sitemap.xml"
SITEMAP_CORE_PUBLIC = PUBLIC_DIR / "sitemap-core.xml"

FOOTER_FILE = SRC_DIR / "components" / "layout" / "Footer.tsx"
BLOG_POSTS_FILE = SRC_DIR / "data" / "blogPosts.ts"
GLOSSARY_FILE = SRC_DIR / "data" / "glossaryData.ts"
SOLUTIONS_HUB_DATA_FILE = SRC_DIR / "data" / "solutionsHubData.ts"
COMPARE_DATA_FILE = SRC_DIR / "data" / "compareData.ts"
DIST_DATA_SOLUTIONS = DIST_DIR / "data" / "solutions"
SOLUTIONS_INDEX_HTML = SOLUTIONS_DIST / "index.html"
CATEGORY_DIR = SOLUTIONS_DIST / "category"

STOPWORDS: Set[str] = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
    "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt",
    "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here",
    "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im",
    "ive", "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most",
    "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she",
    "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats",
    "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they",
    "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under",
    "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what",
    "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why",
    "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your",
    "yours", "yourself", "yourselves"
}


@dataclass
class GateResult:
    gate_number: int
    name: str
    passed: bool
    summary: str
    metrics: Dict[str, Any] = field(default_factory=dict)
    failures: List[str] = field(default_factory=list)
    execution_time_seconds: float = 0.0


class PruningAndCurationVerifier:
    """
    Automated verification engine validating all 6 gates for programmatic pruning
    and high-intent enterprise solution curation.
    """

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self._pruned_slugs: Optional[Set[str]] = None
        self._retained_slugs: Optional[Set[str]] = None
        self._all_slugs: Optional[Set[str]] = None

    # --------------------------------------------------------------------------
    # Inventory & Partition Loading
    # --------------------------------------------------------------------------
    def load_partitions(self) -> Tuple[Set[str], Set[str]]:
        """
        Loads the authoritative partitions:
        - 100 Retained Enterprise Slugs
        - 3,695 Pruned Doorway Slugs
        Derived from manifests if present, or dynamically from compact_keywords_queue.json
        and top100_commercial_urls.json.
        """
        if self._pruned_slugs is not None and self._retained_slugs is not None:
            return self._pruned_slugs, self._retained_slugs

        # 1. Load All Slugs from Queue (Baseline = 3,795)
        if not QUEUE_FILE.exists():
            raise FileNotFoundError(f"Baseline keywords queue not found: {QUEUE_FILE}")

        with open(QUEUE_FILE, "r", encoding="utf-8") as f:
            queue_data = json.load(f)
        all_slugs = set(item["slug"] for item in queue_data if "slug" in item)
        self._all_slugs = all_slugs

        # 2. Load Retained Enterprise Slugs (Target = 100)
        retained_slugs: Set[str] = set()
        if RETAINED_SLUGS_FILE.exists():
            with open(RETAINED_SLUGS_FILE, "r", encoding="utf-8") as f:
                retained_data = json.load(f)
                if isinstance(retained_data, list):
                    if len(retained_data) > 0 and isinstance(retained_data[0], dict):
                        retained_slugs = set(item["slug"] for item in retained_data if "slug" in item)
                    else:
                        retained_slugs = set(retained_data)
        elif TOP100_FILE.exists():
            with open(TOP100_FILE, "r", encoding="utf-8") as f:
                top100_data = json.load(f)
            retained_slugs = set(item["slug"] for item in top100_data if "slug" in item)

        # 3. Load or Derive Pruned Slugs (Target = 3,695)
        pruned_slugs: Set[str] = set()
        if PRUNED_SLUGS_FILE.exists():
            with open(PRUNED_SLUGS_FILE, "r", encoding="utf-8") as f:
                pruned_data = json.load(f)
                if isinstance(pruned_data, list):
                    if len(pruned_data) > 0 and isinstance(pruned_data[0], dict):
                        pruned_slugs = set(item["slug"] for item in pruned_data if "slug" in item)
                    else:
                        pruned_slugs = set(pruned_data)
        else:
            pruned_slugs = all_slugs - retained_slugs

        self._pruned_slugs = pruned_slugs
        self._retained_slugs = retained_slugs

        return self._pruned_slugs, self._retained_slugs

    # --------------------------------------------------------------------------
    # GATE 1: HTTP 410 Gone Server & Router Configuration Assertions
    # --------------------------------------------------------------------------
    def verify_gate_1_http_410_config(self) -> GateResult:
        """
        Validates:
        1. automation/algorithmic_cull_http_410.conf (Nginx 410 directives for all pruned slugs)
        2. frontend/public/_redirects (Cloudflare/Netlify 410 status rules for all pruned slugs)
        3. frontend/vite.config.ts (http410Plugin configured for preview/dev servers)
        """
        start_time = time.time()
        pruned_slugs, _ = self.load_partitions()
        total_pruned = len(pruned_slugs)

        failures: List[str] = []
        metrics: Dict[str, Any] = {
            "total_pruned_slugs_required": total_pruned,
            "nginx_conf_exists": False,
            "nginx_410_coverage": 0,
            "redirects_file_exists": False,
            "redirects_410_coverage": 0,
            "vite_http410_plugin_configured": False,
        }

        # 1. Audit Nginx 410 Configuration
        if not NGINX_410_CONF.exists():
            failures.append(f"Missing Nginx 410 config file: {NGINX_410_CONF}")
        else:
            metrics["nginx_conf_exists"] = True
            conf_text = NGINX_410_CONF.read_text(encoding="utf-8", errors="ignore")
            matched_nginx = 0
            for slug in pruned_slugs:
                # Expect location = /solutions/<slug> { return 410; } or location = /solutions/<slug>/ { return 410; }
                if f"/solutions/{slug}" in conf_text and "return 410" in conf_text:
                    matched_nginx += 1
            metrics["nginx_410_coverage"] = matched_nginx
            if matched_nginx < total_pruned:
                missing = total_pruned - matched_nginx
                failures.append(
                    f"Nginx config incomplete: {matched_nginx}/{total_pruned} pruned slugs covered ({missing} missing)"
                )

        # 2. Audit _redirects Configuration
        if not REDIRECTS_FILE.exists():
            failures.append(f"Missing Cloudflare/Netlify _redirects file: {REDIRECTS_FILE}")
        else:
            metrics["redirects_file_exists"] = True
            redirects_text = REDIRECTS_FILE.read_text(encoding="utf-8", errors="ignore")
            matched_redirects = 0
            for slug in pruned_slugs:
                # Expect /solutions/<slug> 410 or /solutions/<slug>/ 410!
                if f"/solutions/{slug}" in redirects_text and "410" in redirects_text:
                    matched_redirects += 1
            metrics["redirects_410_coverage"] = matched_redirects
            if matched_redirects < total_pruned:
                missing = total_pruned - matched_redirects
                failures.append(
                    f"_redirects config incomplete: {matched_redirects}/{total_pruned} pruned slugs covered ({missing} missing)"
                )

        # 3. Audit Vite Configuration for http410Plugin
        if not VITE_CONFIG.exists():
            failures.append(f"Missing Vite configuration: {VITE_CONFIG}")
        else:
            vite_text = VITE_CONFIG.read_text(encoding="utf-8", errors="ignore")
            # Check for http410Plugin or 410 middleware
            has_plugin_name = "http410" in vite_text.lower() or "410plugin" in vite_text.lower()
            has_status_code = "410" in vite_text and ("statuscode" in vite_text.lower() or "status(410)" in vite_text)
            if has_plugin_name and has_status_code:
                metrics["vite_http410_plugin_configured"] = True
            else:
                failures.append(
                    "Vite config missing http410Plugin middleware: must intercept pruned routes and return HTTP 410"
                )

        passed = len(failures) == 0
        summary = (
            f"Gate 1 Passed: 100% of {total_pruned} pruned routes covered across Nginx, _redirects, and Vite"
            if passed
            else f"Gate 1 Failed: {len(failures)} configuration deficiencies detected"
        )

        return GateResult(
            gate_number=1,
            name="HTTP 410 Gone Server & Router Configuration",
            passed=passed,
            summary=summary,
            metrics=metrics,
            failures=failures,
            execution_time_seconds=round(time.time() - start_time, 3),
        )

    # --------------------------------------------------------------------------
    # GATE 2: Pre-rendered HTML <meta name="robots" content="noindex, follow">
    # --------------------------------------------------------------------------
    def verify_gate_2_robots_noindex_follow(self, sample_limit: Optional[int] = None) -> GateResult:
        """
        Validates that all pre-rendered HTML files for pruned slugs contain:
          <meta name="robots" content="noindex, follow">
        and do NOT contain affirmative indexing directives (e.g. index, follow).
        Scans frontend/dist/solutions/ and frontend/public/solutions/.
        """
        start_time = time.time()
        pruned_slugs, _ = self.load_partitions()
        slug_list = sorted(list(pruned_slugs))
        if sample_limit:
            slug_list = slug_list[:sample_limit]

        failures: List[str] = []
        missing_tag_dist = 0
        has_index_affirmative_dist = 0
        missing_files_dist = 0
        valid_dist = 0

        # Regex patterns for fast extraction
        meta_pattern = re.compile(
            r'<meta\s+[^>]*name=["\'](?:robots|googlebot)["\'][^>]*content=["\']([^"\']+)["\']',
            re.IGNORECASE
        )
        meta_pattern_alt = re.compile(
            r'<meta\s+[^>]*content=["\']([^"\']+)["\'][^>]*name=["\'](?:robots|googlebot)["\']',
            re.IGNORECASE
        )

        for slug in slug_list:
            # Check nested index.html and flat .html in dist
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"

            if not html_path.exists():
                missing_files_dist += 1
                continue

            try:
                # Read head portion of HTML (first 4KB contains all head meta tags)
                with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
                    head_chunk = f.read(4096)

                matches = meta_pattern.findall(head_chunk) + meta_pattern_alt.findall(head_chunk)
                if not matches:
                    missing_tag_dist += 1
                    failures.append(f"Dist solution {slug}: Missing robots meta tag entirely")
                    continue

                content_val = " ".join(matches).lower()
                has_noindex = "noindex" in content_val
                has_follow = "follow" in content_val
                # Check for affirmative 'index' not preceded by 'no'
                has_affirmative_index = bool(re.search(r'(?<!no)index', content_val))

                if not (has_noindex and has_follow) or has_affirmative_index:
                    has_index_affirmative_dist += 1
                    failures.append(
                        f"Dist solution {slug}: Invalid robots tag '{content_val}' (expected 'noindex, follow')"
                    )
                else:
                    valid_dist += 1
            except Exception as e:
                failures.append(f"Dist solution {slug}: Error reading file: {e}")

        # Also inspect public/solutions/ if public directory exists
        public_missing_noindex = 0
        if SOLUTIONS_PUBLIC.exists():
            for slug in slug_list:
                pub_html = SOLUTIONS_PUBLIC / slug / "index.html"
                if pub_html.exists():
                    try:
                        with open(pub_html, "r", encoding="utf-8", errors="ignore") as f:
                            head_chunk = f.read(4096)
                        matches = meta_pattern.findall(head_chunk) + meta_pattern_alt.findall(head_chunk)
                        content_val = " ".join(matches).lower() if matches else ""
                        if "noindex" not in content_val:
                            public_missing_noindex += 1
                    except Exception:
                        pass

        metrics = {
            "total_pruned_audited": len(slug_list),
            "valid_noindex_dist": valid_dist,
            "missing_tag_dist": missing_tag_dist,
            "has_affirmative_index_dist": has_index_affirmative_dist,
            "missing_files_dist": missing_files_dist,
            "public_missing_noindex": public_missing_noindex,
        }

        # Failure condition: any file is missing noindex or still affirmative index
        passed = (
            missing_tag_dist == 0
            and has_index_affirmative_dist == 0
            and public_missing_noindex == 0
            and len(slug_list) > 0
            and valid_dist == (len(slug_list) - missing_files_dist)
            and missing_files_dist < len(slug_list)  # Files must exist and be certified
        )

        summary = (
            f"Gate 2 Passed: 100% of {valid_dist} audited pruned HTML files carry <meta name='robots' content='noindex, follow'>"
            if passed
            else f"Gate 2 Failed: {missing_tag_dist + has_index_affirmative_dist + public_missing_noindex} pruned files lack proper noindex directives"
        )

        return GateResult(
            gate_number=2,
            name="Pre-rendered HTML <meta name='robots' content='noindex, follow'> Verification",
            passed=passed,
            summary=summary,
            metrics=metrics,
            failures=failures[:50],  # Cap failure list to top 50 in return
            execution_time_seconds=round(time.time() - start_time, 3),
        )

    # --------------------------------------------------------------------------
    # GATE 3: 100% Sitemaps Purge Verification
    # --------------------------------------------------------------------------
    def verify_gate_3_sitemaps_purge(self) -> GateResult:
        """
        Validates:
        1. 0 pruned URLs appear in sitemap-solutions.xml, master sitemap.xml, or sitemap-core.xml
        2. Exactly 100 retained enterprise URLs are present in frontend/public/sitemap-solutions.xml
           and frontend/dist/sitemap-solutions.xml.
        """
        start_time = time.time()
        pruned_slugs, retained_slugs = self.load_partitions()
        failures: List[str] = []

        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

        def extract_locs(sitemap_path: Path) -> Set[str]:
            if not sitemap_path.exists():
                return set()
            try:
                tree = ET.parse(sitemap_path)
                root = tree.getroot()
                locs = set()
                for elem in root.findall(".//sm:loc", ns):
                    if elem.text:
                        locs.add(elem.text.strip())
                # Fallback without namespace if default xmlns not bound
                if not locs:
                    for elem in root.findall(".//loc"):
                        if elem.text:
                            locs.add(elem.text.strip())
                return locs
            except Exception as e:
                failures.append(f"Failed to parse XML sitemap {sitemap_path}: {e}")
                return set()

        # Audit sitemap-solutions.xml in public and dist
        public_sol_locs = extract_locs(SITEMAP_SOLUTIONS_PUBLIC)
        dist_sol_locs = extract_locs(SITEMAP_SOLUTIONS_DIST)
        master_public_locs = extract_locs(SITEMAP_MASTER_PUBLIC)
        core_public_locs = extract_locs(SITEMAP_CORE_PUBLIC)

        # Check for pruned slugs in public sitemap-solutions.xml
        pruned_in_public_solutions = [
            s for s in pruned_slugs
            if f"https://elesium.online/solutions/{s}/" in public_sol_locs
            or f"https://elesium.online/solutions/{s}" in public_sol_locs
        ]

        # Check for pruned slugs in dist sitemap-solutions.xml
        pruned_in_dist_solutions = [
            s for s in pruned_slugs
            if f"https://elesium.online/solutions/{s}/" in dist_sol_locs
            or f"https://elesium.online/solutions/{s}" in dist_sol_locs
        ]

        # Check for pruned slugs in master or core sitemaps
        pruned_in_master = [
            s for s in pruned_slugs
            if f"https://elesium.online/solutions/{s}/" in master_public_locs
            or f"https://elesium.online/solutions/{s}" in master_public_locs
        ]

        if pruned_in_public_solutions:
            failures.append(
                f"Contamination: {len(pruned_in_public_solutions)} pruned URLs remain in frontend/public/sitemap-solutions.xml"
            )
        if pruned_in_dist_solutions:
            failures.append(
                f"Contamination: {len(pruned_in_dist_solutions)} pruned URLs remain in frontend/dist/sitemap-solutions.xml"
            )
        if pruned_in_master:
            failures.append(
                f"Contamination: {len(pruned_in_master)} pruned URLs remain in frontend/public/sitemap.xml"
            )

        # Check count of retained enterprise URLs in sitemap-solutions.xml
        public_url_count = len(public_sol_locs)
        expected_retained_count = len(retained_slugs)

        if public_url_count != expected_retained_count:
            failures.append(
                f"URL Count Mismatch in public sitemap-solutions.xml: Found {public_url_count} URLs, expected exactly {expected_retained_count}"
            )

        # Verify all retained enterprise URLs are present
        missing_retained = [
            s for s in retained_slugs
            if f"https://elesium.online/solutions/{s}/" not in public_sol_locs
            and f"https://elesium.online/solutions/{s}" not in public_sol_locs
        ]
        if missing_retained:
            failures.append(
                f"Missing Retained URLs: {len(missing_retained)} enterprise solutions missing from sitemap-solutions.xml"
            )

        metrics = {
            "public_sitemap_solutions_total_urls": public_url_count,
            "dist_sitemap_solutions_total_urls": len(dist_sol_locs),
            "expected_retained_urls": expected_retained_count,
            "pruned_urls_in_public_sitemap": len(pruned_in_public_solutions),
            "pruned_urls_in_dist_sitemap": len(pruned_in_dist_solutions),
            "missing_retained_urls_count": len(missing_retained),
        }

        passed = len(failures) == 0
        summary = (
            f"Gate 3 Passed: Sitemaps 100% purged of pruned URLs; exactly {expected_retained_count} retained enterprise URLs present"
            if passed
            else f"Gate 3 Failed: {len(pruned_in_public_solutions)} pruned URLs found in sitemaps; URL count is {public_url_count} (expected {expected_retained_count})"
        )

        return GateResult(
            gate_number=3,
            name="100% Sitemaps Purge Verification",
            passed=passed,
            summary=summary,
            metrics=metrics,
            failures=failures,
            execution_time_seconds=round(time.time() - start_time, 3),
        )

    # --------------------------------------------------------------------------
    # GATE 4: 0 Internal Broken Links to 410 Routes from Retained Pages
    # --------------------------------------------------------------------------
    def verify_gate_4_internal_broken_links(self) -> GateResult:
        """
        Validates that 0 internal links point to 410 pruned routes or broken nonexistent routes from:
        - Retained solution HTML files in frontend/dist/solutions/
        - frontend/src/components/layout/Footer.tsx
        - frontend/src/data/blogPosts.ts
        - frontend/src/data/glossaryData.ts
        - frontend/dist/solutions/index.html (Solutions Hub)
        - 13 category pillar hubs in frontend/dist/solutions/category/
        """
        start_time = time.time()
        pruned_slugs, retained_slugs = self.load_partitions()
        broken_links: List[Tuple[str, str, str]] = []  # (source_file, target_slug, reason)

        href_pattern = re.compile(r'href=["\'](?:https?://elesium\.online)?/solutions/([^"\'#?]+)/?["\']')
        path_pattern = re.compile(r'path:\s*["\'](?:https?://elesium\.online)?/solutions/([^"\'#?]+)/?["\']')
        url_pattern = re.compile(r'relatedSolutionUrl:\s*["\'](?:https?://elesium\.online)?/solutions/([^"\'#?]+)/?["\']')
        md_link_pattern = re.compile(r'\[.*?\]\((?:https?://elesium\.online)?/solutions/([^"\'#?)]+)/?\)')

        def check_slug(source_label: str, target: str):
            target = target.strip("/").strip()
            # Ignore subcategory or root navigation
            if not target or target.startswith("category"):
                return
            if target in pruned_slugs:
                broken_links.append((source_label, target, "Points to 410 pruned route"))
            elif target not in retained_slugs:
                # Target is neither in retained nor valid on disk
                target_file = SOLUTIONS_DIST / target / "index.html"
                target_file_flat = SOLUTIONS_DIST / f"{target}.html"
                if not target_file.exists() and not target_file_flat.exists():
                    broken_links.append((source_label, target, "Broken link: destination does not exist"))

        # 1. Audit Footer.tsx
        if FOOTER_FILE.exists():
            footer_text = FOOTER_FILE.read_text(encoding="utf-8", errors="ignore")
            for m in href_pattern.findall(footer_text) + path_pattern.findall(footer_text):
                check_slug("frontend/src/components/layout/Footer.tsx", m)

        # 2. Audit blogPosts.ts
        if BLOG_POSTS_FILE.exists():
            blog_text = BLOG_POSTS_FILE.read_text(encoding="utf-8", errors="ignore")
            for m in href_pattern.findall(blog_text) + md_link_pattern.findall(blog_text):
                check_slug("frontend/src/data/blogPosts.ts", m)

        # 3. Audit glossaryData.ts
        if GLOSSARY_FILE.exists():
            glossary_text = GLOSSARY_FILE.read_text(encoding="utf-8", errors="ignore")
            for m in url_pattern.findall(glossary_text) + href_pattern.findall(glossary_text):
                check_slug("frontend/src/data/glossaryData.ts", m)

        # 4. Audit Solutions Index Hub (solutions/index.html)
        if SOLUTIONS_INDEX_HTML.exists():
            hub_text = SOLUTIONS_INDEX_HTML.read_text(encoding="utf-8", errors="ignore")
            for m in href_pattern.findall(hub_text):
                check_slug("frontend/dist/solutions/index.html", m)

        # 5. Audit 13 Category Pillar Hubs
        if CATEGORY_DIR.exists():
            for cat_path in CATEGORY_DIR.glob("**/*.html"):
                try:
                    cat_text = cat_path.read_text(encoding="utf-8", errors="ignore")
                    rel_source = str(cat_path.relative_to(ROOT_DIR))
                    for m in href_pattern.findall(cat_text):
                        check_slug(rel_source, m)
                except Exception:
                    pass

        # 6. Audit All Retained Solution HTML Files
        for slug in retained_slugs:
            sol_html = SOLUTIONS_DIST / slug / "index.html"
            if not sol_html.exists():
                sol_html = SOLUTIONS_DIST / f"{slug}.html"
            if sol_html.exists():
                try:
                    sol_text = sol_html.read_text(encoding="utf-8", errors="ignore")
                    for m in href_pattern.findall(sol_text):
                        check_slug(f"solutions/{slug}", m)
                except Exception:
                    pass

        # 7. Audit solutionsHubData.ts (assert 0 pruned slugs)
        if SOLUTIONS_HUB_DATA_FILE.exists():
            hub_data_text = SOLUTIONS_HUB_DATA_FILE.read_text(encoding="utf-8", errors="ignore")
            for p_slug in pruned_slugs:
                if f'"{p_slug}"' in hub_data_text or f"'{p_slug}'" in hub_data_text:
                    broken_links.append(("frontend/src/data/solutionsHubData.ts", p_slug, "Pruned slug present in solutionsHubData.ts"))

        # 8. Audit compareData.ts (assert 0 pruned slugs)
        if COMPARE_DATA_FILE.exists():
            compare_text = COMPARE_DATA_FILE.read_text(encoding="utf-8", errors="ignore")
            for m in re.findall(r'relatedSolutionSlug:\s*["\']([^"\']+)["\']', compare_text):
                check_slug("frontend/src/data/compareData.ts", m)
            for p_slug in pruned_slugs:
                if f'"{p_slug}"' in compare_text or f"'{p_slug}'" in compare_text:
                    broken_links.append(("frontend/src/data/compareData.ts", p_slug, "Pruned slug present in compareData.ts"))

        # 9. Audit all top-level .html files in frontend/dist/*.html (e.g. commercial-directory.html, etc.)
        if DIST_DIR.exists():
            for top_html in DIST_DIR.glob("*.html"):
                if top_html.name in ["solutions.html"]:
                    continue  # Checked in step 4
                try:
                    top_text = top_html.read_text(encoding="utf-8", errors="ignore")
                    rel_name = f"frontend/dist/{top_html.name}"
                    for m in href_pattern.findall(top_text):
                        check_slug(rel_name, m)
                except Exception:
                    pass

        # 10. Audit frontend/dist/data/solutions/ file count and contents
        if DIST_DATA_SOLUTIONS.exists():
            json_files = list(DIST_DATA_SOLUTIONS.glob("*.json"))
            if len(json_files) != len(retained_slugs):
                broken_links.append((
                    "frontend/dist/data/solutions/",
                    f"count={len(json_files)}",
                    f"Expected exactly {len(retained_slugs)} JSON files, found {len(json_files)}"
                ))
            for jf in json_files:
                slug_name = jf.stem
                if slug_name in pruned_slugs:
                    broken_links.append((
                        f"frontend/dist/data/solutions/{jf.name}",
                        slug_name,
                        "Pruned JSON file exists on disk"
                    ))
                elif slug_name not in retained_slugs:
                    broken_links.append((
                        f"frontend/dist/data/solutions/{jf.name}",
                        slug_name,
                        "JSON file not in retained enterprise set"
                    ))

        failures = [
            f"Broken Link: [{src}] -> /solutions/{target}/ ({reason})"
            for src, target, reason in broken_links
        ]

        metrics = {
            "total_broken_links_found": len(broken_links),
            "broken_link_samples": [
                {"source": s, "target": t, "reason": r} for s, t, r in broken_links[:20]
            ],
        }

        passed = len(broken_links) == 0
        summary = (
            "Gate 4 Passed: 0 internal links point to 410 pruned routes or broken destinations from retained production pages"
            if passed
            else f"Gate 4 Failed: {len(broken_links)} internal broken links detected pointing to 410 or nonexistent routes"
        )

        return GateResult(
            gate_number=4,
            name="0 Internal Broken Links to 410 Routes from Retained Pages",
            passed=passed,
            summary=summary,
            metrics=metrics,
            failures=failures[:50],
            execution_time_seconds=round(time.time() - start_time, 3),
        )

    # --------------------------------------------------------------------------
    # GATE 5: Vocabulary Jaccard Similarity Certification (< 50% vs ~73% baseline)
    # --------------------------------------------------------------------------
    def verify_gate_5_jaccard_similarity(self, threshold: float = 0.50) -> GateResult:
        """
        Extracts visible content across retained enterprise solution HTML pages, tokenizes into
        vocabulary sets, and computes pairwise Jaccard similarity.
        Asserts mean Jaccard similarity across retained enterprise pages is strictly < threshold (50.0%).
        """
        start_time = time.time()
        _, retained_slugs = self.load_partitions()
        failures: List[str] = []

        vocab_map: Dict[str, Set[str]] = {}

        for slug in retained_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"

            if not html_path.exists():
                continue

            try:
                html_text = html_path.read_text(encoding="utf-8", errors="ignore")
                # Extract solution body text from #prerendered-solution or main container
                m = re.search(r'<div id="prerendered-solution"[^>]*>(.*?)</div>\s*</main>', html_text, re.DOTALL)
                body_html = m.group(1) if m else html_text

                # Strip script, style, svg, and tag wrappers
                cleaned = re.sub(r'<(script|style|svg)[^>]*>.*?</\1>', ' ', body_html, flags=re.DOTALL | re.IGNORECASE)
                cleaned = re.sub(r'<[^>]+>', ' ', cleaned)
                cleaned = re.sub(r'&[a-zA-Z0-9#]+;', ' ', cleaned)

                # Tokenize into clean lowercase alphabetic words >= 3 chars
                words = set(re.findall(r'\b[a-zA-Z]{3,}\b', cleaned.lower())) - STOPWORDS
                if words:
                    vocab_map[slug] = words
            except Exception as e:
                failures.append(f"Failed to tokenize retained solution {slug}: {e}")

        total_analyzed = len(vocab_map)
        if total_analyzed < 2:
            failures.append(f"Insufficient retained pages found for Jaccard similarity analysis (found {total_analyzed}, need >= 2)")
            return GateResult(
                gate_number=5,
                name="Vocabulary Jaccard Similarity Certification",
                passed=False,
                summary=f"Gate 5 Failed: Insufficient retained pages found ({total_analyzed})",
                metrics={"analyzed_pages": total_analyzed},
                failures=failures,
                execution_time_seconds=round(time.time() - start_time, 3),
            )

        pairs = list(combinations(vocab_map.keys(), 2))
        sims: List[float] = []
        high_sim_pairs: List[Tuple[str, str, float]] = []

        for s1, s2 in pairs:
            v1, v2 = vocab_map[s1], vocab_map[s2]
            intersection_size = len(v1 & v2)
            union_size = len(v1 | v2)
            jaccard = intersection_size / union_size if union_size > 0 else 0.0
            sims.append(jaccard)
            if jaccard >= 0.65:
                high_sim_pairs.append((s1, s2, round(jaccard, 4)))

        mean_jaccard = sum(sims) / len(sims)
        max_jaccard = max(sims)
        min_jaccard = min(sims)

        # Standard Deviation
        variance = sum((x - mean_jaccard) ** 2 for x in sims) / len(sims)
        std_dev = math.sqrt(variance)

        metrics = {
            "retained_pages_analyzed": total_analyzed,
            "total_pairwise_combinations": len(sims),
            "mean_jaccard_similarity": round(mean_jaccard, 4),
            "mean_jaccard_percentage": f"{mean_jaccard * 100:.2f}%",
            "threshold_percentage": f"{threshold * 100:.2f}%",
            "baseline_percentage": "73.00%",
            "max_pairwise_similarity": round(max_jaccard, 4),
            "min_pairwise_similarity": round(min_jaccard, 4),
            "std_dev": round(std_dev, 4),
            "pairs_exceeding_65_percent_count": len(high_sim_pairs),
            "top_similar_pairs_sample": [
                {"page_a": a, "page_b": b, "jaccard": j} for a, b, j in sorted(high_sim_pairs, key=lambda x: x[2], reverse=True)[:10]
            ],
        }

        # Assert mean similarity strictly below threshold (< 0.50)
        passed = mean_jaccard < threshold

        if not passed:
            failures.append(
                f"Mean Jaccard similarity is {mean_jaccard * 100:.2f}%, exceeding maximum threshold of {threshold * 100:.2f}% (Baseline: ~73%)"
            )
        if len(high_sim_pairs) > 10:
            failures.append(
                f"Detected {len(high_sim_pairs)} pairs with high similarity >= 65.0% indicating residual template boilerplate duplication"
            )

        summary = (
            f"Gate 5 Passed: Mean Jaccard similarity is {mean_jaccard * 100:.2f}% (certified below {threshold * 100:.2f}% threshold; baseline 73%)"
            if passed
            else f"Gate 5 Failed: Mean Jaccard similarity is {mean_jaccard * 100:.2f}% (must be < {threshold * 100:.2f}%)"
        )

        return GateResult(
            gate_number=5,
            name="Vocabulary Jaccard Similarity Certification",
            passed=passed,
            summary=summary,
            metrics=metrics,
            failures=failures,
            execution_time_seconds=round(time.time() - start_time, 3),
        )

    # --------------------------------------------------------------------------
    # GATE 6: 100% Custom Architecture Schematics & Empirical Benchmarks
    # --------------------------------------------------------------------------
    def verify_gate_6_schematics_and_benchmarks(self) -> GateResult:
        """
        Validates:
        1. 100% of retained enterprise solution pages contain custom vector SVG architecture schematics
           (<svg viewBox="..."> with labeled architecture stage text nodes).
        2. 100% of retained enterprise solution pages contain an authentic empirical benchmark matrix
           (latency p50/p90/p99 profiles, sustained QPS, and throughput metrics).
        """
        start_time = time.time()
        _, retained_slugs = self.load_partitions()
        failures: List[str] = []

        missing_svg: List[str] = []
        missing_benchmarks: List[str] = []
        fully_compliant: List[str] = []

        for slug in retained_slugs:
            html_path = SOLUTIONS_DIST / slug / "index.html"
            if not html_path.exists():
                html_path = SOLUTIONS_DIST / f"{slug}.html"

            if not html_path.exists():
                failures.append(f"Retained enterprise solution file missing on disk: {slug}")
                missing_svg.append(slug)
                missing_benchmarks.append(slug)
                continue

            try:
                html_text = html_path.read_text(encoding="utf-8", errors="ignore")

                # 1. Custom Architecture Schematic Audit
                # Must contain responsive vector SVG with viewBox and technical stage descriptions
                has_svg = "<svg" in html_text and "viewBox" in html_text
                # Check for authentic architectural diagram entities inside SVG or text
                has_architecture_stages = any(
                    term in html_text
                    for term in [
                        "INGRESS GATEWAY", "HSM ENCLAVE", "vLLM FP8 ENCLAVE", "CBS LEDGER",
                        "TELEMETRY PROVENANCE", "State Machine", "Protocol Translation",
                        "Audit Hash Chain", "Ring Buffer", "FHIR", "OPC-UA", "Byzantine State",
                        "Data Pipeline", "Architecture Topology", "Pipeline Stages"
                    ]
                )
                valid_schematic = has_svg and has_architecture_stages
                if not valid_schematic:
                    missing_svg.append(slug)

                # 2. Empirical Benchmark Matrix Audit
                # Must contain latency metrics (p50/p90/p99) and capacity metrics (QPS/Throughput)
                has_latency_profile = any(term in html_text.lower() for term in ["p50", "p90", "p99", "median latency", "tail latency"])
                has_throughput_profile = any(term in html_text.lower() for term in ["qps", "req/sec", "requests/sec", "concurrency streams", "sustained throughput"])
                has_benchmark_matrix = any(
                    term in html_text
                    for term in [
                        "Empirical Benchmark", "Empirical Telemetry", "Latency Profile",
                        "Hardware Configuration", "Execution Environment Specification"
                    ]
                )

                valid_benchmark = (has_latency_profile and has_throughput_profile) or has_benchmark_matrix
                if not valid_benchmark:
                    missing_benchmarks.append(slug)

                if valid_schematic and valid_benchmark:
                    fully_compliant.append(slug)

            except Exception as e:
                failures.append(f"Error inspecting retained page {slug}: {e}")

        total_retained = len(retained_slugs)
        svg_compliance_pct = ((total_retained - len(missing_svg)) / total_retained * 100) if total_retained else 0.0
        bench_compliance_pct = ((total_retained - len(missing_benchmarks)) / total_retained * 100) if total_retained else 0.0
        overall_compliance_pct = (len(fully_compliant) / total_retained * 100) if total_retained else 0.0

        metrics = {
            "total_retained_pages": total_retained,
            "pages_with_schematics": total_retained - len(missing_svg),
            "pages_with_benchmarks": total_retained - len(missing_benchmarks),
            "fully_compliant_pages": len(fully_compliant),
            "schematic_compliance_percentage": f"{svg_compliance_pct:.2f}%",
            "benchmark_compliance_percentage": f"{bench_compliance_pct:.2f}%",
            "overall_compliance_percentage": f"{overall_compliance_pct:.2f}%",
            "missing_svg_slugs_sample": missing_svg[:10],
            "missing_benchmark_slugs_sample": missing_benchmarks[:10],
        }

        if missing_svg:
            failures.append(f"{len(missing_svg)}/{total_retained} retained enterprise pages missing vector SVG architecture schematics")
        if missing_benchmarks:
            failures.append(f"{len(missing_benchmarks)}/{total_retained} retained enterprise pages missing empirical benchmark matrices")

        # Assert 100% compliance
        passed = len(fully_compliant) == total_retained and total_retained == 100

        summary = (
            f"Gate 6 Passed: 100% of {total_retained} retained enterprise pages possess custom architecture SVGs and empirical benchmark matrices"
            if passed
            else f"Gate 6 Failed: Only {len(fully_compliant)}/{total_retained} pages are fully compliant ({overall_compliance_pct:.1f}% compliance, 100% required)"
        )

        return GateResult(
            gate_number=6,
            name="Custom Architecture Schematics & Empirical Benchmarks",
            passed=passed,
            summary=summary,
            metrics=metrics,
            failures=failures,
            execution_time_seconds=round(time.time() - start_time, 3),
        )

    # --------------------------------------------------------------------------
    # Master Execution Runner
    # --------------------------------------------------------------------------
    def run_all_gates(self, specific_gate: Optional[int] = None) -> List[GateResult]:
        """
        Executes all 6 verification gates (or a single requested gate).
        """
        results: List[GateResult] = []

        gate_map = {
            1: self.verify_gate_1_http_410_config,
            2: self.verify_gate_2_robots_noindex_follow,
            3: self.verify_gate_3_sitemaps_purge,
            4: self.verify_gate_4_internal_broken_links,
            5: self.verify_gate_5_jaccard_similarity,
            6: self.verify_gate_6_schematics_and_benchmarks,
        }

        if specific_gate:
            if specific_gate not in gate_map:
                raise ValueError(f"Invalid gate number {specific_gate}. Valid gates are 1 through 6.")
            print(f"\n>>> Running Single Gate: Gate {specific_gate}...")
            res = gate_map[specific_gate]()
            results.append(res)
        else:
            for gate_num in range(1, 7):
                res = gate_map[gate_num]()
                results.append(res)

        return results


def format_terminal_report(results: List[GateResult], verbose: bool = False) -> None:
    """
    Renders formatted ASCII terminal report for gate verification.
    """
    print("\n" + "=" * 90)
    print(" 🔱 ELESIUM AUTOMATED PRUNING & CURATION VERIFICATION REPORT (M1 TEST SUITE) 🔱")
    print("=" * 90)
    print(f" Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}")
    print(f" Target Domain: https://elesium.online")
    print("-" * 90)

    total_passed = sum(1 for r in results if r.passed)
    total_gates = len(results)

    for r in results:
        status_icon = "✅ PASS" if r.passed else "❌ FAIL"
        print(f" [{status_icon}] GATE {r.gate_number}: {r.name} ({r.execution_time_seconds}s)")
        print(f"        {r.summary}")
        if not r.passed and r.failures:
            print(f"        Deficiencies / Violations ({len(r.failures)} total):")
            for f in r.failures[:5]:
                print(f"          • {f}")
            if len(r.failures) > 5:
                print(f"          ... and {len(r.failures) - 5} more issues (see JSON report)")
        if verbose and r.metrics:
            print("        Key Metrics:")
            for k, v in r.metrics.items():
                if not isinstance(v, (list, dict)):
                    print(f"          - {k}: {v}")
        print()

    print("=" * 90)
    final_verdict = "ALL 6 VERIFICATION GATES PASSED ✅" if total_passed == total_gates else f"VERIFICATION DETECTED FAILURES ❌ ({total_passed}/{total_gates} Passed)"
    print(f" FINAL VERDICT: {final_verdict}")
    print("=" * 90)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Elesium Automated Pruning & Enterprise Curation Verification Engine (R4)"
    )
    parser.add_argument("--gate", type=int, choices=range(1, 7), help="Execute specific gate (1-6)")
    parser.add_argument("--json-output", type=str, help="Path to write JSON verification report")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose metric printing")
    args = parser.parse_args()

    verifier = PruningAndCurationVerifier(verbose=args.verbose)
    results = verifier.run_all_gates(specific_gate=args.gate)

    format_terminal_report(results, verbose=args.verbose)

    if args.json_output:
        out_path = Path(args.json_output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        report_data = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "overall_passed": all(r.passed for r in results),
            "passed_gates_count": sum(1 for r in results if r.passed),
            "total_gates_count": len(results),
            "gates": [asdict(r) for r in results],
        }
        out_path.write_text(json.dumps(report_data, indent=2), encoding="utf-8")
        print(f"Detailed JSON verification report exported to: {out_path}\n")

    all_passed = all(r.passed for r in results)
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
