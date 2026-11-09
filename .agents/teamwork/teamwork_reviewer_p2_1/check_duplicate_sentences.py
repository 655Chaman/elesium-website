from pathlib import Path
from collections import Counter
import re

bible_text = Path("SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md").read_text(encoding="utf-8")

# Extract sentences
sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', bible_text) if len(s.strip().split()) > 5]
counts = Counter(sentences)

print("Most repeated sentences (>5 words):")
repeated = [(s, c) for s, c in counts.items() if c > 1]
repeated.sort(key=lambda x: x[1], reverse=True)

print(f"Total distinct sentences: {len(counts)}")
print(f"Total repeated sentence instances: {len(repeated)}")
for s, c in repeated[:15]:
    print(f"  [{c}x]: {s[:100]}...")
