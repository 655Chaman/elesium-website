# Dispatch Instructions for Reviewer r2_1 (Gate 2)

## Mission
Quality and correctness review of revised `/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md` (Iteration 2).

## Working Directory
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/

## Mandatory Inputs to Read
1. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
2. /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md
3. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_2/handoff.md

## Review Objectives
1. Verify report completeness across all 4 categories.
2. Verify that the revisions in Sections 6.1, 6.2, 6.3, 6.4, 2.2, 7.2, and 3.3 are accurate, clear, and mathematically aligned.
3. Record your verdict: `APPROVE` or `REQUEST_CHANGES`.

## Output
Write your findings to `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/handoff.md` and notify parent.

## 2026-11-08T05:19:23Z
You are a teamwork_reviewer agent for Gate 2.
Your working directory is: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/

MANDATORY: You MUST read the original request file before starting:
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md

Also read your dispatch file and the revised audit report:
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/DISPATCH.md
- /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_audit_2/handoff.md

Review the revised deliverable for quality, completeness, and accuracy across Technical SEO, Content Architecture, Schema, and AEO.
Record your verdict: Either APPROVE or REQUEST_CHANGES.
Write your report to:
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/handoff.md
When done, notify parent via send_message.


## 2026-11-08T14:14:18Z
You are teamwork_reviewer_r2_1.
Your working directory is `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/`.

You MUST read:
1. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
2. Iteration 1 Reviewer 1 report: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_p2_1_rep/handoff.md`
3. Remediation Worker report: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_p2_remediation/handoff.md`

YOUR MISSION (Iteration 2 Gate Review):
Review the remediated Master Executive Bible (`SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md`), DOCX (`GROWTH_SCALE_EXECUTIVE_BIBLE.docx`), and `index.md`:
1. Verify code fence toggle count across `GROWTH_SCALE_EXECUTIVE_BIBLE.md` (must be exactly 162 toggles - 81 opening, 81 closing, with line 1701 having closing backticks on their own line).
2. Verify line 2384 no longer contains the word "harness" (`Enterprise Screaming Frog Audit Architecture Protocol`).
3. Verify that LaTeX formulas have no literal ASCII tabs (`\t`) or broken carriage return splits (`\r` causing `ight)` / `ight]`).
4. Verify de-slopping of analytical copy (`elevates` -> `strengthens`, `pioneered` -> `established`, `transformations` -> `modifications`, `unlocks` -> `triggers`, `unlocked` -> `produced`, `transformation` -> `restructuring`, `transformed` -> `converted`, `unlocks` -> `generates`).
5. Verify DOCX compilation: inspect `GROWTH_SCALE_EXECUTIVE_BIBLE.docx` to ensure Table 59 contains ONLY the ASCII diagram and does not swallow Heading 5.2 or analytical copy.
6. Run `python3 automation/evaluate_phase2_deliverables.py --file "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md" --verbose` and confirm 100/100 PASS.

Write your review handoff report in `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_r2_1/handoff.md` with explicit `VERDICT: APPROVE` or `VERDICT: REQUEST_CHANGES` and send a completion message to parent.
