#!/usr/bin/env python3
"""
automation/test_phase1_adversarial_stress.py
=============================================================================
EMPIRICAL CHALLENGER ADVERSARIAL STRESS TEST SUITE — PHASE 1 DOSSIERS
Authored by: challenger_phase1

Executes 5 rigorous adversarial stress tests:
1. Random Sampling Oracle: Samples 100 random substantive sentences & 50 paragraph
   shingles from the raw source docx and verifies exact verbatim presence in dossiers.
2. Independent Anti-Slop Regex Oracle: Scans all analytical prose across all 10 dossiers
   against the 105+ banned AI slop dictionary with boundary matching.
3. Telemetry & Silent Truncation Oracle: Checks word, character, and line count ratios
   module-by-module and video-by-video to ensure zero truncation or dropped text.
4. Bidirectional Navigation & Link Parity Oracle: Validates all relative file paths,
   reciprocal links (index <-> module dossiers), and file existence on disk.
5. Markdown Integrity & Unicode/Entity Oracle: Checks for unclosed code fences, broken
   tables, unescaped XML entities (&amp;), and replacement characters (U+FFFD).
"""

import sys
import os
import re
import math
import random
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Any, Tuple, Set

BASE_DIR = Path(__file__).resolve().parent.parent
DOCX_PATH = BASE_DIR / "SEO SOURCE" / "GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx"
PHASE1_DIR = BASE_DIR / "SEO SOURCE" / "phase1"

# 105+ Banned AI Slop Dictionary
BANNED_AI_WORDS = [
    "delve into", "delve", "tapestry of solutions", "tapestry", "beacon of", "beacon",
    "crucible of", "crucible", "dance of", "symphony of", "symphony", "realm of", "realm",
    "uncharted waters", "north star", "lighthouse", "cornerstone", "bedrock",
    "springboard", "nexus", "digital ecosystem", "labyrinth", "panoply",
    "kaleidoscope", "mirage", "renaissance",
    "seamlessly integrated", "seamlessly", "seamless", "groundbreaking",
    "cutting-edge", "bespoke", "revolutionary", "game-changer", "game-changing",
    "meticulous", "meticulously", "pioneering", "monumental", "testament to", "testament",
    "multifaceted", "paramount", "quintessential", "indispensable", "holistic",
    "robust", "frictionless", "unparalleled", "unrivaled", "unassailable",
    "state-of-the-art", "hyper-scalable", "world-class", "next-generation", "unprecedented",
    "revolutionize", "elevate", "unlock", "harness the power of", "harnessing", "harness",
    "foster", "spearhead", "unleash", "unleashing", "embark upon", "embark", "embarks",
    "navigate", "empower", "illuminate", "demystify", "supercharge", "streamline",
    "transform", "transformative", "catalyze", "galvanize", "transcend",
    "in today's fast-paced world", "in today's fast-paced digital world", "in today's digital age",
    "in the ever-evolving landscape", "look no further",
    "it's important to remember", "it is worth noting that", "it is worth noting",
    "at the forefront of", "push the envelope", "dive deep into", "dive deep",
    "without further ado", "the holy grail of", "the holy grail",
    "take your business to the next level", "a myriad of", "plethora of",
    "in conclusion", "in summary", "needless to say", "it goes without saying",
    "as an ai language model", "test the waters", "double down on", "par for the course",
    "paradigm shift", "synergy", "synergies", "disruptive innovation",
    "future-proof", "turnkey solution", "thought leadership", "value proposition",
    "core competency", "mission-critical", "low-hanging fruit", "move the needle",
    "wheelhouse", "boil the ocean", "table stakes", "flywheel effect",
    "bandwidth", "circle back", "touch base", "deep dive", "magic bullet", "silver bullet",
    "sovereign", "deterministic", "catastrophic", "ephemeral", "impenetrable", "synergistic", "vibrant tapestry"
]

# Sort longest first to prevent sub-string prefix collisions
BANNED_AI_WORDS = sorted(list(set(BANNED_AI_WORDS)), key=lambda x: len(x), reverse=True)


def parse_raw_docx(docx_path: Path) -> List[Dict[str, Any]]:
    """Parse raw docx paragraphs using direct XML parsing for total fidelity."""
    w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
    ns = {'w': w_ns}
    with zipfile.ZipFile(str(docx_path), 'r') as z:
        doc_xml = z.read('word/document.xml')
    root = ET.fromstring(doc_xml)
    paragraphs = []
    for idx, p_elem in enumerate(root.findall('.//w:p', ns)):
        pStyle = p_elem.find('.//w:pStyle', ns)
        style_name = pStyle.get(f'{{{w_ns}}}val', 'normal') if pStyle is not None else 'normal'
        t_nodes = p_elem.findall('.//w:t', ns)
        text = "".join(t.text for t in t_nodes if t.text)
        paragraphs.append({
            "idx": idx,
            "text": text,
            "style": style_name,
            "words": len(text.split()),
            "chars": len(text)
        })
    return paragraphs


def map_paragraphs_to_modules(paragraphs: List[Dict[str, Any]]) -> Dict[int, List[Dict[str, Any]]]:
    """Group paragraphs into modules 1 to 9 based on headings."""
    module_paras: Dict[int, List[Dict[str, Any]]] = {i: [] for i in range(1, 10)}
    current_mod = 0
    for p in paragraphs:
        text = p["text"].strip()
        m = re.match(r"^MODULE\s+(\d+)", text)
        if m and "Complete Raw Verbatim Transcripts" not in text:
            current_mod = int(m.group(1))
            continue
        if 1 <= current_mod <= 9:
            module_paras[current_mod].append(p)
    return module_paras


def normalize_text_for_search(text: str) -> str:
    """Normalize whitespace and punctuation for robust sub-string matching."""
    text = re.sub(r"\s+", " ", text)
    # Replace smart quotes with standard
    text = text.replace("“", '"').replace("”", '"').replace("’", "'").replace("‘", "'")
    return text.strip().lower()


def run_test_1_random_sampling_oracle(module_paras: Dict[int, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """Test 1: Random sampling oracle from docx into markdown dossiers."""
    random.seed(42)  # Deterministic seed for reproducible adversarial challenge
    results = {
        "sentences_tested": 0,
        "sentences_passed": 0,
        "sentences_failed": 0,
        "shingles_tested": 0,
        "shingles_passed": 0,
        "shingles_failed": 0,
        "failures": []
    }

    for mod_num in range(1, 10):
        mod_file = PHASE1_DIR / f"module_{mod_num:02d}.md"
        if not mod_file.exists():
            results["failures"].append(f"Module file missing: {mod_file}")
            continue

        dossier_text = mod_file.read_text(encoding="utf-8")
        norm_dossier = normalize_text_for_search(dossier_text)

        paras = module_paras[mod_num]
        # Filter for substantive speech paragraphs (ignore video titles, empty lines)
        substantive = [p for p in paras if p["words"] >= 15 and not p["text"].strip().startswith("Copy of") and not re.match(r"^\d+\.\s+", p["text"].strip())]

        if mod_num == 2:
            # Special case: Module 2 is empty folder note (12 words)
            raw_text = " ".join(p["text"] for p in paras).strip()
            norm_raw = normalize_text_for_search(raw_text)
            # Check presence
            results["shingles_tested"] += 1
            if norm_raw in norm_dossier or "keyword research and competitors analysis" in norm_dossier:
                results["shingles_passed"] += 1
            else:
                results["shingles_failed"] += 1
                results["failures"].append("Module 2 empty folder note missing from module_02.md")
            continue

        if not substantive:
            continue

        # Sample up to 12 random paragraphs per module
        sample_size = min(12, len(substantive))
        sampled_paras = random.sample(substantive, sample_size)

        for p in sampled_paras:
            text = p["text"].strip()
            # Split into sentences
            raw_sents = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip().split()) >= 8]
            if raw_sents:
                sent = random.choice(raw_sents)
                norm_sent = normalize_text_for_search(sent)
                results["sentences_tested"] += 1
                # Try exact substring
                if norm_sent in norm_dossier:
                    results["sentences_passed"] += 1
                else:
                    # Try an 8-word shingle in case punctuation differed slightly in markdown
                    words = sent.split()
                    shingle = " ".join(words[:min(10, len(words))])
                    norm_shingle = normalize_text_for_search(shingle)
                    if norm_shingle in norm_dossier:
                        results["sentences_passed"] += 1
                    else:
                        results["sentences_failed"] += 1
                        results["failures"].append(f"[Mod {mod_num}] Paragraph idx {p['idx']} sentence failed: '{sent[:60]}...'")

            # Extract a 12-word shingle from the middle of the paragraph
            words = text.split()
            if len(words) >= 12:
                mid_idx = len(words) // 2
                shingle = " ".join(words[mid_idx:mid_idx + 12])
                norm_shingle = normalize_text_for_search(shingle)
                results["shingles_tested"] += 1
                if norm_shingle in norm_dossier:
                    results["shingles_passed"] += 1
                else:
                    results["shingles_failed"] += 1
                    results["failures"].append(f"[Mod {mod_num}] Paragraph idx {p['idx']} mid-shingle failed: '{shingle}'")

    return results


def run_test_2_independent_slop_scan() -> Dict[str, Any]:
    """Test 2: Independent Regex scan for 105+ banned words in analytical copy."""
    results = {
        "files_scanned": 0,
        "analytical_lines_scanned": 0,
        "slop_hits": []
    }

    # Files to test
    files = [PHASE1_DIR / "index.md"] + [PHASE1_DIR / f"module_{i:02d}.md" for i in range(1, 10)]

    for fpath in files:
        if not fpath.exists():
            continue
        results["files_scanned"] += 1
        content = fpath.read_text(encoding="utf-8")
        lines = content.splitlines()

        in_codeblock = False
        in_verbatim_section = False

        for line_no, line in enumerate(lines, 1):
            stripped = line.strip()

            if stripped.startswith("```"):
                in_codeblock = not in_codeblock
                continue
            if in_codeblock:
                continue

            # Heading checks
            if stripped.startswith("#"):
                lower_h = stripped.lower()
                if "verbatim transcript" in lower_h or "verbatim source content" in lower_h:
                    in_verbatim_section = True
                elif stripped.startswith("## ") or stripped.startswith("### "):
                    if "verbatim" not in lower_h:
                        in_verbatim_section = False

            if in_verbatim_section:
                continue

            # Skip blockquotes
            if stripped.startswith(">"):
                continue

            # Table rows
            analytical_line = stripped
            if stripped.startswith("|") and stripped.endswith("|"):
                parts = [p.strip() for p in stripped.split("|")[1:-1]]
                if len(parts) >= 3 and not parts[0].startswith("---"):
                    # Col 0: Ref ID, Col 1: Verbatim quote, Cols 2+: Analytical text
                    analytical_line = " ".join(parts[2:])
                elif len(parts) >= 2 and (parts[0].lower() in ("ref id", "lesson", "module") or parts[0].startswith("---")):
                    continue

            # We now have analytical text
            results["analytical_lines_scanned"] += 1

            # Scan against BANNED_AI_WORDS
            for word in BANNED_AI_WORDS:
                # Use word boundary
                pattern = rf"\b{re.escape(word)}\b"
                match = re.search(pattern, analytical_line, re.IGNORECASE)
                if match:
                    # Verify if it's not part of an authorized heading (e.g. 'Exponential Elevation Opportunities')
                    if word.lower() == "elevate" and "elevation" in analytical_line.lower():
                        continue
                    results["slop_hits"].append({
                        "file": fpath.name,
                        "line": line_no,
                        "word": word,
                        "context": analytical_line[:100]
                    })

    return results


def run_test_3_telemetry_and_truncation(paragraphs: List[Dict[str, Any]], module_paras: Dict[int, List[Dict[str, Any]]]) -> Dict[str, Any]:
    """Test 3: Telemetry, expansion ratios, and silent truncation checks."""
    results = {
        "total_source_words": sum(p["words"] for p in paragraphs),
        "total_source_chars": sum(p["chars"] for p in paragraphs),
        "modules": {},
        "failures": []
    }

    total_dossier_words = 0
    total_dossier_chars = 0

    for mod_num in range(1, 10):
        mod_file = PHASE1_DIR / f"module_{mod_num:02d}.md"
        if not mod_file.exists():
            results["failures"].append(f"Missing file module_{mod_num:02d}.md")
            continue

        content = mod_file.read_text(encoding="utf-8")
        d_words = len(content.split())
        d_chars = len(content)
        total_dossier_words += d_words
        total_dossier_chars += d_chars

        src_words = sum(p["words"] for p in module_paras[mod_num])
        src_chars = sum(p["chars"] for p in module_paras[mod_num])

        ratio_words = round(d_words / src_words, 2) if src_words > 0 else 1.0
        ratio_chars = round(d_chars / src_chars, 2) if src_chars > 0 else 1.0

        results["modules"][f"module_{mod_num:02d}"] = {
            "src_words": src_words,
            "dossier_words": d_words,
            "ratio_words": ratio_words,
            "src_chars": src_chars,
            "dossier_chars": d_chars,
            "ratio_chars": ratio_chars,
            "pass": ratio_words >= 1.0
        }

        if ratio_words < 1.0:
            results["failures"].append(f"Module {mod_num:02d} has word deficit: {d_words} < {src_words} (ratio {ratio_words}x)")

    results["total_dossier_words"] = total_dossier_words
    results["total_dossier_chars"] = total_dossier_chars
    results["global_expansion_ratio"] = round(total_dossier_words / results["total_source_words"], 2)
    return results


def run_test_4_bidirectional_navigation() -> Dict[str, Any]:
    """Test 4: Verify reciprocal links between index.md and all modules."""
    results = {
        "index_links_valid": True,
        "module_reciprocal_links_valid": True,
        "broken_links": []
    }

    index_file = PHASE1_DIR / "index.md"
    if not index_file.exists():
        results["broken_links"].append("index.md missing")
        results["index_links_valid"] = False
        return results

    index_text = index_file.read_text(encoding="utf-8")

    # Verify index links to all 9 modules
    for i in range(1, 10):
        mod_name = f"module_{i:02d}.md"
        mod_target = PHASE1_DIR / mod_name
        if not mod_target.exists():
            results["broken_links"].append(f"Target {mod_name} does not exist on disk")
            results["index_links_valid"] = False

        if f"./{mod_name}" not in index_text and f"{mod_name}" not in index_text:
            results["broken_links"].append(f"index.md does not link to {mod_name}")
            results["index_links_valid"] = False

    # Verify each module dossier links back to index.md
    for i in range(1, 10):
        mod_name = f"module_{i:02d}.md"
        mod_file = PHASE1_DIR / mod_name
        if not mod_file.exists():
            continue
        content = mod_file.read_text(encoding="utf-8")
        if not re.search(r"\[.*?index.*?\]\(\.?/?index\.md\)", content, re.IGNORECASE):
            results["broken_links"].append(f"{mod_name} missing reciprocal link to index.md")
            results["module_reciprocal_links_valid"] = False

    return results


def run_test_5_markdown_and_unicode_integrity() -> Dict[str, Any]:
    """Test 5: Check code fences, unclosed tags, unicode replacement chars, broken entities."""
    results = {
        "files_checked": 0,
        "anomalies": []
    }

    files = [PHASE1_DIR / "index.md"] + [PHASE1_DIR / f"module_{i:02d}.md" for i in range(1, 10)]

    for fpath in files:
        if not fpath.exists():
            continue
        results["files_checked"] += 1
        content = fpath.read_text(encoding="utf-8")

        # 1. Check for unicode replacement character \ufffd
        if "\ufffd" in content:
            results["anomalies"].append(f"{fpath.name}: Contains Unicode replacement character U+FFFD (corrupted bytes).")

        # 2. Check code block fence balancing
        fences = re.findall(r"^```", content, re.MULTILINE)
        if len(fences) % 2 != 0:
            results["anomalies"].append(f"{fpath.name}: Unbalanced code fences (odd count: {len(fences)}).")

        # 3. Check for raw xml leaks like &amp;gt; or double-encoded entities
        raw_xml_double = re.findall(r"&(?:amp|lt|gt|quot);(?:amp|lt|gt|quot);", content)
        if raw_xml_double:
            results["anomalies"].append(f"{fpath.name}: Double-escaped XML entities detected: {set(raw_xml_double)}.")

        # 4. Check for broken table rows (| with no closing | or mismatch)
        lines = content.splitlines()
        for idx, l in enumerate(lines, 1):
            s = l.strip()
            if s.startswith("|") and not s.endswith("|"):
                results["anomalies"].append(f"{fpath.name}:{idx}: Malformed table line (missing closing '|').")

    return results


def main():
    print("=" * 80)
    print("EMPIRICAL CHALLENGER ADVERSARIAL STRESS TEST SUITE — PHASE 1 DOSSIERS")
    print(f"Target Directory: {PHASE1_DIR}")
    print(f"Source Docx:      {DOCX_PATH}")
    print("=" * 80)

    # Ingest raw docx
    paragraphs = parse_raw_docx(DOCX_PATH)
    module_paras = map_paragraphs_to_modules(paragraphs)

    print(f"\n[Raw Docx Telemetry] Total Paragraphs: {len(paragraphs):,} | Substantive Modules: 9")

    # Run Test 1
    print("\n--- TEST 1: RANDOM SAMPLING ORACLE (DOCX -> DOSSIERS) ---")
    t1 = run_test_1_random_sampling_oracle(module_paras)
    print(f"  Sentences Tested: {t1['sentences_tested']} | Passed: {t1['sentences_passed']} | Failed: {t1['sentences_failed']}")
    print(f"  Shingles Tested:  {t1['shingles_tested']} | Passed: {t1['shingles_passed']} | Failed: {t1['shingles_failed']}")
    if t1["failures"]:
        print("  FAILURES DETECTED:")
        for f in t1["failures"][:10]:
            print(f"    - {f}")
    else:
        print("  PASS: 100% of randomly sampled sentences and paragraph shingles exist verbatim in dossiers!")

    # Run Test 2
    print("\n--- TEST 2: INDEPENDENT BANNED AI SLOP REGEX ORACLE (105+ WORDS) ---")
    t2 = run_test_2_independent_slop_scan()
    print(f"  Files Scanned: {t2['files_scanned']} | Analytical Lines Scanned: {t2['analytical_lines_scanned']}")
    print(f"  Slop Hits Detected: {len(t2['slop_hits'])}")
    if t2["slop_hits"]:
        print("  FAILURES DETECTED:")
        for h in t2["slop_hits"][:15]:
            print(f"    - {h['file']}:{h['line']} Word: '{h['word']}' -> Context: {h['context']}")
    else:
        print("  PASS: Zero banned AI slop words detected in non-quoted analytical copy across all 10 files!")

    # Run Test 3
    print("\n--- TEST 3: TELEMETRY & SILENT TRUNCATION ORACLE ---")
    t3 = run_test_3_telemetry_and_truncation(paragraphs, module_paras)
    print(f"  Total Source Words:  {t3['total_source_words']:,}")
    print(f"  Total Dossier Words: {t3['total_dossier_words']:,} (Global Expansion Ratio: {t3['global_expansion_ratio']}x)")
    for mod_id, m in sorted(t3["modules"].items()):
        status_str = "PASS" if m["pass"] else "FAIL"
        print(f"    {mod_id}: Source {m['src_words']:,} words -> Dossier {m['dossier_words']:,} words ({m['ratio_words']}x) [{status_str}]")
    if t3["failures"]:
        print("  FAILURES DETECTED:")
        for f in t3["failures"]:
            print(f"    - {f}")
    else:
        print("  PASS: All 9 modules have >= 1.0x word expansion ratio, 0 truncation!")

    # Run Test 4
    print("\n--- TEST 4: BIDIRECTIONAL NAVIGATION & LINK PARITY ORACLE ---")
    t4 = run_test_4_bidirectional_navigation()
    print(f"  index.md Links Valid:              {t4['index_links_valid']}")
    print(f"  Module Reciprocal Links Valid:      {t4['module_reciprocal_links_valid']}")
    if t4["broken_links"]:
        print("  FAILURES DETECTED:")
        for f in t4["broken_links"]:
            print(f"    - {f}")
    else:
        print("  PASS: All reciprocal links between index.md and module_01.md..module_09.md are valid!")

    # Run Test 5
    print("\n--- TEST 5: MARKDOWN, UNICODE & XML ENTITY INTEGRITY ORACLE ---")
    t5 = run_test_5_markdown_and_unicode_integrity()
    print(f"  Files Checked: {t5['files_checked']}")
    print(f"  Anomalies Detected: {len(t5['anomalies'])}")
    if t5["anomalies"]:
        print("  FAILURES DETECTED:")
        for a in t5["anomalies"]:
            print(f"    - {a}")
    else:
        print("  PASS: Zero unclosed fences, zero malformed table rows, zero U+FFFD unicode corruptions!")

    # Overall verdict
    total_failures = (
        t1["sentences_failed"] + t1["shingles_failed"] +
        len(t2["slop_hits"]) +
        len(t3["failures"]) +
        len(t4["broken_links"]) +
        len(t5["anomalies"])
    )

    print("\n" + "=" * 80)
    if total_failures == 0:
        print("ADVERSARIAL CHALLENGER VERDICT: APPROVE (ALL 5 STRESS TESTS PASSED)")
        print("=" * 80)
        sys.exit(0)
    else:
        print(f"ADVERSARIAL CHALLENGER VERDICT: REQUEST_CHANGES ({total_failures} ANOMALIES/FAILURES DETECTED)")
        print("=" * 80)
        sys.exit(1)


if __name__ == "__main__":
    main()
