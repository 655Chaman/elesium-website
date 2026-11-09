#!/usr/bin/env python3
"""
build_phase1_m3.py
Automated Dossier Generator & Verification Engine for Milestone 3 (Modules 04, 05, 06).
Constructs 100% verbatim, zero-loss, zero-slop analytical dossiers matching Section 4.3 schema.
"""

import sys
import os
import re
import math
import hashlib
from pathlib import Path
from typing import Dict, List, Any, Tuple, Set

BASE_DIR = Path("/Users/krdeeksha/ELESIUM WEBSITE")
DOCX_PATH = BASE_DIR / "SEO SOURCE" / "GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx"
PHASE1_DIR = BASE_DIR / "SEO SOURCE" / "phase1"

# Import evaluators
sys.path.insert(0, str(BASE_DIR))
from automation.evaluate_phase1_dossiers import (
    isolate_analytical_copy, evaluate_gate_d1, evaluate_gate_d2,
    evaluate_gate_d3, evaluate_gate_d4, evaluate_gate_d5,
    ALL_BANNED_WORDS, ADJECTIVE_SUFFIXES, ADJECTIVE_EXCLUSIONS
)
from automation.verify_phase1_coverage import (
    extract_paragraphs_from_docx, structure_source_corpus,
    check_paragraph_coverage_in_dossier, normalize_tokens
)

print("Environment and evaluators ready.")
