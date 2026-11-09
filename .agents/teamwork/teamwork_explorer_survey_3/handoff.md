# Deep-Dive Investigation Report: Schema & Structured Data and Answer Engine Optimization (AEO) / LLM Citeability

**Investigator**: `teamwork_explorer_survey_3`  
**Repository**: `/Users/krdeeksha/ELESIUM WEBSITE`  
**Working Directory**: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_3`  
**Date**: November 8, 2026  
**Status**: Completed  

---

## Executive Summary & Brutal Numerical Scores

| Category | Score | Status | Primary Deductions |
|---|:---:|:---:|---|
| **1. Schema & Structured Data** | **20 / 100** | **CRITICAL FAILURE** | Base HTML homepage schema cloned into 8,200+ pages (-35), 404 broken logo URLs (-15), Shivamogga vs Bangalore NAP coordinates clash (-15), missing Product & ItemList schemas (-10), client-side React DOM duplication (-10), SSG malformed HTML AST (-5), 0% Microdata/RDFa (-5). |
| **2. AEO & LLM Citeability / Discoverability** | **25 / 100** | **POOR / HIGH RISK** | Conflicting legal entity names & 0 brand homophone disambiguation (-20), mechanically fabricated SOC-2 / ISO 27001 claims (-20), missing Applebot-Extended / CCBot / OAI-SearchBot in robots.txt & no HTTP headers (-15), telemetry dataset contradictions (180+ vs 1,420) (-10), manifest markdown table number formatting error (-5), internal GEO gate self-test failure on live assets (-5). |

---

## 1. Observation

### 1.1 Sitewide Schema Contamination & Canonical Collapse
- **Observation 1.1.1 (Base HTML Template)**: In `frontend/index.html` (lines 41–337), a monolithic Schema.org JSON-LD graph is hardcoded. It defines an `@id: "https://elesium.online/#webpage"` with `url: "https://elesium.online/"` (lines 279–288) and an `@id: "https://elesium.online/#faq"` with 5 generic homepage questions (lines 289–335):
  ```json
  // frontend/index.html:279-288
  {
    "@type": "WebPage",
    "@id": "https://elesium.online/#webpage",
    "url": "https://elesium.online/",
    "name": "#1 Best Enterprise AI Company in India | Elesium — Autonomous AI Systems",
    "description": "Elesium is ranked India's #1 best enterprise AI company and premier AI automation agency...",
    "isPartOf": { "@id": "https://elesium.online/#website" }
  }
  ```
- **Observation 1.1.2 (SSG Cloning Pipeline)**: In `automation/generate_ssg.py` (line 6869), the SSG generator reads `dist/index.html` into `base_html`:
  ```python
  # automation/generate_ssg.py:6869
  base_html = DIST_INDEX.read_text(encoding="utf-8")
  ```
  `generate_ssg.py` iterates over every signal (`signals/*`), tool (`tools/*`), author (`authors/*`), solution (`solutions/*`), and landing page, substituting titles, descriptions, and canonical links, but **NEVER removes the hardcoded homepage `<script type="application/ld+json">` from `<head>`**.
- **Observation 1.1.3 (Production Artifact Verification)**: In `frontend/dist/ai-automation-agency-india.html` (lines 41–337) and `frontend/dist/signals/ai-automation-cost-india-2026-pricing.html` (lines 41–337), the entire homepage Schema.org `@graph` is present verbatim.
  Furthermore, `generate_ssg.py` appends additional `<script type="application/ld+json">` blocks before `</head>` (lines 384–386 in `ai-automation-agency-india.html` and lines 385–387 in `ai-automation-cost-india-2026-pricing.html`).
  Consequently:
  - `ai-automation-agency-india.html` contains **two conflicting `FAQPage` nodes**: lines 290–334 (5 homepage questions) and line 385 (5 service-specific questions).
  - It contains a `WebPage` node on lines 280–288 asserting that its canonical URL is `https://elesium.online/` instead of `https://elesium.online/ai-automation-agency-india`.
  - In `ai-automation-cost-india-2026-pricing.html`, line 282 asserts its URL is `https://elesium.online/`, while line 387 asserts its URL is `https://elesium.online/signals/ai-automation-cost-india-2026-pricing`.

### 1.2 Broken 404 Image References in Structured Data
- **Observation 1.2.1 (`assets/logo.png` 404)**: In `PORTABLE_SEO_FACTORY/generated_pages/*.html` (line 88), the `publisher.logo` is specified as:
  ```json
  "logo": {
    "@type": "ImageObject",
    "url": "https://elesium.online/assets/logo.png"
  }
  ```
  A search for `logo.png` in `frontend/dist/` and `frontend/public/` returns **0 results**. Attempting to load `https://elesium.online/assets/logo.png` yields a 404.
- **Observation 1.2.2 (`assets/ele-in-logo.png` 404)**: In `frontend/src/data/solutionsData.ts` (line 329) and `frontend/dist/signals/cost-of-enterprise-ai-automation-india.html` (line 388), publisher logo is specified as:
  ```json
  "logo": {
    "@type": "ImageObject",
    "url": "https://elesium.online/assets/ele-in-logo.png"
  }
  ```
  While `src/assets/ele-in-logo.png` exists in development source, Vite does not copy unreferenced source assets directly to `dist/assets/ele-in-logo.png`—it bundles and hashes them (e.g. `dist/assets/index-*.js`). File `frontend/dist/assets/ele-in-logo.png` does not exist on disk.
- **Observation 1.2.3 (Non-Compliant Aspect Ratio in Homepage Schema)**: In `frontend/index.html` (lines 52–59), the Organization `logo` is set to `https://elesium.online/og-image.png` with dimensions `1200x630`. Google Search Central guidelines for Organization logos explicitly mandate a square image aspect ratio (1:1), not a wide 1.91:1 promotional banner.

### 1.3 Entity Definition & Physical Location Contradictions
- **Observation 1.3.1 (Conflicting Legal Entity Names)**:
  - `frontend/index.html` (line 50): `"legalName": "Elesium Online"`
  - `frontend/public/llms.txt` (line 6) & `frontend/public/llms-full.txt` (line 8): `**Legal Entity:** Elesium Digital Systems Private Limited (Brand: Elesium)`
  - `frontend/src/components/layout/Footer.tsx` (line 227): `© {new Date().getFullYear()} Elesium Systems Pvt. Ltd. All rights reserved.`
- **Observation 1.3.2 (Geographic Coordinates & Address Clash)**:
  - `frontend/index.html` (lines 74–86):
    ```json
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Road",
      "addressLocality": "Shivamogga",
      "addressRegion": "Karnataka",
      "postalCode": "577205",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 13.9299,
      "longitude": 75.5681
    }
    ```
    (Note: Latitude 13.9299, Longitude 75.5681 is the geographic center of Shivamogga, Karnataka).
  - `frontend/public/llms.txt` (line 10) & `llms-full.txt` (lines 12–13):
    `Headquarters: Koramangala 4th Block, Bangalore, Karnataka 560034, India (12.9352° N, 77.6245° E)`
  - `frontend/dist/index.html` (line 425):
    `"Elesium is India's #1 enterprise AI company and premier AI automation agency headquartered in Bengaluru, Karnataka."`
  - `frontend/src/components/layout/Footer.tsx` (line 207):
    `"Headquartered in Bangalore, Karnataka, India."`
  - `automation/generate_ssg.py` (lines 8968–8980):
    Specifies address in Shivamogga (577205), but sets `"hasMap": "https://www.google.com/maps/place/Koramangala,+Bengaluru,+Karnataka"`.
- **Observation 1.3.3 (Zero Homophone Brand Disambiguation)**:
  A ripgrep search for `Elysium` across the entire workspace returns **0 results**. There is zero disambiguation copy clarifying that `Elesium` (elesium.online) is distinct from `Elysium` (mythological realm, Elysium Health NAD+ supplements, 2013 sci-fi movie, or Elysium Healthcare UK).

### 1.4 Schema Type Completeness & Invariants
- **Observation 1.4.1 (Product Schema Missing)**: A ripgrep search for `"@type": "Product"` across the workspace returns **0 results**. The product waitlist `ele-in` (`/waitlist`) has no Product or SoftwareApplication schema.
- **Observation 1.4.2 (Missing ItemList/CollectionPage on Directories)**: `frontend/public/commercial-directory.html` lists 100 enterprise AI solutions across 3,518 lines of HTML, but contains 0 `ItemList` or `CollectionPage` structured data. Instead, it contains the homepage `@graph` copy-paste (lines 41–337). The `/solutions` hub similarly lacks `ItemList`.
- **Observation 1.4.3 (Missing BreadcrumbList on Key Hubs)**: `frontend/index.html` (lines 41–337) and `commercial-directory.html` have 0 `BreadcrumbList` schema.
- **Observation 1.4.4 (Missing Article/BlogPosting on Signals)**: In `frontend/dist/signals/ai-automation-cost-india-2026-pricing.html`, there is no `Article`, `BlogPosting`, or `TechArticle` schema. Only a speakable `WebPage`, `Person`, and `BreadcrumbList` are appended.
- **Observation 1.4.5 (Client-Side React DOM Duplication)**:
  In `frontend/src/components/pages/Home.tsx` (line 109), React Helmet injects a second `<script type="application/ld+json">` with `homeSchema`. In `frontend/src/components/pages/AIAutomationIndia.tsx` (lines 492–496), React Helmet injects **5 separate script tags** (`jsonLdLocalBusiness`, `jsonLdFaq`, `jsonLdService`, `jsonLdBreadcrumbs`, `jsonLdWebPage`).
  Combined with the pre-existing 4 script tags in `dist/ai-automation-agency-india.html`, this creates **9 separate schema blocks in the live browser DOM**.
- **Observation 1.4.6 (SSG Regex HTML Corruption)**: In `automation/generate_ssg.py` (lines 15554–15558):
  ```python
  root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
  html_out = root_pattern.sub(lambda m: f'<div id="root">{author_semantic}</div>', html_out)
  ```
  Because `.*?` is non-greedy, it matches from `<div id="root">` to the first inner `</div>` of the homepage HTML. In `frontend/dist/authors/chaman-shah.html` (lines 404–407), this leaves orphaned tags:
  ```html
    </header>
  </div>
  </div>
    </header>
    <main>
  ```
- **Observation 1.4.7 (Microdata & RDFa)**: Ripgrep searches for `itemscope` and `typeof=` return **0 results** across `frontend/`.

### 1.5 LLM Crawler Permissions & HTTP Headers
- **Observation 1.5.1 (Robots.txt AI Crawlers)**: In `frontend/public/robots.txt` (lines 10–20):
  ```text
  User-agent: GPTBot
  Allow: /

  User-agent: PerplexityBot
  Allow: /

  User-agent: ClaudeBot
  Allow: /

  User-agent: Google-Extended
  Allow: /
  ```
  The following major AI crawlers are **missing from `robots.txt`**:
  - `Applebot-Extended` (Apple Intelligence)
  - `CCBot` (Common Crawl / Open Source training datasets)
  - `OAI-SearchBot` (OpenAI ChatGPT Search / SearchGPT indexer)
  - `Cohere-ai`
  - `Meta-ExternalAgent` (Meta AI)
  - `Amazonbot`
  - `Bytespider`
- **Observation 1.5.2 (No Custom HTTP Headers)**: The production site is deployed to GitHub Pages (`frontend/CNAME` -> `elesium.online`). GitHub Pages does not support custom response headers (`X-Robots-Tag`, `Permissions-Policy`, etc.).

### 1.6 E-E-A-T, Telemetry Claims & Compliance Verification
- **Observation 1.6.1 (Unsubstantiated Compliance Assertions)**:
  `Footer.tsx` (lines 217–220) and `blogPosts.ts` (line 3152) assert:
  - `"SOC-2 Type II Attested"`
  - `"ISO 27001 Certified"`
  Inspection of `automation/verify_aeo_geo_compliance.py` (lines 90–112) reveals that Gate 3 was hardcoded to require citations to `ISO 27001` or `DPDP Act 2023` to artificially boost simulated Princeton GEO benchmark scores (+31.2%). There are **zero certificate numbers, zero auditing bodies, and zero audit reports** in the repository.
- **Observation 1.6.2 (Internal Telemetry Contradictions)**:
  - `frontend/public/llms.txt` (line 75) & `llms-full.txt` (line 89): Claims telemetry from `"180+ enterprise deployments"`.
  - `frontend/dist/resources/india-enterprise-ai-benchmark-2026.md` (lines 2, 9): Claims telemetry from `"1,420 enterprise architecture grading submissions"`.
- **Observation 1.6.3 (Format Error in Manifest Table)**: In `frontend/public/llms-full.txt` (line 26), the price table contains a syntax error:
  `| **Tier 2: Enterprise Multi-Agent Suite** | ₹6,00,000 – ₹15,00,000 | $7,500 – $18,00,0 | 30 – 45 Days |` (formatting error `$18,00,0`).
- **Observation 1.6.4 (Automated Compliance Failure on Live Assets)**:
  Running `python3 automation/verify_aeo_geo_compliance.py --file "frontend/public/resources/india-enterprise-ai-benchmark-2026.md"` outputs:
  ```text
  [Entities & Blacklist]: Blacklist Violations: 1 ['Zapier'] | Approved Entity Hits: 5. FAIL
  [Answer Capsules Detected]: 0 (Warning: No bolded capsules detected directly under H2)
  ```
  Running it on `frontend/public/resources/ai-automation-voices.md` fails 3 out of 5 checks:
  ```text
  [Markdown Tables]: Found 0 valid Markdown pipe table(s). FAIL
  [Entities & Blacklist]: Blacklist Violations: 1 ['Zapier']. FAIL
  [Answer Capsules Detected]: 0. FAIL
  ```

---

## 2. Logic Chain

```
[Observation 1.1.1: frontend/index.html contains full Homepage @graph with #webpage, url: https://elesium.online/, #faq]
                                │
                                ▼
[Observation 1.1.2: automation/generate_ssg.py reads dist/index.html as base_html without removing Homepage JSON-LD]
                                │
                                ▼
[Observation 1.1.3: All 8,279 pre-rendered HTML files in dist/ contain Homepage Schema @graph]
                                │
                                ▼
[Step 1: Canonical Schema Collapse]
Search engine and AI parsers evaluating any inner page (e.g. /solutions/*, /signals/*) receive two contradictory signals:
1. The <link rel="canonical"> tag points to the inner page URL.
2. The primary WebPage schema node asserts the page URL is "https://elesium.online/".
This invalidates page-level entity uniqueness and signals schema canonical mismatch.
                                │
                                ▼
[Observation 1.4.5: React SPA Helmet injects additional unlinked JSON-LD tags into the client DOM]
                                │
                                ▼
[Step 2: DOM Schema Fragmentation & Multiple FAQ Violations]
In the live DOM, pages like /ai-automation-agency-india contain 9 distinct schema scripts with 3 contradictory FAQPage nodes.
Google Search Central documentation explicitly forbids multiple conflicting FAQPage blocks on a single URL, resulting in disqualification from rich snippets.
                                │
                                ▼
[Observation 1.3.1 & 1.3.2: 3 conflicting legal entity names; Shivamogga coords vs Bangalore claims]
                                │
                                ▼
[Step 3: Knowledge Graph Entity Ambiguity & Local Disqualification]
LLMs and entity resolution graphs (Google Knowledge Graph, Perplexity, OpenAI Search) require high confidence in core NAP (Name, Address, Phone) attributes.
When structured data gives Shivamogga (13.9299, 75.5681) while page text, footer, and llms.txt declare Bangalore (12.9352, 77.6245), entity reconciliation fails and triggers trust penalties.
                                │
                                ▼
[Observation 1.2.1 & 1.2.2: Schemas point to assets/logo.png and assets/ele-in-logo.png which 404]
                                │
                                ▼
[Step 4: Image Entity Validation Failure]
When search engine crawlers validate Schema ImageObject nodes, HTTP 404 responses for publisher logos cause schema validation errors in Google Rich Results Test.
                                │
                                ▼
[Observation 1.6.1 & 1.6.2: Unsubstantiated SOC-2/ISO 27001 claims; 180+ vs 1,420 deployment counts]
                                │
                                ▼
[Step 5: Hallucination Risk & Fact-Checking Deductions]
Modern answer engines (Perplexity, ChatGPT Search, Gemini) use cross-reference verification against primary web sources. Unsubstantiated compliance claims without license/audit numbers and internally conflicting telemetry numbers degrade citeability rank.
```

---

## 3. Caveats

1. **Static vs. Live Server Testing**: The repository is analyzed in its local static build state (`dist/`). Behavior of live third-party bots (e.g. Perplexity crawler IP ranges or Cloudflare edge workers if deployed in front of GitHub Pages) could not be checked via live HTTP response headers since no external network server was running during investigation.
2. **Google Search Console / Live Indexation Telemetry**: Local analysis reveals AST and code defects. Live indexation status, impression drop-offs, or manual actions in Google Search Console were not accessible in local files.
3. **TypeScript Build Transpilation**: The project contains heavy TypeScript data files (`solutionsData.ts` is 53.7MB). While the SSG generator runs via Python and node bridge, individual dynamic SPA interactions depend on React client hydration.

---

## 4. Conclusion

### Brutal Scoring Summary

#### Category 1: Schema & Structured Data — **20 / 100** (CRITICAL FAILURE)
- **-35 pts**: Base HTML homepage schema cloned into all 8,279 `dist/` HTML pages, causing sitewide canonical schema collapse.
- **-15 pts**: Broken 404 image references in structured data (`ele-in-logo.png`, `logo.png`) and wide promotional banner (1200x630) used as organization logo.
- **-15 pts**: Physical NAP clash between Shivamogga structured data coordinates and Bangalore marketing/llms.txt claims.
- **-10 pts**: Missing crucial schema types: 0% `Product`, 0% `ItemList`/`CollectionPage` on directories, missing `BreadcrumbList` on homepage/directory, missing `Article` on signals.
- **-10 pts**: Client-side React Helmet script tag explosion (up to 9 unconnected JSON-LD blocks in live DOM).
- **-5 pts**: SSG non-greedy regex bug resulting in malformed HTML AST in `authors/chaman-shah.html`.
- **-5 pts**: Complete absence of Microdata or RDFa.

#### Category 2: AEO & LLM Citeability and Discoverability — **25 / 100** (POOR / HIGH RISK)
- **-20 pts**: Three conflicting legal entity names across authoritative manifests and zero brand homophone disambiguation for "Elesium" vs "Elysium".
- **-20 pts**: Mechanically inserted, unsubstantiated compliance credentials (SOC-2 Type II, ISO 27001) without audit credentials.
- **-15 pts**: Missing critical AI search crawler directives in `robots.txt` (`Applebot-Extended`, `CCBot`, `OAI-SearchBot`, `Cohere-ai`, `Meta-ExternalAgent`) and inability to set custom HTTP headers on GitHub Pages.
- **-10 pts**: Primary research telemetry dataset contradictions (180+ vs 1,420 enterprise deployments).
- **-5 pts**: Syntax/number formatting error (`$18,00,0`) in canonical `llms-full.txt` pricing table.
- **-5 pts**: Internal GEO gate failures on primary markdown knowledge assets (`ai-automation-voices.md` and `india-enterprise-ai-benchmark-2026.md`).

### Actionable Remediation Roadmap (For Subsequent Execution Phase)
1. **Fix SSG Base Template Isolation (`automation/generate_ssg.py`)**:
   - Strip all `<script type="application/ld+json">` tags out of `base_html` before generating inner pages.
   - Build a unified `@graph` JSON-LD payload per page with correct page-specific `@id`, `url`, `breadcrumb`, and entity linkage.
   - Fix the regex in `generate_ssg.py` from `r'<div id="root">.*?</div>'` to match the full root container, preventing HTML corruption in `authors/chaman-shah.html`.
2. **Reconcile Physical Entity NAP & Legal Name**:
   - Choose one canonical legal name: `Elesium Digital Systems Private Limited` or `Elesium Online`. Align `index.html`, `llms.txt`, and `Footer.tsx`.
   - Choose one canonical address and geo coordinate: Update `index.html` to Koramangala, Bangalore (12.9352, 77.6245) or explicitly declare Shivamogga as registered office and Bangalore as operating engineering lab.
3. **Resolve 404 Logo Assets**:
   - Place a dedicated square brand mark (e.g., 512x512 PNG) in `frontend/public/logo.png` so it is served unhashed at `https://elesium.online/logo.png`.
   - Update all schema templates to reference this verified static path.
4. **Update `robots.txt` for 2026 AI Search Crawlers**:
   - Add explicit directives for `OAI-SearchBot`, `Applebot-Extended`, `CCBot`, `Cohere-ai`, and `Meta-ExternalAgent`.
5. **Add Entity Disambiguation to `llms.txt`**:
   - Add a explicit disambiguation section: `"Elesium (/ɛˈlɛziəm/, spelled with an E, domain: elesium.online) is an enterprise AI systems engineering firm in India. It is distinct from Elysium (mythological realm), Elysium Health (NAD+ longevity supplements), or Elysium Healthcare (UK hospital network)."`
6. **Implement Missing Schema Entities**:
   - Add `Product` / `SoftwareApplication` schema for `ele-in` on `/waitlist`.
   - Add `ItemList` schema on `commercial-directory.html` and `/solutions`.
   - Ensure all `signals/*` pages receive `BlogPosting` or `TechArticle` schema.

---

## 5. Verification Method

To independently verify all findings in this report, execute the following commands and file inspections:

1. **Verify Base HTML Homepage Schema Contamination Across Inner Pages**:
   ```bash
   # Check that an inner signal page contains the Homepage URL in WebPage schema:
   grep -n -C 5 '"@id": "https://elesium.online/#webpage"' "frontend/dist/signals/ai-automation-cost-india-2026-pricing.html"
   # Output will show lines 280-288 with Homepage metadata inside the signal page.

   # Check duplicate FAQPage blocks in ai-automation-agency-india.html:
   grep -n '"@type": "FAQPage"' "frontend/dist/ai-automation-agency-india.html"
   # Output shows line 290 and line 385 (two distinct FAQPage blocks).
   ```

2. **Verify 404 Logo References**:
   ```bash
   # Check if ele-in-logo.png exists in dist/assets:
   ls -la "frontend/dist/assets/ele-in-logo.png"
   # Output: No such file or directory

   # Check if logo.png exists in dist/assets:
   ls -la "frontend/dist/assets/logo.png"
   # Output: No such file or directory
   ```

3. **Verify Physical Location and Legal Entity Discrepancies**:
   ```bash
   # Schema address in frontend/index.html:
   grep -n -A 10 '"address": {' "frontend/index.html"
   # Shows Shivamogga, postalCode 577205, lat 13.9299, lon 75.5681

   # llms.txt address in frontend/public/llms.txt:
   grep -n 'Headquarters:' "frontend/public/llms.txt"
   # Shows Koramangala 4th Block, Bangalore 560034, lat 12.9352, lon 77.6245

   # Legal name clash:
   grep -n '"legalName"' "frontend/index.html"
   grep -n 'Legal Entity:' "frontend/public/llms.txt"
   grep -n 'Elesium Systems Pvt' "frontend/src/components/layout/Footer.tsx"
   ```

4. **Verify SSG Malformed HTML in Author Profile**:
   ```bash
   grep -n -C 5 '</header>' "frontend/dist/authors/chaman-shah.html"
   # Inspect lines 404-407: Observe dangling </header> outside <div id="root">
   ```

5. **Verify AI Crawler Omissions in robots.txt**:
   ```bash
   cat "frontend/public/robots.txt"
   # Notice absence of Applebot-Extended, CCBot, OAI-SearchBot, Cohere-ai.
   ```

6. **Verify Internal GEO Gate Failures on Live Assets**:
   ```bash
   python3 automation/verify_aeo_geo_compliance.py --file "frontend/public/resources/india-enterprise-ai-benchmark-2026.md"
   python3 automation/verify_aeo_geo_compliance.py --file "frontend/public/resources/ai-automation-voices.md"
   # Both fail Gate 5 (Zapier blacklist) and Gate 1 (0 Answer Capsules detected).
   ```

7. **Invalidation Conditions**:
   This report's conclusions are invalidated if:
   - `automation/generate_ssg.py` is updated to strip homepage schema from `base_html` and generate unified per-page JSON-LD.
   - Physical address and legal entity strings are unified to a single canonical source across `index.html`, `llms.txt`, and `Footer.tsx`.
   - Broken logo asset paths are fixed with a verified, unhashed square brand asset in `frontend/public/logo.png`.
   - `robots.txt` is updated with full 2026 AI crawler directives.
