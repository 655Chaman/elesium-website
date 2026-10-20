#!/usr/bin/env python3
"""
setup_wizard.py — Portable SEO Factory Onboarding Wizard

Prompts the operator with personalized questions about any software project,
extracts core brand positioning, unspoken "It's Toasted" capabilities,
target personas, and paths, and saves a validated project_config.json.
"""

import json
import secrets
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "project_config.json"

def print_banner():
    print("=" * 80)
    print("      🚀 THE SOVEREIGN PORTABLE SEO FACTORY — ONBOARDING WIZARD 🚀")
    print("   Turn Any Codebase into an Algorithmic & High-Converting Authority Engine")
    print("=" * 80)
    print()

def ask_question(prompt, default=None, validator=None):
    if default:
        full_prompt = f"{prompt} [{default}]: "
    else:
        full_prompt = f"{prompt}: "

    while True:
        try:
            val = input(full_prompt).strip()
        except (KeyboardInterrupt, EOFError):
            print("\nSetup cancelled.")
            sys.exit(1)

        if not val and default is not None:
            val = default

        if validator:
            is_valid, msg = validator(val)
            if is_valid:
                return val
            else:
                print(f"❌ {msg}")
        elif val:
            return val
        else:
            print("❌ This field cannot be empty. Please enter a value.")

def validate_url(url):
    if re.match(r"^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$", url):
        return True, ""
    return False, "Please enter a valid URL (e.g. https://myproject.com)."

def main():
    print_banner()

    print("Step 1: Brand & Domain Metadata")
    print("-" * 40)
    brand_name = ask_question("1. Brand / Company Name", default="Acme AI")
    domain_url = ask_question("2. Canonical Domain URL", default="https://acme.ai", validator=validate_url).rstrip("/")
    tagline = ask_question("3. Core Tagline / Value Proposition", default="Enterprise Autonomous Systems & Sovereign Infrastructure")
    geo_focus = ask_question("4. Primary Geographic Market", default="India & Global")

    print("\nStep 2: Industry & High-Lever B2B Decision-Maker Personas")
    print("-" * 40)
    primary_industry = ask_question("5. Primary Industry / Vertical", default="Logistics & Enterprise Supply Chain")
    
    print("Enter 3 to 5 Sub-Categories / Hub Topics (comma-separated):")
    sub_cats_raw = ask_question("6. Hub Categories", default="Fleet Telematics & Dispatch, Warehouse & WMS Integration, Supply Chain Risk Optimization, Private VPC Deployment")
    hub_categories = [c.strip() for c in sub_cats_raw.split(",") if c.strip()]

    print("Enter 3 to 5 Target Decision-Maker Personas (Plural B2B Roles, comma-separated):")
    personas_raw = ask_question("7. Target Personas", default="Logistics Directors & Fleet Operations VPs, Chief Technology Officers & AI Leads, Supply Chain Superintendents, Chief Risk Officers")
    target_personas = [p.strip() for p in personas_raw.split(",") if p.strip()]

    print("\nStep 3: The Mad Men 'It's Toasted' Unspoken Technical Capabilities")
    print("What engineering capabilities do you execute in the background that competitors never articulate?")
    print("-" * 40)
    cap1 = ask_question("8. Capability #1 (Architecture/Reliability)", default="Deterministic Finite State Machine agent fallbacks with sub-1.5ms Delta WAL checkpointing")
    cap2 = ask_question("9. Capability #2 (Performance/Latency)", default="Sub-200ms transaction ledger reconciliation and zero-copy streaming")
    cap3 = ask_question("10. Capability #3 (Security/Compliance)", default="Private air-gapped VPC deployment with zero third-party cloud data leakage")
    cap4 = ask_question("11. Capability #4 (Cost/FinOps)", default="Dynamic token cost arbitrage and semantic caching saving 85%+ in API spend")

    print("\nStep 4: Commercial Conversion Action")
    print("-" * 40)
    primary_cta = ask_question("12. Primary Call-to-Action (Button Text)", default="Schedule Architecture Audit")
    conversion_route = ask_question("13. Conversion Target Route / Hash", default="/waitlist")

    print("\nStep 5: Technical Stack & Distribution Paths")
    print("-" * 40)
    frontend_framework = ask_question("14. Frontend Framework (vite_react / nextjs / astro / static_html)", default="vite_react")
    dist_dir = ask_question("15. HTML Distribution Directory (relative to project root)", default="frontend/dist")

    indexnow_key = ask_question("16. IndexNow API Key (press Enter to auto-generate)", default=secrets.token_hex(16))

    config_data = {
        "brand_name": brand_name,
        "domain_url": domain_url,
        "tagline": tagline,
        "geo_focus": geo_focus,
        "primary_industry": primary_industry,
        "hub_categories": hub_categories,
        "target_personas": target_personas,
        "its_toasted_capabilities": [cap1, cap2, cap3, cap4],
        "primary_cta": primary_cta,
        "conversion_route": conversion_route,
        "frontend_framework": frontend_framework,
        "dist_dir": dist_dir,
        "indexnow_key": indexnow_key
    }

    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config_data, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80)
    print("✅ PROJECT CONFIGURATION SAVED TO:")
    print(f"   {CONFIG_PATH}")
    print("=" * 80)
    print("\nTo generate your complete compounding SEO engine, run:")
    print("   python3 generator_engine.py --run-all")
    print("=" * 80)

if __name__ == "__main__":
    main()
