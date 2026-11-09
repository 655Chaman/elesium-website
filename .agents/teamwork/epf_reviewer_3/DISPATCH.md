## 2026-11-08T07:05:01Z

You are an expert Metadata, Sitemaps, Robots & Asset Hygiene Reviewer for the Extreme Paranoical Framework (EPF) plan review.
Your working directory is: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/epf_reviewer_3/

You MUST read the following authoritative files first:
- Original Request: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
- Baseline Audit Report: /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md
- Draft Plan: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/orchestrator_cat1/PLAN_DRAFT.md

Your role is to empirically review, stress-test, and upgrade the implementation plan for:
1. Defect 5 (-5.0 pts): Deduplicate sitemaps and implement accurate `<lastmod>` timestamps reflecting actual content modification dates rather than dynamic build timestamps (`automation/generate_sitemap.py`, `frontend/public/sitemap-commercial-top100.xml`).
2. Defect 6 (-4.0 pts): Add all missing core meta tags (`<meta name="googlebot">`, manifest, apple-touch-icon, theme-color) and ensure `twitter:url` points to page-specific canonical URLs (`frontend/index.html`, `automation/generate_ssg.py`).
3. Defect 7 (-3.0 pts): Eliminate render-blocking Google Fonts stylesheets and optimize favicon assets with `favicon.ico` present (`frontend/index.html`, `frontend/public/favicon.*`).
4. Defect 8 (-3.0 pts): Update `robots.txt` disallow rules to prevent search crawlers from indexing `/embed/` calculator widgets under RFC 9309 (`frontend/public/robots.txt`).

Investigate the actual files:
- `automation/generate_sitemap.py`
- `frontend/public/sitemap*.xml`
- `frontend/index.html`
- `automation/generate_ssg.py` (specifically lines around 7346 for twitter:url)
- `frontend/public/robots.txt`
- `frontend/public/favicon.*`

Identify all technical risks, edge cases, and architectural traps:
- How git commit timestamps or file modification times can be accurately obtained for all URLs in sitemaps without falling back to dynamic `datetime.now()`.
- Sitemaps index architecture: whether `sitemap-commercial-top100.xml` should be removed from `sitemap.xml` or deduplicated.
- Exact syntax for `<meta name="googlebot">`, robots directives, theme-color, manifest.json schema, apple-touch-icon dimensions.
- Exact regex or string replacement in `generate_ssg.py` to ensure `twitter:url` reflects the actual canonical URL on every single pre-rendered page.
- Asynchronous font loading technique that prevents render blocking and layout shifts (FOUT/CLS).
- Favicon multi-resolution `.ico` generation and PNG compression.
- RFC 9309 robots.txt compliance for all crawler user-agents (e.g. `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`).

Provide an explicit, concrete, and upgraded implementation specification for all four items.
Document your complete findings and upgraded plan in `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/epf_reviewer_3/handoff.md` and send a completion message to the orchestrator.
Remember: Do not modify source code files yourself; this is a review and upgrade phase.
Maintain progress.md in your working directory.
Address the captain respectfully in communications as required.
