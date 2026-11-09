## 2026-11-08T14:24:05Z
You are teamwork_worker_p2_cadence.
Your working directory is `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_p2_cadence/`.

You MUST read:
1. `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/ORIGINAL_REQUEST.md`
2. Challenger 1 report: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_challenger_r2_1/handoff.md`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

YOUR MISSION (Iteration 3 Cadence Calibration):
Challenger 1 identified that when markdown table rows (`| ... |`) are excluded from sentence splitting, the true prose burstiness in 3 swipe files and SOP 03 falls below $\sigma = 8.0$, and `index.md` has adjective density of 8.36% (> 7.0%).

Execute the following calibration:
1. In `automation/evaluate_phase2_deliverables.py`:
   - In `evaluate_gate_4()` and `isolate_analytical_copy()`: strip markdown table rows (lines that start with `|` and end with `|` or match `^\s*\|.*\|\s*$`) before sentence splitting and adjective counting. This ensures the evaluator evaluates true analytical prose cadence.

2. In `SEO SOURCE/phase2/swipe_file/screaming_frog_extractions.md`:
   - True prose $\sigma$ is currently 3.02. Calibrate the narrative sections (introduction, setup steps, section introductions) by pairing punchy 3-5 word declarative assertions (`"Scale breaks crawlers."`, `"DOM structures deceive."`, `"Attributes hide directives."`, `"XPath guarantees precision."`, `"Verify every crawl."`) with rich 28-35 word technical descriptions. Target: $\sigma \ge 8.3$. Obey $\le 3$ sentences per paragraph!

3. In `SEO SOURCE/phase2/swipe_file/content_prompts_and_qa_rubrics.md`:
   - True prose $\sigma$ is currently 3.83. Calibrate the explanatory text introducing the prompts and rubrics by mixing punchy 3-5 word statements (`"Prompts enforce standards."`, `"Models drift rapidly."`, `"Hallucinations destroy authority."`, `"Rubrics eliminate subjectivity."`) with deep technical explanations. Target: $\sigma \ge 8.3$. Obey $\le 3$ sentences per paragraph!

4. In `SEO SOURCE/phase2/swipe_file/google_sheets_formulas_and_rosae_nlg.md`:
   - True prose $\sigma$ is currently 5.94. Calibrate the explanatory copy around regex formulas and Pug templates by mixing short 3-5 word sentences (`"Formulas automate taxonomy."`, `"RegEx standardizes slugs."`, `"Grammars prevent cannibalization."`) with complex compound sentences. Target: $\sigma \ge 8.3$. Obey $\le 3$ sentences per paragraph!

5. In `SEO SOURCE/phase2/runbooks/SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md`:
   - True prose $\sigma$ is currently 7.90. Add 2-3 short declarative engineering sentences (`"Parameters explode indexes."`, `"Pruning drives recovery."`) paired with analytical sentences to push $\sigma \ge 8.3$. Obey $\le 3$ sentences per paragraph!

6. In `SEO SOURCE/phase2/index.md`:
   - True prose adjective density is currently 8.36%. Replace descriptive adjectives (-able, -ible, -al, -ful, -ic, -ive, -less, -ous) in the narrative text with physical metrics, concrete technical nouns, and active verbs to bring adjective density $\le 6.5\%$ (strictly under 7.0%).

7. Run Challenger 1's exact True Prose Cadence test harness (from Observation 1.3 / Verification Method 1 of `teamwork_challenger_r2_1/handoff.md`):
   Confirm that ALL 11 DELIVERABLES report `PASS` with $\sigma \ge 8.0$ and adjective density $\le 7.0\%$.

8. Run Full Fleet Evaluator:
   `python3 automation/evaluate_phase2_deliverables.py --all --verbose` (must score 100/100 PASS across all 11 assets).

9. Recompute SHA-256 hashes and update Section 5 of `SEO SOURCE/phase2/index.md`.
   Verify 12/12 files match byte-for-byte.

Write your completion report in `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_worker_p2_cadence/handoff.md` and send a completion message to parent.
