"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — DEFICIT CALCULATOR
=============================================================================
Classification: Multi-Factor Correlation & Deficit Vector Calculator
Methodology: Ted Kubaitis (Cora Deficit Tuning & Factor Prescription Engine)
=============================================================================
"""

import math
from typing import List, Dict, Any, Tuple
from automation.cora_engine.config import (
    CORRELATION_SIGNIFICANCE_THRESHOLD,
    TOP_BENCHMARK_POSITIONS,
)
from automation.cora_engine.models import (
    SERPCompetitorRecord,
    ATFLayoutProfile,
    FactorCorrelationResult,
    FactorDeficit,
    DeficitReport,
)
from automation.cora_engine.correlation_math import evaluate_factor_correlation


class DeficitCalculator:
    """
    Computes statistical correlations across all SERP factors, isolates significant
    ranking factors, and calculates the mathematical deficit between Elesium and Top 3.
    """

    def __init__(self, sig_threshold: float = CORRELATION_SIGNIFICANCE_THRESHOLD):
        self.sig_threshold = sig_threshold

    def analyze_deficits(
        self,
        slug: str,
        query: str,
        current_position: float,
        atf_profile: ATFLayoutProfile,
        competitors: List[SERPCompetitorRecord],
        elesium_factors: Dict[str, float],
    ) -> DeficitReport:
        """
        Runs multi-factor statistical correlation across all competitor records,
        identifies significant ranking factors, and calculates exact factor deficits.
        """
        all_factor_keys = list(elesium_factors.keys())
        ranks = [c.rank for c in competitors]

        correlations: List[FactorCorrelationResult] = []
        deficits: List[FactorDeficit] = []
        critical_tuning_actions: List[str] = []

        # Isolate Top 3 competitors
        top_3_comps = [c for c in competitors if c.rank <= TOP_BENCHMARK_POSITIONS]

        for key in all_factor_keys:
            factor_vals = [c.factors.get(key, 0.0) for c in competitors]

            # 1. Run statistical correlation
            corr = evaluate_factor_correlation(
                factor_name=key,
                factor_values=factor_vals,
                ranks=ranks,
                sig_threshold=self.sig_threshold,
            )
            correlations.append(corr)

            # 2. If statistically significant and positively correlated, compute deficit
            if corr.is_significant and corr.spearman_rs > 0:
                top_3_vals = [c.factors.get(key, 0.0) for c in top_3_comps]
                top_3_mean = (sum(top_3_vals) / len(top_3_vals)) if top_3_vals else 0.0
                elesium_val = elesium_factors.get(key, 0.0)
                diff = top_3_mean - elesium_val

                is_def = diff > 0.01
                tuning_action = self._derive_tuning_action(key, diff, top_3_mean, elesium_val)

                deficits.append(
                    FactorDeficit(
                        factor_name=key,
                        top_3_benchmark=round(top_3_mean, 2),
                        elesium_current=round(elesium_val, 2),
                        deficit=round(max(0.0, diff), 2),
                        is_deficit=is_def,
                        tuning_action=tuning_action,
                    )
                )

                if is_def and tuning_action:
                    critical_tuning_actions.append(tuning_action)

        # Sort deficits descending by absolute deficit amount
        deficits.sort(key=lambda d: d.deficit, reverse=True)

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
