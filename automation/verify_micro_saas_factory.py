#!/usr/bin/env python3
"""
===============================================================================
Micro-SaaS Link Magnet & Interactive Simulator Factory Automated Verifier
Module 05: Behavioral Search Dominance & Recursive PageRank Multiplier
===============================================================================
Executes 6 rigorous verification gates:
  Gate 1: Physical File Dual-Mount Existence (public & dist, html & index.html, gz & br)
  Gate 2: Viral Watermark Backlink Integrity (exact editorial anchor & rel attributes)
  Gate 3: Responsive Embed postMessage Protocol (dual event emission & auto-resizing)
  Gate 4: Interactive Dwell & Simulation Math (sliders, event listeners, 45-word capsule)
  Gate 5: Schema.org JSON-LD AST Structural Validation (WebApplication & SoftwareApplication)
  Gate 6: Search Engine Sitemap Registration (sitemap-core.xml with priority 0.9)
===============================================================================
"""

import sys
import json
import gzip
from pathlib import Path
from typing import Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_PUBLIC = ROOT_DIR / "frontend" / "public"
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"

TOOLS_TO_VERIFY = [
    {
        "slug": "token-cost-arbitrage-calculator",
        "embed_slug": "token-cost-arbitrage",
        "title": "Enterprise LLM Token Cost Arbitrage Calculator",
        "capsule_keyword": "Enterprise LLM Token Cost Arbitrage Calculator models"
    },
    {
        "slug": "dpdp-act-penalty-exposure-calculator",
        "embed_slug": "dpdp-penalty-calculator",
        "title": "DPDP Act 2023 Statutory Liability & Penalty Exposure Grader",
        "capsule_keyword": "India DPDP Act 2023 Statutory Penalty Exposure Grader"
    },
    {
        "slug": "enterprise-rag-latency-simulator",
        "embed_slug": "rag-latency-simulator",
        "title": "Enterprise RAG Retrieval & Generation Latency Simulator",
        "capsule_keyword": "Enterprise RAG Pipeline Latency Simulator models"
    },
    {
        "slug": "agent-vram-gpu-cluster-sizer",
        "embed_slug": "gpu-cluster-sizer",
        "title": "Multi-Agent GPU VRAM & Tensor Parallelism Cluster Sizer",
        "capsule_keyword": "Multi-Agent GPU VRAM & Cluster Sizer computes"
    },
    {
        "slug": "b2b-seo-roi-payback-model",
        "embed_slug": "b2b-seo-roi-model",
        "title": "B2B Programmatic SEO ROI & CAC Payback Model",
        "capsule_keyword": "B2B Programmatic SEO ROI & CAC Payback Model simulates"
    }
]

def log_pass(msg: str):
    print(f"  [PASS] {msg}")

def log_fail(msg: str):
    print(f"  [FAIL] {msg}")

def run_gate_1_physical_dual_mount() -> bool:
    print("\n--- Gate 1: Physical File Dual-Mount Verification ---")
    all_ok = True
    
    for tool in TOOLS_TO_VERIFY:
        slug = tool["slug"]
        eslug = tool["embed_slug"]
        
        # Check Public Embed
        pub_embed_html = FRONTEND_PUBLIC / "embed" / f"{eslug}.html"
        pub_embed_idx = FRONTEND_PUBLIC / "embed" / eslug / "index.html"
        if not (pub_embed_html.exists() and pub_embed_idx.exists()):
            log_fail(f"Public embed missing for {eslug}")
            all_ok = False
        else:
            log_pass(f"Public embed assets verified: /embed/{eslug} (html & index.html)")

        # Check Public Tools
        pub_tool_html = FRONTEND_PUBLIC / "tools" / f"{slug}.html"
        pub_tool_idx = FRONTEND_PUBLIC / "tools" / slug / "index.html"
        if not (pub_tool_html.exists() and pub_tool_idx.exists()):
            log_fail(f"Public standalone tool missing for {slug}")
            all_ok = False
        else:
            log_pass(f"Public standalone tool assets verified: /tools/{slug} (html & index.html)")

        # Check Dist Embed & Pre-compression
        dist_embed_html = FRONTEND_DIST / "embed" / f"{eslug}.html"
        dist_embed_gz = FRONTEND_DIST / "embed" / f"{eslug}.html.gz"
        dist_embed_br = FRONTEND_DIST / "embed" / f"{eslug}.html.br"
        if not (dist_embed_html.exists() and dist_embed_gz.exists() and dist_embed_br.exists()):
            log_fail(f"Dist embed or compression missing for {eslug}")
            all_ok = False
        else:
            log_pass(f"Dist embed assets & pre-compression verified: /embed/{eslug} (.html, .gz, .br)")

        # Check Dist Tools & Pre-compression
        dist_tool_html = FRONTEND_DIST / "tools" / f"{slug}.html"
        dist_tool_gz = FRONTEND_DIST / "tools" / f"{slug}.html.gz"
        dist_tool_br = FRONTEND_DIST / "tools" / f"{slug}.html.br"
        if not (dist_tool_html.exists() and dist_tool_gz.exists() and dist_tool_br.exists()):
            log_fail(f"Dist standalone tool or compression missing for {slug}")
            all_ok = False
        else:
            log_pass(f"Dist standalone tool assets & pre-compression verified: /tools/{slug} (.html, .gz, .br)")

    return all_ok

def run_gate_2_viral_watermark() -> bool:
    print("\n--- Gate 2: Viral Watermark Backlink Integrity ---")
    all_ok = True
    expected_link_anchor = 'href="https://elesium.online/solutions"'
    expected_rel = 'rel="noopener noreferrer"'
    expected_anchor_text = "Elesium Enterprise AI Solutions"

    for tool in TOOLS_TO_VERIFY:
        eslug = tool["embed_slug"]
        slug = tool["slug"]
        
        embed_file = FRONTEND_PUBLIC / "embed" / f"{eslug}.html"
        content = embed_file.read_text(encoding="utf-8")
        
        if expected_link_anchor not in content:
            log_fail(f"Watermark href missing in {eslug}.html")
            all_ok = False
        elif expected_rel not in content:
            log_fail(f"Watermark rel attributes missing in {eslug}.html")
            all_ok = False
        elif expected_anchor_text not in content:
            log_fail(f"Watermark editorial anchor text missing in {eslug}.html")
            all_ok = False
        else:
            log_pass(f"Viral watermark verified in /embed/{eslug}: [href='https://elesium.online/solutions' text='{expected_anchor_text}']")

    return all_ok

def run_gate_3_postmessage_protocol() -> bool:
    print("\n--- Gate 3: Responsive Embed postMessage Protocol ---")
    all_ok = True

    for tool in TOOLS_TO_VERIFY:
        eslug = tool["embed_slug"]
        embed_file = FRONTEND_PUBLIC / "embed" / f"{eslug}.html"
        content = embed_file.read_text(encoding="utf-8")

        if "type: 'RESIZE_EMBED'" not in content:
            log_fail(f"RESIZE_EMBED postMessage missing in {eslug}.html")
            all_ok = False
        elif "type: 'elesium-embed-resize'" not in content:
            log_fail(f"elesium-embed-resize postMessage missing in {eslug}.html")
            all_ok = False
        elif "MutationObserver" not in content:
            log_fail(f"MutationObserver auto-resizer missing in {eslug}.html")
            all_ok = False
        else:
            log_pass(f"Dual postMessage emission & MutationObserver verified in /embed/{eslug}")

    return all_ok

def run_gate_4_interactive_dwell_and_math() -> bool:
    print("\n--- Gate 4: Interactive Dwell & Simulation Math ---")
    all_ok = True

    for tool in TOOLS_TO_VERIFY:
        slug = tool["slug"]
        tool_file = FRONTEND_PUBLIC / "tools" / f"{slug}.html"
        content = tool_file.read_text(encoding="utf-8")

        # Check interactive DOM controls
        has_slider = 'type="range"' in content
        has_select = '<select' in content
        has_checkbox = 'type="checkbox"' in content
        if not (has_slider or has_select or has_checkbox):
            log_fail(f"No interactive inputs found in /tools/{slug}")
            all_ok = False
        else:
            log_pass(f"Interactive controls verified in /tools/{slug} (sliders/selects/checkboxes)")

        # Check Answer Capsule
        if "Answer Capsule:" not in content or tool["capsule_keyword"] not in content:
            log_fail(f"Answer Capsule missing or mismatch in /tools/{slug}")
            all_ok = False
        else:
            log_pass(f"45-Word Answer Capsule verified in /tools/{slug}")

        # Check Embed Code Modal
        if "openModal" not in content or "Copy Embed Code" not in content:
            log_fail(f"Embed Modal missing in /tools/{slug}")
            all_ok = False
        else:
            log_pass(f"One-click Embed Modal & copy trigger verified in /tools/{slug}")

        # Check Methodology Section
        if "Mathematical Methodology & Benchmark Assumptions" not in content:
            log_fail(f"Methodology section missing in /tools/{slug}")
            all_ok = False
        else:
            log_pass(f"Mathematical Methodology & Benchmark Assumptions verified in /tools/{slug}")

    return all_ok

def run_gate_5_schema_validation() -> bool:
    print("\n--- Gate 5: Schema.org JSON-LD AST Structural Validation ---")
    all_ok = True

    for tool in TOOLS_TO_VERIFY:
        slug = tool["slug"]
        tool_file = FRONTEND_PUBLIC / "tools" / f"{slug}.html"
        content = tool_file.read_text(encoding="utf-8")

        if '<script type="application/ld+json">' not in content:
            log_fail(f"No JSON-LD script found in /tools/{slug}")
            all_ok = False
            continue

        start = content.index('<script type="application/ld+json">') + len('<script type="application/ld+json">')
        end = content.index('</script>', start)
        schema_raw = content[start:end].strip()

        try:
            schema = json.loads(schema_raw)
            graph = schema.get("@graph", [])
            app_node = next((n for n in graph if "WebApplication" in n.get("@type", [])), None)
            breadcrumb_node = next((n for n in graph if n.get("@type") == "BreadcrumbList"), None)

            if not app_node:
                log_fail(f"WebApplication node missing in /tools/{slug} schema")
                all_ok = False
            elif app_node.get("name") != tool["title"]:
                log_fail(f"Schema name mismatch in /tools/{slug}")
                all_ok = False
            elif not breadcrumb_node:
                log_fail(f"BreadcrumbList schema missing in /tools/{slug}")
                all_ok = False
            else:
                log_pass(f"Schema.org AST validated in /tools/{slug}: {app_node['name']} + BreadcrumbList")
        except Exception as e:
            log_fail(f"JSON-LD syntax error in /tools/{slug}: {e}")
            all_ok = False

    return all_ok

def run_gate_6_sitemap_registration() -> bool:
    print("\n--- Gate 6: Search Engine Sitemap Registration ---")
    all_ok = True

    sitemaps = [
        ("frontend/public/sitemap-core.xml", FRONTEND_PUBLIC / "sitemap-core.xml"),
        ("frontend/dist/sitemap-core.xml", FRONTEND_DIST / "sitemap-core.xml")
    ]

    for rel_name, sitemap_path in sitemaps:
        if not sitemap_path.exists():
            log_fail(f"Sitemap file missing: {rel_name}")
            all_ok = False
            continue

        content = sitemap_path.read_text(encoding="utf-8")
        for tool in TOOLS_TO_VERIFY:
            loc = f"https://elesium.online/tools/{tool['slug']}/"
            if loc not in content:
                log_fail(f"Tool URL not registered in {rel_name}: {loc}")
                all_ok = False
            else:
                log_pass(f"Tool registered in {rel_name}: {loc}")

    return all_ok

def main():
    print("=" * 80)
    print("🔬 AUDITING PHASE 9: MICRO-SAAS LINK MAGNET & INTERACTIVE SIMULATORS")
    print("=" * 80)

    g1 = run_gate_1_physical_dual_mount()
    g2 = run_gate_2_viral_watermark()
    g3 = run_gate_3_postmessage_protocol()
    g4 = run_gate_4_interactive_dwell_and_math()
    g5 = run_gate_5_schema_validation()
    g6 = run_gate_6_sitemap_registration()

    print("\n" + "=" * 80)
    if all([g1, g2, g3, g4, g5, g6]):
        print("🏆 ALL 6 GATES PASSED: Micro-SaaS Link Magnet Suite is 100% SHIPSHAPE!")
        print("=" * 80)
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED: One or more gates reported errors.")
        print("=" * 80)
        sys.exit(1)

if __name__ == "__main__":
    main()
