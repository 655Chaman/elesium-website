#!/usr/bin/env python3
"""
gsc_query_expander.py

Automates the Google Search Console (GSC) Pattern Detection & Systems Thinking
framework from SEO Rockstars 2026 Day 2 (Talk 6).

Core Capabilities:
1. Regex Persona & Intent Filter: Matches high-converting conversational queries
   (e.g., 'i am', 'you are', 'we need', 'looking for', 'cost of', 'how to automate').
2. Striking-Distance Query Extractor: Surfaces queries in Positions 4.0 – 20.0 with
   high impressions and low CTR for immediate page optimization.
3. Automated Queue Enrichment: Automatically injects high-opportunity GSC striking
   queries directly into automation/keywords_queue.json for autoblogger execution.
"""

import os
import json
import re
from pathlib import Path

BASE_DIR = Path(os.path.dirname(os.path.abspath(__file__)))
KEYWORDS_QUEUE_PATH = BASE_DIR / "keywords_queue.json"
GSC_DATA_PATH = BASE_DIR / "gsc_sample_data.json"

# Day 2 Talk 6 Canonical Regex Patterns
HIGH_INTENT_REGEX = re.compile(
    r"^(i am|you are|we need|looking for|cost of|pricing for|how to automate|best ai agency|ai automation agency|hire ai)",
    re.IGNORECASE
)

LOCALITY_REGEX = re.compile(
    r"(bangalore|bengaluru|mumbai|delhi|gurgaon|hyderabad|pune|india)",
    re.IGNORECASE
)

DEFAULT_GSC_BENCHMARK_DATA = [
    {
        "query": "cost of enterprise ai automation in india",
        "clicks": 14,
        "impressions": 1850,
        "ctr": 0.0075,
        "position": 7.4,
        "landing_page": "/ai-automation-agency-india"
    },
    {
        "query": "we need custom ai agent development bangalore",
        "clicks": 6,
        "impressions": 620,
        "ctr": 0.0096,
        "position": 5.2,
        "landing_page": "/ai-automation-agency-india"
    },
    {
        "query": "langgraph vs autogen enterprise automation india",
        "clicks": 8,
        "impressions": 940,
        "ctr": 0.0085,
        "position": 8.1,
        "landing_page": "/signals/n8n-vs-langchain-vs-custom-agents-india-2026"
    },
    {
        "query": "best ai automation agency in india for manufacturing",
        "clicks": 4,
        "impressions": 780,
        "ctr": 0.0051,
        "position": 11.3,
        "landing_page": "/markets"
    },
    {
        "query": "how to automate tally erp with llm agents",
        "clicks": 2,
        "impressions": 1120,
        "ctr": 0.0017,
        "position": 14.6,
        "landing_page": "/signals/industrial-b2b-marketplace-trends-how-signal-drive-ii-69"
    },
    {
        "query": "private vpc ai deployment india dpdp compliant",
        "clicks": 5,
        "impressions": 540,
        "ctr": 0.0092,
        "position": 6.8,
        "landing_page": "/how-we-work"
    }
]

def load_gsc_data(custom_path: str = None) -> list:
    """Loads real GSC export if provided, otherwise loads or creates local benchmark data."""
    path = Path(custom_path) if custom_path else GSC_DATA_PATH
    if path.exists():
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {path}: {e}. Falling back to benchmark dataset.")
    
    # Save default benchmark data for inspection
    with open(GSC_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(DEFAULT_GSC_BENCHMARK_DATA, f, indent=2)
    return DEFAULT_GSC_BENCHMARK_DATA

def analyze_gsc_patterns(gsc_records: list) -> dict:
    """Classifies GSC queries into actionable algorithmic triage tiers."""
    high_intent_persona = []
    striking_distance = []
    quick_win_h2_candidates = []
    dedicated_post_candidates = []

    for item in gsc_records:
        query = item.get("query", "")
        pos = item.get("position", 100.0)
        impr = item.get("impressions", 0)
        ctr = item.get("ctr", 0.0)
        page = item.get("landing_page", "/")

        is_high_intent = bool(HIGH_INTENT_REGEX.search(query))
        is_local = bool(LOCALITY_REGEX.search(query))

        analysis = {
            "query": query,
            "position": pos,
            "impressions": impr,
            "ctr": f"{ctr*100:.2f}%",
            "landing_page": page,
            "high_intent": is_high_intent,
            "local_anchor": is_local
        }

        if is_high_intent:
            high_intent_persona.append(analysis)

        # Striking distance: Position between 4.0 and 20.0 with notable impressions
        if 4.0 <= pos <= 20.0 and impr >= 100:
            striking_distance.append(analysis)

            # Actionable triage from Day 2 Talk 6:
            if pos <= 10.0:
                quick_win_h2_candidates.append({
                    "query": query,
                    "target_page": page,
                    "recommended_action": f"Inject '{query}' as explicit H2 subheading with a 45-word bold Answer Capsule."
                })
            else:
                dedicated_post_candidates.append({
                    "query": query,
                    "target_page": page,
                    "recommended_action": f"Create dedicated 2,000-word cluster post or deep FAQ card targeting '{query}'."
                })

    return {
        "high_intent_persona_queries": high_intent_persona,
        "striking_distance_total": len(striking_distance),
        "striking_distance_queries": striking_distance,
        "quick_win_h2_candidates": quick_win_h2_candidates,
        "dedicated_post_candidates": dedicated_post_candidates
    }

def sync_to_keyword_queue(dedicated_candidates: list):
    """Enriches keywords_queue.json with high-impression GSC striking distance opportunities."""
    if not KEYWORDS_QUEUE_PATH.exists():
        print(f"Keywords queue not found at {KEYWORDS_QUEUE_PATH}")
        return

    with open(KEYWORDS_QUEUE_PATH, "r", encoding="utf-8") as f:
        queue = json.load(f)

    existing_keywords = {item.get("keyword", "").lower() for item in queue}
    new_added = 0

    for cand in dedicated_candidates:
        q = cand["query"]
        if q.lower() not in existing_keywords:
            queue.append({
                "keyword": q,
                "tier": "STRIKING_DISTANCE_GSC",
                "dominant_above_fold_feature": "ORGANIC_STRIKING",
                "interaction_depth_score": 1,
                "triage_channel": "TECHNICAL_WHITE_PAPER",
                "status": "pending",
                "source": "GSC_DAY2_PATTERN_ENGINE"
            })
            existing_keywords.add(q.lower())
            new_added += 1

    if new_added > 0:
        with open(KEYWORDS_QUEUE_PATH, "w", encoding="utf-8") as f:
            json.dump(queue, f, indent=2)
        print(f"✅ Injected {new_added} high-yield GSC striking distance queries into keywords_queue.json.")
    else:
        print("All GSC striking candidates already present in keywords_queue.json.")

def run_gsc_expansion():
    print("=== RUNNING GSC PATTERN DETECTION ENGINE (DAY 2 TALK 6) ===")
    records = load_gsc_data()
    print(f"Ingested {len(records)} query performance records.")
    
    analysis = analyze_gsc_patterns(records)
    print(f"Found {len(analysis['high_intent_persona_queries'])} high-intent persona queries.")
    print(f"Found {analysis['striking_distance_total']} striking distance queries (Positions 4.0 - 20.0).")
    
    sync_to_keyword_queue(analysis["dedicated_post_candidates"])

    report_path = BASE_DIR / "gsc_striking_distance_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(analysis, f, indent=2)
    print(f"Detailed GSC triage report generated at {report_path}.")

if __name__ == "__main__":
    run_gsc_expansion()
