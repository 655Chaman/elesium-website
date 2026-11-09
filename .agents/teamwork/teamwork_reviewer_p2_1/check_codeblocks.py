from pathlib import Path

lines = Path('SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md').read_text(encoding='utf-8').splitlines()
in_code = False
code_ranges = []
start = None
for idx, line in enumerate(lines, 1):
    if line.strip().startswith('```'):
        if not in_code:
            in_code = True
            start = idx
        else:
            in_code = False
            code_ranges.append((start, idx))
            start = None

print(f"Total code blocks: {len(code_ranges)}")
print(f"Is still in_code at end? {in_code}")
if in_code:
    print(f"Unclosed code block starting at line {start}")

# Check lines 2000-2120
print("\nCode blocks around lines 1990-2125:")
for s, e in code_ranges:
    if e >= 1990 and s <= 2125:
        print(f"  Code block from line {s} to {e}")
