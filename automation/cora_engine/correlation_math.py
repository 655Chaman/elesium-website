"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — STATISTICAL CORRELATION MATH
=============================================================================
Classification: Spearman Rank & Pearson Correlation Engine
Methodology: Ted Kubaitis (Cora Statistical Significance & Deficit Formulas)
=============================================================================
"""

import math
from typing import List, Tuple, Dict
from automation.cora_engine.config import (
    CORRELATION_SIGNIFICANCE_THRESHOLD,
    STRONG_CORRELATION_THRESHOLD,
)
from automation.cora_engine.models import FactorCorrelationResult


def calculate_spearman_and_pearson(
    factor_values: List[float],
    ranks: List[int],
) -> Tuple[float, float, float]:
    """
    Computes Spearman rank correlation (rs) and Pearson correlation (r)
    between factor values and ranking dominance score.
    
    Ranking dominance score = (N + 1) - Rank, so:
    rs > 0 means: More of this factor directly correlates with higher Google ranking.
    rs < 0 means: More of this factor correlates with lower ranking (over-optimization / penalty).
    """
    n = len(factor_values)
    if n < 3:
        return 0.0, 0.0, 1.0

    # If all factor values are identical, variance is 0 and correlation is undefined
    if len(set(factor_values)) <= 1:
        return 0.0, 0.0, 1.0

    # Invert rank into dominance score (Rank 1 -> N, Rank N -> 1)
    dominance_scores = [(n + 1) - r for r in ranks]

    # Try scipy first if available
    try:
        from scipy import stats
        res_spearman = stats.spearmanr(factor_values, dominance_scores)
        spearman_rs = float(res_spearman.statistic) if hasattr(res_spearman, "statistic") else float(res_spearman[0])
        p_val = float(res_spearman.pvalue) if hasattr(res_spearman, "pvalue") else float(res_spearman[1])

        res_pearson = stats.pearsonr(factor_values, dominance_scores)
        pearson_r = float(res_pearson.statistic) if hasattr(res_pearson, "statistic") else float(res_pearson[0])

        if math.isnan(spearman_rs):
            spearman_rs = 0.0
        if math.isnan(pearson_r):
            pearson_r = 0.0
        if math.isnan(p_val):
            p_val = 1.0

        return round(spearman_rs, 4), round(pearson_r, 4), round(p_val, 4)
    except Exception:
        pass

    # Pure Python fallback
    # 1. Pearson r
    mean_x = sum(factor_values) / n
    mean_y = sum(dominance_scores) / n

    cov_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(factor_values, dominance_scores))
    var_x = sum((x - mean_x) ** 2 for x in factor_values)
    var_y = sum((y - mean_y) ** 2 for y in dominance_scores)

    if var_x == 0 or var_y == 0:
        pearson_r = 0.0
    else:
        pearson_r = cov_xy / math.sqrt(var_x * var_y)

    # 2. Spearman rs via rank ordering
    def get_ranks(vals: List[float]) -> List[float]:
        sorted_indices = sorted(range(len(vals)), key=lambda i: vals[i])
        ranks_arr = [0.0] * len(vals)
        i = 0
        while i < len(vals):
            j = i
            while j < len(vals) - 1 and vals[sorted_indices[j]] == vals[sorted_indices[j + 1]]:
                j += 1
            avg_rank = (i + j + 2) / 2.0
            for k in range(i, j + 1):
                ranks_arr[sorted_indices[k]] = avg_rank
            i = j + 1
        return ranks_arr

    rank_x = get_ranks(factor_values)
    rank_y = get_ranks(dominance_scores)

    mean_rx = sum(rank_x) / n
    mean_ry = sum(rank_y) / n

    cov_r = sum((rx - mean_rx) * (ry - mean_ry) for rx, ry in zip(rank_x, rank_y))
    var_rx = sum((rx - mean_rx) ** 2 for rx in rank_x)
    var_ry = sum((ry - mean_ry) ** 2 for ry in rank_y)

    if var_rx == 0 or var_ry == 0:
        spearman_rs = 0.0
    else:
        spearman_rs = cov_r / math.sqrt(var_rx * var_ry)

    # 3. Two-tailed t-test p-value approximation
    if abs(spearman_rs) >= 1.0:
        p_val = 0.0
    elif n > 2:
        t_stat = spearman_rs * math.sqrt((n - 2) / (1.0 - spearman_rs ** 2))
        # Simple normal CDF tail approximation for degrees of freedom n-2
        z = abs(t_stat)
        p_val = 2.0 * (1.0 - 0.5 * (1.0 + math.erf(z / math.sqrt(2))))
    else:
        p_val = 1.0

    return round(spearman_rs, 4), round(pearson_r, 4), round(max(0.0, min(1.0, p_val)), 4)


def evaluate_factor_correlation(
    factor_name: str,
    factor_values: List[float],
    ranks: List[int],
    sig_threshold: float = CORRELATION_SIGNIFICANCE_THRESHOLD,
) -> FactorCorrelationResult:
    """
    Evaluates whether a factor has statistical correlation with SERP rank.
    """
    rs, r, p_val = calculate_spearman_and_pearson(factor_values, ranks)
    is_sig = abs(rs) >= sig_threshold and p_val < 0.20
    direction = "POSITIVE_CORRELATION" if rs > 0 else "NEGATIVE_CORRELATION"

    return FactorCorrelationResult(
        factor_name=factor_name,
        spearman_rs=rs,
        pearson_r=r,
        p_value=p_val,
        is_significant=is_sig,
        correlation_direction=direction,
    )
