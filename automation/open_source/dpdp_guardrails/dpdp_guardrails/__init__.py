"""
dpdp-guardrails
===============
Statutory Digital Personal Data Protection (DPDP) Act 2023 Guardrails for AI Systems.
Engineered by Chaman Shah (Principal AI Systems Architect at Elesium).

Components:
- AadhaarValidator: Verhoeff D5 dihedral checksum verification.
- PANValidator: Indian Income Tax PAN card structure & status verification.
- PIIMasker: High-throughput sub-10ms PII token redactor for LLM inference pipelines.
"""

from .verhoeff import AadhaarValidator, validate_verhoeff, compute_checksum
from .pan import PANValidator
from .masker import PIIMasker

__version__ = "0.1.0"
__author__ = "Chaman Shah <chaman@elesium.online>"
__all__ = [
    "AadhaarValidator",
    "validate_verhoeff",
    "compute_checksum",
    "PANValidator",
    "PIIMasker",
]


def dpdp_guardrail(text: str):
    """Convenience helper to scrub text using default DPDP guardrails."""
    masker = PIIMasker()
    return masker.mask_text(text)
