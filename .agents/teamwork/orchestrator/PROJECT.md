# Project: Rigorous SEO and AEO Brutal Audit for ELESIUM

## Architecture
- Target Domain: `https://elesium.online`
- Repository: `/Users/krdeeksha/ELESIUM WEBSITE`
- Tech Stack: React 19 SPA + Vite 7 + Python SSG pipeline deploying to GitHub Pages via peaceiris/actions-gh-pages
- Final Master Deliverable: `/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md` (957 lines)

## Feature Inventory
| # | Dimension / Category | Scope & Key Invariants | Score (Final Verified) | Status | Assigned Worker |
|---|---|---|:---:|---|---|
| 1 | Technical SEO & Infrastructure | 43MB JS bundle payload, 79 missing static routes (404), Fastly 301 trailing slash canonical loop, fake dynamic sitemap lastmod, 101 duplicate sitemap URLs | 41.0 / 100 | DONE | Worker |
| 2 | Content & On-Page Architecture | Title/meta overflow (71-95 chars / 208-226 chars), keyword cannibalization across 3 core landings, missing `<main>` tags on 8 core pages, multiple H1s with cloaked `sr-only` H1 in `Industries.tsx`, broken `/assets/LOGO_NEW.png` 404 images, broken internal links | 40.5 / 100 | DONE | Worker |
| 3 | Schema & Structured Data | Base HTML homepage `@graph` cloned into all 8,254 dist files (canonical schema collapse), double conflicting `FAQPage` nodes, broken 404 logo URLs in schemas, Shivamogga vs Bangalore NAP clash, missing Product & ItemList, client React Helmet DOM duplication | 20.0 / 100 | DONE | Worker |
| 4 | AEO / LLM Citeability & Discoverability | Conflicting legal entity names ("Elesium Online", "Elesium Digital Systems Private Limited", "Elesium Systems Pvt. Ltd."), 0 brand disambiguation vs "Elysium", unsubstantiated SOC-2 / ISO 27001 claims, missing AI bot tokens (Applebot-Extended, CCBot, OAI-SearchBot) in robots.txt, internal GEO gate self-test failures | 25.0 / 100 | DONE | Worker |

## Composite Brutal Score
**31.6 / 100** (Grade: **F — Critical Operational & Crawl Risk**)

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M1 | Repository Survey & Deep-Dive | 3 Parallel Explorers investigating all 4 dimensions | none | DONE |
| M2 | Synthesis of Brutal SEO/AEO Audit Report | Compile unified publication-grade audit report with numerical scores, deductions, and code citations | M1 | DONE |
| M3 | Review & Challenger Gate | 2 Reviewers + 2 Challengers verifying report accuracy against codebase (Gate 2: All APPROVE) | M2 | DONE |
| M4 | Forensic Integrity Audit | Teamwork Forensic Auditor checking report authenticity, truthfulness, and evidence chains (Gate 2: CLEAN) | M3 | DONE |

## Code Layout
- Deliverable Target: `/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md` (957 lines, verified, 0.0 discrepancy)
- Working Directory: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/orchestrator/`
