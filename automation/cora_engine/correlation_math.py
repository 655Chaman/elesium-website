"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — STATISTICAL CORRELATION MATH
=============================================================================
Classification: Spearman Rank & Pearson Correlation Engine with Student's t CDF
Methodology: Ted Kubaitis (Cora Statistical Significance & Deficit Formulas)
Remediated: Exact Student's t survival function, Benjamini-Hochberg FDR,
            strict pairwise input validation, and Action Priority Scoring.
=============================================================================
"""

import math
import logging
from typing import List, Tuple, Dict, Optional
from automation.cora_engine.config import (
    CORRELATION_SIGNIFICANCE_THRESHOLD,
    STRONG_CORRELATION_THRESHOLD,
    ALPHA_SIGNIFICANCE,
    FDR_BH_Q_THRESHOLD,
    MIN_SAMPLE_SIZE,
)
from automation.cora_engine.models import FactorCorrelationResult

logger = logging.getLogger(__name__)


def betacf(a: float, b: float, x: float, max_iter: int = 200, eps: float = 1e-15) -> float:
    """
    Continued fraction for the regularized incomplete beta function via Lentz's method.
    """
    qab = a + b
    qap = a + 1.0
    qam = a - 1.0
    c = 1.0
    d = 1.0 - qab * x / qap
    if abs(d) < 1e-30:
        d = 1e-30
    d = 1.0 / d
    h = d
    for m in range(1, max_iter + 1):
        m2 = 2 * m
        # Even step
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1.0 + aa * d
        if abs(d) < 1e-30:
            d = 1e-30
        c = 1.0 + aa / c
        if abs(c) < 1e-30:
            c = 1e-30
        d = 1.0 / d
        h *= d * c

        # Odd step
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1.0 + aa * d
        if abs(d) < 1e-30:
            d = 1e-30
        c = 1.0 + aa / c
        if abs(c) < 1e-30:
            c = 1e-30
        d = 1.0 / d
        del_h = d * c
        h *= del_h
        if abs(del_h - 1.0) < eps:
            break
    return h


def regularized_incomplete_beta(x: float, a: float, b: float) -> float:
    """
    Computes the regularized incomplete beta function I_x(a, b).
    Exact pure-Python implementation without third-party dependencies.
    """
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    # Use symmetry transformation if x > (a + 1) / (a + b + 2)
    if x > (a + 1.0) / (a + b + 2.0):
        return 1.0 - regularized_incomplete_beta(1.0 - x, b, a)

    lbeta = math.lgamma(a) + math.lgamma(b) - math.lgamma(a + b)
    front = math.exp(a * math.log(x) + b * math.log(1.0 - x) - lbeta) / a
    return front * betacf(a, b, x)


def student_t_survival_function(t_stat: float, df: int) -> float:
    """
    Computes exact two-tailed p-value for Student's t distribution with df degrees of freedom.
    Uses scipy.stats.t.sf if available; otherwise uses exact pure Python incomplete beta formula:
    p = I_{df / (df + t^2)}(df / 2, 1 / 2)
    """
    if df <= 0:
        return 1.0
    abs_t = abs(t_stat)
    if abs_t < 1e-15:
        return 1.0

    try:
        from scipy import stats
        return float(2.0 * stats.t.sf(abs_t, df=df))
    except Exception:
        pass

    x = df / (df + abs_t ** 2)
    return regularized_incomplete_beta(x, df / 2.0, 0.5)


def clean_paired_inputs(
    factor_values: List[float],
    ranks: List[int],
    min_sample_size: int = MIN_SAMPLE_SIZE,
) -> Tuple[List[float], List[float], Optional[str]]:
    """
    Validates and cleans paired factor values and ranks:
    1. Rejects if inputs are None or lengths differ.
    2. Filters out None, NaN, and Infs synchronously across pairs.
    3. Requires at least min_sample_size (default: 5) valid pairs.
    4. Validates non-zero variance.
    Returns (cleaned_factors, cleaned_ranks, error_message).
    """
    if factor_values is None or ranks is None:
        return [], [], "Inputs cannot be None"
    if len(factor_values) != len(ranks):
        return [], [], f"Mismatched input lengths: {len(factor_values)} factor values vs {len(ranks)} ranks"

    cleaned_x: List[float] = []
    cleaned_y: List[float] = []

    for x, y in zip(factor_values, ranks):
        if x is None or y is None:
            continue
        try:
            fx = float(x)
            fy = float(y)
        except (TypeError, ValueError):
            continue
        if math.isnan(fx) or math.isnan(fy) or math.isinf(fx) or math.isinf(fy):
            continue
        cleaned_x.append(fx)
        cleaned_y.append(fy)

    if len(cleaned_x) < min_sample_size:
        return [], [], f"Insufficient sample size: {len(cleaned_x)} valid pairs (minimum required: {min_sample_size})"

    if len(set(cleaned_x)) <= 1 or len(set(cleaned_y)) <= 1:
        return [], [], "Zero variance in factor values or ranks"

    return cleaned_x, cleaned_y, None


def calculate_spearman_and_pearson(
    factor_values: List[float],
    ranks: List[int],
    min_sample_size: int = MIN_SAMPLE_SIZE,
) -> Tuple[float, float, float]:
    """
    Computes Spearman rank correlation (rs) and Pearson correlation (r)
    between factor values and ranking dominance score with exact Student's t p-value.
    
    Ranking dominance score = (N + 1) - Rank, so:
    rs > 0 means: More of this factor directly correlates with higher Google ranking.
    rs < 0 means: More of this factor correlates with lower ranking (over-optimization / penalty).
    """
    clean_x, clean_ranks, err = clean_paired_inputs(factor_values, ranks, min_sample_size)
    if err is not None:
        return 0.0, 0.0, 1.0

    n = len(clean_x)
    dominance_scores = [(n + 1) - r for r in clean_ranks]

    spearman_rs: Optional[float] = None
    pearson_r: Optional[float] = None

    # Try scipy first for correlation coefficients
    try:
        from scipy import stats
        res_spearman = stats.spearmanr(clean_x, dominance_scores)
        spearman_rs = float(res_spearman.statistic if hasattr(res_spearman, "statistic") else res_spearman[0])

        res_pearson = stats.pearsonr(clean_x, dominance_scores)
        pearson_r = float(res_pearson.statistic if hasattr(res_pearson, "statistic") else res_pearson[0])

        if math.isnan(spearman_rs):
            spearman_rs = 0.0
        if math.isnan(pearson_r):
            pearson_r = 0.0
    except Exception:
        pass

    # Pure Python fallback for correlations
    if spearman_rs is None or pearson_r is None:
        mean_x = sum(clean_x) / n
        mean_y = sum(dominance_scores) / n

        cov_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(clean_x, dominance_scores))
        var_x = sum((x - mean_x) ** 2 for x in clean_x)
        var_y = sum((y - mean_y) ** 2 for y in dominance_scores)

        pearson_r = (cov_xy / math.sqrt(var_x * var_y)) if (var_x > 0 and var_y > 0) else 0.0

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

        rank_x = get_ranks(clean_x)
        rank_y = get_ranks(dominance_scores)

        mean_rx = sum(rank_x) / n
        mean_ry = sum(rank_y) / n

        cov_r = sum((rx - mean_rx) * (ry - mean_ry) for rx, ry in zip(rank_x, rank_y))
        var_rx = sum((rx - mean_rx) ** 2 for rx in rank_x)
        var_ry = sum((ry - mean_ry) ** 2 for ry in rank_y)

        spearman_rs = (cov_r / math.sqrt(var_rx * var_ry)) if (var_rx > 0 and var_ry > 0) else 0.0

    # Exact Student's t two-tailed p-value with n - 2 degrees of freedom
    if abs(spearman_rs) >= 1.0:
        p_val = 0.0
    elif n > 2:
        df = n - 2
        t_stat = spearman_rs * math.sqrt(df / (1.0 - spearman_rs ** 2))
        p_val = student_t_survival_function(t_stat, df)
    else:
        p_val = 1.0

    return round(spearman_rs, 4), round(pearson_r, 4), round(max(0.0, min(1.0, p_val)), 4)


def evaluate_factor_correlation(
    factor_name: str,
    factor_values: List[float],
    ranks: List[int],
    sig_threshold: float = CORRELATION_SIGNIFICANCE_THRESHOLD,
    alpha: float = ALPHA_SIGNIFICANCE,
    min_sample_size: int = MIN_SAMPLE_SIZE,
) -> FactorCorrelationResult:
    """
    Evaluates whether a factor has statistical correlation with SERP rank.
    Enforces exact alpha = 0.05 threshold.
    """
    rs, r, p_val = calculate_spearman_and_pearson(factor_values, ranks, min_sample_size=min_sample_size)
    is_sig = abs(rs) >= sig_threshold and p_val <= alpha
    direction = "POSITIVE_CORRELATION" if rs > 0 else "NEGATIVE_CORRELATION"

    return FactorCorrelationResult(
        factor_name=factor_name,
        spearman_rs=rs,
        pearson_r=r,
        p_value=p_val,
        is_significant=is_sig,
        correlation_direction=direction,
        fdr_significant=is_sig,
        adjusted_p_value=p_val,
    )


def apply_benjamini_hochberg(
    correlations: List[FactorCorrelationResult],
    fdr_q: float = FDR_BH_Q_THRESHOLD,
    alpha: float = ALPHA_SIGNIFICANCE,
    sig_threshold: float = CORRELATION_SIGNIFICANCE_THRESHOLD,
) -> List[FactorCorrelationResult]:
    """
    Applies the Benjamini-Hochberg False Discovery Rate (FDR) procedure across all tested factors.
    Controls false positive discoveries across multiple hypothesis testing:
    1. Sorts p-values ascending: p_(1) <= p_(2) <= ... <= p_(m).
    2. Finds largest k where p_(k) <= (k / m) * q.
    3. Rejects null hypotheses for all tests with p <= p_(k).
    4. Computes step-up adjusted p-values.
    """
    if not correlations:
        return []

    m = len(correlations)
    indexed_corrs = sorted(enumerate(correlations), key=lambda item: item[1].p_value)

    # 1. Determine largest k meeting the BH threshold
    max_k = -1
    for k_idx, (orig_idx, corr) in enumerate(indexed_corrs, start=1):
        crit_val = (k_idx / m) * fdr_q
        if corr.p_value <= crit_val and corr.p_value <= alpha:
            max_k = k_idx

    cutoff_p = indexed_corrs[max_k - 1][1].p_value if max_k > 0 else -1.0

    # 2. Compute BH step-up adjusted p-values
    adj_p_values = [1.0] * m
    running_min = 1.0
    for rev_k in range(m, 0, -1):
        idx = rev_k - 1
        p_val = indexed_corrs[idx][1].p_value
        val = min(1.0, (m / rev_k) * p_val)
        running_min = min(running_min, val)
        adj_p_values[idx] = round(running_min, 4)

    # 3. Create updated results maintaining original order
    updated: List[FactorCorrelationResult] = [None] * m  # type: ignore
    for k_idx, (orig_idx, corr) in enumerate(indexed_corrs):
        adj_p = adj_p_values[k_idx]
        is_fdr_sig = (corr.p_value <= cutoff_p) if cutoff_p >= 0.0 else False
        is_sig = is_fdr_sig and (abs(corr.spearman_rs) >= sig_threshold) and (corr.p_value <= alpha)

        updated[orig_idx] = FactorCorrelationResult(
            factor_name=corr.factor_name,
            spearman_rs=corr.spearman_rs,
            pearson_r=corr.pearson_r,
            p_value=corr.p_value,
            is_significant=is_sig,
            correlation_direction=corr.correlation_direction,
            fdr_significant=is_fdr_sig,
            adjusted_p_value=adj_p,
        )

    return updated


def calculate_action_priority_score(
    spearman_rs: float,
    p_value: float,
    deficit: float,
    benchmark: float,
) -> float:
    """
    Computes Ted Kubaitis Action Priority Score (APS) for ranking deficits:
    APS = |rs| * (1 - p) * min(1.0, Delta_f / (Benchmark_f + 1.0))
    """
    leverage = abs(spearman_rs) * max(0.0, 1.0 - p_value)
    scale = min(1.0, max(0.0, deficit) / (max(0.0, benchmark) + 1.0))
    return round(leverage * scale, 4)
