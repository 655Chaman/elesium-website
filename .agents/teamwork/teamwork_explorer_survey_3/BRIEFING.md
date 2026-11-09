# BRIEFING — 2026-11-08T04:47:00Z

## Mission
Conduct an in-depth, evidence-grounded investigation of Schema & Structured Data and Answer Engine Optimization (AEO) / LLM Citeability & Discoverability for the ELESIUM website codebase.

## 🔒 My Identity
- Archetype: explorer
- Roles: Schema & Structured Data, AEO & LLM Discoverability Investigation
- Working directory: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_3
- Original parent: a17315d0-9274-4d25-9a52-1abc7a7b7b6c
- Milestone: Survey & Deep-Dive Investigation

## 🔒 Key Constraints
- Read-only investigation — do NOT implement code changes
- Ground every finding with exact file paths, line numbers, and code snippets
- Do not provide generic checklists or abstract recommendations
- Deliverable: handoff.md in working directory
- Only write metadata to working directory

## Current Parent
- Conversation ID: a17315d0-9274-4d25-9a52-1abc7a7b7b6c
- Updated: 2026-11-08T04:47:00Z

## Investigation State
- **Explored paths**:
  - `frontend/index.html` (Lines 41–337 Homepage Schema graph)
  - `frontend/dist/index.html` (Homepage pre-rendered HTML & JSON-LD)
  - `frontend/dist/ai-automation-agency-india.html` (Contaminated homepage schema + 3 duplicate schema blocks)
  - `frontend/dist/signals/ai-automation-cost-india-2026-pricing.html` (Missing Article schema, contaminated homepage schema)
  - `frontend/dist/tools/multi-agent-token-leakage-simulator.html` (WebApplication schema, contaminated homepage schema)
  - `frontend/dist/authors/chaman-shah.html` (Broken HTML DOM closing tags, duplicate Person schema, contaminated homepage schema)
  - `frontend/dist/solutions/ai-automation-agency-for-logistics.html` (Service schema, contaminated homepage schema)
  - `frontend/public/robots.txt` (Missing AI crawler tokens: Applebot-Extended, CCBot, OAI-SearchBot)
  - `frontend/public/llms.txt` and `llms-full.txt` (Address and legal entity discrepancies)
  - `frontend/public/commercial-directory.html` (Missing ItemList/CollectionPage schema, homepage schema clone)
  - `frontend/src/App.tsx`, `Home.tsx`, `AIAutomation.tsx`, `AIAutomationIndia.tsx`, `AuthorProfile.tsx`, `Footer.tsx`
  - `automation/generate_ssg.py` (Lines 6869, 6922-7008, 8950-9168, 15554-15558 SSG base_html schema contamination)
  - `automation/verify_schema_integrity.py` and `automation/verify_aeo_geo_compliance.py`
  - `automation/directory_profiles/nap_consistency_report.json`
- **Key findings**:
  1. Sitewide Schema Identity Collapse: Base HTML with Homepage JSON-LD (@id: #webpage, url: https://elesium.online/) is copied into all 8,200+ dist HTML files.
  2. Severe Entity Contradictions: Legal name mismatch ("Elesium Online" vs "Elesium Digital Systems Private Limited" vs "Elesium Systems Pvt. Ltd."); Address mismatch (Shivamogga vs Bangalore).
  3. 404 Image URLs in Schema: `ele-in-logo.png` and `logo.png` referenced in schema return 404.
  4. Missing Schema Types: Product (0%), ItemList/CollectionPage on directories (0%), Article on many signals, BreadcrumbList on homepage/directory.
  5. AI Crawler Directives: robots.txt allows GPTBot, PerplexityBot, ClaudeBot, Google-Extended, but completely omits Applebot-Extended, CCBot, OAI-SearchBot, Cohere-ai, Meta-ExternalAgent. No custom HTTP headers supported on GitHub Pages.
  6. E-E-A-T & Citation Integrity: Unsubstantiated claims of SOC-2 Type II and ISO 27001 inserted mechanically to pass internal GEO regex gates.

## Key Decisions Made
- Proceed to write comprehensive, brutally scored 5-component handoff report to `handoff.md`.

## Artifact Index
- DISPATCH.md — Dispatch instructions and status logs
- BRIEFING.md — Persistent memory
- progress.md — Liveness heartbeat and status log
- handoff.md — Complete 5-component report
