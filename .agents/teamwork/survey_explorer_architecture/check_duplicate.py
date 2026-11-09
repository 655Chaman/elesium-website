import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'
doc = docx.Document(DOCX_PATH)

p_1501 = doc.paragraphs[1501].text
p_1502 = doc.paragraphs[1502].text
p_1503 = doc.paragraphs[1503].text
p_1504 = doc.paragraphs[1504].text

print(f"P1501: {p_1501}")
print(f"P1503: {p_1503}")
print(f"P1502 == P1504: {p_1502 == p_1504}")
print(f"Length of P1502: {len(p_1502)}, Length of P1504: {len(p_1504)}")
