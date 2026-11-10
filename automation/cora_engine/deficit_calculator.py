"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — DEFICIT CALCULATOR
=============================================================================
Classification: Multi-Factor Correlation & Deficit Vector Calculator
Methodology: Ted Kubaitis (Cora Deficit Tuning & Factor Prescription Engine)
Remediated: Outlier rejection in Top 3 baseline, Winsorization capping,
            negative correlation over-optimization pruning, FDR correction,
            and Action Priority Score (APS) ranking.
=============================================================================
"""

import math
import logging
from typing import List, Dict, Any, Tuple, Optional
from automation.cora_engine.config import (
    CORRELATION_SIGNIFICANCE_THRESHOLD,
    NEGATIVE_CORRELATION_THRESHOLD,
    ALPHA_SIGNIFICANCE,
    FDR_BH_Q_THRESHOLD,
    TOP_BENCHMARK_POSITIONS,
    MAX_DEFICIT_WORD_CAP,
)
from automation.cora_engine.models import (
    SERPCompetitorRecord,
    ATFLayoutProfile,
    FactorCorrelationResult,
    FactorDeficit,
    DeficitReport,
)
from automation.cora_engine.correlation_math import (
    evaluate_factor_correlation,
    apply_benjamini_hochberg,
    calculate_action_priority_score,
)

logger = logging.getLogger(__name__)


def calculate_robust_top3_benchmark(
    top_3_vals: List[float],
    factor_name: str = "",
) -> Tuple[float, bool]:
    """
    Computes an outlier-resistant benchmark across Top 3 competitors.
    If max(top_3_vals) > 2.0 * median(top_3_vals) and median > 0:
        Rejects extreme single-competitor outlier and uses median/trimmed mean.
    Returns (benchmark_value, is_outlier_filtered).
    """
    if not top_3_vals:
        return 0.0, False

    sorted_vals = sorted(top_3_vals)
    n = len(sorted_vals)
    if n == 1:
        median_val = sorted_vals[0]
    elif n == 2:
        median_val = (sorted_vals[0] + sorted_vals[1]) / 2.0
    else:
        median_val = sorted_vals[n // 2]

    is_outlier = False
    if n >= 3 and median_val > 0 and (sorted_vals[-1] > 2.0 * median_val):
        is_outlier = True
        # Trim the max outlier and average the remaining competitors
        trimmed = sorted_vals[:-1]
        benchmark = sum(trimmed) / len(trimmed)
    else:
        benchmark = sum(sorted_vals) / n

    return round(benchmark, 2), is_outlier


def apply_winsorization_cap(
    deficit: float,
    factor_name: str,
    max_word_cap: float = MAX_DEFICIT_WORD_CAP,
) -> float:
    """
    Prevents single-pass prescriptions from recommending absurd page bloat.
    """
    if factor_name == "body_word_count":
        return min(deficit, max_word_cap)
    elif factor_name == "exact_kw_in_h2":
        return min(deficit, 6.0)
    elif factor_name == "table_row_count":
        return min(deficit, 16.0)
    elif factor_name == "outbound_statutory_citations":
        return min(deficit, 6.0)
    elif factor_name == "schema_entities_count":
        return min(deficit, 8.0)
    return deficit


class DeficitCalculator:
    """
    Computes statistical correlations across all SERP factors, isolates significant
    ranking factors, and calculates the mathematical deficit between Elesium and Top 3.
    """

    def __init__(
        self,
        sig_threshold: float = CORRELATION_SIGNIFICANCE_THRESHOLD,
        alpha: float = ALPHA_SIGNIFICANCE,
        fdr_q: float = FDR_BH_Q_THRESHOLD,
    ):
        self.sig_threshold = sig_threshold
        self.alpha = alpha
        self.fdr_q = fdr_q

    def analyze_deficits(
        self,
        slug: str,
        query: str,
        current_position: float,
        atf_profile: ATFLayoutProfile,
        competitors: List[SERPCompetitorRecord],
        elesium_factors: Dict[str, float],
        fdr_correction: bool = True,
    ) -> DeficitReport:
        """
        Runs multi-factor statistical correlation across all competitor records,
        identifies significant ranking factors, and calculates exact factor deficits.
        """
        all_factor_keys = list(elesium_factors.keys())
        ranks = [c.rank for c in competitors]

        raw_correlations: List[FactorCorrelationResult] = []
        deficits: List[FactorDeficit] = []
        critical_tuning_actions: List[str] = []

        # Isolate Top 3 competitors
        top_3_comps = [c for c in competitors if c.rank <= TOP_BENCHMARK_POSITIONS]

        # 1. Run statistical correlation for all factors
        for key in all_factor_keys:
            factor_vals = [c.factors.get(key, 0.0) for c in competitors]
            corr = evaluate_factor_correlation(
                factor_name=key,
                factor_values=factor_vals,
                ranks=ranks,
                sig_threshold=self.sig_threshold,
                alpha=self.alpha,
            )
            raw_correlations.append(corr)

        # 2. Apply Benjamini-Hochberg False Discovery Rate procedure if requested
        if fdr_correction and len(raw_correlations) > 1:
            correlations = apply_benjamini_hochberg(
                raw_correlations,
                fdr_q=self.fdr_q,
                alpha=self.alpha,
                sig_threshold=self.sig_threshold,
            )
        else:
            correlations = raw_correlations

        # 3. Evaluate deficits and over-optimization risks
        for corr in correlations:
            key = corr.factor_name
            top_3_vals = [c.factors.get(key, 0.0) for c in top_3_comps]
            top_3_benchmark, outlier_rejected = calculate_robust_top3_benchmark(top_3_vals, key)
            elesium_val = elesium_factors.get(key, 0.0)

            # Positive correlation (more = higher rank)
            # Accept if significant via FDR or uncorrected alpha + threshold
            is_significant_driver = corr.is_significant or (
                corr.p_value <= self.alpha and abs(corr.spearman_rs) >= self.sig_threshold
            )

            if is_significant_driver and corr.spearman_rs > 0:
                raw_diff = top_3_benchmark - elesium_val
                capped_diff = apply_winsorization_cap(max(0.0, raw_diff), key)
                is_def = capped_diff > 0.01
                tuning_action = self._derive_tuning_action(key, capped_diff, top_3_benchmark, elesium_val)

                aps = calculate_action_priority_score(
                    spearman_rs=corr.spearman_rs,
                    p_value=corr.p_value,
                    deficit=capped_diff,
                    benchmark=top_3_benchmark,
                )

                deficits.append(
                    FactorDeficit(
                        factor_name=key,
                        top_3_benchmark=round(top_3_benchmark, 2),
                        elesium_current=round(elesium_val, 2),
                        deficit=round(capped_diff, 2),
                        is_deficit=is_def,
                        tuning_action=tuning_action,
                        action_priority_score=aps,
                        spearman_rs=corr.spearman_rs,
                        p_value=corr.p_value,
                        is_penalty_risk=False,
                    )
                )

                if is_def and tuning_action:
                    critical_tuning_actions.append(tuning_action)

            # Negative correlation (over-optimization / penalty risk: rs <= -0.25)
            elif is_significant_driver and corr.spearman_rs <= NEGATIVE_CORRELATION_THRESHOLD:
                surplus = elesium_val - top_3_benchmark
                if surplus > 0.01:
                    tuning_action = self._derive_pruning_action(key, surplus, top_3_benchmark, elesium_val)
                    aps = calculate_action_priority_score(
                        spearman_rs=corr.spearman_rs,
                        p_value=corr.p_value,
                        deficit=surplus,
                        benchmark=top_3_benchmark,
                    )

                    deficits.append(
                        FactorDeficit(
                            factor_name=key,
                            top_3_benchmark=round(top_3_benchmark, 2),
                            elesium_current=round(elesium_val, 2),
                            deficit=round(-surplus, 2),
                            is_deficit=False,
                            tuning_action=tuning_action,
                            action_priority_score=aps,
                            spearman_rs=corr.spearman_rs,
                            p_value=corr.p_value,
                            is_penalty_risk=True,
                        )
                    )

                    if tuning_action:
                        critical_tuning_actions.append(tuning_action)

        # Sort deficits descending by Action Priority Score (APS), secondary by raw deficit magnitude
        deficits.sort(key=lambda d: (d.action_priority_score, abs(d.deficit)), reverse=True)

        return DeficitReport(
            slug=slug,
            query=query,
            current_estimated_position=current_position,
            atf_profile=atf_profile,
            deficits=deficits,
            critical_deficits_count=len(critical_tuning_actions),
            recommended_tuning_actions=critical_tuning_actions,
        )

    def _derive_tuning_action(
        self, factor_name: str, diff: float, benchmark: float, current: float
    ) -> str:
        """Formulates an exact, non-generic mathematical prescription."""
        if diff <= 0.01:
            return ""

        if factor_name == "body_word_count":
            return f"Expand body copy by +{math.ceil(diff)} words to match Top 3 average ({math.ceil(benchmark)} words)."
        elif factor_name == "exact_kw_in_h2":
            return f"Inject +{math.ceil(diff)} H2 heading(s) containing exact/LSI keyword tokens."
        elif factor_name == "table_row_count":
            return f"Expand empirical benchmark tables by +{math.ceil(diff)} rows."
        elif factor_name == "outbound_statutory_citations":
            return f"Add +{math.ceil(diff)} outbound citation(s) to official statutory authorities."
        elif factor_name == "schema_entities_count":
            return f"Consolidate +{math.ceil(diff)} structured entity node(s) into the monolithic @graph."
        elif factor_name == "exact_kw_in_bold":
            return f"Emphasize +{math.ceil(diff)} keyword instance(s) using <strong> tags."
        elif factor_name == "table_count":
            return f"Add +{math.ceil(diff)} comparative technical data table."
        else:
            return f"Increase '{factor_name}' by +{round(diff, 2)} (Target: {round(benchmark, 2)}, Current: {round(current, 2)})."

    def _derive_pruning_action(
        self, factor_name: str, surplus: float, benchmark: float, current: float
    ) -> str:
        """Formulates pruning/reduction prescription to mitigate over-optimization penalties."""
        prune_amount = math.ceil(surplus)
        if factor_name == "exact_kw_in_h2":
            return f"Reduce 'exact_kw_in_h2' by -{prune_amount} to eliminate over-optimization penalty risk (Top 3: {round(benchmark, 1)}, Current: {round(current, 1)})."
        elif factor_name == "exact_kw_in_bold":
            return f"Reduce 'exact_kw_in_bold' by -{prune_amount} keyword instance(s) to resolve algorithmic spam penalty."
        elif factor_name == "dom_element_count":
            return f"Prune bloated DOM tree by -{prune_amount} elements to match streamlined Top 3 architecture."
        else:
            return f"Reduce '{factor_name}' by -{round(surplus, 2)} to mitigate over-optimization risk (Target: {round(benchmark, 2)}, Current: {round(current, 2)})."
