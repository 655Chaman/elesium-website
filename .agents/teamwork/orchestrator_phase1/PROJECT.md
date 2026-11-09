# Project: Phase 1 Transcript Ingestion, Diarization, Inventory Triage & Semantic Analysis

## Architecture
- **Data Source**: `/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx` (193,410 words, 1,520 paragraphs, 46 videos).
- **Target Assets**:
  - `SEO SOURCE/phase1/index.md` (Master Catalog & Inventory Index)
  - `SEO SOURCE/phase1/module_01.md` through `module_09.md` (Modular Ingestion & Semantic Dossiers)
- **Quality & Verification Stack**:
  - Programmatic 100% Word & Paragraph Coverage Tester (`automation/verify_phase1_coverage.py`)
  - Anti-Slop & Humanization Compliance Evaluator (`automation/evaluate_phase1_dossiers.py` adapting `13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py`)
  - Independent Challenger & Forensic Integrity Audit

## Code Layout
- Dossier Output Root: `SEO SOURCE/phase1/`
  - `index.md`: Global inventory, topic taxonomy, module telemetry, cross-module dependency graph.
  - `module_01.md`: SEO Fundamentals & Scaling (Nitin Manchanda, Trisha Vaidya, Piyush Shah, Ani).
  - `module_02.md`: Empty Folder Notice (Google Drive empty folder, 0 videos, 10 words).
  - `module_03.md`: Content Mastery & Optimization (Pepper Content, Sudeep Pagedar).
  - `module_04.md`: Technical SEO Infrastructure (Crawling, Screaming Frog, Kaushal Q&A).
  - `module_05.md`: Site Architecture & Sitemaps (Faceted nav, mobile, JS, timestamped sitemaps).
  - `module_06.md`: Off-Page Links & Penalties (Link fundamentals, backlink analysis, manual actions).
  - `module_07.md`: International SEO & Forecasting (Geo-targeting, goals, algorithm penalties).
  - `module_08.md`: E-Commerce, Migrations & Local SEO (Mochi case study, migration protocol, local SEO duplicate audit, Anna guest session).
  - `module_09.md`: Generative AI & Autonomous Automation (Babu Chakraborty, Vaibhav Sisinty, Anirudh).
- Automation & Verification: `automation/`
  - `automation/verify_phase1_coverage.py`: Programmatic docx vs. markdown coverage checker.
  - `automation/evaluate_phase1_dossiers.py`: Anti-slop and dossier rubric evaluator.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Lossless Ingestion & Extraction Harness | Scripted extraction of all 1,520 paragraphs and 193,410 words without loss | M1 | Survey |
| 2 | Target Directory & Automation Scaffolding | Create `SEO SOURCE/phase1/` and deploy verification scripts | M1 | Survey |
| 3 | Module 01 Dossier | Ingest 9 videos (42,915 words), diarize speakers, intent deconstruction matrix, elevations | M2 | Survey |
| 4 | Module 02 Dossier | Authoritative record of empty Google Drive folder (12 words, zero hallucinations) | M2 | Survey |
| 5 | Module 03 Dossier | Ingest 6 videos (30,097 words), Pepper Content sessions, keyword research intent matrix | M2 | Survey |
| 6 | Module 04 Dossier | Ingest 7 videos (26,533 words), Screaming Frog, robots.txt, Kaushal Q&A intent matrix | M3 | Survey |
| 7 | Module 05 Dossier | Ingest 5 videos (13,392 words), faceted nav, 578 timestamped sitemap paras, JS SEO | M3 | Survey |
| 8 | Module 06 Dossier | Ingest 5 videos (12,928 words), link fundamentals, 223 backlink subtitle paras, penalties | M3 | Survey |
| 9 | Module 07 Dossier | Ingest 3 videos (13,713 words), international hreflang, forecasting, algorithmic penalties | M4 | Survey |
| 10 | Module 08 Dossier | Ingest 5 videos (20,815 words), e-commerce, migrations, audit of duplicate Lesson 3/4 | M4 | Survey |
| 11 | Module 09 Dossier | Ingest 6 videos (32,969 words), Babu Chakraborty AI evolution, Vaibhav Sisinty ChatGPT/Bard | M4 | Survey |
| 12 | Master Index & Global Topic Catalog | Master catalog at `SEO SOURCE/phase1/index.md` cross-indexing all 46 videos & topics | M5 | Survey |
| 13 | 100% Word Coverage Programmatic Audit | Automated verification confirming >=100% word and paragraph ingestion against docx | M6 | Survey |
| 14 | Anti-Slop Automated Evaluation | 0 banned AI slop words scan across all generated dossiers using Playbook standards | M6 | Survey |
| 15 | Forensic Integrity & Fidelity Audit | Independent verification of zero-external-additions and strict transcript grounding | M6 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Infrastructure & Verification Scaffolding | Create `SEO SOURCE/phase1/`, deploy `automation/verify_phase1_coverage.py` & `automation/evaluate_phase1_dossiers.py` | none | DONE |
| M2 | Foundations & Strategy Dossiers (Mod 01–03) | Generate `module_01.md`, `module_02.md`, `module_03.md` (73,024 words source) | M1 | DONE |
| M3 | Technical SEO & Architecture Dossiers (Mod 04–06) | Generate `module_04.md`, `module_05.md`, `module_06.md` (52,853 words source) | M1 | DONE |
| M4 | Advanced, E-Commerce & AI Dossiers (Mod 07–09) | Generate `module_07.md`, `module_08.md`, `module_09.md` (67,497 words source) | M1 | DONE |
| M5 | Master Catalog & Curriculum Inventory | Generate `SEO SOURCE/phase1/index.md` linking all modules & global taxonomy | M2, M3, M4 | DONE |
| M6 | Automated Verification & Compliance Audit | 100% coverage test, 0-slop evaluation, Challenger stress test & Auditor sign-off | M5 | DONE |

## Interface Contracts
### Extraction Corpus ↔ Module Dossier Builders
- Corpus JSON Format: `module_stats.json` and `all_videos_catalog.json` located in `.agents/teamwork/survey_explorer_docx/`.
- Verbatim Text Source: `python-docx` / XML paragraph texts.
- Output Contract: Markdown dossiers conforming to the 5-section schema defined in `survey_explorer_architecture/handoff.md`.

### Module Dossiers ↔ Master Index (`index.md`)
- Module Relative Links: `[module_01.md](./module_01.md)` through `[module_09.md](./module_09.md)`.
- Reciprocal Links: Every module dossier links back to `[Index](./index.md)`.
- Telemetry Parity: Reported word counts in `index.md` must match source and dossier metrics exactly.

### Dossier Prose ↔ Compliance Evaluator (`evaluate_phase1_dossiers.py`)
- Verbatim Quotations: Enclosed in blockquotes `> "[quote]"` or transcript codeblocks. Allowed to contain historical spoken colloquialisms.
- Analytical Prose: All agent-authored intent deconstructions, alternative execution paths, and elevations MUST contain 0 words from the 105+ banned words list, burstiness $\sigma \ge 8.0$, and adjective density $\le 7.0\%$.
