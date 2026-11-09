#!/usr/bin/env python3
"""
automation/compile_executive_bible_docx.py
=============================================================================
Publication-Grade Markdown-to-DOCX Compiler for The Growth Scale Executive Bible
Engineered with python-docx 1.2.0 and low-level OXML styling:
  - 1.0-inch margins all around with distinct first-page header/footer
  - Running Header: "THE GROWTH SCALE EXECUTIVE BIBLE | ENTERPRISE PRODUCTION SPECIFICATION" (Slate-400 #94A3B8)
  - Running Footer: "CONFIDENTIAL & PROPRIETARY — ELESIUM INTELLIGENCE CORE — ALL RIGHTS RESERVED" (Slate-400 #94A3B8)
  - Typography Hierarchy:
      * Document Title: Arial 24pt Bold (#0F172A)
      * Document Subtitle: Arial 12pt Regular (#475569)
      * Heading 1 (Volumes): Arial 17pt Bold (#0F172A)
      * Heading 2 (Major Sections): Arial 13pt Bold (#1E293B)
      * Heading 3 (Subsections): Arial 11pt Bold (#334155)
      * Body Paragraphs: Arial 10pt Regular (#334155), line spacing 1.15
  - Callout Directive Boxes: Single-cell table, 6.5in width, #F8FAFC fill, 28pt left border in #0F172A
  - Data Tables: Dark slate header #0F172A with white bold text, alternating light rows #F8FAFC, subtle #E2E8F0 borders
  - Code Blocks: Shaded dark slate background #0F172A, Courier New 8.5pt text #F1F5F9

Usage:
  python3 automation/compile_executive_bible_docx.py \
    --input "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md" \
    --output "SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.docx"
"""

import sys
import os
import re
import io
import zipfile
import argparse
from pathlib import Path
from typing import List, Tuple, Optional, Dict, Any

try:
    import docx
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
    from docx.oxml import OxmlElement, parse_xml
    from docx.oxml.ns import nsdecls, qn
except ImportError as e:
    sys.stderr.write(f"ERROR: python-docx is required. Please install python-docx. ({e})\n")
    sys.exit(1)


# -----------------------------------------------------------------------------
# PALETTE DEFINITIONS (Tailwind Slate Theme)
# -----------------------------------------------------------------------------
COLOR_SLATE_900 = RGBColor(15, 23, 42)    # #0F172A Primary Headings / Titles
COLOR_SLATE_800 = RGBColor(30, 41, 59)    # #1E293B Secondary Headings
COLOR_SLATE_700 = RGBColor(51, 65, 85)    # #334155 Body Text & Subsections
COLOR_SLATE_600 = RGBColor(71, 85, 105)   # #475569 Subtitles & Meta
COLOR_SLATE_400 = RGBColor(148, 163, 184) # #94A3B8 Headers & Footers
COLOR_SKY_600   = RGBColor(2, 132, 199)   # #0284C7 Accent / Hyperlinks
COLOR_WHITE     = RGBColor(255, 255, 255) # #FFFFFF Table Headers
COLOR_CODE_TEXT = RGBColor(241, 245, 249) # #F1F5F9 Code Text


# -----------------------------------------------------------------------------
# OXML FORMATTING HELPERS
# -----------------------------------------------------------------------------
def set_cell_background(cell, fill_hex: str):
    """Set background color of a table cell via w:shd."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)


def set_cell_margins(cell, top: int = 100, bottom: int = 100, left: int = 140, right: int = 140):
    """Set internal cell margins (padding) in dxa (1 pt = 20 dxa)."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)


def set_table_borders(table, border_color: str = "E2E8F0"):
    """Set clean horizontal-only table borders."""
    tblPr = table._tbl.tblPr
    tblBorders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
        f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{border_color}"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(tblBorders)


def set_callout_borders(cell, border_color: str = "0F172A", border_sz: int = 28):
    """Set thick left callout border, clear other borders."""
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="{border_sz}" w:space="0" w:color="{border_color}"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)


# -----------------------------------------------------------------------------
# INLINE FORMATTING PARSER
# -----------------------------------------------------------------------------
TOKEN_PATTERN = re.compile(
    r"(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`[^`]+`|\[.*?\]\(.*?\))"
)

def add_formatted_runs(
    paragraph,
    text: str,
    default_font: str = "Arial",
    default_size: Pt = Pt(10),
    default_color: RGBColor = COLOR_SLATE_700,
    default_bold: bool = False,
    default_italic: bool = False
):
    """
    Parse inline Markdown formatting (bold, italic, inline code, links)
    and append formatted runs to a paragraph.
    """
    # Clean up escaping if present
    text = text.replace(r"\*", "*").replace(r"\_", "_")

    parts = TOKEN_PATTERN.split(text)
    for part in parts:
        if not part:
            continue

        # Bold & Italic: ***text***
        if part.startswith("***") and part.endswith("***") and len(part) >= 6:
            inner = part[3:-3]
            run = paragraph.add_run(inner)
            run.font.name = default_font
            run.font.size = default_size
            run.font.bold = True
            run.font.italic = True
            run.font.color.rgb = default_color

        # Bold: **text**
        elif part.startswith("**") and part.endswith("**") and len(part) >= 4:
            inner = part[2:-2]
            run = paragraph.add_run(inner)
            run.font.name = default_font
            run.font.size = default_size
            run.font.bold = True
            run.font.italic = default_italic
            run.font.color.rgb = COLOR_SLATE_900 if default_color == COLOR_SLATE_700 else default_color

        # Italic: *text*
        elif part.startswith("*") and part.endswith("*") and len(part) >= 2:
            inner = part[1:-1]
            run = paragraph.add_run(inner)
            run.font.name = default_font
            run.font.size = default_size
            run.font.bold = default_bold
            run.font.italic = True
            run.font.color.rgb = default_color

        # Inline Code: `code`
        elif part.startswith("`") and part.endswith("`") and len(part) >= 2:
            inner = part[1:-1]
            run = paragraph.add_run(inner)
            run.font.name = "Courier New"
            run.font.size = Pt(default_size.pt * 0.9)
            run.font.bold = False
            run.font.italic = False
            run.font.color.rgb = COLOR_SLATE_900

        # Hyperlink: [anchor](url)
        elif part.startswith("[") and "](" in part and part.endswith(")"):
            m = re.match(r"^\[(.*?)\]\((.*?)\)$", part)
            if m:
                anchor, _ = m.groups()
                run = paragraph.add_run(anchor)
                run.font.name = default_font
                run.font.size = default_size
                run.font.color.rgb = COLOR_SKY_600
                run.font.underline = True
            else:
                run = paragraph.add_run(part)
                run.font.name = default_font
                run.font.size = default_size
                run.font.color.rgb = default_color

        # Plain Text
        else:
            run = paragraph.add_run(part)
            run.font.name = default_font
            run.font.size = default_size
            run.font.bold = default_bold
            run.font.italic = default_italic
            run.font.color.rgb = default_color


# -----------------------------------------------------------------------------
# MARKDOWN BLOCK PARSER
# -----------------------------------------------------------------------------
class BlockType:
    TITLE = "TITLE"
    SUBTITLE = "SUBTITLE"
    H1 = "H1"
    H2 = "H2"
    H3 = "H3"
    H4 = "H4"
    PARAGRAPH = "PARAGRAPH"
    BULLET = "BULLET"
    NUMBERED = "NUMBERED"
    CALLOUT = "CALLOUT"
    CODE_BLOCK = "CODE_BLOCK"
    TABLE = "TABLE"
    PAGE_BREAK = "PAGE_BREAK"


def parse_markdown_blocks(content: str) -> List[Dict[str, Any]]:
    """Parse raw Markdown string into structured high-level document blocks."""
    lines = content.splitlines()
    blocks: List[Dict[str, Any]] = []

    i = 0
    n = len(lines)
    is_first_h1 = True

    while i < n:
        line = lines[i]
        stripped = line.strip()

        # Empty line
        if not stripped:
            i += 1
            continue

        # Horizontal Rule / Page Break
        if stripped in ("---", "***", "___") or re.match(r"^[-\*_]{3,}$", stripped):
            blocks.append({"type": BlockType.PAGE_BREAK})
            i += 1
            continue

        # Fenced Code Block
        if stripped.startswith("```"):
            lang = stripped.lstrip("`").strip()
            code_lines = []
            i += 1
            while i < n and not lines[i].strip().startswith("```"):
                code_lines.append(lines[i])
                i += 1
            if i < n:
                i += 1  # Skip closing ```
            blocks.append({
                "type": BlockType.CODE_BLOCK,
                "language": lang,
                "content": "\n".join(code_lines)
            })
            continue

        # Blockquote / Callout Directive Box
        if stripped.startswith(">"):
            quote_lines = []
            while i < n and lines[i].strip().startswith(">"):
                quote_text = lines[i].strip().lstrip(">").strip()
                quote_lines.append(quote_text)
                i += 1

            # Separate optional title from body
            full_quote = " ".join(quote_lines)
            title = "CRITICAL ARCHITECT DIRECTIVE"
            body = full_quote

            # Detect title patterns like **TITLE** or [!NOTE] or [TITLE]
            m_bold = re.match(r"^\*\*(.*?)\*\*\s*(.*)$", full_quote)
            m_bracket = re.match(r"^\[!?(.*?)\]\s*(.*)$", full_quote)
            if m_bold:
                title = m_bold.group(1).strip()
                body = m_bold.group(2).strip()
            elif m_bracket:
                title = m_bracket.group(1).strip()
                body = m_bracket.group(2).strip()

            blocks.append({
                "type": BlockType.CALLOUT,
                "title": title,
                "content": body
            })
            continue

        # Markdown Table
        if stripped.startswith("|") and stripped.endswith("|"):
            table_lines = []
            while i < n and lines[i].strip().startswith("|") and lines[i].strip().endswith("|"):
                table_lines.append(lines[i].strip())
                i += 1

            if len(table_lines) >= 2:
                # Parse headers
                headers = [c.strip() for c in table_lines[0].split("|")[1:-1]]
                # Filter out separator row (e.g. |---|---|)
                rows = []
                for row_line in table_lines[1:]:
                    parts = [c.strip() for c in row_line.split("|")[1:-1]]
                    if parts and parts[0].startswith("---"):
                        continue
                    rows.append(parts)

                blocks.append({
                    "type": BlockType.TABLE,
                    "headers": headers,
                    "rows": rows
                })
                continue
            else:
                # Single table row fallback to paragraph
                blocks.append({"type": BlockType.PARAGRAPH, "content": table_lines[0]})
                continue

        # Headings
        if stripped.startswith("#"):
            if stripped.startswith("#### "):
                blocks.append({"type": BlockType.H4, "content": stripped[5:].strip()})
            elif stripped.startswith("### "):
                blocks.append({"type": BlockType.H3, "content": stripped[4:].strip()})
            elif stripped.startswith("## "):
                blocks.append({"type": BlockType.H2, "content": stripped[3:].strip()})
            elif stripped.startswith("# "):
                text = stripped[2:].strip()
                if is_first_h1:
                    blocks.append({"type": BlockType.TITLE, "content": text})
                    is_first_h1 = False
                else:
                    blocks.append({"type": BlockType.H1, "content": text})
            i += 1
            continue

        # Bullet List
        if re.match(r"^[-*+]\s+(.+)$", stripped):
            m = re.match(r"^[-*+]\s+(.+)$", stripped)
            blocks.append({"type": BlockType.BULLET, "content": m.group(1).strip()})
            i += 1
            continue

        # Numbered List
        if re.match(r"^\d+\.\s+(.+)$", stripped):
            m = re.match(r"^\d+\.\s+(.+)$", stripped)
            blocks.append({"type": BlockType.NUMBERED, "content": m.group(1).strip()})
            i += 1
            continue

        # Standard Paragraph
        para_lines = [stripped]
        i += 1
        while i < n:
            next_line = lines[i].strip()
            if not next_line or next_line.startswith(("#", ">", "```", "|", "---", "***")) or re.match(r"^[-*+\d]\.?\s+", next_line):
                break
            para_lines.append(next_line)
            i += 1

        blocks.append({
            "type": BlockType.PARAGRAPH,
            "content": " ".join(para_lines)
        })

    return blocks


# -----------------------------------------------------------------------------
# EXECUTIVE BIBLE COMPILER CORE
# -----------------------------------------------------------------------------
class ExecutiveBibleCompiler:
    def __init__(self, doc_title: str = "THE GROWTH SCALE MASTER EXECUTIVE BIBLE"):
        self.doc = Document()
        self.doc_title = doc_title
        self._configure_page_geometry()

    def _configure_page_geometry(self):
        """Configure 1.0-inch margins and header/footer rules."""
        for section in self.doc.sections:
            section.top_margin = Inches(1.0)
            section.bottom_margin = Inches(1.0)
            section.left_margin = Inches(1.0)
            section.right_margin = Inches(1.0)
            section.different_first_page_header_footer = True

            # Running Header (Slate-400 #94A3B8, Right Aligned)
            header = section.header
            hp = header.paragraphs[0]
            hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
            hrun = hp.add_run("THE GROWTH SCALE EXECUTIVE BIBLE | ENTERPRISE PRODUCTION SPECIFICATION")
            hrun.font.name = "Arial"
            hrun.font.size = Pt(8.5)
            hrun.font.color.rgb = COLOR_SLATE_400

            # Running Footer (Slate-400 #94A3B8, Center Aligned)
            footer = section.footer
            fp = footer.paragraphs[0]
            fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
            frun = fp.add_run("CONFIDENTIAL & PROPRIETARY — ELESIUM INTELLIGENCE CORE — ALL RIGHTS RESERVED")
            frun.font.name = "Arial"
            frun.font.size = Pt(8.0)
            frun.font.color.rgb = COLOR_SLATE_400

    def add_title_block(self, title_text: str, subtitle_text: Optional[str] = None):
        """Render executive cover title and metadata badge block."""
        title_p = self.doc.add_paragraph()
        title_p.paragraph_format.space_before = Pt(36)
        title_p.paragraph_format.space_after = Pt(10)
        run_title = title_p.add_run(title_text)
        run_title.font.name = "Arial"
        run_title.font.size = Pt(24)
        run_title.font.bold = True
        run_title.font.color.rgb = COLOR_SLATE_900

        sub_p = self.doc.add_paragraph()
        sub_p.paragraph_format.space_before = Pt(0)
        sub_p.paragraph_format.space_after = Pt(20)
        sub_text = subtitle_text or "The Autonomous Multi-Agent Architectural, Technical & Organic Search Production Specification"
        run_sub = sub_p.add_run(sub_text)
        run_sub.font.name = "Arial"
        run_sub.font.size = Pt(12)
        run_sub.font.italic = True
        run_sub.font.color.rgb = COLOR_SLATE_600

        # Executive Metadata Ledger Table
        meta_tbl = self.doc.add_table(rows=4, cols=2)
        meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        meta_tbl.autofit = False
        meta_tbl.columns[0].width = Inches(2.2)
        meta_tbl.columns[1].width = Inches(4.3)

        meta_rows = [
            ("Production Standard:", "Institutional Valuation Grade Enterprise Blueprint ($50,000+ Spec)"),
            ("Grounding Foundation:", "Phase 1 Dossiers (Modules 01 - 09, 46 Lessons, 228,000+ Words Lossless Recall)"),
            ("Strategic Mandate:", "Deterministic #1 Organic Ranking & AEO Answer Engine Superiority"),
            ("Target Architecture:", "Botpresso Programmatic SEO, Infidigit Crawl Budget, Hreflang Clusters, Autonomous GenAI")
        ]

        for idx, (label, val) in enumerate(meta_rows):
            c1, c2 = meta_tbl.rows[idx].cells
            c1.text = label
            c2.text = val
            set_cell_background(c1, "F1F5F9")
            set_cell_background(c2, "F8FAFC")
            set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
            set_cell_margins(c2, top=60, bottom=60, left=100, right=100)

            p1 = c1.paragraphs[0]
            if p1.runs:
                p1.runs[0].font.name = "Arial"
                p1.runs[0].font.size = Pt(8.5)
                p1.runs[0].font.bold = True
                p1.runs[0].font.color.rgb = COLOR_SLATE_900

            p2 = c2.paragraphs[0]
            if p2.runs:
                p2.runs[0].font.name = "Arial"
                p2.runs[0].font.size = Pt(8.5)
                p2.runs[0].font.color.rgb = COLOR_SLATE_700

        set_table_borders(meta_tbl)

        # Spacing and page break after title block
        spacing_p = self.doc.add_paragraph()
        spacing_p.paragraph_format.space_before = Pt(8)
        spacing_p.paragraph_format.space_after = Pt(8)
        self.doc.add_page_break()

    def add_h1(self, text: str):
        """Heading 1: Arial 17pt Bold (#0F172A)."""
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(20)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        add_formatted_runs(p, text, default_size=Pt(17), default_bold=True, default_color=COLOR_SLATE_900)
        return p

    def add_h2(self, text: str):
        """Heading 2: Arial 13pt Bold (#1E293B)."""
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        add_formatted_runs(p, text, default_size=Pt(13), default_bold=True, default_color=COLOR_SLATE_800)
        return p

    def add_h3(self, text: str):
        """Heading 3: Arial 11pt Bold (#334155)."""
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        add_formatted_runs(p, text, default_size=Pt(11), default_bold=True, default_color=COLOR_SLATE_700)
        return p

    def add_h4(self, text: str):
        """Heading 4: Arial 10pt Bold (#334155)."""
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        add_formatted_runs(p, text, default_size=Pt(10), default_bold=True, default_color=COLOR_SLATE_700)
        return p

    def add_paragraph(self, text: str):
        """Standard Body Paragraph: Arial 10pt Regular (#334155), line spacing 1.15."""
        p = self.doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        add_formatted_runs(p, text, default_size=Pt(10), default_color=COLOR_SLATE_700)
        return p

    def add_bullet(self, text: str):
        """Bullet list item."""
        p = self.doc.add_paragraph(style="List Bullet")
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        add_formatted_runs(p, text, default_size=Pt(10), default_color=COLOR_SLATE_700)
        return p

    def add_numbered(self, text: str):
        """Numbered list item."""
        p = self.doc.add_paragraph(style="List Number")
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15
        add_formatted_runs(p, text, default_size=Pt(10), default_color=COLOR_SLATE_700)
        return p

    def add_callout(self, title: str, text: str):
        """
        Render single-cell Callout Box:
        6.5in width, #F8FAFC background, 28pt left border in #0F172A.
        """
        tbl = self.doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.5)

        cell = tbl.cell(0, 0)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
        set_callout_borders(cell, border_color="0F172A", border_sz=28)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.15

        # Callout Title
        run_title = p.add_run(f"[{title.upper()}]\n")
        run_title.font.name = "Arial"
        run_title.font.size = Pt(9.5)
        run_title.font.bold = True
        run_title.font.color.rgb = COLOR_SLATE_900

        # Callout Body
        add_formatted_runs(p, text, default_size=Pt(9.5), default_color=COLOR_SLATE_700)

        # Spacing after table
        empty_p = self.doc.add_paragraph()
        empty_p.paragraph_format.space_before = Pt(0)
        empty_p.paragraph_format.space_after = Pt(4)

    def add_code_block(self, code_text: str):
        """
        Render Code Block:
        6.5in width, #0F172A dark slate fill, Courier New 8.5pt #F1F5F9.
        """
        tbl = self.doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.5)

        cell = tbl.cell(0, 0)
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(code_text)
        r.font.name = "Courier New"
        r.font.size = Pt(8.5)
        r.font.color.rgb = COLOR_CODE_TEXT

        empty_p = self.doc.add_paragraph()
        empty_p.paragraph_format.space_before = Pt(0)
        empty_p.paragraph_format.space_after = Pt(4)

    def add_data_table(self, headers: List[str], rows: List[List[str]]):
        """
        Render Data Table:
        Dark headers #0F172A with white bold text, alternating rows #F8FAFC, #E2E8F0 borders.
        """
        col_count = len(headers)
        if col_count == 0:
            return

        tbl = self.doc.add_table(rows=len(rows) + 1, cols=col_count)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        col_width = Inches(6.5 / col_count)
        for row in tbl.rows:
            for cell in row.cells:
                cell.width = col_width

        # Header Row
        hdr_cells = tbl.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].text = header_text
            set_cell_background(hdr_cells[i], "0F172A")
            set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
            p = hdr_cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in p.runs:
                run.font.name = "Arial"
                run.font.size = Pt(9.0)
                run.font.bold = True
                run.font.color.rgb = COLOR_WHITE

        # Data Rows
        for r_idx, row_data in enumerate(rows):
            row_cells = tbl.rows[r_idx + 1].cells
            bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data[:col_count]):
                row_cells[c_idx].text = ""
                set_cell_background(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=120, right=120)
                p = row_cells[c_idx].paragraphs[0]
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                add_formatted_runs(p, cell_value, default_size=Pt(8.5), default_color=COLOR_SLATE_700)

        set_table_borders(tbl)

        empty_p = self.doc.add_paragraph()
        empty_p.paragraph_format.space_before = Pt(0)
        empty_p.paragraph_format.space_after = Pt(4)

    def compile(self, markdown_content: str, output_path: Path, verbose: bool = False):
        """Compile complete markdown string into formatted DOCX."""
        blocks = parse_markdown_blocks(markdown_content)
        if verbose:
            print(f"Parsed {len(blocks)} document blocks from Markdown source.")

        for idx, block in enumerate(blocks):
            b_type = block["type"]
            if b_type == BlockType.TITLE:
                self.add_title_block(block["content"])
            elif b_type == BlockType.H1:
                self.add_h1(block["content"])
            elif b_type == BlockType.H2:
                self.add_h2(block["content"])
            elif b_type == BlockType.H3:
                self.add_h3(block["content"])
            elif b_type == BlockType.H4:
                self.add_h4(block["content"])
            elif b_type == BlockType.PARAGRAPH:
                self.add_paragraph(block["content"])
            elif b_type == BlockType.BULLET:
                self.add_bullet(block["content"])
            elif b_type == BlockType.NUMBERED:
                self.add_numbered(block["content"])
            elif b_type == BlockType.CALLOUT:
                self.add_callout(block["title"], block["content"])
            elif b_type == BlockType.CODE_BLOCK:
                self.add_code_block(block["content"])
            elif b_type == BlockType.TABLE:
                self.add_data_table(block["headers"], block["rows"])
            elif b_type == BlockType.PAGE_BREAK:
                self.doc.add_page_break()

        output_path.parent.mkdir(parents=True, exist_ok=True)
        buf = io.BytesIO()
        self.doc.save(buf)
        buf.seek(0)
        with zipfile.ZipFile(buf, "r") as zin:
            with zipfile.ZipFile(output_path, "w") as zout:
                for item in sorted(zin.infolist(), key=lambda x: x.filename):
                    data = zin.read(item.filename)
                    zinfo = zipfile.ZipInfo(filename=item.filename, date_time=(2026, 1, 1, 0, 0, 0))
                    zinfo.compress_type = item.compress_type
                    zinfo.external_attr = 0o644 << 16
                    zout.writestr(zinfo, data)
        if verbose:
            print(f"Successfully compiled DOCX to: {output_path}")


# -----------------------------------------------------------------------------
# MAIN CLI DISPATCH
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Publication-Grade Markdown-to-DOCX Compiler for The Growth Scale Executive Bible"
    )
    parser.add_argument(
        "--input", "-i",
        type=str,
        default="SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.md",
        help="Path to source Markdown file."
    )
    parser.add_argument(
        "--output", "-o",
        type=str,
        default="SEO SOURCE/phase2/GROWTH_SCALE_EXECUTIVE_BIBLE.docx",
        help="Path to output DOCX document."
    )
    parser.add_argument(
        "--title", "-t",
        type=str,
        default="THE GROWTH SCALE MASTER EXECUTIVE BIBLE",
        help="Document title override."
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose compilation progress logging."
    )

    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    output_path = Path(args.output).resolve()

    if not input_path.exists():
        sys.stderr.write(f"ERROR: Input Markdown file does not exist: {input_path}\n")
        sys.exit(1)

    try:
        content = input_path.read_text(encoding="utf-8")
    except Exception as e:
        sys.stderr.write(f"ERROR reading Markdown file: {e}\n")
        sys.exit(1)

    compiler = ExecutiveBibleCompiler(doc_title=args.title)
    try:
        compiler.compile(content, output_path, verbose=args.verbose)
        print(f"COMPILATION SUCCESS: Document generated at {output_path} ({os.path.getsize(output_path):,} bytes)")
        sys.exit(0)
    except Exception as e:
        sys.stderr.write(f"COMPILATION FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
