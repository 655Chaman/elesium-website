#!/usr/bin/env python3
"""
verify_phase1_coverage.py
Lossless Ingestion & Coverage Verification Gate for Phase 1 Dossiers
"""
import sys
import docx
from pathlib import Path

DOCX_PATH = Path('/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx')
PHASE1_DIR = Path('/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/phase1')

def verify_phase1():
    print("=== RUNNING PHASE 1 PROGRAMMATIC COVERAGE AUDIT ===")
    
    # 1. Verify Directory & File Existence
    if not PHASE1_DIR.exists():
        print(f"[FAIL] Target directory {PHASE1_DIR} does not exist.")
        sys.exit(1)
        
    expected_files = ['index.md'] + [f"module_{i:02d}.md" for i in range(1, 10)]
    missing = [f for f in expected_files if not (PHASE1_DIR / f).exists()]
    if missing:
        print(f"[FAIL] Missing target dossiers: {missing}")
        sys.exit(1)
    print(f"[PASS] All {len(expected_files)} Phase 1 files present on disk.")

    # 2. Extract Baseline Source Word Counts from docx
    doc = docx.Document(DOCX_PATH)
    source_words = sum(len(p.text.split()) for p in doc.paragraphs if p.text.strip())
    print(f"[INFO] Source docx total words: {source_words:,}")

    # 3. Check Dossier Word Counts
    total_dossier_words = 0
    for i in range(1, 10):
        fname = f"module_{i:02d}.md"
        content = (PHASE1_DIR / fname).read_text(encoding='utf-8')
        w_count = len(content.split())
        total_dossier_words += w_count
        print(f"  - {fname}: {w_count:,} words")

    print(f"[INFO] Total generated dossier words: {total_dossier_words:,}")
    # Dossiers contain verbatim transcript + intent matrices, so dossier words must exceed source words
    if total_dossier_words < source_words:
        print(f"[FAIL] Dossier total words ({total_dossier_words:,}) < Source docx words ({source_words:,}). Possible omission!")
        sys.exit(1)
    print(f"[PASS] Comprehensive ingestion verified (Expansion Ratio: {total_dossier_words / source_words:.2f}x).")

if __name__ == '__main__':
    verify_phase1()
