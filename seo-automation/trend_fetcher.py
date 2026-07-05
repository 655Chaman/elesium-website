"""
trend_fetcher.py — Step 1 of the Elesium SEO Automation Pipeline

What it does:
  1. Connects to Google Trends (worldwide) using pytrends
  2. Pulls the top trending searches right now
  3. Expands trends with related queries
  4. Scores each keyword for relevance to Elesium's business
  5. Returns a ranked list of relevant, trending keywords

Usage:
  python trend_fetcher.py           # Full run
  python trend_fetcher.py --test    # Quick test with mock data
  python trend_fetcher.py --verbose # Show all debug output
"""

import argparse
import json
import random
import sys
import time
from datetime import datetime
from difflib import SequenceMatcher

import config


# ─────────────────────────────────────────────────────
# UTILITY HELPERS
# ─────────────────────────────────────────────────────

def log(msg: str, level: str = "INFO") -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{level}] {msg}")


def fuzzy_match_score(a: str, b: str) -> float:
    """Return similarity ratio between two strings (0.0 – 1.0)."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def keyword_relevance_score(keyword: str) -> float:
    """
    Score a keyword's relevance to Elesium's business (0.0 – 1.0).

    Strategy:
      - Exact substring match with seed keywords → high score
      - Fuzzy word overlap with seed keywords → medium score
      - Topic cluster keywords get cluster-level bonus
    """
    kw_lower = keyword.lower()
    best_score = 0.0

    for seed in config.ALL_SEED_KEYWORDS:
        seed_lower = seed.lower()

        # Exact substring match
        if seed_lower in kw_lower or kw_lower in seed_lower:
            score = 0.9
        else:
            # Word-level overlap
            kw_words = set(kw_lower.split())
            seed_words = set(seed_lower.split())
            overlap = kw_words & seed_words
            if overlap:
                score = len(overlap) / max(len(kw_words), len(seed_words)) * 0.8
            else:
                # Fuzzy similarity fallback
                score = fuzzy_match_score(kw_lower, seed_lower) * 0.5

        if score > best_score:
            best_score = score

    return min(best_score, 1.0)


def sleep_random() -> None:
    """Wait a random interval to avoid pytrends rate limiting."""
    wait = random.uniform(config.PYTRENDS_SLEEP_MIN, config.PYTRENDS_SLEEP_MAX)
    time.sleep(wait)


def _build_pytrends():
    """Create and return a pytrends TrendReq instance."""
    from pytrends.request import TrendReq
    return TrendReq(
        hl=config.TRENDS_LANGUAGE,
        tz=0,
        timeout=(15, 30),
        retries=2,
        backoff_factor=1.0,
    )


def fetch_tier1_realtime(pytrends, verbose: bool = False) -> list:
    """Tier 1: Real-time trending searches per major market."""
    results = []
    for geo_code in ["US", "GB", "CA", "AU", "IN"]:
        try:
            df = pytrends.trending_searches(pn=geo_code)
            for i, row in df.iterrows():
                kw = str(row[0]).strip()
                if kw and len(kw) > 2:
                    results.append({
                        "keyword": kw,
                        "trending_score": max(0, config.TRENDS_TOP_N - i),
                        "source": f"trending_{geo_code}",
                    })
            log(f"  ✓ Trending searches ({geo_code}): {len(df)} entries")
            sleep_random()
        except Exception as e:
            if verbose:
                log(f"  ✗ trending_searches({geo_code}): {e}", "WARN")
    return results


def fetch_tier2_interest(pytrends, verbose: bool = False) -> list:
    """Tier 2: Interest over time for seed keywords + related queries."""
    results = []
    seed_sample = random.sample(
        config.ALL_SEED_KEYWORDS,
        min(25, len(config.ALL_SEED_KEYWORDS))
    )
    for i in range(0, len(seed_sample), 5):
        batch = seed_sample[i:i + 5]
        try:
            pytrends.build_payload(
                batch,
                cat=config.TRENDS_CATEGORY,
                timeframe=config.TRENDS_TIMEFRAME,
                geo=config.TRENDS_GEO,
            )
            df = pytrends.interest_over_time()
            if not df.empty:
                for kw in batch:
                    if kw in df.columns:
                        avg = df[kw].mean()
                        if avg > 0:
                            results.append({
                                "keyword": kw,
                                "trending_score": float(avg),
                                "source": "interest_over_time",
                            })
            sleep_random()

            # Related queries
            try:
                related = pytrends.related_queries()
                for kw in batch:
                    if kw in related:
                        top_df = related[kw].get("top")
                        if top_df is not None:
                            for _, r in top_df.head(5).iterrows():
                                q = str(r["query"]).strip()
                                if q:
                                    results.append({
                                        "keyword": q,
                                        "trending_score": float(r["value"]) * 0.8,
                                        "source": f"related:{kw}",
                                    })
                        rising_df = related[kw].get("rising")
                        if rising_df is not None:
                            for _, r in rising_df.head(3).iterrows():
                                q = str(r["query"]).strip()
                                val = r["value"]
                                score = 90.0 if isinstance(val, str) else min(float(val), 100.0)
                                if q:
                                    results.append({
                                        "keyword": q,
                                        "trending_score": score,
                                        "source": f"rising:{kw}",
                                        "is_rising": True,
                                    })
            except Exception as e:
                if verbose:
                    log(f"  related_queries for {batch[0]}: {e}", "WARN")

            sleep_random()

        except Exception as e:
            if verbose:
                log(f"  interest_over_time batch {i//5+1} failed: {e}", "WARN")

    log(f"  Tier 2 collected {len(results)} entries from {len(seed_sample)} seeds.")
    return results


def fetch_tier3_curated() -> list:
    """
    Tier 3: Curated high-value keyword fallback.
    Used when Google Trends is fully blocked. These are proven high-traffic
    B2B keywords that are evergreen for Elesium's business.
    Returns them with synthetic trending scores.
    """
    log("  Using curated fallback keyword list (Tier 3).")
    curated = [
        # B2B Sales & Dealflow
        ("B2B lead generation 2025", 88),
        ("enterprise sales strategy", 85),
        ("high ticket B2B sales", 82),
        ("B2B pipeline automation", 80),
        ("outbound sales platform", 78),
        ("enterprise dealflow management", 76),
        ("B2B revenue acceleration", 74),
        ("sales cycle reduction", 72),
        ("account based marketing platform", 70),
        ("B2B buyer intent data", 68),
        # Manufacturing & Industrial
        ("manufacturing buyers platform", 75),
        ("industrial B2B marketplace", 73),
        ("OEM supplier network", 71),
        ("supply chain partner matching", 69),
        ("plant manager procurement", 65),
        ("industrial automation buyers", 63),
        ("B2B manufacturing sales", 61),
        # Matchmaking & Partnerships
        ("B2B buyer matching platform", 84),
        ("strategic business introductions", 79),
        ("verified buyer network", 77),
        ("executive partnership introductions", 74),
        ("B2B partnership program", 72),
        ("business matchmaking service", 70),
        # Signal & Intent
        ("signal driven outbound", 81),
        ("buyer intent signals platform", 78),
        ("sales intelligence software", 76),
        ("predictive B2B analytics", 73),
        ("ICP targeting platform", 68),
        ("market signals sales", 65),
        # Revenue & Growth
        ("revenue operations software", 83),
        ("go to market strategy B2B", 79),
        ("customer acquisition cost reduction", 75),
        ("enterprise revenue growth", 73),
        ("B2B growth hacking", 68),
        ("SaaS B2B pipeline", 66),
        # Staffing & Talent
        ("executive recruitment platform", 70),
        ("B2B talent matching", 67),
        ("passive candidate sourcing", 64),
        ("talent acquisition platform 2025", 62),
    ]
    return [
        {
            "keyword": kw,
            "trending_score": float(score),
            "source": "curated_fallback",
            "relevance_score": 0.8,
        }
        for kw, score in curated
    ]


def fetch_realtime_trending(verbose: bool = False) -> list:
    """
    Pull trending keywords using a 3-tier resilient strategy.

    Tier 1: Real-time trending searches (most current, most likely to fail)
    Tier 2: Interest over time for seed keywords (more reliable)
    Tier 3: Curated evergreen keyword list (always works, fallback only)

    Returns a merged, de-duplicated list of {keyword, trending_score, source} dicts.
    """
    try:
        from pytrends.request import TrendReq
    except ImportError:
        log("pytrends not installed. Run: pip install pytrends", "ERROR")
        sys.exit(1)

    log("Connecting to Google Trends (3-tier resilient mode)...")
    all_data = []

    # ── Tier 1 ──────────────────────────────────────────
    log("Tier 1: Fetching real-time trending searches...")
    try:
        pytrends = _build_pytrends()
        t1 = fetch_tier1_realtime(pytrends, verbose=verbose)
        all_data.extend(t1)
        log(f"  Tier 1 result: {len(t1)} entries")
    except Exception as e:
        log(f"  Tier 1 failed entirely: {e}", "WARN")

    # ── Tier 2 ──────────────────────────────────────────
    log("Tier 2: Fetching interest over time for seed keywords...")
    try:
        pytrends = _build_pytrends()
        t2 = fetch_tier2_interest(pytrends, verbose=verbose)
        all_data.extend(t2)
        log(f"  Tier 2 result: {len(t2)} entries")
    except Exception as e:
        log(f"  Tier 2 failed entirely: {e}", "WARN")

    # ── Tier 3 fallback ──────────────────────────────────
    if len(all_data) < 10:
        log(f"Only {len(all_data)} entries from live sources — activating Tier 3 fallback.")
        t3 = fetch_tier3_curated()
        all_data.extend(t3)
        log(f"  Tier 3 added {len(t3)} curated keywords.")
    else:
        log(f"Live data sufficient ({len(all_data)} entries) — Tier 3 not needed.")

    log(f"Collected {len(all_data)} total keyword entries across all tiers.")
    return all_data


def fetch_test_data() -> list:
    """Return mock data for testing without hitting the API."""
    log("Running in TEST mode with mock data.")
    mock_keywords = [
        "enterprise sales strategy 2025",
        "B2B buyer intent platform",
        "signal-driven outbound marketing",
        "manufacturing automation buyers",
        "industrial B2B marketplace",
        "high ticket B2B deals",
        "account based marketing tools",
        "B2B partnership platform",
        "sales pipeline automation",
        "OEM supplier network",
        "revenue operations software",
        "enterprise dealflow management",
        "B2B lead generation platform",
        "supply chain partner matching",
        "executive sales introductions",
        "AI sales intelligence",
        "predictive B2B analytics",
        "growth stage manufacturer sales",
        "enterprise procurement automation",
        "B2B revenue acceleration",
        # Noise keywords (should be filtered out)
        "celebrity gossip news",
        "football match today",
        "weather forecast weekend",
        "movie release dates",
    ]
    return [
        {
            "keyword": kw,
            "trending_score": random.uniform(20, 100),
            "source": "mock_test",
        }
        for kw in mock_keywords
    ]


# ─────────────────────────────────────────────────────
# PROCESSING & SCORING
# ─────────────────────────────────────────────────────

def deduplicate(keywords: list) -> list:
    """Remove duplicate keywords (case-insensitive), keeping highest score."""
    seen: dict = {}
    for item in keywords:
        key = item["keyword"].lower().strip()
        if key not in seen or item["trending_score"] > seen[key]["trending_score"]:
            seen[key] = item
    return list(seen.values())


def score_and_filter(keywords: list, verbose: bool = False) -> list:
    """
    Add relevance scores and filter out off-topic keywords.
    Returns a ranked list of business-relevant keywords.
    """
    log(f"Scoring {len(keywords)} unique keywords for Elesium relevance...")
    scored: list = []

    for item in keywords:
        kw = item["keyword"]
        relevance = keyword_relevance_score(kw)

        if relevance < config.MIN_RELEVANCE_SCORE:
            if verbose:
                log(f"  ✗ FILTERED [{relevance:.2f}] {kw}")
            continue

        # Normalise trending score to 0–1
        trending_norm = min(item["trending_score"] / 100.0, 1.0)

        # Composite score
        composite = (
            relevance * config.RELEVANCE_WEIGHT
            + trending_norm * config.INTEREST_SCORE_WEIGHT
        )

        scored.append({
            **item,
            "relevance_score": round(relevance, 3),
            "trending_score_raw": item["trending_score"],
            "composite_score": round(composite, 4),
        })

        if verbose:
            log(f"  ✓ KEPT    [{relevance:.2f}] {kw}  →  composite={composite:.3f}")

    # Sort by composite score descending
    scored.sort(key=lambda x: x["composite_score"], reverse=True)
    log(f"Kept {len(scored)} relevant keywords after filtering.")
    return scored


# ─────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────

def run(test_mode: bool = False, verbose: bool = False) -> list:
    """
    Full trend fetch + score pipeline.
    Returns the final ranked keyword list.
    """
    log("=" * 60)
    log("STEP 1 — Google Trends Fetcher")
    log("=" * 60)

    # Fetch raw data
    if test_mode:
        raw_data = fetch_test_data()
    else:
        raw_data = fetch_realtime_trending(verbose=verbose)

    if not raw_data:
        log("No trend data returned. Check your internet connection or try --test.", "ERROR")
        sys.exit(1)

    # Deduplicate
    unique_data = deduplicate(raw_data)
    log(f"After dedup: {len(unique_data)} unique keywords.")

    # Score & filter
    final_keywords = score_and_filter(unique_data, verbose=verbose)

    # Cap at top N
    final_keywords = final_keywords[:config.TRENDS_TOP_N]

    # Save to keyword log
    today = datetime.now().strftime("%Y-%m-%d")
    log_path = config.OUTPUT_KEYWORD_LOGS_DIR / f"trends_{today}.json"
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "date": today,
                "timestamp": datetime.now().isoformat(),
                "total_keywords": len(final_keywords),
                "keywords": final_keywords,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )
    log(f"Trends saved to: {log_path}")

    # Print summary
    log(f"\nTop 10 Elesium-relevant trending keywords:")
    for i, item in enumerate(final_keywords[:10], 1):
        log(f"  {i:2}. [{item['composite_score']:.3f}] {item['keyword']}")

    return final_keywords


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Elesium Trend Fetcher")
    parser.add_argument("--test", action="store_true", help="Use mock data (no API calls)")
    parser.add_argument("--verbose", action="store_true", help="Show detailed scoring output")
    args = parser.parse_args()

    results = run(test_mode=args.test, verbose=args.verbose)
    log(f"\nDone. {len(results)} keywords ready for keyword_researcher.py")
