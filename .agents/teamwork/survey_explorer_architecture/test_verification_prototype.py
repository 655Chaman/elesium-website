import docx
import re
import hashlib
from pathlib import Path

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'

def compute_source_telemetry():
    doc = docx.Document(DOCX_PATH)
    modules = {}
    current_module = "HEADER"
    
    for p in doc.paragraphs:
        t = p.text.strip()
        if p.style.name == 'Heading 2' and t.startswith('MODULE'):
            current_module = t
            modules[current_module] = []
            continue
        if current_module in modules and t:
            modules[current_module].append(t)
            
    telemetry = {}
    total_words = 0
    for mod, paras in modules.items():
        full_text = " ".join(paras)
        words = len(full_text.split())
        chars = len(full_text)
        sha = hashlib.sha256(full_text.encode('utf-8')).hexdigest()
        telemetry[mod] = {
            "paragraphs": len(paras),
            "words": words,
            "chars": chars,
            "sha256": sha
        }
        total_words += words
        
    return telemetry, total_words

if __name__ == '__main__':
    telemetry, total = compute_source_telemetry()
    print(f"Total Source Words: {total:,}")
    for mod, data in sorted(telemetry.items()):
        print(f"{mod}: {data['words']:,} words, {data['paragraphs']} paragraphs, SHA256: {data['sha256'][:12]}...")
