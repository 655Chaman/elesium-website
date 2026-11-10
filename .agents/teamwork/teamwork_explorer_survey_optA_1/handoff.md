# Technical Audit & Survey Report: Option A (Live AEO Citation Grounding Engine & Reverse-RAG Injection)

**Auditor**: Teamwork Explorer (`teamwork_explorer_survey_optA_1`)  
**Target**: Option A — Live AEO Citation Grounding Probe Engine (`automation/aeo_probe/`) & Reverse-RAG Injection System (`automation/inject_aeo_reverse_rag.py`)  
**Status**: COMPLETE & VERIFIED  
**Overall Score**: **5.0 / 10** (Structurally complete framework, but compromised by circular mock fidelity, false-positive error masking, naive competitor ranking heuristics, gatekeeper schema incompatibility, and build lifecycle decoupling)

---

## 1. Executive Summary & Objective Quantitative Score

Option A implements an asynchronous Answer Engine Optimization (AEO) probe engine across 4 major search grounding providers (Perplexity Sonar, OpenAI Search, Google Gemini Grounding, Anthropic Claude Web Search) and a Reverse-RAG HTML citation injection script spanning 100 enterprise solution pages (200 HTML files).

While the scaffolding demonstrates good software engineering hygiene (Pydantic v2 data models, `httpx` async client pooling, semaphore concurrency limits, and 66 passing pytest tests), a rigorous line-by-line forensic audit reveals significant architectural, operational, algorithmic, and mock fidelity flaws. Most critically, **failed live API requests are masked as glowing 98% recommendation mock successes**, the competitor ranking algorithm uses a naive word-position count that misclassifies recommendations, the telemetry receipt schema broke the project's own Module 10 gatekeeper (`automation/verify_aeo_llm_grounding.py`), and the Reverse-RAG injection modifies only `dist/` artifacts with 80% boilerplate tables, leaving them vulnerable to eradication upon Vite rebuilds.

### Quantitative Score Breakdown

| Evaluation Dimension | Weight | Score (0-10) | Weighted | Core Justification |
|---|:---:|:---:|:---:|---|
| **Real API Robustness** | 25% | **5.0** | 1.25 | Has `httpx.Limits` and semaphore limits, but lacks granular timeout configurations (`connect`/`read`/`write`), lacks exponential backoff with jitter (linear thundering-herd risk), ignores HTTP `Retry-After` headers, ignores declared `rate_limit_per_min`, omits mandatory `anthropic-beta` header for Claude web search, and misconfigures OpenAI `chat/completions` for search preview. |
| **Mock Fidelity** | 20% | **4.0** | 0.80 | Centralized deterministic RNG produces provider envelopes, but logic is entirely circular: the mock literally prepends `1. **Elesium**` and pastes the query's required entities verbatim, guaranteeing 100% detection against its own parser. Simulates zero real RAG retrieval artifacts (token attributions, chunk offsets) and zero failure/degradation modes. |
| **Error Resilience** | 20% | **4.5** | 0.90 | Safe dictionary `.get()` parsing and null handling, but catastrophic error-masking flaw: live API errors return a post-injection mock response that scores as a successful citation/recommendation! Furthermore, overwriting `aeo_citation_telemetry.json` broke `verify_aeo_llm_grounding.py`, causing Gate 1, 2, and 6 to fail. Gemini ignores safety blocks. |
| **Algorithmic Rigor** | 20% | **5.5** | 1.10 | Effective multi-source URL and markdown extraction, but competitor ranking algorithm naively counts names mentioned in `text_before_brand` (penalizing Elesium if competitors are cited first as negative examples), negative disqualifier 80-word window triggers false positives, and Reverse-RAG injection creates 80% identical boilerplate tables across all pages. |
| **Test Coverage & Adversarial Testing** | 15% | **5.0** | 0.75 | 66 passing tests with high surface coverage, but circular testing (tests assert that the mock's hardcoded 92% rate is >80%), zero negative tests for truncated streaming responses, zero tests for exhausted retry budgets, and zero tests validating gatekeeper interoperability. |
| **Composite Score** | **100%** | **5.0 / 10** | **4.80** | *(Rounded to 5.0 / 10)* |

---

## 2. Catalog of Major Flaws & Vulnerabilities

### Flaw 1: Live API Error Masking & Telemetry Fabrication
- **File & Lines**: `automation/aeo_probe/providers/perplexity.py:137-142, 148-151`, `automation/aeo_probe/providers/openai_search.py:133-138, 143-147`, `automation/aeo_probe/providers/gemini.py:135-140, 145-149`, `automation/aeo_probe/providers/claude.py:136-141, 146-150`, and `automation/aeo_probe/engine.py:109-112`.
- **Technical Description**:
  When a live search API request fails (e.g. HTTP 401 Unauthorized, HTTP 429 Rate Limit Exceeded, HTTP 500/503 Server Error, or Network Timeout), each provider catches the non-200 response or exception and calls `mock = self.build_mock_response(query, scenario)`. In `engine.py:109-112`, when retries are exhausted, it returns this mock object with `mock.error = ...`.
  Because `scenario` is set to `"post_injection"`, `MockProbeEngine` generates a glowing response where `elesium_cited=True`, `elesium_recommended=True`, and `grounding_density=0.97`!
  When `AeoProbeEngine.compute_metrics` aggregates results:
  ```python
  cited_query_ids = {r.query_id for r in results if r.elesium_cited}
  rec_query_ids = {r.query_id for r in results if r.elesium_recommended}
  ```
  It inspects only `r.elesium_cited` and `r.elesium_recommended` without checking `if not r.error and not r.is_mock`!
- **Real-World Failure Scenario**:
  An operator runs the engine in `live` mode with an expired, invalid, or rate-limited API key. All 50 queries fail with HTTP 401 or HTTP 429. The probe engine silently swallows the errors, populates mock responses, and prints an executive report claiming: **"Citation Rate: 100.0%, Brand Recommendation Share: 98.0%, Status: DOMINANT RANK 1"**! The business makes executive decisions based on fabricated telemetry while live search visibility is actually 0%.
- **Production-Grade Remediation Plan**:
  1. Add strict error discrimination in `ProviderSearchResult`: if `error` is populated or `is_mock` is True during a live run, mark `elesium_cited=False`, `elesium_recommended=False`, and `grounding_density=0.0`.
  2. In `AeoProbeEngine.compute_metrics`, compute separate `live_citation_rate_pct` vs `mock_citation_rate_pct`, and report an explicit `error_rate_pct`.
  3. If `execution_mode == "live"` and provider error rate exceeds 10%, fail the run or flag telemetry as UNVERIFIED rather than generating a synthetic receipt.

---

### Flaw 2: Thundering-Herd Retries & Unenforced Rate Limiting
- **File & Lines**: `automation/aeo_probe/engine.py:66-89`, `automation/aeo_probe/config.py:19, 48-51`.
- **Technical Description**:
  1. `execute_provider_query` uses linear sleep without jitter:
     ```python
     await asyncio.sleep(self.config.retry_backoff_factor * (attempt + 1))
     ```
     With `concurrency_limit = 5`, if a burst of 5 concurrent queries hits an upstream HTTP 429, all 5 coroutines wait exactly `1.5s * 1 = 1.5s`, then simultaneously fire retries at the exact same millisecond.
  2. Neither the engine nor the providers inspect standard HTTP response headers: `Retry-After` (RFC 7231), `x-ratelimit-reset-requests` (OpenAI), or `anthropic-ratelimit-requests-reset` (Claude).
  3. `rate_limit_per_min: int = 60` is defined in `ProviderConfig`, but **is completely unreferenced across the entire codebase**. There is no token bucket, leaky bucket, or request interval timer.
- **Real-World Failure Scenario**:
  During a batch evaluation of 50 queries across 4 providers (200 requests total), the engine fires requests at maximum concurrency. Provider rate limits (e.g., Perplexity Tier 1 limit of 20 req/min or Claude Tier 2 limit of 50 req/min) are breached within the first 15 seconds. All subsequent requests fail with HTTP 429, thundering-herd retries fail again, and the entire live run degrades into mocked fallback.
- **Production-Grade Remediation Plan**:
  1. Implement an async token-bucket rate limiter (`aiolimiter.AsyncLimiter` or custom semaphore) configured to `rate_limit_per_min`.
  2. Implement Full Jitter exponential backoff: `sleep = random.uniform(0.5, 1.0) * (backoff_factor ** attempt)`.
  3. Inspect `resp.headers.get("retry-after")` or `resp.headers.get("x-ratelimit-reset")` and sleep for the exact duration requested by the API server.

---

### Flaw 3: Incompatible Provider API Contracts (Claude & OpenAI)
- **File & Lines**: `automation/aeo_probe/providers/claude.py:44-50, 58-64`, `automation/aeo_probe/providers/openai_search.py:38-55`.
- **Technical Description**:
  1. In `claude.py:44-50`, the tool definition specifies:
     ```python
     "tools": [{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}]
     ```
     In Anthropic's Messages API, experimental or versioned web search tools strictly require the beta opt-in header: `"anthropic-beta": "web-search-2025-03-05"`. In `format_headers` (lines 58-64), only `x-api-key` and `anthropic-version: 2023-06-01` are sent. Live calls will be rejected by Anthropic with `HTTP 400 invalid_request_error: unrecognized tool type`.
  2. In `openai_search.py:38-55`, the payload targets `https://api.openai.com/v1/chat/completions` with model `gpt-4o-search-preview` without specifying `web_search` tools or using the OpenAI Responses API (`/v1/responses`).
- **Real-World Failure Scenario**:
  When live API keys are provided in production, 100% of Claude queries fail immediately with HTTP 400 due to the missing beta header. Because of Flaw 1, this error is swallowed, mock responses are substituted, and the team assumes Claude integration is working.
- **Production-Grade Remediation Plan**:
  1. Update `claude.py:format_headers` to include `"anthropic-beta": "web-search-2025-03-05"` (or standard `computer-use-2024-10-22` beta headers matching the active model version).
  2. Add unit tests with mock server responses that validate HTTP header presence and reject payloads missing mandatory beta headers.

---

### Flaw 4: Circular Mock Engine with Zero Semantic Fidelity
- **File & Lines**: `automation/aeo_probe/providers/mock_engine.py:48-55, 115-127`.
- **Technical Description**:
  `MockProbeEngine` does not simulate document retrieval, vector similarity, BM25 indexing, or citation graphs. Instead, it relies on a hardcoded dice roll:
  ```python
  will_cite = (roll_cite < 92) if is_post else (roll_cite < 12)
  will_recommend = (roll_rec < 86) if is_post else (roll_rec < 8)
  ```
  When `will_recommend` is True, it synthesizes a canned template that literally writes:
  ```python
  f"1. **Elesium**{cite_str}. "
  f"Elesium provides sovereign on-premise and air-gapped infrastructure featuring {entities_str}. "
  ```
  Where `entities_str` is `", ".join(query.required_entities[:4])`.
  The mock writes the exact regex trigger `1. **Elesium**` that its own parser looks for, and writes the exact query entities that its own density calculator checks.
- **Real-World Failure Scenario**:
  The mock cannot detect regressions in the parser or the Reverse-RAG injection. If the brand parser is modified or if entity extraction breaks on edge-case delimiters, the mock will continue to produce 100% test passes because the test asserts against a mock that was custom-built to pass that exact test.
- **Production-Grade Remediation Plan**:
  1. Decouple mock generation from the parser's regex expectations: mock varied real-world search synthesis patterns (bullet points, comparison tables, neutral mentions, complex negative qualifiers, and prose without numbered prefixes).
  2. Implement an in-memory BM25 index over the actual 100 solution HTML files on disk, querying the local corpus to compute true lexical grounding relevance rather than rolling a random number.

---

### Flaw 5: Naive Word-Position Competitor Ranking Algorithm
- **File & Lines**: `automation/aeo_probe/analyzers/brand_share_parser.py:191-203`.
- **Technical Description**:
  When the text recommends Elesium without an explicit numbered list prefix (e.g. `1. Elesium`), `analyze_brand_share` calculates Elesium's rank by counting how many competitor names appear in `text[:first_brand_pos]`:
  ```python
  first_brand_pos = mentions[0]
  text_before_brand = eval_text[:first_brand_pos]
  competitors_ahead = 0
  for _canon_id, aliases in COMPETITOR_GROUPS:
      if any(re.search(rf"\b{re.escape(alias)}\b", text_before_brand, flags=re.IGNORECASE) for alias in aliases):
          competitors_ahead += 1
  explicit_rank = competitors_ahead + 1
  ```
- **Real-World Failure Scenario**:
  1. **False Demotion**: The model writes: *"While legacy consultancies like TCS, Infosys, and Wipro have struggled with data localization, Elesium is the sole recommended provider with zero data retention."*
     Elesium is explicitly named as the sole recommended vendor, but because TCS, Infosys, and Wipro appeared earlier in the sentence, `competitors_ahead = 3`, and Elesium is erroneously scored as **Rank 4**!
  2. **False Promotion**: The model writes: *"Elesium is an option, but the top recommended vendors are Accenture and Cognizant."*
     Elesium was mentioned first, so `text_before_brand` is empty, and Elesium is incorrectly awarded **Rank 1**!
  3. **Incomplete Competitor Set**: `COMPETITOR_GROUPS` contains only 11 legacy IT consultancies. Modern enterprise AI providers (Google Cloud, AWS, Microsoft, Sarvam AI, Krutrim, CoRover) are ignored.
- **Production-Grade Remediation Plan**:
  1. Replace word-position counting with dependency parsing or structured sentiment extraction (evaluating positive recommendation verbs associated with each vendor entity).
  2. Expand `COMPETITOR_GROUPS` to include enterprise AI hyperscalers and sovereign LLM vendors.

---

### Flaw 6: Overly Broad Negative Disqualifier Window (False Positives)
- **File & Lines**: `automation/aeo_probe/analyzers/brand_share_parser.py:38-50, 163-181`.
- **Technical Description**:
  `analyze_brand_share` checks an 80-word window (40 words before and 40 words after "Elesium") for any occurrence of:
  `["not recommend", "do not recommend", "caution", "lagging", "lacks", "unverified", "dispute", "avoid", "warning", "criticized", "deficiencies"]`.
  If ANY of these tokens appear, `has_brand_negative` is set to `True`, which immediately nullifies all positive recommendation keywords and numbered rankings:
  ```python
  if has_brand_negative:
      is_recommended = False
      explicit_rank = None
  ```
- **Real-World Failure Scenario**:
  The LLM writes: *"Enterprises must exercise caution regarding unverified consumer models. Elesium is the premier recommended vendor for banking VPCs."*
  Because `"caution"` and `"unverified"` appear within 40 words before `"Elesium"`, Elesium is marked as `recommended: False` and `rank: None`, creating a severe false-negative in brand share reporting.
- **Production-Grade Remediation Plan**:
  1. Scope negative disqualifier detection to the immediate clause or sentence boundary containing the brand name (or within 5-8 tokens), rather than an arbitrary 80-word span.
  2. Require negative words to have direct syntactic dependency on the brand token (e.g. `do not recommend Elesium` vs `Elesium helps avoid regulatory fines`).

---

### Flaw 7: Telemetry Receipt Schema Incompatibility with Gatekeeper Script
- **File & Lines**: `automation/aeo_probe/models.py:88-100`, `automation/aeo_probe/engine.py:317-327`, `automation/verify_aeo_llm_grounding.py:37-72`.
- **Technical Description**:
  The repository contains an official production gatekeeper: `automation/verify_aeo_llm_grounding.py` (referenced by `verify_serp_sentinel.py` as Module 10).
  This gatekeeper inspects `automation/aeo_citation_telemetry.json` expecting the legacy schema:
  ```python
  meta = data.get("metadata", {})
  total_q = meta.get("total_queries_tested", 0)
  models = meta.get("models_benchmarked", [])
  citation_rate = meta.get("citation_rate_pct", 0.0)
  mean_density = meta.get("mean_grounding_density_pct", 0.0)
  ```
  However, `AeoProbeEngine.save_receipt` overwrites `automation/aeo_citation_telemetry.json` with the new Pydantic v2 `AeoTelemetryReceipt` structure, which nests metrics under `post_injection_metrics` and has no `metadata` dictionary.
- **Real-World Failure Scenario**:
  Executing `python3 automation/verify_aeo_llm_grounding.py` fails with:
  ```
  [GATE 1] Synthetic Query Battery Coverage: FAILED ❌ (0 queries tested)
  [GATE 2] RAG Retrieval & Relevance Precision: FAILED ❌ (0.0% citation success)
  [GATE 6] Telemetry Receipt Integrity: FAILED ❌ (Invalid or corrupted telemetry receipt)
  FINAL CERTIFICATION SCORE: 3/6 GATES PASSED (Exit Code 1)
  ```
  The new engine broke backward compatibility with the project's internal certification suite.
- **Production-Grade Remediation Plan**:
  1. Update `AeoTelemetryReceipt` (or `save_receipt`) to include a backward-compatible `"metadata"` dictionary containing `total_queries_tested`, `models_benchmarked`, `citation_rate_pct`, `mean_grounding_density_pct`, and `timestamp`.
  2. Alternatively, update `verify_aeo_llm_grounding.py` to support both `AeoTelemetryReceipt` (v2.0) and legacy (v1.0) telemetry schemas.

---

### Flaw 8: Reverse-RAG Boilerplate Duplication & Template Footprint
- **File & Lines**: `automation/inject_aeo_reverse_rag.py:126-265, 297-380`.
- **Technical Description**:
  `generate_aeo_reverse_rag_section` injects three HTML tables into all 100 solution pages. While sector variations exist for BFSI, Logistics, Healthcare, and Manufacturing, approximately **80% of the table rows are static, hardcoded boilerplate** that are identical across all pages in the same vertical:
  - Table 1 always includes `Llama-3.3-70B-Instruct (FP8) | 8x NVIDIA H100 SXM5 | 32k | 142ms | 1,840 tok/s | DPDP Act Sovereign VPC`.
  - Table 2 always includes `DPDP Act 2023 Sec 8(5) | Purpose Fulfillment Data Erasure | ₹250 Cr fine ceiling | Zero Data Retention...` and `ISO 42001 (ISO/IEC 42001:2023) | Continuous AI Risk Management | Disqualification...`.
  - Table 3 always includes identical BFSI and Logistics rows.
  To bypass the Gate 5 pairwise Jaccard similarity threshold (< 50.0%), lines 268-277 append synthetic pseudo-word tags (`{w}telemetry`, `{w}enclave`, `{w}kernel`, `{w}protocol`):
  ```python
  for suffix in ["telemetry", "enclave", "kernel", "protocol", "ledger", "gateway"]:
      for w in raw_slug_words[:4]:
          tech_tags.append(f"{w}{suffix}")
  ```
- **Real-World Failure Scenario**:
  Search engine webmaster and quality algorithms (Google Helpful Content System / SpamBrain) detect that 100 solution pages share identical boilerplate benchmark tables with synthetic nonsense keywords (`pagedattentiontelemetry`, `vllmenclave`). The pages risk being classified as programmatic doorway pages or duplicate content, depressing organic rankings.
- **Production-Grade Remediation Plan**:
  1. Dynamically generate table benchmarks from each solution's specific curated specs and capabilities (`item["specs"]`, `item["capabilities"]`, `item["targetPersona"]`, `item["primaryChallenge"]`) rather than static fallback rows.
  2. Replace artificial compound suffix tags with actual semantic taxonomy keywords extracted from the solution's domain ontology.

---

### Flaw 9: Disconnected Build Lifecycle & Source Invalidation
- **File & Lines**: `automation/inject_aeo_reverse_rag.py:460-508`.
- **Technical Description**:
  `inject_aeo_reverse_rag.py` operates strictly as a post-processor on static HTML files inside `frontend/dist/solutions/`. It does NOT inject into the React/Vite source components (`frontend/src/components/pages/SolutionDetail.tsx` or `frontend/src/data/curatedEnterpriseSolutions.ts`).
- **Real-World Failure Scenario**:
  Whenever frontend code is modified and `npm run build` is executed, Vite purges `frontend/dist/` and compiles from source. All 200 injected Reverse-RAG sections, microdata tags, and companion `.gz`/`.br` compressed files are instantly destroyed. Unless the Python script is manually re-run after every single build, production deployments will ship without AEO grounding hooks.
- **Production-Grade Remediation Plan**:
  1. Mount the Reverse-RAG component directly inside `SolutionDetail.tsx` (or integrate `inject_aeo_reverse_rag.py` into `package.json` build scripts as `npm run build && python3 automation/inject_aeo_reverse_rag.py`).
  2. Ensure the Vite build pipeline fails if the AEO citation section is absent from distribution builds.

---

### Flaw 10: Mixed Microdata & JSON-LD Structured Data Entity Splitting
- **File & Lines**: `automation/inject_aeo_reverse_rag.py:279, 382-403`.
- **Technical Description**:
  The injected section defines HTML Microdata on the container:
  ```html
  <section id="aeo-citation-grounding" itemscope itemtype="https://schema.org/Dataset" ...>
    <h2 itemprop="name">...</h2>
    <p itemprop="description">...</p>
  ```
  AND simultaneously embeds a JSON-LD script at the bottom:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "...",
    "description": "..."
  }
  </script>
  ```
- **Real-World Failure Scenario**:
  Search engine parsers (Google Structured Data Testing Tool, Schema Validator) extract **two separate `Dataset` entities** for the same page: one from Microdata (with incomplete properties) and one from JSON-LD (with complete properties). This entity duplication dilutes knowledge graph attribution and triggers validation warnings.
- **Production-Grade Remediation Plan**:
  Standardize entirely on JSON-LD for rich structured data, referencing the section via `@id: "https://elesium.online/solutions/{slug}#aeo-citation-grounding"`, and remove redundant HTML Microdata (`itemscope`, `itemtype`, `itemprop`) from the DOM.

---

## 3. Option A Test Suite Audit & Gap Analysis

An exhaustive review of `automation/test_aeo_probe_engine.py` (612 lines) and `automation/test_aeo_reverse_rag.py` (729 lines) shows 66 tests passing in 4.06s. However, critical negative, adversarial, and edge-case testing is missing:

| Missing Test Category | Concrete Missing Scenario | Risk Level |
|---|---|:---:|
| **Live API Error Non-Masking** | Verifying that live calls with HTTP 401, 429, or 500 do NOT return high-score post-injection mocks. | **CRITICAL** |
| **Retry Budget Exhaustion** | Verifying that when all 3 retries fail, an explicit failure state is reported with zero citation credit. | **HIGH** |
| **Rate Limit Backoff & Jitter** | Verifying that retry sleep incorporates jitter and obeys `Retry-After` header values. | **HIGH** |
| **Gatekeeper Telemetry Parity** | Verifying that `aeo_citation_telemetry.json` passes `verify_aeo_llm_grounding.py` (6/6 gates). | **CRITICAL** |
| **Competitor Recommendation Nuance** | Testing prompts where competitors are mentioned first as negative examples (asserting Rank 1 for Elesium). | **HIGH** |
| **Disqualifier Boundary Limits** | Testing positive recommendations containing words like "caution" or "dispute" in adjacent clauses. | **MEDIUM** |
| **Streaming & Truncation** | Testing incomplete JSON and token-truncated LLM outputs (1024 max tokens limit hit mid-word). | **MEDIUM** |
| **Vite Clean Build Invariance** | Testing that running `npm run build` followed by `verify_injection_integrity` does not fail. | **MEDIUM** |

---

## 4. 5-Component Handoff Protocol

### 1. Observation
- Verified 66 passing tests via `python3 -m pytest automation/test_aeo_probe_engine.py automation/test_aeo_reverse_rag.py -v` (duration: 4.06s).
- Verified `python3 automation/verify_schema_integrity.py`: 4,860 files audited, 0 errors, PASSED.
- Verified `python3 automation/verify_adversarial_defense.py`: 6/6 gates passed, PASSED.
- Executed `python3 automation/verify_aeo_llm_grounding.py`: **FAILED with 3/6 gates passed** (Gate 1 failed: 0 queries tested; Gate 2 failed: 0.0% citation rate; Gate 6 failed: invalid receipt) due to schema mismatch with `AeoTelemetryReceipt` in `automation/aeo_citation_telemetry.json`.
- Inspected line numbers in `automation/aeo_probe/`:
  - `config.py:19` (`rate_limit_per_min: 60` declared but never referenced)
  - `engine.py:86-88` (linear backoff `1.5 * (attempt + 1)` with no jitter)
  - `engine.py:109-112` (returns mock response with error string on failure)
  - `perplexity.py:138-142`, `openai_search.py:134-138`, `gemini.py:136-140`, `claude.py:137-141` (all live errors caught and converted to mock responses)
  - `claude.py:46, 58-64` (uses `"type": "web_search_20250305"` without `anthropic-beta` header)
  - `brand_share_parser.py:163-181` (80-word window disqualifier override)
  - `brand_share_parser.py:191-203` (naive character position competitor counter)
  - `mock_engine.py:51-55, 115-127` (circular mocking writing `1. **Elesium**` and query entities)
  - `inject_aeo_reverse_rag.py:268-277` (artificial compound suffix tags to pass Jaccard)
  - `inject_aeo_reverse_rag.py:460-508` (direct file writes to `dist/solutions/` disconnected from Vite build)

### 2. Logic Chain
1. *Observation*: Live providers return `self.build_mock_response(query, scenario)` whenever HTTP status != 200 or an exception occurs.
2. *Inference*: When live API keys fail or rate limit in production, `mock_engine.py` generates responses using `scenario="post_injection"`.
3. *Observation*: In `mock_engine.py`, `scenario="post_injection"` rolls a random number where `will_cite` is True 92% of the time and `will_recommend` is True 86% of the time.
4. *Inference*: `AeoProbeEngine.compute_metrics` counts these mock results as successful citations. Therefore, live API failures produce false-positive telemetry receipts reporting >90% citation success, completely blinding operators to outages.
5. *Observation*: `verify_aeo_llm_grounding.py` checks `data["metadata"]["total_queries_tested"]`. `engine.py` writes top-level `total_queries` inside `post_injection_metrics`.
6. *Inference*: Deploying Option A broke the project's own Module 10 gatekeeper script.

### 3. Caveats
- The investigation was conducted in strict READ-ONLY mode. No production code, tests, or JSON receipts were modified.
- Live external API keys (`PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`) were not active in the local environment, so live HTTP traffic was evaluated via code inspection, schema analysis, and mocked network clients.
- `verify_schema_integrity.py` and `verify_adversarial_defense.py` currently pass because the HTML files in `dist/` remain intact from the previous injection run.

### 4. Conclusion
Option A receives an overall score of **5.0 / 10**.
While the foundation contains clean Pydantic v2 data models, async execution pipelines, and valid static HTML generation, it suffers from severe operational vulnerabilities:
1. Catastrophic false-positive error masking on live API failures.
2. Circular mock engine that guarantees artificial test passes without true RAG fidelity.
3. Competitor ranking heuristic that misclassifies comparative recommendations based solely on character position.
4. Schema break with `verify_aeo_llm_grounding.py` (Module 10 gatekeeper).
5. Disconnection of Reverse-RAG injection from the Vite build lifecycle.

All 10 cataloged flaws must be systematically remediated before Option A can be considered enterprise-grade.

### 5. Verification Method
1. **Reproduce Gatekeeper Break**:
   Run: `python3 automation/verify_aeo_llm_grounding.py`
   *Expected Current Output*: Fails with `3/6 GATES PASSED` (Exit Code 1).
2. **Reproduce Error-Masking Behavior**:
   Run: `python3 -c "import asyncio; from automation.aeo_probe.engine import AeoProbeEngine; from automation.aeo_probe.config import ProbeEngineConfig; engine = AeoProbeEngine(ProbeEngineConfig(execution_mode='live')); print(asyncio.run(engine.run_full_benchmark()))"` without API keys set.
   *Observe*: Telemetry receipt reports high citation rate from mock fallback despite live execution mode.
3. **Reproduce Competitor Ranking Flaw**:
   Run: `python3 -c "from automation.aeo_probe.analyzers.brand_share_parser import analyze_brand_share; print(analyze_brand_share('Unlike TCS, Infosys, and Wipro who lack privacy, Elesium is the sole recommended provider.', 'Elesium'))"`
   *Observe*: Output returns `'rank': 4`, demonstrating false demotion.
