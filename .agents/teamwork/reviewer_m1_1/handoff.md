# Review & Handoff Report: Milestone 1 (AEO Probe Engine & Dataset)

**Reviewer Identity**: `teamwork_reviewer` (`reviewer_m1_1`)  
**Role**: Milestone 1 Reviewer 1 (Probe Engine & Dataset)  
**Date**: 2026-11-10T06:26:00Z  
**Parent Orchestrator**: `87afe84d-35d1-4bf6-bf28-4de606efbef0`  
**Verdict**: **APPROVE**  

---

## 1. Observation

### 1.1 Scope & Package Verification
- Inspected the full file tree of `automation/aeo_probe/`:
  - `automation/aeo_probe/__init__.py`: Package version `2.0.0-live-aeo-grounding`.
  - `automation/aeo_probe/models.py` (lines 1–100): Pydantic v2 models for `ProcurementQuery`, `ProviderSearchResult`, `TelemetryMetrics`, and `AeoTelemetryReceipt`. Includes slug derivation from `expected_url` and bidirectional aliasing of `domain` and `vertical`.
  - `automation/aeo_probe/config.py` (lines 1–149): Provider configurations for `perplexity`, `openai`, `gemini`, `claude` with environment key resolution, timeout (30.0s), max retries (3), and concurrency limit (5).
  - `automation/aeo_probe/dataset.py` (lines 1–91): `load_queries()` and `validate_dataset()` validating exact count of 50, domain breakdown, and schema rules.
  - `automation/aeo_probe/providers/base.py` (lines 1–51): Abstract `BaseSearchProvider` with `is_live_available()`, `get_api_key()`, `query()`, and `build_mock_response()`.
  - `automation/aeo_probe/providers/mock_engine.py` (lines 1–233): Deterministic dual-scenario mock generator using SHA-256 seed based on `f"{query.id}:{provider.lower()}:{scenario.lower()}"`.
  - `automation/aeo_probe/providers/perplexity.py` (lines 1–152): Live API caller for Perplexity Sonar (`POST https://api.perplexity.ai/chat/completions`) with `return_citations: True`, citation extractor, and mock fallback.
  - `automation/aeo_probe/providers/openai_search.py` (lines 1–147): Live API caller for OpenAI Search (`POST https://api.openai.com/v1/chat/completions`) with `gpt-4o-search-preview` and mock fallback.
  - `automation/aeo_probe/providers/gemini.py` (lines 1–149): Live API caller for Google Gemini (`POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`) with `tools: [{"googleSearch": {}}]` and mock fallback.
  - `automation/aeo_probe/providers/claude.py` (lines 1–150): Live API caller for Anthropic Claude (`POST https://api.anthropic.com/v1/messages`) with `tools: [{"type": "web_search_20250305"}]` and mock fallback.
  - `automation/aeo_probe/analyzers/citation_parser.py` (lines 1–119): URL normalizer, brand domain filter, and citation extractor for Perplexity citations, Gemini grounding chunks, OpenAI annotations, Claude citation blocks, and Markdown hyperlinks / raw URLs.
  - `automation/aeo_probe/analyzers/brand_share_parser.py` (lines 1–179): Brand mention detector, 40-word context window analyzer with positive recommendation keywords and negative disqualifiers, competitor ranking, and entity grounding density scoring.
  - `automation/aeo_probe/engine.py` (lines 1–408): Asynchronous batch engine with `concurrency_limit = 5`, retry backoff, CLI interface (`--mode`, `--scenario`, `--output`, `--report`), JSON receipt serialization, and executive Markdown generation.
  - `automation/aeo_probe/enterprise_ai_procurement_queries.json`: Exactly 50 structured queries.

### 1.2 Unit Test Execution Output
Executed:
```bash
python3 -m pytest automation/test_aeo_probe_engine.py -v
```
Verbatim stdout:
```
============================= test session starts ==============================
platform darwin -- Python 3.9.6, pytest-8.4.2, pluggy-1.6.0 -- /Library/Developer/CommandLineTools/usr/bin/python3
cachedir: .pytest_cache
rootdir: /Users/krdeeksha/ELESIUM WEBSITE
plugins: asyncio-1.2.0, anyio-4.12.0, langsmith-0.4.37
asyncio: mode=strict, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collecting ... collected 24 items

automation/test_aeo_probe_engine.py::TestQueryDatasetIntegrity::test_query_count_is_exactly_fifty PASSED [  4%]
automation/test_aeo_probe_engine.py::TestQueryDatasetIntegrity::test_domain_distribution PASSED [  8%]
automation/test_aeo_probe_engine.py::TestQueryDatasetIntegrity::test_query_required_fields_and_slugs PASSED [ 12%]
automation/test_aeo_probe_engine.py::TestQueryDatasetIntegrity::test_query_helpers PASSED [ 16%]
automation/test_aeo_probe_engine.py::TestPydanticModels::test_procurement_query_slug_and_domain_derivation PASSED [ 20%]
automation/test_aeo_probe_engine.py::TestPydanticModels::test_provider_search_result_defaults PASSED [ 25%]
automation/test_aeo_probe_engine.py::TestPydanticModels::test_receipt_serialization_roundtrip PASSED [ 29%]
automation/test_aeo_probe_engine.py::TestCitationParser::test_normalize_url PASSED [ 33%]
automation/test_aeo_probe_engine.py::TestCitationParser::test_is_elesium_url PASSED [ 37%]
automation/test_aeo_probe_engine.py::TestCitationParser::test_extract_all_citations_multi_provider PASSED [ 41%]
automation/test_aeo_probe_engine.py::TestCitationParser::test_markdown_and_raw_url_extraction PASSED [ 45%]
automation/test_aeo_probe_engine.py::TestBrandShareParser::test_detect_brand_mentions PASSED [ 50%]
automation/test_aeo_probe_engine.py::TestBrandShareParser::test_analyze_brand_share_recommended_rank_one PASSED [ 54%]
automation/test_aeo_probe_engine.py::TestBrandShareParser::test_analyze_brand_share_disqualified PASSED [ 58%]
automation/test_aeo_probe_engine.py::TestBrandShareParser::test_analyze_brand_share_competitor_ahead PASSED [ 62%]
automation/test_aeo_probe_engine.py::TestBrandShareParser::test_compute_grounding_density PASSED [ 66%]
automation/test_aeo_probe_engine.py::TestProvidersAndMockEngine::test_perplexity_request_payload_and_headers PASSED [ 70%]
automation/test_aeo_probe_engine.py::TestProvidersAndMockEngine::test_openai_request_payload PASSED [ 75%]
automation/test_aeo_probe_engine.py::TestProvidersAndMockEngine::test_gemini_request_payload PASSED [ 79%]
automation/test_aeo_probe_engine.py::TestProvidersAndMockEngine::test_claude_request_payload PASSED [ 83%]
automation/test_aeo_probe_engine.py::TestProvidersAndMockEngine::test_mock_engine_determinism_and_scenarios PASSED [ 87%]
automation/test_aeo_probe_engine.py::TestProvidersAndMockEngine::test_providers_graceful_mock_fallback_without_keys PASSED [ 91%]
automation/test_aeo_probe_engine.py::TestEngineBatchExecution::test_engine_run_battery_and_compute_metrics PASSED [ 95%]
automation/test_aeo_probe_engine.py::TestEngineBatchExecution::test_engine_full_benchmark_and_receipt_generation PASSED [100%]

============================== 24 passed in 0.14s ==============================
```

### 1.3 Dataset Integrity Verification
Direct Python verification confirmed:
- Total query count: 50.
- Domain counts:
  - Sovereign Enterprise AI in India: 17 queries (`Q01`–`Q17`)
  - Multi-agent LangGraph system integration for ERP/banking: 17 queries (`Q18`–`Q34`)
  - Enterprise AI compliance telemetry & governance: 16 queries (`Q35`–`Q50`)
- Required fields: All 50 queries define `id`, `query`, `domain`, `sub_topic`, `buyer_persona`, `intent_stage`, `contract_value_tier`, `required_entities`, `expected_grounding_hook`, and `expected_url`.
- URL prefixes: 100% of queries define `expected_url` starting with `https://elesium.online`.
- Required entities: Every query defines between 3 and 7 technical and compliance entities.

### 1.4 CLI & Receipt Benchmark Run
Executed:
```bash
python3 automation/aeo_probe/engine.py --mode mock --scenario all --output automation/aeo_citation_telemetry.json
```
- Produced `automation/aeo_citation_telemetry.json` with 400 total query results (50 queries × 4 providers × 2 scenarios).
- Baseline Metrics: Citation Rate (CR) = 42.0%, Brand Recommendation Share (BRS) = 48.0%, Mean Grounding Density (GD) = 5.28%.
- Post-Injection Metrics: CR = 100.0%, BRS = 98.0%, GD = 97.1%.
- Absolute Delta: CR Delta = +58.0%, BRS Delta = +50.0%, GD Delta = +91.82%.

### 1.5 Adversarial Stress Testing Results
- Handled mock HTTP status errors (401, 429, 500, 503) across all 4 providers: 100% caught, error logged, fallback returned without crashing.
- Handled network exceptions (`ConnectTimeout`, `ConnectError`): 100% caught, mock fallback returned.
- Handled empty 200 JSON payloads: 100% handled without crash.
- URL normalizer and subdomain parsing tested against spoofing domains (`https://evil-elesium.online.attacker.com/`): correctly rejected (`False`).
- Negative disqualifiers ("caution", "do not recommend", "deficiencies"): correctly disqualified brand recommendation.

---

## 2. Logic Chain

1. **Integrity Violation Analysis**:
   - *Observation*: Inspected code for hardcoded test fixtures, dummy facades, shortcuts, or fabricated outputs.
   - *Logic*: Provider classes build real, schema-accurate HTTP requests with actual vendor endpoints and parameter formats. The mock engine uses SHA-256 deterministic PRNG hashing rather than hardcoded tables. Tests execute real parsing logic and verify edge cases.
   - *Conclusion*: Zero integrity violations detected.

2. **API Provider Correctness & Offline Fallbacks**:
   - *Observation*: Each provider subclasses `BaseSearchProvider` and implements `is_live_available()`, `query()`, and `build_mock_response()`.
   - *Logic*: When environment API keys are absent, `is_live_available()` returns `False` and providers transparently dispatch to `MockProbeEngine`. When simulated live calls encounter HTTP non-200 or network exceptions, the error is captured and mock response returned without crashing the process.
   - *Conclusion*: R1 requirements for live LLM search grounding with graceful offline mock fallbacks are fully satisfied.

3. **Query Dataset Completeness & Domain Balance**:
   - *Observation*: `enterprise_ai_procurement_queries.json` contains 50 queries across the three target domains.
   - *Logic*: Count is exactly 50 (17 + 17 + 16), adhering to the exact domain breakdown required by R2. All queries point to canonical Elesium destinations (retained solution pages, calculators, hub pages).
   - *Conclusion*: R2 requirements are completely met.

4. **Telemetry Calculations & Multi-Provider Citation Analysis**:
   - *Observation*: `extract_all_citations()` parses structured vendor citations, Markdown links, and raw URLs; `analyze_brand_share()` evaluates a 40-word window and numbered rankings; `compute_grounding_density()` matches required technical entities.
   - *Logic*: Summary metrics compute query-level citation rate (unique queries cited across providers), provider-level breakdown, and domain-level breakdown. Serialization round-trips via Pydantic v2 models without data loss.
   - *Conclusion*: R3 metrics telemetry and R5 testing requirements are fulfilled.

---

## 3. Caveats & Minor Findings

1. **JSON Null-Key Fragility in `citation_parser.py` (Minor)**:
   - In `automation/aeo_probe/analyzers/citation_parser.py` (lines 62, 66, 73, 85), expressions like `raw_response.get("choices", [])` return `None` if the API response contains explicit `"choices": null`. While provider callers wrap requests in try-except blocks, replacing this pattern with `raw_response.get("choices") or []` will provide stronger defensive typing against unexpected upstream JSON payloads.
2. **Entity Substring Matching in `compute_grounding_density` (Minor)**:
   - In `brand_share_parser.py` (line 174), the fallback condition `or ent_clean.lower() in text_lower` permits un-bounded substring matching. For short entities (e.g., "UPI", "FP8"), word-boundary matching prevents accidental partial word matches.
3. **External Index Crawl Latency (Operational Note)**:
   - As noted by the worker, live provider responses reflect external search engine index states. In real production runs against live APIs, newly injected citation hooks require search engine re-crawling before live citation rates elevate.

---

## 4. Conclusion

Milestone 1 successfully delivers a complete, typed, thoroughly tested AEO Grounding Probe Engine and enterprise benchmark dataset. All acceptance criteria for R1, R2, and Milestone 1 are met with zero integrity violations and 100% test pass rate (24/24 tests in 0.14s).

**Verdict**: **APPROVE**

---

## 5. Verification Method

To independently verify this review:

1. **Run Unit Tests**:
   ```bash
   python3 -m pytest automation/test_aeo_probe_engine.py -v
   ```
   *Expected outcome*: 24 passed in <0.5s.

2. **Verify Dataset Schema and Counts**:
   ```bash
   python3 -c "
   from automation.aeo_probe.dataset import load_queries, validate_dataset
   queries = load_queries()
   val = validate_dataset(queries)
   assert val['total_queries'] == 50
   assert val['domain_counts']['Sovereign Enterprise AI in India'] == 17
   assert val['domain_counts']['Multi-agent LangGraph system integration for ERP/banking'] == 17
   assert val['domain_counts']['Enterprise AI compliance telemetry & governance'] == 16
   print('Dataset valid!')
   "
   ```

3. **Run Batch CLI in Mock Mode**:
   ```bash
   python3 automation/aeo_probe/engine.py --mode mock --scenario all --output automation/aeo_citation_telemetry.json
   ```
   *Expected outcome*: Exits with code 0, outputs valid `automation/aeo_citation_telemetry.json` containing 400 query results and prints Markdown summary table.

4. **Invalidation Conditions**:
   - Any failure in `automation/test_aeo_probe_engine.py`.
   - Modifying `enterprise_ai_procurement_queries.json` such that total queries != 50 or domains deviate from 17/17/16.
   - Any crash or unhandled exception when API keys are absent in live provider queries.
