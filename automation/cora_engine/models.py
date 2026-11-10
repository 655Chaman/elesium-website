"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — DATA MODELS
=============================================================================
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Any, Optional


class ATFChannelTriage(str, Enum):
    ORGANIC_ATF = "ORGANIC_ATF"
    AI_OVERVIEW_HYBRID = "AI_OVERVIEW_HYBRID"
    LOCAL_PACK_HYBRID = "LOCAL_PACK_HYBRID"
    DISCUSSION_FORUM = "DISCUSSION_FORUM"
    SPONSORED_HEAVY = "SPONSORED_HEAVY"


@dataclass
class SERPCompetitorRecord:
    rank: int
    url: str
    title: str
    snippet: str
    pixel_y_offset: int
    factors: Dict[str, float] = field(default_factory=dict)


@dataclass
class ATFLayoutProfile:
    query: str
    ai_overview_present: bool
    ai_overview_height_px: int
    ads_count: int
    ads_height_px: int
    local_pack_present: bool
    local_pack_height_px: int
    forums_present: bool
    forums_height_px: int
    organic_1_pixel_depth: int
    interaction_depth_scrolls: int
    channel_triage: ATFChannelTriage
    triage_reason: str


@dataclass
class FactorCorrelationResult:
    factor_name: str
    spearman_rs: float
    pearson_r: float
    p_value: float
    is_significant: bool
    correlation_direction: str  # "POSITIVE_CORRELATION" (more = higher rank) or "NEGATIVE_CORRELATION"
    fdr_significant: bool = False
    adjusted_p_value: float = 1.0


@dataclass
class FactorDeficit:
    factor_name: str
    top_3_benchmark: float
    elesium_current: float
    deficit: float
    is_deficit: bool
    tuning_action: str
    action_priority_score: float = 0.0
    spearman_rs: float = 0.0
    p_value: float = 1.0
    is_penalty_risk: bool = False


@dataclass
class DeficitReport:
    slug: str
    query: str
    current_estimated_position: float
    atf_profile: ATFLayoutProfile
    deficits: List[FactorDeficit]
    critical_deficits_count: int
    recommended_tuning_actions: List[str]


@dataclass
class CoraOptimizationPlan:
    slug: str
    page_url: str
    query: str
    deficit_report: DeficitReport
    calibrated_html_section: str
    words_added: int
    h2_added: int
    statutory_links_added: int


@dataclass
class CoraTelemetrySummary:
    timestamp: str
    total_queries_analyzed: int
    total_competitors_measured: int
    total_factors_evaluated: int
    total_significant_factors_isolated: int
    total_pages_calibrated: int
    aggregate_deficits_resolved: int
    top_correlations: List[Dict[str, Any]] = field(default_factory=list)
    top_deficit_interventions: List[Dict[str, Any]] = field(default_factory=list)
