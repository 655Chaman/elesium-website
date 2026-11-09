# Dispatch Instructions for Worker: SEO & AEO Brutal Audit Synthesis

## Mission
Synthesize the complete, comprehensive, publication-grade Search Engine Optimization (SEO) and Answer Engine Optimization (AEO) Brutal Audit for the ELESIUM website repository (`https://elesium.online`).

## Working Directory
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_1/

## Mandatory Inputs to Read
1. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
2. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/orchestrator/PROJECT.md
3. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_1/handoff.md (Technical SEO, Crawlability, Core Web Vitals)
4. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_2/handoff.md (Content, On-Page & Semantic Architecture)
5. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_3/handoff.md (Schema & Structured Data, AEO & LLM Citeability)

## Write Ownership
You own:
- `/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md` (the primary user deliverable)
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_1/handoff.md`

## Requirements
1. Comprehensive SEO & AEO Analysis:
   - Ground every single finding in specific files, line numbers, exact code snippets, and repo configurations.
   - Zero generic boilerplate recommendations or abstract checklists.
2. Brutal Scoring & Justification:
   - Explicit numerical score (0-100) per category and overall composite score.
   - Categories evaluated:
     * Category 1: Technical SEO, Crawlability & Core Web Vitals (Survey score: 41/100)
     * Category 2: Content, Heading Hierarchy & Semantic On-Page Architecture (Survey score: 40.5/100)
     * Category 3: Schema & Structured Data (Survey score: 20/100)
     * Category 4: Answer Engine Optimization (AEO) & LLM Citeability / Discoverability (Survey score: 25/100)
   - Every single deduction must have an explicit point penalty (-X pts) and a concrete, objective explanation citing the exact issue found in the codebase.
3. Verification & Reproduction:
   - Provide concrete bash verification commands so any engineer can reproduce and verify every finding on their terminal.
4. Actionable Remediation Roadmap:
   - Prioritized roadmap with concrete architectural code fixes.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.


## 2026-11-08T04:48:29Z
You are a teamwork_worker agent.
Your working directory is: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_1/

MANDATORY: You MUST read the original request file before starting:
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md

Also read your dispatch file and the comprehensive survey handoffs from the 3 Explorers:
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_1/DISPATCH.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/orchestrator/PROJECT.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_1/handoff.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_2/handoff.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_explorer_survey_3/handoff.md

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your task is to compile the final, authoritative, publication-grade SEO & AEO Brutal Audit Report for the ELESIUM website repository (`https://elesium.online`).
You own:
- `/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md`
- `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_1/handoff.md`

Structure of the report:
1. Executive Summary & Composite Brutal Scorecard (overall weighted grade and scores for all 4 categories).
2. Category 1: Technical SEO, Crawlability, Sitemaps & Core Web Vitals (41/100) — detailed analysis of 43MB JS bundle, 80 missing static routes (404), Fastly 301 trailing slash canonical redirect loop, sitemap duplication, missing meta assets.
3. Category 2: Content & On-Page Architecture (40.5/100) — title/description overflow up to 95/226 chars, keyword cannibalization across 3 core pages, missing <main> tags, multiple H1s with cloaked sr-only text in Industries.tsx, 404 broken image /assets/LOGO_NEW.png, broken links.
4. Category 3: Schema & Structured Data (20/100) — sitewide homepage schema cloning across 8,279 dist pages, double conflicting FAQPages, broken 404 logo URLs in schemas, Shivamogga vs Bangalore NAP clash, missing Product & ItemList, client React Helmet DOM duplication.
5. Category 4: Answer Engine Optimization (AEO) & LLM Citeability / Discoverability (25/100) — conflicting legal names, 0 brand disambiguation vs Elysium, unsubstantiated SOC-2 / ISO 27001 claims, missing AI bot tokens (Applebot-Extended, CCBot, OAI-SearchBot) in robots.txt, internal GEO gate self-test failures.
6. Concrete Point-by-Point Deduction Justifications: Every single penalty must specify the exact deduction (-X pts) and code evidence.
7. Reproducible Verification Commands (bash commands to verify each major defect).
8. Actionable Remediation Roadmap (prioritized architectural engineering fixes).

Write the complete document to `/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md`, write your handoff report to `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_1/handoff.md`, and notify parent when complete.
