#!/usr/bin/env python3
"""
=============================================================================
TED KUBAITIS CORA ON-PAGE TUNER CLI (MODULE 1) — TARGETED CALIBRATION
=============================================================================
Classification: Single-Page / Targeted Deficit Analyzer & On-Page Calibrator
Methodology: Ted Kubaitis (Cora Statistical Tuning & Deficit Elimination)

Usage:
  python3 automation/cora_onpage_tuner.py [--slug SLUG] [--dry-run]
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

from automation.cora_engine.config import CURATED_SOLUTIONS_PATH, SOLUTIONS_DIST_DIR
from automation.cora_engine.factor_extractor import extract_algorithmic_factors
from automation.cora_engine.serp_harvester import SERPHarvester
from automation.cora_engine.deficit_calculator import DeficitCalculator
from automation.cora_engine.onpage_calibrator import OnPageCalibrator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("cora_onpage_tuner")


def main():
    parser = argparse.ArgumentParser(description="Targeted Cora On-Page Deficit Tuner")
    parser.add_argument("--slug", required=True, help="Target solution slug")
    parser.add_argument("--query", help="Specific query to correlate against (optional)")
    parser.add_argument("--dry-run", action="store_true", help="Preview calibration without writing to disk")
    args = parser.parse_args()

    slug = args.slug
    target_path = SOLUTIONS_DIST_DIR / slug / "index.html"
    if not target_path.exists():
        print(f"[!] Target HTML file missing: {target_path}")
        sys.exit(1)

    with open(CURATED_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
        curated_solutions = json.load(f)

    solution_data = next((s for s in curated_solutions if s.get("slug") == slug), None)
    if not solution_data:
        print(f"[!] Solution data not found for slug: {slug}")
        sys.exit(1)

    keyword = solution_data.get("keyword", slug.replace("-", " "))
    query = args.query or f"{keyword} benchmark latency"

    print(f"\n=======================================================")
    print(f"CORA TARGETED ON-PAGE TUNER: {slug}")
    print(f"Target Query: {query}")
    print(f"=======================================================\n")

    content = target_path.read_text(encoding="utf-8")
    elesium_factors = extract_algorithmic_factors(content, keyword)

    harvester = SERPHarvester()
    competitors, atf_profile = harvester.harvest_serp(
        query=query,
        slug=slug,
        solution_data=solution_data,
        elesium_factors=elesium_factors,
    )

    calculator = DeficitCalculator()
    deficit_report = calculator.analyze_deficits(
        slug=slug,
        query=query,
        current_position=9.2,
        atf_profile=atf_profile,
        competitors=competitors,
        elesium_factors=elesium_factors,
    )

    print("Above-The-Fold SERP Layout & Interaction Depth:")
    print(f"  - Channel Triage:         {atf_profile.channel_triage.value}")
    print(f"  - Organic #1 Pixel Depth: {atf_profile.organic_1_pixel_depth}px")
    print(f"  - Interaction Depth:      {atf_profile.interaction_depth_scrolls} mobile scroll(s)")
    print(f"  - Triage Explanation:     {atf_profile.triage_reason}\n")

    print(f"Statistically Significant Factor Deficits vs Top 3 Benchmark:")
    for def_item in deficit_report.deficits:
        if def_item.is_deficit:
            print(f"  [DEFICIT] {def_item.factor_name:<28} Elesium: {def_item.elesium_current:7.1f} | Top 3: {def_item.top_3_benchmark:7.1f} | Deficit: +{def_item.deficit:6.1f}")
            print(f"            Tuning Action: {def_item.tuning_action}")

    calibrator = OnPageCalibrator()
    plan = calibrator.build_calibration_plan(
        slug=slug,
        page_url=f"https://elesium.online/solutions/{slug}",
        solution_data=solution_data,
        deficit_report=deficit_report,
    )

    print(f"\nCalibration Actions Synthesized:")
    print(f"  - Body Copy Words Added:    +{plan.words_added} words")
    print(f"  - LSI Headings Added:        +{plan.h2_added} H2")
    print(f"  - Statutory Links Added:     +{plan.statutory_links_added} links")

    if not args.dry_run:
        success, count, msg = calibrator.inject_calibration(plan)
        print(f"\n[+] Injected calibration: {msg}\n")
    else:
        print("\n[Dry Run - Skipped disk write]\n")


if __name__ == "__main__":
    main()
