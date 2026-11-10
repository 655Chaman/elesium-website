"""
=============================================================================
GSC STRIKING DISTANCE ENGINE PACKAGE
=============================================================================
"""

from automation.gsc_engine.config import (
    SITE_URL,
    STRIKING_DISTANCE_POS_MIN,
    STRIKING_DISTANCE_POS_MAX,
    CAPSULE_MIN_WORDS,
    CAPSULE_MAX_WORDS,
)
from automation.gsc_engine.models import (
    GSCQueryRecord,
    StrikingDistanceOpportunity,
    IntentCategory,
    OptimizationPayload,
    TelemetrySummary,
)
from automation.gsc_engine.connector import GSCConnector
from automation.gsc_engine.striking_distance import StrikingDistanceAnalyzer
from automation.gsc_engine.content_synthesizer import ContentSynthesizer, count_words
from automation.gsc_engine.html_injector import HTMLInjector
from automation.gsc_engine.pipeline import StrikingDistancePipeline

__all__ = [
    "SITE_URL",
    "STRIKING_DISTANCE_POS_MIN",
    "STRIKING_DISTANCE_POS_MAX",
    "CAPSULE_MIN_WORDS",
    "CAPSULE_MAX_WORDS",
    "GSCQueryRecord",
    "StrikingDistanceOpportunity",
    "IntentCategory",
    "OptimizationPayload",
    "TelemetrySummary",
    "GSCConnector",
    "StrikingDistanceAnalyzer",
    "ContentSynthesizer",
    "count_words",
    "HTMLInjector",
    "StrikingDistancePipeline",
]
