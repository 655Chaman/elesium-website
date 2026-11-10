"""
=============================================================================
GSC STRIKING DISTANCE ENGINE — BRIAN KATO RE2 REGEX PATTERN CLASSIFIER
=============================================================================
Classification: RE2 Regex Intent Classification for AI Search Behaviors
Reference: Brian Kato (SEO Rockstars 2026 Day 2 - GSC Pattern Detection)
=============================================================================
"""

import re
from typing import Tuple, Optional
from automation.gsc_engine.models import IntentCategory

# Brian Kato RE2 Regex Patterns for Google Search Console & AI Search Behavior
RE2_PATTERNS = {
    IntentCategory.AI_CONVERSATIONAL: re.compile(
        r"^(how|what|why|who|where|when|can|does|which|is|are|should|will|would)\b",
        re.IGNORECASE,
    ),
    IntentCategory.COMMERCIAL_INVESTIGATION: re.compile(
        r"\b(vs|versus|compare|comparison|alternative|alternatives|best|top|pricing|cost|roi|review|breakdown|calculator)\b",
        re.IGNORECASE,
    ),
    IntentCategory.TECHNICAL_ARCHITECTURE: re.compile(
        r"\b(architecture|kernel|latency|throughput|pagedattention|vllm|cuda|triton|snomed|purdue|snort|suricata|scada|modbus|hsm|merkle|egress|air-gapped|fp8|quantization|h100|nvlink|dnp3|pcie|infiniband|benchmark|sla)\b",
        re.IGNORECASE,
    ),
    IntentCategory.ENTERPRISE_PROCUREMENT: re.compile(
        r"\b(agency|vendor|provider|contractor|consultancy|enterprise|solution|deployment|bangalore|mumbai|delhi|india|rbi|dpdp|compliance|audit|soc2|iso27001|gdpr)\b",
        re.IGNORECASE,
    ),
}

# Priority ordering for pattern matching:
# 1. AI Conversational: Queries starting with question interrogatives (How, What, Why, Can...)
# 2. Commercial Investigation: Comparative/evaluation terms (vs, best, pricing, alternative...)
# 3. Technical Architecture: Deep engineering/kernel terms (kernel, latency, pagedattention...)
# 4. Enterprise Procurement: RFP & provider terms (agency, contractor, rbi, dpdp...)
INTENT_PRECEDENCE = [
    IntentCategory.AI_CONVERSATIONAL,
    IntentCategory.COMMERCIAL_INVESTIGATION,
    IntentCategory.TECHNICAL_ARCHITECTURE,
    IntentCategory.ENTERPRISE_PROCUREMENT,
]

# Intent commercial multiplier for Striking Distance priority ranking
INTENT_MULTIPLIERS = {
    IntentCategory.TECHNICAL_ARCHITECTURE: 1.25,
    IntentCategory.ENTERPRISE_PROCUREMENT: 1.20,
    IntentCategory.COMMERCIAL_INVESTIGATION: 1.15,
    IntentCategory.AI_CONVERSATIONAL: 1.05,
    IntentCategory.INFORMATIONAL: 1.00,
}


def classify_query(query: str) -> Tuple[IntentCategory, Optional[str]]:
    """
    Classifies a search query into an intent category using Brian Kato's RE2 regex patterns.
    Returns (IntentCategory, matched_pattern_str).
    """
    clean_query = query.strip()
    for intent in INTENT_PRECEDENCE:
        pattern = RE2_PATTERNS[intent]
        match = pattern.search(clean_query)
        if match:
            return intent, match.group(0)

    # Check AI Conversational if not already caught
    conv_match = RE2_PATTERNS[IntentCategory.AI_CONVERSATIONAL].search(clean_query)
    if conv_match:
        return IntentCategory.AI_CONVERSATIONAL, conv_match.group(0)

    return IntentCategory.INFORMATIONAL, None


def get_intent_multiplier(intent: IntentCategory) -> float:
    """Returns the commercial multiplier for a given query intent."""
    return INTENT_MULTIPLIERS.get(intent, 1.0)
