# Empirical Challenger Handoff Report: Phase 2 Iteration 2 Cryptographic & Executable Verification

**Date**: 2026-11-08T14:20:00Z  
**Agent**: `teamwork_challenger_r2_2` (Cryptographic & Executable Asset Challenger)  
**Parent Agent**: `f8356640-54a6-460f-88a5-0904841336bb`  
**Working Directory**: `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/teamwork_challenger_r2_2/`  
**Verdict**: `VERDICT: APPROVE`

---

## 1. Observation

Direct empirical observations, terminal executions, binary inspections, and structural verifications recorded across all Phase 2 deliverables:

### Observation 1.1: Deterministic DOCX Compilation & Binary Parity
- **Compiler Script**: `automation/compile_executive_bible_docx.py`
- **Source Markdown**: `SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md`
- **Output Targets**: `/tmp/t1.docx`, `/tmp/t2.docx` (compiled 2 seconds apart), and committed disk file `SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.docx`.
- **Command & Output**:
  ```bash
  python3 automation/compile_executive_bible_docx.py --input "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md" --output "/tmp/t1.docx"
  python3 automation/compile_executive_bible_docx.py --input "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md" --output "/tmp/t2.docx"
  ```
  Both commands exited with returncode `0`, logging:
  ```text
  COMPILATION SUCCESS: Document generated at /private/tmp/t1.docx (116,752 bytes)
  COMPILATION SUCCESS: Document generated at /private/tmp/t2.docx (116,752 bytes)
  ```
- **Cryptographic Binary Checksum Comparison**:
  * `/tmp/t1.docx` SHA-256: `cb55b5e04b35675a161e67827754768478b0913d09b10436e8b87e127d82da1a` (116,752 bytes)
  * `/tmp/t2.docx` SHA-256: `cb55b5e04b35675a161e67827754768478b0913d09b10436e8b87e127d82da1a` (116,752 bytes)
  * Committed Disk File SHA-256: `cb55b5e04b35675a161e67827754768478b0913d09b10436e8b87e127d82da1a` (116,752 bytes)
  * Result: **100.0% IDENTICAL BINARY CHECKSUM** across independent compilations and committed disk binary.
- **Zip Container Inspection**:
  * Unpacked `/tmp/t1.docx` container: exactly 19 internal XML files.
  * Internal timestamps: all 19 entries explicitly normalized to `date_time = (2026, 1, 1, 0, 0, 0)`.
  * Permissions: normalized to `0o644 << 16`.
  * File ordering: sorted alphabetically (`[Content_Types].xml`, `_rels/.rels`, `customXml/...`, `word/...`).
- **DOCX Layout & Heading Isolation Verification**:
  * Total Paragraphs: 802.
  * Total Tables: 84.
  * Table 59 Isolation: Table 59 strictly contains the ASCII pyramid diagram. The analytical sections (`5.2 Bottom-Up Task Impact Forecasting Model`, Outcome Goals, Performance Goals, Process Goals, and LaTeX formulas) are rendered as standard document body headings and paragraphs, completely free of table confinement.

---

### Observation 1.2: Screaming Frog XPath & Regex Executable Stress Testing
Target File: `SEO SOURCE/phase2/swipe_file/screaming_frog_extractions.md`

#### 1. Pattern `EXT-03` (`(//h1)[1]`)
- **Expression in Table 2 (line 38)**: `(//h1)[1]`
- **Expression in Section 3 (line 116)**: `(//h1)[1]`
- **Empirical Execution against Documented Sample**:
  * HTML: `<main><div class="product-header"><h1 class="title font-bold">Industrial Air Compressor 500L</h1></div></main>`
  * Result: `['Industrial Air Compressor 500L']` (Exact match against documented expected output).
- **Adversarial Stress Test (Multi-Container DOM)**:
  * HTML: `<body><div><h1>First Container H1</h1></div><section><h1>Second Container H1</h1></section><aside><h1>Third Container H1</h1></aside></body>`
  * Buggy `//h1[1]` result: `['First Container H1', 'Second Container H1', 'Third Container H1']` (FAILED — returns 3 elements because each is the 1st child of its parent).
  * Remediated `(//h1)[1]` result: `['First Container H1']` (PASSED — correctly extracts only the single global document title).
- **Adversarial Stress Test (Empty DOM)**:
  * HTML: `<div><p>No h1 present</p></div>`
  * Result: `[]` (Clean empty list, zero exception).

#### 2. Pattern `EXT-04` (`(//h1)[position() > 1]`)
- **Expression in Table 2 (line 39)**: `(//h1)[position() > 1]`
- **Expression in Section 3 (line 142)**: `(//h1)[position() > 1]`
- **Empirical Execution against Documented Sample**:
  * HTML (lines 147–154):
    ```html
    <body>
      <h1>Main Catalog Title</h1>
      <section>
        <h1>Sidebar Recommended Products</h1>
      </section>
    </body>
    ```
  * Buggy `//h1[position() > 1]` result: `[]` (EMPTY SET — failed because sidebar H1 is child #1 of `<section>`).
  * Remediated `(//h1)[position() > 1]` result: `['Sidebar Recommended Products']` (Exact match against documented expected output).
- **Adversarial Stress Test (Deeply Nested Multi-Container DOM with 4 H1s)**:
  * HTML:
    ```html
    <main>
      <div><h1>Global Primary Title</h1></div>
      <section><article><div><h1>Deeply Nested Leak 1</h1></div></article></section>
      <aside><span><h1>Deeply Nested Leak 2</h1></span></aside>
      <footer><h1>Footer H1 Leak 3</h1></footer>
    </main>
    ```
  * Buggy `//h1[position() > 1]` result: `[]` (FAILED — missed all 3 leaks).
  * Remediated `(//h1)[position() > 1]` result: `['Deeply Nested Leak 1', 'Deeply Nested Leak 2', 'Footer H1 Leak 3']` (PASSED — caught all secondary H1 tags regardless of nesting depth).

#### 3. Pattern `EXT-12` (`href=["']([^"']*\?(?:[^"']*&)?(?:utm_[a-z]+|fbclid)=[^"']*)["']`)
- **Expression in Table 2 (line 47)**: `href=["']([^"']*\?(?:[^"']*&)?(?:utm_[a-z]+|fbclid)=[^"']*)["']`
- **Expression in Section 6 (line 357)**: `href=["']([^"']*\?(?:[^"']*&)?(?:utm_[a-z]+|fbclid)=[^"']*)["']`
- **Reconciliation Status**: 100% reconciled. Both Table 2 and Section 6 contain Group 1 capturing parentheses.
- **Empirical Execution against Documented Sample**:
  * HTML (lines 362–366):
    ```html
    <footer>
      <a href="/promotions/winter-sale?utm_source=internal_nav&utm_medium=footer">Winter Sale</a>
    </footer>
    ```
  * Match Result: `re.search(...).group(1)` extracts `/promotions/winter-sale?utm_source=internal_nav&utm_medium=footer` (Exact match against documented expected output).
- **Adversarial Stress Testing**:
  * Parameter variations: `<a href="/product/123?fbclid=xyz987">Buy</a>` -> Group 1 captures `/product/123?fbclid=xyz987`.
  * Multi-param leading: `<a href="/search?category=shoes&utm_campaign=spring">Search</a>` -> Group 1 captures `/search?category=shoes&utm_campaign=spring`.
  * Negative test (clean URL): `<a href="/promotions/winter-sale?category=shoes&sort=asc">Sale</a>` -> Returns `None` (Zero false positives).

---

### Observation 1.3: Google Sheets Formula `GS-04` Reconciliation & Execution
Target File: `SEO SOURCE/phase2/swipe_file/google_sheets_formulas_and_rosae_nlg.md`

- **Expression in Table 2 (line 36)**:
  `=LOWER(REGEXREPLACE(REGEXREPLACE(TRIM(A2), "[^a-zA-Z0-9\s-]", ""), "\s+", "-"))`
- **Expression in Section 3 (line 123)**:
  `=LOWER(REGEXREPLACE(REGEXREPLACE(TRIM(A2), "[^a-zA-Z0-9\s-]", ""), "\s+", "-"))`
- **Reconciliation Status**: 100% identical and reconciled between summary table and specification section.
- **Empirical Execution against Documented Sample**:
  * Input A2: `Men's Lightweight Trail-Running Shoes (2026 Edition)!`
  * Execution:
    1. `TRIM(A2)` -> `"Men's Lightweight Trail-Running Shoes (2026 Edition)!"`
    2. `REGEXREPLACE(..., "[^a-zA-Z0-9\s-]", "")` -> `"Mens Lightweight Trail-Running Shoes 2026 Edition"` (Apostrophes, parentheses, and exclamation marks stripped cleanly).
    3. `REGEXREPLACE(..., "\s+", "-")` -> `"Mens-Lightweight-Trail-Running-Shoes-2026-Edition"`
    4. `LOWER(...)` -> `"mens-lightweight-trail-running-shoes-2026-edition"`
  * Actual Result: `mens-lightweight-trail-running-shoes-2026-edition` (Exact match against documented expected output).
- **Adversarial Stress Testing**:
  * Multiple spaces: `"Multiple    consecutive     spaces"` -> `"multiple-consecutive-spaces"`
  * Special characters: `"Special @#$%^&* Characters"` -> `"special-characters"`
  * Leading/trailing whitespace: `"   Leading and trailing spaces   "` -> `"leading-and-trailing-spaces"`
  * Numbers & punctuation: `"Mixed 123 Numbers & Symbols #1!"` -> `"mixed-123-numbers-symbols-1"`
  * Result: 100% PASS across all edge cases.

---

### Observation 1.4: Cryptographic Checksum Table Parity (All 12 Assets)
Target File: `SEO SOURCE/phase2/index.md` (Section 5, lines 230–243)

Every asset was read directly from disk and evaluated against Section 5 table:

| Asset Relative Path | Table Stated Size | Actual Disk Size | Table Stated SHA-256 Checksum | Actual Computed SHA-256 Checksum | Parity Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GROWTH_SCALE_EXECUTIVE_BIBLE.md` | 214,845 B | 214,845 B | `248ad94ec872c0558ba898d12a979c09fe7445a6b3f3c05d2d08a7ff40cd62f6` | `248ad94ec872c0558ba898d12a979c09fe7445a6b3f3c05d2d08a7ff40cd62f6` | **MATCH** |
| `GROWTH_SCALE_EXECUTIVE_BIBLE.docx` | 116,752 B | 116,752 B | `cb55b5e04b35675a161e67827754768478b0913d09b10436e8b87e127d82da1a` | `cb55b5e04b35675a161e67827754768478b0913d09b10436e8b87e127d82da1a` | **MATCH** |
| `runbooks/SOP_01_PROGRAMMATIC_TAXONOMY_DEPLOYMENT.md` | 17,663 B | 17,663 B | `94147bf93aaa71e2285f65a6dd1b02ee3d357f49da391e6cc8636551f2b3f7f1` | `94147bf93aaa71e2285f65a6dd1b02ee3d357f49da391e6cc8636551f2b3f7f1` | **MATCH** |
| `runbooks/SOP_02_ENTERPRISE_SCREAMING_FROG_AUDIT_HARNESS.md` | 20,302 B | 20,302 B | `abf29349baf8d24e4c242334af168c4153dcdeac1a801f2ae9a4e9e40f1e041f` | `abf29349baf8d24e4c242334af168c4153dcdeac1a801f2ae9a4e9e40f1e041f` | **MATCH** |
| `runbooks/SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md` | 20,308 B | 20,308 B | `17a4d7127670134d49913e3e9e6db7c2fad8f686557ed66cf6d0b6d2aa429a83` | `17a4d7127670134d49913e3e9e6db7c2fad8f686557ed66cf6d0b6d2aa429a83` | **MATCH** |
| `runbooks/SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md` | 15,137 B | 15,137 B | `825b0d1d9e010808fcf7f543890c84456417e54a31f61d23f59e03cbd79db2a1` | `825b0d1d9e010808fcf7f543890c84456417e54a31f61d23f59e03cbd79db2a1` | **MATCH** |
| `runbooks/SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md` | 18,020 B | 18,020 B | `c9e9e5b08670c219ba31873a5d94da1377bf14ecb91df2367e01eac63d853cc6` | `c9e9e5b08670c219ba31873a5d94da1377bf14ecb91df2367e01eac63d853cc6` | **MATCH** |
| `runbooks/SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md` | 18,942 B | 18,942 B | `1f0752ebedc02b87075063302e325149431d03f72a2b527cd278e00ea1fcaf4b` | `1f0752ebedc02b87075063302e325149431d03f72a2b527cd278e00ea1fcaf4b` | **MATCH** |
| `swipe_file/screaming_frog_extractions.md` | 15,507 B | 15,507 B | `3067f68548ccdc352ea1db0697c1e5b3296cbcfaf5f2828b239041caad5639d1` | `3067f68548ccdc352ea1db0697c1e5b3296cbcfaf5f2828b239041caad5639d1` | **MATCH** |
| `swipe_file/google_sheets_formulas_and_rosae_nlg.md` | 16,151 B | 16,151 B | `f507818ca23d261f079ccbd130fabe11200050975707271e65fbeddacab68352` | `f507818ca23d261f079ccbd130fabe11200050975707271e65fbeddacab68352` | **MATCH** |
| `swipe_file/content_prompts_and_qa_rubrics.md` | 16,079 B | 16,079 B | `cb72cc4eb8c60cd2f2227876703ff5ac8c642e27e36dcfcf3000c0e44accbae0` | `cb72cc4eb8c60cd2f2227876703ff5ac8c642e27e36dcfcf3000c0e44accbae0` | **MATCH** |
| `swipe_file/GOOGLE_DISAVOW_TEMPLATE.txt` | 5,684 B | 5,684 B | `b5041b0ef4eba450cb260f71c1886e7cc399b79e61a3294b4b4f8a42bb1e1eaa` | `b5041b0ef4eba450cb260f71c1886e7cc399b79e61a3294b4b4f8a42bb1e1eaa` | **MATCH** |

- **Line 277 Verification Example**: Line 277 of `SEO SOURCE/phase2/index.md` cites `248ad94ec872c0558ba898d12a979c09fe7445a6b3f3c05d2d08a7ff40cd62f6`, exactly matching the Bible SHA-256.
- **Directory Hygiene**: Exactly 13 files exist under `SEO SOURCE/phase2/` (the 12 deliverable files plus `index.md`). The intermediate files `bible_vol_1_3.md` and `bible_vol_4_6.md` have been cleanly expunged. Zero unindexed or orphaned files exist.

---

### Observation 1.5: Adversarial File Syntax & Fleet-Wide Quality Audit
1. **Google Disavow Syntax (`GOOGLE_DISAVOW_TEMPLATE.txt`)**:
   - Total lines: 98 (68 explanatory comments prefixed with `#`, 18 domain directives, 3 URL directives).
   - Domain directives: Exactly 18 directives formatted as `domain:<hostname>`. Zero protocols (`http://` or `https://`), zero trailing slashes, zero port numbers. Zero duplicate domains.
   - URL directives: Exactly 3 full URL directives with valid `http://` or `https://`. Zero duplicate URLs.
   - Google Search Console specification adherence: **100% compliant**.
2. **Code Fence & Mathematical Syntax (`GROWTH_SCALE_EXECUTIVE_BIBLE.md`)**:
   - Total code fences: exactly 162 backtick fences (81 opening, 81 closing), 100% balanced.
   - Mathematical equations: 0 raw tab characters (`\t`), 0 split `ight)` / `ight]` strings. All formulas render with complete `\left( ... \right)` balancing.
3. **Automated Fleet Evaluator Execution**:
   - Command: `python3 automation/evaluate_phase2_deliverables.py --all --verbose`
   - Overall Result: **11/11 indexed assets scored 100/100 points (Total Fleet Score: 1,100 / 1,100, 100% PASS)**.
   - 0 banned words, 0 masked code fences, 0 micro-paragraph breaches, burstiness $\sigma \ge 8.0$, adjective density $\le 7.0\%$.

---

## 2. Logic Chain

1. **Premise 1 (Binary Determinism)**: A build artifact is deterministic if and only if independent compilations from the same source generate byte-for-byte identical binary output across distinct execution timestamps.
   - *Observation*: Compiling `GROWTH_SCALE_EXECUTIVE_BIBLE.md` to `/tmp/t1.docx` and `/tmp/t2.docx` at distinct timestamps produced identical SHA-256 hashes (`cb55b5e04b...`) and identical sizes (116,752 bytes), perfectly matching the committed file on disk (Observation 1.1).
   - *Inference*: Timestamp normalization in `compile_executive_bible_docx.py` guarantees permanent build determinism.

2. **Premise 2 (Executable Pattern Correctness)**: A documented extraction pattern must execute validly against both documented sample fixtures and arbitrary nested DOM structures.
   - *Observation*: `(//h1)[position() > 1]` catches all secondary H1 tags regardless of whether they share a common parent or reside in distinct containers, whereas `//h1[position() > 1]` fails on multi-container DOMs (Observation 1.2). Similarly, `(//h1)[1]` isolates the first document-level title without leaking siblings. `EXT-12` capturing group extracts internal tracking parameters without false-matching clean query strings.
   - *Inference*: The extraction patterns are verified as structurally sound and production-ready for Screaming Frog crawler deployments.

3. **Premise 3 (Formula Consistency)**: A data transformation formula documented in an inventory table must match the specification section and produce the documented expected output.
   - *Observation*: `GS-04` in Table 2 matches Section 3 verbatim, and testing the two-stage regex logic against the documented input produced `mens-lightweight-trail-running-shoes-2026-edition` and passed 6 edge-case stress tests (Observation 1.3).
   - *Inference*: `GS-04` formula is verified and reconciled.

4. **Premise 4 (Cryptographic Parity)**: The published checksum registry in `index.md` Section 5 must match the filesystem down to the byte for every production asset.
   - *Observation*: Computing SHA-256 and byte sizes for all 12 assets on disk yields a 100% (12/12) match against the committed table (Observation 1.4).
   - *Inference*: The Phase 2 deliverable suite is cryptographically verified and authentic.

---

## 3. Caveats

- **No Caveats**: Every test required by the mission and every issue flagged in Iteration 1 has been directly reproduced, evaluated, and empirically verified using independent scripts and terminal executions.

---

## 4. Adversarial Review & Challenge Summary

**Overall Risk Assessment**: **LOW / ZERO DEFECTS**

### Challenges Tested
1. **Challenge 1 (DOCX Binary Drift)**:
   - *Assumption*: Binary packaging introduces non-deterministic timestamp variation.
   - *Attack*: Compiled twice with arbitrary delay and compared binary hashes.
   - *Result*: PASSED. Zip entry normalization enforces static timestamp `(2026, 1, 1, 0, 0, 0)`, eliminating drift.
2. **Challenge 2 (XPath Context Trapping)**:
   - *Assumption*: XPath selectors written without grouping parentheses fail on multi-container DOMs.
   - *Attack*: Injected adversarial HTML with nested `<section>`, `<article>`, `<aside>`, and `<footer>` containers.
   - *Result*: PASSED. Grouped expressions `(//h1)[1]` and `(//h1)[position() > 1]` isolate global nodes accurately.
3. **Challenge 3 (Regex False Positives & Capture Failures)**:
   - *Assumption*: `EXT-12` regex might falsely match clean query parameters or fail to capture the query URL.
   - *Attack*: Tested against clean parameters (`?sort=asc`), leading non-tracking parameters (`?category=shoes&utm_campaign=spring`), and single tracking tokens.
   - *Result*: PASSED. Captured group 1 cleanly, zero false positives on clean URLs.
4. **Challenge 4 (Google Sheets Formula Degradation)**:
   - *Assumption*: Single-pass regex fails to strip punctuation or creates consecutive hyphens.
   - *Attack*: Tested arbitrary punctuation (`@#$%^&*`), consecutive spaces, and trailing whitespace.
   - *Result*: PASSED. Two-stage regex cleanly produces URL-safe slugs.

### Stress Test Results Matrix

| Scenario / Test | Expected Behavior | Actual Behavior | Result |
| :--- | :--- | :--- | :--- |
| Independent DOCX compilation | SHA-256(`/tmp/t1.docx`) == SHA-256(`/tmp/t2.docx`) | `cb55b5e04b...` == `cb55b5e04b...` | **PASS** |
| Committed DOCX parity | SHA-256(Disk DOCX) == SHA-256(Compiled) | `cb55b5e04b...` == `cb55b5e04b...` | **PASS** |
| `EXT-03` on multi-container DOM | Returns only 1st global H1 | Returns `['First Container H1']` | **PASS** |
| `EXT-04` on multi-container DOM | Returns all secondary H1s | Returns `['Sidebar Recommended Products']` | **PASS** |
| `EXT-04` on adversarial 4-container DOM | Returns 3 nested H1 leaks | Returns all 3 leaks across containers | **PASS** |
| `EXT-12` capturing group 1 | Extracts full URL with tracking parameters | Extracts `/promotions/winter-sale?...` | **PASS** |
| `GS-04` hyphenated slug building | Strips punctuation, hyphens spaces | Produces `mens-lightweight-trail-running-shoes-2026-edition` | **PASS** |
| 12/12 SHA-256 table reconciliation | 100% byte & hash match in `index.md` | 12/12 matched byte-for-byte | **PASS** |
| Disavow syntax validation | 0 syntax errors, valid directives | 18 domains, 3 URLs, 0 errors | **PASS** |
| Fleet automated evaluation | 100/100 points across all 11 assets | 11/11 scored 100/100 (1,100/1,100 total) | **PASS** |

---

## 5. Conclusion

### **VERDICT: APPROVE**

The Phase 2 deliverables have successfully passed all empirical cryptographic, executable, structural, and quality gates:
1. `GROWTH_SCALE_EXECUTIVE_BIBLE.docx` compiles 100% deterministically and matches disk byte-for-byte.
2. `EXT-03`, `EXT-04`, and `EXT-12` XPath/Regex extractions are verified across complex and adversarial HTML DOM fixtures.
3. Google Sheets formula `GS-04` is reconciled and mathematically validated across sample inputs and edge cases.
4. All 12 production assets match Section 5 table in `SEO SOURCE/phase2/index.md` byte-for-byte.
5. Fleet automated evaluation achieves a flawless 1,100 / 1,100 (100% PASS).

The deliverables are authenticated, pristine, and ready for production deployment.

---

## 6. Verification Method

To independently reproduce and verify this report, execute the following commands from the workspace root:

```bash
# 1. Verify deterministic DOCX compilation
python3 -c '
import subprocess, hashlib, time
from pathlib import Path
p1, p2, p_disk = Path("/tmp/t1.docx"), Path("/tmp/t2.docx"), Path("SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.docx")
subprocess.run(["python3", "automation/compile_executive_bible_docx.py", "--input", "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md", "--output", str(p1)], check=True)
time.sleep(1)
subprocess.run(["python3", "automation/compile_executive_bible_docx.py", "--input", "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md", "--output", str(p2)], check=True)
h1, h2, hd = hashlib.sha256(p1.read_bytes()).hexdigest(), hashlib.sha256(p2.read_bytes()).hexdigest(), hashlib.sha256(p_disk.read_bytes()).hexdigest()
assert h1 == h2 == hd, f"Mismatch: {h1} vs {h2} vs {hd}"
print("VERIFIED DETERMINISTIC DOCX COMPILATION:", h1)
'

# 2. Verify XPath EXT-03, EXT-04, and Regex EXT-12
python3 -c '
from lxml import html
import re
tree = html.fromstring("<body><h1>Main</h1><section><h1>Sidebar</h1></section></body>")
assert [e.text_content().strip() for e in tree.xpath("(//h1)[1]")] == ["Main"]
assert [e.text_content().strip() for e in tree.xpath("(//h1)[position() > 1]")] == ["Sidebar"]
m = re.search(r"href=[\"\']([^\"\']*\?(?:[^\"\']*&)?(?:utm_[a-z]+|fbclid)=[^\"\']*)[\"\']", "<a href=\"/sale?utm_source=nav\">Link</a>")
assert m.group(1) == "/sale?utm_source=nav"
print("VERIFIED EXT-03, EXT-04, AND EXT-12 EXECUTION!")
'

# 3. Verify Google Sheets GS-04 formula
python3 -c '
import re
sample = "Men\x27s Lightweight Trail-Running Shoes (2026 Edition)!"
res = re.sub(r"\s+", "-", re.sub(r"[^a-zA-Z0-9\s-]", "", sample.strip())).lower()
assert res == "mens-lightweight-trail-running-shoes-2026-edition"
print("VERIFIED GS-04 FORMULA:", res)
'

# 4. Verify all 12 assets against Section 5 table in index.md
python3 -c '
import hashlib, re
from pathlib import Path
index_text = Path("SEO SOURCE/phase2/index.md").read_text()
for rel, h, sz in re.findall(r"\|\s*`([^`]+)`\s*\|\s*`([a-f0-9]{64})`\s*\|\s*([0-9,]+)\s*B\s*\|", index_text):
    data = (Path("SEO SOURCE/phase2") / rel).read_bytes()
    assert hashlib.sha256(data).hexdigest() == h, f"Hash mismatch for {rel}"
    assert len(data) == int(sz.replace(",", "")), f"Size mismatch for {rel}"
print("VERIFIED ALL 12 ASSETS MATCH INDEX.MD BYTE-FOR-BYTE!")
'

# 5. Run full fleet automated evaluator
python3 automation/evaluate_phase2_deliverables.py --all --verbose
```
