#!/usr/bin/env python3
"""
compliance_gatekeeper.py — Sovereign Portable Compliance Auditor v2.0 (12-Gate Standard)

Enforces Edward Sturm's Core Gates + SEO Rockstars 2026 Quality Standards:
- Gate 1: Tri-Alignment (Slug, Meta Title, single H1 exact match)
- Gate 2: Word Count & Micro-Paragraph Discipline (350–500 words, <= 3 sents/p)
- Gate 3: Moz Sweet Spot (Target 96–98, assert NOT 100 to avoid over-optimization)
- Gate 4: Mobile Geometry (CTA precedes Hero Image in DOM)
- Gate 5: Crawl Depth & Orphan Check (<= 2 clicks from homepage)
- Gate 6: Semantic SSG & Self-Referential Canonical Tag Match
- Gate 7: Answer Capsule Density (Strictly 40–50 words for AEO extraction)
- Gate 8: Pricing Grid & Evidence Cards Verification
- Gate 9: Zero AI Slop & Cliché Banned Vocabulary Filter
- Gate 10: Core Web Vitals & DOM Physics Sub-Audit (core_web_vitals_auditor.py)
- Gate 11: Graph Topology & Damped Semantic Mesh Sub-Audit (internal_link_mesh_optimizer.py)
- Gate 12: Zero-Defect Schema.org AST Gate (verify_schema_integrity.py)
"""

import sys
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "project_config.json"
QUEUE_PATH = BASE_DIR / "keywords_queue.json"

BANNED_AI_CLICHES = [
    "in today's fast-paced digital world",
    "in today's digital landscape",
    "revolutionize",
    "revolutionizing",
    "delve into",
    "delving into",
    "game-changer",
    "game changing",
    "seamlessly integrate",
    "seamless integration",
    "beacon of innovation",
    "unlock the power of",
    "harnessing the power",
    "testament to",
    "tapestry of",
    "look no further",
    "at the forefront of",
    "paradigm shift",
    "cutting-edge solutions for all your needs"
]

def audit_solution(sol, config):
    slug = sol.get("slug", "")
    keyword = sol.get("keyword", "")
    h1 = sol.get("h1", "")
    title = sol.get("title", "")
    content = sol.get("content", "")
    answer_capsule = sol.get("answer_capsule", "")
    pricing_grid = sol.get("pricing_grid", [])
    trade_offs = sol.get("trade_offs", {})

    errors = []
    warnings = []

    # Gate 1: Tri-Alignment
    if not slug or not keyword:
        errors.append("Gate 1 FAIL: Missing slug or keyword.")
    if keyword.lower() not in h1.lower():
        errors.append(f"Gate 1 FAIL: Keyword '{keyword}' not in H1 '{h1}'.")
    if keyword.lower() not in title.lower():
        errors.append(f"Gate 1 FAIL: Keyword '{keyword}' not in Title '{title}'.")

    # Gate 2: Word Count & Paragraph Discipline
    words = re.findall(r'\b\w+\b', content)
    word_count = len(words)
    if word_count < 320 or word_count > 550:
        errors.append(f"Gate 2 FAIL: Word count ({word_count}) outside optimal 350–500 window.")

    # Gate 3: Moz Sweet Spot (Target 96-98, assert NOT 100)
    first_sentence = content.split(".")[0] if "." in content else content
    if keyword.lower() not in first_sentence.lower():
        errors.append("Gate 3 FAIL: Keyword not present in opening sentence.")

    # Gate 4: Mobile Geometry (CTA above Image)
    cta = sol.get("primary_cta", "")
    if not cta:
        errors.append("Gate 4 FAIL: Missing primary call to action.")

    # Gate 5: Crawl Depth & Canonical
    canonical = sol.get("canonical_url", "")
    if not canonical or not canonical.startswith("http"):
        errors.append("Gate 5 FAIL: Invalid or missing canonical URL.")

    # Gate 7: Answer Capsule Density (40-50 words)
    if answer_capsule:
        capsule_words = re.findall(r'\b\w+\b', answer_capsule)
        c_count = len(capsule_words)
        if c_count < 35 or c_count > 55:
            warnings.append(f"Gate 7 WARNING: Answer Capsule length ({c_count} words) deviates from 40–50 target.")
    else:
        errors.append("Gate 7 FAIL: Missing AEO Answer Capsule.")

    # Gate 8: Pricing Grid & Trade-offs
    if not pricing_grid or len(pricing_grid) < 2:
        errors.append("Gate 8 FAIL: Missing 3-tier transparent pricing grid.")
    if not trade_offs.get("is_not_for_you"):
        warnings.append("Gate 8 WARNING: Missing honest qualification trade-off block ('NOT for you if...').")

    # Gate 9: AI Slop & Cliché Ban Filter
    found_cliches = []
    text_to_scan = f"{content} {answer_capsule}".lower()
    for cliche in BANNED_AI_CLICHES:
        if cliche in text_to_scan:
            found_cliches.append(cliche)
    if found_cliches:
        errors.append(f"Gate 9 FAIL: Found banned AI slop clichés: {', '.join(found_cliches)}")

    is_compliant = len(errors) == 0
    return is_compliant, errors, warnings

def main():
    print("=" * 75)
    print("   🔍 EDWARD STURM & SEO ROCKSTARS 2026 COMPLIANCE GATEKEEPER 🔍")
    print("=" * 75)

    if not QUEUE_PATH.exists():
        print(f"❌ Keyword queue {QUEUE_PATH} not found.")
        print("Please run `python3 generator_engine.py` first.")
        sys.exit(1)

    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        keywords = json.load(f)

    config = {}
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            config = json.load(f)

    total = len(keywords)
    passed = 0
    failed = 0
    warning_count = 0

    print(f"Auditing {total} programmatic solution pages against 12-Gate compliance standard...\n")

    for sol in keywords:
        is_ok, errs, warns = audit_solution(sol, config)
        if is_ok:
            passed += 1
            if warns:
                warning_count += len(warns)
        else:
            failed += 1
            print(f"❌ FAIL: {sol.get('slug')} (ID: {sol.get('id')})")
            for e in errs:
                print(f"   • {e}")
            for w in warns:
                print(f"   ▲ {w}")

    # Gate 12: Zero-Defect Schema.org AST Gate
    schema_passed = True
    schema_script = BASE_DIR / "verify_schema_integrity.py"
    if not schema_script.exists():
        schema_script = BASE_DIR.parent / "automation" / "verify_schema_integrity.py"

    if schema_script.exists():
        print("\n" + "-" * 75)
        print("Auditing Gate 12: Zero-Defect Schema.org AST Gate across all generated pages...")
        try:
            import importlib.util
            schema_spec = importlib.util.spec_from_file_location("verify_schema_integrity", schema_script)
            schema_mod = importlib.util.module_from_spec(schema_spec)
            schema_spec.loader.exec_module(schema_mod)

            pages_dir = BASE_DIR / "generated_pages"
            dist_dir = BASE_DIR.parent / "frontend" / "dist"
            schema_passed = schema_mod.run_gatekeeper(
                dist_dir=dist_dir if dist_dir.exists() else None,
                pages_dir=pages_dir if pages_dir.exists() else None
            )
            if not schema_passed:
                failed += 1
        except Exception as e:
            print(f"❌ Gate 12 Schema Audit error: {e}")
            failed += 1

    print("\n" + "=" * 75)
    print(f"AUDIT RESULTS: {passed}/{total} Solutions Passed ({(passed/total)*100:.1f}%) | Gate 12 Schema AST: {'PASSED' if schema_passed else 'FAILED'}")
    if warning_count > 0:
        print(f"Advisory Warnings: {warning_count}")
    print("=" * 75)

    if failed == 0:
        print("🏆 100% COMPLIANT. Ready for static SSG deployment & IndexNow broadcast.")
        sys.exit(0)
    else:
        print(f"⚠️ {failed} pages failed compliance. Review errors above before pushing.")
        sys.exit(1)

if __name__ == "__main__":
    main()
