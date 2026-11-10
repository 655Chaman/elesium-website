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
from urllib.parse import urlparse

from automation.gsc_engine.config import (
    STRIKING_DISTANCE_POS_MIN,
    STRIKING_DISTANCE_POS_MAX,
    SUBOPTIMAL_CTR_THRESHOLD,
    MIN_IMPRESSIONS_THRESHOLD,
)
from automation.gsc_engine.models import (
    GSCQueryRecord,
    StrikingDistanceOpportunity,
    IntentCategory,
)
from automation.gsc_engine.regex_classifier import get_intent_multiplier


# Industry standard top 3 blended organic click-through rate (Positions 1-3)
PROJECTED_TOP_3_CTR = 0.285


def extract_slug_from_page(page_url: str) -> Optional[str]:
    """Extracts solution or hub slug from a page URL path."""
    parsed = urlparse(page_url)
    path = parsed.path.strip("/")
    parts = path.split("/")
    if len(parts) >= 2 and parts[0] == "solutions":
        return parts[1]
    elif len(parts) == 1 and parts[0]:
        return parts[0]
    return None


def calculate_opportunity_score(
    impressions: int, ctr: float, position: float, intent: IntentCategory
) -> Tuple[float, float, float, float, int]:
    """
    Computes striking distance opportunity metrics:
    1. Unrealized clicks = Impressions * (1 - CTR)
    2. Rank distance weight = 1 / log2(position)
    3. Intent multiplier = based on RE2 classification
    4. Opportunity score = Unrealized * RankWeight * IntentMultiplier
    5. Projected Top 3 clicks = Impressions * 0.285
    """
    pos = max(1.1, position)
    unrealized = impressions * (1.0 - ctr)
    rank_weight = 1.0 / math.log2(pos)
    intent_mult = get_intent_multiplier(intent)
    score = unrealized * rank_weight * intent_mult
    projected_clicks = int(impressions * PROJECTED_TOP_3_CTR)

    return score, unrealized, rank_weight, intent_mult, projected_clicks


class StrikingDistanceAnalyzer:
    """
    Filters, scores, and clusters GSC queries into high-ROI striking distance
    optimization targets (Positions 8.0 to 20.0).
    """

    def __init__(
        self,
        pos_min: float = STRIKING_DISTANCE_POS_MIN,
        pos_max: float = STRIKING_DISTANCE_POS_MAX,
        max_ctr: float = SUBOPTIMAL_CTR_THRESHOLD,
        min_impressions: int = MIN_IMPRESSIONS_THRESHOLD,
    ):
        self.pos_min = pos_min
        self.pos_max = pos_max
        self.max_ctr = max_ctr
        self.min_impressions = min_impressions

    def filter_striking_distance_queries(
        self, records: List[GSCQueryRecord]
    ) -> List[StrikingDistanceOpportunity]:
        """
        Filters queries strictly within [pos_min, pos_max], impressions >= min_impressions,
        and CTR <= max_ctr. Returns sorted StrikingDistanceOpportunity list.
        """
        opportunities: List[StrikingDistanceOpportunity] = []

        for rec in records:
            # Brian Kato & Ted Kubaitis filter: Position between 8.0 and 20.0
            if not (self.pos_min <= rec.position <= self.pos_max):
                continue

            # Must have sufficient impression volume
            if rec.impressions < self.min_impressions:
                continue

            # Sub-optimal CTR (opportunity for on-page answer optimization)
            if rec.ctr > self.max_ctr:
                continue

            slug = extract_slug_from_page(rec.page)
            if not slug:
                continue

            score, unrealized, rank_weight, intent_mult, projected_clicks = (
                calculate_opportunity_score(
                    rec.impressions, rec.ctr, rec.position, rec.intent
                )
            )

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
