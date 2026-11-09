#!/usr/bin/env python3
"""
automation/evaluate_phase1_dossiers.py
=============================================================================
Phase 1 Quality, Anti-Slop, Verification & Evaluator Playbook Engine
Adapted from MASTER_AGENT_PLAYBOOK/13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py
and MASTER_AGENT_PLAYBOOK/04_COPYWRITING_AND_ANTI_AI_SLOP_HUMANIZATION_GUIDE.md.

Specifically designed for Phase 1 Ingestion, Diarization, and Intent Dossiers:
  - Gate D1: Structural Parity & Linking (20 pts)
  - Gate D2: Word & Topic Coverage (20 pts)
  - Gate D3: Anti-AI Slop Purity (25 pts) — 0 Banned AI words from the 105+ list on non-quoted analytical copy
  - Gate D4: Cadence & Humanization Metrics (15 pts) — Burstiness sigma >= 8.0 & Adjective density <= 7.0%
  - Gate D5: Intent Deconstruction Structure & Zero-Hallucinations Check (20 pts)

Usage:
  python3 automation/evaluate_phase1_dossiers.py --file "SEO SOURCE/phase1/module_01.md"
  python3 automation/evaluate_phase1_dossiers.py --all
  python3 automation/evaluate_phase1_dossiers.py --all --verbose
  python3 automation/evaluate_phase1_dossiers.py --all --json
"""

import sys
import os
import re
import math
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set

# Terminal Colors
class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    RED = "\033[91m"
    WHITE = "\033[97m"


# -----------------------------------------------------------------------------
# BANNED AI WORDS & PHRASES DICTIONARY (105+ ENTRIES ACROSS 5 CATEGORIES)
# Grounded in 04_COPYWRITING_AND_ANTI_AI_SLOP_HUMANIZATION_GUIDE.md
# -----------------------------------------------------------------------------
BANNED_AI_WORDS_DICT = {
    "Category 1: Metaphors & Literary Fluff": [
        "delve into", "delve", "tapestry of solutions", "tapestry", "beacon of", "beacon",
        "crucible of", "crucible", "dance of", "symphony of", "symphony", "realm of", "realm",
        "uncharted waters", "north star", "lighthouse", "cornerstone", "bedrock",
        "springboard", "nexus", "digital ecosystem", "labyrinth", "panoply",
        "kaleidoscope", "mirage", "renaissance"
    ],
    "Category 2: Pseudo-Technical Adjectives & Fluff": [
        "seamlessly integrated", "seamlessly", "seamless", "groundbreaking",
        "cutting-edge", "bespoke", "revolutionary", "game-changer", "game-changing",
        "meticulous", "meticulously", "pioneering", "monumental", "testament to", "testament",
        "multifaceted", "paramount", "quintessential", "indispensable", "holistic",
        "robust", "frictionless", "unparalleled", "unrivaled", "unassailable",
        "state-of-the-art", "hyper-scalable", "world-class", "next-generation", "unprecedented"
    ],
    "Category 3: Synthetic Action Verbs & Participles": [
        "revolutionize", "elevate", "unlock", "harness the power of", "harnessing", "harness",
        "foster", "spearhead", "unleash", "unleashing", "embark upon", "embark", "embarks",
        "navigate", "empower", "illuminate", "demystify", "supercharge", "streamline",
        "transform", "transformative", "catalyze", "galvanize", "transcend"
    ],
    "Category 4: Conversational Openers & Corporate Stock Padding": [
        "in today's fast-paced world", "in today's fast-paced digital world", "in today's digital age",
        "in the ever-evolving landscape", "look no further",
        "it's important to remember", "it is worth noting that", "it is worth noting",
        "at the forefront of", "push the envelope", "dive deep into", "dive deep",
        "without further ado", "the holy grail of", "the holy grail",
        "take your business to the next level", "a myriad of", "plethora of",
        "in conclusion", "in summary", "needless to say", "it goes without saying",
        "as an ai language model", "test the waters", "double down on", "par for the course"
    ],
    "Category 5: Sycophantic Hedging, Buzzwords & Empty Wrappers": [
        "paradigm shift", "synergy", "synergies", "disruptive innovation",
        "future-proof", "turnkey solution", "thought leadership", "value proposition",
        "core competency", "mission-critical", "low-hanging fruit", "move the needle",
        "wheelhouse", "boil the ocean", "table stakes", "flywheel effect",
        "bandwidth", "circle back", "touch base", "deep dive", "magic bullet", "silver bullet"
    ],
    "Category 6: Filler Terminology": [
        "sovereign", "deterministic", "catastrophic", "ephemeral", "impenetrable", "synergistic", "vibrant tapestry"
    ]
}

# Flattened list sorted by length descending so longer phrases match first
ALL_BANNED_WORDS = []
for cat_words in BANNED_AI_WORDS_DICT.values():
    ALL_BANNED_WORDS.extend(cat_words)
ALL_BANNED_WORDS = sorted(list(set(ALL_BANNED_WORDS)), key=lambda x: len(x), reverse=True)

# Adjective Suffixes & Exclusions for Cadence Gate
ADJECTIVE_SUFFIXES = ("able", "ible", "al", "ful", "ic", "ive", "less", "ous", "ish")
ADJECTIVE_EXCLUSIONS = {
    "this", "that", "level", "channel", "model", "panel", "signal",
    "protocol", "initial", "terminal", "arrival", "proposal", "interval",
    "alive", "drive", "give", "live", "active", "native", "google", "apple", "canonical"
}

# Expected Baseline Source Word Counts from docx
BASELINE_SOURCE_WORDS = {
    "module_01.md": 42915,
    "module_02.md": 12,
    "module_03.md": 30097,
    "module_04.md": 26533,
    "module_05.md": 13392,
    "module_06.md": 12928,
    "module_07.md": 13713,
    "module_08.md": 20815,
    "module_09.md": 32969,
    "index.md": 1000  # Minimum expected catalog words
}

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_PHASE1_DIR = BASE_DIR / "SEO SOURCE" / "phase1"


# -----------------------------------------------------------------------------
# TEXT EXTRACTION & NON-QUOTED ANALYTICAL COPY ISOLATION
# -----------------------------------------------------------------------------
def isolate_analytical_copy(raw_markdown: str) -> Dict[str, Any]:
    """
    Isolate agent-authored analytical copy from verbatim quotes, codeblocks,
    and verbatim transcript runs.
    
    Verbatim transcript text (which can contain historical spoken colloquialisms)
    is excluded from Gate D3 slop scans and Gate D4 cadence metrics.
    All agent-authored intent deconstructions, alternative execution paths,
    exponential elevations, scopes, and syntheses are included and audited.
    """
    lines = raw_markdown.splitlines()
    analytical_lines: List[Tuple[int, str]] = []  # (line_number, line_text)
    verbatim_lines: List[Tuple[int, str]] = []

    in_codeblock = False
    in_verbatim_section = False

    for idx, line in enumerate(lines, 1):
        stripped = line.strip()

        # Handle codeblocks ```
        if stripped.startswith("```"):
            in_codeblock = not in_codeblock
            continue
        if in_codeblock:
            continue

        # Check section headings for Verbatim sections
        if stripped.startswith("#"):
            lower_heading = stripped.lower()
            if "verbatim transcript" in lower_heading or "verbatim source content" in lower_heading:
                in_verbatim_section = True
            elif stripped.startswith("## ") or stripped.startswith("### ") or (stripped.startswith("#### ") and "verbatim" not in lower_heading):
                in_verbatim_section = False

        if in_verbatim_section:
            verbatim_lines.append((idx, line))
            continue

        # Blockquotes (lines starting with >) are verbatim speaker quotes
        if stripped.startswith(">"):
            verbatim_lines.append((idx, line))
            continue

        # Markdown Table Rows
        # Header format: | Ref ID | Verbatim Transcript Statement | Latent Strategic / Pedagogical Intent | Underlying Algorithmic / Business Mechanic |
        if stripped.startswith("|") and stripped.endswith("|"):
            parts = [p.strip() for p in stripped.split("|")[1:-1]]
            # If this is the intent table row with >= 3 columns
            if len(parts) >= 3 and not parts[0].startswith("---"):
                # Column 0 is Ref ID, Column 1 is Verbatim quote
                # Columns 2+ are analytical copy
                analytical_part = " ".join(parts[2:])
                analytical_lines.append((idx, analytical_part))
                verbatim_lines.append((idx, parts[1]))
                continue
            elif len(parts) >= 2 and (parts[0].lower() in ("ref id", "lesson", "module") or parts[0].startswith("---")):
                # Table header/divider
                continue

        # Standard non-quoted analytical copy
        analytical_lines.append((idx, line))

    analytical_text = "\n".join(text for _, text in analytical_lines)
    return {
        "analytical_lines": analytical_lines,
        "analytical_text": analytical_text,
        "verbatim_lines_count": len(verbatim_lines)
    }


# -----------------------------------------------------------------------------
# GATE D1: STRUCTURAL PARITY & LINKING (20 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_d1(file_path: Path, content: str, phase1_dir: Path) -> Dict[str, Any]:
    """
    Gate D1: Structural Parity & Linking
    - Validates file name pattern (index.md or module_01.md .. module_09.md)
    - Validates H1 Title structure
    - Validates index.md has links to all 9 modules
    - Validates module dossiers have reciprocal link back to index.md
    - Validates heading hierarchy
    """
    score = 20
    status = "PASS"
    reasons: List[str] = []
    fname = file_path.name

    # 1. Heading Hierarchy
    h1_matches = re.findall(r"^#\s+(.+)$", content, re.MULTILINE)
    h2_matches = re.findall(r"^##\s+(.+)$", content, re.MULTILINE)
    h3_matches = re.findall(r"^###\s+(.+)$", content, re.MULTILINE)

    if not h1_matches:
        score -= 8
        reasons.append("Missing H1 document title.")
    elif len(h1_matches) > 1:
        score -= 2
        reasons.append(f"Multiple H1 headings detected ({len(h1_matches)}).")

    if not h2_matches:
        score -= 6
        reasons.append("Missing H2 structural sections.")

    # 2. File-Specific Linking Checks
    if fname == "index.md":
        missing_module_links = []
        for i in range(1, 10):
            mod_link = f"module_{i:02d}.md"
            pattern = rf"\[.*?module_{i:02d}.*?\]\(\./{mod_link}\)|\[.*?module_{i:02d}.*?\]\({mod_link}\)"
            if not re.search(pattern, content, re.IGNORECASE):
                missing_module_links.append(mod_link)

        if missing_module_links:
            deduction = min(10, len(missing_module_links) * 2)
            score -= deduction
            reasons.append(f"index.md is missing links to {len(missing_module_links)} modules: {', '.join(missing_module_links)}")
        else:
            reasons.append("index.md contains verified links to all 9 module dossiers.")
    elif fname.startswith("module_"):
        # Check reciprocal link to index.md
        has_index_link = bool(re.search(r"\[.*?index.*?\]\(\./index\.md\)|\[.*?index.*?\]\(index\.md\)", content, re.IGNORECASE))
        if not has_index_link:
            score -= 6
            reasons.append(f"{fname} is missing reciprocal link to index.md.")
        else:
            reasons.append("Reciprocal link to index.md verified.")

    score = max(0, min(20, score))
    if score >= 18:
        status = "PASS"
    elif score >= 14:
        status = "WARN"
    else:
        status = "FAIL"

    return {
        "gate": "D1_STRUCTURAL_PARITY_AND_LINKING",
        "name": "Structural Parity & Linking",
        "score": score,
        "max_score": 20,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "h1_count": len(h1_matches),
            "h2_count": len(h2_matches),
            "h3_count": len(h3_matches)
        }
    }


# -----------------------------------------------------------------------------
# GATE D2: TRANSCRIPT WORD & TOPIC COVERAGE (20 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_d2(file_path: Path, content: str) -> Dict[str, Any]:
    """
    Gate D2: Transcript Word & Topic Coverage
    - Checks word count of dossier vs. expected docx module word count
    - For module_01 and 03-09: dossier words must exceed source words (expansion ratio >= 1.0x)
    - For module_02: expects verbatim empty folder notice and 10 <= words <= 1,500
    - For index.md: expects comprehensive catalog >= 1,000 words
    """
    score = 20
    status = "PASS"
    reasons: List[str] = []
    fname = file_path.name

    words = len(content.split())
    expected_words = BASELINE_SOURCE_WORDS.get(fname, 1000)

    if fname == "module_02.md":
        empty_notice = "[Empty Folder on Google Drive — 0 Video Files Present]"
        if empty_notice not in content:
            score -= 15
            reasons.append("Module 2 missing required verbatim empty folder notice.")
        if words < 10:
            score -= 5
            reasons.append(f"Module 2 word count too low ({words} words).")
        else:
            reasons.append(f"Module 2 empty source directory recorded faithfully ({words} words).")
    elif fname == "index.md":
        if words < 1000:
            score -= 10
            reasons.append(f"index.md word count below catalog threshold ({words} < 1,000 words).")
        else:
            reasons.append(f"index.md comprehensive catalog size verified ({words:,} words).")
    else:
        # Module dossiers
        ratio = round(words / expected_words, 2) if expected_words > 0 else 1.0
        if words < expected_words:
            deficit = expected_words - words
            score -= 15
            reasons.append(
                f"Word count deficit: dossier has {words:,} words, source transcript requires {expected_words:,} words (missing {deficit:,} words)."
            )
        else:
            reasons.append(
                f"Lossless word coverage confirmed: {words:,} dossier words vs {expected_words:,} source words (expansion ratio: {ratio:.2f}x)."
            )

        # Check for lesson subheadings
        lesson_matches = re.findall(r"^###\s+Lesson\s+\d+", content, re.MULTILINE | re.IGNORECASE)
        if not lesson_matches:
            score -= 5
            reasons.append("No Lesson subheadings (### Lesson X.Y) detected in dossier.")

    score = max(0, min(20, score))
    if score >= 18:
        status = "PASS"
    elif score >= 14:
        status = "WARN"
    else:
        status = "FAIL"

    return {
        "gate": "D2_WORD_AND_TOPIC_COVERAGE",
        "name": "Transcript Word & Topic Coverage",
        "score": score,
        "max_score": 20,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "dossier_words": words,
            "expected_words": expected_words,
            "expansion_ratio": round(words / expected_words, 2) if expected_words > 0 else 1.0
        }
    }


# -----------------------------------------------------------------------------
# GATE D3: ANTI-AI SLOP PURITY (25 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_d3(analytical_lines: List[Tuple[int, str]], analytical_text: str) -> Dict[str, Any]:
    """
    Gate D3: Anti-AI Slop Purity
    Audits all non-quoted analytical copy against the 105+ banned words dictionary.
    Verbatim speaker quotations are exempt from this gate.
    0 Banned words detected = 25 pts (PASS).
    Any hit = FAIL (0 pts).
    """
    findings: List[Dict[str, Any]] = []

    # Track matched spans per line to avoid reporting sub-words of multi-word phrases
    # (e.g. if 'delve into' is detected, do not duplicate report 'delve' on the same span)
    matched_spans_by_line: Dict[int, List[Tuple[int, int]]] = {}

    for phrase in ALL_BANNED_WORDS:
        pattern = re.compile(r"\b" + re.escape(phrase) + r"\b", re.IGNORECASE)
        for line_no, line_text in analytical_lines:
            line_spans = matched_spans_by_line.setdefault(line_no, [])
            for match in pattern.finditer(line_text):
                m_start, m_end = match.start(), match.end()
                # Check if this match overlaps with an already recorded span
                if any(not (m_end <= s_start or m_start >= s_end) for s_start, s_end in line_spans):
                    continue
                line_spans.append((m_start, m_end))

                start_ctx = max(0, m_start - 25)
                end_ctx = min(len(line_text), m_end + 25)
                context = line_text[start_ctx:end_ctx].strip()
                findings.append({
                    "word": phrase,
                    "line": line_no,
                    "context": f"...{context}..."
                })

    # Deduplicate findings by (word, line)
    seen = set()
    unique_findings = []
    for f in findings:
        key = (f["word"].lower(), f["line"])
        if key not in seen:
            seen.add(key)
            unique_findings.append(f)

    if not unique_findings:
        score = 25
        status = "PASS"
        reasons = ["Zero banned AI slop words detected in non-quoted analytical copy!"]
    else:
        score = 0
        status = "FAIL"
        reasons = [
            f"Detected {len(unique_findings)} banned AI word instance(s) in analytical copy. Immediate de-slopping required."
        ]

    return {
        "gate": "D3_ANTI_AI_SLOP_PURITY",
        "name": "Anti-AI Slop Purity (105+ Banned Words)",
        "score": score,
        "max_score": 25,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "banned_words_detected": len(unique_findings),
            "detections": unique_findings[:15]  # Cap to first 15 for output readability
        }
    }


# -----------------------------------------------------------------------------
# GATE D4: CADENCE & HUMANIZATION METRICS (15 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_d4(analytical_text: str) -> Dict[str, Any]:
    """
    Gate D4: Cadence & Humanization Metrics
    - Burstiness: Sentence length standard deviation sigma >= 8.0 (10 pts)
    - Adjective Density: <= 7.0% (5 pts)
    """
    # 1. Clean analytical text from markdown noise
    clean_text = re.sub(r"#+.*", "", analytical_text)
    clean_text = re.sub(r"\[.*?\]\(.*?\)", "", clean_text)
    clean_text = re.sub(r"[*_`|]", "", clean_text)

    # 2. Extract sentences
    raw_sentences = re.split(r"(?<=[.!?])\s+", clean_text)
    sentences = [s.strip() for s in raw_sentences if len(s.strip().split()) >= 3]

    # 3. Extract words
    words = re.findall(r"\b[A-Za-z0-9_\-]+\b", clean_text)

    # Burstiness calculation
    if sentences:
        lengths = [len(s.split()) for s in sentences]
        mean_len = sum(lengths) / len(lengths)
        variance = sum((l - mean_len) ** 2 for l in lengths) / len(lengths)
        std_dev = math.sqrt(variance)
    else:
        mean_len = 0.0
        std_dev = 0.0

    # Adjective Density calculation
    adj_count = 0
    for w in words:
        w_lower = w.lower()
        if w_lower in ADJECTIVE_EXCLUSIONS:
            continue
        if w_lower.endswith(ADJECTIVE_SUFFIXES):
            adj_count += 1
    adj_density = (adj_count / len(words) * 100.0) if words else 0.0

    score = 0
    reasons: List[str] = []

    # Score Burstiness (Max: 10 pts)
    if std_dev >= 8.0:
        score += 10
        reasons.append(f"Burstiness sigma={std_dev:.2f} >= 8.0 (Human Engineering Cadence).")
    elif std_dev >= 6.0:
        score += 6
        reasons.append(f"Burstiness sigma={std_dev:.2f} acceptable but below 8.0 target.")
    else:
        score += 2
        reasons.append(f"Burstiness sigma={std_dev:.2f} < 6.0 (Flag: Uniform AI Cadence).")

    # Score Adjective Density (Max: 5 pts)
    if adj_density <= 7.0:
        score += 5
        reasons.append(f"Adjective density {adj_density:.2f}% <= 7.0% (Lean Engineering Voice).")
    elif adj_density <= 9.0:
        score += 3
        reasons.append(f"Adjective density {adj_density:.2f}% moderate (7.0% - 9.0%).")
    else:
        score += 0
        reasons.append(f"Adjective density {adj_density:.2f}% > 9.0% (Excessive Adjectival Fluff).")

    if score >= 14:
        status = "PASS"
    elif score >= 9:
        status = "WARN"
    else:
        status = "FAIL"

    return {
        "gate": "D4_CADENCE_AND_HUMANIZATION_METRICS",
        "name": "Cadence & Humanization Metrics",
        "score": score,
        "max_score": 15,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "sentence_count": len(sentences),
            "word_count": len(words),
            "mean_sentence_length": round(mean_len, 2),
            "sentence_length_std_dev": round(std_dev, 2),
            "adjective_density_pct": round(adj_density, 2)
        }
    }


# -----------------------------------------------------------------------------
# GATE D5: INTENT DECONSTRUCTION & ZERO-HALLUCINATIONS (20 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_d5(file_path: Path, content: str) -> Dict[str, Any]:
    """
    Gate D5: Intent Deconstruction Structure & Zero-Hallucinations Check
    Verifies mandatory 5-section architecture in dossiers:
      1. Module Metadata & Telemetry
      2. Executive Pedagogical Scope
      3. Diarized Verbatim Transcript & Intent Matrix
      4. Alternative Execution Paths
      5. Exponential Elevation Opportunities & Fidelity Verification
    """
    score = 20
    status = "PASS"
    reasons: List[str] = []
    fname = file_path.name
    lower = content.lower()

    if fname == "module_02.md":
        if "empty source directory record" in lower and "zero-external-additions" in lower:
            reasons.append("Module 2 zero-hallucination invariant documentation verified.")
        else:
            score -= 5
            reasons.append("Module 2 missing explicit Zero-External-Additions invariant notice.")
    elif fname == "index.md":
        required_index_sections = [
            ("Executive Telemetry", "executive telemetry"),
            ("Master Module Registry", "master module registry"),
            ("Global Topic / Inventory", "topic"),
            ("Dependency Graph", "graph"),
            ("Verification Matrix", "verification")
        ]
        for name, kw in required_index_sections:
            if kw not in lower:
                score -= 3
                reasons.append(f"index.md missing section: {name}")
    else:
        # Module Dossier Schema Verification
        required_dossier_sections = [
            ("Metadata & Telemetry", ["metadata", "telemetry"]),
            ("Executive Pedagogical Scope", ["executive pedagogical scope", "pedagogical scope"]),
            ("Intent Deconstruction Matrix", ["intent deconstruction", "intent deconstruction matrix"]),
            ("Alternative Execution Paths", ["alternative execution paths", "execution paths"]),
            ("Exponential Elevation Opportunities", ["exponential elevation", "elevation opportunities"]),
            ("Fidelity & Grounding Verification", ["transcript fidelity", "grounding verification", "zero-external-additions"])
        ]

        for name, keywords in required_dossier_sections:
            if not any(kw in lower for kw in keywords):
                score -= 3
                reasons.append(f"Missing required section: {name}")

        # Check Intent Deconstruction Matrix Table Header
        has_intent_table = bool(re.search(r"\|\s*Ref ID\s*\|\s*Verbatim\s+Transcript.*Intent.*Mechanic", content, re.IGNORECASE))
        if not has_intent_table and "intent deconstruction" in lower:
            # Check for alternative table format
            has_table = "|" in content and "ref id" in lower
            if not has_table:
                score -= 4
                reasons.append("Intent Deconstruction Matrix table missing or malformed.")

    # Zero-Hallucination Disallowed Patterns
    hallucination_patterns = [
        r"\bas an ai language model\b",
        r"\bi do not have access to real-time\b",
        r"\bin this hypothetical scenario\b",
        r"\bexternal syllabus added\b"
    ]
    for pat in hallucination_patterns:
        if re.search(pat, content, re.IGNORECASE):
            score -= 10
            reasons.append(f"Disallowed hallucination or AI disclaimer pattern detected: '{pat}'")

    score = max(0, min(20, score))
    if score >= 18:
        status = "PASS"
    elif score >= 14:
        status = "WARN"
    else:
        status = "FAIL"

    return {
        "gate": "D5_INTENT_DECONSTRUCTION_STRUCTURE",
        "name": "Intent Deconstruction Structure & Grounding",
        "score": score,
        "max_score": 20,
        "status": status,
        "reasons": reasons
    }


# -----------------------------------------------------------------------------
# MAIN EVALUATOR LOGIC
# -----------------------------------------------------------------------------
def evaluate_dossier_file(file_path: Path, phase1_dir: Path) -> Dict[str, Any]:
    """Evaluate a single dossier markdown file against all 5 gates."""
    if not file_path.exists():
        return {
            "file": str(file_path),
            "filename": file_path.name,
            "overall_score": 0,
            "overall_status": "FAIL",
            "error": f"File not found: {file_path}",
            "gates": {}
        }

    raw_content = file_path.read_text(encoding="utf-8")
    isolated = isolate_analytical_copy(raw_content)

    g1 = evaluate_gate_d1(file_path, raw_content, phase1_dir)
    g2 = evaluate_gate_d2(file_path, raw_content)
    g3 = evaluate_gate_d3(isolated["analytical_lines"], isolated["analytical_text"])
    g4 = evaluate_gate_d4(isolated["analytical_text"])
    g5 = evaluate_gate_d5(file_path, raw_content)

    total_score = g1["score"] + g2["score"] + g3["score"] + g4["score"] + g5["score"]

    # Status Calculation:
    # PASS: Total Score >= 85 AND Gate 3 (Slop) passes cleanly with 0 banned words AND all gates >= WARN
    # WARN: Total Score >= 70 AND Gate 3 passes with 0 banned words
    # FAIL: Total Score < 70 OR Gate 3 fails OR any critical failure
    if g3["status"] == "FAIL":
        overall_status = "FAIL"
    elif total_score >= 85 and all(g["status"] in ("PASS", "WARN") for g in [g1, g2, g4, g5]):
        overall_status = "PASS"
    elif total_score >= 70:
        overall_status = "WARN"
    else:
        overall_status = "FAIL"

    return {
        "file": str(file_path),
        "filename": file_path.name,
        "overall_score": total_score,
        "max_score": 100,
        "overall_status": overall_status,
        "gates": {
            "D1": g1,
            "D2": g2,
            "D3": g3,
            "D4": g4,
            "D5": g5
        }
    }


def print_single_file_report(result: Dict[str, Any], verbose: bool = False):
    """Print terminal report for a single evaluated file."""
    fname = result["filename"]
    score = result["overall_score"]
    status = result["overall_status"]
    status_color = Color.GREEN if status == "PASS" else (Color.YELLOW if status == "WARN" else Color.RED)

    print("=" * 80)
    print(f"{Color.BOLD}{Color.CYAN}PHASE 1 DOSSIER QUALITY & COMPLIANCE EVALUATION{Color.RESET}")
    print(f"File: {fname}")
    print("=" * 80)

    if "error" in result:
        print(f"{Color.RED}✖ {result['error']}{Color.RESET}")
        return

    gates = result["gates"]
    for code in ["D1", "D2", "D3", "D4", "D5"]:
        g = gates[code]
        g_stat = g["status"]
        g_color = Color.GREEN if g_stat == "PASS" else (Color.YELLOW if g_stat == "WARN" else Color.RED)
        print(f"\n{Color.BOLD}[{code}] {g['name']}:{Color.RESET} {g_color}{g['score']} / {g['max_score']} pts [{g_stat}]{Color.RESET}")
        for r in g["reasons"]:
            bullet_color = Color.GREEN if g_stat == "PASS" else (Color.YELLOW if g_stat == "WARN" else Color.RED)
            print(f"  {bullet_color}•{Color.RESET} {r}")

        if code == "D3" and g["metrics"]["banned_words_detected"] > 0:
            print(f"    {Color.RED}Banned Detections ({g['metrics']['banned_words_detected']}):{Color.RESET}")
            for d in g["metrics"]["detections"]:
                print(f"      - Line {d['line']}: '{d['word']}' in context: {d['context']}")

        if code == "D4" and verbose:
            m = g["metrics"]
            print(f"    {Color.DIM}Cadence metrics: Burstiness sigma={m['sentence_length_std_dev']}, Adj density={m['adjective_density_pct']}%, Sentences={m['sentence_count']}{Color.RESET}")

    print("\n" + "-" * 80)
    print(f"OVERALL EVALUATION SCORE: {status_color}{Color.BOLD}{score} / 100.0 — {status}{Color.RESET}")
    print("-" * 80)


def print_batch_table(results: List[Dict[str, Any]]):
    """Print tabular evaluation summary across all evaluated files."""
    print("=" * 85)
    print(f"{Color.BOLD}{Color.CYAN}PHASE 1 DOSSIER FLEET AUDIT SUMMARY{Color.RESET}")
    print("=" * 85)
    print(f"{'Filename':<16} | {'D1':<5} | {'D2':<5} | {'D3':<5} | {'D4':<5} | {'D5':<5} | {'Total':<7} | {'Status':<6}")
    print("-" * 85)

    all_pass = True
    for res in results:
        fname = res["filename"]
        if "error" in res:
            print(f"{fname:<16} | {'ERR':<5} | {'ERR':<5} | {'ERR':<5} | {'ERR':<5} | {'ERR':<5} | {0:>5}/100 | {Color.RED}MISSING{Color.RESET}")
            all_pass = False
            continue

        g = res["gates"]
        total = res["overall_score"]
        status = res["overall_status"]
        if status != "PASS":
            all_pass = False
        color = Color.GREEN if status == "PASS" else (Color.YELLOW if status == "WARN" else Color.RED)

        print(
            f"{fname:<16} | "
            f"{g['D1']['score']:>2}/{g['D1']['max_score']:<2} | "
            f"{g['D2']['score']:>2}/{g['D2']['max_score']:<2} | "
            f"{g['D3']['score']:>2}/{g['D3']['max_score']:<2} | "
            f"{g['D4']['score']:>2}/{g['D4']['max_score']:<2} | "
            f"{g['D5']['score']:>2}/{g['D5']['max_score']:<2} | "
            f"{total:>3}/100 | "
            f"{color}{status:<6}{Color.RESET}"
        )

    print("-" * 85)
    summary_color = Color.GREEN if all_pass else Color.RED
    summary_status = "ALL DOSSIERS COMPLIANT" if all_pass else "ACTION REQUIRED (DEFECTS DETECTED)"
    print(f"FLEET STATUS: {summary_color}{Color.BOLD}{summary_status}{Color.RESET}")
    print("=" * 85)


def main():
    parser = argparse.ArgumentParser(
        description="Phase 1 Quality & Anti-Slop Evaluator CLI across 5 adapted gates."
    )
    parser.add_argument(
        "--file",
        type=Path,
        help="Path to a single markdown dossier to evaluate"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Evaluate all dossiers in SEO SOURCE/phase1"
    )
    parser.add_argument(
        "--phase1-dir",
        type=Path,
        default=DEFAULT_PHASE1_DIR,
        help="Path to phase 1 directory"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show line-level detection contexts and cadence breakdown"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit raw machine-readable JSON output"
    )
    parser.add_argument(
        "--allow-missing",
        action="store_true",
        help="Exit with 0 even if files are missing or in-progress"
    )

    args = parser.parse_args()

    phase1_dir = args.phase1_dir

    if args.file:
        result = evaluate_dossier_file(args.file, phase1_dir)
        if args.json:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        else:
            print_single_file_report(result, verbose=args.verbose)

        if result["overall_status"] in ("PASS", "WARN") or args.allow_missing:
            sys.exit(0)
        else:
            sys.exit(1)
    else:
        # Batch audit mode across all phase1 files
        expected_files = ["index.md"] + [f"module_{i:02d}.md" for i in range(1, 10)]
        results = []
        all_passed = True

        for fname in expected_files:
            fpath = phase1_dir / fname
            res = evaluate_dossier_file(fpath, phase1_dir)
            results.append(res)
            if res.get("overall_status") != "PASS" and not args.allow_missing:
                all_passed = False

        if args.json:
            print(json.dumps({"results": results, "all_passed": all_passed}, indent=2, ensure_ascii=False))
        else:
            print_batch_table(results)

        if all_passed or args.allow_missing:
            sys.exit(0)
        else:
            sys.exit(1)


if __name__ == "__main__":
    main()
