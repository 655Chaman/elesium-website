#!/usr/bin/env python3
"""
assemble_bible.py
Combines Volume IV, Volume V, and Volume VI into SEO SOURCE/phase2/bible_vol_4_6.md.
"""

import sys
import os
import re
from pathlib import Path

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from volume_4 import VOL_4_TEXT
from volume_5 import VOL_5_TEXT
from volume_6 import VOL_6_TEXT
from generate_bible import check_slop

HEADER = """# Growth Scale Executive Bible: Volumes IV, V, and VI

[Return to Phase 2 Master Index](./index.md)

---

## Executive Overview & Authoritative Curriculum Lineage

This executive document synthesizes Volumes IV, V, and VI of the *Growth Scale Executive Bible*. The frameworks herein distill the complete verbatim course curriculum spanning 46 enterprise lessons across Modules 06, 07, 08, 09, and 01 of the Phase 1 master dossiers.

### Authoritative Faculty & Curriculum Lineage Ledger
- **Volume IV: Off-Page Link Equity & Algorithmic Defense**  
  *Faculty Lead*: **Kaushal Thakkar** (Founder, Infidigit; Former Search Engineering Lead).  
  *Contributing Faculty*: **Pushkar Shah** (Enterprise Migrations & Penalty Defense).  
  *Phase 1 Lineage*: Grounded in `SEO SOURCE/phase1/module_06.md` (Lessons 6.1 through 6.5) and `SEO SOURCE/phase1/module_08.md` (Lesson 8.2).
- **Volume V: International SEO & Multi-Region Expansion**  
  *Faculty Lead*: **Pushkar Shah** (Strategic SEO Lead; Zee5 Multi-Lingual Architecture).  
  *Phase 1 Lineage*: Grounded in `SEO SOURCE/phase1/module_07.md` (Lessons 7.1 through 7.3) and `SEO SOURCE/phase1/module_08.md`.
- **Volume VI: Generative AI & Autonomous Content Automation**  
  *Faculty Lead*: **Babu Chakraborty** (Evolution of Neural Search & Vector Retrieval), **Vaibhav Sisinty** (Prompt Engineering & OpenAI API Execution), **Anirudh** (Programmatic Keyword Clustering).  
  *Contributing Faculty*: **Ani** (Google Sheets AI Integration & Browse.ai Scraping) and **Nitin Manchanda** (Scale Architectures).  
  *Phase 1 Lineage*: Grounded in `SEO SOURCE/phase1/module_09.md` (Lessons 9.1 through 9.6) and `SEO SOURCE/phase1/module_01.md` (Lesson 1.8).

---

## Table of Contents

- [Volume IV: Off-Page Link Equity & Algorithmic Defense](#volume-iv-off-page-link-equity--algorithmic-defense)
  - [Chapter 1: The Mathematics of PageRank & Link Equity Flow](#chapter-1-the-mathematics-of-pagerank--link-equity-flow)
  - [Chapter 2: Contextual Internal Link Topologies](#chapter-2-contextual-internal-link-topologies)
  - [Chapter 3: Competitive Backlink Profiling & Gap Engineering](#chapter-3-competitive-backlink-profiling--gap-engineering)
  - [Chapter 4: High-Leverage Link Acquisition Protocols](#chapter-4-high-leverage-link-acquisition-protocols)
  - [Chapter 5: Algorithmic Defense & Manual Action Recovery](#chapter-5-algorithmic-defense--manual-action-recovery)
- [Volume V: International SEO & Multi-Region Expansion](#volume-v-international-seo--multi-region-expansion)
  - [Chapter 1: Multi-Regional Opportunity Discovery & Feasibility Framework](#chapter-1-multi-regional-opportunity-discovery--feasibility-framework)
  - [Chapter 2: Structural Architecture & Geotargeting Governance](#chapter-2-structural-architecture--geotargeting-governance)
  - [Chapter 3: Hreflang Protocol Engineering & Cluster Geometry](#chapter-3-hreflang-protocol-engineering--cluster-geometry)
  - [Chapter 4: Algorithmic Penalty Avoidance & Indexation Safeguards](#chapter-4-algorithmic-penalty-avoidance--indexation-safeguards)
  - [Chapter 5: Quantitative Forecasting & Goal Engineering](#chapter-5-quantitative-forecasting--goal-engineering)
- [Volume VI: Generative AI & Autonomous Content Automation](#volume-vi-generative-ai--autonomous-content-automation)
  - [Chapter 1: The Evolution of Neural Search & Algorithmic Retrieval](#chapter-1-the-evolution-of-neural-search--algorithmic-retrieval)
  - [Chapter 2: Large Language Model Mechanics & Token Economics](#chapter-2-large-language-model-mechanics--token-economics)
  - [Chapter 3: Advanced Structured Prompt Engineering](#chapter-3-advanced-structured-prompt-engineering)
  - [Chapter 4: OpenAI Playground API Calibration for Production](#chapter-4-openai-playground-api-calibration-for-production)
  - [Chapter 5: Autonomous Programmatic Content Pipelines at Scale](#chapter-5-autonomous-programmatic-content-pipelines-at-scale)

---

"""

FOOTER = """
---

## Document Governance & Reciprocal Cross-References

This technical volume constitutes an immutable core of the Phase 2 executive knowledge architecture. All frameworks, formulas, and code implementations remain strictly bound to verified Phase 1 verbatim transcripts.

- [Return to Phase 2 Master Index](./index.md)
- [Proceed to Runbook SOP 05: Toxic Backlink Triage & Disavowal](./runbooks/SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md)
- [Proceed to Runbook SOP 06: Autonomous GenAI Content Pipeline](./runbooks/SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md)
"""

full_doc = HEADER + VOL_4_TEXT + "\n\n---\n\n" + VOL_5_TEXT + "\n\n---\n\n" + VOL_6_TEXT + FOOTER

# Run pre-flight checks
words = len(full_doc.split())
print(f"Total Assembled Word Count: {words}")

slop_hits = check_slop(full_doc)
print(f"Total Slop Hits in Full Doc: {len(slop_hits)}")
for w, idx in slop_hits:
    print(f"  SLOP HIT: '{w}' at char {idx}")

if slop_hits:
    print("ABORTING WRITE DUE TO SLOP HITS!")
    sys.exit(1)

out_path = Path("/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/phase2/bible_vol_4_6.md")
out_path.write_text(full_doc, encoding="utf-8")
print(f"Successfully wrote {out_path} ({words} words).")
