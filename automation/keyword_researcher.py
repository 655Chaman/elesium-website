"""
keyword_researcher.py — Step 2 of the Elesium SEO Automation Pipeline

What it does:
  1. Takes the ranked keyword list from trend_fetcher.py
  2. Expands each top keyword into related long-tail variants using pytrends
  3. Optionally enriches with search volume via DataForSEO sandbox (free)
  4. Scores each keyword by volume × relevance × trending
  5. Outputs a final curated list of the top keywords for content generation

Usage:
  python keyword_researcher.py                    # Uses today's trend log
  python keyword_researcher.py --date 2025-01-15  # Use a specific date's trends
  python keyword_researcher.py --test             # Mock mode
"""

import argparse
import json
import random
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Optional

import config


# ─────────────────────────────────────────────────────
# UTILITY
# ─────────────────────────────────────────────────────

def log(msg: str, level: str = "INFO") -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{level}] {msg}")


def sleep_random() -> None:
    wait = random.uniform(config.PYTRENDS_SLEEP_MIN, config.PYTRENDS_SLEEP_MAX)
    time.sleep(wait)


def load_todays_trends(date: Optional[str] = None) -> list:
    """Load trend data from the keyword_logs directory."""
    target_date = date or datetime.now().strftime("%Y-%m-%d")
    log_path = config.OUTPUT_KEYWORD_LOGS_DIR / f"trends_{target_date}.json"

    if not log_path.exists():
        log(f"No trend log found at: {log_path}", "ERROR")
        log("Run trend_fetcher.py first (or use --test for mock data).", "ERROR")
        sys.exit(1)

    with open(log_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    log(f"Loaded {data['total_keywords']} keywords from {log_path}")
    return data["keywords"]


# ─────────────────────────────────────────────────────
# KEYWORD EXPANSION (pytrends related queries)
# ─────────────────────────────────────────────────────

def expand_keywords_with_pytrends(
    seed_keywords: list,
    verbose: bool = False,
) -> list:
    """
    For each seed keyword, pull related top queries from pytrends.
    Returns a list of expanded keyword dicts.
    """
    try:
        from pytrends.request import TrendReq
    except ImportError:
        log("pytrends not installed. Run: pip install pytrends", "ERROR")
        sys.exit(1)

    pytrends = TrendReq(
        hl=config.TRENDS_LANGUAGE,
        tz=0,
        timeout=(10, 25),
        retries=3,
        backoff_factor=0.5,
    )

    expanded: list = []

    # Process in batches of 5 (pytrends limit)
    for i in range(0, len(seed_keywords), 5):
        batch = seed_keywords[i:i + 5]
        log(f"  Expanding batch {i//5 + 1}: {batch[:3]}...")

        try:
            pytrends.build_payload(
                batch,
                cat=config.TRENDS_CATEGORY,
                timeframe=config.TRENDS_TIMEFRAME,
                geo=config.TRENDS_GEO,
            )
            related = pytrends.related_queries()

            for kw in batch:
                if kw not in related:
                    continue

                # Top related queries
                if related[kw]["top"] is not None:
                    top_df = related[kw]["top"]
                    for _, row in top_df.head(8).iterrows():
                        query = str(row["query"]).strip()
                        value = float(row["value"])
                        if query:
                            expanded.append({
                                "keyword": query,
                                "trending_score": value,
                                "source": f"related_top:{kw}",
                                "parent_keyword": kw,
                            })

                # Rising related queries (breakout = exponential growth)
                if related[kw]["rising"] is not None:
                    rising_df = related[kw]["rising"]
                    for _, row in rising_df.head(5).iterrows():
                        query = str(row["query"]).strip()
                        value = row["value"]
                        # "Breakout" means >5000% increase — treat as high value
                        if isinstance(value, str) and "Breakout" in value:
                            norm_value = 95.0
                        else:
                            try:
                                norm_value = float(value)
                            except (ValueError, TypeError):
                                norm_value = 50.0
                        if query:
                            expanded.append({
                                "keyword": query,
                                "trending_score": norm_value,
                                "source": f"related_rising:{kw}",
                                "parent_keyword": kw,
                                "is_rising": True,
                            })

        except Exception as e:
            if verbose:
                log(f"  Failed to expand batch {batch}: {e}", "WARN")

        sleep_random()

    log(f"Expansion complete. {len(expanded)} new keyword variants found.")
    return expanded


# ─────────────────────────────────────────────────────
# SEARCH VOLUME ENRICHMENT (DataForSEO — optional)
# ─────────────────────────────────────────────────────

def enrich_with_dataforseo(keywords: list) -> dict:
    """
    Fetch search volume, CPC, and competition data from DataForSEO sandbox.
    Returns a dict keyed by keyword with {volume, cpc, competition} values.
    Falls back gracefully if API is unavailable or keys not set.
    """
    if not config.DATAFORSEO_LOGIN or not config.DATAFORSEO_PASSWORD:
        log("DataForSEO credentials not set. Skipping volume enrichment.", "WARN")
        log("  → Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD in your .env file.")
        return {}

    import base64
    import urllib.request

    credentials = base64.b64encode(
        f"{config.DATAFORSEO_LOGIN}:{config.DATAFORSEO_PASSWORD}".encode()
    ).decode()

    headers = {
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json",
    }

    # DataForSEO: Keywords for Sites - Search Volume endpoint (sandbox)
    url = f"{config.DATAFORSEO_BASE_URL}/keywords_data/google/search_volume/live"
    payload = json.dumps([
        {
            "keywords": keywords[:100],  # Max 100 per request
            "location_code": config.DATAFORSEO_LOCATION_CODE,
            "language_code": config.DATAFORSEO_LANGUAGE_CODE,
        }
    ]).encode()

    try:
        log(f"Fetching search volumes for {len(keywords)} keywords from DataForSEO...")
        req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read())

        volume_map: dict = {}
        if result.get("status_code") == 20000:
            tasks = result.get("tasks", [])
            for task in tasks:
                for item in task.get("result", []):
                    for kw_data in item.get("items", []):
                        kw = kw_data.get("keyword", "")
                        volume_map[kw.lower()] = {
                            "volume": kw_data.get("search_volume", 0) or 0,
                            "cpc": kw_data.get("cpc", 0.0) or 0.0,
                            "competition": kw_data.get("competition", 0.0) or 0.0,
                        }
        log(f"DataForSEO returned volume data for {len(volume_map)} keywords.")
        return volume_map

    except Exception as e:
        log(f"DataForSEO enrichment failed: {e}. Continuing without volume data.", "WARN")
        return {}


# ─────────────────────────────────────────────────────
# SCORING & RANKING
# ─────────────────────────────────────────────────────

def compute_final_scores(
    all_keywords: list,
    volume_map: dict,
) -> list:
    """
    Compute final composite scores incorporating:
      - Relevance to Elesium (from trend_fetcher scoring)
      - Trending score (normalised)
      - Search volume (if available)
      - Rising keyword bonus
    """
    from trend_fetcher import keyword_relevance_score

    scored: list = []
    for item in all_keywords:
        kw = item["keyword"]
        kw_lower = kw.lower()

        # Base relevance
        relevance = item.get("relevance_score") or keyword_relevance_score(kw)
        if relevance < config.MIN_RELEVANCE_SCORE:
            continue

        # Trending score (0–1)
        trending_norm = min(item.get("trending_score", 0) / 100.0, 1.0)

        # Volume score (0–1, log-normalised)
        vol_data = volume_map.get(kw_lower, {})
        raw_volume = vol_data.get("volume", 0)
        if raw_volume > 0:
            import math
            volume_norm = min(math.log10(raw_volume) / 7.0, 1.0)  # log10(10M) = 7
        else:
            volume_norm = 0.0

        # Rising keyword bonus
        rising_bonus = 0.05 if item.get("is_rising") else 0.0

        # Final composite
        composite = (
            relevance * config.RELEVANCE_WEIGHT
            + trending_norm * config.INTEREST_SCORE_WEIGHT
            + volume_norm * config.VOLUME_WEIGHT
            + rising_bonus
        )

        scored.append({
            **item,
            "relevance_score": round(relevance, 3),
            "trending_score_norm": round(trending_norm, 3),
            "volume": raw_volume,
            "cpc": vol_data.get("cpc", 0.0),
            "competition": vol_data.get("competition", 0.0),
            "final_score": round(composite, 4),
        })

    # Deduplicate by keyword text
    seen: dict = {}
    for item in scored:
        key = item["keyword"].lower().strip()
        if key not in seen or item["final_score"] > seen[key]["final_score"]:
            seen[key] = item

    ranked = sorted(seen.values(), key=lambda x: x["final_score"], reverse=True)
    return ranked


# ─────────────────────────────────────────────────────
# KEYWORD GROUPING (for content writer context)
# ─────────────────────────────────────────────────────

def group_by_cluster(keywords: list) -> dict:
    """Group keywords by their closest Elesium topic cluster."""
    from difflib import SequenceMatcher

    def best_cluster(kw: str) -> str:
        best_score = 0.0
        best_cluster_name = "General"
        for cluster_name, seeds in config.TOPIC_CLUSTERS.items():
            for seed in seeds:
                ratio = SequenceMatcher(None, kw.lower(), seed.lower()).ratio()
                if seed.lower() in kw.lower() or kw.lower() in seed.lower():
                    ratio = max(ratio, 0.85)
                if ratio > best_score:
                    best_score = ratio
                    best_cluster_name = cluster_name
        return best_cluster_name

    groups: dict = {}
    for item in keywords:
        cluster = best_cluster(item["keyword"])
        if cluster not in groups:
            groups[cluster] = []
        groups[cluster].append(item["keyword"])

    return groups


# ─────────────────────────────────────────────────────
# MOCK TEST MODE
# ─────────────────────────────────────────────────────

def mock_trend_data() -> list:
    """Generate mock trend data for testing."""
    keywords = [
        {"keyword": "enterprise sales automation", "trending_score": 85, "source": "mock",
         "relevance_score": 0.88},
        {"keyword": "B2B buyer matching platform", "trending_score": 72, "source": "mock",
         "relevance_score": 0.92},
        {"keyword": "signal driven outbound marketing", "trending_score": 68, "source": "mock",
         "relevance_score": 0.85},
        {"keyword": "high ticket B2B partnerships", "trending_score": 61, "source": "mock",
         "relevance_score": 0.91},
        {"keyword": "manufacturing buyer network", "trending_score": 58, "source": "mock",
         "relevance_score": 0.78},
        {"keyword": "intent data sales platform", "trending_score": 54, "source": "mock",
         "relevance_score": 0.82},
        {"keyword": "revenue operations 2025", "trending_score": 49, "source": "mock",
         "relevance_score": 0.74},
        {"keyword": "enterprise dealflow management", "trending_score": 45, "source": "mock",
         "relevance_score": 0.95},
        {"keyword": "account based marketing tools", "trending_score": 42, "source": "mock",
         "relevance_score": 0.72},
        {"keyword": "OEM supplier marketplace", "trending_score": 38, "source": "mock",
         "relevance_score": 0.80},
        {"keyword": "B2B pipeline automation software", "trending_score": 35, "source": "mock",
         "relevance_score": 0.86},
        {"keyword": "executive sales introductions", "trending_score": 32, "source": "mock",
         "relevance_score": 0.89},
        {"keyword": "growth stage manufacturer leads", "trending_score": 29, "source": "mock",
         "relevance_score": 0.77},
        {"keyword": "AI powered lead qualification", "trending_score": 88, "source": "mock",
         "relevance_score": 0.70},
        {"keyword": "predictive B2B analytics platform", "trending_score": 65, "source": "mock",
         "relevance_score": 0.76},
    ]
    return keywords


# ─────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────

def run(
    date: Optional[str] = None,
    test_mode: bool = False,
    verbose: bool = False,
) -> list:
    """
    Full keyword research pipeline.
    Returns top ranked keywords ready for content generation.
    """
    log("=" * 60)
    log("STEP 2 — Keyword Researcher")
    log("=" * 60)

    today = date or datetime.now().strftime("%Y-%m-%d")

    # ── Load seed keywords from trend fetcher output ──
    if test_mode:
        trend_keywords = mock_trend_data()
        log(f"Test mode: loaded {len(trend_keywords)} mock keywords.")
    else:
        trend_keywords = load_todays_trends(today)

    # Take only the top ranked keywords as seeds for expansion
    top_seeds = [item["keyword"] for item in trend_keywords[:15]]

    # ── Expand keywords with pytrends related queries ──
    expanded_keywords: list = []
    if not test_mode:
        log(f"Expanding top {len(top_seeds)} keywords with pytrends related queries...")
        expanded_keywords = expand_keywords_with_pytrends(top_seeds, verbose=verbose)
    else:
        log("Test mode: skipping pytrends expansion.")

    # ── Merge original trends + expanded keywords ──
    all_keywords = trend_keywords + expanded_keywords
    log(f"Total keyword pool (before scoring): {len(all_keywords)}")

    # ── Enrich with DataForSEO volume (optional) ──
    all_kw_texts = list({item["keyword"] for item in all_keywords})
    volume_map = enrich_with_dataforseo(all_kw_texts) if not test_mode else {}

    # ── Score & rank ──
    final_keywords = compute_final_scores(all_keywords, volume_map)
    top_keywords = final_keywords[:config.TOP_KEYWORDS_FOR_CONTENT]

    log(f"Final keyword selection: {len(top_keywords)} keywords")

    # ── Group by topic cluster ──
    cluster_groups = group_by_cluster(top_keywords)

    # ── Save enriched keyword log ──
    output_path = config.OUTPUT_KEYWORD_LOGS_DIR / f"keywords_{today}.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "date": today,
                "timestamp": datetime.now().isoformat(),
                "total_keywords": len(top_keywords),
                "clusters": cluster_groups,
                "keywords": top_keywords,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )
    log(f"Keyword research saved to: {output_path}")

    # ── Print final summary ──
    log(f"\nTop {min(15, len(top_keywords))} keywords for today's SEO block:")
    for i, item in enumerate(top_keywords[:15], 1):
        vol_str = f"vol={item['volume']:,}" if item.get("volume") else "vol=N/A"
        log(
            f"  {i:2}. [score={item['final_score']:.3f} | {vol_str}] "
            f"{item['keyword']}"
        )

    log(f"\nKeyword clusters identified:")
    for cluster, kws in cluster_groups.items():
        log(f"  • {cluster}: {len(kws)} keywords")

    return top_keywords


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Elesium Keyword Researcher")
    parser.add_argument("--date", type=str, help="Target date (YYYY-MM-DD)")
    parser.add_argument("--test", action="store_true", help="Use mock data")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    args = parser.parse_args()

    results = run(date=args.date, test_mode=args.test, verbose=args.verbose)
    log(f"\nDone. {len(results)} keywords ready for seo_block_generator.py")
