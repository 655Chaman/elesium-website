import docx
import re
from collections import Counter

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

print("=== 1. CHECKING FOR TIMESTAMPS ===")
timestamp_patterns = [
    r'\b\d{1,2}:\d{2}(?::\d{2})?\b', # 12:34 or 1:23:45
    r'\[\d{1,2}:\d{2}\]',            # [12:34]
    r'\(\d{1,2}:\d{2}\)',            # (12:34)
    r'\b\d+\s*(?:mins?|seconds?|secs?|hours?)\b'
]

matches_by_pattern = {}
for p_idx, p in enumerate(doc.paragraphs):
    text = p.text
    # skip video titles
    if p.style.name.startswith('Heading'):
        continue
    for pat in timestamp_patterns:
        m = re.findall(pat, text)
        if m:
            matches_by_pattern.setdefault(pat, []).append((p_idx, m[:5], text[:100]))

for pat, matches in matches_by_pattern.items():
    print(f"Pattern {pat}: {len(matches)} matching paragraphs")
    for p_idx, m, snippet in matches[:5]:
        print(f"  P#{p_idx:04d}: found {m} in snippet: {snippet}")

print("\n=== 2. CHECKING FOR SPEAKER LABELS / DIARIZATION ===")
# Look for lines starting with name or speaker label like "Speaker:", "Piyush:", "Host:", "John Doe:"
speaker_colon_pattern = r'^([A-Z][A-Za-z0-9\s]{1,30}):\s*(.*)'
speaker_matches = []
for p_idx, p in enumerate(doc.paragraphs):
    text = p.text.strip()
    if p.style.name.startswith('Heading'):
        continue
    m = re.match(speaker_colon_pattern, text)
    if m:
        speaker_matches.append((p_idx, m.group(1), m.group(2)[:80]))

print(f"Paragraphs starting with '<Name>:': {len(speaker_matches)}")
for p_idx, spk, snip in speaker_matches[:20]:
    print(f"  P#{p_idx:04d}: [{spk}] -> {snip}")

# Look for inline speaker patterns (e.g. "Speaker 1:", "[Speaker 1]", etc.)
inline_speaker_pattern = r'(\b(?:Speaker\s*\d+|Host|Guest|Interviewer|Interviewee|Audience|Attendee)\b[:\-])'
inline_matches = []
for p_idx, p in enumerate(doc.paragraphs):
    text = p.text
    if p.style.name.startswith('Heading'):
        continue
    m = re.findall(inline_speaker_pattern, text, re.IGNORECASE)
    if m:
        inline_matches.append((p_idx, m, text[:100]))

print(f"\nParagraphs with inline generic speaker labels (Speaker X, Host, Guest): {len(inline_matches)}")
for p_idx, m, snip in inline_matches[:10]:
    print(f"  P#{p_idx:04d}: found {m} in {snip}")

# Let's inspect why some videos have 500+ paragraphs vs 1-2 paragraphs
print("\n=== 3. PARAGRAPH LENGTH DISTRIBUTION ===")
lengths = [len(p.text.split()) for p in doc.paragraphs if p.style.name == 'normal']
print(f"Normal paragraphs: {len(lengths)}")
print(f"Min words: {min(lengths)}, Max words: {max(lengths)}, Average words: {sum(lengths)/len(lengths):.1f}")
print("Distribution:")
print("  0 words:", sum(1 for l in lengths if l == 0))
print("  1-10 words:", sum(1 for l in lengths if 1 <= l <= 10))
print("  11-50 words:", sum(1 for l in lengths if 11 <= l <= 50))
print("  51-200 words:", sum(1 for l in lengths if 51 <= l <= 200))
print("  201-1000 words:", sum(1 for l in lengths if 201 <= l <= 1000))
print("  > 1000 words:", sum(1 for l in lengths if l > 1000))

# Let's inspect paragraphs in Module 5 Video 3 (Sitemaps)
print("\n=== 4. INSPECTING MODULE 5 VIDEO 3 (SITEMAPS - 579 PARAS) ===")
for p_idx in range(130, 145):
    print(f"P#{p_idx:04d}: {repr(doc.paragraphs[p_idx].text[:80])}")

# Let's inspect Module 8 Video 3 and 4 (Local SEO)
print("\n=== 5. COMPARING MODULE 8 VIDEO 3 AND VIDEO 4 ===")
v3_text = "\n".join([doc.paragraphs[i].text for i in range(1501, 1503)])
v4_text = "\n".join([doc.paragraphs[i].text for i in range(1503, 1505)])
print(f"Video 3 (Local SEO.mp4) length: {len(v3_text)} chars, words: {len(v3_text.split())}")
print(f"Video 4 (Local SEO (1).mp4) length: {len(v4_text)} chars, words: {len(v4_text.split())}")
print("Are texts identical?", v3_text.strip() == v4_text.strip())
if v3_text.strip() != v4_text.strip():
    # find differences
    print("V3 first 200 chars:", repr(v3_text[:200]))
    print("V4 first 200 chars:", repr(v4_text[:200]))
