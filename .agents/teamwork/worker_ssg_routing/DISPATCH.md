## 2026-11-08T07:17:44Z
You are the SSG Compiler & Routing Worker for Category 1 Technical SEO Remediation.
Your working directory is: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_ssg_routing/

MANDATORY FIRST STEP: Read the following authoritative files:
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/orchestrator_cat1/PROJECT.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/epf_reviewer_2/handoff.md
- /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE BOUNDARIES:
You exclusively own and may modify ONLY:
- `automation/generate_ssg.py`
DO NOT edit any other files.

TASKS:
1. Ensure all 252 static routes from `frontend/src/App.tsx` are pre-rendered with valid HTTP 200 responses (Defect 2):
   - Add `"book-audit"` to `static_pages` dictionary and ensure full semantic Waitlist HTML is generated for `/book-audit/` with canonical `https://elesium.online/book-audit/`.
   - Implement automated programmatic extraction of all `<Navigate to="..." replace />` routes from `frontend/src/App.tsx` (all 78 alias routes: 75 tools, 2 author aliases, 1 compare alias, and `/team/chaman-shah`).
   - For every alias route, generate BOTH `dist/<alias>/index.html` and `dist/<alias>.html` using the exact approved static redirect stub:
     ```html
     <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="robots" content="index, follow">
       <meta http-equiv="refresh" content="0; url=https://elesium.online{target_path}/">
       <link rel="canonical" href="https://elesium.online{target_path}/">
       <title>Redirecting to https://elesium.online{target_path}/...</title>
       <script>
         window.location.replace("https://elesium.online{target_path}/" + window.location.search + window.location.hash);
       </script>
     </head>
     <body>
       <p>Redirecting to <a href="https://elesium.online{target_path}/">https://elesium.online{target_path}/</a>...</p>
     </body>
     </html>
     ```
   - Ensure target paths end with a trailing slash (`/`) matching canonical URLs.
2. Eliminate the Fastly 301 trailing-slash canonical redirect loop sitewide (Defect 3):
   - In `automation/generate_ssg.py`, standardize ALL directory-level canonical tags, `og:url`, `twitter:url`, and Schema.org `@id`/`url` to end with trailing slashes:
     - `/solutions/{slug}/`
     - `/signals/{slug}/`
     - `/compare/{slug}/`
     - `/videos/{slug}/`
     - `/tools/{slug}/`
     - Hub pages: `/solutions/`, `/signals/`, `/glossary/`, `/compare/`, `/videos/`, etc.
   - For author consolidation: ensure `https://elesium.online/authors/chaman-shah/` is the single canonical entity. Remove `"team/chaman-shah"` from duplicate rendering and make it a redirect stub to `/authors/chaman-shah/`. Point canonical of `/team/index.html` to `/authors/chaman-shah/`.
3. Systemic `twitter:url` fix (Defect 6):
   - Implement `update_social_urls(html_content, canonical_url)` function and apply it across ALL pre-rendered loops (solutions, signals, hub, commercial directory, glossary, compare, videos, tools) so `twitter:url` and `og:url` strictly match the canonical URL of the specific page.
4. Route chunk modulepreload (Defect 4 / performance):
   - Inject `<link rel="modulepreload">` for relevant route chunks.
5. Verification:
   - Run python3 `automation/generate_ssg.py` (or verify your changes run cleanly).
   - Verify that all 252 static routes exist in `frontend/dist/` (0 missing).
   - Verify canonical tags in generated HTML match trailing-slash directory URLs (0 canonical redirect loops).
   - Document commands, code diff summary, and verification in `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/worker_ssg_routing/handoff.md`.
   - Send completion message to orchestrator.
Maintain progress.md in your working directory.
Address the captain respectfully in communications as required.
