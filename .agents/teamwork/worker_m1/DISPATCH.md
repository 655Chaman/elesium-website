## 2026-11-10T06:06:47Z
Your identity: teamwork_worker
Your role: AEO Probe Engine & Dataset Implementer
Your working directory: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_m1/
Your parent conversation ID: 87afe84d-35d1-4bf6-bf28-4de606efbef0

You must read the following files before starting:
1. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
2. /Users/krdeeksha/ELESIUM WEBSITE/PROJECT.md
3. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_2/handoff.md
4. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_3/handoff.md
5. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_3/enterprise_ai_procurement_queries.json

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Write Ownership:
You EXCLUSIVELY own:
- `automation/aeo_probe/` (the entire package directory and all files within it)
- `automation/test_aeo_probe_engine.py` (unit and integration tests for the probe engine)
DO NOT modify any other files.

Mission:
Build the production AEO Grounding Probe Engine package in `automation/aeo_probe/` and verify it with pytest:
1. Copy or populate `automation/aeo_probe/enterprise_ai_procurement_queries.json` with the exact 50 curated enterprise AI procurement queries from Explorer 3.
2. Implement `automation/aeo_probe/models.py` using Pydantic v2 data models for `ProcurementQuery`, `ProviderSearchResult`, `TelemetryMetrics`, and `AeoTelemetryReceipt`.
3. Implement `automation/aeo_probe/config.py` handling standard environment API keys (`PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`), timeouts, and rate limits.
4. Implement `automation/aeo_probe/providers/`:
   - `base.py`: Abstract `BaseSearchProvider` with `is_live_available()` and `async query(query, scenario)`
   - `perplexity.py`: Real Perplexity Sonar API integration (`POST https://api.perplexity.ai/chat/completions`) with dry-run/mock fallback
   - `openai_search.py`: Real OpenAI Search integration (`POST https://api.openai.com/v1/chat/completions`) with dry-run/mock fallback
   - `gemini.py`: Real Google Gemini Search Grounding integration (`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`) with dry-run/mock fallback
   - `claude.py`: Real Anthropic Claude Web Search integration (`POST https://api.anthropic.com/v1/messages`) with dry-run/mock fallback
   - `mock_engine.py`: Centralized deterministic mock engine producing dual scenarios (`baseline` and `post_injection`) for offline testing without API keys
5. Implement `automation/aeo_probe/analyzers/`:
   - `citation_parser.py`: Multi-provider citation extractor (structured provider fields, markdown links, raw URLs) with URL normalizer for `elesium.online` and associated brand domains
   - `brand_share_parser.py`: Brand mention detection, recommendation keyword window analysis, vendor ranking, and entity grounding density scoring
6. Implement `automation/aeo_probe/dataset.py` for loading and validating the 50 queries.
7. Implement `automation/aeo_probe/engine.py` providing an asynchronous batch runner with concurrency control (semaphore), exponential backoff retries, and CLI flags (`--mode live|mock|hybrid`, `--scenario baseline|post_injection|all`).
8. Implement comprehensive tests in `automation/test_aeo_probe_engine.py` verifying API request formatting, mock fallbacks, parser logic, dataset integrity, and metric calculations.
9. Execute `python3 -m pytest automation/test_aeo_probe_engine.py -v` and document commands and output in your report.
10. Write your handoff report to `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_m1/handoff.md` and message the orchestrator when finished.
