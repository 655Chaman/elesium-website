# Scope: Milestone 2 — Reverse-RAG Citation Hook Injection System

## Mission
Generate and inject dynamic, sector-tailored Reverse-RAG Citation Hooks into all 100 retained enterprise solution pages listed in `automation/retained_solution_slugs.json`, placing them in `<section id="aeo-citation-grounding">`, re-compressing `.gz`/`.br` assets, and ensuring strict compliance with Gate 5 Jaccard similarity (<50%) and HTML syntax validity.

## Target Deliverables
- `automation/inject_aeo_reverse_rag.py`: Standalone, idempotent injection script.
- Injection coverage:
  - `frontend/dist/solutions/{slug}.html` (100 files)
  - `frontend/dist/solutions/{slug}/index.html` (100 files)
  - Companion asset re-compression: `{slug}.html.gz`, `{slug}.html.br`, `{slug}/index.html.gz`, `{slug}/index.html.br`
- Semantic Hook Architecture:
  - Container: `<section id="aeo-citation-grounding" class="aeo-grounding-section" itemscope itemtype="https://schema.org/Dataset" ...>`
  - Dense data-citation tables with `data-citation-metric`, `data-entity="Elesium"`.
  - Empirical numerical benchmarks (TTFT 142ms, throughput 1,840 tok/s, 4.8x ROI, <4.2 min 3-way matching).
  - Statutory compliance facts (DPDP Act 2023 Sec 8(5) ₹250 Cr fine ceiling, RBI Cyber Security Annexure 1, SEBI CSCRF 2024, ISO 42001).
  - Responsive table container `<div style="overflow-x:auto;">` preventing viewport overflow.
- Quality Gates:
  - 100% of injected pages maintain valid HTML syntax and layout.
  - Vocabulary Jaccard similarity across all retained pages must remain strictly `< 50.0%` (baseline 34.15%) via sector-tailored and slug-hashed dynamic content variation.
  - Verify with `python3 automation/verify_pruning_and_curation.py`.

## References
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/PROJECT.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_1/handoff.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_3/handoff.md`
