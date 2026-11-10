"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE PACKAGE
=============================================================================
"""

from automation.cora_engine.config import (
    CORRELATION_SIGNIFICANCE_THRESHOLD,
    STRONG_CORRELATION_THRESHOLD,
    TOP_BENCHMARK_POSITIONS,
    VIEWPORT_HEIGHT_PX,
)
from automation.cora_engine.models import (
    SERPCompetitorRecord,
    ATFLayoutProfile,
    ATFChannelTriage,
    FactorCorrelationResult,
    FactorDeficit,
    DeficitReport,
    CoraOptimizationPlan,
    CoraTelemetrySummary,
)
from automation.cora_engine.correlation_math import (
    calculate_spearman_and_pearson,
    evaluate_factor_correlation,
)
from automation.cora_engine.atf_triage import (
    calculate_interaction_depth,
    triage_serp_layout,
)
from automation.cora_engine.factor_extractor import extract_algorithmic_factors
from automation.cora_engine.serp_harvester import SERPHarvester
from automation.cora_engine.deficit_calculator import DeficitCalculator
from automation.cora_engine.onpage_calibrator import OnPageCalibrator
from automation.cora_engine.pipeline import CoraCorrelationPipeline

__all__ = [
    "CORRELATION_SIGNIFICANCE_THRESHOLD",
    "STRONG_CORRELATION_THRESHOLD",
    "TOP_BENCHMARK_POSITIONS",
    "VIEWPORT_HEIGHT_PX",
    "SERPCompetitorRecord",
    "ATFLayoutProfile",
    "ATFChannelTriage",
    "FactorCorrelationResult",
    "FactorDeficit",
    "DeficitReport",
    "CoraOptimizationPlan",
    "CoraTelemetrySummary",
    "calculate_spearman_and_pearson",
    "evaluate_factor_correlation",
    "calculate_interaction_depth",
    "triage_serp_layout",
    "extract_algorithmic_factors",
    "SERPHarvester",
    "DeficitCalculator",
    "OnPageCalibrator",
    "CoraCorrelationPipeline",
]
