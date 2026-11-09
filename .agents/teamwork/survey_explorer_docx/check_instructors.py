import docx
import re

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

def inspect_video_speaker(p_start, p_end):
    text = " ".join(doc.paragraphs[p].text for p in range(p_start, p_end + 1))
    # look for mentions of names, companies, roles
    print("Length:", len(text), "chars | Words:", len(text.split()))
    # print first 300 words
    words = text.split()
    print("Start:", " ".join(words[:100]))
    print("---")

# Let's inspect Video 1, 2, 3
print("=== VIDEO 1 (SEO at Scale) ===")
inspect_video_speaker(3, 4)

print("=== VIDEO 2 (A SEO Case Study) ===")
inspect_video_speaker(5, 6)

print("=== VIDEO 3 (The SEO & Content Game-Changers) ===")
inspect_video_speaker(7, 8)

print("=== VIDEO 6 (Organic Traffic) ===")
inspect_video_speaker(41, 51)

print("=== MODULE 4 VIDEO 1 (Crawling & Screaming Frog) ===")
inspect_video_speaker(111, 112)

print("=== MODULE 4 VIDEO 6 (Week 3 QnA session with Kaushal) ===")
inspect_video_speaker(121, 122)
