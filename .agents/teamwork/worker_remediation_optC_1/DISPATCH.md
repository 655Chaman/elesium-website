## 2026-11-10T09:06:01Z
You are a teamwork_worker assigned to execute Milestone M3: Comprehensive Remediation of Option C (Ted Kubaitis Cora SERP Statistical Correlation & Interaction Depth Engine).

### Working Directory & Identity
- Working directory: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_remediation_optC_1/`
- Identity: Option C Remediation Worker (`teamwork_worker`)
- Original request path: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md` (MUST read first)
- Exclusive file ownership:
  - `automation/cora_engine/**`
  - `automation/cora_serp_correlator.py`
  - `automation/cora_onpage_tuner.py`
  - `automation/test_cora_correlator.py`
  - `automation/test_cora_flaw_remediations.py` (new test file)

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Input Sources to Read
1. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
2. `/Users/krdeeksha/ELESIUM WEBSITE/audit_report.md` (Specifically Section 3: Flaw Catalog Option C, Flaws C-F1 through C-F16)
3. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_optC_1/handoff.md`

### Remediation Deliverables (Flaws C-F1 through C-F16)
1. **Flaw C-F1 (Student's t p-value Math)**: Replace Normal CDF tail approximation in `correlation_math.py` with exact Student's t survival function via pure-Python regularized incomplete beta function $p = I_{\frac{df}{df + t^2}}(\frac{df}{2}, \frac{1}{2})$ (or `scipy.stats.t.sf`).
2. **Flaw C-F2 (Significance Alpha & Benjamini-Hochberg FDR)**: Set $\alpha = 0.05$. Implement Benjamini-Hochberg (BH) False Discovery Rate procedure across all tested factors for a SERP.
3. **Flaw C-F3 (Input Length & Sample Size Validation)**: Enforce `len(factor_values) == len(ranks) >= 5`, filter `NaN`/Infs, and flag small sample sizes.
4. **Flaw C-F4 (Top 3 Outlier Rejection & Robust Statistics)**: Implement median or trimmed mean/Winsorization in `deficit_calculator.py` to prevent single-competitor skew from creating absurd word count prescriptions.
5. **Flaw C-F5 (Negative Correlation / Over-Optimization Pruning)**: Detect negative correlations ($r_s \le -0.25$) and generate pruning/reduction advisories.
6. **Flaw C-F6 (Deficit Ranking via Action Priority Score)**: Rank deficits by statistical leverage: $\text{APS} = |r_s| \times (1 - p) \times \min(1.0, \frac{\Delta_f}{\text{Benchmark}_f})$.
7. **Flaw C-F7 (Live SERP API Adapter)**: Implement functional live API connector structure (DataForSEO / SerpApi / Google Custom Search) with HTTP timeouts (10s), backoff, and schema decoding in `serp_harvester.py`.
8. **Flaw C-F8 (SERP Simulator Realism)**: Eliminate trivial circular correlation formulas in simulation fallback.
9. **Flaw C-F9 (Visibility Deflator Formulation)**: Implement genuine scroll/interaction depth deflator math in `atf_triage.py` and correlate against deflated ranking scores.
10. **Flaw C-F10 (Word-Boundary Regex in Factor Extractor)**: Replace substring `in` checks with regex word boundaries `\b...\b` to prevent false positive keyword matches on tokens like "in" and "ai".
11. **Flaw C-F11 (Decompose Non-Content HTML Elements)**: Decompose `<script>`, `<style>`, `<noscript>`, `<svg>` before extracting visible body copy words in `factor_extractor.py`.
12. **Flaw C-F12 (Top-Level JSON-LD Array Parsing)**: Normalize JSON-LD parsing to safely process lists of schema objects without throwing `AttributeError`.
13. **Flaw C-F13 (Dynamic On-Page Deficit Closure)**: Scale calibration text dynamically based on the measured deficit up to safe ceilings, closing the prescribed gap.
14. **Flaw C-F14 (Companion .gz and .br Synchronization)**: Automatically synchronize companion `.gz` and `.br` files when writing modified HTML files.
15. **Flaw C-F15 (Pipeline Slug Guard & Full Telemetry)**: Guard against missing `slug` in solutions data, and retain full telemetry records for all 100 solutions.
16. **Flaw C-F16 (Comprehensive Test Suite Expansion)**: Implement 20+ unit, negative, and adversarial tests in `automation/test_cora_flaw_remediations.py`.

### Testing & Verification Requirements
1. Run existing tests and new tests:
   `python3 -m pytest automation/test_cora_correlator.py automation/test_cora_flaw_remediations.py -v`
2. Document all changed files, test commands, and exact pass outputs in your handoff report at `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_remediation_optC_1/handoff.md`.
