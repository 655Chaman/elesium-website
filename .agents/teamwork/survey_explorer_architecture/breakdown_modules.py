import docx
import re
from collections import defaultdict

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

current_module = "HEADER"
modules = defaultdict(lambda: {"paragraphs": [], "lessons": []})

for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if p.style.name == 'Heading 2' and text.startswith('MODULE'):
        current_module = text
    
    modules[current_module]["paragraphs"].append((idx, text, p.style.name))
    if p.style.name == 'Heading 3':
        modules[current_module]["lessons"].append((idx, text))

print(f"{'MODULE':<12} | {'PARAGRAPHS':<10} | {'WORDS':<8} | {'LESSONS':<8}")
print("-" * 50)
total_words = 0
for mod_name in sorted(modules.keys()):
    if mod_name == "HEADER":
        continue
    paras = modules[mod_name]["paragraphs"]
    mod_text = " ".join([t for idx, t, st in paras if t])
    words = len(mod_text.split())
    total_words += words
    lessons = len(modules[mod_name]["lessons"])
    print(f"{mod_name:<12} | {len(paras):<10} | {words:<8} | {lessons:<8}")

print("-" * 50)
print(f"Total Words across all modules: {total_words}")
