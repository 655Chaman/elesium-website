#!/usr/bin/env python3
"""
automation/extract_geo_curriculum.py
Extracts and indexes the complete GEO (Generative Engine Optimization) curriculum.
"""

import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
import hashlib
import json

BASE_DIR = Path(__file__).resolve().parent.parent
DOCX_PATH = BASE_DIR / "SEO SOURCE" / "GEO - Generative Engine Optimization_ Complete Raw Transcripts & Master Guide.docx"
OUT_DIR = BASE_DIR / "SEO SOURCE" / "geo_master_curriculum"
OUT_DIR.mkdir(parents=True, exist_ok=True)

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W_NS}

with zipfile.ZipFile(DOCX_PATH, "r") as z:
    doc_xml = z.read("word/document.xml")

root = ET.fromstring(doc_xml)
sections = []
current = {"title": "Header", "paras": []}

for p in root.findall(".//w:p", NS):
    pStyle = p.find(".//w:pStyle", NS)
    style = pStyle.get(f"{{{W_NS}}}val", "Normal") if pStyle is not None else "Normal"
    t_nodes = p.findall(".//w:t", NS)
    text = "".join(t.text for t in t_nodes if t.text).strip()
    if not text:
        continue
    if "Heading2" in style:
        if current["paras"]:
            sections.append(current)
        current = {"title": text, "paras": []}
    else:
        current["paras"].append({"style": style, "text": text})
if current["paras"]:
    sections.append(current)

manifest = []

for idx, sec in enumerate(sections):
    title = sec["title"]
    paras = sec["paras"]
    p_lines = []
    for p in paras:
        sty = p["style"]
        txt = p["text"]
        if sty != "Normal":
            p_lines.append(f"[{sty}] {txt}")
        else:
            p_lines.append(txt)
    full_text = "\n\n".join(p_lines)
    words = len(full_text.split())
    sha256 = hashlib.sha256(full_text.encode("utf-8")).hexdigest()
    slug = f"session_{idx:02d}_{title.lower()}"
    slug = "".join(c if c.isalnum() or c in "-_" else "_" for c in slug)[:60]
    file_path = OUT_DIR / f"{slug}.md"
    file_path.write_text(f"# {title}\n\n**Paragraphs:** {len(paras)} | **Words:** {words} | **SHA-256:** `{sha256}`\n\n---\n\n{full_text}\n", encoding="utf-8")
    manifest.append({
        "section_idx": idx,
        "title": title,
        "paragraphs": len(paras),
        "words": words,
        "sha256": sha256,
        "file": str(file_path.name)
    })

(OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

# Also write index.md
index_lines = [
    "# GEO (Generative Engine Optimization) Master Curriculum & Transcripts",
    "",
    "## Executive Ingestion Ledger",
    f"- **Source File:** `GEO - Generative Engine Optimization_ Complete Raw Transcripts & Master Guide.docx`",
    f"- **Total Sections/Sessions:** {len(manifest)}",
    f"- **Total Words:** {sum(m['words'] for m in manifest)}",
    f"- **Total Paragraphs:** {sum(m['paragraphs'] for m in manifest)}",
    f"- **Instructor:** Chris M. Walker (Legiit / Superstar SEO)",
    f"- **Program:** Automation & Marketing Society (AMS)",
    "",
    "| # | Session Title | Words | Paras | File |",
    "| :--- | :--- | :---: | :---: | :--- |",
]

for m in manifest:
    idx_num = m['section_idx']
    t = m['title']
    w = m['words']
    p_cnt = m['paragraphs']
    f_name = m['file']
    index_lines.append(f"| {idx_num} | {t} | {w:,} | {p_cnt} | [{f_name}](./{f_name}) |")

(OUT_DIR / "index.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
print(f"Successfully extracted {len(sections)} sections into {OUT_DIR}")
