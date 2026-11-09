import re
from pathlib import Path

phase2_dir = Path("SEO SOURCE/phase2")

for md_file in sorted(phase2_dir.rglob("*.md")):
    lines = md_file.read_text(encoding="utf-8").splitlines()
    in_code = False
    anomalies = []
    fence_count = 0
    
    for idx, line in enumerate(lines, 1):
        stripped = line.strip()
        # Check if ``` is anywhere in the line
        if "```" in stripped:
            fence_count += 1
            if not stripped.startswith("```"):
                anomalies.append((idx, f"``` not at start of line: {stripped}"))
            elif not in_code:
                in_code = True
            else:
                in_code = False
                
    if in_code:
        anomalies.append((len(lines), "File ends with unclosed code block!"))
        
    print(f"File: {md_file.relative_to(phase2_dir)}")
    print(f"  Fences: {fence_count}, Ended in code: {in_code}, Anomalies: {len(anomalies)}")
    for line_no, msg in anomalies:
        print(f"    Line {line_no}: {msg}")
