# Project: Audit and Remediation of Options A to C

## Architecture
- **Option A**: Live AEO Citation Grounding Engine & Reverse-RAG Injection (`automation/aeo_probe/`, `automation/inject_aeo_reverse_rag.py`, tests)
- **Option B**: Live Google Search Console Striking Distance Engine (`automation/gsc_engine/`, CLI drivers, tests)
- **Option C**: Ted Kubaitis Cora SERP Statistical Correlation & Interaction Depth Engine (`automation/cora_engine/`, CLI drivers, tests)
- **Gatekeepers & Invariants**: Schema integrity (`verify_schema_integrity.py`), adversarial defense (`verify_adversarial_defense.py`), 122+ Pytest test suite.

## Feature Inventory
| # | Feature / Scope | Description | Milestone | Source |
|---|-----------------|-------------|-----------|--------|
| 1 | Survey & Audit Option A | Deep architectural & implementation flaw audit of Live AEO Citation Grounding & Reverse-RAG | M0 | ORIGINAL_REQUEST §R1 |
| 2 | Survey & Audit Option B | Deep architectural & implementation flaw audit of GSC Striking Distance Engine | M0 | ORIGINAL_REQUEST §R1 |
| 3 | Survey & Audit Option C | Deep architectural & implementation flaw audit of Ted Kubaitis Cora SERP Engine | M0 | ORIGINAL_REQUEST §R1 |
| 4 | Audit Report & Objective Scoring | Synthesis of findings, rating Option A, B, C out of 10, writing audit_report.md | M0 | ORIGINAL_REQUEST §R1, R2 |
| 5 | Remediation of Option A | Fixing 10 cataloged flaws in Option A (error masking, thundering herd, beta headers, ranking heuristics, schema alignment, etc.) | M1 | ORIGINAL_REQUEST §R3 |
| 6 | Remediation of Option B | Fixing 13 cataloged flaws in Option B (pagination, backoff, opportunity score, regex duplicate DOM cleanup, filler loop, etc.) | M2 | ORIGINAL_REQUEST §R3 |
| 7 | Remediation of Option C | Fixing 16 cataloged flaws in Option C (exact Student's t, BH FDR correction, Visibility Deflator, robust stats, token boundary, .gz/.br sync, etc.) | M3 | ORIGINAL_REQUEST §R3 |
| 8 | Regression Testing & Gatekeeping | Passing all 122 existing tests, new unit/regression tests for fixes, schema & adversarial gates | M4 | ORIGINAL_REQUEST §R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Comprehensive Survey & Audit | Audit Options A, B, C, rate each /10, produce audit_report.md | None | DONE |
| M1 | Option A Remediation | Production-grade fixes and unit tests for Option A flaws A-F1..A-F10 | M0 | IN_PROGRESS |
| M2 | Option B Remediation | Production-grade fixes, duplicate DOM cleanup, and unit tests for Option B flaws B-F1..B-F13 | M0 | IN_PROGRESS |
| M3 | Option C Remediation | Production-grade fixes and unit tests for Option C flaws C-F1..C-F16 | M0 | IN_PROGRESS |
| M4 | Final Gatekeeping & Invariants | 122+ Pytests, new flaw tests, Schema gate (4860 files), Adversarial Defense (6 gates) | M1, M2, M3 | PLANNED |

## Code Layout & Exclusive File Boundaries
- **Worker Option A**:
  - Exclusively owns: `automation/aeo_probe/**`, `automation/inject_aeo_reverse_rag.py`, `automation/test_aeo_probe_engine.py`, `automation/test_aeo_reverse_rag.py`, `automation/test_aeo_flaw_remediations.py`.
- **Worker Option B**:
  - Exclusively owns: `automation/gsc_engine/**`, `automation/gsc_striking_distance_engine.py`, `automation/gsc_live_connector.py`, `automation/gsc_onpage_optimizer.py`, `automation/test_gsc_striking_distance.py`, `automation/test_gsc_flaw_remediations.py`, and duplicate section cleanup in `frontend/dist/solutions/`.
- **Worker Option C**:
  - Exclusively owns: `automation/cora_engine/**`, `automation/cora_serp_correlator.py`, `automation/cora_onpage_tuner.py`, `automation/test_cora_correlator.py`, `automation/test_cora_flaw_remediations.py`.
