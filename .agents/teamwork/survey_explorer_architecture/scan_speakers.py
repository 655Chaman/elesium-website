import docx
import re

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

print("=== CHECKING SPEAKERS IN TRANSCRIPTS ===")

for i, p in enumerate(doc.paragraphs):
    if p.style.name == 'Heading 3':
        print(f"\n--- {p.text} ---")
    elif p.text.strip():
        # Look for names, intros, or explicit speaker labels
        # check first 200 chars of text
        preview = p.text.strip()[:250].replace('\n', ' ')
        # check if it starts with a greeting or intro
        if any(term in preview.lower() for term in ["my name is", "i am", "this is", "welcome to", "by ", "kaushal", "trisha", "babu", "pepper"]):
            print(f"  [P#{i:04d}] {preview}")
