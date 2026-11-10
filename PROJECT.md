# Project: Elesium Answer Engine Optimization (AEO) Citation Grounding & Reverse-RAG Injection

## Architecture
- **Probe Grounding Engine (`automation/aeo_probe/`)**:
  - Connects to real LLM search APIs (Perplexity Sonar, OpenAI Search, Google Gemini Grounding, Anthropic Claude Web Search).
  - Environment API key resolution with deterministic dual-scenario mock execution engine (Baseline vs. Post-Injection) for offline test resilience.
  - Multi-stage citation extractor parsing structured provider citations (`citations`, `groundingChunks`, `annotations`), Markdown links, and raw URLs.
  - Brand recommendation share and entity grounding density analyzer with URL mention stripping.
- **Enterprise Query Benchmark Dataset (`automation/aeo_probe/enterprise_ai_procurement_queries.json`)**:
  - Exactly 50 high-ticket enterprise AI procurement queries spanning Sovereign Enterprise AI in India (17), Multi-Agent LangGraph ERP/Banking Integration (17), and Compliance Telemetry & Governance (16). All 50 queries map directly to `automation/retained_solution_slugs.json`.
- **Reverse-RAG Citation Hook Generator & Injector (`automation/inject_aeo_reverse_rag.py`)**:
  - Injects `<section id="aeo-citation-grounding">` into all 100 retained solution pages (`frontend/dist/solutions/{slug}.html` and `{slug}/index.html`, 200 files total).
  - Dense data-citation tables, empirical numerical benchmarks, statutory compliance facts, and Schema.org Dataset microdata.
  - Sector-tailored dynamic variation ensuring pairwise vocabulary Jaccard similarity remains at 39.10% (certified well below 50.0% Gate 5 threshold).
  - Companion asset re-compression (`.gz` level 9 and `.br` quality 9).
- **Telemetry Reporter & Verification Suite (`automation/test_aeo_reverse_rag.py` & `automation/aeo_citation_telemetry.json`)**:
  - Executes probe engine across all 50 queries to measure Citation Rate (CR) and Brand Recommendation Share (BRS).
  - Emitted machine-readable `automation/aeo_citation_telemetry.json` (400 evaluations) and human-readable Markdown report `automation/aeo_telemetry_report.md`.
  - Automated Pytest test suite asserting probe request formatting, mock fallbacks, metric calculation accuracy, and injection integrity across 100 retained pages (32/32 tests passed).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Multi-Provider Live Search Grounding Probe | Connects to Perplexity Sonar, OpenAI Search, Gemini Grounding, Claude Web Search via standard API keys | M1 | ORIGINAL_REQUEST §R1 |
| F2 | Deterministic Offline Mock / Dry-Run Fallback | Dual-scenario (baseline vs post-injection) mock engine for full offline test reproducibility | M1 | ORIGINAL_REQUEST §R1 |
| F3 | 50 Enterprise AI Procurement Query Dataset | 50 high-ticket queries structured across Sovereign AI, LangGraph ERP/Banking, and Compliance Telemetry | M1 | ORIGINAL_REQUEST §R2 |
| F4 | Multi-Stage Citation & Brand Share Parser | Extracts provider citations, URLs, brand mentions, recommendation ranking, and grounding density | M1 | ORIGINAL_REQUEST §R3 |
| F5 | Reverse-RAG Citation Hook Generator | Generates dense data tables, empirical benchmarks, and statutory compliance facts | M2 | ORIGINAL_REQUEST §R4 |
| F6 | 100 Retained Solution Page Injection Engine | Injects `<section id="aeo-citation-grounding">` into 100 pages (200 HTML files: `.html` and `index.html`) | M2 | ORIGINAL_REQUEST §R4 |
| F7 | Asset Compression & Layout Preservation | Preserves valid HTML, responsive layout, and re-compresses `.gz` and `.br` companion assets | M2 | ORIGINAL_REQUEST §R4 |
| F8 | Vocabulary Jaccard Similarity Safeguard | Sector-tailored variations ensuring pairwise vocabulary Jaccard similarity remains < 50.0% (actual: 39.10%) | M2 | Codebase Gate 5 |
| F9 | Citation Rate & Brand Recommendation Telemetry | Runs probe over 50 queries, logging baseline vs post-injection metrics in JSON & Markdown reports | M3 | ORIGINAL_REQUEST §R3 |
| F10 | Automated Test Verification Suite | Pytest suite validating probe formatting, dataset, metric calculations, and injection integrity | M3 | ORIGINAL_REQUEST §R5 |
| F11 | E2E Opaque-Box Test Suite (Tiers 1-4) | Comprehensive requirement-driven opaque-box test suite for AEO probe & Reverse-RAG injection | M4 (E2E) | Dual-Track Quality Gate |
| F12 | Adversarial Coverage Hardening (Tier 5) | White-box stress-testing, boundary probe injection, and edge-case validation | M4 (Final) | Project Pattern Phase 2 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Probe Engine & 50 Query Dataset | `automation/aeo_probe/` package, 4 live/mock search providers, citation/brand parser, 50 queries JSON | None | DONE |
| M2 | Reverse-RAG Injection System | `automation/inject_aeo_reverse_rag.py`, 100 retained pages injection, `.gz`/`.br` recompression, Gate 5 Jaccard check | None | DONE |
| M3 | Telemetry Benchmarking & Test Suite | Telemetry execution (baseline vs post), `aeo_citation_telemetry.json`, `automation/test_aeo_reverse_rag.py` | M1, M2 | DONE |
| M4 | Final Milestone & Adversarial Hardening | Phase 1: 100% pass of E2E test suite (109/109 passed); Phase 2: Tier 5 adversarial stress testing (28/28 passed) | M3, TEST_READY.md | DONE |

## Interface Contracts
### `automation/aeo_probe/` ↔ `automation/aeo_citation_telemetry.json`
- `ProcurementQuery`: `{ "id": str, "query": str, "vertical": str, "target_slug": str, "expected_url": str, "required_entities": List[str] }`
- `ProviderSearchResult`: `{ "provider": str, "model": str, "query_id": str, "raw_text": str, "citations": List[str], "elesium_cited": bool, "elesium_recommended": bool, "recommendation_rank": Optional[int], "matched_entities": List[str], "grounding_density": float, "latency_ms": float, "is_mock": bool, "error": Optional[str] }`
- `AeoTelemetryReceipt`: `{ "probe_version": "2.0.0-live-aeo-grounding", "timestamp_utc": str, "execution_mode": "live"|"hybrid"|"mock", "scenario": "baseline"|"post_injection", "baseline_metrics": TelemetryMetrics, "post_injection_metrics": TelemetryMetrics, "delta": Dict[str, float], "query_results": List[Dict] }`

### `automation/inject_aeo_reverse_rag.py` ↔ `frontend/dist/solutions/`
- Target container: `<section id="aeo-citation-grounding" class="aeo-grounding-section" itemscope itemtype="https://schema.org/Dataset" ...>`
- Placement: Immediately before `<section style="margin:2.5rem 0;background:#111827;..." id="audit">` within `<div class="solution-body">`
- File coverage: Both `frontend/dist/solutions/{slug}.html` AND `frontend/dist/solutions/{slug}/index.html` for all 100 slugs in `automation/retained_solution_slugs.json`.

## Code Layout
- `automation/aeo_probe/`: Probe engine package (config, models, dataset, providers, analyzers, engine)
- `automation/aeo_probe/enterprise_ai_procurement_queries.json`: 50 enterprise AI procurement benchmark queries
- `automation/inject_aeo_reverse_rag.py`: Reverse-RAG injection script
- `automation/aeo_citation_telemetry.json`: Machine-readable telemetry benchmark audit receipt
- `automation/aeo_telemetry_report.md`: Executive Markdown summary report
- `automation/test_aeo_reverse_rag.py`: Official R5 verification test suite (32 tests)
- `automation/test_aeo_probe_engine.py`: Probe engine unit test suite (34 tests)
- `tests/e2e/test_aeo_e2e.py`: Dual-track opaque-box E2E test suite (109 tests)
