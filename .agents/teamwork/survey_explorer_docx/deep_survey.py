import docx
import re
import json

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

print("=== INTRO PARAGRAPHS ===")
print("P#0:", repr(doc.paragraphs[0].text))
print("P#1:", repr(doc.paragraphs[1].text))

modules = []
current_mod = None
current_vid = None

for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    style = p.style.name
    
    if style == 'Heading 2' and text.startswith('MODULE'):
        if current_vid:
            current_vid['end_p'] = idx - 1
            current_vid = None
        if current_mod:
            current_mod['end_p'] = idx - 1
        current_mod = {
            'module_name': text,
            'start_p': idx,
            'end_p': None,
            'videos': [],
            'special_note': None
        }
        modules.append(current_mod)
    elif style == 'Heading 3':
        if current_vid:
            current_vid['end_p'] = idx - 1
        current_vid = {
            'video_title': text,
            'start_p': idx,
            'end_p': None
        }
        current_mod['videos'].append(current_vid)
    else:
        # normal or other
        if current_mod and not current_mod['videos'] and text.startswith('['):
            current_mod['special_note'] = text

if current_vid:
    current_vid['end_p'] = len(doc.paragraphs) - 1
if current_mod:
    current_mod['end_p'] = len(doc.paragraphs) - 1

print("\n=== MODULE SUMMARY ===")
total_all_words = 0
total_all_chars = 0

module_stats = []

for m in modules:
    mod_text = ""
    for p_idx in range(m['start_p'], m['end_p'] + 1):
        mod_text += doc.paragraphs[p_idx].text + "\n"
    
    w_count = len(mod_text.split())
    c_count = len(mod_text)
    total_all_words += w_count
    total_all_chars += c_count
    
    m_info = {
        'module_name': m['module_name'],
        'start_p': m['start_p'],
        'end_p': m['end_p'],
        'p_count': m['end_p'] - m['start_p'] + 1,
        'special_note': m['special_note'],
        'video_count': len(m['videos']),
        'word_count': w_count,
        'char_count': c_count,
        'videos': []
    }
    
    print(f"\n{m['module_name']}: Paragraphs P#{m['start_p']:04d} to P#{m['end_p']:04d} ({m_info['p_count']} paragraphs)")
    if m['special_note']:
        print(f"  NOTE: {m['special_note']}")
    print(f"  Videos: {len(m['videos'])}")
    print(f"  Words: {w_count:,} | Characters (with spaces): {c_count:,}")
    
    for v_idx, v in enumerate(m['videos'], 1):
        v_text = doc.paragraphs[v['start_p']].text + "\n"
        for p_idx in range(v['start_p'] + 1, v['end_p'] + 1):
            v_text += doc.paragraphs[p_idx].text + "\n"
        vw = len(v_text.split())
        vc = len(v_text)
        vp_count = v['end_p'] - v['start_p'] + 1
        
        v_info = {
            'video_index': v_idx,
            'video_title': v['video_title'],
            'start_p': v['start_p'],
            'end_p': v['end_p'],
            'p_count': vp_count,
            'word_count': vw,
            'char_count': vc
        }
        m_info['videos'].append(v_info)
        print(f"    {v_idx:02d}. [{v['start_p']:04d}-{v['end_p']:04d}] ({vp_count:3d} paras, {vw:6,d} w): {v['video_title']}")
    
    module_stats.append(m_info)

header_words = len((doc.paragraphs[0].text + "\n" + doc.paragraphs[1].text).split())
header_chars = len(doc.paragraphs[0].text + "\n" + doc.paragraphs[1].text)

print(f"\nHeader text words: {header_words}")
print(f"Header text chars: {header_chars}")
print(f"TOTAL WORDS across all modules: {total_all_words:,}")
print(f"TOTAL DOCX WORDS (including header): {header_words + total_all_words:,}")
print(f"TOTAL DOCX CHARACTERS (including header): {header_chars + total_all_chars + 1:,}")

with open('/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/survey_explorer_docx/module_stats.json', 'w') as f:
    json.dump({
        'header': {
            'p0': doc.paragraphs[0].text,
            'p1': doc.paragraphs[1].text,
            'word_count': header_words,
            'char_count': header_chars
        },
        'total_paragraphs': len(doc.paragraphs),
        'total_words': header_words + total_all_words,
        'total_chars': header_chars + total_all_chars + 1,
        'modules': module_stats
    }, f, indent=2)
