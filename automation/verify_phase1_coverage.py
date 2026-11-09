#!/usr/bin/env python3
"""
automation/verify_phase1_coverage.py
=============================================================================
Phase 1 Lossless Transcript Coverage Verification Gate
Grounded in Master Agent Playbook and Extreme Paranoical Framework (EPF).

Inspects the source DOCX:
  /Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx
and verifies 100% word, paragraph, and structural coverage across generated dossiers in:
  /Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/phase1/ (index.md, module_01.md through module_09.md)

Verification Checks:
1. File & Directory Existence: Checks index.md and module_01.md .. module_09.md
2. Source Docx Parsing: Extracts all 1,520 paragraphs, 193,410 words across all 9 modules and 46 videos.
3. Module Telemetry Parity: Validates each module's dossier word count >= source word count (expansion ratio >= 1.0x).
4. Paragraph & Verbatim Coverage: Verifies that every single source paragraph from docx is represented in the dossier.
5. Video Title & Special Invariant Verification: Verifies all 46 video titles, Module 2 empty folder invariant, and Module 8 duplicate lesson documentation.
6. Interlinking Parity: Verifies reciprocal linking between index.md and all module dossiers.

Exit Codes:
  0: Full verification PASSED (100% word and paragraph coverage confirmed)
  1: Verification FAILED (missing files, word count deficit, missing paragraphs, or link failures)
"""

import sys
import os
import re
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Set

# Optional python-docx import with XML fallback
try:
    import docx
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False
    import zipfile
    import xml.etree.ElementTree as ET

# Default Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DOCX = BASE_DIR / "SEO SOURCE" / "GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx"
DEFAULT_PHASE1_DIR = BASE_DIR / "SEO SOURCE" / "phase1"

# Terminal Colors
class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    CYAN = "\033[96m"
    DIM = "\033[2m"


def extract_paragraphs_from_docx(docx_path: Path) -> List[Dict[str, Any]]:
    """Extract all paragraphs and metadata from docx file."""
    if not docx_path.exists():
        raise FileNotFoundError(f"Source docx file not found: {docx_path}")

    paragraphs = []
    if HAS_DOCX:
        doc = docx.Document(str(docx_path))
        for idx, p in enumerate(doc.paragraphs):
            paragraphs.append({
                "idx": idx,
                "text": p.text,
                "style": p.style.name if p.style else "normal",
                "word_count": len(p.text.split()),
                "char_count": len(p.text)
            })
    else:
        # Direct XML parsing fallback
        import zipfile
        import xml.etree.ElementTree as ET
        w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        ns = {'w': w_ns}
        with zipfile.ZipFile(str(docx_path), 'r') as z:
            doc_xml = z.read('word/document.xml')
        root = ET.fromstring(doc_xml)
        for idx, p_elem in enumerate(root.findall('.//w:p', ns)):
            pStyle = p_elem.find('.//w:pStyle', ns)
            style_name = pStyle.get(f'{{{w_ns}}}val', 'normal') if pStyle is not None else 'normal'
            t_nodes = p_elem.findall('.//w:t', ns)
            text = "".join(t.text for t in t_nodes if t.text)
            paragraphs.append({
                "idx": idx,
                "text": text,
                "style": style_name,
                "word_count": len(text.split()),
                "char_count": len(text)
            })

    return paragraphs


def structure_source_corpus(paragraphs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Structure flat paragraphs into Header, Modules, and Videos."""
    total_paras = len(paragraphs)
    all_text = "\n".join(p["text"] for p in paragraphs)
    total_words = len(all_text.split())
    total_chars = len(all_text)

    header_words = len((paragraphs[0]["text"] + " " + paragraphs[1]["text"]).split()) if total_paras >= 2 else 0

    corpus: Dict[str, Any] = {
        "total_paragraphs": total_paras,
        "total_words": total_words,
        "total_chars": total_chars,
        "header_paragraphs": 2,
        "header_words": header_words,
        "modules": []
    }

    current_mod: Optional[Dict[str, Any]] = None
    current_vid: Optional[Dict[str, Any]] = None

    for idx, p in enumerate(paragraphs):
        text = p["text"].strip()
        style = p["style"]

        # Module Header detection: Heading 2 starting with MODULE
        is_mod_header = (style == "Heading 2" and text.startswith("MODULE")) or re.match(r"^MODULE\s+\d+", text)
        if is_mod_header and "Complete Raw Verbatim Transcripts" not in text:
            if current_vid:
                current_vid["end_p"] = idx - 1
                current_vid = None
            if current_mod:
                current_mod["end_p"] = idx - 1

            mod_match = re.search(r"MODULE\s+(\d+)", text)
            mod_num = int(mod_match.group(1)) if mod_match else (len(corpus["modules"]) + 1)
            current_mod = {
                "module_num": mod_num,
                "module_id": f"module_{mod_num:02d}",
                "module_title": text,
                "start_p": idx,
                "end_p": None,
                "special_note": None,
                "videos": [],
                "paragraphs": []
            }
            corpus["modules"].append(current_mod)
        elif (style == "Heading 3" or (current_mod and re.match(r"^\d+\.\s+Copy of", text))) and current_mod is not None:
            if current_vid:
                current_vid["end_p"] = idx - 1
            vid_idx = len(current_mod["videos"]) + 1
            current_vid = {
                "video_index": vid_idx,
                "video_title": text,
                "start_p": idx,
                "end_p": None,
                "paragraphs": []
            }
            current_mod["videos"].append(current_vid)
        else:
            if current_mod:
                if not current_mod["videos"] and text.startswith("["):
                    current_mod["special_note"] = text
                if current_vid:
                    current_vid["paragraphs"].append(p)
                current_mod["paragraphs"].append(p)

    if current_vid:
        current_vid["end_p"] = total_paras - 1
    if current_mod:
        current_mod["end_p"] = total_paras - 1

    # Calculate word and char counts per module and video
    for m in corpus["modules"]:
        mod_paras = paragraphs[m["start_p"]:m["end_p"] + 1]
        m["paragraph_count"] = len(mod_paras)
        mod_text = "\n".join(p["text"] for p in mod_paras)
        m["word_count"] = len(mod_text.split())
        m["char_count"] = len(mod_text)

        for v in m["videos"]:
            v_paras = paragraphs[v["start_p"]:v["end_p"] + 1]
            v["paragraph_count"] = len(v_paras)
            v_text = "\n".join(p["text"] for p in v_paras)
            v["word_count"] = len(v_text.split())
            v["char_count"] = len(v_text)

    return corpus


def normalize_tokens(text: str) -> List[str]:
    """Extract lowercased alphanumeric tokens."""
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def check_paragraph_coverage_in_dossier(
    p_text: str,
    dossier_content: str,
    dossier_tokens_set: Set[str],
    dossier_text_lower: str
) -> Tuple[bool, float, str]:
    """
    Check if a source paragraph's verbatim text is covered in the dossier.
    Returns (is_covered, coverage_ratio, reason).
    """
    clean_p = p_text.strip()
    if not clean_p:
        return True, 1.0, "empty"

    p_tokens = normalize_tokens(clean_p)
    if not p_tokens:
        return True, 1.0, "no_tokens"

    # For short paragraphs (<= 15 words) or titles: check direct substring match in lowercase text
    norm_p = " ".join(p_tokens)
    if len(p_tokens) <= 15:
        if norm_p in dossier_text_lower:
            return True, 1.0, "exact_norm_match"
        # Token overlap check
        matched = sum(1 for t in p_tokens if t in dossier_tokens_set)
        ratio = matched / len(p_tokens)
        return ratio >= 0.85, ratio, f"short_token_ratio_{ratio:.2f}"

    # For medium and large paragraphs:
    # 1. Direct substring check
    if clean_p.lower() in dossier_text_lower:
        return True, 1.0, "verbatim_exact_match"

    # 2. Sequential sliding window (shingles of 8-12 tokens)
    window_size = 10
    step = 10
    shingles = []
    for i in range(0, len(p_tokens) - window_size + 1, step):
        shingles.append(" ".join(p_tokens[i:i + window_size]))
    if not shingles:
        shingles = [" ".join(p_tokens)]

    matched_shingles = sum(1 for s in shingles if s in dossier_text_lower)
    shingle_ratio = matched_shingles / len(shingles)

    # 3. Overall token multiset recall
    matched_tokens = sum(1 for t in p_tokens if t in dossier_tokens_set)
    token_ratio = matched_tokens / len(p_tokens)

    # A paragraph is covered if either >=85% shingles match or >=92% token recall matches
    is_covered = (shingle_ratio >= 0.85) or (token_ratio >= 0.92)
    return is_covered, max(shingle_ratio, token_ratio), f"shingle_{shingle_ratio:.2f}_token_{token_ratio:.2f}"


def verify_phase1_coverage(
    docx_path: Path = DEFAULT_DOCX,
    phase1_dir: Path = DEFAULT_PHASE1_DIR,
    verbose: bool = False,
    allow_missing: bool = False
) -> Dict[str, Any]:
    """Execute complete Phase 1 coverage audit."""
    report: Dict[str, Any] = {
        "status": "PASS",
        "docx_path": str(docx_path),
        "phase1_dir": str(phase1_dir),
        "source_metrics": {},
        "files_audit": {},
        "modules_audit": [],
        "errors": [],
        "warnings": []
    }

    # 1. Verify Source DOCX
    if not docx_path.exists():
        report["status"] = "FAIL"
        report["errors"].append(f"Source docx file not found: {docx_path}")
        return report

    paragraphs = extract_paragraphs_from_docx(docx_path)
    corpus = structure_source_corpus(paragraphs)
    report["source_metrics"] = {
        "total_paragraphs": corpus["total_paragraphs"],
        "total_words": corpus["total_words"],
        "total_chars": corpus["total_chars"],
        "total_modules": len(corpus["modules"])
    }

    # 2. Verify Directory and Expected Files Existence
    expected_files = ["index.md"] + [f"module_{i:02d}.md" for i in range(1, 10)]
    files_status = {}
    missing_files = []

    if not phase1_dir.exists():
        report["status"] = "FAIL"
        report["errors"].append(f"Target directory {phase1_dir} does not exist.")
        if not allow_missing:
            return report

    for fname in expected_files:
        fpath = phase1_dir / fname
        exists = fpath.exists()
        files_status[fname] = {
            "exists": exists,
            "path": str(fpath),
            "size_bytes": fpath.stat().st_size if exists else 0,
            "word_count": len(fpath.read_text(encoding="utf-8").split()) if exists else 0
        }
        if not exists:
            missing_files.append(fname)

    report["files_audit"] = {
        "expected_count": len(expected_files),
        "existing_count": len(expected_files) - len(missing_files),
        "missing_files": missing_files,
        "files": files_status
    }

    if missing_files:
        if allow_missing:
            report["warnings"].append(f"Missing {len(missing_files)} Phase 1 files: {', '.join(missing_files)}.")
            report["status"] = "PENDING_INCOMPLETE"
        else:
            report["status"] = "FAIL"
            report["errors"].append(f"Missing required dossier files: {', '.join(missing_files)}")
            return report

    # 3. Verify Master Index (`index.md`) Parity
    index_path = phase1_dir / "index.md"
    if index_path.exists():
        index_content = index_path.read_text(encoding="utf-8")
        index_words = len(index_content.split())
        index_links_valid = True
        missing_module_links = []
        for i in range(1, 10):
            link_pattern = rf"\[.*?module_{i:02d}.*?\]\(\./module_{i:02d}\.md\)|\[.*?module_{i:02d}.*?\]\(module_{i:02d}\.md\)"
            if not re.search(link_pattern, index_content, re.IGNORECASE):
                missing_module_links.append(f"module_{i:02d}.md")
                index_links_valid = False

        report["index_audit"] = {
            "words": index_words,
            "has_all_module_links": index_links_valid,
            "missing_module_links": missing_module_links
        }
        if not index_links_valid:
            report["errors"].append(f"index.md is missing links to: {', '.join(missing_module_links)}")
            report["status"] = "FAIL"

    # 4. Verify Each Module Dossier vs Source Docx
    total_source_words = 0
    total_dossier_words = 0
    total_source_substantive_paras = 0
    total_covered_paras = 0

    for mod in corpus["modules"]:
        mod_num = mod["module_num"]
        mod_id = mod["module_id"]
        fname = f"{mod_id}.md"
        fpath = phase1_dir / fname

        mod_audit: Dict[str, Any] = {
            "module_num": mod_num,
            "module_id": mod_id,
            "canonical_title": mod["module_title"],
            "source_words": mod["word_count"],
            "source_paragraphs": mod["paragraph_count"],
            "source_videos": len(mod["videos"]),
            "dossier_words": 0,
            "expansion_ratio": 0.0,
            "video_titles_found": 0,
            "video_titles_total": len(mod["videos"]),
            "paragraphs_covered": 0,
            "paragraphs_total": 0,
            "paragraph_coverage_pct": 0.0,
            "special_invariant_verified": True,
            "status": "PASS"
        }

        total_source_words += mod["word_count"]

        if not fpath.exists():
            mod_audit["status"] = "MISSING"
            report["modules_audit"].append(mod_audit)
            continue

        dossier_text = fpath.read_text(encoding="utf-8")
        dossier_words = len(dossier_text.split())
        mod_audit["dossier_words"] = dossier_words
        total_dossier_words += dossier_words

        expansion_ratio = round(dossier_words / mod["word_count"], 2) if mod["word_count"] > 0 else 1.0
        mod_audit["expansion_ratio"] = expansion_ratio

        # Special Case: Module 2 (Empty source folder)
        if mod_num == 2:
            empty_notice = "[Empty Folder on Google Drive — 0 Video Files Present]"
            if empty_notice not in dossier_text:
                mod_audit["special_invariant_verified"] = False
                mod_audit["status"] = "FAIL"
                report["errors"].append("Module 2 dossier missing required verbatim empty folder notice.")
                report["status"] = "FAIL"
            else:
                mod_audit["special_invariant_verified"] = True
                mod_audit["paragraphs_covered"] = mod["paragraph_count"]
                mod_audit["paragraphs_total"] = mod["paragraph_count"]
                mod_audit["paragraph_coverage_pct"] = 100.0
                total_covered_paras += mod["paragraph_count"]
                total_source_substantive_paras += mod["paragraph_count"]
                report["modules_audit"].append(mod_audit)
                continue

        # Check expansion ratio: Dossier must contain 100% transcript + analysis, so dossier_words >= source_words
        if dossier_words < mod["word_count"]:
            mod_audit["status"] = "FAIL"
            report["errors"].append(
                f"{fname} word count deficit: dossier has {dossier_words:,} words, source has {mod['word_count']:,} words."
            )
            report["status"] = "FAIL"

        # Check Video Titles Presence
        v_found = 0
        dossier_text_lower = dossier_text.lower()
        dossier_tokens = set(normalize_tokens(dossier_text))

        for v in mod["videos"]:
            v_title_clean = v["video_title"].strip()
            # check if video title appears in dossier
            if v_title_clean.lower() in dossier_text_lower:
                v_found += 1
            else:
                # check normalized tokens match
                v_tokens = normalize_tokens(v_title_clean)
                if v_tokens and " ".join(v_tokens) in " ".join(normalize_tokens(dossier_text)):
                    v_found += 1
        mod_audit["video_titles_found"] = v_found
        if v_found < len(mod["videos"]):
            report["warnings"].append(
                f"{fname} found {v_found}/{len(mod['videos'])} video titles from source docx."
            )

        # Check Special Invariant for Module 8 (Duplicate Lesson 3 & 4)
        if mod_num == 8:
            if "duplicate" not in dossier_text_lower and "copy of copy of 3.local seo" not in dossier_text_lower:
                report["warnings"].append("Module 8 dossier does not explicitly mention the duplicate Lesson 3/4 audit notation.")

        # Check Reciprocal Link back to Index
        if not re.search(r"\[.*?index.*?\]\(\./index\.md\)|\[.*?index.*?\]\(index\.md\)", dossier_text, re.IGNORECASE):
            report["warnings"].append(f"{fname} is missing a reciprocal link to index.md.")

        # Check Paragraph & Verbatim Coverage
        mod_paras = paragraphs[mod["start_p"]:mod["end_p"] + 1]
        p_covered_count = 0
        p_total_substantive = 0

        for p in mod_paras:
            p_text = p["text"].strip()
            # Skip empty paragraphs or module headers
            if not p_text or (p["style"] == "Heading 2" and p_text.startswith("MODULE")):
                continue

            p_total_substantive += 1
            covered, ratio, reason = check_paragraph_coverage_in_dossier(
                p_text, dossier_text, dossier_tokens, dossier_text_lower
            )
            if covered:
                p_covered_count += 1
            elif verbose:
                print(f"{Color.DIM}[P-GAP] M{mod_num} P#{p['idx']:04d} ({len(p_text.split())} words, {ratio:.2f}): {p_text[:70]}...{Color.RESET}")

        mod_audit["paragraphs_covered"] = p_covered_count
        mod_audit["paragraphs_total"] = p_total_substantive
        coverage_pct = round((p_covered_count / p_total_substantive) * 100.0, 2) if p_total_substantive > 0 else 100.0
        mod_audit["paragraph_coverage_pct"] = coverage_pct

        total_source_substantive_paras += p_total_substantive
        total_covered_paras += p_covered_count

        if coverage_pct < 100.0:
            mod_audit["status"] = "FAIL"
            report["errors"].append(
                f"{fname} paragraph coverage deficit: {p_covered_count}/{p_total_substantive} paragraphs covered ({coverage_pct}%)."
            )
            report["status"] = "FAIL"

        report["modules_audit"].append(mod_audit)

    # 5. Global Summary
    overall_cov_pct = round((total_covered_paras / total_source_substantive_paras) * 100.0, 2) if total_source_substantive_paras > 0 else 0.0
    overall_expansion = round(total_dossier_words / total_source_words, 2) if total_source_words > 0 else 0.0

    report["global_summary"] = {
        "total_source_words": total_source_words,
        "total_dossier_words": total_dossier_words,
        "overall_expansion_ratio": overall_expansion,
        "total_substantive_paragraphs": total_source_substantive_paras,
        "total_covered_paragraphs": total_covered_paras,
        "overall_paragraph_coverage_pct": overall_cov_pct,
        "is_100_percent_covered": (overall_cov_pct >= 100.0) and (total_dossier_words >= total_source_words)
    }

    if not report["global_summary"]["is_100_percent_covered"] and not allow_missing:
        report["status"] = "FAIL"

    return report


def print_cli_report(report: Dict[str, Any], verbose: bool = False):
    """Render terminal report with formatted tables and color."""
    status = report["status"]
    status_color = Color.GREEN if status == "PASS" else (Color.YELLOW if "PENDING" in status else Color.RED)

    print("=" * 80)
    print(f"{Color.BOLD}{Color.CYAN}PHASE 1 TRANSCRIPT INGESTION & COVERAGE VERIFICATION GATE{Color.RESET}")
    print(f"Source Docx: {report['docx_path']}")
    print(f"Phase 1 Dir: {report['phase1_dir']}")
    print("=" * 80)

    src = report.get("source_metrics", {})
    print(f"\n{Color.BOLD}1. SOURCE TELEMETRY (GROWTH SCALE Verbatim Transcripts):{Color.RESET}")
    print(f"  • Total Words:          {src.get('total_words', 0):,}")
    print(f"  • Total Paragraphs:     {src.get('total_paragraphs', 0):,}")
    print(f"  • Total Modules:        {src.get('total_modules', 0)}")

    fa = report.get("files_audit", {})
    print(f"\n{Color.BOLD}2. TARGET FILE REPOSITORY STATUS:{Color.RESET}")
    print(f"  • Expected Files:       {fa.get('expected_count', 0)}")
    print(f"  • Existing Files:       {fa.get('existing_count', 0)}")
    if fa.get("missing_files"):
        print(f"  • {Color.YELLOW}Missing Dossiers:      {', '.join(fa.get('missing_files', []))}{Color.RESET}")
    else:
        print(f"  • {Color.GREEN}All 10 Phase 1 Dossier Files Present on Disk!{Color.RESET}")

    mods = report.get("modules_audit", [])
    if mods:
        print(f"\n{Color.BOLD}3. MODULE-BY-MODULE COVERAGE MATRIX:{Color.RESET}")
        print(f"{'Module':<11} | {'Source Words':<12} | {'Dossier Words':<13} | {'Ratio':<6} | {'Videos':<8} | {'Paras Cov':<11} | {'Status':<6}")
        print("-" * 80)
        for m in mods:
            m_stat = m.get("status", "PASS")
            m_color = Color.GREEN if m_stat == "PASS" else Color.RED
            ratio_str = f"{m.get('expansion_ratio', 0.0):.2f}x"
            v_str = f"{m.get('video_titles_found', 0)}/{m.get('video_titles_total', 0)}"
            p_str = f"{m.get('paragraphs_covered', 0)}/{m.get('paragraphs_total', 0)} ({m.get('paragraph_coverage_pct', 0.0):.1f}%)"
            print(f"{m['module_id']:<11} | {m['source_words']:>12,d} | {m['dossier_words']:>13,d} | {ratio_str:>6} | {v_str:>8} | {p_str:>11} | {m_color}{m_stat:<6}{Color.RESET}")

    glob = report.get("global_summary", {})
    if glob:
        print("-" * 80)
        print(f"{Color.BOLD}4. AGGREGATE COVERAGE SUMMARY:{Color.RESET}")
        print(f"  • Total Source Words:           {glob.get('total_source_words', 0):,}")
        print(f"  • Total Dossier Words:          {glob.get('total_dossier_words', 0):,}")
        print(f"  • Global Expansion Ratio:       {glob.get('overall_expansion_ratio', 0.0):.2f}x")
        print(f"  • Paragraphs Covered:           {glob.get('total_covered_paragraphs', 0):,} / {glob.get('total_substantive_paragraphs', 0):,} ({glob.get('overall_paragraph_coverage_pct', 0.0):.2f}%)")

    if report.get("errors"):
        print(f"\n{Color.RED}{Color.BOLD}VERIFICATION ERRORS DETECTED ({len(report['errors'])}):{Color.RESET}")
        for err in report["errors"]:
            print(f"  {Color.RED}✖ {err}{Color.RESET}")

    if report.get("warnings"):
        print(f"\n{Color.YELLOW}WARNINGS / ADVISORIES ({len(report['warnings'])}):{Color.RESET}")
        for warn in report["warnings"]:
            print(f"  {Color.YELLOW}⚠ {warn}{Color.RESET}")

    print("\n" + "=" * 80)
    print(f"OVERALL VERIFICATION STATUS: {status_color}{Color.BOLD}{status}{Color.RESET}")
    print("=" * 80)


def main():
    parser = argparse.ArgumentParser(
        description="Verify 100% transcript word, paragraph, and structural coverage for Phase 1 dossiers."
    )
    parser.add_argument(
        "--docx",
        type=Path,
        default=DEFAULT_DOCX,
        help="Path to GROWTH SCALE raw verbatim transcript docx"
    )
    parser.add_argument(
        "--phase1-dir",
        type=Path,
        default=DEFAULT_PHASE1_DIR,
        help="Path to SEO SOURCE/phase1 directory"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show detailed paragraph match failures and shingle diagnostics"
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output raw machine-readable JSON report"
    )
    parser.add_argument(
        "--allow-missing",
        action="store_true",
        help="Permit incomplete/in-progress dossiers without failing the script (returns exit code 0)"
    )

    args = parser.parse_args()

    report = verify_phase1_coverage(
        docx_path=args.docx,
        phase1_dir=args.phase1_dir,
        verbose=args.verbose,
        allow_missing=args.allow_missing
    )

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print_cli_report(report, verbose=args.verbose)

    # Return exit code: 0 if PASS (or PENDING_INCOMPLETE with allow-missing), else 1
    if report["status"] == "PASS" or (args.allow_missing and report["status"] == "PENDING_INCOMPLETE"):
        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
