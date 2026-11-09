import os
import sys
import zipfile
import xml.etree.ElementTree as ET
import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'

print("=== DOCX FILE STATS ===")
file_size = os.path.getsize(DOCX_PATH)
print(f"File size: {file_size:,} bytes")

# 1. Inspect using python-docx
doc = docx.Document(DOCX_PATH)
paragraphs = doc.paragraphs
tables = doc.tables

print(f"Number of paragraphs in docx: {len(paragraphs):,}")
print(f"Number of tables in docx: {len(tables):,}")

# Check text in tables if any
total_table_text = ""
if tables:
    for t_idx, table in enumerate(tables):
        for r_idx, row in enumerate(table.rows):
            for c_idx, cell in enumerate(row.cells):
                total_table_text += cell.text + " "
    print(f"Table word count: {len(total_table_text.split()):,}")

# Total words and chars in paragraphs
all_p_texts = [p.text for p in paragraphs]
total_p_text = "\n".join(all_p_texts)
words = total_p_text.split()
total_chars = len(total_p_text)
total_chars_no_space = len(total_p_text.replace(" ", "").replace("\n", ""))

print(f"Total paragraph text length (chars with spaces/newlines): {total_chars:,}")
print(f"Total characters (no whitespace): {total_chars_no_space:,}")
print(f"Total words (split whitespace): {len(words):,}")

# 2. Inspect raw XML from zipfile
with zipfile.ZipFile(DOCX_PATH, 'r') as z:
    doc_xml_bytes = z.read('word/document.xml')

root = ET.fromstring(doc_xml_bytes)
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

# Find all text elements <w:t>
t_elements = root.findall('.//w:t', ns)
raw_xml_text = "".join([t.text for t in t_elements if t.text])
raw_xml_words = raw_xml_text.split()

print("\n=== RAW XML COMPARISON ===")
print(f"Total <w:t> elements: {len(t_elements):,}")
print(f"Total text chars in <w:t>: {len(raw_xml_text):,}")
print(f"Total words in <w:t>: {len(raw_xml_words):,}")

# Check other XML tags in document.xml (e.g. w:tab, w:br, w:cr, w:sym)
tabs = root.findall('.//w:tab', ns)
brs = root.findall('.//w:br', ns)
crs = root.findall('.//w:cr', ns)
syms = root.findall('.//w:sym', ns)
print(f"Tabs: {len(tabs)}, Breaks (w:br): {len(brs)}, Carriage returns (w:cr): {len(crs)}, Symbols: {len(syms)}")

# Let's inspect first 50 paragraphs and find module headings
print("\n=== SCANNING FOR HEADINGS & MODULES ===")
for i, p in enumerate(paragraphs[:100]):
    text = p.text.strip()
    if text:
        # print if it looks like a heading
        if any(keyword in text.upper() for keyword in ["MODULE", "GROWTH", "SCALE", "CHAPTER", "TRANSCRIPT", "LESSON"]):
            print(f"P#{i:04d} (style={p.style.name}): {text[:120]}")
