#!/usr/bin/env python3
"""
automation/evaluate_phase2_deliverables.py
=============================================================================
Phase 2 Quality, Anti-AI Slop, Verification & Compliance Evaluator Engine
Specifically designed for Phase 2 Semantic Synthesis, Framework Distillation
and High-Leverage Asset Generation deliverables:
  - Gate 1: Asset Parity & Reciprocal Linking (20 pts)
  - Gate 2: Volume Depth & Word Count Minimums (20 pts)
  - Gate 3: Anti-AI Slop Purity (25 pts) — 0 Banned AI words from 105+ list on non-quoted analytical copy
  - Gate 4: Cadence & Humanization Metrics (15 pts) — Burstiness sigma >= 8.0 & Adjective density <= 7.0%
  - Gate 5: Transcript Fidelity & Lineage Matrix (20 pts) — Direct grounding in Phase 1 modules & 0 hallucinations

Usage:
  python3 automation/evaluate_phase2_deliverables.py --file "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md"
  python3 automation/evaluate_phase2_deliverables.py --all
  python3 automation/evaluate_phase2_deliverables.py --all --verbose
  python3 automation/evaluate_phase2_deliverables.py --all --json
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
# BANNED AI WORDS & PHRASES DICTIONARY (105+ ENTRIES ACROSS 6 CATEGORIES)
# Grounded in MASTER_AGENT_PLAYBOOK/04_COPYWRITING_AND_ANTI_AI_SLOP_HUMANIZATION_GUIDE.md
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

# Expected Minimum Word Counts for Phase 2 Assets
EXPECTED_PHASE2_MIN_WORDS = {
    "GROWTH_SCALE_EXECUTIVE_BIBLE.md": 15000,
    "SOP_01_PROGRAMMATIC_TAXONOMY_DEPLOYMENT.md": 1800,
    "SOP_02_ENTERPRISE_SCREAMING_FROG_AUDIT_HARNESS.md": 1800,
    "SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md": 1800,
    "SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md": 1800,
    "SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md": 1800,
    "SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md": 1800,
    "screaming_frog_extractions.md": 800,
    "google_sheets_formulas_and_rosae_nlg.md": 800,
    "content_prompts_and_qa_rubrics.md": 800,
    "index.md": 2000
}

# Canonical Phase 2 Deliverable Relative Paths
EXPECTED_PHASE2_FILES = [
    "index.md",
    "GROWTH_SCALE_EXECUTIVE_BIBLE.md",
    "runbooks/SOP_01_PROGRAMMATIC_TAXONOMY_DEPLOYMENT.md",
    "runbooks/SOP_02_ENTERPRISE_SCREAMING_FROG_AUDIT_HARNESS.md",
    "runbooks/SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md",
    "runbooks/SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md",
    "runbooks/SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md",
    "runbooks/SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md",
    "swipe_file/screaming_frog_extractions.md",
    "swipe_file/google_sheets_formulas_and_rosae_nlg.md",
    "swipe_file/content_prompts_and_qa_rubrics.md"
]

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_PHASE2_DIR = BASE_DIR / "SEO SOURCE" / "phase2"


# -----------------------------------------------------------------------------
# TEXT EXTRACTION & NON-QUOTED ANALYTICAL COPY ISOLATION
# -----------------------------------------------------------------------------
def isolate_analytical_copy(raw_markdown: str) -> Dict[str, Any]:
    """
    Isolate author analytical copy from verbatim quotes, code blocks,
    and raw data tables containing external / regex / xpath definitions.
    
    Verbatim quotes and code blocks are excluded from Gate 3 slop scans
    and Gate 4 cadence metrics.
    All analytical copy, frameworks, SOP explanations, and syntheses are audited.
    """
    lines = raw_markdown.splitlines()
    analytical_lines: List[Tuple[int, str]] = []  # (line_number, line_text)
    verbatim_lines: List[Tuple[int, str]] = []

    in_codeblock = False
    in_verbatim_section = False

    for idx, line in enumerate(lines, 1):
        stripped = line.strip()

        # Handle code blocks ```
        if stripped.startswith("```"):
            in_codeblock = not in_codeblock
            continue
        if in_codeblock:
            continue

        # Check section headings for verbatim or quotation sections
        if stripped.startswith("#"):
            lower_heading = stripped.lower()
            if "verbatim transcript" in lower_heading or "verbatim source quote" in lower_heading:
                in_verbatim_section = True
            elif stripped.startswith("## ") or stripped.startswith("### ") or (stripped.startswith("#### ") and "verbatim" not in lower_heading):
                in_verbatim_section = False

        if in_verbatim_section:
            verbatim_lines.append((idx, line))
            continue

        # Blockquotes (lines starting with >)
        # Note: If it's a callout box directive, extract the analytical directive text;
        # if it's a speaker quote (e.g. starting with > "), treat as verbatim quote.
        if stripped.startswith(">"):
            quote_content = stripped.lstrip("> ").strip()
            if quote_content.startswith('"') or quote_content.startswith('“') or "said:" in quote_content.lower():
                verbatim_lines.append((idx, line))
                continue
            else:
                # Callout box or directive paragraph
                analytical_lines.append((idx, quote_content))
                continue

        # Markdown Table Rows (lines that start with | and end with | or match ^\s*\|.*\|\s*$)
        if (stripped.startswith("|") and stripped.endswith("|")) or re.match(r"^\s*\|.*\|\s*$", stripped):
            continue

        # Standard analytical copy
        analytical_lines.append((idx, line))

    analytical_text = "\n".join(text for _, text in analytical_lines)
    return {
        "analytical_lines": analytical_lines,
        "analytical_text": analytical_text,
        "verbatim_lines_count": len(verbatim_lines)
    }


# -----------------------------------------------------------------------------
# GATE 1: ASSET PARITY & RECIPROCAL LINKING (20 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_1(file_path: Path, content: str, phase2_dir: Path) -> Dict[str, Any]:
    """
    Gate 1: Asset Parity & Reciprocal Linking
    - Validates H1 document title structure
    - Validates H2 structural sections
    - For index.md: validates links to all 10 Phase 2 deliverables
    - For non-index deliverables: validates reciprocal link back to index.md
    """
    score = 20
    status = "PASS"
    reasons: List[str] = []
    fname = file_path.name
    rel_path = str(file_path.relative_to(phase2_dir)) if file_path.is_relative_to(phase2_dir) else fname

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
        missing_asset_links = []
        for expected_rel in EXPECTED_PHASE2_FILES:
            if expected_rel == "index.md":
                continue
            base_target = Path(expected_rel).name
            stem_target = Path(expected_rel).stem
            # Pattern checks for relative link to target file or subfolder
            pattern = rf"\[.*?\]\([./]*{re.escape(expected_rel)}\)|\[.*?\]\([./]*{re.escape(base_target)}\)|\[.*?{re.escape(stem_target)}.*?\]"
            if not re.search(pattern, content, re.IGNORECASE):
                missing_asset_links.append(expected_rel)

        if missing_asset_links:
            deduction = min(10, len(missing_asset_links) * 2)
            score -= deduction
            reasons.append(f"index.md is missing links to {len(missing_asset_links)} Phase 2 assets: {', '.join(missing_asset_links)}")
        else:
            reasons.append("index.md contains verified links to all 10 Phase 2 deliverables.")
    else:
        # Check reciprocal link to index.md
        # In runbooks/ or swipe_file/, links may be ../index.md, ./index.md, or index.md
        has_index_link = bool(re.search(r"\[.*?index.*?\]\(\.\./index\.md\)|\(?\.\./index\.md\)?|\[.*?index.*?\]\(\./index\.md\)|\[.*?index.*?\]\(index\.md\)|\[.*?Index.*?\]", content, re.IGNORECASE))
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
        "gate": "GATE_1_ASSET_PARITY_AND_RECIPROCAL_LINKING",
        "name": "Asset Parity & Reciprocal Linking",
        "score": score,
        "max_score": 20,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "h1_count": len(h1_matches),
            "h2_count": len(h2_matches),
            "h3_count": len(h3_matches),
            "relative_path": rel_path
        }
    }


# -----------------------------------------------------------------------------
# GATE 2: VOLUME DEPTH & WORD COUNT MINIMUMS (20 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_2(file_path: Path, content: str) -> Dict[str, Any]:
    """
    Gate 2: Volume Depth & Word Count Minimums
    - Bible: >= 15,000 words
    - SOP Runbooks: >= 1,800 words
    - Swipe Files: >= 800 words
    - Master Index: >= 2,000 words
    """
    score = 20
    status = "PASS"
    reasons: List[str] = []
    fname = file_path.name

    words = len(content.split())
    expected_min = EXPECTED_PHASE2_MIN_WORDS.get(fname, 1000)

    if words < expected_min:
        ratio = words / expected_min
        if ratio < 0.5:
            score -= 15
        elif ratio < 0.8:
            score -= 10
        else:
            score -= 5
        deficit = expected_min - words
        reasons.append(
            f"Word count deficit: file has {words:,} words, required minimum is {expected_min:,} words (missing {deficit:,} words)."
        )
    else:
        ratio = round(words / expected_min, 2)
        reasons.append(
            f"Volume depth verified: {words:,} words meets/exceeds {expected_min:,} minimum threshold ({ratio:.2f}x minimum)."
        )

    # Check structural depth (H2/H3 presence)
    h2_count = len(re.findall(r"^##\s+", content, re.MULTILINE))
    if h2_count < 3:
        score -= 5
        reasons.append(f"Insufficient structural section depth (detected {h2_count} H2 sections; expected >= 3).")

    score = max(0, min(20, score))
    if score >= 18:
        status = "PASS"
    elif score >= 14:
        status = "WARN"
    else:
        status = "FAIL"

    return {
        "gate": "GATE_2_VOLUME_DEPTH_AND_WORD_COUNT",
        "name": "Volume Depth & Word Count Minimums",
        "score": score,
        "max_score": 20,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "word_count": words,
            "expected_min_words": expected_min,
            "depth_ratio": round(words / expected_min, 2) if expected_min > 0 else 1.0,
            "h2_sections": h2_count
        }
    }


# -----------------------------------------------------------------------------
# GATE 3: ANTI-AI SLOP PURITY (25 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_3(analytical_lines: List[Tuple[int, str]], analytical_text: str) -> Dict[str, Any]:
    """
    Gate 3: Anti-AI Slop Purity
    Audits all non-quoted analytical copy against the 105+ banned words dictionary.
    Verbatim quotations and code blocks are exempt.
    0 Banned words detected = 25 pts (PASS).
    Any hit = FAIL (0 pts).
    """
    findings: List[Dict[str, Any]] = []
    matched_spans_by_line: Dict[int, List[Tuple[int, int]]] = {}

    compiled_patterns = []
    for phrase in ALL_BANNED_WORDS:
        tokens = phrase.split()
        if len(tokens) == 1:
            w = tokens[0]
            pat_str = r"\b" + re.escape(w) + r"(?:s|ed|ing|es|d|ment|ments)?\b"
        else:
            last_w = tokens[-1]
            pat_tokens = [re.escape(t) for t in tokens[:-1]]
            pat_tokens.append(re.escape(last_w) + r"(?:s|ed|ing|es|d)?")
            pat_str = r"\b" + r"\s+".join(pat_tokens) + r"\b"
        compiled_patterns.append((phrase, re.compile(pat_str, re.IGNORECASE)))

    for phrase, pattern in compiled_patterns:
        for line_no, line_text in analytical_lines:
            line_spans = matched_spans_by_line.setdefault(line_no, [])
            for match in pattern.finditer(line_text):
                m_start, m_end = match.start(), match.end()
                matched = match.group(0)

                # Domain exemptions
                if matched.lower() in ["transformer", "transformers"] and any(k in line_text.lower() for k in ["bert", "attention", "vaswani", "mum", "model"]):
                    continue
                if phrase == "harness" and any(k in line_text.lower() for k in ["sop_02", ".md", "audit harness", "python"]):
                    continue
                if phrase in ["navigate", "navigation"] and any(k in line_text.lower() for k in ["faceted", "navigation", "navigational", "menu", "parameter"]):
                    continue
                if matched.lower() in ["transform", "transforms"] and "rewriter" in line_text:
                    continue

                # Check if match overlaps with an already recorded longer span
                if any(not (m_end <= s_start or m_start >= s_end) for s_start, s_end in line_spans):
                    continue
                line_spans.append((m_start, m_end))

                start_ctx = max(0, m_start - 30)
                end_ctx = min(len(line_text), m_end + 30)
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
        "gate": "GATE_3_ANTI_AI_SLOP_PURITY",
        "name": "Anti-AI Slop Purity (105+ Banned Words)",
        "score": score,
        "max_score": 25,
        "status": status,
        "reasons": reasons,
        "metrics": {
            "banned_words_detected": len(unique_findings),
            "detections": unique_findings[:15]
        }
    }


# -----------------------------------------------------------------------------
# GATE 4: CADENCE & HUMANIZATION METRICS (15 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_4(analytical_text: str) -> Dict[str, Any]:
    """
    Gate 4: Cadence & Humanization Metrics
    - Burstiness: Sentence length standard deviation sigma >= 8.0 (10 pts)
    - Adjective Density: <= 7.0% (5 pts)
    """
    # Strip markdown table rows (lines that start with | and end with | or match ^\s*\|.*\|\s*$)
    clean_lines = [
        l for l in analytical_text.splitlines()
        if not (l.strip().startswith("|") and l.strip().endswith("|")) and not re.match(r"^\s*\|.*\|\s*$", l)
    ]
    clean_text = "\n".join(clean_lines)
    clean_text = re.sub(r"#+.*", "", clean_text)
    clean_text = re.sub(r"`.*?`", "", clean_text)
    clean_text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", clean_text)
    clean_text = re.sub(r"[*_`|~]", "", clean_text)

    raw_sentences = re.split(r"(?<=[.!?])\s+", clean_text)
    sentences = [s.strip() for s in raw_sentences if len(s.strip().split()) >= 3 and not s.strip().startswith("#")]

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
        "gate": "GATE_4_CADENCE_AND_HUMANIZATION_METRICS",
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
# GATE 5: TRANSCRIPT FIDELITY & LINEAGE MATRIX (20 PTS)
# -----------------------------------------------------------------------------
def evaluate_gate_5(file_path: Path, content: str) -> Dict[str, Any]:
    """
    Gate 5: Transcript Fidelity & Lineage Matrix
    Verifies that all Phase 2 deliverables explicitly ground their frameworks
    in Phase 1 modules and instructors:
      - GROWTH_SCALE_EXECUTIVE_BIBLE.md: Volumes I - VI present with module grounding
      - SOP Runbooks: Objective, Lineage, Prerequisites, Step-by-Step, Verification Checklist
      - Swipe Files: Practical execution patterns, syntax-valid extractions/prompts
      - index.md: Telemetry, Deliverable Registry, Cross-Module Lineage, Dependency Graph, Checksums
      - Zero-hallucination patterns check
    """
    score = 20
    status = "PASS"
    reasons: List[str] = []
    fname = file_path.name
    lower = content.lower()

    if fname == "index.md":
        required_sections = [
            ("Executive Telemetry / Synthesis Ledger", ["telemetry", "synthesis ledger"]),
            ("Master Deliverable Registry", ["deliverable registry", "master deliverable"]),
            ("Cross-Module Lineage & Reconciliation", ["lineage", "cross-module", "reconciliation"]),
            ("Inter-Asset Dependency Graph", ["dependency", "graph", "topology"]),
            ("Verification & Cryptographic Checksums", ["checksum", "sha-256", "verification"])
        ]
        for name, keywords in required_sections:
            if not any(kw in lower for kw in keywords):
                score -= 3
                reasons.append(f"index.md missing section: {name}")
            else:
                reasons.append(f"Verified index section: {name}")

    elif fname == "GROWTH_SCALE_EXECUTIVE_BIBLE.md":
        volume_markers = [
            ("Volume I", ["volume i", "programmatic seo"]),
            ("Volume II", ["volume ii", "technical seo core", "crawl infrastructure"]),
            ("Volume III", ["volume iii", "e-commerce", "site architecture"]),
            ("Volume IV", ["volume iv", "link equity", "algorithmic defense"]),
            ("Volume V", ["volume v", "international seo", "multi-region"]),
            ("Volume VI", ["volume vi", "generative ai", "autonomous content"])
        ]
        for vname, keywords in volume_markers:
            if not any(kw in lower for kw in keywords):
                score -= 2
                reasons.append(f"Executive Bible missing volume: {vname}")
            else:
                reasons.append(f"Verified Bible volume marker: {vname}")

        # Check instructor grounding
        instructors = ["nitin manchanda", "kaushal thakkar", "pushkar shah", "babu chakraborty", "vaibhav sisinty"]
        found_instructors = [inst for inst in instructors if inst in lower]
        if len(found_instructors) < 3:
            score -= 4
            reasons.append(f"Weak instructor lineage: only found {len(found_instructors)}/5 Phase 1 instructors.")
        else:
            reasons.append(f"Strong instructor lineage verified ({len(found_instructors)}/5 instructors cited).")

    elif fname.startswith("SOP_"):
        sop_sections = [
            ("Objective / Scope", ["objective", "scope", "operational context"]),
            ("Phase 1 Lineage & Grounding", ["lineage", "module 0", "grounding", "phase 1"]),
            ("Step-by-Step Protocol", ["step", "protocol", "procedure", "execution"]),
            ("Verification / QA Checklist", ["verification", "checklist", "quality assurance", "validation"])
        ]
        for sname, keywords in sop_sections:
            if not any(kw in lower for kw in keywords):
                score -= 3
                reasons.append(f"{fname} missing standard section: {sname}")
            else:
                reasons.append(f"Verified SOP section: {sname}")

    elif fname.endswith(".md") and "swipe_file" in str(file_path):
        swipe_patterns = ["```", "|", "regex", "xpath", "prompt", "formula", "template"]
        found_patterns = [p for p in swipe_patterns if p in lower]
        if len(found_patterns) < 3:
            score -= 5
            reasons.append(f"Swipe file lacks technical code/extraction patterns ({fname}).")
        else:
            reasons.append(f"Verified swipe file technical pattern density ({fname}).")

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
        "gate": "GATE_5_TRANSCRIPT_FIDELITY_AND_LINEAGE",
        "name": "Transcript Fidelity & Lineage Matrix",
        "score": score,
        "max_score": 20,
        "status": status,
        "reasons": reasons
    }


# -----------------------------------------------------------------------------
# FILE EVALUATOR
# -----------------------------------------------------------------------------
def evaluate_phase2_file(file_path: Path, phase2_dir: Path) -> Dict[str, Any]:
    """Evaluate a single Phase 2 markdown file against all 5 gates."""
    rel_name = str(file_path.relative_to(phase2_dir)) if file_path.is_relative_to(phase2_dir) else file_path.name

    if not file_path.exists():
        return {
            "file": str(file_path),
            "filename": file_path.name,
            "relative_path": rel_name,
            "overall_score": 0,
            "overall_status": "FAIL",
            "error": "File does not exist on disk."
        }

    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return {
            "file": str(file_path),
            "filename": file_path.name,
            "overall_score": 0,
            "overall_status": "FAIL",
            "error": f"Read error: {str(e)}"
        }

    # Isolate non-quoted analytical copy
    isolation = isolate_analytical_copy(content)
    analytical_lines = isolation["analytical_lines"]
    analytical_text = isolation["analytical_text"]

    # Run the 5 Gates
    g1 = evaluate_gate_1(file_path, content, phase2_dir)
    g2 = evaluate_gate_2(file_path, content)
    g3 = evaluate_gate_3(analytical_lines, analytical_text)
    g4 = evaluate_gate_4(analytical_text)
    g5 = evaluate_gate_5(file_path, content)

    total_score = g1["score"] + g2["score"] + g3["score"] + g4["score"] + g5["score"]

    if g3["status"] == "FAIL":
        overall_status = "FAIL"
    elif total_score >= 90:
        overall_status = "PASS"
    elif total_score >= 75:
        overall_status = "WARN"
    else:
        overall_status = "FAIL"

    rel_name = str(file_path.relative_to(phase2_dir)) if file_path.is_relative_to(phase2_dir) else file_path.name

    return {
        "file": str(file_path),
        "filename": file_path.name,
        "relative_path": rel_name,
        "overall_score": total_score,
        "overall_status": overall_status,
        "gates": [g1, g2, g3, g4, g5],
        "metrics": {
            "total_words": len(content.split()),
            "analytical_lines": len(analytical_lines),
            "verbatim_lines": isolation["verbatim_lines_count"]
        }
    }


# -----------------------------------------------------------------------------
# TERMINAL RENDERING
# -----------------------------------------------------------------------------
def print_file_report(result: Dict[str, Any], verbose: bool = False):
    """Render single deliverable evaluation report in terminal."""
    fname = result.get("relative_path", result.get("filename", "unknown"))
    score = result.get("overall_score", 0)
    status = result.get("overall_status", "FAIL")

    status_color = Color.GREEN if status == "PASS" else (Color.YELLOW if status == "WARN" else Color.RED)

    print(f"\n{Color.BOLD}{'=' * 80}{Color.RESET}")
    print(f" {Color.CYAN}EVALUATION REPORT:{Color.RESET} {Color.BOLD}{fname}{Color.RESET}")
    print(f" Status: {status_color}{Color.BOLD}{status}{Color.RESET} | Score: {status_color}{score}/100{Color.RESET}")
    print(f"{Color.BOLD}{'=' * 80}{Color.RESET}")

    if "error" in result:
        print(f"  {Color.RED}Error: {result['error']}{Color.RESET}")
        return

    for gate in result.get("gates", []):
        g_name = gate["name"]
        g_score = gate["score"]
        g_max = gate["max_score"]
        g_status = gate["status"]
        g_color = Color.GREEN if g_status == "PASS" else (Color.YELLOW if g_status == "WARN" else Color.RED)

        print(f"\n  [{g_color}{g_status}{Color.RESET}] {Color.BOLD}{g_name}{Color.RESET}: {g_color}{g_score}/{g_max} pts{Color.RESET}")
        for reason in gate.get("reasons", []):
            print(f"      - {reason}")

        if gate.get("metrics") and verbose:
            print(f"      {Color.DIM}Metrics: {json.dumps(gate['metrics'])}{Color.RESET}")

        # If Gate 3 detections exist, show them clearly
        if gate.get("gate") == "GATE_3_ANTI_AI_SLOP_PURITY":
            detections = gate.get("metrics", {}).get("detections", [])
            if detections:
                print(f"      {Color.RED}{Color.BOLD}Banned AI Word Instances Detected:{Color.RESET}")
                for d in detections:
                    print(f"        * Line {d['line']}: {Color.RED}'{d['word']}'{Color.RESET} -> {d['context']}")


# -----------------------------------------------------------------------------
# MAIN CLI DISPATCH
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Phase 2 Quality, Anti-AI Slop, Verification & Compliance Evaluator Engine"
    )
    parser.add_argument("--file", "-f", type=str, help="Evaluate a single deliverable markdown file.")
    parser.add_argument("--all", "-a", action="store_true", help="Evaluate all Phase 2 deliverables.")
    parser.add_argument("--phase2-dir", type=str, default=str(DEFAULT_PHASE2_DIR), help="Directory containing Phase 2 assets.")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show granular debug metrics per gate.")
    parser.add_argument("--json", "-j", action="store_true", help="Output machine-readable JSON.")

    args = parser.parse_args()
    phase2_dir = Path(args.phase2_dir).resolve()

    if not args.file and not args.all:
        parser.print_help()
        sys.exit(0)

    results: List[Dict[str, Any]] = []

    if args.file:
        target = Path(args.file).resolve()
        res = evaluate_phase2_file(target, phase2_dir)
        results.append(res)
    elif args.all:
        for rel in EXPECTED_PHASE2_FILES:
            target = phase2_dir / rel
            res = evaluate_phase2_file(target, phase2_dir)
            results.append(res)

    if args.json:
        print(json.dumps(results, indent=2))
        all_passed = all(r.get("overall_status") == "PASS" for r in results)
        sys.exit(0 if all_passed else 1)

    # Render Terminal Reports
    all_passed = True
    print(f"\n{Color.BOLD}{Color.MAGENTA}==============================================================================={Color.RESET}")
    print(f"{Color.BOLD}{Color.MAGENTA}        PHASE 2 QUALITY, ANTI-AI SLOP & FIDELITY EVALUATOR HARNESS            {Color.RESET}")
    print(f"{Color.BOLD}{Color.MAGENTA}==============================================================================={Color.RESET}")

    for res in results:
        print_file_report(res, verbose=args.verbose)
        if res.get("overall_status") != "PASS":
            all_passed = False

    # Summary Table
    print(f"\n{Color.BOLD}{'=' * 80}{Color.RESET}")
    print(f"{Color.BOLD} PHASE 2 ASSET EVALUATION SUMMARY{Color.RESET}")
    print(f"{Color.BOLD}{'=' * 80}{Color.RESET}")
    print(f" {'Asset Path':<50} | {'Score':<8} | {'Status':<6}")
    print(f" {'-' * 50}-+-{'-' * 8}-+-{'-' * 6}")

    for res in results:
        fname = res.get("relative_path", res.get("filename", "unknown"))
        sc = res.get("overall_score", 0)
        st = res.get("overall_status", "FAIL")
        color = Color.GREEN if st == "PASS" else (Color.YELLOW if st == "WARN" else Color.RED)
        print(f" {fname:<50} | {sc:>3}/100   | {color}{st:<6}{Color.RESET}")

    print(f"{Color.BOLD}{'=' * 80}{Color.RESET}")
    if all_passed:
        print(f" {Color.GREEN}{Color.BOLD}FLEET STATUS: ALL PHASE 2 DELIVERABLES COMPLIANT (PASS){Color.RESET}\n")
        sys.exit(0)
    else:
        print(f" {Color.RED}{Color.BOLD}FLEET STATUS: ONE OR MORE DELIVERABLES FAILED COMPLIANCE GATES{Color.RESET}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
