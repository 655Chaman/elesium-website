# Project: Doorway Page De-indexing, Pruning & Enterprise Solution Curation

## Architecture
- Target Domain: `https://elesium.online`
- Repository: `/Users/krdeeksha/ELESIUM WEBSITE`
- Tech Stack: React 19 SPA + Vite 7 + Python SSG pipeline (`generate_ssg.py`, `generate_sitemap.py`, `compress_assets.py`) deploying to GitHub Pages
- Core Problem: 3,795 programmatic solution pages with ~73% vocabulary Jaccard similarity and zero SVGs/schematics trigger Google's `scaledContentAbuse` classifier
- Target State: 
  - Prune 3,695 thin duplicate doorway pages via HTTP 410 Gone status handling, pre-rendered `<meta name="robots" content="noindex, follow">`, and 100% removal from sitemaps.
  - Retain and enrich 100 high-intent enterprise solution pages (5 sectors × 20 pages: BFSI, Logistics, Healthcare, SCADA, Defense) + 13 category pillar hubs + 1 solutions directory index with custom vector SVG schematics, 5-vector empirical benchmark matrices, and distinct technical documentation reducing Jaccard similarity to < 40-50%.
  - Automated 6-gate Python verification test suite independently verifying all pruning, de-indexing, sitemap, link graph, uniqueness, and curation criteria.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Automated Verification Test Suite (6 Gates) | `automation/verify_pruning_and_curation.py` and `automation/test_pruning_and_curation.py` implementing 6 quality gates | M1 | R4 / Survey |
| 2 | Inventory Triage & Slug Partitioning | Authoritative partition of 3,795 baseline into 3,695 pruned slugs and 100 retained enterprise slugs | M2 | R1 / Survey |
| 3 | HTTP 410 Gone Router/Server Configuration | Vite dev/preview `http410Plugin`, `algorithmic_cull_http_410.conf`, and `_redirects` rules | M2 | R2 / Survey |
| 4 | Pre-rendered `<meta name="robots" content="noindex, follow">` Injection | Inject noindex directives into all 3,695 pruned pre-rendered HTML files in `dist/` and `public/` | M2 | R2 / Survey |
| 5 | Client SPA 410 Status View | Update `SolutionDetail.tsx` to render 410 Gone view with noindex meta tags instead of soft-redirect | M2 | R2 / Survey |
| 6 | Sitemap Pruning & Synchronization | Purge 3,695 pruned URLs from `sitemap-solutions.xml` and `sitemap.xml`; synchronize data sources | M2 | R2 / Survey |
| 7 | Internal Link Graph Remediation | Fix 4 broken links in `Footer.tsx`, fix links in `glossaryData.ts` & `blogPosts.ts`, scope `solutions/index.html` and 13 category hubs to 0 broken links | M2 | R2 / Survey |
| 8 | Sector-Specific Vector SVG Architecture Schematics | 5 custom responsive vector SVG diagrams (BFSI, Logistics, Healthcare, SCADA, Defense) pre-rendered into HTML | M3 | R3 / Survey |
| 9 | 5-Vector Empirical Benchmark Data Matrix | Performance metrics (p50/p90/p99 latency, QPS, VRAM, TCO, convergence) rendered to tables and JSON-LD schemas | M3 | R3 / Survey |
| 10 | Unique Technical Documentation & Jaccard Reduction | Page-specific technical engineering documentation reducing vocabulary Jaccard similarity below 40-50% | M3 | R3 / Survey |
| 11 | SSG Pipeline & Asset Re-compilation | Run `generate_ssg.py`, `generate_sitemap.py`, and `compress_assets.py` for character-parity dist build | M3 | R3 / Survey |
| 12 | End-to-End Verification & Gate Certification | Execute full test suite, reviewer validation, challenger stress-tests, and forensic integrity audit | M4 | R4 / AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Automated Verification Test Suite (E2E Testing Track) | Author `verify_pruning_and_curation.py` (6 gates) and `test_pruning_and_curation.py` (pytest). Publish `TEST_INFRA.md` & `TEST_READY.md`. | none | DONE |
| M2 | Doorway Pruning, 410 Routing, Sitemap Purge & Link Remediation | Prune 3,695 pages, configure 4-tier HTTP 410, inject noindex follow tags, purge sitemaps, repair internal links. | M1 | DONE |
| M3 | Enterprise Page Curation, Architecture Schematics & Benchmarks | Enrich 100 retained enterprise solutions with 5 domain SVGs, 5-vector benchmark metrics, and unique content (< 50% Jaccard). | M2 | DONE |
| M4 | Full E2E Verification & Forensic Integrity Gate | Execute 6-gate test engine, adversarial stress testing, and forensic integrity audit. | M1, M2, M3 | DONE |

## Interface Contracts
### Pruning Partition Data (`automation/pruned_solution_slugs.json` & `retained_solution_slugs.json`)
- Input: `automation/compact_keywords_queue.json` (3,795 items) and `authority_assets/indexation_acceleration/top100_commercial_urls.json` (100 items).
- Output: `pruned_solution_slugs.json` contains exact 3,695 strings. `retained_solution_slugs.json` contains exact 100 strings.
- Invariant: `set(pruned) | set(retained) == set(all_3795)` and `set(pruned) & set(retained) == set()`.

### HTTP 410 Gone Server & Preview Contract
- Request: `GET /solutions/<pruned-slug>/` or `GET /solutions/<pruned-slug>`
- Response: HTTP Status `410 Gone`, Headers include `X-Robots-Tag: noindex, follow`.
- HTML Body: Contains `<meta name="robots" content="noindex, follow">` and `<title>410 Gone | Content Retired | Elesium</title>`.

### Sitemap Contract (`frontend/public/sitemap-solutions.xml` & `frontend/dist/sitemap-solutions.xml`)
- Contains `<loc>https://elesium.online/solutions/<slug>/</loc>` ONLY for the 100 retained enterprise slugs.
- Total `<url>` elements in `sitemap-solutions.xml` == 100.
- Exactly 0 pruned slugs appear in `sitemap.xml`, `sitemap-solutions.xml`, or `sitemap-core.xml`.

### Verification Suite Contract (`automation/verify_pruning_and_curation.py`)
- CLI Invocation: `python3 automation/verify_pruning_and_curation.py`
- Exit Code: `0` if all 6 gates pass, `1` if any gate fails.
- Pytest Invocation: `pytest automation/test_pruning_and_curation.py -v`

## Code Layout
- Test Suite: `automation/verify_pruning_and_curation.py`, `automation/test_pruning_and_curation.py`
- Slugs Manifests: `automation/pruned_solution_slugs.json`, `automation/retained_solution_slugs.json`
- Server/Router Configs: `frontend/vite.config.ts` (`http410Plugin`), `automation/algorithmic_cull_http_410.conf`, `frontend/public/_redirects`
- Pre-rendered Solutions: `frontend/dist/solutions/`, `frontend/public/solutions/`
- Frontend Components: `frontend/src/components/pages/SolutionDetail.tsx`, `frontend/src/components/layout/Footer.tsx`
- Sitemaps: `frontend/public/sitemap-solutions.xml`, `frontend/public/sitemap.xml`, `frontend/dist/` mirrors
- SSG Generators: `automation/generate_ssg.py`, `automation/generate_sitemap.py`, `automation/compress_assets.py`
