import os
import re
import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

print("=== PARAGRAPH SAMPLES AND HEADINGS ===")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    if not t:
        continue
    # Check if header or short line or timestamp
    if len(t) < 80 or re.match(r'^(MODULE|WEEK|DAY|[0-9]{2}:[0-9]{2})', t, re.IGNORECASE):
        print(f"[{i:04d}] ({p.style.name}) {t}")
