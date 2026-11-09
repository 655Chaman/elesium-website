import docx
import re
from collections import defaultdict

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

print(f"Total paragraphs: {len(doc.paragraphs)}")

# Let's inspect paragraphs 0 to 5, and 90 to 105
print("\n--- Inspecting P#0000 to P#0010 ---")
for i in range(11):
    print(f"P#{i:04d} [{doc.paragraphs[i].style.name}]: {repr(doc.paragraphs[i].text[:80])}")

print("\n--- Inspecting P#0090 to P#0102 ---")
for i in range(90, 103):
    print(f"P#{i:04d} [{doc.paragraphs[i].style.name}]: {repr(doc.paragraphs[i].text[:80])}")
