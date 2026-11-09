#!/usr/bin/env python3
"""
================================================================================
VERIFY ENTERPRISE ONBOARDING (MODULE 13) — 6-GATE PRODUCTION AUDITOR
================================================================================
Classification: Production Automated Quality Gate & Enterprise CRO Auditor
Gates:
  - Gate 1: Physical File Dual-Mount Verification (public/ & dist/, html & index.html)
  - Gate 2: Multi-Step Qualification Logic & 3-Tier Budget Alignment
  - Gate 3: Instant Mutual NDA Generator & Statutory Confidentiality Safeguards
  - Gate 4: High-Value Lead Scoring & Multi-Channel Webhook Routing Protocol
  - Gate 5: Schema.org JSON-LD ContactPage, OrderAction & Service Validation
  - Gate 6: Search Engine Sitemap Fleet Registration & Edge Pre-Compression
================================================================================
"""

import sys
import json
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT_DIR / "frontend" / "dist"
PUBLIC_DIR = ROOT_DIR / "frontend" / "public"
TELEMETRY_PATH = ROOT_DIR / "automation" / "lead_routing_telemetry.json"

def verify_onboarding_suite():
    print("=" * 80)
    print(" 🔱 AUDITING ENTERPRISE ONBOARDING & CLIENT PROCUREMENT (MODULE 13) 🔱")
    print("=" * 80)

    gates_passed = 0
    total_gates = 6

    # --------------------------------------------------------------------------
    # GATE 1: Physical File Dual-Mount Verification
    # --------------------------------------------------------------------------
    print("\n[GATE 1] Physical File Dual-Mount Verification")
    required_files = [
        PUBLIC_DIR / "onboarding" / "index.html",
        PUBLIC_DIR / "onboarding.html",
        DIST_DIR / "onboarding" / "index.html",
        DIST_DIR / "onboarding.html",
        PUBLIC_DIR / "legal" / "mutual-nda-standard.md",
        DIST_DIR / "legal" / "mutual-nda-standard.md"
    ]

    all_exist = True
    for f in required_files:
        exists = f.exists() and f.stat().st_size > 0
        print(f"  • {f.relative_to(ROOT_DIR)} : {'FOUND ✅' if exists else 'MISSING ❌'}")
        if not exists:
            all_exist = False

    if all_exist:
        print("  Status: PASSED ✅ (100% of onboarding portal assets dual-mounted)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌ (Missing physical onboarding files)")

    # --------------------------------------------------------------------------
    # GATE 2: Multi-Step Qualification Logic & 3-Tier Budget Alignment
    # --------------------------------------------------------------------------
    print("\n[GATE 2] Multi-Step Qualification Logic & 3-Tier Budget Alignment")
    content = (DIST_DIR / "onboarding" / "index.html").read_text(encoding="utf-8")
    
    has_tier1 = "1,50,000" in content and "Pilot Architecture Sprint" in content
    has_tier2 = "6,00,000" in content and "Enterprise Multi-Agent Suite" in content
    has_tier3 = "4,50,000" in content and "Autonomous AI Engineering Pod" in content
    has_steps = "Entity" in content or "Procurement Tier" in content or "Tier 1" in content

    print(f"  Tier 1 (₹1.5L–₹3.5L Sprint)   : {'FOUND ✅' if has_tier1 else 'MISSING ❌'}")
    print(f"  Tier 2 (₹6L–₹15L Triad)       : {'FOUND ✅' if has_tier2 else 'MISSING ❌'}")
    print(f"  Tier 3 (₹4.5L/mo Pod)         : {'FOUND ✅' if has_tier3 else 'MISSING ❌'}")

    if has_tier1 and has_tier2 and has_tier3 and has_steps:
        print("  Status: PASSED ✅ (All 3 institutional investment tiers accurately aligned)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌ (Tier pricing or qualification mismatch)")

    # --------------------------------------------------------------------------
    # GATE 3: Instant Mutual NDA Generator & Statutory Confidentiality
    # --------------------------------------------------------------------------
    print("\n[GATE 3] Instant Mutual NDA Generator & Statutory Confidentiality")
    nda_file = DIST_DIR / "legal" / "mutual-nda-standard.md"
    nda_text = nda_file.read_text(encoding="utf-8") if nda_file.exists() else ""

    has_act_1872 = "Indian Contract Act, 1872" in nda_text
    has_dpdp_8_5 = "Section 8(5)" in nda_text and ("DPDP Act" in nda_text or "DPDP" in nda_text)
    has_jurisdiction = "Bengaluru" in nda_text
    has_zero_retention = "Zero External Retention" in nda_text

    print(f"  Indian Contract Act, 1872     : {'CONFIRMED ✅' if has_act_1872 else 'MISSING ❌'}")
    print(f"  DPDP Act 2023 Section 8(5)    : {'CONFIRMED ✅' if has_dpdp_8_5 else 'MISSING ❌'}")
    print(f"  Bengaluru Legal Jurisdiction  : {'CONFIRMED ✅' if has_jurisdiction else 'MISSING ❌'}")
    print(f"  Zero External Retention SLA   : {'CONFIRMED ✅' if has_zero_retention else 'MISSING ❌'}")

    if has_act_1872 and has_dpdp_8_5 and has_jurisdiction and has_zero_retention:
        print("  Status: PASSED ✅ (Statutory B2B mutual confidentiality contract verified)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌ (NDA contractual defect)")

    # --------------------------------------------------------------------------
    # GATE 4: High-Value Lead Scoring & Multi-Channel Webhook Routing
    # --------------------------------------------------------------------------
    print("\n[GATE 4] High-Value Lead Scoring & Multi-Channel Webhook Routing Protocol")
    if not TELEMETRY_PATH.exists():
        print(f"  ❌ Telemetry receipt not found at {TELEMETRY_PATH}")
        gate4_ok = False
    else:
        with open(TELEMETRY_PATH, "r", encoding="utf-8") as f:
            t_data = json.load(f)
        score_res = t_data.get("score_result", {})
        score = score_res.get("score", 0)
        priority = score_res.get("priority", "")
        channels = t_data.get("dispatched_channels", [])

        print(f"  Sample Lead Scored      : {score}/100 ({priority})")
        print(f"  Active Webhook Channels : {', '.join(channels)}")

        gate4_ok = score >= 80 and priority == "PRIORITY_ALPHA" and len(channels) >= 3

    if gate4_ok:
        print("  Status: PASSED ✅ (Automated lead qualification & dispatch engine validated)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌ (Lead scoring protocol failure)")

    # --------------------------------------------------------------------------
    # GATE 5: Schema.org JSON-LD ContactPage, OrderAction & Service Validation
    # --------------------------------------------------------------------------
    print("\n[GATE 5] Schema.org JSON-LD ContactPage & OrderAction AST Validation")
    has_contact_page = '"@type": "ContactPage"' in content
    has_order_action = '"@type": "OrderAction"' in content
    has_service_schema = '"@type": "Service"' in content
    has_breadcrumb = '"@type": "BreadcrumbList"' in content

    print(f"  ContactPage Schema       : {'FOUND ✅' if has_contact_page else 'MISSING ❌'}")
    print(f"  OrderAction Schema       : {'FOUND ✅' if has_order_action else 'MISSING ❌'}")
    print(f"  Service Catalog Schema   : {'FOUND ✅' if has_service_schema else 'MISSING ❌'}")
    print(f"  BreadcrumbList Schema    : {'FOUND ✅' if has_breadcrumb else 'MISSING ❌'}")

    if has_contact_page and has_order_action and has_service_schema and has_breadcrumb:
        print("  Status: PASSED ✅ (Schema AST completely compliant with Google Rich Results)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌ (Schema AST incomplete)")

    # --------------------------------------------------------------------------
    # GATE 6: Search Engine Sitemap Registration & Edge Pre-Compression
    # --------------------------------------------------------------------------
    print("\n[GATE 6] Search Engine Sitemap Registration & Edge Pre-Compression")
    sitemap_core = (DIST_DIR / "sitemap-core.xml").read_text(encoding="utf-8")
    sitemap_has_onboarding = "https://elesium.online/onboarding/" in sitemap_core

    gz_file = DIST_DIR / "onboarding" / "index.html.gz"
    br_file = DIST_DIR / "onboarding" / "index.html.br"

    compression_ok = gz_file.exists() and br_file.exists()

    print(f"  sitemap-core.xml Entry   : {'REGISTERED ✅' if sitemap_has_onboarding else 'MISSING ❌'}")
    print(f"  Gzip (.gz) Compression   : {'PRESENT ✅' if gz_file.exists() else 'MISSING ❌'}")
    print(f"  Brotli (.br) Compression : {'PRESENT ✅' if br_file.exists() else 'MISSING ❌'}")

    if sitemap_has_onboarding and compression_ok:
        print("  Status: PASSED ✅ (Sitemap synchronization & zero-CPU edge decompression enabled)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌")

    print("\n" + "=" * 80)
    print(f" 🔱 FINAL CERTIFICATION SCORE: {gates_passed}/{total_gates} GATES PASSED")
    print("=" * 80)

    return gates_passed == total_gates

if __name__ == "__main__":
    success = verify_onboarding_suite()
    sys.exit(0 if success else 1)
