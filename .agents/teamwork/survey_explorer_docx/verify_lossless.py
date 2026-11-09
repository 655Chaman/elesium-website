import zipfile
import xml.etree.ElementTree as ET
import docx

DOCX_PATH = '/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/GROWTH SCALE - Complete Raw Verbatim Transcripts (Modules 1 - 9).docx'

print("=== 1. ZIPFILE ARCHIVE AUDIT ===")
with zipfile.ZipFile(DOCX_PATH, 'r') as z:
    file_list = z.namelist()
    print("Files in docx archive:")
    for f in sorted(file_list):
        info = z.getinfo(f)
        print(f"  {f:35s} {info.file_size:8,d} bytes")
    
    # Check for any footnotes, endnotes, comments, headers, footers
    special_parts = [f for f in file_list if any(k in f.lower() for k in ['footnote', 'endnote', 'comment', 'header', 'footer'])]
    print(f"\nFootnotes/Endnotes/Comments/Headers/Footers found: {special_parts}")

# Parse document.xml directly
with zipfile.ZipFile(DOCX_PATH, 'r') as z:
    doc_xml = z.read('word/document.xml')

root = ET.fromstring(doc_xml)
w_ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
ns = {'w': w_ns}

# Find all paragraphs in document.xml
xml_paras = root.findall('.//w:p', ns)
print(f"\nXML <w:p> count: {len(xml_paras)}")

# Compare with python-docx
doc = docx.Document(DOCX_PATH)
print(f"python-docx paragraphs count: {len(doc.paragraphs)}")
assert len(xml_paras) == len(doc.paragraphs), "Paragraph count mismatch!"

# Check if any XML paragraph contains text that python-docx doesn't get
mismatches = []
total_runs_xml = 0
total_t_xml = 0

for i, (p_xml, p_docx) in enumerate(zip(xml_paras, doc.paragraphs)):
    # In XML, text is in w:r/w:t or w:ins/w:r/w:t or w:smartTag etc.
    t_nodes = p_xml.findall('.//w:t', ns)
    xml_text = "".join(t.text for t in t_nodes if t.text)
    docx_text = p_docx.text
    
    # Also check if there are w:tab, w:br, w:cr, w:noBreakHyphen
    tabs = p_xml.findall('.//w:tab', ns)
    brs = p_xml.findall('.//w:br', ns)
    crs = p_xml.findall('.//w:cr', ns)
    dels = p_xml.findall('.//w:del', ns)
    del_texts = p_xml.findall('.//w:delText', ns)
    
    if tabs or brs or crs or dels or del_texts:
        print(f"Paragraph {i} has special nodes: tabs={len(tabs)}, brs={len(brs)}, crs={len(crs)}, dels={len(dels)}, del_texts={len(del_texts)}")
    
    if xml_text != docx_text:
        mismatches.append((i, xml_text, docx_text))

print(f"\nDirect comparison of XML <w:t> vs python-docx p.text:")
print(f"Total paragraph text mismatches: {len(mismatches)}")

if mismatches:
    for idx, xt, dt in mismatches[:5]:
        print(f"  P#{idx:04d}: XML len={len(xt)}, docx len={len(dt)}")
        print(f"    XML : {repr(xt[:60])}")
        print(f"    Docx: {repr(dt[:60])}")
else:
    print("PERFECT 100% EXACT MATCH between python-docx and XML <w:t> in every single paragraph!")

# Now check if there are any <w:t> nodes outside of <w:p>
all_t_nodes = root.findall('.//w:t', ns)
p_t_nodes = []
for p in xml_paras:
    p_t_nodes.extend(p.findall('.//w:t', ns))

print(f"\nAll <w:t> in document.xml: {len(all_t_nodes)}")
print(f"<w:t> inside <w:p>: {len(p_t_nodes)}")
assert len(all_t_nodes) == len(p_t_nodes), "There are <w:t> nodes outside <w:p>!"
print("All text in document.xml is strictly contained within paragraphs!")
