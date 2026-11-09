import re
from pathlib import Path
import sys

# Import banned words from evaluate_phase2_deliverables
sys.path.insert(0, str(Path("automation").resolve()))
from evaluate_phase2_deliverables import ALL_BANNED_WORDS

bible_path = Path("SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md")
lines = bible_path.read_text(encoding="utf-8").splitlines()

# We will manually define the REAL code blocks:
# A code block starts with ``` and ends with ``` on its own line, or line 1701 which ended with ```
real_in_code = False
real_analytical_lines = []

for idx, line in enumerate(lines, 1):
    stripped = line.strip()
    
    if stripped.startswith("```"):
        real_in_code = not real_in_code
        continue
    if idx == 1701 and stripped.endswith("```"):
        # This was meant to close the pyramid
        real_in_code = False
        continue
        
    if real_in_code:
        continue
        
    # Skip table dividers, headings, blockquotes starting with > "
    if stripped.startswith("#"):
        continue
    if stripped.startswith("> \"") or stripped.startswith("> “"):
        continue
    if stripped.startswith("|") and stripped.endswith("|"):
        parts = [p.strip() for p in stripped.split("|")[1:-1]]
        if len(parts) >= 1 and parts[0].startswith("---"):
            continue
        # Table content
        real_analytical_lines.append((idx, " ".join(parts)))
        continue
        
    real_analytical_lines.append((idx, line))

print(f"Total isolated real analytical lines: {len(real_analytical_lines)}")

# Now scan for banned words
detections = []
for phrase in ALL_BANNED_WORDS:
    pat = re.compile(r"\b" + re.escape(phrase) + r"\b", re.IGNORECASE)
    for line_no, line_text in real_analytical_lines:
        for match in pat.finditer(line_text):
            detections.append({
                "word": phrase,
                "line": line_no,
                "context": line_text.strip()
            })

print(f"Banned AI word detections with PROPER fence parsing: {len(detections)}")
for d in detections:
    print(f"  Line {d['line']}: '{d['word']}' in -> {d['context']}")
