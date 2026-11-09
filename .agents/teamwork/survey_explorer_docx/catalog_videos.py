import docx
import re
import json

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

videos = []
current_mod = ""
current_mod_idx = 0

modules_data = []

current_mod_obj = None

for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    style = p.style.name
    
    if style == 'Heading 2' and text.startswith('MODULE'):
        if current_mod_obj:
            modules_data.append(current_mod_obj)
        current_mod_idx += 1
        current_mod_obj = {
            'module_num': current_mod_idx,
            'module_title': text,
            'start_p': idx,
            'end_p': None,
            'videos': [],
            'special_note': None
        }
    elif style == 'Heading 3':
        v_obj = {
            'video_idx_in_module': len(current_mod_obj['videos']) + 1,
            'title': text,
            'header_p': idx,
            'paras': []
        }
        current_mod_obj['videos'].append(v_obj)
    elif style == 'normal':
        if current_mod_obj and not current_mod_obj['videos'] and text.startswith('['):
            current_mod_obj['special_note'] = text
        elif current_mod_obj and current_mod_obj['videos']:
            current_mod_obj['videos'][-1]['paras'].append((idx, p.text))

if current_mod_obj:
    modules_data.append(current_mod_obj)

# finalize end_p
for i, m in enumerate(modules_data):
    if i < len(modules_data) - 1:
        m['end_p'] = modules_data[i+1]['start_p'] - 1
    else:
        m['end_p'] = len(doc.paragraphs) - 1

print(f"Total modules: {len(modules_data)}")

# Now analyze each video
global_video_idx = 0
all_video_records = []

for m in modules_data:
    m_words = 0
    m_chars = 0
    print(f"\n{'='*70}")
    print(f"MODULE {m['module_num']}: {m['module_title']} (P#{m['start_p']:04d} - P#{m['end_p']:04d})")
    if m['special_note']:
        print(f"  SPECIAL STATUS: {m['special_note']}")
    print(f"  Videos in module: {len(m['videos'])}")
    
    for v in m['videos']:
        global_video_idx += 1
        p_count = len(v['paras'])
        start_p = v['header_p']
        end_p = v['paras'][-1][0] if v['paras'] else v['header_p']
        
        # text calculation: include header line + paragraph lines
        full_text = doc.paragraphs[v['header_p']].text + "\n" + "\n".join(p[1] for p in v['paras'])
        body_text = "\n".join(p[1] for p in v['paras'])
        words = len(body_text.split())
        chars = len(body_text)
        m_words += words
        m_chars += chars
        
        # Check timestamps
        ts_count = sum(1 for p in v['paras'] if re.match(r'^\d{1,2}:\d{2}\b', p[1].strip()))
        
        if ts_count > 0:
            fmt = f"Timestamped Subtitle ({ts_count} lines with MM:SS)"
        elif p_count > 5:
            fmt = f"Segmented Prose ({p_count} paragraphs)"
        else:
            fmt = f"Continuous Prose Block ({p_count} paragraph{'s' if p_count>1 else ''})"
            
        # Detect speaker/role in title or intro
        speaker_hint = "Primary Instructor"
        t_lower = v['title'].lower()
        if 'trisha vaidya' in t_lower:
            speaker_hint = "Trisha Vaidya (COO, Dr. Vaidya's)"
        elif 'pepper content' in t_lower:
            speaker_hint = "Sudeep Pagedar (Pepper Content)"
        elif 'babu chakroborty' in t_lower:
            speaker_hint = "Babu Chakroborty (Head of Digital Marketing & Analytics)"
        elif 'kaushal' in t_lower:
            speaker_hint = "Kaushal (Week 3 QnA Host)"
        elif 'push sha' in body_text[:300].lower() or 'piyush' in body_text[:300].lower() or 'head of seo at dukan' in body_text[:300].lower():
            speaker_hint = "Piyush Shah (Head of SEO, Dukaan) / Host"
        elif 'botpresso' in body_text[:500].lower() or 'started my my professional career' in body_text[:500].lower() and 'flipkart' in body_text[:500].lower():
            speaker_hint = "Nitin Manchanda (Founder Botpresso, ex-Flipkart/Trivago/Omio)"
        elif 'burkello' in body_text[:500].lower() or 'director of seo content' in body_text[:500].lower():
            speaker_hint = "Director of SEO Content Distribution / Burkello"
        elif 'currently working with amazon' in body_text[:500].lower():
            speaker_hint = "Amazon Marketing Manager (Guest Speaker)"
        elif 'ani' in body_text[:150].lower() and 'sheets' in t_lower:
            speaker_hint = "Ani / Anirudh (AI Tools & Sheets)"
        elif 'anirut' in body_text[:150].lower():
            speaker_hint = "Anirudh (Generative AI & Marketing)"
        elif 'webh' in body_text[:150].lower() or 'webhulindi' in body_text[:150].lower() or 'we hosti' in body_text[:150].lower() or 'web hostindi' in body_text[:150].lower():
            speaker_hint = "Vaibhav Sisinty (GrowthSchool / Growth Scale)"
        elif 'anna' in body_text[:200].lower() and 'seven years of experience' in body_text[:200].lower():
            speaker_hint = "Anna (Guest Speaker, E-Commerce SEO)"
            
        rec = {
            'global_video_idx': global_video_idx,
            'module_num': m['module_num'],
            'module_title': m['module_title'],
            'video_title': v['title'],
            'start_p': start_p,
            'end_p': end_p,
            'body_paragraphs': p_count,
            'body_words': words,
            'body_chars': chars,
            'format_type': fmt,
            'speaker_identified': speaker_hint,
            'first_50_words': " ".join(body_text.split()[:50])
        }
        all_video_records.append(rec)
        print(f"  Vid {global_video_idx:02d} (Mod {m['module_num']}.{v['video_idx_in_module']}): P#{start_p:04d}-P#{end_p:04d} | {p_count:3d} paras | {words:6,d} words | {fmt} | Speaker: {speaker_hint}")
        print(f"         Title: {v['title']}")

print(f"\nTotal video records: {len(all_video_records)}")
with open('/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/survey_explorer_docx/all_videos_catalog.json', 'w') as f:
    json.dump(all_video_records, f, indent=2)
