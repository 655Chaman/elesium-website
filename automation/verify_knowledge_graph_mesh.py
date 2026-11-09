#!/usr/bin/env python3
"""
===============================================================================
Knowledge Graph Entity Stacking & Deep Schema Mesh Automated Verifier
Module 01 / 02: Authority Stacking, Wikidata Q-IDs & Google kgmid Ontologies
===============================================================================
Executes 6 rigorous verification gates:
  Gate 1: Root Organization & Corporation Entity Stacking (Q131149202 + Profiles)
  Gate 2: Google Knowledge Graph Entity Identifiers (kgmid in knowsAbout & areaServed)
  Gate 3: 13 Thematic Silo Hubs @graph Co-Reference Interlinking (about & mentions)
  Gate 4: Regulatory Authority Entity Disambiguation (RBI, SEBI, MoRTH, CDSCO, DPDP)
  Gate 5: Micro-SaaS Simulators Entity Grounding (5 calculators with knowsAbout)
  Gate 6: Compression & Pre-Render Parity (HTML, .gz, and .br pre-compression)
===============================================================================
"""

import sys
import json
import gzip
from pathlib import Path
from typing import Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

FRONTEND_DIR = ROOT_DIR / "frontend"
FRONTEND_PUBLIC = FRONTEND_DIR / "public"
FRONTEND_DIST = FRONTEND_DIR / "dist"

from automation.knowledge_graph_registry import (
    ORGANIZATION_ENTITY,
    CORE_KNOWLEDGE_ENTITIES,
    STATUTORY_ENTITIES,
    GEOGRAPHIC_ENTITIES,
    SILO_KNOWLEDGE_MESH
)

def log_pass(msg: str):
    print(f"  [PASS] {msg}")

def log_fail(msg: str):
    print(f"  [FAIL] {msg}")

def run_gate_1_root_entity_stacking() -> bool:
    print("\n--- Gate 1: Root Organization & Corporation Entity Stacking ---")
    all_ok = True
    targets = [FRONTEND_DIR / "index.html", FRONTEND_DIST / "index.html"]

    for t in targets:
        if not t.exists():
            log_fail(f"Target missing: {t}")
            all_ok = False
            continue

        content = t.read_text(encoding="utf-8")
        if '<script type="application/ld+json">' not in content:
            log_fail(f"No JSON-LD script found in {t}")
            all_ok = False
            continue

        start = content.index('<script type="application/ld+json">') + len('<script type="application/ld+json">')
        end = content.index('</script>', start)
        schema = json.loads(content[start:end].strip())

        org = next((n for n in schema.get("@graph", []) if any(k in n.get("@type", []) for k in ["Organization", "Corporation"])), None)
        if not org:
            log_fail(f"Organization node missing in {t}")
            all_ok = False
            continue

        # Check Wikidata Q131149202
        same_as = org.get("sameAs", [])
        has_wikidata = any("Q131149202" in s for s in same_as)
        if not has_wikidata:
            log_fail(f"Wikidata Q131149202 missing in sameAs of {t.relative_to(ROOT_DIR)}")
            all_ok = False
        else:
            log_pass(f"Wikidata Q131149202 verified in {t.relative_to(ROOT_DIR)}")

        # Check Authority Profiles
        required_profiles = ["crunchbase", "github", "linkedin", "g2", "trustpilot"]
        missing_profiles = [p for p in required_profiles if not any(p in s.lower() for s in same_as)]
        if missing_profiles:
            log_fail(f"Missing high-DA profiles {missing_profiles} in {t.relative_to(ROOT_DIR)}")
            all_ok = False
        else:
            log_pass(f"High-DA Authority Syndication nodes verified in {t.relative_to(ROOT_DIR)} ({len(same_as)} total sameAs links)")

        # Check Founder Node
        founder = org.get("founder", {})
        if founder.get("name") != "Chaman Shah":
            log_fail(f"Founder Chaman Shah missing in {t.relative_to(ROOT_DIR)}")
            all_ok = False
        else:
            log_pass(f"Founder entity Chaman Shah grounded in {t.relative_to(ROOT_DIR)}")

    return all_ok

def run_gate_2_kgmid_identifiers() -> bool:
    print("\n--- Gate 2: Google Knowledge Graph Entity Identifiers (kgmid) ---")
    all_ok = True
    targets = [FRONTEND_DIR / "index.html", FRONTEND_DIST / "index.html"]

    for t in targets:
        content = t.read_text(encoding="utf-8")
        start = content.index('<script type="application/ld+json">') + len('<script type="application/ld+json">')
        end = content.index('</script>', start)
        schema = json.loads(content[start:end].strip())
        org = next((n for n in schema.get("@graph", []) if any(k in n.get("@type", []) for k in ["Organization", "Corporation"])), None)

        # Check kgmids in knowsAbout
        knows_about = org.get("knowsAbout", [])
        kgmids = [k.get("identifier") for k in knows_about if isinstance(k, dict) and k.get("identifier", "").startswith(("/m/", "/g/"))]
        if len(kgmids) < 6:
            log_fail(f"Insufficient kgmids in knowsAbout of {t.relative_to(ROOT_DIR)} (Found {len(kgmids)}, expected >= 6)")
            all_ok = False
        else:
            log_pass(f"Google kgmids in knowsAbout verified: {kgmids[:5]}... ({len(kgmids)} total) in {t.relative_to(ROOT_DIR)}")

        # Check kgmids in areaServed
        area_served = org.get("areaServed", [])
        geo_kgmids = [a.get("identifier") for a in area_served if isinstance(a, dict) and a.get("identifier", "").startswith(("/m/", "/g/"))]
        if len(geo_kgmids) < 6:
            log_fail(f"Insufficient geo kgmids in areaServed of {t.relative_to(ROOT_DIR)} (Found {len(geo_kgmids)}, expected >= 6)")
            all_ok = False
        else:
            log_pass(f"Google geo kgmids in areaServed verified: {geo_kgmids[:5]}... ({len(geo_kgmids)} total) in {t.relative_to(ROOT_DIR)}")

    return all_ok

def run_gate_3_silo_category_mesh() -> bool:
    print("\n--- Gate 3: 13 Thematic Silo Hubs @graph Co-Reference Interlinking ---")
    all_ok = True
    cat_dir = FRONTEND_DIST / "solutions" / "category"

    for silo_id, mesh in SILO_KNOWLEDGE_MESH.items():
        targets = [cat_dir / f"{silo_id}.html", cat_dir / silo_id / "index.html"]
        for target in targets:
            if not target.exists():
                log_fail(f"Category hub file missing: {target}")
                all_ok = False
                continue

            content = target.read_text(encoding="utf-8")
            start = content.index('<script type="application/ld+json">') + len('<script type="application/ld+json">')
            end = content.index('</script>', start)
            schema = json.loads(content[start:end].strip())

            cp = next((n for n in schema.get("@graph", []) if n.get("@type") == "CollectionPage"), None)
            if not cp:
                log_fail(f"CollectionPage node missing in {target.relative_to(ROOT_DIR)}")
                all_ok = False
                continue

            # Check about contains organization and primary entity
            about = cp.get("about", [])
            about_ids = [a.get("@id") for a in about if isinstance(a, dict) and "@id" in a]
            about_names = [a.get("name") for a in about if isinstance(a, dict) and "name" in a]
            if "https://elesium.online/#organization" not in about_ids:
                log_fail(f"CollectionPage 'about' missing #organization in {target.relative_to(ROOT_DIR)}")
                all_ok = False
            elif mesh["primary_entity"]["name"] not in about_names:
                log_fail(f"CollectionPage 'about' missing primary entity {mesh['primary_entity']['name']} in {target.relative_to(ROOT_DIR)}")
                all_ok = False
            else:
                log_pass(f"CollectionPage 'about' co-reference verified in /solutions/category/{silo_id}/: {about_names}")

            # Check mentions
            mentions = cp.get("mentions", [])
            if not mentions:
                log_fail(f"CollectionPage 'mentions' array empty in {target.relative_to(ROOT_DIR)}")
                all_ok = False
            else:
                log_pass(f"CollectionPage 'mentions' entities verified in /solutions/category/{silo_id}/ ({len(mentions)} entities)")

    return all_ok

def run_gate_4_regulatory_entities() -> bool:
    print("\n--- Gate 4: Regulatory Authority Entity Disambiguation ---")
    all_ok = True
    cat_dir = FRONTEND_DIST / "solutions" / "category"

    silo_reg_checks = [
        ("bfsi", ["RBI", "SEBI", "DPDP"]),
        ("logistics", ["MoRTH", "DGCA", "DPDP"]),
        ("healthcare", ["CDSCO", "DPDP", "HIPAA"]),
        ("telecom", ["TRAI", "DPDP"]),
        ("legal", ["DPDP", "GDPR"])
    ]

    for silo_id, expected_regs in silo_reg_checks:
        target = cat_dir / f"{silo_id}.html"
        content = target.read_text(encoding="utf-8")
        start = content.index('<script type="application/ld+json">') + len('<script type="application/ld+json">')
        end = content.index('</script>', start)
        schema = json.loads(content[start:end].strip())

        cp = next((n for n in schema.get("@graph", []) if n.get("@type") == "CollectionPage"), None)
        mentions = cp.get("mentions", [])
        mention_names = [m.get("alternateName") or m.get("name") for m in mentions if isinstance(m, dict)]
        combined_text = " ".join(mention_names)

        for reg in expected_regs:
            if reg not in combined_text:
                log_fail(f"Expected regulator {reg} missing in mentions of /solutions/category/{silo_id}/")
                all_ok = False
            else:
                log_pass(f"Regulator {reg} actively grounded in /solutions/category/{silo_id}/ schema")

    return all_ok

def run_gate_5_microsaas_tools_entity_grounding() -> bool:
    print("\n--- Gate 5: Micro-SaaS Simulators Entity Grounding ---")
    all_ok = True

    tool_slugs = [
        "token-cost-arbitrage-calculator",
        "dpdp-act-penalty-exposure-calculator",
        "enterprise-rag-latency-simulator",
        "agent-vram-gpu-cluster-sizer",
        "b2b-seo-roi-payback-model"
    ]

    for slug in tool_slugs:
        targets = [
            FRONTEND_PUBLIC / "tools" / f"{slug}.html",
            FRONTEND_DIST / "tools" / f"{slug}.html"
        ]

        for target in targets:
            content = target.read_text(encoding="utf-8")
            start = content.index('<script type="application/ld+json">') + len('<script type="application/ld+json">')
            end = content.index('</script>', start)
            schema = json.loads(content[start:end].strip())

            app = next((n for n in schema.get("@graph", []) if any(k in n.get("@type", []) for k in ["WebApplication", "SoftwareApplication"])), None)
            if not app:
                log_fail(f"WebApplication node missing in {target.relative_to(ROOT_DIR)}")
                all_ok = False
                continue

            knows_about = app.get("knowsAbout", [])
            if not knows_about:
                log_fail(f"knowsAbout missing in {target.relative_to(ROOT_DIR)}")
                all_ok = False
            else:
                log_pass(f"Tool {slug} entity grounding verified in {target.relative_to(ROOT_DIR)} ({len(knows_about)} knowsAbout entities)")

    return all_ok

def run_gate_6_compression_parity() -> bool:
    print("\n--- Gate 6: Compression & Pre-Render Parity ---")
    all_ok = True
    cat_dir = FRONTEND_DIST / "solutions" / "category"

    for silo_id in SILO_KNOWLEDGE_MESH.keys():
        f_html = cat_dir / f"{silo_id}.html"
        f_gz = cat_dir / f"{silo_id}.html.gz"
        f_br = cat_dir / f"{silo_id}.html.br"

        if not (f_html.exists() and f_gz.exists() and f_br.exists()):
            log_fail(f"Compression missing for category hub /solutions/category/{silo_id}/")
            all_ok = False
        else:
            log_pass(f"Pre-compression verified for /solutions/category/{silo_id}/ (.html, .gz, .br)")

    return all_ok

def main():
    print("=" * 80)
    print("🔬 AUDITING PHASE 10: KNOWLEDGE GRAPH ENTITY STACKING & SCHEMA MESH")
    print("=" * 80)

    g1 = run_gate_1_root_entity_stacking()
    g2 = run_gate_2_kgmid_identifiers()
    g3 = run_gate_3_silo_category_mesh()
    g4 = run_gate_4_regulatory_entities()
    g5 = run_gate_5_microsaas_tools_entity_grounding()
    g6 = run_gate_6_compression_parity()

    print("\n" + "=" * 80)
    if all([g1, g2, g3, g4, g5, g6]):
        print("🏆 ALL 6 GATES PASSED: Knowledge Graph Entity Mesh is 100% SHIPSHAPE!")
        print("=" * 80)
        sys.exit(0)
    else:
        print("❌ VERIFICATION FAILED: One or more gates reported errors.")
        print("=" * 80)
        sys.exit(1)

if __name__ == "__main__":
    main()
