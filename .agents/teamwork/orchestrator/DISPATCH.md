# Dispatch Instructions

## 2026-11-08T04:32:05Z

Rigorously analyse the Search Engine Optimization (SEO) and Answer Engine Optimization (AEO) of the current website in the local repository, rate everything brutally with numerical scores and detailed justifications, and do not provide generic assessments.

Working directory: /Users/krdeeksha/ELESIUM WEBSITE
Integrity mode: development

## Requirements

### R1. Comprehensive SEO and AEO Analysis
Rigorously analyse the SEO and AEO across the local repository files (templates, structured data, metadata, sitemaps, robots, and assets). The analysis must not be generic: every finding must be grounded in specific files, code snippets, or configurations from the workspace. The team decides the deliverable format.

### R2. Brutal Scoring and Justification
Assign brutal numerical scores per category, covering at least Technical SEO, Content and On-Page Architecture, Schema and Structured Data, and AEO / LLM Citeability and Discoverability. Every score deduction must include a detailed justification explaining why the element failed or underperformed.

## Acceptance Criteria

### SEO and AEO Coverage
- [ ] All primary site templates, metadata configurations, robots directives, sitemaps, and structured data in the repository are inspected.
- [ ] The analysis covers Technical SEO, Content and On-Page Architecture, Schema and Structured Data, and AEO / LLM Citeability.
- [ ] No generic boilerplate recommendations or abstract checklists without direct reference to specific files, components, or configurations in the workspace.

### Scoring and Justification
- [ ] An explicit numerical score is assigned to each evaluated category.
- [ ] Every deduction from a perfect score is accompanied by a concrete, objective explanation citing the exact issue found in the codebase.
- [ ] The final deliverable is produced in the format chosen by the team.


## 2026-11-09T14:54:13Z

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
