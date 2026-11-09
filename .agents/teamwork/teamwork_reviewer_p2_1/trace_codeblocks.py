from pathlib import Path

lines = Path('SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md').read_text(encoding='utf-8').splitlines()

in_code = False
for idx, line in enumerate(lines, 1):
    stripped = line.strip()
    if stripped.startswith('```'):
        in_code = not in_code
        state = "OPEN " if in_code else "CLOSE"
        tag = stripped[3:].strip()
        print(f"Line {idx:4d} | {state} | {stripped[:20]:<20} | context: {lines[idx-2].strip() if idx > 1 else ''}")
