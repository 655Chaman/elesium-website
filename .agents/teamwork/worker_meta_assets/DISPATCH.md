## 2026-11-08T07:17:59Z
You are the Sitemaps, Robots & Asset Hygiene Worker for Category 1 Technical SEO Remediation.
Your working directory is: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_meta_assets/

MANDATORY FIRST STEP: Read the following authoritative files:
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/orchestrator_cat1/PROJECT.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/epf_reviewer_3/handoff.md
- /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE BOUNDARIES:
You exclusively own and may modify ONLY:
- `automation/generate_sitemap.py`
- `automation/ping_search_engines.py`
- `frontend/public/robots.txt`
- `frontend/public/manifest.json` (create)
- `frontend/public/favicon.ico` (create)
- `frontend/public/favicon.png` (overwrite with optimized brand icon)
- `frontend/public/apple-touch-icon.png` (create)
- `frontend/public/sitemap-commercial-top100.xml` (delete)
- `frontend/index.html`
- `frontend/src/components/layout/Footer.tsx`
DO NOT edit any other files.

TASKS:
1. Deduplicate Sitemaps & Accurate Ground-Truth `<lastmod>` (Defect 5):
   - In `automation/generate_sitemap.py`:
     - Delete generation of `sitemap-commercial-top100.xml`.
     - Implement single-batch git log date extraction function `get_git_commit_dates(repo_root)`.
     - Replace all dynamic `datetime.datetime.now()` with genuine source modification dates:
       * All 3,765 solutions get the git commit date of `frontend/src/data/solutionsData.ts` (e.g. `2026-10-22`).
       * Core routes get their component file commit date from the git log map (fallback to last commit date).
       * Signals parse `published_date` from `blogPosts.ts`.
       * Compare parse `dateModified` from `compareBattlecards`.
       * Videos parse `uploadDate`.
     - Standardize all `<loc>` entries in sitemaps to end with trailing slashes matching canonical URLs (e.g. `https://elesium.online/solutions/{slug}/`, `https://elesium.online/signals/{slug}/`, `https://elesium.online/tools/{tool_slug}/`). Keep `/commercial-directory.html` without trailing slash.
     - Rollup `<lastmod>` in `sitemap.xml` for `sitemap-core.xml` and `sitemap-solutions.xml` using `max(lastmod)`.
   - Delete `frontend/public/sitemap-commercial-top100.xml`.
   - Clean up downstream references to `sitemap-commercial-top100.xml`:
     - In `frontend/public/robots.txt`: remove sitemap line for top100.
     - In `automation/ping_search_engines.py`: remove top100 from `SITEMAPS` and `discover_priority_urls`.
     - In `frontend/src/components/layout/Footer.tsx`: remove line 234 `<Link to="/sitemap-commercial-top100.xml"...>`.
     - In `frontend/index.html`: update line 391 footer sitemap link to `/sitemap.xml`.
2. Add Missing Core Meta Tags & Manifest (Defect 6):
   - In `frontend/index.html`:
     - Add `<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`.
     - Add `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`.
     - Add `<meta name="theme-color" content="#0a0a0c" />` (and dark/light scheme variants).
     - Add `<link rel="manifest" href="/manifest.json" />`.
     - Add `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`.
     - Add `<link rel="icon" href="/favicon.ico" sizes="any" />`.
     - Add `<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />`.
   - Create valid `frontend/public/manifest.json`.
3. Eliminate Render-Blocking Google Fonts & Optimize Favicon Assets (Defect 7):
   - In `frontend/index.html`, replace synchronous font link (line 350) with asynchronous non-blocking loader:
     `<link rel="preconnect" href="https://fonts.googleapis.com" />`
     `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
     `<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />`
     `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" media="print" onload="this.media='all'" />`
     `<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" /></noscript>`
   - Generate multi-size `frontend/public/favicon.ico` (16x16, 32x32, 48x48, < 15KB) from `frontend/src/assets/ele-in-logo.png` using Python Pillow.
   - Generate optimized `frontend/public/favicon.png` (< 10KB, 32x32/192x192) from brand logo.
   - Generate `frontend/public/apple-touch-icon.png` (180x180, < 15KB) from brand logo.
4. Update `robots.txt` for RFC 9309 Disallow Bypass (Defect 8):
   - In `frontend/public/robots.txt`, add explicit `Disallow: /embed/` to ALL bot blocks (`*`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`, `CCBot`, `Applebot-Extended`, etc.) before `Allow: /`.
5. Verification:
   - Run `python3 automation/generate_sitemap.py` and inspect generated XML.
   - Verify 0 duplicate URLs across sitemaps; all lastmod dates match file history.
   - Verify `favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `manifest.json`.
   - Verify `robots.txt` disallows `/embed/` for all crawlers.
   - Document commands and results in `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_meta_assets/handoff.md`.
   - Send completion message to orchestrator.
