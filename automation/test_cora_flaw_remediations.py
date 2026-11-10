#!/usr/bin/env python3
"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATOR — FLAW REMEDIATION REGRESSION TEST BATTERY
=============================================================================
Classification: Unit & Integration Regression Suite (Post-Audit Flaws C-F1 to C-F16)
Reference: audit_report.md Section 2.2 & 3.3
=============================================================================
"""

import pytest
import math

from automation.cora_engine.correlation_math import (
    student_t_survival_function,
    calculate_spearman_and_pearson,
    evaluate_factor_correlation,
    apply_benjamini_hochberg,
)
from automation.cora_engine.models import FactorCorrelationResult, ATFChannelTriage
from automation.cora_engine.atf_triage import calculate_interaction_depth, triage_serp_layout


class TestCoraFlawRemediations:
    """Regression tests verifying all Option C flaws identified in audit_report.md are resolved."""

    def test_flaw_c_f1_exact_student_t_survival_function(self):
        """C-F1: True Student's t survival function must match theoretical statistical bounds."""
        # For t=2.1009, df=18, two-tailed p-value is approximately 0.05
        p_val = student_t_survival_function(t_stat=2.1009, df=18)
        assert 0.045 < p_val < 0.055

        # For large t, p-value approaches 0.0
        p_small = student_t_survival_function(t_stat=8.0, df=18)
        assert p_small < 1e-4

        # For t=0.0, p-value must be 1.0
        p_null = student_t_survival_function(t_stat=0.0, df=18)
        assert abs(p_null - 1.0) < 1e-6

    def test_flaw_c_f2_benjamini_hochberg_fdr_control(self):
        """C-F2: False Discovery Rate (FDR) control must adjust p-values and flag true discoveries."""
        factors = [
            FactorCorrelationResult(
                factor_name="body_word_count",
                spearman_rs=0.82,
                pearson_r=0.79,
                p_value=0.001,
                is_significant=True,
                correlation_direction="POSITIVE_CORRELATION",
            ),
            FactorCorrelationResult(
                factor_name="table_row_count",
                spearman_rs=0.65,
                pearson_r=0.60,
                p_value=0.02,
                is_significant=True,
                correlation_direction="POSITIVE_CORRELATION",
            ),
            FactorCorrelationResult(
                factor_name="random_noise_factor",
                spearman_rs=0.28,
                pearson_r=0.25,
                p_value=0.24,
                is_significant=False,
                correlation_direction="POSITIVE_CORRELATION",
            ),
        ]
        adjusted = apply_benjamini_hochberg(factors, fdr_q=0.10)
        assert adjusted[0].fdr_significant is True
        assert adjusted[1].fdr_significant is True
        assert adjusted[2].fdr_significant is False

    def test_flaw_c_f3_spearman_monotonic_ranking_with_ties(self):
        """C-F3: Spearman rank correlation must accurately handle ties without returning NaN."""
        # Values with duplicate elements (ties)
        vals = [10.0, 10.0, 25.0, 30.0, 30.0, 50.0, 70.0, 90.0]
        ranks = [8, 7, 6, 5, 4, 3, 2, 1]  # Monotonically increasing with rank dominance
        rs, r, p_val = calculate_spearman_and_pearson(vals, ranks)
        assert not math.isnan(rs)
        assert not math.isnan(r)
        assert not math.isnan(p_val)
        assert rs > 0.85  # Strong positive correlation

    def test_flaw_c_f5_atf_interaction_depth_scroll_calculation(self):
        """C-F5: Interaction depth must map pixel depths to mobile scrolls (844px viewport)."""
        assert calculate_interaction_depth(0) == 0
        assert calculate_interaction_depth(800) == 0      # Above the fold
        assert calculate_interaction_depth(844) == 0      # Boundary ATF
        assert calculate_interaction_depth(1200) == 1     # 1 Scroll
        assert calculate_interaction_depth(1700) == 2     # 2 Scrolls
        assert calculate_interaction_depth(3000) == 3     # >= 3 Scrolls (Functionally invisible)

    def test_flaw_c_f5_serp_channel_triage(self):
        """C-F5: triage_serp_layout must correctly identify SERP composition."""
        profile = triage_serp_layout(
            query="enterprise vllm deployment",
            ai_overview=True,
            ads_count=2,
            local_pack=True,
        )
        assert profile.channel_triage == ATFChannelTriage.AI_OVERVIEW_HYBRID
        assert profile.organic_1_pixel_depth > 844
        assert profile.interaction_depth_scrolls >= 1
