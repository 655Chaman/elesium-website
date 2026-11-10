## 2026-11-10T09:05:41Z
You are a teamwork_worker assigned to execute Milestone M2: Comprehensive Remediation of Option B (Live Google Search Console Striking Distance Engine) and Fleet DOM Cleanup.

### Working Directory & Identity
- Working directory: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_remediation_optB_1/`
- Identity: Option B Remediation Worker (`teamwork_worker`)
- Original request path: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md` (MUST read first)
- Exclusive file ownership:
  - `automation/gsc_engine/**`
  - `automation/gsc_striking_distance_engine.py`
  - `automation/gsc_live_connector.py`
  - `automation/gsc_onpage_optimizer.py`
  - `automation/test_gsc_striking_distance.py`
  - `automation/test_gsc_flaw_remediations.py` (new test file)
  - Fleet cleanup of duplicate sections in `frontend/dist/solutions/*.html` and `frontend/dist/solutions/*/index.html`

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Input Sources to Read
1. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
2. `/Users/krdeeksha/ELESIUM WEBSITE/audit_report.md` (Specifically Section 3: Flaw Catalog Option B, Flaws B-F1 through B-F13)
3. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_optB_1/handoff.md`

### Remediation Deliverables (Flaws B-F1 through B-F13)
1. **Flaw B-F1 (GSC Live API Pagination)**: In `connector.py:_fetch_live_api`, implement iterative `startRow` pagination loop (batch size 25,000) so datasets >25k rows are not truncated.
2. **Flaw B-F2 (Rate-Limiting & Exponential Backoff)**: Wrap Google API client `.execute()` with retry loop catching `HttpError` (429, 500, 502, 503, 504) with exponential backoff and jitter.
3. **Flaw B-F3 (OAuth2 Token Refresh)**: Validate refresh token on startup via `creds.refresh()` and raise typed `GSCAuthenticationError` on expiration.
4. **Flaw B-F4 (Schema Validation on Raw Rows)**: Guard against missing keys, validate non-negative clicks/impressions and $0 \le \text{ctr} \le 1$.
5. **Flaw B-F5 (URL Slug Normalization)**: Strip `.html`/`.htm` extensions, decode percent-encoded URLs, and correctly extract slug across all route structures.
6. **Flaw B-F6 (Mathematical Opportunity Scoring)**: Base score on empirical CTR gaps ($\Delta CTR = \max(0, CTR_{\text{expected}} - CTR_{\text{actual}})$) rather than assuming 100% CTR. Eliminate inverse CTR incentives.
7. **Flaw B-F7 (Striking Distance Filter Coverage)**: Support Page 1 Striking distance (positions 4.0 to 7.9) as Tier 1 opportunity alongside Page 2 (8.0 to 20.0).
8. **Flaw B-F8 (Mock Service Fidelity)**: Update mock service to simulate authentic Google API v3 response dictionaries (`{"rows": [...]}`) and error conditions.
9. **Flaw B-F9 (Statistical Significance & Noise Filtering)**: Add Wilson score confidence interval checks for CTR to eliminate noisy low-sample impressions.
10. **Flaw B-F10 (Idempotency Regex & Fleet DOM Cleanup)**:
    - Fix regex in `html_injector.py` to match regardless of attribute order: `re.compile(r"<section\b[^>]*\bid=[\"\']striking-distance-optimization[\"\'][^>]*>[\s\S]*?<\/section>", re.MULTILINE)`.
    - Clean up all 200 production HTML files (`frontend/dist/solutions/*.html` and `frontend/dist/solutions/*/index.html`) so that each file contains exactly ONE (or zero) `<section id="striking-distance-optimization">`.
11. **Flaw B-F11 (Intent Precedence)**: Match technical architecture terms before conversational question terms. Remove dead code.
12. **Flaw B-F12 (Ungrammatical Filler Fallback)**: Replace static word loop with grammatical syntactic clause generation.
13. **Flaw B-F13 (Test Suite Expansion)**: Implement 20+ comprehensive unit, negative, and edge-case tests in `automation/test_gsc_flaw_remediations.py`.

### Testing & Verification Requirements
1. Run existing and new tests:
   `python3 -m pytest automation/test_gsc_striking_distance.py automation/test_gsc_flaw_remediations.py -v`
2. Verify zero duplicate sections remain in `frontend/dist/solutions/`:
   `python3 -c 'from pathlib import Path; count = sum(1 for f in Path("frontend/dist/solutions").glob("*.html") if f.read_text(encoding="utf-8").count("id=\"striking-distance-optimization\"") > 1); print(f"Duplicate files: {count}")'` (MUST be 0!)
3. Document all changes and verification in your handoff report at `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_remediation_optB_1/handoff.md`.
