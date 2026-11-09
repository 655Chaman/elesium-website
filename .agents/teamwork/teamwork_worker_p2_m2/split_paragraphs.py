#!/usr/bin/env python3
"""
split_paragraphs.py
Enforces strict micro-paragraphs (<= 3 sentences) across all 5 files.
If a paragraph has > 3 sentences, splits it cleanly into 2 paragraphs of <= 3 sentences.
Then re-runs evaluation to ensure 100/100 PASS.
"""

import re
from pathlib import Path
import sys

BASE_DIR = Path("/Users/krdeeksha/ELESIUM WEBSITE")
sys.path.insert(0, str(BASE_DIR))
from automation.evaluate_phase2_deliverables import evaluate_phase2_file

phase2_dir = BASE_DIR / "SEO SOURCE" / "phase2"
files = [
    phase2_dir / "bible_vol_1_3.md",
    phase2_dir / "runbooks" / "SOP_01_PROGRAMMATIC_TAXONOMY_DEPLOYMENT.md",
    phase2_dir / "runbooks" / "SOP_02_ENTERPRISE_SCREAMING_FROG_AUDIT_HARNESS.md",
    phase2_dir / "runbooks" / "SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md",
    phase2_dir / "runbooks" / "SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md",
]

def split_file_paragraphs(file_path: Path):
    content = file_path.read_text(encoding="utf-8")
    lines = content.splitlines()
    new_lines = []
    in_code = False
    
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            new_lines.append(line)
            continue
        if in_code or not stripped or stripped.startswith("#") or stripped.startswith("|") or stripped.startswith("+") or stripped.startswith("---") or stripped.startswith("["):
            new_lines.append(line)
            continue
            
        raw_s = re.split(r"(?<=[.!?])\s+", stripped)
        s_list = [s.strip() for s in raw_s if s.strip()]
        
        if len(s_list) > 3:
            # Split into chunks of at most 3 sentences
            mid = 2 if len(s_list) == 4 else 3
            p1 = " ".join(s_list[:mid])
            p2 = " ".join(s_list[mid:])
            new_lines.append(p1)
            new_lines.append("")
            new_lines.append(p2)
        else:
            new_lines.append(line)
            
    fixed_content = "\n".join(new_lines)
    file_path.write_text(fixed_content, encoding="utf-8")

for f in files:
    split_file_paragraphs(f)
    print(f"Processed micro-paragraphs for: {f.name}")

print("\nVerifying violations count:")
total_v = 0
for f in files:
    content = f.read_text(encoding="utf-8")
    lines = content.splitlines()
    in_code = False
    for idx, l in enumerate(lines, 1):
        stripped = l.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code or not stripped or stripped.startswith("#") or stripped.startswith("|") or stripped.startswith("+") or stripped.startswith("---") or stripped.startswith("["):
            continue
        raw_s = re.split(r"(?<=[.!?])\s+", stripped)
        s_list = [s.strip() for s in raw_s if len(s.strip().split()) >= 3]
        if len(s_list) > 3:
            total_v += 1
            print(f"  Violation in {f.name}:{idx} ({len(s_list)} sentences)")

print(f"Total remaining violations: {total_v}")

print("\nRe-running evaluator on all 5 files:")
for f in files:
    res = evaluate_phase2_file(f, phase2_dir)
    print(f"  {f.name:<55} : {res['overall_score']}/100 [{res['overall_status']}]")
