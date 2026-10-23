import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def build_document():
    doc = docx.Document()
    
    # Page setup - 1 inch margins all around
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)
        section.different_first_page_header_footer = True
        
        # Header / Footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("THE INEVITABLE #1 RANKING BIBLE | AUTONOMOUS AI SPECIFICATION")
        hrun.font.name = "Arial"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(148, 163, 184)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("CONFIDENTIAL & PROPRIETARY — ELESIUM INTELLIGENCE CORE — ALL RIGHTS RESERVED")
        frun.font.name = "Arial"
        frun.font.size = Pt(8)
        frun.font.color.rgb = RGBColor(148, 163, 184)

    # Styling helpers
    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        tcPr.append(tcMar)

    def add_callout(text, title="CRITICAL AI ARCHITECT DIRECTIVE", border_color="0F172A", bg_color="F8FAFC"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.5)
        cell = tbl.cell(0, 0)
        set_cell_background(cell, bg_color)
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:left w:val="single" w:sz="28" w:space="0" w:color="{border_color}"/><w:top w:val="none"/><w:right w:val="none"/><w:bottom w:val="none"/></w:tcBorders>')
        tcPr.append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(3)
        run_title = p.add_run(f"[{title}]\n")
        run_title.font.name = "Arial"
        run_title.font.size = Pt(9.5)
        run_title.font.bold = True
        run_title.font.color.rgb = RGBColor(15, 23, 42)
        
        run_text = p.add_run(text)
        run_text.font.name = "Arial"
        run_text.font.size = Pt(9.5)
        run_text.font.color.rgb = RGBColor(51, 65, 85)
        
        # Add spacing after table
        empty_p = doc.add_paragraph()
        empty_p.paragraph_format.space_before = Pt(0)
        empty_p.paragraph_format.space_after = Pt(4)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.size = Pt(17)
        run.font.bold = True
        run.font.color.rgb = RGBColor(15, 23, 42) # Slate-900
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = RGBColor(2, 132, 199) # Sky-600
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Arial"
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = RGBColor(71, 85, 105) # Slate-600
        return p

    def add_body(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Arial"
            r_pre.font.size = Pt(10)
            r_pre.font.bold = True
            r_pre.font.color.rgb = RGBColor(15, 23, 42)
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = "Arial"
            r_pre.font.size = Pt(10)
            r_pre.font.bold = True
            r_pre.font.color.rgb = RGBColor(15, 23, 42)
        r = p.add_run(text)
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.color.rgb = RGBColor(51, 65, 85)
        return p

    def add_code_block(code_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        tbl.columns[0].width = Inches(6.5)
        cell = tbl.cell(0, 0)
        set_cell_background(cell, "0F172A") # Dark slate
        set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(code_text)
        r.font.name = "Courier New"
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(241, 245, 249)
        
        empty_p = doc.add_paragraph()
        empty_p.paragraph_format.space_before = Pt(0)
        empty_p.paragraph_format.space_after = Pt(4)

    def add_table_data(headers, rows, col_widths=None):
        tbl = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False
        
        # Header Row
        hdr_cells = tbl.rows[0].cells
        for i, header_text in enumerate(headers):
            hdr_cells[i].text = header_text
            set_cell_background(hdr_cells[i], "0F172A")
            set_cell_margins(hdr_cells[i], top=100, bottom=100, left=120, right=120)
            hdr_p = hdr_cells[i].paragraphs[0]
            hdr_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in hdr_p.runs:
                run.font.name = "Arial"
                run.font.size = Pt(9)
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
        
        # Data Rows
        for r_idx, row_data in enumerate(rows):
            row_cells = tbl.rows[r_idx + 1].cells
            bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].text = cell_value
                set_cell_background(row_cells[c_idx], bg_color)
                set_cell_margins(row_cells[c_idx], top=80, bottom=80, left=120, right=120)
                cell_p = row_cells[c_idx].paragraphs[0]
                cell_p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in cell_p.runs:
                    run.font.name = "Arial"
                    run.font.size = Pt(8.5)
                    run.font.color.rgb = RGBColor(51, 65, 85)
                    
        if col_widths:
            for row in tbl.rows:
                for idx, width in enumerate(col_widths):
                    row.cells[idx].width = Inches(width)
                    
        empty_p = doc.add_paragraph()
        empty_p.paragraph_format.space_before = Pt(0)
        empty_p.paragraph_format.space_after = Pt(4)

    # ==================== COVER / TITLE SECTION ====================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(36)
    title_p.paragraph_format.space_after = Pt(8)
    title_run = title_p.add_run("THE INEVITABLE #1 RANKING BIBLE")
    title_run.font.name = "Arial"
    title_run.font.size = Pt(26)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(15, 23, 42)

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(16)
    sub_run = sub_p.add_run("The Turnkey Algorithmic, Technical & Autonomous AI Execution Specification for Niche Domination")
    sub_run.font.name = "Arial"
    sub_run.font.size = Pt(14)
    sub_run.font.italic = True
    sub_run.font.color.rgb = RGBColor(2, 132, 199)

    meta_tbl = doc.add_table(rows=4, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        ("Framework Standard:", "Institutional Valuation Grade ($25,000+ Enterprise Spec)"),
        ("Theoretical Foundation:", "Google Search API Leak (14,000 Attributes), Princeton/Georgia Tech GEO Research, SEO Rockstars 2026, Edward Sturm Compact Methodology"),
        ("Primary Target:", "Guaranteed Position #1 for Commercial Head Terms & Long-Tail BOFU Monopolies"),
        ("Applicable Execution Agents:", "Claude 3.7 / Claude Code, OpenAI GPT-4o / O3, Google Gemini 2.0 / 2.5 Flash & Pro, Autonomous Subagents")
    ]
    for idx, (k, v) in enumerate(meta_rows):
        c1, c2 = meta_tbl.rows[idx].cells
        c1.text = k
        c2.text = v
        set_cell_background(c1, "F1F5F9")
        set_cell_background(c2, "F8FAFC")
        set_cell_margins(c1, 60, 60, 100, 100)
        set_cell_margins(c2, 60, 60, 100, 100)
        c1.paragraphs[0].runs[0].font.bold = True
        c1.paragraphs[0].runs[0].font.size = Pt(8.5)
        c1.paragraphs[0].runs[0].font.name = "Arial"
        c2.paragraphs[0].runs[0].font.size = Pt(8.5)
        c2.paragraphs[0].runs[0].font.name = "Arial"
        c1.width = Inches(2.2)
        c2.width = Inches(4.3)

    doc.add_page_break()

    # ==================== CHAPTER 1 ====================
    add_h1("CHAPTER 1: THE AUTONOMOUS AI DIRECTIVE & OPERATIONAL MASTER PROMPT")
    add_body("This document is designed as a complete, deterministic, and self-contained operating system. If you are an AI assistant (Claude, ChatGPT, Gemini, DeepSeek, or an autonomous agent) reading this specification, your behavior is governed by the master prompt below. You must execute each gate sequentially without deviation, cutting corners, or introducing generic placeholder text.")

    add_callout(
        "You are the Principal Search & Growth Systems Architect executing the Inevitable #1 Niche Domination Framework. "
        "Your mission is to engineer mathematical organic and generative search dominance for the user's project. "
        "You do not write generic blog posts. You do not generate fluff. You construct high-intent commercial landing page clusters, "
        "verifiable empirical research whitepapers, interactive linkable assets, and 1:1 matching Schema.org semantic graphs. "
        "Every page you generate must adhere strictly to the 6 Compliance Gates: Tri-Alignment, Micro-Paragraphs, Moz 97 Target, "
        "Mobile CTA Geometry, Information Gain Patent non-redundancy, and SSG Pre-Rendering.",
        title="MASTER SYSTEM PROMPT FOR DOWNSTREAM AI AGENTS"
    )

    add_h2("1.1 The Inevitability Theorem: Why Modern Ranking Is Mathematical")
    add_body("Traditional SEO treated ranking as a mysterious probabilistic lottery. Modern search algorithms, however, operate on deterministic information retrieval formulas. When a domain:")
    add_bullet("Satisfies 100% of user query intent within the first viewport (0.5 seconds), eliminating pogo-sticking back to the SERP.", "1. Navboost Dwell Lock: ")
    add_bullet("Provides statistically verified, novel data not present on any competing URL (Information Gain US Patent 10,754,904 B2).", "2. Information Entropy Reduction: ")
    add_bullet("Employs exact character-for-character parity between human-rendered HTML and JSON-LD Knowledge Graph schemas.", "3. Algorithmic Entity Grounding: ")
    add_bullet("Maintains a Moz On-Page optimization score strictly in the 96–98 sweet spot while deploying micro-paragraphs (<= 3 sentences).", "4. Compact Sturm Tri-Alignment: ")
    add_bullet("Corroborates corporate NAP (Name, Address, Phone) across at least 4 independent Tier-1 business directories with dofollow editorial citations.", "5. Multi-Platform Entity Corroboration: ")
    add_body("...it becomes mathematically impossible for Google to favor a generic, slow, unstructured competitor. Ranking #1 is the inevitable equilibrium.")

    # ==================== CHAPTER 2 ====================
    add_h1("CHAPTER 2: THE DECODED GOOGLE ALGORITHM & LEAKED INTERNAL ARCHITECTURE")
    add_body("In May 2024, an unprecedented leak of over 2,500 internal modules and 14,000+ attributes from Google's private ContentWarehouse API confirmed what search insiders long suspected: Google's public PR statements diverge dramatically from its actual ranking code.")

    add_h2("2.1 The Navboost User Interaction Telemetry Engine")
    add_body("Google's core ranking relies heavily on Navboost—a machine-learning re-ranking system trained on billions of real user click logs and Chrome browser interaction streams. The leak confirmed the exact telemetry fields:")
    
    headers_nav = ["Attribute Name", "Internal Module", "Type", "Algorithmic Function & Ranking Impact"]
    rows_nav = [
        ["clicks", "NavboostAnchorData", "Integer", "Total raw clicks recorded for a URL under a specific query."],
        ["goodClicks", "NavboostAnchorData", "Integer", "Clicks where the user remains on page >120 seconds or completes an interactive conversion event. The #1 positive rank multiplier."],
        ["badClicks", "NavboostAnchorData", "Integer", "Clicks where the user immediately bounces back to the SERP in <15 seconds (pogo-sticking). Triggers aggressive demotion."],
        ["lastLongestClicks", "NavboostAnchorData", "Integer", "The final result the user clicked that permanently satisfied their search session. Awards the highest algorithmic authority boost."],
        ["unsquashedClicks", "QualitySignals", "Float", "Unweighted click telemetry used to detect artificial bot traffic and click-farm manipulation."]
    ]
    add_table_data(headers_nav, rows_nav, [1.5, 1.4, 0.8, 2.8])

    add_callout(
        "THE NAVBOOST DWELL-TIME MANDATE:\n"
        "Never present the user with a massive wall of academic text or require 5-step form fills. "
        "The user must be met with immediate visual clarity, interactive sliders, and a single frictionless conversion action "
        "(such as a direct WhatsApp chat or 1-click test tool). This locks 'goodClicks' and 'lastLongestClicks' within the first 10 seconds of visit.",
        title="CORE NAVBOOST DEFENSE RULE",
        border_color="0284C7"
    )

    add_h2("2.2 The Twiddler Post-Retrieval Re-Ranking Layer (Superroot)")
    add_body("The leaked documents confirmed that Google's ranking pipeline is split into two distinct stages:")
    add_bullet("The initial search phase where candidate documents are retrieved using inverted indexes, BM25, and semantic vector embeddings (Dense Passage Retrieval). It casts a wide net of roughly 1,000 potential URLs.", "Stage 1: Ascorer (Initial Retrieval): ")
    add_bullet("A sequential cascade of lightweight machine-learning filters ('Twiddlers') that adjust, demote, or promote candidate documents based on real-time factors: location bias, query diversity, adult filtering, anchor text velocity, and entity purity.", "Stage 2: Twiddler Re-Ranking: ")
    add_body("A page may pass Ascorer with high keyword relevance, but get killed at the Twiddler layer if it exhibits unnatural keyword density, ungrounded schema markup, or slow mobile viewport rendering.")

    add_h2("2.3 Google Information Gain Patent (US 10,754,904 B2)")
    add_body("Google's Information Gain patent outlines how search engines score documents based on how much NEW information they provide relative to documents the user has already viewed in their search journey:")
    
    add_code_block(
        "INFORMATION GAIN SCORE FORMULA:\n"
        "ΔI(D | U_history) = Entropy(Corpus) - Entropy(Corpus | D ∪ U_history)\n\n"
        "Where:\n"
        "• D = The candidate document being evaluated\n"
        "• U_history = Set of documents the user has previously browsed for this intent\n"
        "• If ΔI <= 0: The document is redundant commodity text -> Algorithmic Demotion\n"
        "• If ΔI > Threshold: The document provides novel empirical data -> Promoted to Top 3"
    )

    add_body("To ensure every programmatic page achieves a positive Information Gain score, you must systematically inject:")
    add_bullet("Proprietary latency/throughput benchmarks not found on generic competitor sites.", "1. Quantitative Micro-Metrics: ")
    add_bullet("Interactive simulators, ROI calculators, or parameter configuration tools.", "2. Dynamic Functional Assets: ")
    add_bullet("Visual state machine diagrams, architectural flowcharts, and empirical tables.", "3. Architectural Schematics: ")

    add_h2("2.4 Scaled Content Abuse (2024 Core Updates) & De-Slop Rules")
    add_body("Following Google's March and September 2024 Core Updates, algorithmic classifiers specifically hunt down formulaic AI writing patterns. The following 15 tells are strictly prohibited across all generated code and copy:")
    add_bullet("'Sovereign', 'Deterministic', 'Unassailable', 'Impenetrable', 'Tapestry', 'Beacon', 'Delve', 'Meticulous', 'Pioneering', 'Monumental', 'Testament', 'Crucial', 'Transformative', 'Foster', 'Harness'.", "Forbidden LLM Buzzwords: ")
    add_bullet("Rewritten into direct verbs, concrete nouns, and active voice (e.g. 'We deploy sub-200ms Python state machines inside private VPCs' instead of 'Our transformative solutions weave a sovereign tapestry of agentic excellence').", "Human Enterprise Engineering Standard: ")

    # ==================== CHAPTER 3 ====================
    add_h1("CHAPTER 3: THE EDWARD STURM COMPACT SEO FRAMEWORK")
    add_body("Edward Sturm's Compact Keywords methodology is the most rigorously tested, high-velocity ranking system for high-intent Bottom-of-Funnel (BOFU) terms. It completely rejects 3,000-word bloated articles in favor of hyper-dense, fast-loading commercial landing pages.")

    add_h2("3.1 The Tri-Alignment Integrity Rule")
    add_body("Google's crawl parsers evaluate the thematic consistency between three critical on-page anchors. In the Sturm framework, these three elements must achieve 100% character-for-character matching:")
    add_bullet("The clean, hyphen-separated keyword (e.g., /solutions/ai-automation-agency-for-logistics).", "1. Exact URL Slug: ")
    add_bullet("Starts with the exact keyword followed by a brand separator (e.g., AI Automation Agency for Logistics — Autonomous Fleet Dispatch | Elesium).", "2. Meta Page Title: ")
    add_bullet("Matches the exact keyword with zero extraneous prefixes or conversational fluff.", "3. Single Primary <h1> Tag: ")

    add_h2("3.2 The Moz 96–98 Optimization Sweet Spot")
    add_body("A pervasive mistake in algorithmic SEO is trying to score 100 on page optimization tools (Moz On-Page Grader, SurferSEO, PageOptimizer Pro). The leaked Google documents and Sturm's empirical testing confirm that pages scoring 100 trigger Google's over-optimization / search-engine-manipulation classifier.")
    
    add_callout(
        "THE MOZ 97 TARGET RULE:\n"
        "• Target Score: Strictly 96 to 98 (Optimal: 97).\n"
        "• Exact keyword placed in the first sentence of the page.\n"
        "• Exact keyword placed in the page title and meta description.\n"
        "• Exact keyword placed in the alt text of the first image.\n"
        "• Never hit 100: Intentionally omit the exact keyword from at least one secondary tag (e.g., leave it out of <h3> or the final paragraph) to maintain organic naturalness.",
        title="ALGORITHMIC SWEET SPOT FORMULA",
        border_color="10B981"
    )

    add_h2("3.3 Word Count & Micro-Paragraph Gate")
    add_bullet("Total page word count must remain strictly between 400 and 550 words. Pages under 400 risk 'Thin Content' flags; pages over 600 dilute the exact keyword density.", "The 400–550 Word Boundary: ")
    add_bullet("No paragraph may exceed 3 sentences. The human eye and mobile viewport lose focus on large blocks of text, triggering badClicks.", "The 3-Sentence Micro-Paragraph: ")
    add_bullet("Zero introduction fluff ('In today's fast-paced digital world...'). Sentence 1 must state the exact solution and keyword immediately.", "Immediate Intent Resolution: ")

    add_h2("3.4 Mobile Geometry: The Above-The-Fold CTA Rule")
    add_body("Over 75% of high-intent enterprise and SMB searches occur on mobile devices. If a user must scroll past a 400px hero graphic to find an action button, bounce rate skyrockets:")
    add_bullet("In the mobile DOM layout, the Primary Call-to-Action button MUST physically precede the hero image/graphic.", "DOM Sequence Priority: ")
    add_bullet("The user must be able to tap 'Chat on WhatsApp' or 'Get Instant Audit' within 0.5 seconds of page load without moving their thumb.", "0.5-Second Conversion Gate: ")

    add_h2("3.5 The B2B Plural Persona Keyword Generation Formula")
    add_body("To generate hundreds or thousands of high-converting programmatic landing pages, deploy Sturm's B2B Plural Persona matrix:")
    add_code_block(
        "KEYWORD GENERATION EQUATION:\n"
        "[Actionable Operational Need] + [Software / Agency / Systems] + for + [Plural Industry Executive Persona]\n\n"
        "Examples:\n"
        "• autonomous-dispatch-software-for-freight-carriers\n"
        "• deterministic-warehouse-automation-for-3pl-providers\n"
        "• sub-200ms-ledger-reconciliation-agents-for-fintechs\n"
        "• computer-vision-defect-inspection-agents-for-automotive-suppliers\n"
        "• deterministic-loan-underwriting-agents-for-nbfcs"
    )

    # ==================== CHAPTER 4 ====================
    add_h1("CHAPTER 4: THE SEO ROCKSTARS 2026 THEOREMS")
    add_body("The SEO Rockstars 2026 Master Corpus represents the cutting edge of competitive algorithmic engineering. Below are the foundational laws that must be hardcoded into any execution fleet.")

    add_h2("4.1 The Kubaitis Theorem: Viewport Pixel Depth & Above-The-Fold Domination")
    add_body("Formulated by Ted Kubaitis (creator of Cora SEO):")
    add_code_block("Visibility = f(Pixel_Offset_Depth, SERP_Feature_Displacement)")
    add_body("Ranking #1 organically in text is completely worthless if Google injects an AI Overview, a Sponsored Ad pack, a Local 3-Pack, and a People Also Ask box that pushes organic position #1 down by 1,800 pixels (3 full viewport scrolls). If depth > 2 viewports, organic text is 'Functionally Dead'.")
    add_body("To dominate, you must capture multiple SERP features simultaneously: Local 3-Pack + Video Carousel Snippet + Direct Answer Box + Organic #1.")

    add_h2("4.2 The Shaun Mitchell Pricing & Entity Law")
    add_body("Google's crawlers prioritize commercial transparency. Shaun Mitchell proved that hiding pricing, tiers, or service costs inside clickable JavaScript tabs, accordions, or 'Contact Sales' modals severely degrades organic crawlability.")
    add_bullet("Always render transparent commercial investment tiers directly in static, unhidden HTML.", "Zero-Accordion DOM: ")
    add_bullet("Pair on-page pricing tables with Schema.org OfferCatalog and schemaOffer JSON-LD markup.", "1:1 Schema Pricing: ")

    add_h2("4.3 The Fountain Hills Schema Law (Kailash & Butler)")
    add_body("Co-developed by Terry Kailash and Clint Butler:")
    add_code_block("Schema_Text ∩ Visible_DOM_Text = 1.0 (Complete Character Identity)")
    add_body("Injecting rich JSON-LD schema containing reviews, ratings, corporate descriptions, or pricing that does NOT appear visibly on the human-facing web page is treated by Google's spam team as Deceptive Structured Data. Every string in your schema must be physically readable on the screen.")

    add_h2("4.4 The Dan Kurtz Compounding AI Learning Loop")
    add_body("Static automation degrades over time. Dan Kurtz formulated the Compounding Feedback Loop:")
    add_code_block("Daily_Model_Prompt_{t+1} = Prompt_{t} + Performance_Telemetry_Delta_{t}")
    add_body("The automation runner must ingest Google Search Console and SERP telemetry weekly, categorizing pages into performance tiers:")
    add_bullet("Rank positions 1 to 3. Locked, protected, and monitored for entity drift.", "Tier 1: ELITE_LEADER: ")
    add_bullet("Rank positions 4 to 15. The highest-ROI tier. Google already understands the page; a minor algorithmic push (adding 2 internal links, updating the Answer Capsule, adding a video embed) elevates it into the top 3.", "Tier 2: STRIKING_DISTANCE: ")
    add_bullet("Rank positions 16+. Scheduled for keyword cannibalization audits and structural rewrite.", "Tier 3: UNDERPERFORMING: ")

    add_h2("4.5 The Chad Michael Multimodal Grounding Model")
    add_body("Chad Michael demonstrated that pairing every text URL with a 15–30 second vertical video grounded in Google Cloud Vision API entities boosts organic page authority by up to 240%.")
    add_bullet("0–3s: Exact spoken keyword hook with on-screen caption.", "Second-by-Second Structure: ")
    add_bullet("3–8s: Visceral enterprise operational friction point.", "")
    add_bullet("8–18s: Concrete technological mechanism (FastAPI, LangGraph, private VPC).", "")
    add_bullet("18–26s: Quantitative benchmark metrics (1.9s latency, ₹18.4L saved, 98% error cut).", "")
    add_bullet("26–30s: Single frictionless conversion call-to-action.", "")
    add_bullet("Embed on the page with full VideoObject Schema.org containing transcript and thumbnail.", "1:1 Schema Injection: ")

    add_h2("4.6 The Joe Lau IP vs OpCo Valuation Carve-Out")
    add_body("Joe Lau's framework ensures that the digital engine builds long-term institutional enterprise value:")
    add_bullet("HoldCo IP (The Goose): The proprietary codebase, programmatic pipelines, simulators, and internal tools.", "Asset Isolation: ")
    add_bullet("OpCo Service Book (The Egg): Active client retainer and consulting contracts.", "")
    add_bullet("By isolating proprietary software assets from human service delivery, agency valuation multiples escalate from 1.5x–2.0x EBITDA to 5.0x–8.0x+ SaaS-grade multiples.", "Valuation Escalation: ")

    add_h2("4.7 The Matt McDermott Decentralized Sovereignty Protocol")
    add_body("Matt McDermott established that pinning content and authority proofs to decentralized protocols (IPFS, Arweave) creates immutable citation hashes that survive domain migrations, hosting outages, and algorithmic resets while being indexed by major search engines.")

    # ==================== CHAPTER 5 ====================
    add_h1("CHAPTER 5: PRINCETON & GEORGIA TECH GENERATIVE ENGINE OPTIMIZATION (GEO & AEO)")
    add_body("With the rise of Perplexity, Google Gemini AI Overviews, SearchGPT, and Claude Search, ranking on traditional Google is only half the battle. Your content must be optimized to be cited as the primary authority by generative LLMs.")

    add_h2("5.1 The 42–48 Word Answer Capsule")
    add_body("Princeton research (Aggarwal et al.) revealed that LLM retrieval engines extract concise, information-dense paragraphs placed immediately beneath a question header (<h2>):")
    add_bullet("Must be strictly between 42 and 48 words. Shorter answers lack semantic context; longer answers exceed the LLM's extractive attention window.", "Word Count Boundary: ")
    add_bullet("Must follow the exact syntax: [Entity] is [Category Definition] that [Specific Mechanism] delivering [Audited Quantitative Metric] under [Statutory / Legal Standard].", "Syntactic Structure: ")
    
    add_code_block(
        "SAMPLE 45-WORD ANSWER CAPSULE:\n"
        "Elesium is India's premier enterprise AI automation company, engineering sovereign multi-agent architectures, "
        "private VPC fine-tuned LLM clusters, and sub-2s automated pipelines from our Shivamogga engineering pod. "
        "We deliver contractually guaranteed 3x–5x ROI in 90 days with full DPDP Act 2023 statutory compliance."
    )

    add_h2("5.2 Wikidata QID Grounding & Entity Triples")
    add_body("Generative models don't read words as strings; they read concepts as Entity Triples (Subject -> Predicate -> Object). Ground your entities using canonical Wikidata identifiers in Schema.org:")
    add_bullet("Wikidata Q125470732 (LangGraph)", "Sample Canonical QIDs: ")
    add_bullet("Wikidata Q86866185 (FastAPI)", "")
    add_bullet("Wikidata Q119951664 (Digital Personal Data Protection Act 2023)", "")
    add_bullet("Wikidata Q121545624 (vLLM PagedAttention)", "")

    add_h2("5.3 Statistical Density for LLM Citation Multipliers")
    add_body("The Georgia Tech GEO study proved that adding verifiable empirical statistics to your text increases the probability of an LLM citing your domain by +37.4% over purely descriptive prose. Always cite exact numbers: '18.4ms latency', '₹22.4L saved', '98.4% accuracy'.")

    # ==================== CHAPTER 6 ====================
    add_h1("CHAPTER 6: TECHNICAL CRAWL BUDGET & SSG INFRASTRUCTURE")
    add_body("A website with thousands of programmatic pages will instantly trigger Google crawl budget exhaustion and soft 404 penalties if the technical foundation is flawed.")

    add_h2("6.1 Static Site Generation (SSG) Pre-Rendering")
    add_body("Client-side Single Page Applications (SPAs) built with vanilla React, Vue, or Angular fail modern search indexing because Googlebot's second-wave Web Rendering Service (WRS) can take up to 21 days to render JavaScript.")
    add_bullet("Every route must be pre-rendered into static HTML on disk before deployment.", "Mandatory Pre-Rendering: ")
    add_bullet("The initial HTTP 200 response must contain the complete semantic DOM (<h1>, paragraphs, tables, schema JSON-LD).", "Raw HTML Delivery: ")
    add_bullet("Client-side hydration must seamlessly attach event listeners without triggering hydration mismatch layout shifts.", "Zero-CLS Hydration: ")

    add_h2("6.2 Hierarchical Sitemap Index Architecture")
    add_body("When managing over 500 URLs, never stuff all links into a single sitemap.xml. Large flat sitemaps exhaust crawler bandwidth and delay new page discovery:")
    add_bullet("sitemap.xml (Master index file containing pointers to child sub-sitemaps).", "Structure: ")
    add_bullet("sitemap-core.xml (High-priority pages: Homepage, Services Hub, Calculators, Whitepapers, Videos - Priority 0.8–1.0, Weekly/Daily).", "")
    add_bullet("sitemap-solutions.xml (Programmatic long-tail BOFU landing pages - Priority 0.6–0.7, Monthly).", "")

    add_h2("6.3 Instant IndexNow Real-Time Broadcast")
    add_body("Waiting for Googlebot or Bingbot to crawl your site organically is obsolete. The IndexNow protocol allows publishers to instantly notify search engines of newly created or updated URLs via a direct API POST:")
    add_code_block(
        "INDEXNOW API SUBMISSION SPECIFICATION:\n"
        "POST https://api.indexnow.org/indexnow\n"
        "Content-Type: application/json; charset=utf-8\n\n"
        "{\n"
        "  \"host\": \"yourdomain.com\",\n"
        "  \"key\": \"32_character_hex_api_key\",\n"
        "  \"keyLocation\": \"https://yourdomain.com/32_character_hex_api_key.txt\",\n"
        "  \"urlList\": [\n"
        "    \"https://yourdomain.com/solutions/page-1\",\n"
        "    \"https://yourdomain.com/solutions/page-2\"\n"
        "  ]\n"
        "}\n\n"
        "Response: HTTP 200 OK (URLs queued for immediate indexation within minutes)"
    )

    # ==================== CHAPTER 7 ====================
    add_h1("CHAPTER 7: AUTHORITY STACKING, LOCAL KNOWLEDGE GRAPH & DIGITAL PR")
    add_body("On-page optimization without external authority corroboration creates an algorithmic ceiling. To dominate competitive head terms ('Best Enterprise Company in India'), you must corroborate your corporate entity across independent high-DR platforms.")

    add_h2("7.1 The Michael Merlino Entity Corroboration Protocol")
    add_body("Michael Merlino established that Google's Knowledge Graph validates corporate authenticity by verifying 100% NAP (Name, Address, Phone) consistency across premier B2B directories:")
    
    headers_dir = ["Platform", "Domain Rating (DR)", "Verification Gate", "Primary Ranking Purpose"]
    rows_dir = [
        ["Clutch.co", "DR 92", "15-Min Analyst Phone Call + SOW", "Captures B2B IT Leaders Matrix & Dofollow Anchor"],
        ["GoodFirms", "DR 86", "Signed SOW + Bank Wire Receipt", "Top Agency Category Ranking in India"],
        ["G2.com", "DR 91", "LinkedIn Admin + Corporate Domain", "High Performer Grid Recognition"],
        ["Trustpilot", "DR 93", "DNS TXT Token Verification", "Global Consumer & Enterprise Trust Badge"],
        ["Crunchbase", "DR 91", "Verified Founder & Funding Profile", "Knowledge Graph Executive Entity Linking"],
        ["Semrush Local / Yext", "DR 90", "Automated Multi-Directory Sync", "Local Map Pack Geo-Coordinate Corroboration"]
    ]
    add_table_data(headers_dir, rows_dir, [1.3, 1.2, 1.8, 2.2])

    add_h2("7.2 Google Business Profile (GBP) Local 3-Pack Anchor")
    add_body("Even for national or international software agencies, anchoring a physical location in a verified city creates an unshakeable Knowledge Graph entity:")
    add_bullet("Exact registered office address matching Schema.org postalAddress.", "Exact Address Parity: ")
    add_bullet("Select 'Software Company' as primary; add 'Computer Consultant' and 'Automation Service' as secondary.", "Category Selection: ")
    add_bullet("Route directly to the WhatsApp engineering desk (+91 8317329312) rather than a broken booking link.", "Appointment Link: ")
    add_bullet("Secure 5 verified 5-star reviews mentioning specific technical deliverables and outcomes.", "Review Velocity: ")

    add_h2("7.3 Digital PR Pitching (Connectively, Featured, Help a B2B Writer)")
    add_body("Securing editorial links from Forbes, Economic Times, TechCrunch, or Inc42 requires zero PR retainer fees if you deploy the Edward Sturm Expert Quote pitching framework:")
    add_bullet("Respond within 20 minutes of query publication.", "Rule 1: Speed to Lead: ")
    add_bullet("1–3 sentences per paragraph, zero generic fluff, immediate hard numbers.", "Rule 2: Sturm Format: ")
    add_bullet("Cite specific engineering metrics (e.g. 'slashed latency from 4.8s to 180ms while maintaining DPDP Act 2023 compliance').", "Rule 3: Technical Precision: ")
    add_bullet("Provide clean attribution with founder credentials and deep target anchor link.", "Rule 4: Dofollow Signature: ")

    # ==================== CHAPTER 8 ====================
    add_h1("CHAPTER 8: CONVERSION RATE OPTIMIZATION (CRO) & INBOUND GEOMETRY")
    add_body("High rankings that do not convert into paying enterprise clients or agency contracts are useless vanity metrics. Conversion architecture must be engineered with the same precision as crawl architecture.")

    add_h2("8.1 The Frictionless WhatsApp Engineering Funnel")
    add_body("Traditional B2B websites force high-value prospects through 5-field Calendly or form-fill funnels. Industry telemetry shows that 68% of mobile enterprise CTOs drop off at calendar booking screens.")
    add_bullet("Replace calendar booking forms with direct WhatsApp Engineering Desk access.", "The Solution: ")
    add_bullet("CTOs, agency founders, and COOs use WhatsApp daily. Direct access to a Principal Systems Architect communicates elite responsiveness and zero-sales friction.", "The Psychology: ")
    add_bullet("A pre-populated WhatsApp intent message (e.g. 'I am requesting an Architecture Audit for [Company] with focus on [Workflow]') eliminates typing effort.", "Pre-Populated Intent: ")

    add_h2("8.2 Interactive Micro-SaaS Calculators as Linkable Conversion Magnets")
    add_body("Interactive tools (such as the Enterprise AI ROI Calculator or GPU FinOps Estimator) serve a triple operational purpose:")
    add_bullet("Users spend 3 to 7 minutes manipulating sliders, generating massive Navboost dwell-time signals.", "1. Navboost Retention: ")
    add_bullet("Industry blogs and media embed the calculator via an <iframe> containing a mandatory dofollow watermark backlink.", "2. Organic Backlink Magnet: ")
    add_bullet("The calculator calculates the client's exact projected annual savings and offers a 1-click button: 'Chat on WhatsApp to Lock Projected ROI'.", "3. Frictionless Conversion: ")

    # ==================== CHAPTER 9 ====================
    add_h1("CHAPTER 9: THE TURNKEY AUTONOMOUS AI EXECUTION PROTOCOL")
    add_body("When this document is provided to an autonomous AI agent, the agent must execute the following step-by-step implementation sequence:")

    add_h2("Phase 1: Niche Discovery & Keyword Decomposition")
    add_bullet("Identify the core commercial category and extract 50 to 500 B2B Plural Persona keywords using Chapter 3.5's formula.", "Step 1.1: ")
    add_bullet("Validate that all keywords target high-intent Bottom-of-Funnel (BOFU) searchers (agencies, directors, CTOs).", "Step 1.2: ")

    add_h2("Phase 2: Programmatic Landing Page Construction")
    add_bullet("Generate pages adhering strictly to Sturm Tri-Alignment (Slug = Title = H1).", "Step 2.1: ")
    add_bullet("Assert 400–550 word count and <= 3 sentences per paragraph.", "Step 2.2: ")
    add_bullet("Audit the Moz score to confirm it hits the 96–98 sweet spot (never 100).", "Step 2.3: ")
    add_bullet("Ensure the Primary CTA button precedes the hero graphic in the mobile DOM.", "Step 2.4: ")

    add_h2("Phase 3: Generative Whitepaper & Answer Capsule Injection")
    add_bullet("Generate 1,800+ word technical whitepapers answering core industry architectural questions.", "Step 3.1: ")
    add_bullet("Inject a 42–48 word Answer Capsule directly beneath the primary <h2> question.", "Step 3.2: ")
    add_bullet("Ground all concepts with canonical Wikidata QID triples in JSON-LD markup.", "Step 3.3: ")

    add_h2("Phase 4: Technical Build, SSG & Instant Indexing")
    add_bullet("Compile the application and pre-render all routes into static HTML DOM.", "Step 4.1: ")
    add_bullet("Generate hierarchical sitemap.xml with separate core and solutions sub-sitemaps.", "Step 4.2: ")
    add_bullet("Broadcast all URLs via the real-time IndexNow batch push API (HTTP 200).", "Step 4.3: ")

    add_h2("Phase 5: Authority Stacking & Verification")
    add_bullet("Verify 100% NAP parity across Clutch, GoodFirms, G2, Trustpilot, and Crunchbase.", "Step 5.1: ")
    add_bullet("Anchor physical coordinates in Google Business Profile (Local 3-Pack).", "Step 5.2: ")
    add_bullet("Deploy weekly digital PR pitches with hard metrics to win tier-1 editorial backlinks.", "Step 5.3: ")

    add_callout(
        "EXECUTION COMPLETION GUARANTEE:\n"
        "By enforcing the 9 chapters of this specification, any web property transitions from an invisible digital outpost "
        "into an unassailable algorithmic fortress. Organic visibility, Generative AI consensus citations, "
        "and Position #1 commercial rankings are the mathematically inevitable result.",
        title="THE FINAL ARCHITECTURAL LAW",
        border_color="0F172A",
        bg_color="F1F5F9"
    )

    # Save to both paths
    output_path_workspace = "/Users/krdeeksha/ELESIUM WEBSITE/THE_INEVITABLE_NUMBER_ONE_RANKING_BIBLE.docx"
    output_path_artifact = "/Users/krdeeksha/.gemini/antigravity/brain/bb4cbc08-3a3a-4bae-9049-6456092685d5/THE_INEVITABLE_NUMBER_ONE_RANKING_BIBLE.docx"
    
    doc.save(output_path_workspace)
    doc.save(output_path_artifact)
    print(f"Successfully generated DOCX at:\n1. {output_path_workspace}\n2. {output_path_artifact}")

if __name__ == "__main__":
    build_document()
