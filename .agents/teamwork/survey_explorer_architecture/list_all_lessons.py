import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

current_module = "HEADER"
current_lesson = "NONE"
lesson_data = []

cur_mod_num = 0
cur_lesson_title = ""
cur_lesson_words = 0
cur_lesson_chars = 0
cur_lesson_start = 0

for idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if p.style.name == 'Heading 2' and text.startswith('MODULE'):
        current_module = text
    elif p.style.name == 'Heading 3':
        if cur_lesson_title:
            lesson_data.append((current_module, cur_lesson_title, cur_lesson_start, cur_lesson_words, cur_lesson_chars))
        cur_lesson_title = text
        cur_lesson_start = idx
        cur_lesson_words = 0
        cur_lesson_chars = 0
    else:
        if text:
            cur_lesson_words += len(text.split())
            cur_lesson_chars += len(text)

if cur_lesson_title:
    lesson_data.append((current_module, cur_lesson_title, cur_lesson_start, cur_lesson_words, cur_lesson_chars))

print(f"{'MODULE':<10} | {'START_P':<8} | {'WORDS':<8} | {'CHARS':<10} | {'LESSON TITLE'}")
print("-" * 90)
for mod, title, start_p, words, chars in lesson_data:
    print(f"{mod:<10} | {start_p:<8} | {words:<8} | {chars:<10} | {title}")

print("-" * 90)
print(f"Total Lessons Identified: {len(lesson_data)}")
