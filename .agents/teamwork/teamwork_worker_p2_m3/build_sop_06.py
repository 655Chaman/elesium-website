#!/usr/bin/env python3
"""
build_sop_06.py
Drafts and validates SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md.
"""

import sys
import os
import re
from pathlib import Path

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from generate_bible import check_slop

SOP_06_TEXT = """# SOP 06: Autonomous GenAI Content Pipeline Protocol

[Return to Phase 2 Master Index](../index.md)

---

## 1. Objective & Operational Scope

This standard operating procedure defines the end-to-end architecture for operating an autonomous generative content pipeline. The protocol governs automated keyword harvesting, SERP scraping, spreadsheet formula orchestration, parameterized large language model drafting, and automated quality assurance validation.

Scale demands automation. Uncontrolled generative publishing triggers search engine spam filters and automated search demotion. Automated content must incorporate empirical Information Gain, firsthand verification artifacts, and strict schema markup.

This runbook establishes an engineering standard for scaled content deployment. Engineering and editorial teams deploy programmatic quality gates to ensure that every generated page satisfies search engine quality standards prior to publication. Quality must not slip.

---

## 2. Phase 1 Lineage & Grounding Matrix

The procedures codified in this runbook originate directly from the verified Phase 1 verbatim course transcripts:

- **Module 09 (Lesson 9.1 - Evolution of AI in SEO)**: Babu Chakraborty documented the transition from lexical indexing to RankBrain vector spaces, Information Gain models, and empirical E-E-A-T moats.

- **Module 09 (Lessons 9.4 & 9.5 - Prompting & OpenAI Playground)**: Vaibhav Sisinty formulated the 4-part Magic Prompt Engine, prompt building blocks, and OpenAI API parameter calibration (temperature, penalties, stop sequences).

- **Module 09 (Lesson 9.6 - Keyword Research via AI)**: Vaibhav Sisinty and Anirudh established automated keyword seed expansion, clustering hierarchies, and AI article generation.

- **Module 01 (Lesson 1.8 - Generative AI for Sheets)**: Ani detailed Google Sheets automation using Numerous.ai functions (`=AI()`, `=INFER()`, `=WRITE()`, `=CLASSIFY()`, `=SENTIMENT()`) and Browse.ai scraping.

```
+-----------------------------------+-------------------------------------------------------------+
| Framework Element                 | Verbatim Phase 1 Dossier Reference                          |
+-----------------------------------+-------------------------------------------------------------+
| Neural Search & Information Gain  | Module 09 (module_09.md: Lines 23-62 - Babu Chakraborty)    |
| Magic Prompt Engine Architecture  | Module 09 (module_09.md: Lines 139-178 - Vaibhav Sisinty)   |
| OpenAI API Parameter Calibration  | Module 09 (module_09.md: Lines 179-218 - Vaibhav Sisinty)   |
| Google Sheets Numerous.ai Pipeline| Module 01 (module_01.md: Lines 407-495 - Ani)               |
+-----------------------------------+-------------------------------------------------------------+
```

---

## 3. Technical Prerequisites & Tooling Architecture

Operating the autonomous pipeline requires integrating specialized web services, cloud APIs, and spreadsheet execution environments:

1. **OpenAI API Platform**: Active API keys provisioned with access to GPT-4 and GPT-3.5-Turbo model endpoints.

2. **Google Sheets Infrastructure**: Cloud spreadsheets configured with the Numerous.ai add-on or custom Google Apps Script connectors.

3. **Keyword Volume & SERP Data APIs**: Programmatic subscriptions to Keywords Everywhere API, WordStream API, or DataForSEO SERP live endpoints.

4. **Automated Web Extraction Services**: Browse.ai robot tasks configured to scrape competitor heading structures and FAQ schema blocks.

```
PIPELINE DATA FLOW TOPOLOGY:
[Seed Keywords] ---> [Keywords Everywhere API] ---> [Volume Filter >= 500]
                            |
[Competitor SERPs] ---> [Browse.ai Robot] ---------> [Heading Tree Extraction]
                            |
[Google Sheets DB] <--- [Numerous.ai Formulas] <---- [Structured Prompt Engine]
                            |
[OpenAI API Gateway] -> [Temp 0.0 / 0.75 Splits] --> [Automated Quality Gates]
                            |
[Static Site Generator] <--------------------------- [Approved Clean Markdown]
```

All microservices communicate through structured JSON payloads. This decoupled topology isolates data enrichment from text synthesis.

The following Python script calculates batch token expenditure across keyword sets before launching generation jobs:

```python
from typing import Dict

def estimate_batch_cost(keyword_count: int, avg_prompt_tokens: int = 450, avg_completion_tokens: int = 1200) -> Dict[str, float]:
    # Standard API pricing per thousand tokens
    gpt4_prompt_rate = 0.03 / 1000.0
    gpt4_completion_rate = 0.06 / 1000.0
    
    total_prompt_cost = keyword_count * avg_prompt_tokens * gpt4_prompt_rate
    total_completion_cost = keyword_count * avg_completion_tokens * gpt4_completion_rate
    net_cost = total_prompt_cost + total_completion_cost
    
    return {
        "keyword_count": keyword_count,
        "total_prompt_tokens": keyword_count * avg_prompt_tokens,
        "total_completion_tokens": keyword_count * avg_completion_tokens,
        "estimated_total_cost_usd": round(net_cost, 2)
    }
```

Budgets must be verified in advance. Run cost models weekly. Never exceed approved token ceilings.

---

## 4. Step-by-Step Execution Protocol (The 8-Phase Content Lifecycle)

```
[Phase 1: Seed Keyword Harvesting & Expansion]
           |
[Phase 2: Volume & Difficulty Metric Enrichment]
           |
[Phase 3: Search Intent Classification & Template Routing]
           |
[Phase 4: Topic Silo & Clustering Hierarchy]
           |
[Phase 5: Automated Outlining & Information Gain Check]
           |
[Phase 6: Parameterized Drafting & Zero-Variance Splits]
           |
[Phase 7: Scripted Quality Assurance & Slop Scanning]
           |
[Phase 8: Structured Schema & Production Publishing]
```

### Phase 1: Seed Keyword Harvesting & Expansion
The pipeline initiates by expanding core product category concepts into comprehensive long-tail keyword sets. Human operators provide two to five root seed terms.

The seed generation script dispatches structured expansion requests to the language model endpoint:

```python
  # Seed Expansion Execution Snippet
import json
from openai import OpenAI

client = OpenAI()

def expand_seed_keywords(root_niche: str) -> list:
    prompt = f"Identify 25 specific search query sub-topics for: {root_niche}. Output a JSON array of strings."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    data = json.loads(response.choices[0].message.content)
    return data.get("keywords", [])
```

The expansion engine isolates user pain points, comparison queries, and commercial purchase queries. This automated step expands 5 seed terms into 250 distinct keyword candidates. Speed matters greatly.

### Phase 2: Volume & Difficulty Metric Enrichment
Raw keyword generation produces numerous phrases that lack actual search audience volume. The pipeline enriches candidate phrases with verified search engine volume metrics.

Candidate queries stream into the Keywords Everywhere API or Google Keyword Planner endpoints. Filter out queries possessing monthly search volume below 500 searches.

Flag queries exhibiting high paid search cost-per-click values ($CPC \ge \$2.50$) as high-intent commercial targets. Calculate Keyword Difficulty scores to isolate accessible ranking opportunities.

All enriched records populate the central execution spreadsheet. Rows failing the 500-volume threshold move to an auxiliary research archive. Data disciplines protect engineering resources.

Speed drives indexation. Crawlers hate waste.

### Phase 3: Search Intent Classification & Template Routing
Search engines serve distinct document layouts based on user search intent. Mapping a transactional query to an informational blog post destroys search ranking potential. Intent alignment is essential.

In Module 01, Ani demonstrated intent classification inside Google Sheets using the Numerous.ai `=CLASSIFY()` function. The system assigns queries to target document templates:

```excel
=CLASSIFY(A2, "Informational Blog, Commercial Comparison, Transactional Product Category")
```

The returned intent value routes the row to designated template generators:
- **Informational Intent**: Routes to long-form guides featuring detailed troubleshooting steps and FAQ sections.
- **Commercial Intent**: Routes to head-to-head comparison matrices and feature specification tables.
- **Transactional Intent**: Routes to product category landing pages with filtered catalog grids.

Matching template format to user expectation ensures strong engagement signals. Form follows intent.

### Phase 4: Topic Silo & Clustering Hierarchy
Publishing separate pages for minor keyword synonyms causes keyword cannibalization. Multiple pages on the same domain compete against each other, depressing overall authority. Cannibalization degrades rankings.

The pipeline clusters related long-tail variations under unified pillar hubs. Vaibhav Sisinty demonstrated clustering algorithms in Module 09 using semantic similarity embeddings.

Queries sharing eighty percent or higher SERP competitor overlap consolidate into a single parent article URL:

```
[Parent Pillar Hub: /running-shoes/trail-running-guide/]
  |
  |-- Sub-Query Variation: "best trail running shoes women" (H2 Section)
  |-- Sub-Query Variation: "waterproof trail running shoes" (H3 Section)
  |-- Sub-Query Variation: "trail shoes rock plate grip"    (H3 Section)
```

This consolidation topology creates authoritative, comprehensive pages capable of capturing dozens of long-tail terms simultaneously. Equity consolidates cleanly. Pages rank faster.

### Phase 5: Automated Outlining & Information Gain Check
Generating generic copy from scratch produces low Information Gain scores. The pipeline inspects top-ranking competitor assets to engineer superior outlines.

Browse.ai robot tasks extract heading tags (`H1`, `H2`, `H3`) and FAQ blocks from top SERP competitors. Aggregate common competitor topical sub-themes into a master outline draft.

Inject mandatory proprietary sections: original benchmark tables, testing methodology notes, and code snippets. Mandate firsthand data points: internal transaction metrics, survey statistics, or engineering field notes.

```
=================================================================================
OUTLINE GENERATION PROMPT WITH MANDATORY INFORMATION GAIN INJECTION
=================================================================================
SYSTEM:
You are an enterprise technical content architect. You design comprehensive
article outlines that outrank existing competitor assets by providing superior
depth, original testing data, and explicit step-by-step procedures.

USER TASK:
Design an outline for the topic: "Database Sharding Patterns for High-Throughput APIs".
Input Competitor Headings:
- What is database sharding?
- Horizontal vs Vertical Partitioning
- Common sharding keys

MANDATORY INSTRUCTIONS:
1. Include all competitor themes to satisfy baseline topical coverage.
2. Inject Section: "Empirical Latency Benchmarks: Hash vs Range Sharding at 100k RPS".
3. Inject Section: "Production Failure Modes: Re-sharding Live Citus Clusters".
4. Prohibit all introductory fluff, conversational filler, and rhetorical questions.
=================================================================================
```

The outlined structure guarantees that the generated page covers essential industry context while delivering unique value that search engines reward. Original data anchors the page.

### Phase 6: Parameterized Drafting & Zero-Variance Splits
The drafting engine executes text synthesis through decoupled API configurations. Separating structural metadata from creative body prose prevents syntax formatting failures.

The API gateway applies strict parameter splits established by Vaibhav Sisinty in Module 09:

```python
  # Parameterized Dual-Stage Drafting Router
def draft_content_asset(outline_data: dict) -> dict:
    # Stage 1: Zero-variance mode for Title, Meta, and Schema (Temperature = 0.0)
    meta_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a metadata engine. Output valid JSON only."},
            {"role": "user", "content": f"Generate Title under 58 chars and Meta under 150 chars for: {outline_data['topic']}"}
        ],
        temperature=0.0
    )
    
    # Stage 2: Creative sampling for narrative body sections (Temperature = 0.75)
    body_response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a technical search writer. Prohibit promotional fluff and passive voice."},
            {"role": "user", "content": f"Draft technical guide based on outline: {outline_data['sections']}"}
        ],
        temperature=0.75,
        frequency_penalty=0.70,
        presence_penalty=0.50,
        stop=["\n\n---", "###"]
    )
    return {"metadata": meta_response, "body": body_response}
```

Setting `temperature=0.0` for metadata guarantees adherence to character limits. Setting `temperature=0.75` for body sections provides natural linguistic variation across paragraphs. Exact parameters prevent runaway tokens.

### Phase 7: Scripted Quality Assurance & Slop Scanning
Every draft must clear automated quality gates before advancing to publication. Scripted test runners evaluate drafts against lexical and mathematical criteria. Output must be clean.

The automated verification suite executes three sequential checks:

- **Lexical Slop Audit**: Scans text against the master 105+ banned words dictionary. Any detection of prohibited terms immediately triggers regeneration.

- **Cadence Burstiness Verification**: Calculates sentence length standard deviation. Drafts must achieve burstiness sigma of 8.0 or higher to ensure human rhythm.

- **Adjective Density Limit**: Counts adjectival suffix frequencies. Total adjective density must stay at or below 7.0 percent of total words.

```python
  # Standalone Quality Gate Runner
import re
import math

def enforce_quality_gate(document_text: str, banned_lexicon: list) -> bool:
    # Check 1: Slop word presence
    for word in banned_lexicon:
        if re.search(r"\b" + re.escape(word) + r"\b", document_text, re.IGNORECASE):
            return False
            
    # Check 2: Burstiness calculation
    sentences = [s.strip() for s in re.split(r"[.!?]+", document_text) if len(s.strip().split()) >= 3]
    if not sentences:
        return False
    lengths = [len(s.split()) for s in sentences]
    mean = sum(lengths) / len(lengths)
    variance = sum((l - mean) ** 2 for l in lengths) / len(lengths)
    sigma = math.sqrt(variance)
    
    # Check 3: Adjective frequency
    words = re.findall(r"\b[A-Za-z]+\b", document_text)
    adj_suffixes = ("able", "ible", "al", "ful", "ic", "ive", "less", "ous", "ish")
    adj_count = sum(1 for w in words if w.lower().endswith(adj_suffixes))
    adj_density = (adj_count / len(words)) * 100.0
    
    return (sigma >= 8.0) and (adj_density <= 7.0)
```

Drafts clearing all checks receive an automated digital signature in the pipeline database. Rigorous verification guarantees publication integrity. When generative models reduce the marginal cost of producing web copy to zero, search engine crawlers protect index quality by aggressively de-indexing redundant documents that duplicate existing web content without original data.

### Phase 8: Structured Schema & Production Publishing
The final stage enriches approved markdown drafts with structured data before static site generation. Structured data clarifies entity relationships for search engine indexers. Schema validates authority.

The schema compiler generates schema.org compliant JSON-LD blocks at `temperature=0.0`:
- **Article Schema**: Injects author entity details, publication timestamps, and publisher logos.
- **FAQPage Schema**: Formats question-and-answer pairs extracted from article sub-sections.
- **BreadcrumbList Schema**: Declares taxonomy click depth positions.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How often should technical backlink profiles be audited?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Enterprise properties should conduct weekly data aggregations and quarterly deep infrastructure reviews to identify toxic link networks promptly."
    }
  }]
}
</script>
```

Approved files receive validated frontmatter headers before committing to git repositories:

```markdown
---
title: "Database Sharding Patterns for High-Throughput APIs"
slug: "database-sharding-patterns"
canonical: "https://example.com/engineering/database-sharding-patterns"
published_at: "2026-11-08T12:00:00Z"
author: "Engineering Architecture Group"
template: "technical_deep_dive"
---
```

The pipeline writes approved markdown files directly to the static site repository, committing updates through continuous integration workflows. Crawl budget is conserved.

---

## 5. Verification Checklist & Quality Assurance Gates

Pipeline operations teams must verify each operational checkpoint across every publication batch:

```
+-----------------------------------+-------------------------------------------------------------+
| Verification Checkpoint           | Acceptance Criteria                                         |
+-----------------------------------+-------------------------------------------------------------+
| Volume & Intent Enrichment        | Monthly volume >= 500; intent classified via formula.       |
| Information Gain Outline          | Unique benchmarks and case study data points injected.      |
| Parameter Calibration Check       | Temp 0.0 for metadata/schema; Temp 0.75 for body prose.    |
| Zero-Slop Dictionary Scan         | 0 hits detected across 105+ prohibited AI phrases.          |
| Human Cadence Standards           | Burstiness sigma >= 8.0; adjective density <= 7.0%.         |
| Structured Data Validation        | JSON-LD passes Google Rich Results test with zero errors.   |
+-----------------------------------+-------------------------------------------------------------+
```

---

## 6. Document Governance & Reciprocal Cross-References

This runbook forms an authoritative operational guide within the Phase 2 execution suite. All protocols adhere to verified Phase 1 search curriculum standards.

- [Return to Phase 2 Master Index](../index.md)
- [Consult Bible Volume VI: Generative AI & Autonomous Content Automation](../bible_vol_4_6.md)
- [Consult Runbook SOP 05: Toxic Backlink Triage & Disavowal](./SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md)
"""

words = len(SOP_06_TEXT.split())
print(f"SOP 06 Word count: {words}")
slop = check_slop(SOP_06_TEXT)
print(f"SOP 06 Slop hits: {len(slop)}")
for w, idx in slop:
    print(f"  Banned: {w} at {idx}")

if slop:
    print("Aborting SOP 06 write due to slop hits!")
    sys.exit(1)

out_file = Path("/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/phase2/runbooks/SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md")
out_file.parent.mkdir(parents=True, exist_ok=True)
out_file.write_text(SOP_06_TEXT, encoding="utf-8")
print(f"Successfully wrote {out_file} ({words} words).")
