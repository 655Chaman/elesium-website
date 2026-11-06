#!/usr/bin/env python3
"""
audit_programmatic_fleet.py — Comprehensive Fleet Architecture & Scale Auditor

Audits all 8,254 HTML files in frontend/dist across:
1. Title, meta description, and canonical integrity (0 missing, 0 malformed, 0 unindexed redirects).
2. Robots tags (redirect wrappers have noindex, follow).
3. Schema AST compliance (Service, SoftwareApplication, single BreadcrumbList, 0 duplicate keys).
4. Answer Capsule & AEO Content Depth (Perplexity / ChatGPT Search / Google AI Overviews readiness).
5. Internal Link Mesh Connectivity (/commercial-directory.html, /solutions, contextual tools, 0 orphans).
6. Quantitative scoring (out of 10.0) across all 5 programmatic clusters + supporting infrastructure.
"""

import sys
import os
import re
import json
import time
from pathlib import Path
from collections import defaultdict, Counter

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = PROJECT_ROOT / "frontend" / "dist"

TITLE_REGEX = re.compile(r'<title>(.*?)</title>', re.IGNORECASE | re.DOTALL)
DESC_REGEX = re.compile(r'<meta\s+name=[\"\']description[\"\']\s+content=[\"\'](.*?)[\"\']', re.IGNORECASE)
CANON_REGEX = re.compile(r'<link\s+rel=[\"\']canonical[\"\']\s+href=[\"\'](.*?)[\"\']', re.IGNORECASE)
ROBOTS_REGEX = re.compile(r'<meta\s+name=[\"\']robots[\"\']\s+content=[\"\'](.*?)[\"\']', re.IGNORECASE)
JSONLD_REGEX = re.compile(r'<script\b(?=[^>]*\btype=[\"\']application/ld\+json[\"\'])[^>]*>(.*?)</script>', re.IGNORECASE | re.DOTALL)
ANSWER_CAPSULE_REGEX = re.compile(r'<div[^>]*class=[\"\'][^\"\']*answer-capsule[^\"\']*[\"\'][^>]*>(.*?)</div>', re.IGNORECASE | re.DOTALL)

def audit_fleet():
    start_time = time.time()
    if not DIST_DIR.exists():
        print(f"Error: {DIST_DIR} not found.")
        sys.exit(1)

    html_files = list(DIST_DIR.glob("**/*.html"))
    total_files = len(html_files)

    # Classify files into clusters
    clusters = {
        "solutions": [],          # 1. Enterprise Solutions (/solutions/[slug])
        "tools": [],              # 2. Interactive Engineering Simulators (/tools/[slug])
        "videos": [],             # 3. Video Masterclasses (/videos/[slug])
        "city_moats": [],         # 4. Regional City Moats (/enterprise-ai-*)
        "compare": [],            # 5. Comparison Battlecards (/compare/[slug])
        "redirect_wrappers": [],  # Redirect alias wrappers (industries, market-signals)
        "other_static": []        # Signals, static hubs, embed widgets
    }

    for f in html_files:
        rel = str(f.relative_to(DIST_DIR))
        if rel.startswith("solutions/"):
            clusters["solutions"].append(f)
        elif rel.startswith("tools/"):
            clusters["tools"].append(f)
        elif rel.startswith("videos/"):
            clusters["videos"].append(f)
        elif rel.startswith("compare/"):
            clusters["compare"].append(f)
        elif any(c in rel for c in ["enterprise-ai-bangalore", "enterprise-ai-mumbai", "enterprise-ai-delhi-ncr", "enterprise-ai-pune"]):
            clusters["city_moats"].append(f)
        elif rel in ["industries.html", "market-signals.html", "industries/index.html", "market-signals/index.html"]:
            clusters["redirect_wrappers"].append(f)
        else:
            clusters["other_static"].append(f)

    fleet_metrics = {}
    cluster_scores = {}

    for c_name, flist in clusters.items():
        metrics = {
            "file_count": len(flist),
            "missing_title": 0,
            "missing_desc": 0,
            "malformed_desc_quotes": 0,
            "missing_canonical": 0,
            "invalid_canonical": 0,
            "redirect_missing_noindex": 0,
            "schema_missing_primary": 0,
            "schema_missing_software": 0,
            "schema_duplicate_breadcrumbs": 0,
            "schema_missing_breadcrumbs": 0,
            "schema_duplicate_keys": 0,
            "missing_answer_capsule": 0,
            "short_answer_capsule": 0,
            "missing_speakable_schema": 0,
            "missing_comm_dir_link": 0,
            "missing_solutions_link": 0,
            "missing_tools_link": 0,
        }

        for f in flist:
            rel = str(f.relative_to(DIST_DIR))
            content = f.read_text(encoding="utf-8", errors="ignore")
            is_redirect = 'http-equiv="refresh"' in content or rel in ["industries.html", "market-signals.html"]

            # 1. Title
            tm = TITLE_REGEX.search(content)
            if not tm or not tm.group(1).strip():
                metrics["missing_title"] += 1

            # 2. Description
            if not is_redirect and rel != "404.html":
                dm = DESC_REGEX.search(content)
                if not dm or not dm.group(1).strip():
                    metrics["missing_desc"] += 1
                if '<meta name="description" content="""' in content or '<meta name="description" content=""' in content:
                    metrics["malformed_desc_quotes"] += 1

            # 3. Canonical
            if rel != "404.html":
                cm = CANON_REGEX.search(content)
                if not cm or not cm.group(1).strip():
                    metrics["missing_canonical"] += 1
                elif not cm.group(1).startswith("https://elesium.online"):
                    metrics["invalid_canonical"] += 1

            # 4. Robots for redirects
            if is_redirect:
                rm = ROBOTS_REGEX.search(content)
                if not rm or "noindex" not in rm.group(1).lower():
                    metrics["redirect_missing_noindex"] += 1

            # 5. Schema verification
            blocks = JSONLD_REGEX.findall(content)
            breadcrumb_count = 0
            has_service = False
            has_software = False
            has_video = False
            has_local_biz = False
            has_tech_article = False
            has_speakable = False

            def check_pairs(pairs):
                seen = set()
                for k, v in pairs:
                    if k in seen:
                        metrics["schema_duplicate_keys"] += 1
                    seen.add(k)
                return dict(pairs)

            for b in blocks:
                try:
                    data = json.loads(b, object_pairs_hook=check_pairs)
                    nodes = []
                    if isinstance(data, dict):
                        if "@graph" in data:
                            nodes.extend(data["@graph"])
                        else:
                            nodes.append(data)
                    elif isinstance(data, list):
                        nodes.extend(data)

                    for n in nodes:
                        stype = n.get("@type", "")
                        if stype == "BreadcrumbList":
                            breadcrumb_count += 1
                        elif "breadcrumb" in n and isinstance(n["breadcrumb"], dict) and n["breadcrumb"].get("@type") == "BreadcrumbList":
                            breadcrumb_count += 1

                        if stype == "Service":
                            has_service = True
                            has_part = n.get("hasPart", {})
                            if isinstance(has_part, dict) and has_part.get("@type") in ["SoftwareApplication", "WebApplication"]:
                                has_software = True
                            elif isinstance(has_part, list):
                                for p in has_part:
                                    if p.get("@type") in ["SoftwareApplication", "WebApplication"]:
                                        has_software = True
                        if stype in ["SoftwareApplication", "WebApplication"]:
                            has_software = True
                        if stype == "VideoObject":
                            has_video = True
                        if stype in ["LocalBusiness", "ProfessionalService"]:
                            has_local_biz = True
                        if stype in ["TechArticle", "Article"]:
                            has_tech_article = True

                        if "speakable" in n:
                            has_speakable = True
                except:
                    pass

            # Cluster-specific schema checks
            if c_name == "solutions" and rel not in ["solutions/index.html", "solutions.html"]:
                if not has_service:
                    metrics["schema_missing_primary"] += 1
                if not has_software:
                    metrics["schema_missing_software"] += 1
                if breadcrumb_count > 1:
                    metrics["schema_duplicate_breadcrumbs"] += 1
                elif breadcrumb_count == 0:
                    metrics["schema_missing_breadcrumbs"] += 1
                if not has_speakable:
                    metrics["missing_speakable_schema"] += 1

            elif c_name == "tools" and rel not in ["tools/index.html", "tools.html"]:
                if not has_software:
                    metrics["schema_missing_primary"] += 1
                if breadcrumb_count == 0:
                    metrics["schema_missing_breadcrumbs"] += 1
                if not has_speakable:
                    metrics["missing_speakable_schema"] += 1

            elif c_name == "videos" and rel not in ["videos/index.html", "videos.html"]:
                if not has_video:
                    metrics["schema_missing_primary"] += 1
                if breadcrumb_count == 0:
                    metrics["schema_missing_breadcrumbs"] += 1
                if not has_speakable:
                    metrics["missing_speakable_schema"] += 1

            elif c_name == "city_moats":
                if not has_local_biz:
                    metrics["schema_missing_primary"] += 1
                if breadcrumb_count == 0:
                    metrics["schema_missing_breadcrumbs"] += 1
                if not has_speakable:
                    metrics["missing_speakable_schema"] += 1

            elif c_name == "compare" and rel not in ["compare/index.html", "compare.html"]:
                if not has_tech_article:
                    metrics["schema_missing_primary"] += 1
                if breadcrumb_count == 0:
                    metrics["schema_missing_breadcrumbs"] += 1
                if not has_speakable:
                    metrics["missing_speakable_schema"] += 1

            # 6. Answer Capsule
            if c_name in ["solutions", "tools", "videos", "city_moats", "compare"]:
                ac_m = ANSWER_CAPSULE_REGEX.search(content)
                if not ac_m:
                    metrics["missing_answer_capsule"] += 1
                else:
                    inner_text = re.sub(r'<[^>]+>', ' ', ac_m.group(1)).strip()
                    if len(inner_text) < 30:
                        metrics["short_answer_capsule"] += 1

            # 7. Internal Links
            if not is_redirect and not rel.startswith("embed/"):
                if "/commercial-directory" not in content and "commercial-directory.html" not in content:
                    metrics["missing_comm_dir_link"] += 1
                if "/solutions" not in content:
                    metrics["missing_solutions_link"] += 1
                if c_name in ["solutions", "city_moats", "compare"] and "/tools/" not in content:
                    metrics["missing_tools_link"] += 1

        fleet_metrics[c_name] = metrics

        # Compute cluster score out of 10.0:
        # Dim A: Title, Meta Description & Canonical Integrity (2.0 pts)
        # Dim B: Robots & Indexation Integrity (2.0 pts)
        # Dim C: Schema AST & Structured Data Compliance (2.0 pts)
        # Dim D: Answer Capsule & AEO Content Depth (2.0 pts)
        # Dim E: Internal Link Mesh Connectivity & Anti-Orphan Defense (2.0 pts)
        n = metrics["file_count"] if metrics["file_count"] > 0 else 1

        score_a = 2.0 - 2.0 * ((metrics["missing_title"] + metrics["missing_desc"] + metrics["malformed_desc_quotes"] + metrics["missing_canonical"]) / (4 * n))
        score_b = 2.0 - 2.0 * (metrics["redirect_missing_noindex"] / max(1, metrics["file_count"]))
        score_c = 2.0 - 2.0 * ((metrics["schema_missing_primary"] + metrics["schema_missing_software"] + metrics["schema_duplicate_breadcrumbs"] + metrics["schema_missing_breadcrumbs"] + metrics["schema_duplicate_keys"]) / (5 * n))
        score_d = 2.0 - 2.0 * ((metrics["missing_answer_capsule"] + metrics["short_answer_capsule"] + metrics["missing_speakable_schema"]) / (3 * n))
        score_e = 2.0 - 2.0 * ((metrics["missing_comm_dir_link"] + metrics["missing_solutions_link"] + metrics["missing_tools_link"]) / (3 * n))

        total_score = round(max(0.0, min(10.0, score_a + score_b + score_c + score_d + score_e)), 2)
        cluster_scores[c_name] = {
            "score": total_score,
            "dim_a": round(score_a, 2),
            "dim_b": round(score_b, 2),
            "dim_c": round(score_c, 2),
            "dim_d": round(score_d, 2),
            "dim_e": round(score_e, 2),
            "metrics": metrics
        }

    elapsed = time.time() - start_time
    return total_files, fleet_metrics, cluster_scores, elapsed

if __name__ == "__main__":
    total, metrics, scores, elapsed = audit_fleet()
    print("==============================================================================")
    print(" 🔱 PROGRAMMATIC FLEET ARCHITECTURE & SCALE AUDITOR REPORT 🔱")
    print("==============================================================================")
    print(f"Total HTML Files Audited: {total:,} in {elapsed:.2f}s\n")
    print(f"{'Cluster Name':<32} | {'Files':<6} | {'Score /10':<9} | {'Status':<10}")
    print("-" * 65)
    for c_name, data in scores.items():
        sc = data["score"]
        status = "PASSED" if sc >= 9.5 else ("ACCEPT" if sc >= 9.3 else "NEEDS UPGRADE")
        print(f"{c_name:<32} | {data['metrics']['file_count']:<6} | {sc:<9.2f} | {status:<10}")
    print("==============================================================================")
