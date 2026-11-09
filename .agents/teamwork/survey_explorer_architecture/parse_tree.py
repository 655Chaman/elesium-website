import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

current_module = "HEADER"
current_lesson = "NONE"

module_tree = {}

for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if p.style.name == 'Heading 2' and text.startswith('MODULE'):
        current_module = text
        if current_module not in module_tree:
            module_tree[current_module] = {"lessons": {}, "direct_text": []}
        current_lesson = "NONE"
        continue
    
    if p.style.name == 'Heading 3':
        current_lesson = text
        if current_module not in module_tree:
            module_tree[current_module] = {"lessons": {}, "direct_text": []}
        module_tree[current_module]["lessons"][current_lesson] = []
        continue
    
    if text:
        if current_lesson != "NONE" and current_module in module_tree:
            module_tree[current_module]["lessons"][current_lesson].append((idx, text))
        elif current_module in module_tree:
            module_tree[current_module]["direct_text"].append((idx, text))

for mod, data in module_tree.items():
    print(f"\n==========================================")
    print(f"=== {mod} ===")
    print(f"==========================================")
    if data["direct_text"]:
        d_words = sum(len(t.split()) for idx, t in data["direct_text"])
        print(f"  [Direct Module Text/Notice: {len(data['direct_text'])} paragraphs, {d_words} words]")
        for idx, t in data["direct_text"][:3]:
            print(f"    P#{idx:04d}: {t[:80]}")
    print(f"  Lessons count: {len(data['lessons'])}")
    total_mod_words = sum(len(t.split()) for idx, t in data["direct_text"])
    for l_idx, (lesson_title, paras) in enumerate(data["lessons"].items(), 1):
        l_words = sum(len(t.split()) for idx, t in paras)
        total_mod_words += l_words
        print(f"    {l_idx}. {lesson_title} -> {len(paras)} paras, {l_words:,} words")
    print(f"  TOTAL {mod} WORDS: {total_mod_words:,}")
