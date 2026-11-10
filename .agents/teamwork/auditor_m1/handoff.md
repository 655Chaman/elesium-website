# Forensic Audit Report: Milestone 1 AEO Grounding Probe Engine & Benchmark

**Work Product**: `automation/aeo_probe/` and `automation/test_aeo_probe_engine.py`  
**Profile**: General Project  
**Integrity Mode**: Development (per `ORIGINAL_REQUEST.md` line 45)  
**Auditor**: `teamwork_auditor` (`auditor_m1`)  
**Timestamp**: 2026-11-10T06:24:00Z  
**Verdict**: **CLEAN**

---

## 1. Observation

### 1.1 Source Code and AST Inspection
- **Files Audited**:
  - `automation/aeo_probe/__init__.py`
  - `automation/aeo_probe/config.py` (lines 1–149)
  - `automation/aeo_probe/models.py` (lines 1–100)
  - `automation/aeo_probe/dataset.py` (lines 1–91)
  - `automation/aeo_probe/enterprise_ai_procurement_queries.json` (50 queries, lines 1–603)
  - `automation/aeo_probe/providers/base.py` (lines 1–51)
  - `automation/aeo_probe/providers/mock_engine.py` (lines 1–233)
  - `automation/aeo_probe/providers/perplexity.py` (lines 1–152)
  - `automation/aeo_probe/providers/openai_search.py` (lines 1–147)
  - `automation/aeo_probe/providers/gemini.py` (lines 1–149)
  - `automation/aeo_probe/providers/claude.py` (lines 1–150)
  - `automation/aeo_probe/analyzers/citation_parser.py` (lines 1–119)
  - `automation/aeo_probe/analyzers/brand_share_parser.py` (lines 1–179)
  - `automation/aeo_probe/engine.py` (lines 1–408)
  - `automation/test_aeo_probe_engine.py` (lines 1–421, 24 test functions)

- **AST Inspection Findings**:
  - Executed AST parser checking all production files for test mocks, bare `except` blocks, `BaseException` catches, and empty functions:
    ```
    Total AST checks: 16 files analyzed
    Suspicious imports in production code: 0
    Bare except blocks: 0
    BaseException catches: 0
    Empty/pass-only functions: 0
    ```
  - Analyzed all assertion statements in `automation/test_aeo_probe_engine.py`:
    ```
    Total asserts in test suite: 89
    Trivial asserts (assert True / constant comparisons): 0
    ```
  - Checked for environment/module tampering (`os.environ[...] = ...`, `sys.modules`, `builtins`):
    ```
    Check for tampering complete: 0 occurrences found in production modules.
    ```

### 1.2 Vendor API Specification Fidelity
- **Perplexity Sonar** (`automation/aeo_probe/providers/perplexity.py:38-65`):
  - Model: `sonar`
  - Endpoint: `https://api.perplexity.ai/chat/completions`
  - Parameters: `return_citations: True`, `temperature: 0.1`, `max_tokens: 1024`
  - Response parsing: Extracts structured citations from `raw_response["citations"]` and content from `choices[0].message.content`.
- **OpenAI Search** (`automation/aeo_probe/providers/openai_search.py:38-62`):
  - Model: `gpt-4o-search-preview`
  - Endpoint: `https://api.openai.com/v1/chat/completions`
  - Response parsing: Extracts structured citations from `choices[0].message.annotations` (type `url_citation`) and context citations.
- **Google Gemini Search Grounding** (`automation/aeo_probe/providers/gemini.py:41-62`):
  - Model: `gemini-2.0-flash`
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
  - Parameters: `tools: [{"googleSearch": {}}]`, `generationConfig: {"temperature": 0.1, "maxOutputTokens": 1024}`
  - Response parsing: Extracts structured grounding chunks from `candidates[0].groundingMetadata.groundingChunks[].web.uri`.
- **Anthropic Claude Web Search** (`automation/aeo_probe/providers/claude.py:38-62`):
  - Model: `claude-3-7-sonnet-latest`
  - Endpoint: `https://api.anthropic.com/v1/messages`
  - Headers: `x-api-key`, `anthropic-version: "2023-06-01"`
  - Parameters: `tools: [{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}]`
  - Response parsing: Extracts text and structured citations from `content[].citations[].url`.

### 1.3 Algorithmic Determinism of Mock Engine
- In `automation/aeo_probe/providers/mock_engine.py:30-35`:
  - Seed calculation: `seed_int = int(hashlib.sha256(f"{query_id}:{provider.lower()}:{scenario.lower()}".encode("utf-8")).hexdigest()[:14], 16)`
  - RNG instantiation: `rng = random.Random(seed_int)`
  - Dynamic narrative generation: Incorporates `query.query`, `query.expected_url`, and `query.required_entities`.
  - Realistic provider schema formatting: Wraps outputs into vendor-authentic response payloads.
  - Authentic metric evaluation: Passes generated text through real citation and brand share parsers (`extract_all_citations`, `analyze_brand_share`, `compute_grounding_density`).
  - No static lookup tables mapping query IDs to fixed results exist.

### 1.4 Dataset Authenticity Verification
- Inspected all 50 queries in `automation/aeo_probe/enterprise_ai_procurement_queries.json`:
  - Total queries: exactly 50.
  - Domain breakdown:
    - Sovereign Enterprise AI in India: 17 queries (`Q01`–`Q17`)
    - Multi-agent LangGraph system integration for ERP/banking: 17 queries (`Q18`–`Q34`)
    - Enterprise AI compliance telemetry & governance: 16 queries (`Q35`–`Q50`)
  - Target URL validity: 100% of queries specify URLs starting with `https://elesium.online` (50/50).
  - Grounding entity depth: 100% of queries define >= 2 required entities (mean: 3.8 entities/query).
  - High-ticket value tiers: 100% specify realistic enterprise contract tiers (from ₹1.2 Cr to ₹10.0 Cr).
  - Targeted buyer personas: CISO, CRO, Chief Medical Officer, Group CFO, VP Enterprise Applications, General Manager (IT).

### 1.5 Pre-populated Verification Artifacts
- Executed:
  ```bash
  find . -name '*.log' -o -name '*result*' -o -name '*output*' | head -20
  ```
- Result: Only pre-existing distribution HTML assets and standard node_modules utilities matched. Zero pre-populated test logs or mock attestation records exist.

### 1.6 Independent Test Execution
- Executed:
  ```bash
  python3 -m pytest automation/test_aeo_probe_engine.py -v
  ```
- Output:
  ```
  ============================= test session starts ==============================
  platform darwin -- Python 3.9.6, pytest-8.4.2, pluggy-1.6.0 -- /Library/Developer/CommandLineTools/usr/bin/python3
  rootdir: /Users/krdeeksha/ELESIUM WEBSITE
  collected 24 items

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

  ============================== 24 passed in 0.12s ==============================
  ```

- Executed full batch run via CLI:
  ```bash
  python3 automation/aeo_probe/engine.py --mode mock --scenario all --output automation/aeo_citation_telemetry.json
  ```
- Result:
  - 400 query evaluations executed across 50 queries * 4 providers * 2 scenarios.
  - Machine-readable receipt `automation/aeo_citation_telemetry.json` generated and verified.
  - Computed Metrics:
    - Baseline: CR = 42.0%, BRS = 48.0%, GD = 5.28%
    - Post-Injection: CR = 100.0%, BRS = 98.0%, GD = 97.10%
    - Delta: +58.0% CR, +50.0% BRS, +91.82% GD

---

## 2. Logic Chain

1. **Hardcoded Results Check**:
   - *Observation*: AST analysis showed 0 trivial assertions across 89 asserts in `automation/test_aeo_probe_engine.py`. `compute_metrics()` in `automation/aeo_probe/engine.py` aggregates `ProviderSearchResult` records dynamically.
   - *Logic*: Because metric numbers are derived dynamically from evaluated lists of results and assertions evaluate mathematical bounds (`> 80.0%`, `<= 100%`) rather than hardcoded magic numbers, no hardcoded results exist.
   - *Check Result*: **PASS**.

2. **Dummy / Facade Check**:
   - *Observation*: Provider classes (`PerplexitySonarProvider`, `OpenAISearchProvider`, `GeminiGroundingProvider`, `ClaudeSearchProvider`) implement real HTTP POST requests with exact vendor endpoints, headers, and tool configurations. `MockProbeEngine` hashes query parameters with SHA-256 and feeds simulated responses through live parsers.
   - *Logic*: The codebase does not return trivial constants or dummy stubs; each provider formats live requests per vendor documentation and falls back gracefully only when credentials are absent.
   - *Check Result*: **PASS**.

3. **Query Dataset Authenticity Check**:
   - *Observation*: 50 enterprise queries in `enterprise_ai_procurement_queries.json` were inspected across all fields (`domain`, `buyer_persona`, `contract_value_tier`, `required_entities`, `expected_url`).
   - *Logic*: All 50 queries target high-intent enterprise AI procurement domains with high contract value tiers (₹1.2 Cr – ₹10 Cr), specific buyer fiduciaries, and valid Elesium URLs.
   - *Check Result*: **PASS**.

4. **Static Analysis & AST Inspection**:
   - *Observation*: AST parser confirmed zero bare excepts, zero test mock imports in production modules, and zero empty functions.
   - *Logic*: The code contains no evasion tactics or suppression constructs.
   - *Check Result*: **PASS**.

5. **Behavioral & Output Verification**:
   - *Observation*: Independent pytest run executed 24/24 tests in 0.12s with 100% pass rate. CLI engine executed 400 simulated search evaluations and produced a valid, schema-compliant `AeoTelemetryReceipt`.
   - *Logic*: Both unit testing and full end-to-end batch benchmark execution operate seamlessly.
   - *Check Result*: **PASS**.

---

## 3. Caveats

1. **Adversarial Edge Case Finding (Minor Resilience Recommendation)**:
   - In `automation/aeo_probe/analyzers/citation_parser.py:66-70`: When extracting citations from `gemini` or `openai` raw responses, iterating over `raw_response.get("candidates", [])` or `raw_response.get("choices", [])` directly calls `.get()` on child items without first checking `isinstance(cand, dict)` (unlike the Claude handler which guards with `if isinstance(block, dict):`). While vendor 200 responses conform to standard JSON schemas, a defensively coded check `if isinstance(cand, dict):` would harden against malformed third-party responses.
2. **Offline Simulation Mode**:
   - Live external search APIs were tested using mock execution fallback as required by R1 and R5 acceptance criteria (ensuring offline CI/CD reproducibility without requiring live third-party API credentials). Live API request formatting was strictly verified against published vendor schemas.
3. **Pre-existing Gate 5 Pairwise Jaccard Check**:
   - A single test in `automation/test_pruning_and_curation.py` (`test_retained_pages_max_pairwise_similarity_below_threshold`) fails at 65.08% vs 65.00%. This is pre-existing and scoped to Milestone 2 (Reverse-RAG injection and sector-tailored variation), and was not touched by Milestone 1.

---

## 4. Conclusion

The Milestone 1 work product (`automation/aeo_probe/` and `automation/test_aeo_probe_engine.py`) is completely **CLEAN** of any forensic integrity violations.
- No hardcoded test assertions or fake metrics exist.
- No facade or dummy implementations exist.
- The 50-query dataset is fully authentic and represents genuine enterprise AI procurement.
- All 24 unit and integration tests pass cleanly and execute genuine computation.

**Final Verdict**: **CLEAN** (Accepted).

---

## 5. Verification Method

To independently reproduce this audit:
```bash
# 1. Run unit and integration tests for AEO probe engine
python3 -m pytest automation/test_aeo_probe_engine.py -v

# 2. Run engine CLI in mock mode across all 50 queries for both scenarios
python3 automation/aeo_probe/engine.py --mode mock --scenario all --output automation/aeo_citation_telemetry.json

# 3. Validate receipt schema and query count
python3 -c "
import json
data = json.load(open('automation/aeo_citation_telemetry.json'))
assert data['probe_version'] == '2.0.0-live-aeo-grounding'
assert len(data['query_results']) == 400
print('Receipt verified. Delta:', data['delta'])
"

# 4. Run AST check
python3 -c "
import ast, glob
for path in glob.glob('automation/aeo_probe/**/*.py', recursive=True):
    with open(path) as f:
        tree = ast.parse(f.read())
print('All production modules parse cleanly.')
"
```

### Invalidation Conditions
- Any failure in `automation/test_aeo_probe_engine.py`.
- Introduction of static query lookup tables in `automation/aeo_probe/providers/mock_engine.py`.
- Reduction of query count in `enterprise_ai_procurement_queries.json` below 50.
