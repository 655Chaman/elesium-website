## 2026-11-10T09:05:22Z
You are a teamwork_worker assigned to execute Milestone M1: Comprehensive Remediation of Option A (Live AEO Citation Grounding Engine & Reverse-RAG Injection).

### Working Directory & Identity
- Working directory: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_remediation_optA_1/`
- Identity: Option A Remediation Worker (`teamwork_worker`)
- Original request path: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md` (MUST read first)
- Exclusive file ownership:
  - `automation/aeo_probe/**`
  - `automation/inject_aeo_reverse_rag.py`
  - `automation/test_aeo_probe_engine.py`
  - `automation/test_aeo_reverse_rag.py`
  - `automation/test_aeo_flaw_remediations.py` (new test file)
  - `automation/verify_aeo_llm_grounding.py` (if updating backward compatibility or schema)

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Input Sources to Read
1. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
2. `/Users/krdeeksha/ELESIUM WEBSITE/audit_report.md` (Specifically Section 3: Flaw Catalog Option A, Flaws A-F1 through A-F10)
3. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_optA_1/handoff.md`

### Remediation Deliverables (Flaws A-F1 through A-F10)
1. **Flaw A-F1 (Live API Error Masking)**: Update `ProviderSearchResult` and `AeoProbeEngine.compute_metrics` so that if `error` is populated or `is_mock` during a live run, `elesium_cited=False`, `elesium_recommended=False`, and `grounding_density=0.0`. Report explicit `error_rate_pct` and separate live vs mock metrics.
2. **Flaw A-F2 (Thundering-Herd Retries & Unenforced Rate Limiting)**: Implement exponential backoff with full jitter (`random.uniform(0.5, 1.0) * (backoff_factor ** attempt)`), respect `Retry-After` / `x-ratelimit-reset` headers, and enforce `rate_limit_per_min`.
3. **Flaw A-F3 (Claude & OpenAI Search Tool Headers)**: Add `"anthropic-beta": "web-search-2025-03-05"` in `claude.py:format_headers`. Align OpenAI search tool configurations.
4. **Flaw A-F4 (Circular Mock Engine)**: Decouple mock response generation from rigid regex triggers; simulate varied real-world search synthesis patterns (bullet points, comparison tables, neutral mentions, complex qualifiers).
5. **Flaw A-F5 (Competitor Ranking Heuristic)**: Replace naive word-position counting with robust sentiment/recommendation clause analysis. Expand competitor groups to modern enterprise AI hyperscalers.
6. **Flaw A-F6 (Broad Negative Disqualifier Window)**: Scope negative disqualifier detection to the immediate clause boundary containing the brand name rather than an arbitrary 80-word window.
7. **Flaw A-F7 (Telemetry Schema Gatekeeper Breakage)**: Ensure `save_receipt` outputs backward-compatible metadata so `python3 automation/verify_aeo_llm_grounding.py` passes 6/6 gates!
8. **Flaw A-F8 (Reverse-RAG Boilerplate Duplication)**: Dynamically generate table benchmarks from each solution's specific curated specs and capabilities rather than static duplicate rows; eliminate artificial compound suffix tags.
9. **Flaw A-F9 & A-F10 (Build Integration & Microdata/JSON-LD Splitting)**: Standardize on clean JSON-LD referencing `@id` without duplicate broken microdata.

### Testing & Verification Requirements
1. Implement comprehensive unit and regression tests in `automation/test_aeo_flaw_remediations.py`.
2. Run existing tests and new tests:
   `python3 -m pytest automation/test_aeo_probe_engine.py automation/test_aeo_reverse_rag.py automation/test_aeo_flaw_remediations.py -v`
3. Run Module 10 gatekeeper:
   `python3 automation/verify_aeo_llm_grounding.py`
4. Document all changed files, test commands, and exact pass outputs in your handoff report at `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_remediation_optA_1/handoff.md`.
