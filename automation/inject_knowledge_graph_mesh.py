#!/usr/bin/env python3
"""
===============================================================================
Knowledge Graph Entity Stacking & Deep Schema Mesh Injection Engine
Module 01 / 02: Authority Stacking, Wikidata Q-IDs & Google kgmid Ontologies
===============================================================================
Injects:
  1. Root Entity Stacking in frontend/index.html and frontend/dist/index.html
  2. Thematic Silo Category Hub Schema Mesh across all 13 industry verticals
  3. Micro-SaaS Calculator WebApplication entity grounding across tools/ & embed/
  4. Pre-compressed Gzip (.gz) and Brotli (.br) generation for dist assets
===============================================================================
"""

import os
import re
import json
import gzip
from pathlib import Path
from typing import Dict, Any, List

try:
    import brotli
    HAS_BROTLI = True
except ImportError:
    HAS_BROTLI = False

ROOT_DIR = Path(__file__).resolve().parent.parent
import sys
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

def compress_dist_file(file_path: Path):
    """Generates .gz and .br pre-compressed files alongside the source."""
    if not file_path.exists():
        return
    raw_data = file_path.read_bytes()
    
    # Gzip
    gz_path = file_path.with_name(file_path.name + ".gz")
    with gzip.open(gz_path, "wb", compresslevel=9) as f:
        f.write(raw_data)
        
    # Brotli
    if HAS_BROTLI:
        br_path = file_path.with_name(file_path.name + ".br")
        compressed_br = brotli.compress(raw_data, quality=11)
        br_path.write_bytes(compressed_br)

def update_root_index_html(target_file: Path):
    """Injects the enhanced entity-stacked Organization schema into the root index.html."""
    if not target_file.exists():
        print(f"[-] Target missing: {target_file}")
        return

    content = target_file.read_text(encoding="utf-8")
    
    pattern = re.compile(r'<script\b(?=[^>]*\btype=[\"\']application/ld\+json[\"\'])[^>]*>(.*?)</script>', re.DOTALL | re.IGNORECASE)
    matches = list(pattern.finditer(content))
    if not matches:
        print(f"[-] No JSON-LD block found in {target_file}")
        return

    match = matches[0]
    schema_data = json.loads(match.group(1).strip())
    
    # Locate or create the primary organization node
    graph = schema_data.get("@graph", [])
    org_idx = -1
    for idx, node in enumerate(graph):
        types = node.get("@type", [])
        if isinstance(types, str): types = [types]
        if "Organization" in types or "Corporation" in types:
            org_idx = idx
            break

    # Build updated organization node
    updated_org = dict(ORGANIZATION_ENTITY)
    
    # Enrich knowsAbout with CORE_KNOWLEDGE_ENTITIES
    updated_org["knowsAbout"] = list(CORE_KNOWLEDGE_ENTITIES)
    
    # Enrich areaServed with GEOGRAPHIC_ENTITIES
    updated_org["areaServed"] = list(GEOGRAPHIC_ENTITIES)

    # Preserve any local specific fields from existing node
    if org_idx != -1:
        existing_org = graph[org_idx]
        for field in ["telephone", "email", "priceRange", "currenciesAccepted", "paymentAccepted", "address", "geo", "hasMap", "department"]:
            if field in existing_org and field not in updated_org:
                updated_org[field] = existing_org[field]
        graph[org_idx] = updated_org
    else:
        graph.insert(0, updated_org)

    schema_data["@graph"] = graph
    new_script = f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2, ensure_ascii=False)}\n  </script>'
    
    new_content = content[:match.start()] + new_script + content[match.end():]
    target_file.write_text(new_content, encoding="utf-8")
    print(f"  [+] Injected Root Entity Stacking into: {target_file.relative_to(ROOT_DIR)}")
    
    if "dist" in str(target_file):
        compress_dist_file(target_file)

def update_category_pillar_hubs():
    """Injects interconnected @graph co-reference schema mesh across all 13 Category Hubs in dist/."""
    cat_dir = FRONTEND_DIST / "solutions" / "category"
    if not cat_dir.exists():
        print("[-] Category hubs directory missing in dist.")
        return

    pattern = re.compile(r'<script\b(?=[^>]*\btype=[\"\']application/ld\+json[\"\'])[^>]*>(.*?)</script>', re.DOTALL | re.IGNORECASE)

    for silo_id, mesh in SILO_KNOWLEDGE_MESH.items():
        targets = [
            cat_dir / f"{silo_id}.html",
            cat_dir / silo_id / "index.html"
        ]

        for target in targets:
            if not target.exists():
                continue
            
            content = target.read_text(encoding="utf-8")
            matches = list(pattern.finditer(content))
            if not matches:
                continue

            match = matches[0]
            try:
                schema_data = json.loads(match.group(1).strip())
            except Exception as e:
                print(f"[-] Failed to parse JSON-LD in {target}: {e}")
                continue

            graph = schema_data.get("@graph", [])

            # Build list of regulatory entities for this silo
            regulators_list = []
            for r_key in mesh.get("regulators", []):
                if r_key in STATUTORY_ENTITIES:
                    regulators_list.append(STATUTORY_ENTITIES[r_key])

            # Build mentions list
            mentions_list = list(regulators_list)
            mentions_list.extend(mesh.get("secondary_entities", []))

            # Build about list
            about_list = [
                {"@id": "https://elesium.online/#organization"},
                mesh["primary_entity"]
            ]

            # Update CollectionPage and WebPage nodes
            for node in graph:
                ntype = node.get("@type", "")
                if ntype in ["CollectionPage", "WebPage"]:
                    node["about"] = about_list
                    node["mentions"] = mentions_list
                    node["isPartOf"] = {"@id": "https://elesium.online/#website"}
                elif ntype == "ItemList":
                    node["isPartOf"] = {"@id": f"https://elesium.online/solutions/category/{silo_id}/#webpage"}

            # Ensure Organization node presence or reference
            has_org = any("Organization" in n.get("@type", []) for n in graph)
            if not has_org:
                graph.append({
                    "@type": "Corporation",
                    "@id": "https://elesium.online/#organization",
                    "name": "Elesium",
                    "url": "https://elesium.online",
                    "sameAs": ORGANIZATION_ENTITY["sameAs"][:5]
                })

            schema_data["@graph"] = graph
            new_script = f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2, ensure_ascii=False)}\n</script>'
            new_content = content[:match.start()] + new_script + content[match.end():]
            target.write_text(new_content, encoding="utf-8")
            compress_dist_file(target)

        print(f"  [✓] Silo Schema Mesh Injected: /solutions/category/{silo_id}/ (Wikidata + kgmid + Regulators)")

def update_microsaas_tools_entity_stacking():
    """Enriches the 5 Micro-SaaS tools with knowsAbout and about entity graphs in public/ and dist/."""
    tools_config = [
        {
            "slug": "token-cost-arbitrage-calculator",
            "embed_slug": "token-cost-arbitrage",
            "entities": [
                {
                    "@type": "DefinedTerm",
                    "name": "Large Language Model",
                    "sameAs": "https://www.wikidata.org/wiki/Q1153059",
                    "identifier": "/g/11s_677k1m",
                    "url": "https://www.google.com/search?kgmid=/g/11s_677k1m"
                },
                {
                    "@type": "DefinedTerm",
                    "name": "Cloud Computing",
                    "sameAs": "https://www.wikidata.org/wiki/Q483639",
                    "identifier": "/m/0283dt",
                    "url": "https://www.google.com/search?kgmid=/m/0283dt"
                },
                {
                    "@type": "Thing",
                    "name": "DeepSeek",
                    "sameAs": "https://www.wikidata.org/wiki/Q124378121",
                    "url": "https://en.wikipedia.org/wiki/DeepSeek"
                }
            ]
        },
        {
            "slug": "dpdp-act-penalty-exposure-calculator",
            "embed_slug": "dpdp-penalty-calculator",
            "entities": [
                STATUTORY_ENTITIES["dpdp"],
                {
                    "@type": "DefinedTerm",
                    "name": "Information Privacy",
                    "sameAs": "https://www.wikidata.org/wiki/Q219460",
                    "identifier": "/m/01k8wb",
                    "url": "https://www.google.com/search?kgmid=/m/01k8wb"
                }
            ]
        },
        {
            "slug": "enterprise-rag-latency-simulator",
            "embed_slug": "rag-latency-simulator",
            "entities": [
                {
                    "@type": "DefinedTerm",
                    "name": "Retrieval-Augmented Generation",
                    "sameAs": "https://www.wikidata.org/wiki/Q125503857",
                    "url": "https://en.wikipedia.org/wiki/Retrieval-augmented_generation"
                },
                {
                    "@type": "DefinedTerm",
                    "name": "Vector Database",
                    "sameAs": "https://www.wikidata.org/wiki/Q118745585",
                    "url": "https://en.wikipedia.org/wiki/Vector_database"
                }
            ]
        },
        {
            "slug": "agent-vram-gpu-cluster-sizer",
            "embed_slug": "gpu-cluster-sizer",
            "entities": [
                {
                    "@type": "DefinedTerm",
                    "name": "Graphics Processing Unit",
                    "sameAs": "https://www.wikidata.org/wiki/Q178655",
                    "identifier": "/m/01k93",
                    "url": "https://www.google.com/search?kgmid=/m/01k93"
                },
                {
                    "@type": "Thing",
                    "name": "Nvidia H100",
                    "sameAs": "https://www.wikidata.org/wiki/Q111384074",
                    "url": "https://en.wikipedia.org/wiki/Hopper_(microarchitecture)"
                }
            ]
        },
        {
            "slug": "b2b-seo-roi-payback-model",
            "embed_slug": "b2b-seo-roi-model",
            "entities": [
                {
                    "@type": "DefinedTerm",
                    "name": "Customer Acquisition Cost",
                    "sameAs": "https://www.wikidata.org/wiki/Q5196425",
                    "url": "https://en.wikipedia.org/wiki/Customer_acquisition_cost"
                },
                {
                    "@type": "DefinedTerm",
                    "name": "Business Process Automation",
                    "sameAs": "https://www.wikidata.org/wiki/Q2900762",
                    "identifier": "/m/04z9c",
                    "url": "https://www.google.com/search?kgmid=/m/04z9c"
                }
            ]
        }
    ]

    pattern = re.compile(r'<script\b(?=[^>]*\btype=[\"\']application/ld\+json[\"\'])[^>]*>(.*?)</script>', re.DOTALL | re.IGNORECASE)

    for item in tools_config:
        slug = item["slug"]
        eslug = item["embed_slug"]

        targets = [
            FRONTEND_PUBLIC / "tools" / f"{slug}.html",
            FRONTEND_PUBLIC / "tools" / slug / "index.html",
            FRONTEND_DIST / "tools" / f"{slug}.html",
            FRONTEND_DIST / "tools" / slug / "index.html",
            FRONTEND_PUBLIC / "embed" / f"{eslug}.html",
            FRONTEND_PUBLIC / "embed" / eslug / "index.html",
            FRONTEND_DIST / "embed" / f"{eslug}.html",
            FRONTEND_DIST / "embed" / eslug / "index.html"
        ]

        for target in targets:
            if not target.exists():
                continue

            content = target.read_text(encoding="utf-8")
            matches = list(pattern.finditer(content))
            if not matches:
                continue

            match = matches[0]
            try:
                schema_data = json.loads(match.group(1).strip())
            except Exception:
                continue

            graph = schema_data.get("@graph", [])
            for node in graph:
                types = node.get("@type", [])
                if isinstance(types, str): types = [types]
                if "WebApplication" in types or "SoftwareApplication" in types:
                    node["about"] = item["entities"]
                    node["knowsAbout"] = item["entities"]
                    node["provider"] = {"@id": "https://elesium.online/#organization"}

            schema_data["@graph"] = graph
            new_script = f'<script type="application/ld+json">\n{json.dumps(schema_data, indent=2, ensure_ascii=False)}\n</script>'
            new_content = content[:match.start()] + new_script + content[match.end():]
            target.write_text(new_content, encoding="utf-8")
            
            if "dist" in str(target):
                compress_dist_file(target)

        print(f"  [✓] Tool Schema Grounded: /tools/{slug} & /embed/{eslug}")

def main():
    print("=" * 80)
    print("🚀 INJECTING KNOWLEDGE GRAPH ENTITY STACKING & DEEP SCHEMA MESH")
    print("=" * 80)

    # 1. Root templates
    print("\n[Phase 1] Updating Root Entity Footprint...")
    update_root_index_html(FRONTEND_DIR / "index.html")
    update_root_index_html(FRONTEND_DIST / "index.html")

    # 2. Category Hubs
    print("\n[Phase 2] Updating 13 Category Pillar Hubs Schema Mesh...")
    update_category_pillar_hubs()

    # 3. Micro-SaaS Simulators
    print("\n[Phase 3] Updating Micro-SaaS Simulators Entity Grounding...")
    update_microsaas_tools_entity_stacking()

    print("\n" + "=" * 80)
    print("✅ KNOWLEDGE GRAPH ENTITY STACKING & SCHEMA MESH INJECTION COMPLETE!")
    print("=" * 80)

if __name__ == "__main__":
    main()
