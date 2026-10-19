#!/usr/bin/env python3
"""
test_phase8_suite.py — Unified Test Suite Runner for Phase 8 Multi-Channel PR & Directory Syndication Engine
=============================================================================================================
Framework: Edward Sturm Complete Masterclass (Modules 11 & 12) & SEO Rockstars 2026
Target: Elesium Online (https://elesium.online)

Executes programmatic test suites for:
1. automation/expert_quote_matcher.py (Sturm Compliance, Sentence Counts, Fluff Filter, Hard Metrics)
2. automation/directory_profile_syncer.py (6 Directory Profiles, 100% NAP Parity Assertion, BOFU Links)
3. automation/meetup_group_scout.py (5 Indian Tech Hubs, 'Needs Organizer' Takeovers, Co-Hosting Playbooks)
4. automation/product_hunt_launcher.py (PH Asset Specs, Tagline < 60 Chars, Maker Comment, BetaList)
5. Comprehensive Asset Integrity and Cross-File Grounding Verification
"""

from __future__ import annotations

import json
import sys
import time
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
AUTOMATION_DIR = BASE_DIR / "automation"
sys.path.insert(0, str(AUTOMATION_DIR))

# Import the 4 Phase 8 engines
import expert_quote_matcher
import directory_profile_syncer
import meetup_group_scout
import product_hunt_launcher


def run_phase8_test_suite():
    start_time = time.time()
    print("==================================================================================")
    print("ELESIUM PHASE 8: MULTI-CHANNEL PR & DIRECTORY SYNDICATION ENGINE TEST SUITE")
    print("==================================================================================")
    print(f"Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S IST')}")
    print(f"Automation Directory: {AUTOMATION_DIR}\n")

    results = {}

    # Test 1: Expert Quote Matcher
    print("\n>>> [1/4] EXECUTING TEST: expert_quote_matcher.py")
    try:
        t1_pass = expert_quote_matcher.run_self_test()
        results["expert_quote_matcher"] = {
            "status": "PASSED" if t1_pass else "FAILED",
            "details": "1-3 sentences/para, zero fluff, hard metrics (1.9s, ₹18.4L, 98% cut), Chaman Shah credentials, deep anchors"
        }
    except Exception as e:
        results["expert_quote_matcher"] = {"status": "FAILED", "error": str(e)}

    # Test 2: Directory Profile Syncer
    print("\n>>> [2/4] EXECUTING TEST: directory_profile_syncer.py")
    try:
        t2_pass = directory_profile_syncer.run_self_test()
        results["directory_profile_syncer"] = {
            "status": "PASSED" if t2_pass else "FAILED",
            "details": "6 directories (Clutch, GoodFirms, G2, Crunchbase, Semrush, Trustpilot) with 100% NAP match & top 5 BOFU links"
        }
    except Exception as e:
        results["directory_profile_syncer"] = {"status": "FAILED", "error": str(e)}

    # Test 3: Meetup Group Scout
    print("\n>>> [3/4] EXECUTING TEST: meetup_group_scout.py")
    try:
        t3_pass = meetup_group_scout.run_self_test()
        results["meetup_group_scout"] = {
            "status": "PASSED" if t3_pass else "FAILED",
            "details": "5 tech hubs (Bangalore, Mumbai, Delhi, Hyderabad, Pune) with takeover pitches & co-hosting backlink playbooks"
        }
    except Exception as e:
        results["meetup_group_scout"] = {"status": "FAILED", "error": str(e)}

    # Test 4: Product Hunt Launcher
    print("\n>>> [4/4] EXECUTING TEST: product_hunt_launcher.py")
    try:
        t4_pass = product_hunt_launcher.run_self_test()
        results["product_hunt_launcher"] = {
            "status": "PASSED" if t4_pass else "FAILED",
            "details": "Tagline <60 chars verified, 6-slide gallery specs, maker comment, tweet thread, outreach copy & BetaList payload"
        }
    except Exception as e:
        results["product_hunt_launcher"] = {"status": "FAILED", "error": str(e)}

    # Test 5: Verify Generated Assets on Disk
    print("\n>>> [5/5] VERIFYING GENERATED ASSET ARTIFACTS ON DISK")
    asset_checks = [
        # PR Pitches
        AUTOMATION_DIR / "authority_assets" / "pr_pitches" / "expert_pr_pitches.json",
        AUTOMATION_DIR / "authority_assets" / "pr_pitches" / "connectively_pitch_responder.md",
        AUTOMATION_DIR / "authority_assets" / "pr_pitches" / "featured_pitch_responder.md",
        # Directory Profiles
        AUTOMATION_DIR / "directory_profiles" / "clutch_profile_solutions.md",
        AUTOMATION_DIR / "directory_profiles" / "goodfirms_profile_solutions.md",
        AUTOMATION_DIR / "directory_profiles" / "g2_profile_solutions.md",
        AUTOMATION_DIR / "directory_profiles" / "crunchbase_profile_solutions.md",
        AUTOMATION_DIR / "directory_profiles" / "semrush_local_citations.json",
        AUTOMATION_DIR / "directory_profiles" / "semrush_local_citations.csv",
        AUTOMATION_DIR / "directory_profiles" / "trustpilot_profile_solutions.md",
        AUTOMATION_DIR / "directory_profiles" / "nap_consistency_report.json",
        # Meetups
        AUTOMATION_DIR / "authority_assets" / "meetups" / "meetup_takeover_dossier.json",
        AUTOMATION_DIR / "authority_assets" / "meetups" / "meetup_playbook_bangalore.md",
        AUTOMATION_DIR / "authority_assets" / "meetups" / "meetup_playbook_mumbai.md",
        AUTOMATION_DIR / "authority_assets" / "meetups" / "meetup_playbook_delhi.md",
        AUTOMATION_DIR / "authority_assets" / "meetups" / "meetup_playbook_hyderabad.md",
        AUTOMATION_DIR / "authority_assets" / "meetups" / "meetup_playbook_pune.md",
        # Product Hunt
        AUTOMATION_DIR / "authority_assets" / "product_hunt" / "product_hunt_launch_bundle.json",
        AUTOMATION_DIR / "authority_assets" / "product_hunt" / "PRODUCT_HUNT_LAUNCH_ASSETS.md",
        AUTOMATION_DIR / "authority_assets" / "product_hunt" / "BETALIST_LAUNCH_ASSETS.md"
    ]

    missing_assets = []
    for asset in asset_checks:
        if not asset.exists():
            missing_assets.append(str(asset.relative_to(BASE_DIR)))
        else:
            print(f"  ✓ Found: {asset.relative_to(BASE_DIR)} ({asset.stat().st_size} bytes)")

    if missing_assets:
        print(f"\n✗ Missing Assets Detected: {missing_assets}")
        results["asset_integrity"] = {"status": "FAILED", "missing": missing_assets}
    else:
        print(f"\n✓ All {len(asset_checks)} Required Asset Files Confirmed on Disk.")
        results["asset_integrity"] = {"status": "PASSED", "verified_files": len(asset_checks)}

    # Summary
    elapsed = round(time.time() - start_time, 2)
    all_passed = all(r.get("status") == "PASSED" for r in results.values())

    print("\n==================================================================================")
    print("PHASE 8 ENGINE TEST RESULTS SUMMARY")
    print("==================================================================================")
    for test_name, res in results.items():
        status_symbol = "✓" if res["status"] == "PASSED" else "✗"
        print(f"{status_symbol} {test_name}: {res['status']}")
        if "details" in res:
            print(f"    {res['details']}")
        if "error" in res:
            print(f"    Error: {res['error']}")

    print(f"\nOverall Result: {'100% ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
    print(f"Total Execution Time: {elapsed} seconds")
    print("==================================================================================\n")

    # Write summary report to disk
    report_file = AUTOMATION_DIR / "phase8_execution_report.json"
    report_file.write_text(
        json.dumps({
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S IST"),
            "all_passed": all_passed,
            "elapsed_seconds": elapsed,
            "results": results
        }, indent=2),
        encoding="utf-8"
    )

    return all_passed


if __name__ == "__main__":
    success = run_phase8_test_suite()
    sys.exit(0 if success else 1)
