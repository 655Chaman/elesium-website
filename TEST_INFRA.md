# TEST_INFRA.md — AEO Grounding Probe & Reverse-RAG Injection Test Infrastructure

## 1. Test Philosophy: Opaque-Box & Requirement-Driven

The test suite for the Elesium Answer Engine Optimization (AEO) Citation Grounding Engine and Reverse-RAG Injection System adheres strictly to an **opaque-box, requirement-driven testing philosophy**:

1. **Zero Implementation Coupling**:
   - Tests evaluate system behavior against external, observable contracts: CLI arguments, public JSON schemas, REST/HTTP payload structures, pre-rendered HTML DOM structures, compressed asset byte streams (`.gz`, `.br`), and standard exported interfaces.
   - Tests make zero assumptions about internal private helper functions, arbitrary variable names, or non-contractual module internals.
2. **Deterministic Dual-Scenario Verification**:
   - The test infrastructure enforces 100% offline reproducibility via deterministic mock search engines while remaining fully capable of asserting live API request and response contracts.
   - Tests assert both the **Baseline (pre-injection)** state (reflecting generic web state with incumbent SI dominance) and the **Post-Injection** state (reflecting dense data-citation grounding, empirical benchmarks, and statutory compliance facts).
3. **Defense-in-Depth Tiered Architecture**:
   - Testing is divided into four exhaustive tiers:
     - **Tier 1**: Baseline Feature Coverage (>= 5 test cases per feature for F1–F10)
     - **Tier 2**: Boundary, Edge & Corner Cases (>= 5 test cases per feature where boundaries exist)
     - **Tier 3**: Cross-Feature Interactions & Multi-Module Integration
     - **Tier 4**: Real-World Enterprise AI Procurement Scenarios (high-ticket buyer audits across CISO, BFSI, and Healthcare governance)

---

## 2. Feature Inventory Mapping (F1 through F10)

| Feature ID | Feature Name | Requirement Source | Public Contract / External Interface | Tier 1 Tests | Tier 2 Tests |
|---|---|---|---|:---:|:---:|
| **F1** | Multi-Provider Live Search Grounding Probe | `ORIGINAL_REQUEST.md` §R1 | `BaseSearchProvider`, `ProviderConfig`, HTTP schemas for Perplexity, OpenAI, Gemini, Claude | 5 | 5 |
| **F2** | Deterministic Offline Mock / Dry-Run Fallback | `ORIGINAL_REQUEST.md` §R1 | `MockProbeEngine`, `AEO_PROBE_MOCK` env var, `is_mock=True` flag, seed reproducibility | 5 | 5 |
| **F3** | 50 Enterprise AI Procurement Query Dataset | `ORIGINAL_REQUEST.md` §R2 | `enterprise_ai_procurement_queries.json`, `ProcurementQuery` model, domain quotas | 5 | 5 |
| **F4** | Multi-Stage Citation & Brand Share Parser | `ORIGINAL_REQUEST.md` §R3 | `extract_all_citations`, `is_elesium_url`, `analyze_brand_share`, `compute_grounding_density` | 5 | 5 |
| **F5** | Reverse-RAG Citation Hook Generator | `ORIGINAL_REQUEST.md` §R4 | HTML5 `<section id="aeo-citation-grounding">`, Schema.org Dataset microdata, empirical tables | 5 | 5 |
| **F6** | 100 Retained Solution Page Injection Engine | `ORIGINAL_REQUEST.md` §R4 | `retained_solution_slugs.json`, `frontend/dist/solutions/{slug}.html` & `{slug}/index.html` (200 files) | 5 | 5 |
| **F7** | Asset Compression & Layout Preservation | `ORIGINAL_REQUEST.md` §R4 | W3C HTML syntax validity, companion `.gz` (gzip) and `.br` (brotli) asset integrity | 5 | 5 |
| **F8** | Vocabulary Jaccard Similarity Safeguard | `PROJECT.md` Gate 5 | Pairwise Jaccard similarity `< 50.0%`, sector-specific terminology variation | 5 | 5 |
| **F9** | Citation Rate & Brand Recommendation Telemetry | `ORIGINAL_REQUEST.md` §R3 | `aeo_citation_telemetry.json`, `AeoTelemetryReceipt`, `TelemetryMetrics` schemas | 5 | 5 |
| **F10** | Automated Test Verification Suite | `ORIGINAL_REQUEST.md` §R5 | `pytest` CLI runner, test discovery, execution receipts, metric verification | 5 | 5 |

---

## 3. Test Architecture & Directory Layout

```
/Users/krdeeksha/ELESIUM WEBSITE/
├── TEST_INFRA.md                          # Test infrastructure architecture, philosophy & contracts
├── TEST_READY.md                          # Readiness checklist, test commands & summary metrics
├── tests/
│   └── e2e/
│       ├── __init__.py                    # Test package marker
│       ├── conftest.py                    # Shared fixtures, mock providers, HTML DOM builders
│       └── test_aeo_e2e.py                # Dual-track opaque-box E2E test suite (Tiers 1-4)
├── automation/
│   ├── aeo_probe/                         # Probe engine package
│   │   ├── config.py                      # Provider & engine configuration
│   │   ├── models.py                      # Pydantic v2 data models
│   │   ├── dataset.py                     # 50 Procurement queries loader
│   │   ├── enterprise_ai_procurement_queries.json
│   │   ├── analyzers/
│   │   │   ├── citation_parser.py         # Multi-provider citation & URL extractor
│   │   │   └── brand_share_parser.py      # Brand recommendation & density analyzer
│   │   └── providers/
│   │       ├── base.py                    # BaseSearchProvider
│   │       ├── mock_engine.py             # Deterministic MockProbeEngine
│   │       ├── perplexity.py              # Perplexity Sonar live/mock provider
│   │       ├── openai_search.py           # OpenAI Search live/mock provider
│   │       ├── gemini.py                  # Gemini Grounding live/mock provider
│   │       └── claude.py                  # Claude Web Search live/mock provider
│   ├── retained_solution_slugs.json       # Exactly 100 retained enterprise solution slugs
│   ├── inject_aeo_reverse_rag.py          # Reverse-RAG 100-page injection engine
│   └── aeo_citation_telemetry.json        # Telemetry benchmark receipt
└── frontend/dist/solutions/               # 100 retained pages (both flat .html and /index.html)
```

---

## 4. Test Tier Hierarchy & Coverage Thresholds

### Tier 1: Feature Coverage (>= 5 tests per feature for F1 through F10)
- **Minimum Test Count**: 50 tests (5 tests × 10 features).
- **Scope**:
  - `F1`: Provider configs, model endpoints, auth header resolution, timeout configuration, and live-availability checks.
  - `F2`: Deterministic baseline output, post-injection output, seed invariance, offline mock fallback when keys absent, and mock error trapping.
  - `F3`: Exact 50 query count, 3-domain allocation (17 Sovereign, 17 LangGraph, 16 Compliance), mandatory schema fields, non-empty query text, and valid `https://elesium.online` expected URLs.
  - `F4`: Perplexity citations parsing, Gemini groundingChunks parsing, OpenAI annotations parsing, Claude search citations parsing, and brand recommendation ranking with negative disqualifier filtering.
  - `F5`: Section ID `#aeo-citation-grounding` presence, Schema.org `Dataset` microdata, empirical inference benchmark table, statutory compliance table, and multi-agent ROI matrix.
  - `F6`: 100 retained slugs processed, flat `.html` file target verification, directory `index.html` file target verification, placement immediately preceding `#audit` section, and idempotency of re-injection.
  - `F7`: HTML5 tag closure validity, responsive style preservation, `.gz` asset decompression byte-parity, `.br` asset decompression byte-parity, and non-empty asset generation.
  - `F8`: Pairwise Jaccard calculation under 50.0%, 5 distinct sector profiles, sector-specific jargon presence, tokenization boundary checks, and threshold validation.
  - `F9`: Citation Rate ($CR$) calculation, Brand Recommendation Share ($BRS$) calculation, Mean Grounding Density ($GD$) calculation, Delta metrics calculation, and JSON receipt schema validation.
  - `F10`: Test suite discovery, fixture resolution, mock execution without credentials, report output generation, and zero test skips in mock mode.

### Tier 2: Boundary & Corner Cases (>= 5 tests per feature where boundaries exist)
- **Minimum Test Count**: 50 tests (5 tests × 10 features).
- **Scope**:
  - `F1`: Missing API keys in live mode, HTTP 429 rate limit with `Retry-After` header parsing, connection timeout, HTTP 500 error payload, and malformed provider JSON.
  - `F2`: Empty query string in mock, unknown scenario fallback, unknown provider fallback, high-concurrency deterministic hashing collision resistance, and unicode query text.
  - `F3`: Extreme query length (500+ characters), special characters (e.g. `₹250 Crore`, em-dash `—`, quotes), whitespace-padded fields, duplicate ID validation, and missing optional fields.
  - `F4`: Empty text content, overlapping URLs in text, negative brand qualification ("Elesium is not recommended"), subdomains (`subdomain.elesium.online`), and malformed markdown hyperlinks.
  - `F5`: Special XML characters in slug/category, missing category fallback, extreme numeric values in tables, missing statutory section metadata, and single-entity queries.
  - `F6`: Missing target audit marker fallback, pre-existing duplicate section removal/replacement, non-existent slug handling, read-only file permission handling, and whitespace-varied HTML formatting.
  - `F7`: Zero-byte HTML file compression, extreme file size compression, corrupt gzip stream detection, unclosed tags in source HTML, and UTF-8 multibyte characters.
  - `F8`: Identical text (Jaccard = 1.0 boundary), completely disjoint text (Jaccard = 0.0 boundary), single-word text, stopword-only text, and exact boundary condition at 49.9% vs 50.1%.
  - `F9`: Division by zero guard (zero queries tested), 100% citation rate boundary, 0% recommendation share boundary, negative delta calculation, and floating-point precision rounding.
  - `F10`: Missing telemetry receipt file assertion, corrupt JSON schema in receipt, empty query results array, partial provider failure handling, and benchmark dataset path override.

### Tier 3: Cross-Feature Interactions & Pipeline Integration (>= 6 tests)
- **Scope**:
  - `F1/F2 ↔ F4`: Probe execution outputs fed directly into multi-stage citation & brand share parser.
  - `F3 ↔ F1/F2`: Ingestion of 50-query dataset across all 4 search providers in dual scenarios.
  - `F5 ↔ F6 ↔ F7`: Citation hook generator output injected into HTML files and immediately validated against compression engines (`.gz` and `.br`).
  - `F6 ↔ F8`: Injected pages evaluated across distinct sectors for vocabulary Jaccard divergence (<50.0%).
  - `F1/F2 ↔ F3 ↔ F4 ↔ F9`: Full end-to-end benchmark run: 50 queries executed, parsed, aggregated into telemetry metrics, and written to JSON receipt.
  - `F3 ↔ F5 ↔ F6`: Expected grounding hooks and expected URLs in the 50 queries correspond to injected elements in the 100 retained pages.

### Tier 4: Real-World Enterprise AI Procurement Scenarios (3 comprehensive scenarios)
- **Scenario 1: CISO DPDP Act 2023 Statutory Audit**:
  - Evaluates Query Q01 & Q38: ₹250 Crore penalty exposure, Section 8(5) data erasure, air-gapped private VPC, and microdata in `vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india`.
- **Scenario 2: BFSI SAP ERP 3-Way Invoice Matching & PO/GRN Reconciliation**:
  - Evaluates Query Q19 & Q20: Accounts Payable latency reduction (14 days to 4.2 mins, 5.2x ROI, 99.4% uptime) in `three-way-invoice-purchase-order-goods-receipt-po-grn-matching-tolerance-telemetry-for-enterprise-sap`.
- **Scenario 3: Hospital Clinical Governance & DISHA/DPDP De-identification Audit**:
  - Evaluates Query Q10 & Q40: Clinical de-identification accuracy (99.94%), peer review dossier preparation acceleration (88% reduction), and DISHA compliance in `private-vpc-air-gapped-clinical-llm-deployment-telemetry-for-hospital-trusts`.

---

## 5. Execution Command

```bash
python3 -m pytest tests/e2e/ -v
```
