"""
=============================================================================
GSC STRIKING DISTANCE ENGINE - DATA MODELS & TYPES
=============================================================================
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import List, Dict, Any, Optional


class IntentCategory(str, Enum):
    AI_CONVERSATIONAL = "AI_CONVERSATIONAL"
    COMMERCIAL_INVESTIGATION = "COMMERCIAL_INVESTIGATION"
    TECHNICAL_ARCHITECTURE = "TECHNICAL_ARCHITECTURE"
    ENTERPRISE_PROCUREMENT = "ENTERPRISE_PROCUREMENT"
    INFORMATIONAL = "INFORMATIONAL"


@dataclass
class GSCQueryRecord:
    query: str
    page: str
    clicks: int
    impressions: int
    ctr: float
    position: float
    intent: IntentCategory = IntentCategory.INFORMATIONAL
    matched_intent_pattern: Optional[str] = None


class GSCAuthenticationError(Exception):
    """Raised when GSC OAuth2 or Service Account authentication or token refresh fails."""
    pass


@dataclass
class StrikingDistanceOpportunity:
    query: str
    page: str
    slug: str
    clicks: int
    impressions: int
    ctr: float
    position: float
    intent: IntentCategory
    opportunity_score: float
    unrealized_clicks: float
    rank_distance_weight: float
    intent_multiplier: float
    projected_top3_clicks: int
    matched_intent_pattern: Optional[str] = None
    tier: int = 2
    expected_ctr: float = 0.285
    delta_ctr: float = 0.0


@dataclass
class OptimizationPayload:
    slug: str
    page_url: str
    primary_query: str
    secondary_queries: List[str]
    answer_capsule_html: str
    answer_capsule_word_count: int
    technical_spec_callout_html: str
    faq_section_html: str
    json_ld_schema: Dict[str, Any]
    container_section_html: str


@dataclass
class TelemetrySummary:
    timestamp: str
    total_gsc_queries_ingested: int
    total_striking_distance_queries: int
    total_impressions_pool: int
    total_unrealized_clicks: int
    projected_monthly_traffic_uplift: int
    total_pages_optimized: int
    top_opportunities: List[Dict[str, Any]] = field(default_factory=list)
