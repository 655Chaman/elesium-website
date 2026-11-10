"""
=============================================================================
GSC STRIKING DISTANCE ENGINE — MATHEMATICAL SCORING & CLUSTERING
=============================================================================
Classification: Striking Distance Analyzer & Opportunity Prioritizer
Methodology: Brian Kato (SEO Rockstars 2026 Day 2) & Dan Kurtz Compounding Loop
=============================================================================
"""

import math
import re
from typing import List, Dict, Tuple, Optional, Any
from urllib.parse import urlparse, unquote

from automation.gsc_engine.config import (
    STRIKING_DISTANCE_POS_MIN,
    STRIKING_DISTANCE_POS_MAX,
    EXTENDED_STRIKING_MIN,
    EXTENDED_STRIKING_MAX,
    TIER_1_POS_MIN,
    TIER_1_POS_MAX,
    TIER_2_POS_MIN,
    TIER_2_POS_MAX,
    SUBOPTIMAL_CTR_THRESHOLD,
    MIN_IMPRESSIONS_THRESHOLD,
    PROJECTED_TOP_3_CTR,
    WILSON_CONFIDENCE_LEVEL,
)
from automation.gsc_engine.models import (
    GSCQueryRecord,
    StrikingDistanceOpportunity,
    IntentCategory,
)
from automation.gsc_engine.regex_classifier import get_intent_multiplier


def extract_slug_from_page(page_url: str) -> Optional[str]:
    """
    Extracts normalized solution, market, or case-study slug from a page URL path.
    Strips .html/.htm extensions, unquotes percent-encoded characters,
    strips trailing slashes, and supports configurable route prefixes
    ('solutions', 'markets', 'case-studies').
    """
    if not page_url:
        return None
    parsed = urlparse(page_url)
    raw_path = parsed.path.strip("/")
    if not raw_path:
        return None

    # Strip .html or .htm extension
    path = re.sub(r"\.(html|htm)$", "", raw_path, flags=re.IGNORECASE).strip("/")
    # Decode percent-encoded characters (e.g. %20 -> space)
    path = unquote(path)

    parts = [p for p in path.split("/") if p]
    if not parts:
        return None

    # Known route prefixes: return the entity slug
    if parts[0].lower() in ("solutions", "markets", "case-studies"):
        if len(parts) >= 2:
            return parts[1].lower()
        return parts[0].lower()

    return parts[-1].lower()


def wilson_score_interval(
    clicks: int,
    impressions: int,
    confidence: float = WILSON_CONFIDENCE_LEVEL,
) -> Tuple[float, float]:
    """
    Computes the Wilson score confidence interval for observed CTR.
    Filters small-sample impression noise and prevents high-variance queries
    from misallocating optimization resources.
    """
    if impressions <= 0:
        return 0.0, 0.0

    # Quantile z for confidence level
    if abs(confidence - 0.99) < 0.01:
        z = 2.57583
    elif abs(confidence - 0.90) < 0.01:
        z = 1.64485
    else:
        z = 1.95996  # default 95% confidence

    p_hat = max(0.0, min(1.0, clicks / impressions))
    n = float(impressions)
    z2 = z * z
    denominator = 1.0 + (z2 / n)
    center = (p_hat + (z2 / (2.0 * n))) / denominator
    margin = (z * math.sqrt((p_hat * (1.0 - p_hat) / n) + (z2 / (4.0 * (n ** 2))))) / denominator
    lower = max(0.0, center - margin)
    upper = min(1.0, center + margin)
    return lower, upper


def calculate_opportunity_score(
    impressions: int,
    ctr: float,
    position: float,
    intent: IntentCategory,
    use_empirical_ctr_gap: bool = False,
    target_pos: float = 3.0,
    expected_ctr: float = PROJECTED_TOP_3_CTR,
) -> Tuple[float, float, float, float, int]:
    """
    Computes striking distance opportunity metrics:
    - Default mode (backward-compatible):
        unrealized = impressions * (1.0 - ctr)
        rank_weight = 1.0 / log2(position)
    - Empirical CTR gap mode (Flaw B-F4 remediation):
        delta_ctr = max(0.0, expected_ctr - actual_ctr)
        unrealized = impressions * delta_ctr
        rank_weight = 1.0 / sqrt(position - target_pos + 1.0)
    """
    pos = max(1.1, position)
    actual_ctr = max(0.0, min(1.0, ctr))
    intent_mult = get_intent_multiplier(intent)

    if use_empirical_ctr_gap:
        delta_ctr = max(0.0, expected_ctr - actual_ctr)
        unrealized = impressions * delta_ctr
        rank_weight = 1.0 / math.sqrt(max(1.0, pos - target_pos + 1.0))
        score = unrealized * rank_weight * intent_mult
        projected_clicks = int(impressions * expected_ctr)
    else:
        unrealized = impressions * (1.0 - actual_ctr)
        rank_weight = 1.0 / math.log2(pos)
        score = unrealized * rank_weight * intent_mult
        projected_clicks = int(impressions * PROJECTED_TOP_3_CTR)

    return score, unrealized, rank_weight, intent_mult, projected_clicks


class StrikingDistanceAnalyzer:
    """
    Filters, scores, and clusters GSC queries into high-ROI striking distance
    optimization targets across Tier 1 (Page 1 Striking: 4.0 to 7.9) and
    Tier 2 (Page 2 Striking: 8.0 to 20.0).
    """

    def __init__(
        self,
        pos_min: float = EXTENDED_STRIKING_MIN,
        pos_max: float = STRIKING_DISTANCE_POS_MAX,
        max_ctr: float = SUBOPTIMAL_CTR_THRESHOLD,
        min_impressions: int = MIN_IMPRESSIONS_THRESHOLD,
        use_wilson_noise_filter: bool = True,
    ):
        self.pos_min = pos_min
        self.pos_max = pos_max
        self.max_ctr = max_ctr
        self.min_impressions = min_impressions
        self.use_wilson_noise_filter = use_wilson_noise_filter

    def filter_striking_distance_queries(
        self, records: List[GSCQueryRecord]
    ) -> List[StrikingDistanceOpportunity]:
        """
        Filters queries strictly within [pos_min, pos_max], impressions >= min_impressions,
        and CTR <= max_ctr. Validates statistical significance via Wilson score interval.
        Returns sorted StrikingDistanceOpportunity list.
        """
        opportunities: List[StrikingDistanceOpportunity] = []

        for rec in records:
            # Multi-tier striking distance filter (Positions 4.0 to 20.0)
            if not (self.pos_min <= rec.position <= self.pos_max):
                continue

            # Must have sufficient impression volume
            if rec.impressions < self.min_impressions:
                continue

            # Sub-optimal CTR (opportunity for on-page answer optimization)
            if rec.ctr > self.max_ctr:
                continue

            # Statistical significance noise filtering (Wilson score interval)
            if self.use_wilson_noise_filter:
                ci_low, ci_high = wilson_score_interval(rec.clicks, rec.impressions)
                # If impressions are very noisy or low confidence, filter out
                if ci_high > 0.15 and rec.impressions < self.min_impressions:
                    continue

            slug = extract_slug_from_page(rec.page)
            if not slug:
                continue

            score, unrealized, rank_weight, intent_mult, projected_clicks = (
                calculate_opportunity_score(
                    rec.impressions, rec.ctr, rec.position, rec.intent
                )
            )

            # Assign optimization tier (Tier 1: Page 1 striking 4.0-7.9; Tier 2: Page 2 striking 8.0-20.0)
            tier = 1 if (TIER_1_POS_MIN <= rec.position <= TIER_1_POS_MAX) else 2
            delta_ctr = max(0.0, PROJECTED_TOP_3_CTR - rec.ctr)

            opp = StrikingDistanceOpportunity(
                query=rec.query,
                page=rec.page,
                slug=slug,
                clicks=rec.clicks,
                impressions=rec.impressions,
                ctr=rec.ctr,
                position=rec.position,
                intent=rec.intent,
                opportunity_score=round(score, 2),
                unrealized_clicks=round(unrealized, 1),
                rank_distance_weight=round(rank_weight, 4),
                intent_multiplier=intent_mult,
                projected_top3_clicks=projected_clicks,
                matched_intent_pattern=rec.matched_intent_pattern,
                tier=tier,
                expected_ctr=PROJECTED_TOP_3_CTR,
                delta_ctr=round(delta_ctr, 4),
            )
            opportunities.append(opp)

        # Sort descending by Opportunity Score
        opportunities.sort(key=lambda x: x.opportunity_score, reverse=True)
        return opportunities

    def cluster_by_landing_page(
        self, opportunities: List[StrikingDistanceOpportunity]
    ) -> Dict[str, Dict[str, Any]]:
        """
        Clusters opportunities by target landing page slug.
        Returns a dict mapping slug to {
            'slug': str,
            'page_url': str,
            'primary_opportunity': StrikingDistanceOpportunity,
            'secondary_opportunities': List[StrikingDistanceOpportunity],
            'total_impressions': int,
            'total_opportunity_score': float,
            'projected_traffic_gain': int
        }
        """
        clusters: Dict[str, Dict[str, Any]] = {}

        for opp in opportunities:
            slug = opp.slug
            if slug not in clusters:
                clusters[slug] = {
                    "slug": slug,
                    "page_url": opp.page,
                    "primary_opportunity": opp,
                    "secondary_opportunities": [],
                    "total_impressions": 0,
                    "total_opportunity_score": 0.0,
                    "projected_traffic_gain": 0,
                }
            else:
                clusters[slug]["secondary_opportunities"].append(opp)

            clusters[slug]["total_impressions"] += opp.impressions
            clusters[slug]["total_opportunity_score"] += opp.opportunity_score
            clusters[slug]["projected_traffic_gain"] += (
                opp.projected_top3_clicks - opp.clicks
            )

        return clusters
