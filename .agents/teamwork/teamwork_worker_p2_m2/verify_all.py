#!/usr/bin/env python3
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

violations = []
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
            violations.append((f.name, idx, len(s_list), stripped[:60]))

print(f"Paragraph sentence count violations (> 3 sentences): {len(violations)}")
for v in violations:
    print(v)

print("\nRunning evaluator across all 5 files:")
for f in files:
    res = evaluate_phase2_file(f, phase2_dir)
    print(f"  {f.name:<55} : {res['overall_score']}/100 [{res['overall_status']}]")
