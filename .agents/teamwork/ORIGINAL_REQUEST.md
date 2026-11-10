# Original User Request

## Initial Request — 2026-11-09T14:53:10Z

Prune and de-index thin programmatic doorway duplicates across pre-rendered solution pages, and heavily curate top high-intent enterprise solution pages with distinct custom technical architecture schematics, empirical benchmark data, and unique content so Google's scaledContentAbuse classifier does not suppress the domain.

Working directory: /Users/krdeeksha/ELESIUM WEBSITE
Integrity mode: development

## Requirements

### R1. Inventory Triage and Intent Clustering
Analyze the pre-rendered programmatic solution pages in `frontend/dist/solutions/` and `PORTABLE_SEO_FACTORY/` (baseline: ~3,795 pages with ~73% vocabulary Jaccard similarity). Perform intent clustering and similarity analysis to classify pages into thin doorway duplicates to prune versus high-intent enterprise solution pages to retain and enrich.

### R2. De-indexing and Pruning of Thin Doorway Pages
De-index all identified thin duplicate solution pages by configuring HTTP 410 Gone status handling at the server/router level, applying `<meta name="robots" content="noindex, follow">` tags to pre-rendered HTML files, and removing all pruned URLs from production sitemaps.

### R3. Curation and Technical Enrichment of Retained Enterprise Pages
Heavily curate and enrich retained high-intent enterprise solution pages with distinct, custom technical architecture schematics, empirical benchmark data, and unique technical content, driving vocabulary similarity across retained pages significantly below the ~73% baseline.

### R4. Automated Verification Test Suite
Build and execute automated verification tests that independently validate HTTP 410 Gone responses and `noindex, follow` tags for pruned URLs, verify complete removal of pruned URLs from all sitemap files, and measure content uniqueness and schema presence across all retained pages.

## Acceptance Criteria

### De-indexing and Pruning
- [ ] All thin programmatic duplicate solution pages identified for pruning are de-indexed with both HTTP 410 Gone response handling and `<meta name="robots" content="noindex, follow">` tags on pre-rendered files.
- [ ] All pruned URLs are completely removed from `sitemap.xml` and any solution sitemaps.
- [ ] No internal broken links point to pruned 410 routes from retained production pages.

### Content Curation and Enrichment
- [ ] Every retained high-intent enterprise solution page contains custom technical architecture schematics and empirical benchmark data.
- [ ] Vocabulary Jaccard similarity across retained solution pages is measurably reduced well below the ~73% baseline.
- [ ] Retained pages contain distinct, custom technical content addressing specific enterprise problem spaces without boilerplate duplication.

### Automated Verification
- [ ] An automated verification test suite runs against the build output and sitemaps, verifying HTTP status codes / meta tags and sitemap exclusions for all pruned URLs.
- [ ] Automated uniqueness and content validation tests confirm presence of technical schematics and benchmark data on 100% of retained pages.

## Follow-up — 2026-11-10T05:50:03Z

Build a live, production Answer Engine Optimization (AEO) citation grounding engine and Reverse-RAG injection system for Elesium that queries real LLM search APIs, benchmarks baseline vs. post-injection citation rate and brand recommendation share across 50 enterprise AI procurement queries, and injects data-citation hooks into the 100 retained enterprise solution pages.

Working directory: /Users/krdeeksha/ELESIUM WEBSITE
Integrity mode: development

## Requirements

### R1. Live LLM Search API Grounding Probe
Build a live AEO benchmarking probe engine connecting to real LLM search APIs (Perplexity Sonar, OpenAI Search, Gemini, Claude) using environment API keys (e.g. `PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`) with graceful dry-run / mock execution fallbacks when keys are not set.

### R2. Enterprise AI Procurement Query Dataset
Curate and structure a benchmark dataset of 50 high-ticket enterprise AI procurement queries focused on Elesium's core solution domains (including sovereign enterprise AI implementation in India, multi-agent LangGraph system integration for ERP/banking, and compliance telemetry).

### R3. Citation Rate and Recommendation Share Telemetry
Execute the probe engine against the 50 queries to measure Elesium's citation rate and brand recommendation share in generative search responses, reporting baseline metrics, post-injection metrics, and performance telemetry without enforcing an arbitrary pass/fail threshold.

### R4. Reverse-RAG Citation Hook Generation and Injection
Generate and inject Reverse-RAG Citation Hooks—including dense Markdown/HTML data-citation tables, empirical numerical benchmarks, and statutory compliance facts—into each of the 100 retained enterprise solution pages listed in `automation/retained_solution_slugs.json`, placing them in a dedicated, semantically structured section (such as `<section id="aeo-citation-grounding">` or content container) while preserving valid HTML structure and layout.

### R5. Automated Test Suite and Telemetry Reporting
Build and execute an automated test verification suite and telemetry reporter verifying live probe execution handling, query dataset processing, metric calculation accuracy, and injection integrity across all 100 retained solution pages.

## Acceptance Criteria

### Live Grounding Probe & Query Dataset
- [ ] The AEO probe engine connects to and queries LLM search APIs (Perplexity, OpenAI, Gemini, Claude) using standard environment API keys when present.
- [ ] The probe engine supports graceful mock / dry-run fallbacks so the automated test suite executes reliably without required live credentials.
- [ ] Exactly 50 high-ticket enterprise AI procurement queries covering sovereign enterprise AI and agent integration are curated in a structured dataset.

### Telemetry & Benchmarking
- [ ] The engine computes citation rate (percentage of queries citing Elesium) and brand recommendation share across the ingested queries.
- [ ] Telemetry output logs both baseline and post-injection metrics, outputting results in a structured format (JSON or Markdown report).

### Reverse-RAG Injection
- [ ] Reverse-RAG citation hooks containing dense data-citation tables, empirical numerical benchmarks, and statutory compliance facts are injected into all 100 retained enterprise solution pages specified in `automation/retained_solution_slugs.json`.
- [ ] Each injection is contained within a dedicated semantically structured section (e.g. `<section id="aeo-citation-grounding">` or content container).
- [ ] 100% of injected pages maintain valid HTML syntax and preserve existing page layout and styling.

### Automated Verification
- [ ] An automated test suite runs and verifies probe API request formatting, response parsing, and citation rate metric calculations.
- [ ] Automated verification checks confirm that all 100 retained solution pages contain the required citation hook elements (data table, empirical benchmarks, compliance facts).
