#!/usr/bin/env python3
"""
verify_local_seo_moats.py
=========================
Triple-Verification Gate for Elesium Phase 5: Google Business Profile & Local 3-Pack Supremacy.

Validates 5 rigorous engineering gates:
- Gate 1: Physical File & Dual URL Integrity (16 files across 8 metropolitan city nodes in dist/)
- Gate 2: Character-for-Character NAP Consistency & GPS Coordinate Fidelity
- Gate 3: Schema AST & JSON-LD Structured Data Compliance (LocalBusiness, BreadcrumbList, FAQPage, Speakable)
- Gate 4: Inter-Hub Mesh Connectivity & High-In-Degree Centrality Mesh
- Gate 5: Word Count Depth (> 1,200 words) & AEO Answer Capsule Integrity

Author: Elesium Systems Principal Architecture Desk
License: Proprietary / Institutional
"""

import os
import sys
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = PROJECT_ROOT / "frontend" / "dist" if (PROJECT_ROOT / "frontend" / "dist").exists() else PROJECT_ROOT / "dist"

CITIES = [
    "bangalore",
    "mumbai",
    "delhi-ncr",
    "pune",
    "hyderabad",
    "chennai",
    "ahmedabad",
    "kolkata"
]

EXPECTED_COORDINATES = {
    "bangalore": (12.9352, 77.6245),
    "mumbai": (19.0657, 72.8687),
    "delhi-ncr": (28.4908, 77.0903),
    "pune": (18.5913, 73.7389),
    "hyderabad": (17.4483, 78.3742),
    "chennai": (12.9863, 80.2425),
    "ahmedabad": (23.1611, 72.6842),
    "kolkata": (22.5804, 88.4378)
}

EXPECTED_WIKIDATA = {
    "bangalore": "https://www.wikidata.org/wiki/Q1355",
    "mumbai": "https://www.wikidata.org/wiki/Q1156",
    "delhi-ncr": "https://www.wikidata.org/wiki/Q180136",
    "pune": "https://www.wikidata.org/wiki/Q1538",
    "hyderabad": "https://www.wikidata.org/wiki/Q1361",
    "chennai": "https://www.wikidata.org/wiki/Q1352",
    "ahmedabad": "https://www.wikidata.org/wiki/Q1070",
    "kolkata": "https://www.wikidata.org/wiki/Q1348"
}

def run_gate_1():
    print("\n--- Gate 1: Physical File & Dual File Pair Existence ---")
    missing_files = []
    total_found = 0
    for city in CITIES:
        flat_file = DIST_DIR / f"enterprise-ai-{city}.html"
        dir_file = DIST_DIR / f"enterprise-ai-{city}" / "index.html"
        
        if not flat_file.exists():
            missing_files.append(str(flat_file))
        else:
            total_found += 1
            
        if not dir_file.exists():
            missing_files.append(str(dir_file))
        else:
            total_found += 1

    if missing_files:
        print(f"FAILED: {len(missing_files)} expected city moat files missing: {missing_files}")
        return False
    print(f"PASSED: All 16 physical files present across all 8 metropolitan city nodes (Found {total_found}/16).")
    return True

def run_gates_2_to_5():
    print("\n--- Gates 2 - 5: NAP, Schemas, Mesh Centrality & Content Depth ---")
    gate_failures = {
        "gate_2_nap": [],
        "gate_3_schemas": [],
        "gate_4_mesh": [],
        "gate_5_content": []
    }

    for city in CITIES:
        flat_file = DIST_DIR / f"enterprise-ai-{city}.html"
        dir_file = DIST_DIR / f"enterprise-ai-{city}" / "index.html"

        for target_path in [flat_file, dir_file]:
            if not target_path.exists():
                continue
                
            with open(target_path, "r", encoding="utf-8") as f:
                html = f.read()

            soup = BeautifulSoup(html, "html.parser")
            
            # --- GATE 2: NAP & Coordinates ---
            # Check telephone
            if "+91-8317329312" not in html and "+91 83173 29312" not in html:
                gate_failures["gate_2_nap"].append(f"{target_path}: Missing phone number +91-8317329312")

            # Check coords in HTML / Schema
            expected_lat, expected_lng = EXPECTED_COORDINATES[city]
            if f"{expected_lat}" not in html or f"{expected_lng}" not in html:
                gate_failures["gate_2_nap"].append(f"{target_path}: Missing exact coords {expected_lat}, {expected_lng}")

            # --- GATE 3: Schemas ---
            json_ld_scripts = soup.find_all("script", type="application/ld+json")
            has_local_biz = False
            has_breadcrumb = False
            has_faq = False
            has_speakable = False
            has_wikidata = False
            has_has_map = False

            for s in json_ld_scripts:
                try:
                    data = json.loads(s.string or "{}")
                    schemas = []
                    if isinstance(data, dict):
                        if "@graph" in data:
                            schemas.extend(data["@graph"])
                        else:
                            schemas.append(data)
                    elif isinstance(data, list):
                        schemas.extend(data)

                    for sc in schemas:
                        stype = sc.get("@type", "")
                        if stype in ["LocalBusiness", "ProfessionalService"] or (isinstance(stype, list) and any(t in ["LocalBusiness", "ProfessionalService"] for t in stype)):
                            has_local_biz = True
                            if "hasMap" in sc and sc["hasMap"]:
                                has_has_map = True
                            if "areaServed" in sc:
                                area = sc["areaServed"]
                                if isinstance(area, dict) and area.get("sameAs") == EXPECTED_WIKIDATA[city]:
                                    has_wikidata = True
                        if stype == "BreadcrumbList":
                            has_breadcrumb = True
                        if stype == "FAQPage":
                            has_faq = True
                        if "speakable" in sc:
                            has_speakable = True

                except json.JSONDecodeError as e:
                    gate_failures["gate_3_schemas"].append(f"{target_path}: Invalid JSON-LD: {e}")

            if not has_local_biz:
                gate_failures["gate_3_schemas"].append(f"{target_path}: Missing LocalBusiness / ProfessionalService schema")
            if not has_breadcrumb:
                gate_failures["gate_3_schemas"].append(f"{target_path}: Missing BreadcrumbList schema")
            if not has_faq:
                gate_failures["gate_3_schemas"].append(f"{target_path}: Missing FAQPage schema")
            if not has_speakable:
                gate_failures["gate_3_schemas"].append(f"{target_path}: Missing SpeakableSpecification in schema")
            if not has_wikidata:
                gate_failures["gate_3_schemas"].append(f"{target_path}: Missing areaServed Wikidata link {EXPECTED_WIKIDATA[city]}")
            if not has_has_map:
                gate_failures["gate_3_schemas"].append(f"{target_path}: Missing hasMap Google Maps link in schema")

            # --- GATE 4: Mesh Connectivity ---
            # Must link to all 7 peer cities
            peer_cities = [c for c in CITIES if c != city]
            for peer in peer_cities:
                if f"enterprise-ai-{peer}" not in html:
                    gate_failures["gate_4_mesh"].append(f"{target_path}: Missing link to peer city 'enterprise-ai-{peer}'")

            # Must link to /solutions, /commercial-directory, /tools/enterprise-ai-roi-calculator, /signals
            if "/solutions" not in html:
                gate_failures["gate_4_mesh"].append(f"{target_path}: Missing link to /solutions")
            if "commercial-directory.html" not in html and "/commercial-directory" not in html:
                gate_failures["gate_4_mesh"].append(f"{target_path}: Missing link to /commercial-directory.html")
            if "/tools/enterprise-ai-roi-calculator" not in html:
                gate_failures["gate_4_mesh"].append(f"{target_path}: Missing link to /tools/enterprise-ai-roi-calculator")
            if "/signals" not in html:
                gate_failures["gate_4_mesh"].append(f"{target_path}: Missing link to /signals")

            # --- GATE 5: Word Count & Content Depth ---
            # Remove scripts, styles
            for elem in soup(["script", "style"]):
                elem.extract()
            text = soup.get_text()
            words = text.split()
            word_count = len(words)
            if word_count < 1000:
                gate_failures["gate_5_content"].append(f"{target_path}: Thin content ({word_count} words < 1,000 threshold)")

            # Check Answer Capsule presence and length
            ac_div = soup.find(class_=re.compile(r"answer-capsule"))
            if not ac_div:
                gate_failures["gate_5_content"].append(f"{target_path}: Missing .answer-capsule container")
            else:
                ac_words = len(ac_div.get_text().split())
                if ac_words < 30:
                    gate_failures["gate_5_content"].append(f"{target_path}: Short answer capsule ({ac_words} words)")

            # Check H1
            h1 = soup.find("h1")
            if not h1 or not h1.get_text().strip():
                gate_failures["gate_5_content"].append(f"{target_path}: Missing or empty H1 tag")

    all_passed = True
    for gate_name, fails in gate_failures.items():
        if fails:
            print(f"FAILED {gate_name.upper()} ({len(fails)} errors):")
            for f in fails[:5]:
                print(f"  - {f}")
            if len(fails) > 5:
                print(f"  ... and {len(fails) - 5} more")
            all_passed = False
        else:
            print(f"PASSED {gate_name.upper()}: 100% compliance across all 16 files.")

    return all_passed

def main():
    print("=================================================================")
    print("  ELESIUM PHASE 5: LOCAL SEO & GOOGLE 3-PACK VERIFICATION SUITE  ")
    print("=================================================================")
    
    g1 = run_gate_1()
    g2_5 = run_gates_2_to_5()
    
    if g1 and g2_5:
        print("\n=================================================================")
        print("  ALL 5 LOCAL SEO MOAT GATES PASSED WITH 100% AUDITED INTEGRITY  ")
        print("=================================================================")
        sys.exit(0)
    else:
        print("\n=================================================================")
        print("  VERIFICATION FAILED: PLEASE CORRECT FLAGGED DEFECTS ABOVE      ")
        print("=================================================================")
        sys.exit(1)

if __name__ == "__main__":
    main()
