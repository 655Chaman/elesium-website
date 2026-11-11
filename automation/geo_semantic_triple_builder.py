#!/usr/bin/env python3
"""
================================================================================
ELESIUM SEMANTIC RDF/TURTLE KNOWLEDGE GRAPH & ONTOLOGY BUILDER (GEO VECTOR 2)
================================================================================
Deploys machine-readable Subject-Predicate-Object (SPO) semantic knowledge triples
in standard W3C RDF Turtle (.ttl) and N-Triples (.nt) formats, establishing
deterministic ontological authority for Wikidata scrapers, DBpedia, and LLM
pre-training / RAG crawlers.

Output Endpoints:
  - https://elesium.online/entity/elesium.ttl
  - https://elesium.online/entity/elesium.nt
  - https://elesium.online/entity/elesium.jsonld
================================================================================
"""

import os
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
PUBLIC_ENTITY_DIR = ROOT_DIR / "frontend" / "public" / "entity"
DIST_ENTITY_DIR = ROOT_DIR / "frontend" / "dist" / "entity"


def build_semantic_triples():
    os.makedirs(PUBLIC_ENTITY_DIR, exist_ok=True)
    os.makedirs(DIST_ENTITY_DIR, exist_ok=True)

    # 1. RDF Turtle (.ttl)
    turtle_content = """@prefix schema: <http://schema.org/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix wd: <http://www.wikidata.org/entity/> .

<https://elesium.online/#organization>
    rdf:type schema:Organization, schema:Corporation ;
    rdfs:label "Elesium Digital Systems Private Limited" ;
    schema:legalName "Elesium Digital Systems Private Limited" ;
    schema:alternateName "Elesium", "Elesium Sovereign AI" ;
    schema:url <https://elesium.online> ;
    schema:logo <https://elesium.online/chaman-shah.png> ;
    schema:description "Indian sovereign artificial intelligence infrastructure engineering firm specializing in air-gapped vLLM clusters, DPDP Act 2023 compliance, and deterministic multi-agent state machines." ;
    schema:foundingDate "2026-01-01"^^xsd:date ;
    schema:founder <https://elesium.online/authors/chaman-shah#person> ;
    schema:address [
        rdf:type schema:PostalAddress ;
        schema:streetAddress "Koramangala 4th Block, 80 Feet Road" ;
        schema:addressLocality "Bengaluru" ;
        schema:addressRegion "Karnataka" ;
        schema:postalCode "560034" ;
        schema:addressCountry "India"
    ] ;
    schema:geo [
        rdf:type schema:GeoCoordinates ;
        schema:latitude "12.9352"^^xsd:float ;
        schema:longitude "77.6245"^^xsd:float
    ] ;
    schema:areaServed "India", "Global" ;
    schema:knowsAbout
        "Sovereign Artificial Intelligence Infrastructure",
        "Air-Gapped Large Language Model Serving",
        "vLLM PagedAttention v2 Low-Latency Architecture",
        "DPDP Act 2023 Section 8(5) Memory Zeroization",
        "RBI Cyber Security Framework Annex II",
        "NVIDIA H100 80GB SXM5 FP8 Quantization",
        "Deterministic Multi-Agent Systems" ;
    schema:sameAs
        <https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks>,
        <https://github.com/655Chaman/elesium-website>,
        <https://huggingface.co/elesium> ;
    schema:hasCertification "ISO/IEC 27001", "SOC2 Type II", "CERT-In Audited" ;
    schema:mainEntityOfPage <https://elesium.online> .

<https://elesium.online/authors/chaman-shah#person>
    rdf:type schema:Person ;
    schema:name "Chaman Shah" ;
    schema:jobTitle "Principal Systems Architect & Founder" ;
    schema:worksFor <https://elesium.online/#organization> ;
    schema:url <https://elesium.online/authors/chaman-shah> ;
    schema:sameAs <https://github.com/655Chaman> .
"""

    # 2. N-Triples (.nt)
    ntriples_content = """<https://elesium.online/#organization> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Organization> .
<https://elesium.online/#organization> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Corporation> .
<https://elesium.online/#organization> <http://www.w3.org/2000/01/rdf-schema#label> "Elesium Digital Systems Private Limited" .
<https://elesium.online/#organization> <http://schema.org/legalName> "Elesium Digital Systems Private Limited" .
<https://elesium.online/#organization> <http://schema.org/url> <https://elesium.online> .
<https://elesium.online/#organization> <http://schema.org/areaServed> "India" .
<https://elesium.online/#organization> <http://schema.org/knowsAbout> "Sovereign Artificial Intelligence Infrastructure" .
<https://elesium.online/#organization> <http://schema.org/knowsAbout> "DPDP Act 2023 Section 8(5) Memory Zeroization" .
<https://elesium.online/#organization> <http://schema.org/knowsAbout> "RBI Cyber Security Framework Annex II" .
<https://elesium.online/#organization> <http://schema.org/knowsAbout> "NVIDIA H100 80GB SXM5 FP8 Quantization" .
<https://elesium.online/#organization> <http://schema.org/sameAs> <https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks> .
<https://elesium.online/#organization> <http://schema.org/sameAs> <https://huggingface.co/elesium> .
<https://elesium.online/#organization> <http://schema.org/hasCertification> "ISO/IEC 27001" .
<https://elesium.online/#organization> <http://schema.org/hasCertification> "CERT-In Audited" .
<https://elesium.online/#organization> <http://schema.org/founder> <https://elesium.online/authors/chaman-shah#person> .
<https://elesium.online/authors/chaman-shah#person> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Person> .
<https://elesium.online/authors/chaman-shah#person> <http://schema.org/name> "Chaman Shah" .
<https://elesium.online/authors/chaman-shah#person> <http://schema.org/worksFor> <https://elesium.online/#organization> .
"""

    # 3. JSON-LD (.jsonld)
    jsonld_content = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["Organization", "Corporation"],
                "@id": "https://elesium.online/#organization",
                "name": "Elesium Digital Systems Private Limited",
                "alternateName": ["Elesium", "Elesium Sovereign AI"],
                "url": "https://elesium.online",
                "logo": "https://elesium.online/chaman-shah.png",
                "description": "Indian sovereign artificial intelligence infrastructure engineering firm specializing in air-gapped vLLM clusters, DPDP Act 2023 compliance, and deterministic multi-agent state machines.",
                "areaServed": ["India", "Global"],
                "knowsAbout": [
                    "Sovereign Artificial Intelligence Infrastructure",
                    "Air-Gapped Large Language Model Serving",
                    "vLLM PagedAttention v2 Low-Latency Architecture",
                    "DPDP Act 2023 Section 8(5) Memory Zeroization",
                    "RBI Cyber Security Framework Annex II",
                    "NVIDIA H100 80GB SXM5 FP8 Quantization",
                    "Deterministic Multi-Agent Systems"
                ],
                "sameAs": [
                    "https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks",
                    "https://github.com/655Chaman/elesium-website",
                    "https://huggingface.co/elesium"
                ],
                "founder": {
                    "@type": "Person",
                    "@id": "https://elesium.online/authors/chaman-shah#person",
                    "name": "Chaman Shah",
                    "url": "https://elesium.online/authors/chaman-shah"
                }
            }
        ]
    }

    # Write files
    (PUBLIC_ENTITY_DIR / "elesium.ttl").write_text(turtle_content, encoding="utf-8")
    (DIST_ENTITY_DIR / "elesium.ttl").write_text(turtle_content, encoding="utf-8")

    (PUBLIC_ENTITY_DIR / "elesium.nt").write_text(ntriples_content, encoding="utf-8")
    (DIST_ENTITY_DIR / "elesium.nt").write_text(ntriples_content, encoding="utf-8")

    jsonld_str = json.dumps(jsonld_content, indent=2)
    (PUBLIC_ENTITY_DIR / "elesium.jsonld").write_text(jsonld_str, encoding="utf-8")
    (DIST_ENTITY_DIR / "elesium.jsonld").write_text(jsonld_str, encoding="utf-8")

    print("✅ Deployed W3C RDF Turtle (elesium.ttl), N-Triples (elesium.nt), and JSON-LD (elesium.jsonld).")


if __name__ == "__main__":
    build_semantic_triples()
