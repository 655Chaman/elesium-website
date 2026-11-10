#!/usr/bin/env python3
"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATOR CLI (MODULE 1) — MASTER RUNNER
=============================================================================
Classification: Statistical Factor Correlation & Visibility-First Interaction Depth
Methodology: Ted Kubaitis (SEO Rockstars 2026 Day 1 - Cora 20,000+ Ranking Factors)

Usage:
  python3 automation/cora_serp_correlator.py [--dry-run] [--mock]
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

from automation.cora_engine.pipeline import CoraCorrelationPipeline
from automation.cora_engine.config import CORA_TELEMETRY_PATH, CORA_REPORT_PATH

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("cora_serp_correlator")


def main():
    parser = argparse.ArgumentParser(
        description="Ted Kubaitis Cora SERP Factor Correlation & Visibility-First Engine"
    )
    parser.add_argument("--dry-run", action="store_true", help="Analyze and correlate without writing HTML files")
    parser.add_argument("--mock", action="store_true", help="Force high-fidelity mock simulator mode")
    args = parser.parse_args()

    if args.mock:
        import os
        os.environ["CORA_MOCK_MODE"] = "1"

    print("\n=======================================================")
    print("TED KUBAITIS CORA SERP STATISTICAL CORRELATION ENGINE")
    print("=======================================================\n")

    pipeline = CoraCorrelationPipeline(dry_run=args.dry_run)
    summary = pipeline.run()

    print(f"\n=======================================================")
    print(f"CORA SERP CORRELATION EXECUTION SUMMARY")
    print(f"=======================================================")
    print(f"  - Total Queries Analyzed:            {summary.total_queries_analyzed:,}")
    print(f"  - Competitors Measured:              {summary.total_competitors_measured:,}")
    print(f"  - Factor Invariants Evaluated:       {summary.total_factors_evaluated:,}")
    print(f"  - Correlated Factors Isolated:       {summary.total_significant_factors_isolated:,}")
    print(f"  - Target Solution Pages Calibrated:  {summary.total_pages_calibrated:,}")
    print(f"  - Critical Factor Deficits Resolved: {summary.aggregate_deficits_resolved:,}")
    print(f"  - Telemetry Output:                  {CORA_TELEMETRY_PATH}")
    print(f"  - Executive Report:                  {CORA_REPORT_PATH}")
    print(f"=======================================================\n")


if __name__ == "__main__":
    main()
