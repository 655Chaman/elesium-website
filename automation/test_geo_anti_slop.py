#!/usr/bin/env python3
"""
Unit test suite for Phase 2: Anti-Slop Content Sanitizer & Linter Engine.
"""

import pytest
from pathlib import Path
from automation.geo_anti_slop_sanitizer import GeoAntiSlopSanitizer, BANNED_PHRASES, SLOP_REPLACEMENTS


class TestGeoAntiSlopSanitizer:
    @pytest.fixture
    def sanitizer(self):
        return GeoAntiSlopSanitizer()

    def test_audit_detects_banned_phrases(self, sanitizer):
        sample_text = (
            "Delve into the realm of cutting-edge AI. "
            "Our seamless and transformative ecosystem will unleash your potential."
        )
        audit = sanitizer.audit_text(sample_text)
        assert audit["total_slop_count"] >= 5
        flagged = {item["phrase"] for item in audit["flagged_phrases"]}
        assert "delve" in flagged
        assert "realm" in flagged
        assert "cutting-edge" in flagged
        assert "seamless" in flagged or "unleash" in flagged
        assert audit["cleanliness_score"] < 90.0

    def test_audit_detects_em_dashes(self, sanitizer):
        sample_text = "Elesium provides sovereign AI—tested on H100 clusters—with sub-200ms TTFT."
        audit = sanitizer.audit_text(sample_text)
        assert audit["em_dash_count"] == 2

    def test_sanitize_replaces_em_dashes_and_slop(self, sanitizer):
        sample_text = "Unleash cutting-edge AI—delve into our robust ecosystem."
        sanitized, mutations = sanitizer.sanitize_text(sample_text)
        assert "—" not in sanitized
        assert " - " in sanitized
        assert "cutting-edge" not in sanitized.lower()
        assert "delve" not in sanitized.lower()
        assert mutations["slop_replaced"] >= 2
        assert mutations["em_dashes_replaced"] == 1

    def test_clean_technical_text_scores_perfect(self, sanitizer):
        pristine_text = (
            "Elesium provides air-gapped sovereign inference runtimes on dedicated NVIDIA H100 SXM5 clusters. "
            "Time-to-first-token is benchmarked at 148ms under DPDP Act 2023 Section 8(5) statutory requirements."
        )
        audit = sanitizer.audit_text(pristine_text)
        assert audit["total_slop_count"] == 0
        assert audit["em_dash_count"] == 0
        assert audit["cleanliness_score"] == 100.0
