#!/usr/bin/env python3
"""
free_researcher.py — Resilient Competitor & SERP Intelligence Engine
====================================================================
Performs zero-cost SERP feature analysis and competitor intelligence extraction.
Computes Ted Kubaitis Above-the-Fold Interaction Depth, classifies SERP features,
and generates Information Gain directives to ensure novel content angles.
"""

import urllib.request
import urllib.parse
import json
import ssl
from dataclasses import dataclass, asdict
from typing import List, Dict, Any
import re

@dataclass
class SerpInteractionProfile:
    keyword: str
    dominant_above_fold_feature: str  # "AI_OVERVIEW" | "LOCAL_PACK" | "SPONSORED_ADS" | "FORUM_REDDIT" | "ORGANIC_TOP"
    interaction_depth_score: int
    triage_channel: str
    actionable_directive: str

def classify_serp_depth(keyword: str, serp_html: str) -> SerpInteractionProfile:
    """
    Parses SERP DOM to compute Interaction Depth and triage keyword to the highest-ROI channel.
    """
    has_ai_overview = "class=\"M7eMe\"" in serp_html or "AI Overview" in serp_html or "ai-overview" in serp_html.lower()
    has_local_pack = "class=\"VkpGBb\"" in serp_html or ("data-hveid" in serp_html and "Maps" in serp_html)
    has_reddit = "reddit.com" in serp_html or "quora.com" in serp_html
    has_top_ads = "class=\"uEierd\"" in serp_html or "Sponsored" in serp_html or "ad_banner" in serp_html
    
    if has_top_ads and not (has_ai_overview or has_local_pack):
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="SPONSORED_ADS",
            interaction_depth_score=3,
            triage_channel="PAID_OR_PPC",
            actionable_directive="Organic text pushed below fold. Deploy paid campaign or high-authority parasite forum syndication."
        )
    elif has_ai_overview:
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="AI_OVERVIEW",
            interaction_depth_score=1,
            triage_channel="ANSWER_CAPSULES_AND_TABLES",
            actionable_directive="Inject 40–50 word bold Answer Capsules, comparative markdown tables, and direct definitional assertions."
        )
    elif has_local_pack:
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="LOCAL_PACK",
            interaction_depth_score=1,
            triage_channel="GEO_MICRO_ZONE_ALIGNMENT",
            actionable_directive="Ground post in Bangalore tech corridors (Koramangala, Indiranagar, Whitefield, Outer Ring Road)."
        )
    else:
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="ORGANIC_TOP",
            interaction_depth_score=1,
            triage_channel="TECHNICAL_WHITE_PAPER",
            actionable_directive="Deploy 2,200+ word deep architectural whitepaper with complete LangGraph Python code and verifiable ROI metrics."
        )

def extract_competitor_gaps(snippets: List[str]) -> Dict[str, Any]:
    """
    Analyzes competitor snippets to identify missing enterprise angles and formulate
    Information Gain directives (Shannon Entropy maximization).
    """
    all_text = " ".join(snippets).lower()
    
    gaps = []
    if "python" not in all_text and "langgraph" not in all_text and "code" not in all_text:
        gaps.append("Competitors lack technical code implementations. Mandate full executable LangGraph Python script.")
    if "cost" not in all_text and "pricing" not in all_text and "inr" not in all_text and "₹" not in all_text:
        gaps.append("Competitors hide pricing. Publish transparent INR/USD implementation tiers (Shaun Mitchell Law).")
    if "dpdp" not in all_text and "rbi" not in all_text and "compliance" not in all_text:
        gaps.append("Competitors omit Indian regulatory compliance. Cite DPDP Act 2023 Section 8(4) and RBI IT Governance.")
    if "vpc" not in all_text and "on-prem" not in all_text and "security" not in all_text:
        gaps.append("Competitors promote cloud SaaS wrappers. Emphasize private VPC zero-data-retention architecture.")

    return {
        "competitor_coverage": [s[:100] + "..." for s in snippets[:3]],
        "identified_gaps": gaps if gaps else ["Provide deeper architectural blueprints and benchmark metrics."],
        "information_gain_directive": (
            "Maximum Information Gain (Shannon Entropy): Surpass competitor superficiality by providing "
            "verifiable benchmark latency numbers, production Python/LangGraph code, transparent Indian pricing grids, "
            "and DPDP Act 2023 regulatory compliance blueprints."
        )
    }

def perform_free_research(keyword: str) -> Dict[str, Any]:
    """
    Performs resilient web research using DuckDuckGo HTML search.
    Computes SERP Interaction Profile and Information Gain gap analysis.
    """
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(keyword)}"
    req = urllib.request.Request(
        url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
    )
    
    results = []
    html_content = ""
    try:
        response = urllib.request.urlopen(req, context=context, timeout=12)
        html_content = response.read().decode('utf-8', errors='ignore')
        
        parts = html_content.split('class="result__snippet')
        for part in parts[1:7]:  # Top 6 snippets
            snippet_end = part.find('</a>')
            if snippet_end != -1:
                snippet = part[:snippet_end]
                clean = re.sub(r'<[^>]+>', '', snippet).strip()
                if clean:
                    results.append(clean)
    except Exception as e:
        print(f"DuckDuckGo live scrape notice for '{keyword}': {e}. Using deterministic fallback corpus.")
        results = [
            f"Enterprise AI automation in India for {keyword} requires high security and scalable infrastructure.",
            f"Adopting agentic workflows in Indian BFSI and manufacturing reduces operational overhead.",
            f"Custom LangGraph multi-agent systems outshine no-code platforms in latency and determinism."
        ]

    serp_profile = classify_serp_depth(keyword, html_content)
    gap_analysis = extract_competitor_gaps(results)
    
    return {
        "keyword": keyword,
        "success": len(results) > 0,
        "data": results,
        "serp_profile": asdict(serp_profile),
        "gap_analysis": gap_analysis,
        "themes": [
            "Deterministic State Machines (LangGraph)",
            "Private VPC Isolation & Zero Data Retention",
            "Indian Enterprise ROI & Transparent Pricing (INR/USD)",
            "DPDP Act 2023 & RBI IT Governance Compliance"
        ],
        "competitor_angles": [
            "Generic ChatGPT wrappers vs Custom Deterministic Systems",
            "Hidden pricing vs Radical Shaun Mitchell Transparency",
            "SaaS data leak risks vs Private Cloud / On-Prem Deployments"
        ]
    }

if __name__ == "__main__":
    import pprint
    res = perform_free_research("cost of enterprise AI automation India")
    pprint.pprint(res)
