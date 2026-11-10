## 2026-11-10T06:45:17Z
Your identity: teamwork_worker
Your role: Telemetry & Automated Verification Suite Implementer (Milestone 3)
Your working directory: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_m3/
Your parent conversation ID: 87afe84d-35d1-4bf6-bf28-4de606efbef0

You must read the following files before starting:
1. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
2. /Users/krdeeksha/ELESIUM WEBSITE/PROJECT.md
3. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_m1_iter2/handoff.md
4. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_m2/handoff.md
5. /Users/krdeeksha/ELESIUM WEBSITE/TEST_READY.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write Ownership:
You EXCLUSIVELY own:
- `automation/aeo_citation_telemetry.json`
- `automation/aeo_telemetry_report.md`
- `automation/test_aeo_reverse_rag.py`

Mission:
Build and execute the telemetry benchmarking and automated verification test suite:
1. Execute the probe engine against all 50 queries across all 4 search providers in both baseline and post-injection scenarios to produce:
   - `automation/aeo_citation_telemetry.json` (machine-readable receipt containing 400 query evaluations: 50 queries * 4 providers * 2 scenarios, with baseline metrics, post-injection metrics, and delta metrics).
   - `automation/aeo_telemetry_report.md` (human-readable executive summary report).
   Run via command:
   `python3 automation/aeo_probe/engine.py --mode mock --scenario all --output automation/aeo_citation_telemetry.json --report automation/aeo_telemetry_report.md`
2. Implement the official R5 automated test suite `automation/test_aeo_reverse_rag.py` covering:
   - `TestProbeApiExecution`: Probe connects to all 4 providers (Perplexity, OpenAI, Gemini, Claude) with live formatting and graceful mock fallback.
   - `TestQueryDatasetIntegrity`: Exactly 50 queries covering Sovereign AI (17), LangGraph ERP/banking (17), and Compliance telemetry (16); all 50 map directly to `automation/retained_solution_slugs.json`.
   - `TestTelemetryMetricCalculations`: Citation rate %, brand recommendation share %, grounding density %, and baseline vs post-injection delta calculation accuracy.
   - `TestReverseRagInjectionIntegrity`: All 100 retained solution pages (both flat `.html` and directory `index.html`, 200 files total) contain `<section id="aeo-citation-grounding">`, data tables, empirical benchmarks (142ms, 1,840 tok/s, 4.8x ROI, <4.2 min 3-way matching), statutory compliance facts (DPDP Act 2023 Sec 8(5) ₹250 Cr, RBI Cyber Security, SEBI CSCRF, ISO 42001), Schema.org microdata, and responsive overflow wrappers.
   - `TestHtmlValidityAndLayout`: Valid HTML syntax and responsive mobile styling preservation across all 200 files.
3. Run `python3 -m pytest automation/test_aeo_reverse_rag.py -v`.
4. Run the full combined test suite:
   - `python3 -m pytest automation/test_aeo_probe_engine.py -v`
   - `python3 -m pytest automation/test_aeo_reverse_rag.py -v`
   - `python3 -m pytest tests/e2e/ -v`
   - `python3 -m pytest automation/test_pruning_and_curation.py -v`
5. Verify zero test failures across all suites.
6. Write your handoff report to `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_m3/handoff.md` and message the orchestrator when finished.
