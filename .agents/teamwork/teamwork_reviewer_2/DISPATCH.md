# Dispatch Instructions for Reviewer 2

## Mission
Objective review and adversarial verification of the SEO & AEO Brutal Audit Report (`/Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md`) against the codebase.

## Working Directory
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_2/

## Mandatory Inputs to Read
1. /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md
2. /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md
3. Target repository source files cited in the report.

## Review Objectives
1. Verify report completeness across Technical SEO, Content Architecture, Schema, and AEO.
2. Adversarially challenge the findings: Are any claims exaggerated, inaccurate, or unsupported by code?
3. Check the reproduction commands in Section 7 of the report: Do they accurately test the defects?
4. Determine your verdict: `APPROVE` or `REQUEST_CHANGES`.

## Output
Write your findings and verdict to:
`/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_2/handoff.md`
and notify parent via `send_message`.


## 2026-11-08T04:54:54Z
You are a teamwork_reviewer agent.
Your working directory is: /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_2/

MANDATORY: You MUST read the original request file before starting:
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md

Also read your dispatch file and the generated audit report:
- /Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_2/DISPATCH.md
- /Users/krdeeksha/ELESIUM WEBSITE/SEO_AEO_BRUTAL_AUDIT_REPORT.md

Your task is to conduct an adversarial review of the audit report against the codebase.
1. Adversarially challenge the findings: Check whether any claims are exaggerated or unsupported.
2. Check the reproduction commands in Section 7 of the report.
3. Verify that all requirements from ORIGINAL_REQUEST.md are completely satisfied.
4. Record your verdict: Either APPROVE or REQUEST_CHANGES.
Write your review report to:
/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_reviewer_2/handoff.md
When done, notify your parent via send_message with your verdict and summary.
