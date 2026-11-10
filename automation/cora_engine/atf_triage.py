"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — ATF REAL ESTATE & INTERACTION DEPTH
=============================================================================
Classification: Visibility-First SERP Layout & Interaction Depth Triage
Methodology: Ted Kubaitis (SEO Rockstars 2026 Day 1 - Visibility-First SEO)
Remediated: Genuine Visibility Deflator formulation:
            Deflated Score = (N + 1 - Rank) / (1.0 + 0.75 * InteractionDepth)
=============================================================================
"""

import math
from typing import Dict, Any, Tuple, List, Optional
from automation.cora_engine.config import (
    VIEWPORT_HEIGHT_PX,
    ATF_MAX_DEPTH_PX,
    MID_FOLD_MAX_DEPTH_PX,
    DEEP_FOLD_MAX_DEPTH_PX,
    FUNCTIONALLY_DEAD_DEPTH_PX,
)
from automation.cora_engine.models import (
    ATFLayoutProfile,
    ATFChannelTriage,
    SERPCompetitorRecord,
)


def calculate_interaction_depth(pixel_y_offset: int) -> int:
    """
    Computes the number of mobile scroll/page-down interactions required
    to bring the organic result into view.
    0 = Immediately visible Above-The-Fold (0 to 844px)
    1 = 1 scroll action (845 to 1688px)
    2 = 2 scroll actions (1689 to 2532px)
    >= 3 = 3+ scroll actions (Functionally Dead)
    """
    if pixel_y_offset <= ATF_MAX_DEPTH_PX:
        return 0
    elif pixel_y_offset <= MID_FOLD_MAX_DEPTH_PX:
        return 1
    elif pixel_y_offset <= DEEP_FOLD_MAX_DEPTH_PX:
        return 2
    else:
        return 3


def calculate_deflated_ranking_score(
    rank: int,
    total_competitors: int,
    interaction_depth: int,
    deflator_coefficient: float = 0.75,
) -> float:
    """
    Ted Kubaitis Visibility Deflator Formula:
    Deflated Dominance Score = (N + 1 - Rank) / (1.0 + 0.75 * InteractionDepth)
    Penalizes ranking positions pushed below the fold by sponsored ads, AI Overviews, or Map Packs.
    """
    if rank <= 0 or total_competitors <= 0:
        return 0.0
    raw_dominance = max(0.0, float((total_competitors + 1) - rank))
    depth_penalty = 1.0 + (deflator_coefficient * max(0, interaction_depth))
    return round(raw_dominance / depth_penalty, 4)


def compute_deflated_dominance_scores(
    competitors: List[SERPCompetitorRecord],
    deflator_coefficient: float = 0.75,
) -> List[float]:
    """
    Calculates deflated ranking dominance scores for an entire competitor SERP list.
    """
    n = len(competitors)
    scores: List[float] = []
    for c in competitors:
        depth = calculate_interaction_depth(c.pixel_y_offset)
        score = calculate_deflated_ranking_score(
            rank=c.rank,
            total_competitors=n,
            interaction_depth=depth,
            deflator_coefficient=deflator_coefficient,
        )
        scores.append(score)
    return scores


def triage_serp_layout(
    query: str,
    ai_overview: bool = False,
    ai_overview_height: int = 520,
    ads_count: int = 0,
    local_pack: bool = False,
    local_pack_height: int = 460,
    forums_present: bool = False,
    forums_height: int = 340,
) -> ATFLayoutProfile:
    """
    Triages a SERP based on what features occupy Above-The-Fold real estate.
    Replaces static rank position with Ted Kubaitis's Interaction Depth.
    """
    ads_height = ads_count * 115 if ads_count > 0 else 0
    total_non_organic_height = 0

    if ads_count > 0:
        total_non_organic_height += ads_height
    if ai_overview:
        total_non_organic_height += ai_overview_height
    if local_pack:
        total_non_organic_height += local_pack_height
    if forums_present:
        total_non_organic_height += forums_height

    organic_1_y = total_non_organic_height + 80  # Base header offset
    scroll_depth = calculate_interaction_depth(organic_1_y)

    # Determine primary channel triage
    if ads_count >= 4 and ads_height >= 450:
        triage = ATFChannelTriage.SPONSORED_HEAVY
        reason = f"Sponsored ads occupy {ads_height}px ATF. Organic pushed to {organic_1_y}px ({scroll_depth} scrolls)."
    elif ai_overview and ai_overview_height >= 450:
        triage = ATFChannelTriage.AI_OVERVIEW_HYBRID
        reason = f"AI Overview occupies {ai_overview_height}px ATF. Target Reverse-RAG citation grounding."
    elif local_pack:
        triage = ATFChannelTriage.LOCAL_PACK_HYBRID
        reason = f"Local Map Pack occupies {local_pack_height}px ATF. Target GBP and localized NAP schema."
    elif forums_present:
        triage = ATFChannelTriage.DISCUSSION_FORUM
        reason = f"Reddit/Discussion carousel occupies {forums_height}px ATF. Target forum authority syndication."
    else:
        triage = ATFChannelTriage.ORGANIC_ATF
        reason = f"Organic #1 sits at {organic_1_y}px ({scroll_depth} scrolls). Pure on-page factor correlation has maximum ROI."

    return ATFLayoutProfile(
        query=query,
        ai_overview_present=ai_overview,
        ai_overview_height_px=ai_overview_height if ai_overview else 0,
        ads_count=ads_count,
        ads_height_px=ads_height,
        local_pack_present=local_pack,
        local_pack_height_px=local_pack_height if local_pack else 0,
        forums_present=forums_present,
        forums_height_px=forums_height if forums_present else 0,
        organic_1_pixel_depth=organic_1_y,
        interaction_depth_scrolls=scroll_depth,
        channel_triage=triage,
        triage_reason=reason,
    )
