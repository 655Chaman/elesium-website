import docx
import re
import difflib

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

# Let's map each video and analyze its formatting type
# Type A: Subtitle style with timestamps (e.g. "00:01 Hello...")
# Type B: Multi-paragraph without timestamps
# Type C: Single/few massive paragraph(s)

current_mod = ""
current_vid = ""
vid_data = []

for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    style = p.style.name
    
    if style == 'Heading 2':
        current_mod = text
    elif style == 'Heading 3':
        vid_data.append({
            'module': current_mod,
            'title': text,
            'header_p': idx,
            'paragraphs': []
        })
    elif style == 'normal':
        if vid_data:
            vid_data[-1]['paragraphs'].append((idx, p.text))

print(f"Total videos identified: {len(vid_data)}")

for v in vid_data:
    paras = v['paragraphs']
    p_count = len(paras)
    total_words = sum(len(p[1].split()) for p in paras)
    
    # Check for timestamps at start of paragraphs
    ts_paras = sum(1 for p in paras if re.match(r'^\d{1,2}:\d{2}\b', p[1].strip()))
    
    # Check formatting category
    if ts_paras > 0:
        format_type = f"Timestamped Subtitle format ({ts_paras}/{p_count} paras have MM:SS)"
    elif p_count > 10:
        format_type = f"Multi-paragraph prose ({p_count} paras)"
    else:
        format_type = f"Continuous prose block ({p_count} paras)"
    
    print(f"\n[{v['module']}] {v['title']}")
    print(f"  P#{v['header_p']:04d} -> P#{paras[-1][0]:04d} | Paras: {p_count} | Words: {total_words:,} | Type: {format_type}")
    
    # Sample first paragraph
    first_p = paras[0][1].strip()
    print(f"  First snippet: {repr(first_p[:90])}")

# Compare Module 8 Video 3 and Video 4
print("\n" + "="*50)
print("=== DETAILED DIFF: MODULE 8 VIDEO 3 vs VIDEO 4 ===")
v3 = [v for v in vid_data if 'Local SEO.mp4' in v['title']][0]
v4 = [v for v in vid_data if 'Local SEO (1).mp4' in v['title']][0]

v3_full = "\n".join(p[1] for p in v3['paragraphs'])
v4_full = "\n".join(p[1] for p in v4['paragraphs'])

diff = list(difflib.ndiff(v3_full.splitlines(keepends=True), v4_full.splitlines(keepends=True)))
diff_lines = [l for l in diff if l.startswith('+ ') or l.startswith('- ')]
print(f"Total diff lines between V3 and V4: {len(diff_lines)}")
for d in diff_lines:
    print(d)

if not diff_lines:
    print("The transcript bodies are character-by-character IDENTICAL (except possibly whitespace)!")
    print(f"v3_full == v4_full: {v3_full == v4_full}")
    if v3_full != v4_full:
        for i, (c1, c2) in enumerate(zip(v3_full, v4_full)):
            if c1 != c2:
                print(f"First mismatch at index {i}: v3={repr(c1)}, v4={repr(c2)}")
                print(f"Surrounding: v3={repr(v3_full[max(0,i-20):i+20])}")
                print(f"Surrounding: v4={repr(v4_full[max(0,i-20):i+20])}")
                break
