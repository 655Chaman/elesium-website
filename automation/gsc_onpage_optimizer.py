#!/usr/bin/env python3
"""
=============================================================================
GSC ON-PAGE OPTIMIZER CLI (MODULE 4) - TARGETED CONTENT & SCHEMA EXPANSION
=============================================================================
Classification: On-Page Striking Distance Optimizer & Edward Sturm Capsule Injector
Methodology: Edward Sturm Moz Sweet Spot (42-48 Words) & Brian Kato RE2 Grounding

Usage:
  python3 automation/gsc_onpage_optimizer.py [--slug SLUG] [--all] [--dry-run]
=============================================================================
"""

import sys
import json
import argparse
import logging
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
WEBSITE_ROOT = BASE_DIR.parent
if str(WEBSITE_ROOT) not in sys.path:
    sys.path.insert(0, str(WEBSITE_ROOT))

from automation.gsc_engine.config import (
    CURATED_SOLUTIONS_PATH,
    SOLUTIONS_DIST_DIR,
    SITE_URL,
)
from automation.gsc_engine.models import (
    StrikingDistanceOpportunity,
    IntentCategory,
)
from automation.gsc_engine.content_synthesizer import ContentSynthesizer
from automation.gsc_engine.html_injector import HTMLInjector
from automation.gsc_engine.connector import GSCConnector
from automation.gsc_engine.striking_distance import StrikingDistanceAnalyzer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("gsc_onpage_optimizer")


def main():
    parser = argparse.ArgumentParser(description="Targeted GSC On-Page Optimizer")
    parser.add_argument("--slug", help="Specific solution slug to optimize")
    parser.add_argument("--all", action="store_true", help="Optimize all 100 retained enterprise solutions")
    parser.add_argument("--dry-run", action="store_true", help="Preview synthesized content without disk writes")
    args = parser.parse_args()

    if not args.slug and not args.all:
        parser.print_help()
        sys.exit(1)

    with open(CURATED_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
        curated_solutions = json.load(f)

    synthesizer = ContentSynthesizer(curated_solutions)
    injector = HTMLInjector()

    connector = GSCConnector()
    records = connector.fetch_search_analytics()
    analyzer = StrikingDistanceAnalyzer()
    opportunities = analyzer.filter_striking_distance_queries(records)
    clusters = analyzer.cluster_by_landing_page(opportunities)

    slugs_to_process = [args.slug] if args.slug else list(clusters.keys())

    print(f"\n=======================================================")
    print(f"GSC ON-PAGE OPTIMIZER: Processing {len(slugs_to_process)} target page(s)")
    print(f"=======================================================\n")

    for slug in slugs_to_process:
        if slug not in clusters:
            print(f"[!] Warning: No striking distance queries found for slug: {slug}")
            continue

        cluster = clusters[slug]
        primary_opp = cluster["primary_opportunity"]
        secondary_opps = cluster["secondary_opportunities"]

        payload = synthesizer.synthesize_optimization_payload(
            slug=slug,
            page_url=cluster["page_url"],
            primary_opp=primary_opp,
            secondary_opps=secondary_opps,
        )

        print(f"--> Slug: {slug}")
        print(f"    Primary Query: \"{primary_opp.query}\" (Pos: {primary_opp.position}, Imp: {primary_opp.impressions})")
        print(f"    Answer Capsule ({payload.answer_capsule_word_count} words):")
        print(f"    \"{payload.answer_capsule_html}\"")
        print(f"    FAQ Schema: {len(payload.json_ld_schema.get('mainEntity', []))} Question(s)")

        if not args.dry_run:
            success, count, msg = injector.inject_payload(payload)
            print(f"    Result: {msg}\n")
        else:
            print("    [Dry Run - skipped disk write]\n")


if __name__ == "__main__":
    main()
