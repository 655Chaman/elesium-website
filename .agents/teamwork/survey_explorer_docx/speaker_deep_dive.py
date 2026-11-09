import docx
import re

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

# Collect all videos and first 500 words of each
current_mod = ""
videos = []
for idx, p in enumerate(doc.paragraphs):
    if p.style.name == 'Heading 2':
        current_mod = p.text.strip()
    elif p.style.name == 'Heading 3':
        videos.append({
            'module': current_mod,
            'title': p.text.strip(),
            'p_idx': idx,
            'paras': []
        })
    elif p.style.name == 'normal':
        if videos:
            videos[-1]['paras'].append(p.text)

print(f"Total videos: {len(videos)}")

for v_idx, v in enumerate(videos, 1):
    full_text = " ".join(v['paras'])
    words = full_text.split()
    intro_snip = " ".join(words[:120])
    
    # search for introduction phrases
    intro_matches = re.findall(r'(?:my name is|i am|i\'m|myself|this is|welcome to [^.]+with [A-Z][a-z]+|session by [A-Z][a-z]+)\s+([A-Z][a-zA-Z\s]{2,25})', full_text[:2000], re.IGNORECASE)
    
    print(f"\n--- Video {v_idx:02d}: [{v['module']}] {v['title']} ---")
    print(f"  Intro snippet: {intro_snip[:160]}...")
    if intro_matches:
        print(f"  Intro regex matches: {intro_matches[:3]}")
