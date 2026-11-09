# Test Infrastructure & Verification Architecture (Milestone 1)

## Executive Summary
This document defines the automated verification engine and test architecture for certifying the pruning and de-indexing of 3,695 thin programmatic doorway duplicate pages (R1, R2) and the technical enrichment and curation of 100 high-intent enterprise solution pages (R3) for `https://elesium.online`.

The test infrastructure is authored as a dual-surface verification suite:
1. **Standalone Verification CLI Engine**: `automation/verify_pruning_and_curation.py`
2. **Modular Pytest Test Suite**: `automation/test_pruning_and_curation.py`

Both surfaces execute deterministic assertions across 6 Automated Quality Gates without external network dependencies, completing full audit sweeps in under 4 seconds.

---

## 1. Test Architecture & Environment

### 1.1 Execution Environment
- **Runtime**: Python 3.9+ (Standard macOS / Linux environment)
- **Test Framework**: `pytest` 8.4.2
- **DOM / Text Parsing**: `BeautifulSoup4` 4.15.0 (`html.parser`), `xml.etree.ElementTree`, and standard library `re`
- **Zero Mock Policy**: Tests execute directly against real pre-rendered filesystem artifacts in `frontend/dist/` and `frontend/public/`, real routing configurations, and production XML sitemaps.

### 1.2 File Layout & Artifact Index
```
/Users/krdeeksha/ELESIUM WEBSITE/
├── automation/
│   ├── verify_pruning_and_curation.py      # Standalone verification runner & CLI (6 gates)
│   ├── test_pruning_and_curation.py        # Pytest test suite (27 modular unit/gate tests)
│   ├── baseline_verification_report.json   # Machine-readable baseline audit output
│   ├── compact_keywords_queue.json         # Master 3,795 keyword inventory
│   ├── algorithmic_cull_http_410.conf      # Nginx / Edge HTTP 410 rule specifications
│   ├── pruned_solution_slugs.json          # (M2 Partition) 3,695 pruned slug manifest
│   └── retained_solution_slugs.json        # (M2 Partition) 100 retained enterprise slug manifest
├── authority_assets/
│   └── indexation_acceleration/
│       └── top100_commercial_urls.json     # Authoritative 100 enterprise solution manifest
├── frontend/
│   ├── dist/solutions/                     # Pre-rendered production HTML artifacts
│   ├── public/solutions/                   # Pre-build public static solution files
│   ├── public/sitemap-solutions.xml        # Solutions XML sitemap
│   ├── public/sitemap.xml                  # Master sitemap index
│   ├── public/_redirects                   # Cloudflare/Netlify status code rules
│   └── vite.config.ts                      # Vite dev/preview server middleware config
├── TEST_INFRA.md                           # This architecture and test contract document
└── TEST_READY.md                           # Milestone 1 readiness declaration & baseline audit
```

---

## 2. The 6 Automated Verification Gates

```
========================================================================================
             ELESIUM AUTOMATED PRUNING & CURATION VERIFICATION SUITE
========================================================================================
 GATE 1: HTTP 410 Gone Server & Router Configuration Handling
 GATE 2: Pre-rendered HTML <meta name="robots" content="noindex, follow"> Assertion
 GATE 3: 100% Removal of Pruned URLs from Production Sitemaps
 GATE 4: 0 Internal Broken Links Pointing to 410 Routes from Retained Pages
 GATE 5: Vocabulary Jaccard Similarity Certification (< 50% threshold, baseline ~73%)
 GATE 6: 100% Presence of Custom Architecture Schematics & Empirical Benchmarks
========================================================================================
```

### Gate 1: HTTP 410 Gone Server & Router Configuration
- **Objective**: Ensure that web servers and edge routers immediately return `HTTP 410 Gone` for all 3,695 pruned solution URLs, permanently signaling search engine crawlers to purge URLs from organic search indexes.
- **Verification Targets**:
  1. `automation/algorithmic_cull_http_410.conf` (Nginx / Cloudflare edge configuration): Must contain explicit `location = /solutions/<slug> { return 410; }` and trailing slash variants for all 3,695 pruned slugs.
  2. `frontend/public/_redirects`: Must contain `/solutions/<slug> 410` status rules for all 3,695 pruned slugs.
  3. `frontend/vite.config.ts`: Must configure `http410Plugin` for preview and development servers, returning HTTP status code 410 for pruned routes.
- **Contract / Invariant**: `coverage(nginx) == 3,695` AND `coverage(_redirects) == 3,695` AND `vite_plugin_active == True`.

### Gate 2: Pre-rendered HTML `<meta name="robots" content="noindex, follow">` Verification
- **Objective**: Guarantee that even if an edge server falls back to static files (e.g. GitHub Pages static origin), search crawlers parsing the pre-rendered HTML DOM receive the authoritative de-index directive.
- **Verification Targets**:
  - `frontend/dist/solutions/<slug>/index.html` and `frontend/dist/solutions/<slug>.html` for all 3,695 pruned slugs.
  - `frontend/public/solutions/<slug>/index.html` for all pruned public files.
- **Assertions**:
  - Contains `<meta name="robots" content="noindex, follow">` or `<meta content="noindex, follow" name="robots">`.
  - Does NOT contain affirmative indexing directives (e.g. `index, follow` without `noindex`).
  - Retained 100 enterprise solution pages strictly maintain `<meta name="robots" content="index, follow">`.
- **Contract / Invariant**: `100%` of pruned pre-rendered HTML files carry `noindex, follow`.

### Gate 3: 100% Sitemaps Purge Verification
- **Objective**: Eliminate all crawl budget waste by removing all 3,695 pruned solution URLs from production sitemaps, leaving only the 100 retained enterprise solutions.
- **Verification Targets**:
  - `frontend/public/sitemap-solutions.xml` and `frontend/dist/sitemap-solutions.xml`
  - `frontend/public/sitemap.xml` and `frontend/dist/sitemap.xml`
  - `frontend/public/sitemap-core.xml`
- **Assertions**:
  - Exactly `0` pruned URLs appear in any sitemap file.
  - Exactly `100` URLs are present in `sitemap-solutions.xml`.
  - All `100` URLs in `sitemap-solutions.xml` match the authoritative retained enterprise slug set.
- **Contract / Invariant**: `len(sitemap_solutions_urls) == 100` AND `set(sitemap_solutions_urls) == set(retained_slugs)`.

### Gate 4: 0 Internal Broken Links to 410 Routes from Retained Pages
- **Objective**: Prevent internal link equity degradation and crawler loops by verifying that retained pages, global navigation, and blog content contain zero links pointing to pruned 410 routes.
- **Verification Targets**:
  - `frontend/src/components/layout/Footer.tsx`
  - `frontend/src/data/blogPosts.ts`
  - `frontend/src/data/glossaryData.ts`
  - `frontend/dist/solutions/index.html` (Solutions Directory Hub)
  - 13 Category Pillar Hubs (`frontend/dist/solutions/category/<silo>/index.html` and flat `.html`)
  - All 100 retained enterprise solution HTML files in `frontend/dist/solutions/<slug>/index.html`
- **Assertions**:
  - All `<a>` tags and link paths pointing to `/solutions/<slug>` must resolve to verified retained enterprise solutions.
  - Zero links point to pruned slugs or nonexistent 404 slugs.
- **Contract / Invariant**: `total_broken_or_pruned_internal_links == 0`.

### Gate 5: Vocabulary Jaccard Similarity Certification (< 50% vs ~73% baseline)
- **Objective**: Certify mathematically that retained enterprise solution pages possess deeply unique, differentiated content rather than template-driven boilerplate, eliminating Google `scaledContentAbuse` classifier penalties.
- **Methodology**:
  1. Extract visible text from pre-rendered solution container (`#prerendered-solution` or `<main>`), stripping scripts, styles, SVGs, and global navigation.
  2. Tokenize words with regex `\b[a-zA-Z]{3,}\b`, convert to lowercase, and strip standard English stopwords.
  3. Form vocabulary set $V_i$ for each retained enterprise page $i \in [1, 100]$.
  4. Compute pairwise Jaccard similarity across all $\binom{100}{2} = 4,950$ pairs:
     $$J(V_i, V_j) = \frac{|V_i \cap V_j|}{|V_i \cup V_j|}$$
- **Thresholds**:
  - Mean Jaccard similarity: $\bar{J} < 0.50$ (50.0%).
  - Maximum pairwise similarity: $J_{max} < 0.65$ (65.0%).
- **Contract / Invariant**: $\bar{J} < 0.50$ AND $J_{max} < 0.65$.

### Gate 6: 100% Custom Architecture Schematics & Empirical Benchmarks
- **Objective**: Guarantee that all 100 retained enterprise pages feature bespoke technical visual schematics and empirical engineering performance data.
- **Verification Targets**:
  - Pre-rendered HTML files of all 100 retained enterprise pages.
- **Assertions**:
  1. **Custom Architecture Schematics**:
     - Contains responsive vector `<svg viewBox="...">` element.
     - Contains labeled technical architecture stage text nodes (e.g. "Ingress Gateway", "HSM Enclave", "vLLM FP8 Enclave", "CBS Ledger", "State Machine", "Protocol Translation", "Audit Hash Chain").
  2. **Empirical Benchmark Data Matrix**:
     - Contains latency metrics: `p50`, `p90`, `p99` latency profiles in milliseconds.
     - Contains throughput / capacity metrics: sustained `QPS`, `req/s`, or concurrency streams.
     - Contains structured empirical benchmark tables or specification cards.
- **Contract / Invariant**: `compliant_pages / 100 == 1.0` (100% compliance).

---

## 3. How to Run the Test Suite

### 3.1 Standalone Python CLI Verification Runner
```bash
# Execute all 6 gates with standard terminal summary
python3 automation/verify_pruning_and_curation.py

# Execute with verbose metrics output
python3 automation/verify_pruning_and_curation.py --verbose

# Execute a single specific gate (e.g. Gate 1 or Gate 5)
python3 automation/verify_pruning_and_curation.py --gate 1
python3 automation/verify_pruning_and_curation.py --gate 5

# Export full machine-readable JSON audit report
python3 automation/verify_pruning_and_curation.py --json-output automation/verification_report.json
```

### 3.2 Pytest Test Suite Execution
```bash
# Run the entire 27-test suite with verbose test naming
python3 -m pytest automation/test_pruning_and_curation.py -v

# Run tests for a specific gate class
python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate1" -v
python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate2" -v
python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate3" -v
python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate4" -v
python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate5" -v
python3 -m pytest automation/test_pruning_and_curation.py -k "TestGate6" -v
```

---

## 4. Expected Milestone Lifecycle & Certification Path

| Gate | Milestone | Baseline Status (M1) | Target Status (M2/M3) |
|---|---|---|---|
| **Gate 1: HTTP 410 Configuration** | M2 | ❌ FAIL (0/3,695 slugs in Nginx, _redirects missing, Vite plugin missing) | ✅ PASS (3,695/3,695 covered across Nginx, _redirects, Vite) |
| **Gate 2: Robots noindex, follow** | M2 | ❌ FAIL (7,360 files in dist/public lack noindex; affirmative index present) | ✅ PASS (100% of pruned files have `<meta name="robots" content="noindex, follow">`) |
| **Gate 3: Sitemaps Purge** | M2 | ❌ FAIL (3,695 pruned URLs remain in sitemaps; 3,795 URLs present vs 100) | ✅ PASS (0 pruned URLs; exactly 100 retained enterprise URLs present) |
| **Gate 4: 0 Internal Broken Links** | M2 | ❌ FAIL (6,696 links point to 410 routes from Footer, hub, category hubs) | ✅ PASS (0 links point to 410 or broken routes from retained pages) |
| **Gate 5: Jaccard Similarity (<50%)** | M3 | ❌ FAIL (Mean Jaccard 59.84% >= 50.0%; max 96.01% due to template boilerplate) | ✅ PASS (Mean Jaccard < 35-45%; max < 65% with specialized copy) |
| **Gate 6: SVGs & Benchmarks** | M3 | ❌ FAIL (0/100 pages have vector SVG schematics; 0/100 have p50/p90/p99 + QPS) | ✅ PASS (100/100 pages have custom SVG schematics and empirical benchmark matrices) |

---

## 5. Verification Integrity & Audit Guarantee
This test suite does not use mock or facade assertions. All test calculations and assertions are executed against the actual on-disk filesystem, configuration files, and DOM structure. The failures observed during Milestone 1 provide forensic verification that the test engine is functioning correctly and accurately detecting the unpruned, un-curated baseline state.
