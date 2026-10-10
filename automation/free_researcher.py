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
    has_local_pack = "class=\"VkpGBb\"" in serp_html or "data-hveid" in serp_html and "Maps" in serp_html
    has_reddit = "reddit.com" in serp_html or "quora.com" in serp_html
    has_top_ads = "class=\"uEierd\"" in serp_html or "Sponsored" in serp_html or "ad_banner" in serp_html
    
    if has_top_ads and not (has_ai_overview or has_local_pack):
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="SPONSORED_ADS",
            interaction_depth_score=3,
            triage_channel="PAID_OR_PPC",
            actionable_directive="Do not rely on organic text alone; trigger paid campaign or high-authority forum reply."
        )
    elif has_ai_overview:
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="AI_OVERVIEW",
            interaction_depth_score=1,
            triage_channel="ANSWER_CAPSULES_AND_TABLES",
            actionable_directive="Inject 45-word bold capsule, comparative markdown matrix, and direct Q&A."
        )
    elif has_local_pack:
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="LOCAL_PACK",
            interaction_depth_score=1,
            triage_channel="GEO_MICRO_ZONE_ALIGNMENT",
            actionable_directive="Ground post in Bangalore micro-zones (Koramangala, Indiranagar, Whitefield)."
        )
    else:
        return SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="ORGANIC_TOP",
            interaction_depth_score=1,
            triage_channel="TECHNICAL_WHITE_PAPER",
            actionable_directive="Deploy 2,500-word deep architecture post with complete LangGraph Python code."
        )

def perform_free_research(keyword: str) -> Dict[str, Any]:
    """
    Performs a free web search using DuckDuckGo HTML search.
    Requires no API keys. Also computes SERP Interaction Profile.
    """
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(keyword)}"
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    
    try:
        response = urllib.request.urlopen(req, context=context, timeout=10)
        html = response.read().decode('utf-8', errors='ignore')
        
        results = []
        parts = html.split('class="result__snippet')
        for part in parts[1:6]:  # Top 5
            snippet_end = part.find('</a>')
            if snippet_end != -1:
                snippet = part[:snippet_end]
                clean = re.sub(r'<[^>]+>', '', snippet).strip()
                results.append(clean)
                
        serp_profile = classify_serp_depth(keyword, html)
        
        return {
            "keyword": keyword,
            "success": True,
            "data": results,
            "serp_profile": asdict(serp_profile),
            "themes": ["Enterprise adoption", "Cost optimization", "Scalability", "Security"],
            "competitor_angles": ["Speed to market", "ROI", "Local expertise in India"]
        }
    except Exception as e:
        print(f"Research failed for {keyword}: {e}")
        fallback_profile = SerpInteractionProfile(
            keyword=keyword,
            dominant_above_fold_feature="ORGANIC_TOP",
            interaction_depth_score=1,
            triage_channel="TECHNICAL_WHITE_PAPER",
            actionable_directive="Deploy 2,500-word deep architecture post with complete LangGraph Python code."
        )
        return {
            "keyword": keyword,
            "success": False,
            "data": [],
            "serp_profile": asdict(fallback_profile),
            "themes": ["Enterprise AI", "India automation", "ROI", "Custom solutions"],
            "competitor_angles": []
        }

if __name__ == "__main__":
    print(perform_free_research("cost of enterprise AI automation India"))
