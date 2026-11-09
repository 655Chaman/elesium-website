import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

for i in [3, 4, 97, 98, 99, 100, 110, 111, 112]:
    p = doc.paragraphs[i]
    words = len(p.text.split())
    print(f"P#{i:04d} ({p.style.name}): len={len(p.text)} chars, words={words} | preview: {p.text[:120]}...")
