#!/usr/bin/env python3
"""
100% Lossless Transcript Extraction Script for GROWTH SCALE Course Transcripts
Source: /Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx

Extracts:
1. Exact per-module raw verbatim text files (.txt)
2. Per-module structured JSON files (.json) with video boundaries, paragraph indices, and word counts
3. Master manifest with complete corpus verification metrics
"""

import os
import sys
import json
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

def extract_docx(docx_path, output_dir):
    docx_path = Path(docx_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Verify docx existence
    if not docx_path.exists():
        raise FileNotFoundError(f"Source file not found: {docx_path}")
        
    # Read via python-docx if available, else direct XML
    paragraphs = []
    try:
        import docx
        doc = docx.Document(str(docx_path))
        for p in doc.paragraphs:
            paragraphs.append({
                'text': p.text,
                'style': p.style.name
            })
    except ImportError:
        # Fallback to direct XML parsing
        w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
        ns = {'w': w_ns}
        with zipfile.ZipFile(str(docx_path), 'r') as z:
            doc_xml = z.read('word/document.xml')
        root = ET.fromstring(doc_xml)
        for p_elem in root.findall('.//w:p', ns):
            # check style
            pStyle = p_elem.find('.//w:pStyle', ns)
            style_name = pStyle.get(f'{{{w_ns}}}val', 'normal') if pStyle is not None else 'normal'
            t_nodes = p_elem.findall('.//w:t', ns)
            text = "".join(t.text for t in t_nodes if t.text)
            paragraphs.append({
                'text': text,
                'style': style_name
            })

    total_paragraphs = len(paragraphs)
    all_text = "\n".join(p['text'] for p in paragraphs)
    total_words = len(all_text.split())
    total_chars = len(all_text)
    
    # Parse hierarchy: Header, Modules, Videos
    corpus = {
        'source_file': str(docx_path),
        'total_paragraphs': total_paragraphs,
        'total_words': total_words,
        'total_chars': total_chars,
        'header': {
            'title': paragraphs[0]['text'],
            'description': paragraphs[1]['text'],
            'word_count': len((paragraphs[0]['text'] + " " + paragraphs[1]['text']).split())
        },
        'modules': []
    }
    
    current_mod = None
    current_vid = None
    
    for idx, p in enumerate(paragraphs):
        text = p['text'].strip()
        style = p['style']
        
        if style == 'Heading 2' and text.startswith('MODULE'):
            if current_vid:
                current_vid['end_p'] = idx - 1
                current_vid = None
            if current_mod:
                current_mod['end_p'] = idx - 1
            mod_num = int(text.replace('MODULE', '').strip())
            current_mod = {
                'module_num': mod_num,
                'module_id': f"module_{mod_num:02d}",
                'module_title': text,
                'start_p': idx,
                'end_p': None,
                'special_note': None,
                'videos': []
            }
            corpus['modules'].append(current_mod)
        elif style == 'Heading 3':
            if current_vid:
                current_vid['end_p'] = idx - 1
            vid_idx = len(current_mod['videos']) + 1
            current_vid = {
                'video_index': vid_idx,
                'video_title': text,
                'start_p': idx,
                'end_p': None,
                'paragraphs': []
            }
            current_mod['videos'].append(current_vid)
        else:
            if current_mod and not current_mod['videos'] and text.startswith('['):
                current_mod['special_note'] = text
            if current_vid:
                current_vid['paragraphs'].append({
                    'p_idx': idx,
                    'text': p['text']
                })
                
    if current_vid:
        current_vid['end_p'] = total_paragraphs - 1
    if current_mod:
        current_mod['end_p'] = total_paragraphs - 1
        
    # Write modular extractions
    for m in corpus['modules']:
        mod_paragraphs = paragraphs[m['start_p']:m['end_p'] + 1]
        mod_raw_text = "\n".join(p['text'] for p in mod_paragraphs)
        m['paragraph_count'] = len(mod_paragraphs)
        m['word_count'] = len(mod_raw_text.split())
        m['char_count'] = len(mod_raw_text)
        
        for v in m['videos']:
            v_paras = paragraphs[v['start_p']:v['end_p'] + 1]
            v_text = "\n".join(p['text'] for p in v_paras)
            v['paragraph_count'] = len(v_paras)
            v['word_count'] = len(v_text.split())
            v['char_count'] = len(v_text)
            
        # Write module txt
        mod_txt_path = output_dir / f"{m['module_id']}_raw.txt"
        with open(mod_txt_path, 'w', encoding='utf-8') as f:
            f.write(mod_raw_text)
            
        # Write module json
        mod_json_path = output_dir / f"{m['module_id']}_meta.json"
        with open(mod_json_path, 'w', encoding='utf-8') as f:
            json.dump(m, f, indent=2, ensure_ascii=False)
            
    # Write master manifest
    manifest_path = output_dir / "master_manifest.json"
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(corpus, f, indent=2, ensure_ascii=False)
        
    print(f"Lossless extraction complete:")
    print(f"  Total Paragraphs : {corpus['total_paragraphs']:,}")
    print(f"  Total Words      : {corpus['total_words']:,}")
    print(f"  Total Characters : {corpus['total_chars']:,}")
    print(f"  Output Directory : {output_dir}")
    return corpus

if __name__ == '__main__':
    src = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
    out = '/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/survey_explorer_docx/extracted_corpus'
    extract_docx(src, out)
