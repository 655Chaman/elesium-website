import re
from pathlib import Path

def test_paragraph_discipline(file_path):
    text = Path(file_path).read_text(encoding='utf-8')
    lines = text.splitlines()
    
    paragraphs = []
    current_p = []
    in_code = False
    
    for line_num, line in enumerate(lines, 1):
        stripped = line.strip()
        if stripped.startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        
        # Skip headings, table rows, horizontal rules, blockquotes, list items
        if (stripped.startswith('#') or 
            stripped.startswith('|') or 
            stripped.startswith('---') or 
            stripped.startswith('- ') or 
            stripped.startswith('* ') or 
            re.match(r'^\d+\.\s', stripped) or
            stripped.startswith('>')):
            if current_p:
                paragraphs.append(current_p)
                current_p = []
            continue
        
        if not stripped:
            if current_p:
                paragraphs.append(current_p)
                current_p = []
        else:
            current_p.append((line_num, stripped))
            
    if current_p:
        paragraphs.append(current_p)
        
    violations = []
    for p in paragraphs:
        start_line = p[0][0]
        end_line = p[-1][0]
        full_text = ' '.join(t for _, t in p)
        
        # Split into sentences, handling common abbreviations and decimals
        cleaned = re.sub(r'\b(e\.g|i\.e|vs|Dr|Mr|Mrs|Ms|Prof)\.', r'\1<DOT>', full_text)
        cleaned = re.sub(r'(\d+)\.(\d+)', r'\1<DECIMAL>\2', cleaned)
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', cleaned) if s.strip()]
        
        if len(sentences) > 3:
            violations.append({
                'start_line': start_line,
                'end_line': end_line,
                'sentence_count': len(sentences),
                'text': full_text,
                'sentences': sentences
            })
            
    return len(paragraphs), violations

for f in ['SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md', 'SEO SOURCE/phase2/index.md']:
    total_p, viols = test_paragraph_discipline(f)
    print(f'File: {f}')
    print(f'  Total Prose Paragraphs: {total_p}')
    print(f'  Violations (> 3 sentences): {len(viols)}')
    for v in viols:
        print(f"    Lines {v['start_line']}-{v['end_line']} ({v['sentence_count']} sentences):")
        for s in v['sentences']:
            print(f"      - {s}")
