#!/usr/bin/env python3
"""
=============================================================================
GSC STRIKING DISTANCE ENGINE CLI (MODULE 4) — MASTER EXECUTOR
=============================================================================
Classification: Brian Kato GSC Striking Distance Discovery & Optimization
Methodology: Brian Kato (SEO Rockstars 2026 Day 2) & Dan Kurtz Compounding Loop

Usage:
  python3 automation/gsc_striking_distance_engine.py [--dry-run] [--mock]
=============================================================================
"""

import sys
import argparse
import logging
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
WEBSITE_ROOT = BASE_DIR.parent
if str(WEBSITE_ROOT) not in sys.path:
    sys.path.insert(0, str(WEBSITE_ROOT))

from automation.gsc_engine.pipeline import StrikingDistancePipeline
from automation.gsc_engine.config import TELEMETRY_OUTPUT_PATH, REPORT_OUTPUT_PATH

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("gsc_striking_distance_engine")


def main():
    parser = argparse.ArgumentParser(
        description="Brian Kato GSC Striking Distance Discovery & On-Page Optimization Engine"
    )
    parser.add_argument("--dry-run", action="store_true", help="Analyze and score without writing to HTML files")
    parser.add_argument("--mock", action="store_true", help="Force high-fidelity mock simulation mode")
    args = parser.parse_args()

    if args.mock:
        import os
        os.environ["GSC_MOCK_MODE"] = "1"

    print("\n=======================================================")
    print("BRIAN KATO GSC STRIKING DISTANCE ENGINE (2026 ROCKSTARS)")
    print("=======================================================\n")

    pipeline = StrikingDistancePipeline(dry_run=args.dry_run)
    summary = pipeline.run()

    print(f"\n=======================================================")
    print(f"STRIKING DISTANCE EXECUTION SUMMARY")
    print(f"=======================================================")
    print(f"  - Total GSC Queries Ingested:        {summary.total_gsc_queries_ingested:,}")
    print(f"  - Striking Distance Queries (8-20): {summary.total_striking_distance_queries:,}")
    print(f"  - Total Impression Pool:             {summary.total_impressions_pool:,}")
    print(f"  - Total Unrealized Clicks:           {summary.total_unrealized_clicks:,}")
    print(f"  - Projected Traffic Uplift (Top 3):  +{summary.projected_monthly_traffic_uplift:,} clicks/mo")
    print(f"  - Target Pages Optimized:           {summary.total_pages_optimized}")
    print(f"  - Telemetry Output:                  {TELEMETRY_OUTPUT_PATH}")
    print(f"  - Executive Report:                  {REPORT_OUTPUT_PATH}")
    print(f"=======================================================\n")


if __name__ == "__main__":
    main()
