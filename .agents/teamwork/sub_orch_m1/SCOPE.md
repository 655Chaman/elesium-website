# Scope: Milestone 1 — Probe Engine & 50 Query Dataset

## Mission
Build and verify the live AEO Grounding Probe Engine connecting to real LLM search APIs (Perplexity, OpenAI, Gemini, Claude) with offline deterministic mock fallbacks, multi-stage citation/brand parsers, and the 50 enterprise AI procurement query benchmark dataset.

## Target Package
`automation/aeo_probe/`:
- `__init__.py`
- `config.py`: Environment variable key loading (`PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`), timeouts, concurrency limit.
- `models.py`: Pydantic v2 models for `ProcurementQuery`, `ProviderSearchResult`, `TelemetryMetrics`, `AeoTelemetryReceipt`.
- `providers/base.py`: Abstract `BaseSearchProvider` class with `is_live_available()` and `async query(query, scenario)`.
- `providers/perplexity.py`: Perplexity Sonar API integration (`https://api.perplexity.ai/chat/completions`) with mock fallback.
- `providers/openai_search.py`: OpenAI Search integration (`https://api.openai.com/v1/chat/completions`) with mock fallback.
- `providers/gemini.py`: Google Gemini Search Grounding (`gemini-2.0-flash:generateContent`) with mock fallback.
- `providers/claude.py`: Anthropic Claude Web Search (`claude-3-7-sonnet-latest`) with mock fallback.
- `providers/mock_engine.py`: Deterministic dual-scenario mock factory (`baseline` vs `post_injection`).
- `analyzers/citation_parser.py`: Multi-provider citation extractor & URL normalizer for `elesium.online` (and associated domains).
- `analyzers/brand_share_parser.py`: Brand mention, recommendation intent, ranking, and entity grounding density calculator.
- `dataset.py`: Query loader and validator.
- `enterprise_ai_procurement_queries.json`: The 50 curated queries from `.agents/teamwork/explorer_survey_3/enterprise_ai_procurement_queries.json`.
- `engine.py`: Asynchronous batch runner with semaphore concurrency control and retry logic.

## Acceptance Criteria
- Full package runs cleanly on Python 3.9.6 using installed `httpx`, `pydantic`, and `pytest`.
- Providers execute live calls when keys are set, and fall back to deterministic mock responses when keys are absent.
- Exactly 50 queries across the 3 enterprise domains are loaded and validated.
- All unit and provider tests pass.

## References
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/PROJECT.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_2/handoff.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_3/handoff.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_3/enterprise_ai_procurement_queries.json`
