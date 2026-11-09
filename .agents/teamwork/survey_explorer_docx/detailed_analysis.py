import os
import re
import docx
from collections import Counter

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

print(f"Total paragraphs: {len(doc.paragraphs)}")

# Check style distribution
styles = Counter(p.style.name for p in doc.paragraphs)
print("Style distribution:")
for s, count in styles.most_common():
    print(f"  {s}: {count}")

# Find all headings or module markers
print("\n--- All Headings (p.style.name != 'normal' or matching MODULE / lesson) ---")
for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if p.style.name != 'normal' or re.match(r'^(MODULE|LESSON|[0-9]+\.|\bCopy of\b)', text, re.IGNORECASE):
        print(f"[{idx:04d}] ({p.style.name}) {text[:100]}")
