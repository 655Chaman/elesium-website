#!/usr/bin/env python3
"""
Assemble Monolithic Phase 2 Master Executive Bible:
SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md
"""
from pathlib import Path

p2_dir = Path("SEO SOURCE/phase2")
vol13_path = p2_dir / "bible_vol_1_3.md"
vol46_path = p2_dir / "bible_vol_4_6.md"
bible_out_path = p2_dir / "GROWTH_SCALE_EXECUTIVE_BIBLE.md"

vol13_text = vol13_path.read_text(encoding="utf-8")
vol46_text = vol46_path.read_text(encoding="utf-8")

# Clean escaped control characters from LaTeX & python code in vol46
vol46_text = (
    vol46_text.replace("\x0crac", "\\frac")
    .replace("\x07pprox", "\\approx")
    .replace("\x08", "\\b")
)

# Extract slices
vol1_start_idx = vol13_text.find("## Volume I: ")
tech_app_idx = vol13_text.find("## Technical Appendix: Algorithmic Checklists & Execution References")
vol1_3_main = vol13_text[vol1_start_idx:tech_app_idx]
tech_app_text = vol13_text[tech_app_idx:]

# Adjust Volume I title & diagram
vol1_3_main = vol1_3_main.replace(
    "## Volume I: automated SEO & Enterprise Scale",
    "## Volume I: Programmatic SEO & Enterprise Scale"
)
vol1_3_main = vol1_3_main.replace(
    "VOLUME I: automated taxonomy ARCHITECTURE",
    "VOLUME I: PROGRAMMATIC TAXONOMY ARCHITECTURE"
)

# Extract vol 4-6 parts
v4_pos = vol46_text.find("## Volume IV: ")
v5_pos = vol46_text.find("## Volume V: ")
v6_pos = vol46_text.find("## Volume VI: ")
v_doc_pos = vol46_text.find("## Document Governance & Reciprocal Cross-References")

v4_text = vol46_text[v4_pos:v5_pos]
v5_text = vol46_text[v5_pos:v6_pos]
v6_text = vol46_text[v6_pos:v_doc_pos]

# Renumber chapters in v4, v5, v6
v4_text = v4_text.replace("### Chapter 1: The Mathematics of PageRank & Link Equity Flow", "### Chapter 16: The Mathematics of PageRank & Link Equity Flow")
v4_text = v4_text.replace("### Chapter 2: Contextual Internal Link Topologies", "### Chapter 17: Contextual Internal Link Topologies")
v4_text = v4_text.replace("### Chapter 3: Competitive Backlink Profiling & Gap Engineering", "### Chapter 18: Competitive Backlink Profiling & Gap Engineering")
v4_text = v4_text.replace("### Chapter 4: High-Leverage Link Acquisition Protocols", "### Chapter 19: High-Leverage Link Acquisition Protocols")
v4_text = v4_text.replace("### Chapter 5: Algorithmic Defense & Manual Action Recovery", "### Chapter 20: Algorithmic Defense & Manual Action Recovery")

v5_text = v5_text.replace("### Chapter 1: Multi-Regional Opportunity Discovery & Feasibility Framework", "### Chapter 21: Multi-Regional Opportunity Discovery & Feasibility Framework")
v5_text = v5_text.replace("### Chapter 2: Structural Architecture & Geotargeting Governance", "### Chapter 22: Structural Architecture & Geotargeting Governance")
v5_text = v5_text.replace("### Chapter 3: Hreflang Protocol Engineering & Cluster Geometry", "### Chapter 23: Hreflang Protocol Engineering & Cluster Geometry")
v5_text = v5_text.replace("### Chapter 4: Algorithmic Penalty Avoidance & Indexation Safeguards", "### Chapter 24: Algorithmic Penalty Avoidance & Indexation Safeguards")
v5_text = v5_text.replace("### Chapter 5: Quantitative Forecasting & Goal Engineering", "### Chapter 25: Quantitative Forecasting & Goal Engineering")

v6_text = v6_text.replace("### Chapter 1: The Evolution of Neural Search & Algorithmic Retrieval", "### Chapter 26: The Evolution of Neural Search & Algorithmic Retrieval")
v6_text = v6_text.replace("### Chapter 2: Large Language Model Mechanics & Token Economics", "### Chapter 27: Large Language Model Mechanics & Token Economics")
v6_text = v6_text.replace("### Chapter 3: Advanced Structured Prompt Engineering", "### Chapter 28: Advanced Structured Prompt Engineering")
v6_text = v6_text.replace("### Chapter 4: OpenAI Playground API Calibration for Production", "### Chapter 29: OpenAI Playground API Calibration for Production")
v6_text = v6_text.replace("### Chapter 5: Autonomous Programmatic Content Pipelines at Scale", "### Chapter 30: Autonomous Programmatic Content Pipelines at Scale")

# Construct Master Document
header_section = """# THE GROWTH SCALE MASTER EXECUTIVE BIBLE

*The Autonomous Multi-Agent Architectural, Technical & Organic Search Production Specification*

[Phase 2 Master Index](./index.md)

---

## Executive Architectural Synthesis & Curriculum Lineage Matrix

Search engine optimization at enterprise scale is software systems engineering. It is not marketing copywriting. Monolithic content management systems collapse when catalogs scale beyond ten thousand URLs, signaling search algorithms to consolidate indexation metrics and backlink equity onto a single authoritative document path.

Schema design matters. Production environments demand SQL database modeling, context-free grammar compilation, edge computing layers, and strict crawl graph topologies. Engineering teams must treat search indexation as an automated distributed systems challenge rather than an editorial publishing workflow, providing structured data signals that search engine algorithms require to index enterprise catalog pages accurately and efficiently.

This master text synthesizes empirical frameworks from the complete Phase 1 engineering dossiers, spanning 46 technical lessons across Modules 01 through 09 (228,004 words of verified transcript recall). Primary faculty lineage derives from:
- **Nitin Manchanda** (Founder Botpresso, former Head of SEO at Trivago, Omio, and Flipkart) — Scale architectures, programmatic page generation, and crawl budget modeling.
- **Kaushal Thakkar** (Founder Infidigit, former Search Engineering Lead) — Technical crawl infrastructure, Screaming Frog industrial spider audits, PageRank mathematical distribution, and manual action recovery protocols.
- **Pushkar Shah** (Strategic SEO Lead) — Multi-regional market entry, international hreflang cluster geometry, and enterprise migration recovery.
- **Babu Chakraborty** (Head of Digital Marketing & Analytics) — Neural search evolution, dense vector retrieval, and large language model information gain moats.
- **Vaibhav Sisinty** (Growth & Automation Architect) — Structured prompt engineering, OpenAI Playground production calibration, and autonomous content generation pipelines.
- **Sudeep Pagedar** & **Pepper Content Editorial Leadership** — Search intent deconstruction and semantic keyword clustering.
- **Trisha Vaidya** (COO Dr. Vaidya's) & **Piyush Shah** (Head of SEO Dukaan) — Direct-to-consumer search funnels and high-velocity catalog indexing.
- **Ani** (GrowthSchool) & **Anirudh** — API-driven spreadsheet automation, Browse.ai extraction, and programmatic keyword clustering.

Latency destroys crawling. The following six master volumes establish institutional engineering standards for automated taxonomy deployment, crawler budget allocation, faceted navigation parameter containment, hyperlink equity distribution, multi-lingual cluster geometry, and autonomous artificial intelligence publishing. Every principle is grounded in production case studies: Rome2Rio's acquisition via ninety million catalog documents, Infidigit's parameter containment pruning thirty million URLs to one million, Mochi Shoes' restructuring yielding a 464 percent organic session increase, and Zee5's multi-lingual deployment driving 303 percent international organic traffic expansion.

---

## Master Table of Contents

- [Executive Architectural Synthesis & Curriculum Lineage Matrix](#executive-architectural-synthesis--curriculum-lineage-matrix)
- [Volume I: Programmatic SEO & Enterprise Scale](#volume-i-programmatic-seo--enterprise-scale)
  - [Chapter 1: The Economics of Enterprise Search Architecture](#chapter-1-the-economics-of-enterprise-search-architecture)
  - [Chapter 2: Database Schema Design & Taxonomy Engineering](#chapter-2-database-schema-design--taxonomy-engineering)
  - [Chapter 3: Advanced Natural Language Generation & RosaeNLG Templating](#chapter-3-advanced-natural-language-generation--rosae-nlg-templating)
  - [Chapter 4: Dynamic Internal Linking Topologies](#chapter-4-dynamic-internal-linking-topologies)
  - [Chapter 5: Edge SEO & Serverless CDN Deployment](#chapter-5-edge-seo--serverless-cdn-deployment)
- [Volume II: Technical SEO Core & Crawl Infrastructure](#volume-ii-technical-seo-core--crawl-infrastructure)
  - [Chapter 6: Crawl Budget Mechanics & Server Infrastructure](#chapter-6-crawl-budget-mechanics--server-infrastructure)
  - [Chapter 7: Industrial Screaming Frog Audit Infrastructure](#chapter-7-industrial-screaming-frog-audit-infrastructure)
  - [Chapter 8: Core Web Vitals & Rendering Latency Remediation](#chapter-8-core-web-vitals--rendering-latency-remediation)
  - [Chapter 9: Canonicalization & URL Normalization](#chapter-9-canonicalization--url-normalization)
  - [Chapter 10: Two-Wave JavaScript Rendering Governance](#chapter-10-two-wave-javascript-rendering-governance)
- [Volume III: High-Conversion E-Commerce & Site Architecture](#volume-iii-high-conversion-e-commerce--site-architecture)
  - [Chapter 11: Enterprise Catalog Hierarchy & URL Taxonomy](#chapter-11-enterprise-catalog-hierarchy--url-taxonomy)
  - [Chapter 12: Faceted Navigation Governance & Combinatorial Containment](#chapter-12-faceted-navigation-governance--combinatorial-containment)
  - [Chapter 13: Mobile-First Catalog Parity](#chapter-13-mobile-first-catalog-parity)
  - [Chapter 14: Enterprise Pagination Architecture](#chapter-14-enterprise-pagination-architecture)
  - [Chapter 15: The Zero-Loss Website Migration Playbook (Mochi Shoes & Cult.fit)](#chapter-15-the-zero-loss-website-migration-playbook-mochi-shoes--cultfit)
- [Volume IV: Off-Page Link Equity & Algorithmic Defense](#volume-iv-off-page-link-equity--algorithmic-defense)
  - [Chapter 16: The Mathematics of PageRank & Link Equity Flow](#chapter-16-the-mathematics-of-pagerank--link-equity-flow)
  - [Chapter 17: Contextual Internal Link Topologies](#chapter-17-contextual-internal-link-topologies)
  - [Chapter 18: Competitive Backlink Profiling & Gap Engineering](#chapter-18-competitive-backlink-profiling--gap-engineering)
  - [Chapter 19: High-Leverage Link Acquisition Protocols](#chapter-19-high-leverage-link-acquisition-protocols)
  - [Chapter 20: Algorithmic Defense & Manual Action Recovery](#chapter-20-algorithmic-defense--manual-action-recovery)
- [Volume V: International SEO & Multi-Region Expansion](#volume-v-international-seo--multi-region-expansion)
  - [Chapter 21: Multi-Regional Opportunity Discovery & Feasibility Framework](#chapter-21-multi-regional-opportunity-discovery--feasibility-framework)
  - [Chapter 22: Structural Architecture & Geotargeting Governance](#chapter-22-structural-architecture--geotargeting-governance)
  - [Chapter 23: Hreflang Protocol Engineering & Cluster Geometry](#chapter-23-hreflang-protocol-engineering--cluster-geometry)
  - [Chapter 24: Algorithmic Penalty Avoidance & Indexation Safeguards](#chapter-24-algorithmic-penalty-avoidance--indexation-safeguards)
  - [Chapter 25: Quantitative Forecasting & Goal Engineering](#chapter-25-quantitative-forecasting--goal-engineering)
- [Volume VI: Generative AI & Autonomous Content Automation](#volume-vi-generative-ai--autonomous-content-automation)
  - [Chapter 26: The Evolution of Neural Search & Algorithmic Retrieval](#chapter-26-the-evolution-of-neural-search--algorithmic-retrieval)
  - [Chapter 27: Large Language Model Mechanics & Token Economics](#chapter-27-large-language-model-mechanics--token-economics)
  - [Chapter 28: Advanced Structured Prompt Engineering](#chapter-28-advanced-structured-prompt-engineering)
  - [Chapter 29: OpenAI Playground API Calibration for Production](#chapter-29-openai-playground-api-calibration-for-production)
  - [Chapter 30: Autonomous Programmatic Content Pipelines at Scale](#chapter-30-autonomous-programmatic-content-pipelines-at-scale)
- [Technical Appendix: Algorithmic Checklists & Execution References](#technical-appendix-algorithmic-checklists--execution-references)
- [Document Governance & Reciprocal Cross-References](#document-governance--reciprocal-cross-references)

---
"""

doc_governance_section = """---

## Document Governance & Reciprocal Cross-References

This monolithic technical volume constitutes the authoritative foundation of the Phase 2 executive knowledge architecture. All frameworks, formulas, database schemas, and code implementations remain strictly bound to verified Phase 1 verbatim transcripts.

- [Phase 2 Master Index](./index.md)
- [Proceed to Runbook SOP 01: Programmatic Taxonomy Deployment](./runbooks/SOP_01_PROGRAMMATIC_TAXONOMY_DEPLOYMENT.md)
- [Proceed to Runbook SOP 02: Enterprise Screaming Frog Audit Harness](./runbooks/SOP_02_ENTERPRISE_SCREAMING_FROG_AUDIT_HARNESS.md)
- [Proceed to Runbook SOP 03: Faceted Navigation Canonicalization](./runbooks/SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md)
- [Proceed to Runbook SOP 04: Zero-Drop E-Commerce Migration Protocol](./runbooks/SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md)
- [Proceed to Runbook SOP 05: Toxic Backlink Triage & Disavowal](./runbooks/SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md)
- [Proceed to Runbook SOP 06: Autonomous GenAI Content Pipeline](./runbooks/SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md)
- [Production Swipe File: Screaming Frog Extractions](./swipe_file/screaming_frog_extractions.md)
- [Production Swipe File: Google Sheets Formulas & RosaeNLG](./swipe_file/google_sheets_formulas_and_rosae_nlg.md)
- [Production Swipe File: Content Prompts & QA Rubrics](./swipe_file/content_prompts_and_qa_rubrics.md)
- [Production Swipe File: Google Disavow Template](./swipe_file/GOOGLE_DISAVOW_TEMPLATE.txt)
"""

# Combine all parts
full_bible = (
    header_section.strip() + "\n\n" +
    vol1_3_main.strip() + "\n\n---\n\n" +
    v4_text.strip() + "\n\n---\n\n" +
    v5_text.strip() + "\n\n---\n\n" +
    v6_text.strip() + "\n\n---\n\n" +
    tech_app_text.strip() + "\n\n" +
    doc_governance_section.strip() + "\n"
)

bible_out_path.write_text(full_bible, encoding="utf-8")
print(f"Generated {bible_out_path} ({len(full_bible.split())} words, {len(full_bible)} chars)")
