# Deep Technical Audit: Option C (Ted Kubaitis Cora SERP Statistical Correlation & Interaction Depth Engine)

**Audit Execution Date:** 2026-11-10  
**Target:** Option C Implementation (`automation/cora_engine/*`, `automation/cora_serp_correlator.py`, `automation/cora_onpage_tuner.py`, `automation/test_cora_correlator.py`)  
**Auditor Archetype:** `teamwork_explorer` (Survey Explorer for Option C)  
**Overall Verdict:** Functionally Working Prototype with Severe Mathematical, Algorithmic, and Scraping Deficiencies  
**Objective Score:** **4.8 / 10**

---

## 1. Observation

Direct line-by-line inspection and test executions revealed the following verbatim facts and behaviors across the codebase:

### 1.1 Baseline System & Test Suite Execution
- **Existing Pytest Suite:**
  Command: `python3 -m pytest automation/test_cora_correlator.py automation/test_gsc_striking_distance.py automation/test_aeo_reverse_rag.py automation/test_aeo_probe_engine.py automation/test_pruning_and_curation.py`
  Result: `122 passed in 15.41s`
  Observation: `automation/test_cora_correlator.py` provides only 11 tests (`11 passed`).
- **Schema Gatekeeper (`automation/verify_schema_integrity.py`):**
  Command: `python3 automation/verify_schema_integrity.py`
  Result: Audited 4,860 HTML files, checked 1,380 JSON-LD blocks, 0 critical errors, 0 non-blocking warnings (`PASSED`).
- **Adversarial Defense Gatekeeper (`automation/verify_adversarial_defense.py`):**
  Command: `python3 automation/verify_adversarial_defense.py`
  Result: All 6 gates passed (100%).
- **Vocabulary Jaccard Similarity Certification (`automation/verify_pruning_and_curation.py`):**
  Command: `python3 automation/verify_pruning_and_curation.py`
  Result: Mean Jaccard similarity across 100 retained enterprise pages is `43.77%` against a hard threshold ceiling of `< 50.00%` (Gate 5 passed).

### 1.2 Verbatim Code Inspections

#### Observation O1: Flawed Student's t p-value via Standard Normal Approximation
File: `automation/cora_engine/correlation_math.py:107-118`
```python
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
```

#### Observation O2: Excessively Loose Significance Threshold ($\alpha = 0.20$) and Zero FDR / Multi-Testing Correction
File: `automation/cora_engine/correlation_math.py:130-132` & `automation/cora_engine/config.py:25`
```python
def evaluate_factor_correlation(..., sig_threshold: float = CORRELATION_SIGNIFICANCE_THRESHOLD) -> FactorCorrelationResult:
    rs, r, p_val = calculate_spearman_and_pearson(factor_values, ranks)
    is_sig = abs(rs) >= sig_threshold and p_val < 0.20
```
In `config.py:25`:
```python
CORRELATION_SIGNIFICANCE_THRESHOLD = 0.25  # Absolute Spearman rs threshold for impactful factors
```

#### Observation O3: Missing Sample Size and Unequal List Length Validation
File: `automation/cora_engine/correlation_math.py:31-41, 65-70`
```python
    n = len(factor_values)
    if n < 3:
        return 0.0, 0.0, 1.0

    # Invert rank into dominance score (Rank 1 -> N, Rank N -> 1)
    dominance_scores = [(n + 1) - r for r in ranks]
...
    mean_x = sum(factor_values) / n
    mean_y = sum(dominance_scores) / n

    cov_xy = sum((x - mean_x) * (y - mean_y) for x, y in zip(factor_values, dominance_scores))
```

#### Observation O4: Missing Outlier Handling in Top 3 Baseline Calculation
File: `automation/cora_engine/deficit_calculator.py:72-76`
```python
top_3_vals = [c.factors.get(key, 0.0) for c in top_3_comps]
top_3_mean = (sum(top_3_vals) / len(top_3_vals)) if top_3_vals else 0.0
elesium_val = elesium_factors.get(key, 0.0)
diff = top_3_mean - elesium_val
```

#### Observation O5: Blind Omission of Negatively Correlated Factors (Over-Optimization / Penalties)
File: `automation/cora_engine/deficit_calculator.py:71`
```python
# 2. If statistically significant and positively correlated, compute deficit
if corr.is_significant and corr.spearman_rs > 0:
```

#### Observation O6: Deficits Sorted by Raw Scalar Units Rather Than Statistical Leverage
File: `automation/cora_engine/deficit_calculator.py:95`
```python
# Sort deficits descending by absolute deficit amount
deficits.sort(key=lambda d: d.deficit, reverse=True)
```

#### Observation O7: Complete Absence of Real SERP API Integration (Stub with Simulation Fallback)
File: `automation/cora_engine/serp_harvester.py:56-60, 78-81, 200-210`
```python
    def _harvest_live_api(
        self,
        query: str,
        slug: str,
        solution_data: Dict[str, Any],
        elesium_factors: Dict[str, float],
        elesium_position: float,
    ) -> Tuple[List[SERPCompetitorRecord], ATFLayoutProfile]:
        """Placeholder for live external SERP APIs (e.g. SerpApi / DataForSEO)."""
        logger.info(f"Live API connector invoked for query: {query}. Falling back to simulation for safety.")
        return self._simulate_serp(query, slug, solution_data, elesium_factors, elesium_position)
```

#### Observation O8: Synthetic Circular Correlation in SERP Simulator
File: `automation/cora_engine/serp_harvester.py:145-154`
```python
    # Factor values smoothly decline with rank (Ted Kubaitis correlation law)
    rank_factor = 1.0 - (rank / 25.0)  # 0.96 for rank 1 down to 0.20 for rank 20
    jitter = ((seed // (rank + 1)) % 15) / 100.0 - 0.07  # -0.07 to +0.07

    comp_words = round(top3_target_words * (rank_factor + jitter))
    comp_h2_kw = round(max(0.0, top3_target_h2_kw * rank_factor))
```

#### Observation O9: Missing Visibility Deflator Math
File: `automation/cora_engine/atf_triage.py:22-38, 55-68`
The function `calculate_interaction_depth(pixel_y_offset: int) -> int` converts pixel offset into an integer `0, 1, 2, 3`.
Nowhere in `atf_triage.py`, `correlation_math.py`, or `deficit_calculator.py` is any deflator formula implemented or applied to ranking positions or correlation coefficients.

#### Observation O10: Substring Matching on Keyword Tokens in HTML Factor Extraction
File: `automation/cora_engine/factor_extractor.py:38-39, 74, 85, 90, 95`
```python
    kw_lower = target_keyword.lower().strip()
    kw_tokens = set(re.findall(r"\b[a-z0-9]+\b", kw_lower))
...
    h2_kw_matches = sum(1 for h in h2_tags if any(t in h.get_text().lower() for t in kw_tokens))
    strong_kw_matches = sum(1 for s in strong_tags if any(t in s.get_text().lower() for t in kw_tokens))
    a_kw_matches = sum(1 for a in a_tags if any(t in a.get_text().lower() for t in kw_tokens))
    img_kw_matches = sum(1 for img in img_tags if any(t in img.get("alt", "").lower() for t in kw_tokens))
```

#### Observation O11: Script, Style, and JSON-LD Code Counted as Body Copy Words
File: `automation/cora_engine/factor_extractor.py:44-48`
```python
    text_content = soup.get_text()
    words = re.findall(r"\b[a-zA-Z0-9_-]+\b", text_content)
    total_words = len(words)
```

#### Observation O12: Top-Level JSON-LD Arrays Trigger Exception and Silent Drop
File: `automation/cora_engine/factor_extractor.py:140-161`
```python
        try:
            data = json.loads(sc.string or "")
            if "@graph" in data and isinstance(data["@graph"], list):
                entities_count += len(data["@graph"])
...
            else:
                entities_count += 1
                t = str(data.get("@type", ""))
```

#### Observation O13: Static 3-Paragraph Injection Regardless of Prescribed Deficit
File: `automation/cora_engine/onpage_calibrator.py:98-102, 139-151, 224`
```python
words_needed = int(deficit_map.get("body_word_count", 350.0))
...
tech_paragraphs = [
    f"{intro[0]} {keyword} execution, establishing that {c0_title} directly {intro[2]} {c0_desc} {intro[1]} {compute}, this topology delivers verified sub-millisecond dispatch times across enterprise workloads.",
    f"{gov[0]} {c1_title}. {c1_desc} {gov[1]} {c3_title} ensures that {c3_desc} {gov[2]} satisfying statutory standards under {primary_badge}.",
    f"{concl[0]} {c2_desc} Certified metrics ({spec_summary}) affirm performance parity against top competitors, {concl[1]}",
]
...
actual_words = len(combined_text.split())
```
In line 224:
```html
Deficit Resolved: +{actual_words} Words &bull; Top 3 Parity Certified
```

#### Observation O14: Pre-Compressed `.gz` and `.br` Files Never Synchronized
File: `automation/cora_engine/onpage_calibrator.py:254-295` & `automation/cora_engine/pipeline.py:217`
In `onpage_calibrator.py`, `inject_calibration` writes only `index.html` and `{slug}.html`. It does not create or update `.gz` or `.br` files.
In `pipeline.py:217`:
```markdown
- **Pre-Compression Byte Parity:** Companion .gz and .br files synchronized.
```

#### Observation O15: Missing Slug Crash Risk and Telemetry Truncation
File: `automation/cora_engine/pipeline.py:84-88, 139-147, 153`
```python
        for sol in self.curated_solutions:
            slug = sol.get("slug")
            target_html_path = SOLUTIONS_DIST_DIR / slug / "index.html"
```
In line 139:
```python
if len(top_deficits_summary) < 20:
    top_deficits_summary.append(...)
```
In line 153:
```python
total_factors_evaluated=len(all_reports) * 20
```

---

## 2. Logic Chain

From the direct observations above, the following logical steps establish the systemic failure modes of Option C:

```
[Observation O1: Normal CDF used for Student's t with df = n-2]
  --> For sample sizes n = 5..20, the Standard Normal distribution severely underestimates tail probabilities.
  --> Example: with n = 5, t = 2.31 has true Student's t p = 0.1041. Normal approximation produces p = 0.0209.
  --> The algorithm falsely declares non-significant factors as significant (Type I error).

[Observation O2: Significance threshold set to p < 0.20, zero FDR correction]
  --> Testing 27 factors per query under alpha = 0.20 means the probability of at least one spurious correlation is 1 - (1 - 0.20)^27 = 99.76%.
  --> The engine treats random noise as definitive ranking signals.

[Observation O3: len(factor_values) != len(ranks) unvalidated]
  --> If competitors drop or scraping is incomplete, zip() silently truncates to the shorter length, while dominance_scores and get_ranks() use full rank lists.
  --> Mismatched rank indices corrupt covariance and rank ordering.

[Observation O4: Arithmetic mean on Top 3 with zero outlier filtering]
  --> An anomalous competitor (e.g. 50,000 words scraped into an archive) skews the arithmetic mean from 2,500 to 18,000 words.
  --> Prescriptions demand absurd, unnatural text expansions.

[Observation O5: If spearman_rs < 0, factor is discarded]
  --> If a factor has negative correlation (more of it causes lower rank, e.g. keyword stuffing in H2 or bloated DOM), the engine ignores it.
  --> Pages suffering from over-optimization penalties are never alerted or calibrated downward.

[Observation O6: Deficits sorted descending by raw absolute scalar]
  --> Words (+900) always sorts above citations (+3) or tables (+2), regardless of whether citations have rs = 0.90 and words has rs = 0.26.
  --> High-magnitude weak factors preempt low-magnitude high-impact ranking drivers.

[Observation O7 & O8: _harvest_live_api is a stub; factors simulated by rank_factor]
  --> Live API credentials are never used.
  --> Competitor factors are synthetically generated to decline with rank (rs ~ 0.95), guaranteeing circular statistical significance on 92.5% of factors.

[Observation O9: Zero visibility deflator math implemented]
  --> Despite claiming "Visibility-First SEO (SEO Rockstars 2026)", the interaction depth integer is purely decorative.
  --> Ranking dominance score is not deflated by scroll depth; correlation math still correlates against raw rank position.

[Observation O10: Substring token matching in factor extractor]
  --> Tokens like "in", "ai" match inside words ("banking", "container", "email", "domain").
  --> Almost every H2, bold tag, anchor, and image alt matches, yielding bogus 100% keyword match counts.

[Observation O11: soup.get_text() includes JS/CSS]
  --> 15KB JSON-LD schemas and inline scripts are counted as body copy words, corrupting word counts and lexical diversity.

[Observation O12: Top-level JSON-LD arrays drop silently]
  --> Standard schema blocks structured as JSON arrays crash in data.get("@type") and are caught and discarded.

[Observation O13: Fixed 3 paragraphs injected regardless of words_needed]
  --> If words_needed is 1,200, the calibrator injects ~180 words, but marks the page "Deficit Resolved • Top 3 Parity Certified".
  --> The page remains 1,000 words behind Top 3.

[Observation O14: Pre-compressed .gz/.br files not synchronized]
  --> Production servers (Nginx/Cloudflare) serving pre-compressed assets deliver the old uncalibrated HTML to Googlebot.
  --> The entire on-page optimization is invisible to the search engine in production.

[Observation O15: Missing slug crashes pipeline; telemetry truncated to 20]
  --> Missing slug raises TypeError on PosixPath / None.
  --> 80 out of 100 solutions are dropped from telemetry JSON.
```

---

## 3. Detailed Flaw Catalog & Remediation Plans

| # | Flaw Title | Exact Location | Failure Scenario | Production-Grade Remediation Plan |
|---|---|---|---|---|
| **F1** | Student's t p-value via Normal CDF Approximation | `cora_engine/correlation_math.py:107-118` | Sample size $n=5..20$ produces false positive $p < 0.05$ when true Student's t $p > 0.10$, promoting spurious noise to ranking factors. | Implement exact Student's t survival function via regularized incomplete beta function $I_x(a, b)$ in pure Python: $p = I_{\frac{df}{df + t^2}}(\frac{df}{2}, \frac{1}{2})$ or utilize `scipy.stats.t.sf`. |
| **F2** | Excessively Loose Alpha ($\alpha = 0.20$) & Missing FDR Correction | `cora_engine/correlation_math.py:131`, `cora_engine/config.py:25` | Testing 27 factors per query yields a 99.76% probability of false positive correlations, corrupting recommendations. | Set significance $\alpha = 0.05$. Implement Benjamini-Hochberg (BH) False Discovery Rate procedure ($q \le 0.10$) across all factors in the SERP. |
| **F3** | Unvalidated List Lengths & Missing Sample Size Guards | `cora_engine/correlation_math.py:31-41` | Discrepant list lengths silently truncate via `zip()`, misaligning rank indices and causing corrupt variance/covariance calculations. | Validate `len(factor_values) == len(ranks) >= 5`. Synchronously filter out `None`, `NaN`, and infinities. Mark $N < 10$ as insufficient sample size. |
| **F4** | Arithmetic Mean on Top 3 Without Outlier Rejection | `cora_engine/deficit_calculator.py:72-76` | An outlier page with 50,000 words in Top 3 skews the benchmark to 18,000 words, issuing absurd word count expansion prescriptions. | Implement robust statistics: use median or trimmed mean when $\max(vals) > 2 \times \text{median}(vals)$. Apply Winsorization capping maximum single-pass additions. |
| **F5** | Negatively Correlated Factors Ignored (Zero Over-Optimization Pruning) | `cora_engine/deficit_calculator.py:71` | Over-optimized factors ($r_s < -0.40$, e.g. keyword stuffing in H2) are dropped, leaving penalized pages unaddressed. | Track negative correlations ($r_s \le -\text{threshold}$) as surplus / penalty risks. Generate pruning tuning actions ("Reduce 'exact_kw_in_h2' by -4 to eliminate penalty risk"). |
| **F6** | Sorting Deficits by Raw Scalar Difference | `cora_engine/deficit_calculator.py:95` | Body word count (+900 words) always outranks statutory citations (+3 links) even when citations have $r_s = 0.88$ and words have $r_s = 0.26$. | Rank deficits by a statistical Action Priority Score: $\text{APS} = |r_s| \times (1 - p) \times \min(1.0, \frac{\Delta_f}{\text{Benchmark}_f})$. |
| **F7** | Live SERP API is an Empty Stub | `cora_engine/serp_harvester.py:200-210` | When real API keys are provided, `_harvest_live_api` merely logs a message and falls back to simulation. Zero live scraping. | Implement live API adapter (e.g. SerpApi / DataForSEO / Google Custom Search JSON API) with HTTP client, timeout (10s), exponential backoff, and schema mapping. |
| **F8** | Missing Ted Kubaitis Visibility Deflator Math | `cora_engine/atf_triage.py:22-38`, `cora_engine/correlation_math.py:40` | Scroll depth integer is never used in mathematical calculations; rank dominance is not deflated by fold position. | Implement Visibility Deflator: $\text{Deflated Score} = \frac{(N + 1 - \text{Rank})}{(1.0 + 0.75 \times \text{InteractionDepth})}$. Correlate factors against both raw and deflated scores. |
| **F9** | Substring Token Matching in Factor Extraction | `cora_engine/factor_extractor.py:74, 85, 90, 95` | Tokens "in" and "ai" match inside words ("banking", "main", "email"), falsely reporting 100% keyword density across all DOM elements. | Replace `in` substring search with regex word-boundary matching `re.search(rf"\b{re.escape(t)}\b", text)` and exclude common stop words unless part of exact phrase. |
| **F10** | Scripts, Styles, and JSON-LD Counted as Body Copy | `cora_engine/factor_extractor.py:44-48` | 15KB JSON-LD schemas and JavaScript code are counted as visible content words, skewing lexical diversity and word counts. | Decompose non-content elements (`soup(["script", "style", "noscript", "svg"])`) prior to running regex word tokenization. |
| **F11** | Top-Level JSON-LD Arrays Trigger Exception and Silent Drop | `cora_engine/factor_extractor.py:140-161` | Valid Schema.org top-level arrays `[{"@type": ...}]` fail on `data.get("@type")`, silently discarding schema entity counts. | Normalize JSON-LD data to list of objects regardless of whether top-level is dict, list, or `@graph`. |
| **F12** | Static 3-Paragraph Injection Fails to Close Word Deficits | `cora_engine/onpage_calibrator.py:139-151, 224` | If deficit is +1,200 words, calibrator generates ~180 words but stamps "Top 3 Parity Certified", leaving the page in deficit. | Dynamically generate modular technical sections (deep architectural breakdowns, failure mode analyses) until added words fulfill the deficit up to safe limits. |
| **F13** | Limited Template Combinations (64) Threatens Fleet Jaccard Invariant | `cora_engine/onpage_calibrator.py:40-66` | 64 permutations across 100 pages creates high n-gram overlap, threatening Gate 5 Jaccard threshold (currently 43.77% vs 50.00% cap). | Expand template sentence pools to 15+ variations per clause and weave unique solution-specific specs and metrics into generated text. |
| **F14** | Pre-Compressed `.gz` and `.br` Files Are Never Synchronized | `cora_engine/onpage_calibrator.py:254-295` | Nginx/Cloudflare serves stale `.br` / `.gz` pre-compressed assets, meaning Googlebot never sees the injected Cora calibration. | Detect companion `.gz` and `.br` files in `dist/` and recompress them immediately using `gzip` and `brotli` libraries. |
| **F15** | Pipeline Crash Risk on Missing Slug & Telemetry Truncation | `cora_engine/pipeline.py:84-88, 139` | Missing `slug` in JSON causes `TypeError: PosixPath / NoneType`. 80 out of 100 solutions are omitted from persistent telemetry. | Add `if not slug: continue`. Store full results array for all 100 solutions in telemetry JSON. |
| **F16** | Anemic Test Suite (Only 11 Tests) With Zero Negative/Adversarial Cases | `automation/test_cora_correlator.py` | Regressions, NaN handling, division by zero, and tie handling are completely untested against non-ideal data. | Expand test suite to 35+ automated tests covering ties, small sample sizes, NaN/Inf inputs, negative correlation, outlier handling, and `.gz`/`.br` parity. |

---

## 4. Objective Quantitative Scoring

Based on concrete technical criteria, Option C is scored as follows:

| Category | Weight | Score (out of 10) | Weighted | Justification |
|---|:---:|:---:|:---:|---|
| **1. Statistical Rigor** | 25% | **5.0 / 10** | 1.25 | Pure Python Spearman rank with ties is implemented, but p-value approximation uses Normal distribution instead of Student's t; significance alpha $0.20$ is too loose; zero multi-testing (FDR) correction; $N=3$ minimum sample size is unsafe; zero outlier detection/handling in Top 3 baseline; deficits sorted by raw scalar rather than statistical leverage. |
| **2. Real SERP & Factor Measurement** | 25% | **4.0 / 10** | 1.00 | `_harvest_live_api` is literally a dead stub that falls back to simulation; HTML factor extractor uses substring matching causing massive false positives on short tokens; `soup.get_text()` counts JS/CSS code as body words; top-level JSON-LD arrays drop silently; statutory domain matching uses substring. |
| **3. Error Resilience** | 15% | **5.5 / 10** | 0.825 | Missing `slug` in curated solutions crashes the pipeline with `TypeError`; unequal list lengths in correlation math cause silent truncation; but try-except blocks exist around GSC file loading and JSON parsing. |
| **4. Alignment with Ted Kubaitis Cora** | 20% | **5.5 / 10** | 1.10 | Captures core concepts (Spearman rho, Top 3 baseline, deficit vector); but measures only 27 factors (vs Cora's 500-20,000+); ignores negatively correlated factors (over-optimization); zero deflator math applied to rank or correlation; calibration injects fixed 3 paragraphs rather than actually closing the word deficit. |
| **5. Test Coverage & Adversarial Testing** | 15% | **4.0 / 10** | 0.60 | Only 11 unit tests in `test_cora_correlator.py`; all tests use pristine synthetic data; zero negative tests, zero division-by-zero tests, zero tie-heavy factor tests, zero edge-case tests for SERP triage, zero pre-compression verification. |
| **Composite Score** | **100%** | **4.8 / 10** | **4.775** | **Overall Rating: 4.8 / 10 (Marginal / Needs Substantial Remediation)** |

---

## 5. Caveats

- **Live API Quota:** The live SERP API connection was evaluated via static code analysis; live external network calls were not executed against commercial APIs due to read-only constraints and lack of live API credentials in the environment.
- **Production HTML State:** Pre-rendered HTML files currently in `frontend/dist/` have already had a previous pass of Cora injection applied; tests confirmed that idempotency logic correctly prevents duplicate section headers under standard formatting.
- **Other Options:** Option A (AEO Citation Grounding) and Option B (GSC Striking Distance) were inspected solely for cross-module integration points (e.g. `gsc_striking_distance_telemetry.json` and section placement anchors).

---

## 6. Conclusion

Option C establishes a functional, modular architecture for Ted Kubaitis-inspired on-page correlation and deficit tuning. It successfully passes the existing 122 Pytest tests, respects the schema integrity gatekeeper (4,860 files with 0 errors), and complies with the adversarial defense gatekeeper.

However, from an engineering, statistical, and scraping standpoint, the implementation is **critically naive**:
1. It relies on a normal distribution approximation that yields invalid p-values for small competitor samples.
2. It sets significance at an absurdly loose $\alpha = 0.20$ without multiple testing correction.
3. Its live SERP API is an unpopulated stub.
4. Its factor extractor uses substring matching that corrupts keyword metrics.
5. Its calibration injector outputs a static 180 words regardless of whether the measured deficit is 150 or 1,500 words.
6. It falsely reports that pre-compressed `.gz` and `.br` files are synchronized when they are untouched.

**Actionable Next Steps for Remediation (Phase M3):**
1. Overhaul `correlation_math.py` with exact Student's t CDF / incomplete beta function, Benjamini-Hochberg FDR correction, input length validation, and Action Priority Scoring.
2. Implement robust statistics (trimmed mean / Winsorization) and negative correlation (over-optimization pruning) in `deficit_calculator.py`.
3. Fix token boundary matching, script/style decomposition, and JSON-LD array parsing in `factor_extractor.py`.
4. Implement genuine visibility deflator math in `atf_triage.py`.
5. Connect real SERP API harvesting and dynamic content expansion in `onpage_calibrator.py`, with automatic companion `.gz` / `.br` recompression.
6. Expand `test_cora_correlator.py` from 11 tests to 35+ comprehensive unit, negative, and edge-case tests.

---

## 7. Verification Method

To independently verify the observations and findings in this audit report:

1. **Verify Baseline Tests:**
   ```bash
   python3 -m pytest automation/test_cora_correlator.py automation/test_pruning_and_curation.py -v
   ```
2. **Verify Schema Gatekeeper Invariant (0 Critical Errors):**
   ```bash
   python3 automation/verify_schema_integrity.py
   ```
3. **Verify Adversarial Defense Invariant (All 6 Gates Passed):**
   ```bash
   python3 automation/verify_adversarial_defense.py
   ```
4. **Verify Vocabulary Jaccard Similarity (Gate 5):**
   ```bash
   python3 automation/verify_pruning_and_curation.py
   ```
5. **Inspect Stub Live API:**
   Inspect lines 200–210 of `automation/cora_engine/serp_harvester.py` to confirm that `_harvest_live_api` contains no network call and routes unconditionally to `_simulate_serp`.
6. **Inspect Normal Approximation in Correlation Math:**
   Inspect lines 107–118 of `automation/cora_engine/correlation_math.py` to confirm `math.erf` is used with $z = |t|$ instead of Student's t distribution.
7. **Inspect Pre-Compressed File Out-of-Sync State:**
   Check modification timestamps of `frontend/dist/solutions/vllm-custom-paged-attention-kernel-deployment/index.html` vs `index.html.gz` and `index.html.br`.
