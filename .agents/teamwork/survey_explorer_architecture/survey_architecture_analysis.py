import os
import re
import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'

doc = docx.Document(DOCX_PATH)
print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")

module_markers = []
for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if re.search(r'\bMODULE\s+[0-9]+', text, re.IGNORECASE) or re.search(r'\bMODULE\s+[IVXLCDM]+', text, re.IGNORECASE):
        module_markers.append((idx, text))

print(f"Found {len(module_markers)} module markers:")
for idx, text in module_markers:
    print(f"P#{idx:04d}: {text[:100]}")

# Let's inspect speaker patterns
speaker_patterns = set()
for p in doc.paragraphs[:200]:
    text = p.text.strip()
    m = re.match(r'^([A-Z][a-zA-Z0-9\s]{1,25}):', text)
    if m:
        speaker_patterns.add(m.group(1))

print(f"\nSpeaker prefixes found in first 200 paragraphs: {speaker_patterns}")
