#!/usr/bin/env python3
"""
=============================================================================
GSC LIVE CONNECTOR CLI (MODULE 4) - GOOGLE SEARCH CONSOLE API v3
=============================================================================
Classification: Google Search Console (GSC) API v3 Live Connector
Methodology: Brian Kato (SEO Rockstars 2026 Day 2)

Usage:
  python3 automation/gsc_live_connector.py [--site-url URL] [--days DAYS] [--mock]
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

from automation.gsc_engine.connector import GSCConnector
from automation.gsc_engine.config import SITE_URL

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("gsc_live_connector")


def main():
    parser = argparse.ArgumentParser(description="Google Search Console API v3 Live Connector")
    parser.add_argument("--site-url", default=SITE_URL, help="Target GSC site URL")
    parser.add_argument("--days", type=int, default=90, help="Days of search analytics history")
    parser.add_argument("--mock", action="store_true", help="Force high-fidelity mock simulation")
    parser.add_argument("--output", default="automation/gsc_sample_data.json", help="Path to output JSON")
    args = parser.parse_args()

    if args.mock:
        import os
        os.environ["GSC_MOCK_MODE"] = "1"

    connector = GSCConnector(site_url=args.site_url)
    print(f"\n=======================================================")
    print(f"GOOGLE SEARCH CONSOLE API v3 CONNECTOR")
    print(f"Target Site: {connector.site_url}")
    print(f"Authentication Mode: {connector.auth_mode}")
    print(f"=======================================================\n")

    records = connector.fetch_search_analytics()
    print(f"Total Query-Page Records Fetched: {len(records):,}")

    # Convert records to dict for export
    export_data = [
        {
            "query": r.query,
            "page": r.page,
            "clicks": r.clicks,
            "impressions": r.impressions,
            "ctr": r.ctr,
            "position": r.position,
            "intent": r.intent.value,
            "matched_pattern": r.matched_intent_pattern,
        }
        for r in records
    ]

    out_path = Path(args.output)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2)

    print(f"Exported search analytics records to: {out_path}\n")

    # Display sample top queries
    print("Sample Top Records by Impressions:")
    sorted_records = sorted(records, key=lambda x: x.impressions, reverse=True)
    for r in sorted_records[:10]:
        print(f"  - [{r.position:4.1f}] ({r.impressions:5,d} imp, {r.ctr*100:4.1f}% CTR) [{r.intent.value}] {r.query[:60]}")
    print("")


if __name__ == "__main__":
    main()
