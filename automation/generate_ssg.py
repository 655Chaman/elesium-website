#!/usr/bin/env python3
"""
generate_ssg.py

Runs AFTER vite build.
Reads dist/index.html and src/data/blogPosts.ts.
For each blog post, it generates a physical dist/signals/<slug>/index.html file
with:
1. Correct, unique canonical URL tags (solving the sitewide canonical collapse bug).
2. Fully pre-rendered semantic HTML inside <div id="root"></div> so search engines,
   curl, and AI crawlers immediately index the complete title, metadata, author E-E-A-T,
   intro/Answer Capsule, all headings, body paragraphs, tables, and FAQ schemas.
3. Matching JSON-LD Article, BreadcrumbList, FAQPage, and Person schemas.
4. SSG generation for all core static landing pages and video masterclasses.
"""

import html
import json
import os
import re
import subprocess
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DIST_DIR = BASE_DIR / "frontend" / "dist"
DIST_INDEX = DIST_DIR / "index.html"
TS_PATH = BASE_DIR / "frontend" / "src" / "data" / "blogPosts.ts"
SOLUTIONS_TS_PATH = BASE_DIR / "frontend" / "src" / "data" / "solutionsData.ts"
COMPACT_QUEUE_PATH = BASE_DIR / "automation" / "compact_keywords_queue.json"
VIDEOS_TS_PATH = BASE_DIR / "frontend" / "src" / "data" / "videoMasterclasses.ts"
VIDEO_SCRIPTS_DIR = BASE_DIR / "automation" / "video_scripts"

def load_solutions_via_node():
    """
    Loads all solution items from solutionsData.ts with fallback to compact_keywords_queue.json.
    """
    solutions = []
    if SOLUTIONS_TS_PATH.exists():
        content = SOLUTIONS_TS_PATH.read_text(encoding="utf-8")
        # Try direct JSON extraction of solutionsData
        m = re.search(r'export const solutionsData:\s*(?:SolutionRecord|SolutionItem)\[\]\s*=\s*(\[[\s\S]*?\]);', content)
        if m:
            try:
                solutions = json.loads(m.group(1))
                print(f"Loaded {len(solutions)} solutions directly from solutionsData.ts via JSON.")
            except Exception as e:
                print(f"Direct JSON parse error: {e}")

        # Fallback to Node bridge if regex was incomplete
        if not solutions:
            code = content
            code = re.sub(r'export\s+interface[\s\S]*?(?=export\s+const)', '', code)
            code = re.sub(r'export\s+const\s+solutionsData:\s*(?:SolutionRecord|SolutionItem)\[\]\s*=', 'const solutionsData =', code)
            code = re.sub(r'export\s+const\s+solutionCategories[\s\S]*$', '', code)
            code += '\nconsole.log(JSON.stringify(solutionsData));\n'
            tmp_bridge = BASE_DIR / "frontend" / "src" / "data" / ".tmp_bridge_solutions.cjs"
            tmp_bridge.write_text(code, encoding="utf-8")
            try:
                res = subprocess.run(["node", str(tmp_bridge)], capture_output=True, text=True, check=True)
                solutions = json.loads(res.stdout)
                print(f"Loaded {len(solutions)} solutions from solutionsData.ts via Node bridge.")
            except Exception as e:
                print(f"Node bridge error on solutions: {e}. Falling back...")
            finally:
                if tmp_bridge.exists():
                    tmp_bridge.unlink()

    if COMPACT_QUEUE_PATH.exists():
        try:
            queue_data = json.loads(COMPACT_QUEUE_PATH.read_text(encoding="utf-8"))
            existing_slugs = {s.get("slug") for s in solutions}
            for item in queue_data:
                slug = item.get("slug")
                if slug and slug not in existing_slugs:
                    keyword = item.get("keyword", slug.replace("-", " ").title())
                    benefit = item.get("key_benefit", "Autonomous Multi-Agent Enterprise Workflows")
                    solutions.append({
                        "id": item.get("id", slug),
                        "slug": slug,
                        "h1": f"{keyword} — {benefit}",
                        "title": f"{keyword} — {benefit} | Elesium",
                        "metaDescription": f"Deploy {keyword} with sub-200ms deterministic workflows, private VPC security, and enterprise ERP integration. Request an architecture audit.",
                        "hubCategory": item.get("hub_category", "Logistics & Supply Chain"),
                        "category": item.get("hub_category", "Logistics & Supply Chain"),
                        "targetPersona": item.get("target_persona", "Enterprise Technology Decision-Makers"),
                        "intent": "High-Lever BOFU",
                        "primaryCtaText": item.get("primary_cta", "Schedule Private AI Architecture Audit"),
                        "primaryCta": item.get("primary_cta", "Schedule Private AI Architecture Audit"),
                        "hero": {
                            "hookSentence": f"{keyword} deploys deterministic multi-agent state machines to eliminate manual operational latency and fragmented data reconciliation.",
                            "subheadline": "Enterprise technology leaders deploy sovereign AI architectures with guaranteed execution SLAs.",
                            "ctaText": item.get("primary_cta", "Schedule Private AI Architecture Audit"),
                            "heroImage": f"/assets/solutions/{slug}-architecture.webp",
                            "heroImageAlt": keyword
                        },
                        "firstSentence": f"{keyword} deploys deterministic multi-agent state machines to eliminate manual operational latency and fragmented data reconciliation.",
                        "paragraphs": [
                            f"Enterprise operations require sub-second execution guarantees rather than probabilistic conversational guesswork.",
                            f"Elesium engineers sovereign agentic architectures deployed inside your private VPC with zero data retention and continuous SLA monitoring.",
                            f"Direct API and RFC connectors bridge legacy databases, SAP, and core ERP systems with verifiable state logging."
                        ]
                    })
        except Exception as e:
            print(f"Error reading compact queue for SSG: {e}")

    return solutions

def render_solution_semantic_html(sol):
    """
    Renders semantic HTML for an individual solution page according to Edward Sturm's
    mobile geometry protocol: H1 -> Intro -> CTA -> Hero Graphic.
    """
    h1 = html.escape(sol.get("h1", sol.get("keyword", "")))
    category = html.escape(sol.get("hubCategory", sol.get("category", "Enterprise AI Solutions")))
    target_persona = html.escape(sol.get("targetPersona", "Enterprise Decision-Makers"))
    
    hero = sol.get("hero", {})
    first_sentence = html.escape(sol.get("firstSentence", hero.get("hookSentence", "")))
    primary_cta = html.escape(sol.get("primaryCta", sol.get("primaryCtaText", hero.get("ctaText", "Schedule AI Architecture Audit"))))
    slug = html.escape(sol.get("slug", ""))
    
    # Extract copy paragraphs from sol.paragraphs or sol.blocks
    paragraphs = sol.get("paragraphs", [])
    if not paragraphs and "blocks" in sol:
        for block in sol["blocks"]:
            paragraphs.extend(block.get("copy", []))
    if not paragraphs and hero.get("subheadline"):
        paragraphs.append(hero.get("subheadline"))
    
    p_html = "".join(f'<p style="margin-bottom:1.25rem;line-height:1.75;color:#374151;">{html.escape(p)}</p>' for p in paragraphs)
    
    # Extract specs
    specs = sol.get("specs", [])
    if not specs and "blocks" in sol:
        for block in sol["blocks"]:
            specs.extend(block.get("specs", []))
    specs_html = "".join(
        f'<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;margin-bottom:0.75rem;">'
        f'<div style="font-size:0.75rem;font-weight:600;color:#2563eb;text-transform:uppercase;">{html.escape(s.get("label", ""))}</div>'
        f'<div style="font-size:1.125rem;font-weight:700;color:#111827;margin-top:0.25rem;">{html.escape(s.get("value", ""))}</div>'
        f'</div>'
        for s in specs
    )

    # Extract capabilities or block bullets
    caps = sol.get("capabilities", [])
    if not caps and "blocks" in sol:
        for block in sol["blocks"]:
            for bullet in block.get("bullets", []):
                caps.append({"title": block.get("title", "Capability"), "description": bullet})
    caps_html = "".join(
        f'<li style="margin-bottom:1rem;">'
        f'<strong style="color:#111827;">{html.escape(c.get("title", ""))}:</strong> '
        f'<span style="color:#4b5563;">{html.escape(c.get("description", ""))}</span>'
        f'</li>'
        for c in caps
    )

    faqs = list(sol.get("faqs", []))
    if not faqs:
        kw = sol.get("keyword", sol.get("h1", "enterprise AI solution"))
        faqs = [
            {
                "question": f"How does {kw} integrate with enterprise legacy systems?",
                "answer": "We interface via secure REST webhooks, direct read-replica database connectors, and certified enterprise protocols without modifying core application code."
            },
            {
                "question": "What are the data privacy and residency guarantees for this deployment?",
                "answer": "All computation executes inside a dedicated private VPC or on-premise hardware with zero data retention, strict zero third-party telemetry, and full DPDP Act 2023 statutory compliance."
            },
            {
                "question": "What is the expected production deployment timeline?",
                "answer": "A scoped pilot architecture typically achieves production deployment within 14 calendar days, backed by our standard 90-day contractual return-on-investment guarantee."
            }
        ]
    elif len(faqs) < 3:
        faqs.append({
            "question": "What is the ongoing operational maintenance and SLA guarantee?",
            "answer": "Every enterprise deployment includes 24/7 telemetry monitoring, automated security patch updates, and dedicated systems engineering response SLAs."
        })
    faqs_html = "".join(
        f'<div style="margin-bottom:1.5rem;">'
        f'<dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">{html.escape(f.get("question", ""))}</dt>'
        f'<dd style="color:#4b5563;line-height:1.6;margin:0;">{html.escape(f.get("answer", ""))}</dd>'
        f'</div>'
        for f in faqs
    )

    trust_section = sol.get("trustSection", {})
    trust_title = trust_section.get("title", "Enterprise Compliance & Air-Gapped Security")
    trust_badges = trust_section.get("complianceBadges", [
        "DPDP Act 2023 Statutory Indian Data Protection",
        "SOC-2 Type II Certified Operational Controls",
        "Sovereign Cloud Deployment (AWS ap-south-1 & CtrlS)"
    ])
    trust_sla = trust_section.get("slaGuarantee", "Zero data retention guarantee. Deployable across dedicated AWS, GCP, or Azure private VPCs with DPDP Act 2023, ISO 27001, and SOC-2 Type II cryptographic state audit verification.")
    badges_html = "".join(f'<li style="color:#4b5563;margin-bottom:0.25rem;">• {html.escape(b)}</li>' for b in trust_badges)

    hero_img = hero.get("heroImage", f"/assets/solutions/{slug}-architecture.webp")
    hero_alt = html.escape(hero.get("heroImageAlt", h1))

    return f"""
<div id="prerendered-solution" style="max-width:900px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header style="margin-bottom:2.5rem;">
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em;margin-bottom:0.5rem;">{category} • Designed for {target_persona}</div>
    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">{h1}</h1>
    <p style="font-size:1.25rem;line-height:1.6;color:#374151;margin-bottom:1.5rem;"><strong>{first_sentence}</strong></p>
    <div class="cta-container" style="margin:1.5rem 0 2rem 0;">
      <a href="#audit" style="display:inline-block;background:#2563eb;color:#ffffff;padding:0.875rem 1.75rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">{primary_cta} &rarr;</a>
    </div>
    <div class="hero-graphic" style="background:#f3f4f6;border-radius:0.75rem;padding:1.5rem;text-align:center;margin:1.5rem 0;">
      <img src="{hero_img}" alt="{hero_alt}" style="max-width:100%;height:auto;border-radius:0.5rem;" />
    </div>
  </header>
  <main>
    <section style="margin:2.5rem 0;">
      <h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Deterministic Operational Capabilities</h2>
      {f'<ul style="list-style-type:none;padding:0;">{caps_html}</ul>' if caps_html else ''}
      <div style="margin-top:1.5rem;">{p_html}</div>
    </section>
    {f'<section style="margin:2.5rem 0;border-top:1px solid #e5e7eb;padding-top:2rem;"><h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Technical Specifications &amp; SLAs</h2><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:1rem;">{specs_html}</div></section>' if specs_html else ''}
    <section style="margin:2.5rem 0;border-top:1px solid #e5e7eb;padding-top:2rem;background:#f9fafb;padding:1.5rem;border-radius:0.5rem;">
      <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-top:0;">{html.escape(trust_title)}</h3>
      <p style="color:#4b5563;margin-bottom:0.75rem;">{html.escape(trust_sla)}</p>
      <ul style="list-style-type:none;padding:0;margin:0;">{badges_html}</ul>
    </section>
    {f'<section style="margin:2.5rem 0;border-top:1px solid #e5e7eb;padding-top:2rem;"><h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Frequently Asked Questions</h2><dl>{faqs_html}</dl></section>' if faqs_html else ''}
  </main>
</div>
"""

def render_solutions_hub_semantic_html(solutions):
    """
    Renders semantic HTML for the /solutions central hub.
    Links to all child BOFU landing pages using their exact <h1> titles as anchor text.
    """
    categories = {}
    for sol in solutions:
        cat = sol.get("category", "Enterprise AI Solutions")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(sol)

    cat_sections = []
    for cat_name, items in categories.items():
        links_html = "".join(
            f'<li style="margin-bottom:1rem;background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;">'
            f'<a href="/solutions/{html.escape(item.get("slug", ""))}" style="font-weight:700;color:#2563eb;text-decoration:none;font-size:1.125rem;">{html.escape(item.get("h1", ""))} &rarr;</a>'
            f'<p style="color:#4b5563;font-size:0.875rem;margin:0.5rem 0 0 0;">{html.escape(item.get("firstSentence", ""))}</p>'
            f'</li>'
            for item in items
        )
        cat_sections.append(
            f'<div style="margin-bottom:2.5rem;">'
            f'<h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:1rem;border-bottom:2px solid #e5e7eb;padding-bottom:0.5rem;">{html.escape(cat_name)}</h2>'
            f'<ul style="list-style-type:none;padding:0;">{links_html}</ul>'
            f'</div>'
        )

    return f"""
<div id="prerendered-solutions-hub" style="max-width:1000px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header style="margin-bottom:3rem;text-align:center;">
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.875rem;letter-spacing:0.05em;margin-bottom:0.5rem;">Elesium Enterprise AI Solutions</div>
    <h1 style="font-size:2.75rem;font-weight:800;line-height:1.2;margin:0 0 1.25rem 0;color:#111827;">Enterprise AI Solutions &amp; Sovereign Automation Workflows</h1>
    <p style="font-size:1.25rem;line-height:1.6;color:#4b5563;max-width:750px;margin:0 auto;">Deterministic multi-agent systems and air-gapped VPC architectures engineered for enterprise decision-makers across logistics, BFSI, manufacturing, healthcare, and legacy ERP integration.</p>
  </header>
  <main>
    {''.join(cat_sections)}
    <div style="background:#111827;color:#ffffff;border-radius:1rem;padding:2.5rem;text-align:center;margin-top:3rem;">
      <h2 style="font-size:2rem;font-weight:700;margin-top:0;margin-bottom:1rem;">Ready to Deploy Deterministic AI Infrastructure?</h2>
      <p style="color:#9ca3af;font-size:1.125rem;max-width:600px;margin:0 auto 1.5rem auto;">Schedule a 30-minute private architecture feasibility audit with Principal AI Systems Architect Chaman Shah.</p>
      <a href="/ai-automation-agency-india#audit" style="display:inline-block;background:#2563eb;color:#ffffff;padding:0.875rem 2rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Schedule Architecture Audit &rarr;</a>
    </div>
  </main>
</div>
"""

def load_posts_via_node():
    """
    Loads all blog posts with 100% fidelity using a temporary Node bridge
    that strips TypeScript interfaces and executes in V8.
    """
    if not TS_PATH.exists():
        print(f"Error: {TS_PATH} not found.")
        return []

    content = TS_PATH.read_text(encoding="utf-8")
    code = content
    code = re.sub(r'export interface[\s\S]*?(?=export const)', '', code)
    code = re.sub(r'export const blogPosts:\s*BlogPost\[\]\s*=', 'const blogPosts =', code)
    code += '\nconsole.log(JSON.stringify(blogPosts));\n'

    tmp_bridge = BASE_DIR / "frontend" / "src" / "data" / ".tmp_bridge_ssg.cjs"
    tmp_bridge.write_text(code, encoding="utf-8")

    try:
        res = subprocess.run(["node", str(tmp_bridge)], capture_output=True, text=True, check=True)
        posts = json.loads(res.stdout)
        return posts
    except Exception as e:
        print(f"Node bridge error: {e}. Falling back to regex parser...")
        return fallback_extract_posts(content)
    finally:
        if tmp_bridge.exists():
            tmp_bridge.unlink()

def fallback_extract_posts(ts_content):
    """Fallback regex extractor if Node is unavailable."""
    posts = []
    blocks = re.findall(r'\{[^{]*?["\']?slug["\']?\s*:\s*["\']([^"\']+)["\'][\s\S]*?\}', ts_content)
    for block in blocks:
        post = {"slug": block}
        posts.append(post)
    return posts

def render_post_semantic_html(post):
    """
    Renders rich, accessible semantic HTML for crawlers and non-JS clients.
    Mounted inside <div id="root">, it is replaced cleanly by React on mount.
    """
    title = html.escape(post.get("title", "Market Signals | Elesium").replace("**", ""))
    category = html.escape(post.get("category", "Market Intelligence"))
    date = html.escape(post.get("date", ""))
    read_time = html.escape(post.get("readTime", ""))
    intro = html.escape(post.get("intro", ""))
    author = post.get("author", {"name": "Chaman Shah", "role": "Principal AI Systems Architect"})
    author_name = html.escape(author.get("name", "Chaman Shah"))
    author_role = html.escape(author.get("role", "Principal AI Systems Architect"))

    sections = post.get("sections", [])
    body_parts = []
    for sec in sections:
        stype = sec.get("type")
        val = sec.get("value")
        if stype == "heading":
            h_text = html.escape(str(val).replace("**", ""))
            body_parts.append(f'<h2 style="font-size:1.5rem;font-weight:700;margin-top:2rem;margin-bottom:1rem;color:#111827;">{h_text}</h2>')
        elif stype == "paragraph":
            p_text = html.escape(str(val))
            body_parts.append(f'<p style="margin-bottom:1.25rem;line-height:1.75;color:#374151;">{p_text}</p>')
        elif stype == "list" and isinstance(val, list):
            items = "".join(f'<li style="margin-bottom:0.5rem;">{html.escape(str(item))}</li>' for item in val)
            body_parts.append(f'<ul style="margin:1rem 0 1.5rem 1.5rem;list-style-type:disc;color:#374151;">{items}</ul>')
        elif stype == "quote":
            q_text = html.escape(str(val))
            body_parts.append(f'<blockquote style="border-left:4px solid #2563eb;padding-left:1rem;margin:1.5rem 0;font-style:italic;color:#4b5563;"><p>{q_text}</p></blockquote>')
        elif stype == "metric" and isinstance(val, list):
            m_items = "".join(
                f'<div style="background:#f3f4f6;padding:1rem;border-radius:0.5rem;margin-bottom:0.75rem;">'
                f'<div style="font-size:1.5rem;font-weight:700;color:#111827;">{html.escape(m.get("value", ""))}</div>'
                f'<div style="font-size:0.75rem;font-weight:600;color:#2563eb;text-transform:uppercase;">{html.escape(m.get("label", ""))}</div>'
                f'<div style="font-size:0.875rem;color:#4b5563;margin-top:0.25rem;">{html.escape(m.get("description", ""))}</div>'
                f'</div>'
                for m in val
            )
            body_parts.append(f'<div class="metrics-grid" style="margin:1.5rem 0;">{m_items}</div>')
        elif stype in ["playground", "roi_calculator", "code_block", "mermaid", "audio_briefing", "blueprint_download"]:
            tool_name = stype.replace("_", " ").title()
            body_parts.append(
                f'<div class="interactive-asset-container" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.25rem;margin:1.5rem 0;">'
                f'<p style="font-weight:600;color:#1f2937;margin-bottom:0.25rem;">⚡ Interactive Engineering Tool: {tool_name}</p>'
                f'<p style="font-size:0.875rem;color:#6b7280;margin:0;">Interactive visualization active in modern JavaScript browsers. Complete architecture state and parameters available in primary manifest.</p>'
                f'</div>'
            )

    faq_parts = []
    faqs = post.get("faq", [])
    if faqs:
        faq_items = "".join(
            f'<div style="margin-bottom:1.5rem;">'
            f'<dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">{html.escape(f.get("q", ""))}</h4>'
            f'<dd style="color:#4b5563;line-height:1.6;margin:0;">{html.escape(f.get("a", ""))}</dd>'
            f'</div>'
            for f in faqs
        )
        faq_parts.append(
            f'<section class="faq-section" style="margin-top:3rem;padding-top:2rem;border-top:1px solid #e5e7eb;">'
            f'<h2 style="font-size:1.75rem;font-weight:700;margin-bottom:1.5rem;color:#111827;">Frequently Asked Questions</h2>'
            f'<dl>{faq_items}</dl>'
            f'</section>'
        )

    article_html = f"""
<div id="prerendered-article" style="max-width:800px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header>
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em;margin-bottom:0.5rem;">{category}</div>
    <h1 style="font-size:2.25rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">{title}</h1>
    <div style="color:#6b7280;font-size:0.875rem;margin-bottom:1.5rem;">
      <time>{date}</time> • <span>{read_time}</span> • <span>Author: <strong>{author_name}</strong> ({author_role})</span>
    </div>
    <div style="font-size:1.125rem;line-height:1.7;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid #e5e7eb;color:#1f2937;">
      <p><strong>{intro}</strong></p>
    </div>
  </header>
  <main class="article-body">
    {''.join(body_parts)}
  </main>
  {''.join(faq_parts)}
</div>
"""
    return article_html

def render_roi_calculator_tool_semantic_html():
    """
    Renders rich semantic HTML for the /tools/enterprise-ai-roi-calculator standalone tool.
    Provides complete crawlable mathematical formulas, production benchmarks, and FAQ schemas.
    """
    return """
<div id="prerendered-roi-calculator" style="max-width:960px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header style="margin-bottom:2.5rem;">
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em;margin-bottom:0.5rem;">Enterprise Financial Modeler • Production Benchmarked</div>
    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Automation ROI &amp; Payback Calculator</h1>
    <p style="font-size:1.25rem;line-height:1.6;color:#374151;margin-bottom:1.5rem;">
      <strong>The Elesium Enterprise AI ROI model calculates financial labor savings, operational capacity gains, and capital payback periods when replacing manual repetitive workflows with deterministic multi-agent state machines deployed in sovereign private VPCs. Indian and global enterprises achieve full capital payback in 0.8 to 1.4 months with 290% to 480% 3-year net cash-flow returns under verified 90-day production SLAs.</strong>
    </p>
    <div style="margin:1.5rem 0;">
      <a href="/ai-automation-agency-india#audit" style="display:inline-block;background:#2563eb;color:#ffffff;padding:0.875rem 1.75rem;border-radius:0.5rem;text-decoration:none;font-weight:600;">Schedule Architecture Feasibility Audit &rarr;</a>
    </div>
  </header>
  <main>
    <section style="background:#070b12;color:#ffffff;border:1px solid #1e3a8a;border-radius:1rem;padding:2rem;margin:2.5rem 0;">
      <div style="font-size:0.75rem;font-family:monospace;color:#60a5fa;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Interactive Tool Engine State</div>
      <h2 style="font-size:1.75rem;font-weight:700;margin:0 0 1rem 0;color:#ffffff;">Audited Baseline Financial Projections</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin:1.5rem 0;">
        <div style="background:rgba(255,255,255,0.05);padding:1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:0.75rem;color:#9ca3af;font-family:monospace;">Team Squad Size</div>
          <div style="font-size:1.25rem;font-weight:700;color:#60a5fa;margin-top:0.25rem;">15 FTEs</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:0.25rem;">Analyst / Operations</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);padding:1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:0.75rem;color:#9ca3af;font-family:monospace;">Labor Rate Baseline</div>
          <div style="font-size:1.25rem;font-weight:700;color:#60a5fa;margin-top:0.25rem;">₹1,400 / hr ($65)</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:0.25rem;">Fully loaded cost</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);padding:1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:0.75rem;color:#9ca3af;font-family:monospace;">Automation Efficiency</div>
          <div style="font-size:1.25rem;font-weight:700;color:#34d399;margin-top:0.25rem;">85% Automated</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:0.25rem;">LangGraph State Machine</div>
        </div>
        <div style="background:rgba(255,255,255,0.05);padding:1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.1);">
          <div style="font-size:0.75rem;color:#9ca3af;font-family:monospace;">Capital Breakeven</div>
          <div style="font-size:1.25rem;font-weight:700;color:#34d399;margin-top:0.25rem;">1.1 Months</div>
          <div style="font-size:0.75rem;color:#6b7280;margin-top:0.25rem;">Full capex payback</div>
        </div>
      </div>
      <div style="background:linear-gradient(135deg, rgba(30,58,138,0.4), rgba(0,0,0,0.6));border:1px solid rgba(59,130,246,0.4);border-radius:0.75rem;padding:1.5rem;margin-top:1.5rem;">
        <div style="font-size:0.875rem;color:#93c5fd;font-family:monospace;text-transform:uppercase;">Net Annual Value Reclaimed</div>
        <div style="font-size:2.5rem;font-weight:900;color:#ffffff;margin:0.25rem 0;">₹1.36 Crore ($164,000+)</div>
        <p style="color:#cbd5e1;font-size:0.875rem;margin:0.5rem 0 0 0;">11,016 manual hours saved annually across the squad with a 6.7x operational throughput multiplier and +318% 3-year net ROI.</p>
      </div>
    </section>

    <section style="margin:2.5rem 0;">
      <h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Deterministic Financial Formulas &amp; Methodology</h2>
      <p style="color:#4b5563;line-height:1.7;">Enterprise technology investments require mathematical verification rather than speculative AI claims. Our return-on-investment framework is derived from audited production client data:</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;margin:1.5rem 0;">
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.25rem;">
          <h3 style="font-size:1rem;font-weight:700;color:#2563eb;margin-top:0;">1. Reclaimed Labor Hours</h3>
          <p style="font-family:monospace;font-size:0.875rem;background:#ffffff;padding:0.5rem;border:1px solid #e5e7eb;border-radius:0.25rem;margin:0.5rem 0;">Hours = FTEs × Weekly_Hours × 48 × Efficiency%</p>
          <p style="font-size:0.8125rem;color:#4b5563;margin:0;">Standardized across 48 annual operational weeks, accounting for vacation and corporate holidays.</p>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.25rem;">
          <h3 style="font-size:1rem;font-weight:700;color:#059669;margin-top:0;">2. Net Annual Cost Savings</h3>
          <p style="font-family:monospace;font-size:0.875rem;background:#ffffff;padding:0.5rem;border:1px solid #e5e7eb;border-radius:0.25rem;margin:0.5rem 0;">Net_Savings = Gross_Savings - VPC_Maintenance (12%)</p>
          <p style="font-size:0.8125rem;color:#4b5563;margin:0;">Includes annual cloud GPU inference buffers, vector DB instances, and security patch updates.</p>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.25rem;">
          <h3 style="font-size:1rem;font-weight:700;color:#4f46e5;margin-top:0;">3. Payback Breakeven Period</h3>
          <p style="font-family:monospace;font-size:0.875rem;background:#ffffff;padding:0.5rem;border:1px solid #e5e7eb;border-radius:0.25rem;margin:0.5rem 0;">Payback_Months = Capex / (Gross_Savings / 12)</p>
          <p style="font-size:0.8125rem;color:#4b5563;margin:0;">Calendar months required for accumulated recovered labor to equal initial system engineering fees.</p>
        </div>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.25rem;">
          <h3 style="font-size:1rem;font-weight:700;color:#7c3aed;margin-top:0;">4. 3-Year Capital Net Return</h3>
          <p style="font-family:monospace;font-size:0.875rem;background:#ffffff;padding:0.5rem;border:1px solid #e5e7eb;border-radius:0.25rem;margin:0.5rem 0;">ROI% = [(3Y_Gross - 3Y_Cost) / 3Y_Cost] × 100</p>
          <p style="font-size:0.8125rem;color:#4b5563;margin:0;">Compound cash-flow yield across 36 consecutive months of production autonomous state execution.</p>
        </div>
      </div>
    </section>

    <section style="margin:2.5rem 0;border-top:1px solid #e5e7eb;padding-top:2rem;">
      <h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Production Architecture Benchmarks</h2>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.875rem;text-align:left;">
          <thead>
            <tr style="background:#f3f4f6;border-bottom:2px solid #e5e7eb;">
              <th style="padding:0.75rem 1rem;font-weight:700;color:#111827;">Enterprise Workflow</th>
              <th style="padding:0.75rem 1rem;font-weight:700;color:#111827;">Squad</th>
              <th style="padding:0.75rem 1rem;font-weight:700;color:#111827;">Automation %</th>
              <th style="padding:0.75rem 1rem;font-weight:700;color:#111827;">Payback</th>
              <th style="padding:0.75rem 1rem;font-weight:700;color:#111827;">3-Year ROI</th>
              <th style="padding:0.75rem 1rem;font-weight:700;color:#111827;">Regulatory Framework</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:0.75rem 1rem;font-weight:600;color:#111827;">BFSI Loan &amp; Credit Underwriting</td>
              <td style="padding:0.75rem 1rem;color:#4b5563;">18 FTEs</td>
              <td style="padding:0.75rem 1rem;color:#059669;font-weight:600;">85%</td>
              <td style="padding:0.75rem 1rem;color:#111827;">1.2 Mo</td>
              <td style="padding:0.75rem 1rem;color:#2563eb;font-weight:600;">+340%</td>
              <td style="padding:0.75rem 1rem;color:#6b7280;">RBI Digital Lending &amp; DPDP Act 2023</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;background:#fafafa;">
              <td style="padding:0.75rem 1rem;font-weight:600;color:#111827;">Manufacturing SAP S/4HANA Reconciliation</td>
              <td style="padding:0.75rem 1rem;color:#4b5563;">12 FTEs</td>
              <td style="padding:0.75rem 1rem;color:#059669;font-weight:600;">80%</td>
              <td style="padding:0.75rem 1rem;color:#111827;">1.4 Mo</td>
              <td style="padding:0.75rem 1rem;color:#2563eb;font-weight:600;">+290%</td>
              <td style="padding:0.75rem 1rem;color:#6b7280;">SAP RFC BAPI + ISO 27001</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <td style="padding:0.75rem 1rem;font-weight:600;color:#111827;">Healthcare Clinical &amp; Claims ETL</td>
              <td style="padding:0.75rem 1rem;color:#4b5563;">20 FTEs</td>
              <td style="padding:0.75rem 1rem;color:#059669;font-weight:600;">90%</td>
              <td style="padding:0.75rem 1rem;color:#111827;">0.9 Mo</td>
              <td style="padding:0.75rem 1rem;color:#2563eb;font-weight:600;">+410%</td>
              <td style="padding:0.75rem 1rem;color:#6b7280;">HIPAA / DPDP Private VPC Zero-Retention</td>
            </tr>
            <tr style="border-bottom:1px solid #e5e7eb;background:#fafafa;">
              <td style="padding:0.75rem 1rem;font-weight:600;color:#111827;">Enterprise SaaS RevOps / Triage</td>
              <td style="padding:0.75rem 1rem;color:#4b5563;">25 FTEs</td>
              <td style="padding:0.75rem 1rem;color:#059669;font-weight:600;">90%</td>
              <td style="padding:0.75rem 1rem;color:#111827;">0.8 Mo</td>
              <td style="padding:0.75rem 1rem;color:#2563eb;font-weight:600;">+480%</td>
              <td style="padding:0.75rem 1rem;color:#6b7280;">SOC-2 Type II + GDPR Compliant</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section style="margin:2.5rem 0;border-top:1px solid #e5e7eb;padding-top:2rem;">
      <h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Frequently Asked Questions</h2>
      <dl>
        <div style="margin-bottom:1.5rem;">
          <dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">How does the Elesium Enterprise AI ROI model calculate net savings?</dt>
          <dd style="color:#4b5563;line-height:1.6;margin:0;">The model calculates gross savings by multiplying team repetitive hours by the fully loaded hourly labor cost and target automation efficiency (typically 75%–92% in deterministic LangGraph state machines). It then subtracts a conservative 12% annual infrastructure and fine-tuning allocation from gross savings to arrive at true net cash-flow savings.</dd>
        </div>
        <div style="margin-bottom:1.5rem;">
          <dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">What infrastructure costs and operational overhead are included?</dt>
          <dd style="color:#4b5563;line-height:1.6;margin:0;">Unlike simplistic calculators, our model factors in initial architecture engineering (Python LangGraph orchestration, SAP/ERP connectors, private VPC containerization) and an ongoing 12% operational buffer covering dedicated cloud inferencing (AWS ap-south-1 / on-premise Ollama/vLLM) and telemetry audits.</dd>
        </div>
        <div style="margin-bottom:1.5rem;">
          <dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">How does private VPC deployment affect enterprise AI payback periods?</dt>
          <dd style="color:#4b5563;line-height:1.6;margin:0;">Private VPC and open-weights deployment (e.g. Llama 3 70B, DeepSeek) eliminates unpredictable commercial token fees ($0.03/1k tokens at scale). For teams processing 5,000+ monthly documents or 50,000+ database records, private VPC infrastructure lowers per-transaction inference costs by up to 88%, compressing payback periods to under 90 days.</dd>
        </div>
        <div style="margin-bottom:1.5rem;">
          <dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">Can we embed this ROI calculator on our internal intranet or partner portal?</dt>
          <dd style="color:#4b5563;line-height:1.6;margin:0;">Yes. You can embed the interactive widget directly using our verified embed snippet (&lt;iframe src="https://elesium.online/embed/roi-calculator" width="100%" height="750" frameborder="0"&gt;&lt;/iframe&gt;) without any licensing fees or external dependencies.</dd>
        </div>
        <div style="margin-bottom:1.5rem;">
          <dt style="font-weight:600;font-size:1.125rem;color:#111827;margin-bottom:0.5rem;">What is Elesium's contractual 90-day ROI mandate?</dt>
          <dd style="color:#4b5563;line-height:1.6;margin:0;">Every enterprise engagement is engineered against predetermined throughput and error SLAs. If our deployed multi-agent state machines do not reach their contractual efficiency and cash-flow positive ROI threshold within 90 calendar days, we provide continuous engineering until verified SLAs are met.</dd>
        </div>
      </dl>
    </section>
  </main>
</div>
"""

def render_roi_calculator_embed_semantic_html():
    """
    Renders clean semantic HTML for /embed/roi-calculator iframe embeds.
    """
    return """
<div id="prerendered-roi-calculator-embed" style="max-width:800px;margin:0 auto;padding:1.5rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#000000;color:#ffffff;min-height:100vh;">
  <header style="border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:1rem;margin-bottom:1.5rem;">
    <div style="font-size:0.75rem;font-family:monospace;color:#60a5fa;text-transform:uppercase;">Elesium Enterprise AI Architecture</div>
    <h1 style="font-size:1.75rem;font-weight:800;color:#ffffff;margin:0.25rem 0;">Enterprise AI ROI &amp; Payback Calculator</h1>
    <p style="font-size:0.875rem;color:#9ca3af;margin:0.25rem 0 0 0;">Interactive financial modeler for enterprise multi-agent automation workflows.</p>
  </header>
  <main>
    <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);border-radius:0.75rem;padding:1.5rem;margin-bottom:1.5rem;">
      <h2 style="font-size:1.25rem;font-weight:700;color:#ffffff;margin-top:0;">Baseline Labor Reclamation Metrics</h2>
      <ul style="list-style-type:none;padding:0;margin:1rem 0;color:#cbd5e1;font-size:0.875rem;line-height:1.8;">
        <li>• <strong>Analyst Squad Size:</strong> 15 Operations / Knowledge FTEs</li>
        <li>• <strong>Hourly Fully Loaded Rate:</strong> ₹1,400 / hr ($65 / hr)</li>
        <li>• <strong>Manual Repetitive Work:</strong> 18 Hours / Week / FTE</li>
        <li>• <strong>Target Automation Efficiency:</strong> 85% Autonomous Execution</li>
        <li>• <strong>Net Annual Labor Reclaimed:</strong> ₹1.36 Crore ($164,000+)</li>
        <li>• <strong>Payback Breakeven Period:</strong> 1.1 Months</li>
        <li>• <strong>3-Year Capital Net ROI:</strong> +318%</li>
      </ul>
      <p style="font-size:0.8125rem;color:#9ca3af;margin:0;">Interactive visualization and real-time sliders available in JavaScript-enabled browsers.</p>
    </div>
  </main>
  <footer style="border-top:1px solid rgba(255,255,255,0.1);padding-top:1rem;text-align:center;font-size:0.75rem;font-family:monospace;color:#6b7280;">
    Powered by <a href="https://elesium.online" target="_blank" style="color:#60a5fa;text-decoration:none;font-weight:700;">Elesium</a> • Deterministic Enterprise AI Infrastructure
  </footer>
</div>
"""

def replace_canonical(html_content, target_url):
    """
    Robust regex replacement for the canonical link tag.
    Handles self-closing slashes (/>), whitespace, and single/double quotes.
    """
    pattern = re.compile(r'<link\s+rel=["\']canonical["\']\s+href=["\'][^"\']*["\']\s*/?>', re.IGNORECASE)
    replacement = f'<link rel="canonical" href="{target_url}" />'
    if pattern.search(html_content):
        return pattern.sub(replacement, html_content)
    else:
        # If no canonical tag existed, inject it before </head>
        return html_content.replace("</head>", f'  {replacement}\n</head>')

def load_all_videos():
    """
    Loads all video masterclasses from videoMasterclasses.ts and any generated
    video scripts in automation/video_scripts/*.md.
    """
    videos = []
    if VIDEOS_TS_PATH.exists():
        content = VIDEOS_TS_PATH.read_text(encoding="utf-8")
        code = content
        code = re.sub(r'export\s+interface[\s\S]*?(?=export\s+const\s+videoMasterclasses)', '', code)
        code = re.sub(r'export\s+const\s+videoMasterclasses:\s*VideoMasterclass\[\]\s*=', 'var videoMasterclasses =', code)
        end_idx = code.find('];')
        if end_idx != -1:
            code = code[:end_idx + 2]
        code += '\nconsole.log(JSON.stringify(videoMasterclasses));\n'
        tmp_bridge = BASE_DIR / "frontend" / "src" / "data" / ".tmp_bridge_videos.cjs"
        tmp_bridge.write_text(code, encoding="utf-8")
        try:
            res = subprocess.run(["node", str(tmp_bridge)], capture_output=True, text=True, check=True)
            videos = json.loads(res.stdout)
            print(f"Loaded {len(videos)} videos from videoMasterclasses.ts via Node bridge.")
        except Exception as e:
            print(f"Node bridge error on videos: {e}. Falling back to regex parser...")
            matches = re.finditer(r'\{[^{}]*?id:\s*["\']([^"\']+)["\'][\s\S]*?slug:\s*["\']([^"\']+)["\'][\s\S]*?title:\s*["\']([^"\']+)["\'][\s\S]*?uploadDate:\s*["\']([^"\']+)["\']', content)
            for m in matches:
                videos.append({
                    "id": m.group(1),
                    "slug": m.group(2),
                    "title": m.group(3),
                    "uploadDate": m.group(4),
                    "youtubeId": "dQw4w9WgXcQ",
                    "duration": "20:00",
                    "durationIso": "PT20M",
                    "industry": "Enterprise Architecture",
                    "category": "System Architecture",
                    "executiveSummary": "Enterprise AI architecture teardown and deterministic systems blueprint.",
                    "roiMetrics": [],
                    "keyMoments": [],
                    "architectureStages": [],
                    "fullTranscript": "Full transcript available on site."
                })
        finally:
            if tmp_bridge.exists():
                tmp_bridge.unlink()

    # Discover any additional scripts in automation/video_scripts/video_manifest.json or *.md
    existing_slugs = {v.get("slug") for v in videos}
    manifest_path = VIDEO_SCRIPTS_DIR / "video_manifest.json"
    if manifest_path.exists():
        try:
            manifest_items = json.loads(manifest_path.read_text(encoding="utf-8"))
            for item in manifest_items:
                slug = item.get("slug")
                if slug and slug not in existing_slugs:
                    km = [
                        {
                            "time": tc.get("time", "").split(" - ")[0],
                            "seconds": tc.get("seconds", 0),
                            "title": tc.get("title", ""),
                            "description": tc.get("voiceover", tc.get("caption", ""))
                        }
                        for tc in item.get("timecodes", [])
                    ]
                    schema_data = item.get("schema", {})
                    summary = item.get("executiveSummary") or schema_data.get("description", f"A technical breakdown of {item.get('keyword', slug)}.")
                    transcript = item.get("fullTranscript") or item.get("transcript", "")
                    
                    video_obj = {
                        "id": item.get("id", slug),
                        "slug": slug,
                        "title": item.get("title", slug.replace("-", " ").title()),
                        "youtubeId": item.get("youtubeId", "dQw4w9WgXcQ"),
                        "duration": item.get("duration", "0:30"),
                        "durationIso": item.get("durationIso", "PT30S"),
                        "uploadDate": item.get("uploadDate", "2026-10-19T08:00:00+05:30"),
                        "industry": item.get("industry", "Enterprise AI & Systems Architecture"),
                        "category": item.get("category", "System Architecture"),
                        "executiveSummary": summary,
                        "roiMetrics": item.get("roiMetrics", [
                            {"label": "Audited ROI", "value": "3.5x", "detail": "Guaranteed in 90 days", "color": "#00D7FF"},
                            {"label": "Execution Latency", "value": "<200ms", "detail": "Sub-second ERP sync", "color": "#10C387"},
                            {"label": "Data Leakage", "value": "0%", "detail": "Private sovereign VPC", "color": "#C387FF"},
                            {"label": "Production SLA", "value": "99.9%", "detail": "Deterministic LangGraph", "color": "#FBBF24"}
                        ]),
                        "keyMoments": km if km else [
                            {"time": "00:00", "seconds": 0, "title": "Architectural Breakdown", "description": transcript[:120]}
                        ],
                        "architectureStages": item.get("architectureStages", [
                            {
                                "stage": "Stage 01",
                                "name": "Private Cloud & Sovereign VPC Ingestion",
                                "bullets": [
                                    "Zero data retention guarantees complying with DPDP Act 2023",
                                    "TLS 1.3 encrypted API gateways and enterprise identity verification"
                                ],
                                "techStack": "FastAPI • Redis • AWS ap-south-1 • DPDP Compliance Filter"
                            },
                            {
                                "stage": "Stage 02",
                                "name": "Deterministic LangGraph Execution Pod",
                                "bullets": [
                                    "Stateful cyclical DAG execution preventing probabilistic drift",
                                    "Sub-200ms node execution with automatic checkpoint recovery"
                                ],
                                "techStack": "LangGraph • Python 3.12 • Llama 3 • PostgreSQL Checkpointing"
                            },
                            {
                                "stage": "Stage 03",
                                "name": "Legacy ERP & Enterprise DB Connectors",
                                "bullets": [
                                    "ACID-compliant writeback to SAP S/4HANA and core databases",
                                    "Two-phase commit transaction reconciliation protocols"
                                ],
                                "techStack": "SAP RFC / OData • PostgreSQL • Apache Kafka • OpenTelemetry"
                            }
                        ]),
                        "fullTranscript": transcript
                    }
                    videos.append(video_obj)
                    existing_slugs.add(slug)
                    print(f"Loaded manifest video: {slug}")
        except Exception as e:
            print(f"Notice reading {manifest_path}: {e}")

    if VIDEO_SCRIPTS_DIR.exists():
        for md_file in sorted(VIDEO_SCRIPTS_DIR.glob("*.md")):
            slug = md_file.stem
            if slug not in existing_slugs:
                try:
                    md_text = md_file.read_text(encoding="utf-8")
                    title_m = re.search(r'^#\s*(.+)$', md_text, re.MULTILINE)
                    title = title_m.group(1).strip() if title_m else slug.replace("-", " ").title()
                    title = re.sub(r'^\d+-Second\s+Short-Form\s+Video\s+Script:\s*', '', title, flags=re.IGNORECASE)

                    kw_m = re.search(r'\*\*Target Keyword:\*\*\s*`?([^`\n]+)`?', md_text)
                    keyword = kw_m.group(1).strip() if kw_m else slug.replace("-", " ").title()

                    schema_m = re.search(r'```json\s*(\{[\s\S]*?\})\s*```', md_text)
                    schema_data = {}
                    if schema_m:
                        try:
                            schema_data = json.loads(schema_m.group(1))
                        except Exception:
                            pass

                    transcript = schema_data.get("transcript", "")
                    if not transcript:
                        spoken_matches = re.findall(r'\*\"([^\"]+)\"\*', md_text)
                        transcript = " ".join(spoken_matches) if spoken_matches else f"Architectural breakdown of {keyword}."

                    moments = []
                    table_rows = re.findall(r'\|\s*\*\*([^\*]+)\*\*\s*\|\s*([^\|]+)\|\s*\*\"([^\"]+)\"\*\s*\|\s*([^\|]+)\|', md_text)
                    for tr in table_rows:
                        tc = tr[0].strip()
                        desc = tr[1].strip()
                        spoken = tr[2].strip()
                        sec_m = re.search(r'(\d+)', tc)
                        secs = int(sec_m.group(1)) if sec_m else 0
                        moments.append({
                            "time": f"00:{secs:02d}",
                            "seconds": secs,
                            "title": desc[:60],
                            "description": spoken
                        })

                    if not moments:
                        moments = [
                            {"time": "00:00", "seconds": 0, "title": "Architectural Breakdown", "description": transcript[:120]}
                        ]

                    video_obj = {
                        "id": f"vm-{len(videos)+1}",
                        "slug": slug,
                        "title": schema_data.get("name", title),
                        "youtubeId": "dQw4w9WgXcQ",
                        "duration": "00:30",
                        "durationIso": schema_data.get("duration", "PT30S"),
                        "uploadDate": schema_data.get("uploadDate", "2026-10-10T08:00:00+05:30"),
                        "industry": "Enterprise AI & Systems Architecture",
                        "category": "Pricing & Architectural Economics",
                        "executiveSummary": schema_data.get("description", f"Architectural breakdown of {keyword} for Indian enterprises."),
                        "roiMetrics": [
                            {"label": "Audited ROI", "value": "3.5x", "detail": "Guaranteed in 90 days", "color": "#00D7FF"},
                            {"label": "Pilot Sprint", "value": "₹1.5L - ₹3.5L", "detail": "14-day delivery", "color": "#10C387"},
                            {"label": "Data Leakage", "value": "0%", "detail": "Private sovereign VPC", "color": "#C387FF"},
                            {"label": "Production SLA", "value": "99.9%", "detail": "Deterministic LangGraph", "color": "#FBBF24"}
                        ],
                        "keyMoments": moments,
                        "architectureStages": [
                            {
                                "stage": "Stage 01",
                                "name": "Private Cloud & Sovereign VPC Ingestion",
                                "bullets": [
                                    "Zero data retention guarantees complying with DPDP Act 2023",
                                    "TLS 1.3 encrypted API gateways and enterprise identity verification"
                                ],
                                "techStack": "FastAPI • Redis • AWS ap-south-1 • DPDP Compliance Filter"
                            },
                            {
                                "stage": "Stage 02",
                                "name": "Deterministic LangGraph Execution Pod",
                                "bullets": [
                                    "Stateful cyclical DAG execution preventing probabilistic drift",
                                    "Sub-200ms node execution with automatic checkpoint recovery"
                                ],
                                "techStack": "LangGraph • Python 3.12 • Llama 3 • PostgreSQL Checkpointing"
                            },
                            {
                                "stage": "Stage 03",
                                "name": "Legacy ERP & Enterprise DB Connectors",
                                "bullets": [
                                    "ACID-compliant writeback to SAP S/4HANA and core databases",
                                    "Two-phase commit transaction reconciliation protocols"
                                ],
                                "techStack": "SAP RFC / OData • PostgreSQL • Apache Kafka • OpenTelemetry"
                            }
                        ],
                        "fullTranscript": transcript
                    }
                    videos.append(video_obj)
                    existing_slugs.add(slug)
                    print(f"Discovered and parsed additional video script: {slug}")
                except Exception as e:
                    print(f"Error parsing video script {md_file.name}: {e}")

    return videos

def render_video_gallery_semantic_html(videos):
    """
    Renders rich semantic HTML for the /videos gallery hub.
    Lists all video masterclasses and architectural teardowns with clear navigational links.
    """
    video_cards = []
    for v in videos:
        slug = html.escape(v.get("slug", ""))
        title = html.escape(v.get("title", ""))
        summary = html.escape(v.get("executiveSummary", ""))
        industry = html.escape(v.get("industry", "Enterprise Architecture"))
        duration = html.escape(v.get("duration", "20:00"))
        metrics = v.get("roiMetrics", [])
        metrics_html = "".join(
            f'<span style="display:inline-block;background:#f3f4f6;padding:0.25rem 0.5rem;border-radius:0.25rem;font-size:0.75rem;margin-right:0.5rem;font-family:monospace;margin-bottom:0.25rem;">'
            f'<strong>{html.escape(m.get("label", ""))}:</strong> {html.escape(m.get("value", ""))} ({html.escape(m.get("detail", ""))})'
            f'</span>'
            for m in metrics[:3]
        )
        video_cards.append(f"""
        <article style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.75rem;padding:1.5rem;margin-bottom:1.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:0.75rem;font-family:monospace;color:#0284c7;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">
            {industry} • {duration} Runtime
          </div>
          <h2 style="font-size:1.5rem;font-weight:700;line-height:1.3;margin:0 0 0.75rem 0;">
            <a href="/videos/{slug}" style="color:#111827;text-decoration:none;">{title}</a>
          </h2>
          <p style="color:#4b5563;font-size:1rem;line-height:1.6;margin-bottom:1rem;">{summary}</p>
          {f'<div style="margin-bottom:1rem;">{metrics_html}</div>' if metrics_html else ''}
          <div>
            <a href="/videos/{slug}" style="display:inline-block;background:#0284c7;color:#ffffff;padding:0.6rem 1.25rem;border-radius:0.375rem;text-decoration:none;font-weight:600;font-size:0.875rem;">
              Watch Architecture Masterclass &amp; Read Transcript &rarr;
            </a>
          </div>
        </article>
        """)

    cards_html = "\n".join(video_cards)

    return f"""
<div id="prerendered-video-gallery" style="max-width:1000px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header style="margin-bottom:2.5rem;border-bottom:1px solid #e5e7eb;padding-bottom:1.5rem;">
    <div style="color:#0284c7;font-weight:600;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em;margin-bottom:0.5rem;">Engineering Masterclasses</div>
    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Architecture Masterclasses &amp; Video Teardowns</h1>
    <p style="font-size:1.125rem;line-height:1.6;color:#374151;max-width:800px;">
      Explore technical engineering breakdowns, sovereign private VPC blueprints, deterministic multi-agent state machines (LangGraph), and audited 90-day ROI case studies across Indian enterprise sectors.
    </p>
  </header>
  <main>
    <section>
      {cards_html}
    </section>
    <section style="margin-top:3rem;padding:2rem;background:#f9fafb;border-radius:0.75rem;border:1px solid #e5e7eb;">
      <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-top:0;">Need Custom Sovereign AI Infrastructure?</h3>
      <p style="color:#4b5563;line-height:1.6;">
        Elesium engineers private VPC multi-agent systems with zero data retention, sub-200ms deterministic execution, and DPDP Act 2023 compliance.
      </p>
      <a href="/ai-automation-agency-india" style="display:inline-block;background:#111827;color:#ffffff;padding:0.75rem 1.5rem;border-radius:0.375rem;text-decoration:none;font-weight:600;font-size:0.875rem;margin-top:0.5rem;">
        View Enterprise Pricing &amp; Service Tiers &rarr;
      </a>
    </section>
  </main>
</div>
"""

def render_video_detail_semantic_html(video):
    """
    Renders comprehensive semantic HTML DOM for /videos/:slug.
    Includes:
    - Metadata header (industry, duration, upload date)
    - H1 and Executive Summary
    - Video Cinema Section (embed iframe representation, schema-aligned contentUrl/embedUrl)
    - Audited ROI Metric Cards
    - Multi-stage System Architecture Blueprint (Stage 01, 02, 03)
    - Key Moments timestamp table
    - Full Verbatim Indexed Transcript
    - Executive CTA & audit links
    """
    slug = html.escape(video.get("slug", ""))
    title = html.escape(video.get("title", ""))
    summary = html.escape(video.get("executiveSummary", ""))
    industry = html.escape(video.get("industry", "Enterprise AI & Systems Architecture"))
    category = html.escape(video.get("category", "System Architecture"))
    duration = html.escape(video.get("duration", "20:00"))
    upload_date = html.escape(str(video.get("uploadDate", "2026-03-15")).split("T")[0])
    youtube_id = html.escape(video.get("youtubeId", "dQw4w9WgXcQ"))
    embed_url = f"https://www.youtube-nocookie.com/embed/{youtube_id}" if youtube_id else f"https://elesium.online/embed/{slug}"
    content_url = f"https://elesium.online/videos/{slug}"

    # ROI metrics
    metrics = video.get("roiMetrics", [])
    metrics_html = "".join(
        f'<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1rem;text-align:center;">'
        f'<div style="font-size:1.75rem;font-weight:800;color:{html.escape(m.get("color", "#0284c7"))};margin-bottom:0.25rem;">{html.escape(m.get("value", ""))}</div>'
        f'<div style="font-weight:600;font-size:0.875rem;color:#111827;">{html.escape(m.get("label", ""))}</div>'
        f'<div style="font-size:0.75rem;color:#6b7280;font-family:monospace;margin-top:0.25rem;">{html.escape(m.get("detail", ""))}</div>'
        f'</div>'
        for m in metrics
    )

    # Architecture stages
    stages = video.get("architectureStages", [])
    stages_html = "".join(
        f'<div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.25rem;margin-bottom:1rem;">'
        f'<div style="font-size:0.75rem;font-family:monospace;font-weight:700;color:#0284c7;text-transform:uppercase;">{html.escape(st.get("stage", ""))}</div>'
        f'<h3 style="font-size:1.125rem;font-weight:700;color:#111827;margin:0.25rem 0 0.75rem 0;">{html.escape(st.get("name", ""))}</h3>'
        f'<ul style="margin:0 0 1rem 0;padding-left:1.25rem;color:#4b5563;font-size:0.875rem;line-height:1.6;">'
        + "".join(f'<li>{html.escape(b)}</li>' for b in st.get("bullets", [])) +
        f'</ul>'
        f'<div style="border-top:1px solid #f3f4f6;padding-top:0.5rem;font-size:0.75rem;font-family:monospace;color:#6b7280;">'
        f'<strong>Engineered Stack:</strong> {html.escape(st.get("techStack", ""))}'
        f'</div>'
        f'</div>'
        for st in stages
    )

    # Key moments
    moments = video.get("keyMoments", [])
    moments_html = "".join(
        f'<tr style="border-bottom:1px solid #f3f4f6;">'
        f'<td style="padding:0.75rem 0.5rem;font-family:monospace;font-weight:700;color:#0284c7;white-space:nowrap;font-size:0.875rem;">{html.escape(km.get("time", ""))}</td>'
        f'<td style="padding:0.75rem 0.5rem;font-weight:600;color:#111827;font-size:0.875rem;">{html.escape(km.get("title", ""))}</td>'
        f'<td style="padding:0.75rem 0.5rem;color:#4b5563;font-size:0.875rem;line-height:1.5;">{html.escape(km.get("description", ""))}</td>'
        f'</tr>'
        for km in moments
    )

    # Transcript paragraphs
    transcript_text = video.get("fullTranscript", "").strip()
    transcript_paras = [p.strip() for p in transcript_text.split("\n\n") if p.strip()]
    transcript_html = "".join(
        f'<p style="margin-bottom:1rem;color:#374151;line-height:1.7;font-size:0.95rem;">{html.escape(p)}</p>'
        for p in transcript_paras
    )

    return f"""
<div id="prerendered-video-detail" style="max-width:960px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header style="margin-bottom:2rem;">
    <div style="font-size:0.75rem;font-family:monospace;color:#0284c7;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">
      {category} • {industry} • {duration} Runtime • Updated {upload_date}
    </div>
    <h1 style="font-size:2.25rem;font-weight:800;line-height:1.25;margin:0 0 1rem 0;color:#111827;">{title}</h1>
    <p style="font-size:1.125rem;line-height:1.6;color:#374151;margin-bottom:1.5rem;">{summary}</p>
  </header>

  <main>
    <!-- Video Player Container -->
    <section class="video-cinema-container" style="margin-bottom:2.5rem;background:#000000;border-radius:0.75rem;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.3);">
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;">
        <iframe
          src="{embed_url}"
          title="{title}"
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div style="padding:0.75rem 1rem;background:#111827;color:#9ca3af;font-size:0.75rem;font-family:monospace;display:flex;justify-content:space-between;align-items:center;">
        <span>Direct Canonical Stream: <a href="{content_url}" style="color:#38bdf8;text-decoration:none;">{content_url}</a></span>
        <span>Duration: {duration}</span>
      </div>
    </section>

    <!-- Audited ROI Metrics -->
    {f'<section style="margin-bottom:2.5rem;"><h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:1rem;">Audited Operational &amp; ROI Benchmarks</h2><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;">{metrics_html}</div></section>' if metrics_html else ''}

    <!-- System Architecture Blueprint -->
    {f'<section style="margin-bottom:2.5rem;"><h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:1rem;">System Architecture Blueprint</h2><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;">{stages_html}</div></section>' if stages_html else ''}

    <!-- Key Moments & Chapters -->
    {f'<section style="margin-bottom:2.5rem;"><h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-bottom:1rem;">Key Moments &amp; Timestamps</h2><table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:0.5rem;overflow:hidden;"><thead><tr style="background:#f9fafb;text-align:left;border-bottom:1px solid #e5e7eb;"><th style="padding:0.75rem 0.5rem;font-size:0.75rem;font-family:monospace;color:#6b7280;text-transform:uppercase;">Time</th><th style="padding:0.75rem 0.5rem;font-size:0.75rem;font-family:monospace;color:#6b7280;text-transform:uppercase;">Topic</th><th style="padding:0.75rem 0.5rem;font-size:0.75rem;font-family:monospace;color:#6b7280;text-transform:uppercase;">Engineering Summary</th></tr></thead><tbody>{moments_html}</tbody></table></section>' if moments_html else ''}

    <!-- Full Verbatim Transcript -->
    <section style="margin-bottom:2.5rem;padding:1.5rem;background:#f9fafb;border-radius:0.75rem;border:1px solid #e5e7eb;">
      <h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin-top:0;margin-bottom:1rem;">Full Verbatim Technical Transcript</h2>
      <div class="transcript-content" style="max-height:600px;overflow-y:auto;padding-right:0.5rem;">
        {transcript_html}
      </div>
    </section>

    <!-- Executive Action & Consultation CTA -->
    <section style="padding:2rem;background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%);color:#ffffff;border-radius:0.75rem;margin-top:2rem;">
      <div style="font-size:0.75rem;font-family:monospace;color:#38bdf8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Production AI Deployment</div>
      <h2 style="font-size:1.75rem;font-weight:800;color:#ffffff;margin:0 0 0.75rem 0;">Ready to Deploy Sovereign Multi-Agent Infrastructure?</h2>
      <p style="color:#cbd5e1;line-height:1.6;margin-bottom:1.5rem;max-width:700px;">
        Elesium engineers deterministic agentic state machines inside private VPCs, delivering audited 3x–5x cash-flow ROI in 90 days with guaranteed SLAs.
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
        <a href="/ai-automation-agency-india" style="display:inline-block;background:#38bdf8;color:#0f172a;padding:0.75rem 1.5rem;border-radius:0.375rem;text-decoration:none;font-weight:700;font-size:0.875rem;">
          Explore India Systems Pricing &rarr;
        </a>
        <a href="https://www.goodfirms.co/company/elesium-online" target="_blank" rel="noopener noreferrer" style="display:inline-block;border:1px solid #475569;background:rgba(255,255,255,0.05);color:#ffffff;padding:0.75rem 1.5rem;border-radius:0.375rem;text-decoration:none;font-weight:600;font-size:0.875rem;">
          GoodFirms Benchmarks &#8599;
        </a>
      </div>
    </section>
  </main>
</div>
"""

def generate_ssg():
    if not DIST_INDEX.exists():
        print(f"Error: {DIST_INDEX} not found. Must run after vite build.")
        return

    posts = load_posts_via_node()
    base_html = DIST_INDEX.read_text(encoding="utf-8")

    print(f"Starting SSG Generation for {len(posts)} posts...")

    for post in posts:
        slug = post["slug"]
        raw_title = post.get("title", "Market Signals | Elesium").replace("**", "")
        title = raw_title.replace("Elesium's", "Elesium's")
        desc = post.get("metaDescription", "")
        json_ld = post.get("jsonLdSchema", "")
        canonical_url = f"https://elesium.online/signals/{slug}"

        # Create output directory and direct HTML file
        out_dir = DIST_DIR / "signals" / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "index.html"
        direct_file = DIST_DIR / "signals" / f"{slug}.html"

        html_out = base_html

        # Replace Title
        html_out = re.sub(r"<title>.*?</title>", lambda m: f"<title>{title} | Elesium</title>", html_out)

        # Replace Description
        html_out = re.sub(r'<meta name="description" content="[^"]*">', 
                          lambda m: f'<meta name="description" content="{desc}">', html_out)

        # Replace Canonical with robust regex
        html_out = replace_canonical(html_out, canonical_url)

        # Replace OG Meta Tags
        html_out = re.sub(r'<meta property="og:title" content="[^"]*">', 
                          lambda m: f'<meta property="og:title" content="{title}">', html_out)
        html_out = re.sub(r'<meta property="og:description" content="[^"]*">', 
                          lambda m: f'<meta property="og:description" content="{desc}">', html_out)
        html_out = re.sub(r'<meta property="og:url" content="[^"]*">', 
                          lambda m: f'<meta property="og:url" content="{canonical_url}">', html_out)

        # Replace Twitter Meta Tags
        html_out = re.sub(r'<meta name="twitter:title" content="[^"]*">', 
                          lambda m: f'<meta name="twitter:title" content="{title}">', html_out)
        html_out = re.sub(r'<meta name="twitter:description" content="[^"]*">', 
                          lambda m: f'<meta name="twitter:description" content="{desc}">', html_out)

        # Change og:type to article
        html_out = html_out.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">')

        # Inject Pre-rendered Semantic HTML DOM into <div id="root">
        semantic_article = render_post_semantic_html(post)
        root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
        if root_pattern.search(html_out):
            html_out = root_pattern.sub(lambda m: f'<div id="root">{semantic_article}</div>', html_out)
        else:
            html_out = html_out.replace('<div id="root"></div>', f'<div id="root">{semantic_article}</div>')

        # Inject JSON-LD right before </head>
        author_schema = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Chaman Shah",
            "jobTitle": "Principal AI Systems Architect",
            "worksFor": {
                "@type": "Organization",
                "name": "Elesium",
                "url": "https://elesium.online"
            }
        }
        
        breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://elesium.online"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Market Signals",
                    "item": "https://elesium.online/signals"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": title,
                    "item": canonical_url
                }
            ]
        }

        injections = [
            f'<script type="application/ld+json">{json.dumps(author_schema, ensure_ascii=False)}</script>',
            f'<script type="application/ld+json">{json.dumps(breadcrumb, ensure_ascii=False)}</script>'
        ]
        if json_ld:
            injections.append(f'<script type="application/ld+json">{json_ld}</script>')

        html_out = html_out.replace("</head>", "\n" + "\n".join(injections) + "\n</head>")

        out_file.write_text(html_out, encoding="utf-8")
        direct_file.write_text(html_out, encoding="utf-8")
        print(f"Generated SSG for: /signals/{slug}")

    print("✅ SSG complete for signals.")

    print("Starting SSG Generation for System 2 Compact Solutions...")
    solutions = load_solutions_via_node()
    for sol in solutions:
        slug = sol["slug"]
        h1 = sol.get("h1", slug.replace("-", " ").title())
        title = sol.get("title", f"{h1} | Elesium")
        if not title.endswith("Elesium"):
            title = f"{title} | Elesium"
        desc = sol.get("metaDescription", f"Deploy {h1} with sub-2s deterministic workflows and private VPC security.")
        canonical_url = f"https://elesium.online/solutions/{slug}"

        out_dir = DIST_DIR / "solutions" / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "index.html"
        direct_file = DIST_DIR / "solutions" / f"{slug}.html"

        html_out = base_html

        # Replace Title
        html_out = re.sub(r"<title>.*?</title>", lambda m: f"<title>{title}</title>", html_out)

        # Replace Description
        html_out = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', 
                          lambda m: f'<meta name="description" content="{desc}" />', html_out)

        # Replace Canonical
        html_out = replace_canonical(html_out, canonical_url)

        # Replace OG Meta Tags
        html_out = re.sub(r'<meta property="og:title" content="[^"]*"\s*/?>', 
                          lambda m: f'<meta property="og:title" content="{title}" />', html_out)
        html_out = re.sub(r'<meta property="og:description" content="[^"]*"\s*/?>', 
                          lambda m: f'<meta property="og:description" content="{desc}" />', html_out)
        html_out = re.sub(r'<meta property="og:url" content="[^"]*"\s*/?>', 
                          lambda m: f'<meta property="og:url" content="{canonical_url}" />', html_out)

        # Replace Twitter Meta Tags
        html_out = re.sub(r'<meta name="twitter:title" content="[^"]*"\s*/?>', 
                          lambda m: f'<meta name="twitter:title" content="{title}" />', html_out)
        html_out = re.sub(r'<meta name="twitter:description" content="[^"]*"\s*/?>', 
                          lambda m: f'<meta name="twitter:description" content="{desc}" />', html_out)

        # Change og:type to website
        html_out = re.sub(r'<meta property="og:type" content="[^"]*"\s*/?>', '<meta property="og:type" content="website" />', html_out)

        # Inject Pre-rendered Semantic HTML DOM into <div id="root">
        semantic_sol = render_solution_semantic_html(sol)
        root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
        if root_pattern.search(html_out):
            html_out = root_pattern.sub(lambda m: f'<div id="root">{semantic_sol}</div>', html_out)
        else:
            html_out = html_out.replace('<div id="root"></div>', f'<div id="root">{semantic_sol}</div>')

        # Inject JSON-LD right before </head>
        service_schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": h1,
            "serviceType": "Enterprise AI Automation",
            "description": desc,
            "provider": {
                "@type": "LocalBusiness",
                "name": "Elesium - Enterprise AI Automation Agency",
                "url": "https://elesium.online"
            },
            "areaServed": {
                "@type": "Country",
                "name": "India"
            }
        }

        breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://elesium.online"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Solutions",
                    "item": "https://elesium.online/solutions"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": h1,
                    "item": canonical_url
                }
            ]
        }

        injections = [
            f'<script type="application/ld+json">{json.dumps(service_schema, ensure_ascii=False)}</script>',
            f'<script type="application/ld+json">{json.dumps(breadcrumb, ensure_ascii=False)}</script>'
        ]

        faqs = sol.get("faqs", [])
        if faqs:
            faq_schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": f.get("question", ""),
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f.get("answer", "")
                        }
                    }
                    for f in faqs
                ]
            }
            injections.append(f'<script type="application/ld+json">{json.dumps(faq_schema, ensure_ascii=False)}</script>')

        html_out = html_out.replace("</head>", "\n" + "\n".join(injections) + "\n</head>")

        out_file.write_text(html_out, encoding="utf-8")
        direct_file.write_text(html_out, encoding="utf-8")
        print(f"Generated SSG for: /solutions/{slug}")

    # Generate /solutions Hub Page
    print("Generating SSG for /solutions Hub...")
    hub_canonical = "https://elesium.online/solutions"
    hub_title = "Enterprise AI Solutions & Sovereign Automation Workflows | Elesium"
    hub_desc = "Explore Elesium's high-intent enterprise AI solutions across Logistics, BFSI, Healthcare, Manufacturing, and ERP integration. Deterministic multi-agent workflows and private VPC systems."

    hub_out_dir = DIST_DIR / "solutions"
    hub_out_dir.mkdir(parents=True, exist_ok=True)
    hub_out_file = hub_out_dir / "index.html"
    hub_direct_file = DIST_DIR / "solutions.html"

    hub_html = base_html
    hub_html = re.sub(r"<title>.*?</title>", f"<title>{hub_title}</title>", hub_html)
    hub_html = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', f'<meta name="description" content="{hub_desc}" />', hub_html)
    hub_html = replace_canonical(hub_html, hub_canonical)
    hub_html = re.sub(r'<meta property="og:title" content="[^"]*"\s*/?>', f'<meta property="og:title" content="{hub_title}" />', hub_html)
    hub_html = re.sub(r'<meta property="og:description" content="[^"]*"\s*/?>', f'<meta property="og:description" content="{hub_desc}" />', hub_html)
    hub_html = re.sub(r'<meta property="og:url" content="[^"]*"\s*/?>', f'<meta property="og:url" content="{hub_canonical}" />', hub_html)
    hub_html = re.sub(r'<meta name="twitter:title" content="[^"]*"\s*/?>', f'<meta name="twitter:title" content="{hub_title}" />', hub_html)
    hub_html = re.sub(r'<meta name="twitter:description" content="[^"]*"\s*/?>', f'<meta name="twitter:description" content="{hub_desc}" />', hub_html)

    hub_semantic = render_solutions_hub_semantic_html(solutions)
    root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
    if root_pattern.search(hub_html):
        hub_html = root_pattern.sub(lambda m: f'<div id="root">{hub_semantic}</div>', hub_html)
    else:
        hub_html = hub_html.replace('<div id="root"></div>', f'<div id="root">{hub_semantic}</div>')

    hub_breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://elesium.online"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Solutions",
                "item": hub_canonical
            }
        ]
    }
    hub_injections = [
        f'<script type="application/ld+json">{json.dumps(hub_breadcrumb, ensure_ascii=False)}</script>'
    ]
    hub_html = hub_html.replace("</head>", "\n" + "\n".join(hub_injections) + "\n</head>")

    hub_out_file.write_text(hub_html, encoding="utf-8")
    hub_direct_file.write_text(hub_html, encoding="utf-8")
    print("Generated SSG for: /solutions (Hub)")
    print("✅ SSG complete for solutions.")

    print("Starting SSG Generation for video routes...")
    videos = load_all_videos()
    print(f"Loaded {len(videos)} video masterclasses and scripts for SSG pre-rendering.")

    # 1. Individual Video Detail Pages (/videos/:slug)
    for video in videos:
        v_slug = video.get("slug")
        v_title = video.get("title", "Architecture Masterclass")
        v_desc = video.get("executiveSummary", "")
        v_canonical = f"https://elesium.online/videos/{v_slug}"
        v_youtube_id = video.get("youtubeId", "dQw4w9WgXcQ")
        v_duration_iso = video.get("durationIso", "PT20M")
        v_upload_date = video.get("uploadDate", "2026-03-15T09:00:00+05:30")
        v_transcript = video.get("fullTranscript", "").strip()

        v_out_dir = DIST_DIR / "videos" / v_slug
        v_out_dir.mkdir(parents=True, exist_ok=True)
        v_out_file = v_out_dir / "index.html"
        v_direct_file = DIST_DIR / "videos" / f"{v_slug}.html"

        v_html = base_html
        v_html = re.sub(r"<title>.*?</title>", f"<title>{v_title} | Elesium</title>", v_html)
        v_html = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', f'<meta name="description" content="{html.escape(v_desc)}" />', v_html)
        v_html = replace_canonical(v_html, v_canonical)
        v_html = re.sub(r'<meta property="og:title" content="[^"]*"\s*/?>', f'<meta property="og:title" content="{v_title} | Elesium" />', v_html)
        v_html = re.sub(r'<meta property="og:description" content="[^"]*"\s*/?>', f'<meta property="og:description" content="{html.escape(v_desc)}" />', v_html)
        v_html = re.sub(r'<meta property="og:url" content="[^"]*"\s*/?>', f'<meta property="og:url" content="{v_canonical}" />', v_html)
        v_html = re.sub(r'<meta name="twitter:title" content="[^"]*"\s*/?>', f'<meta name="twitter:title" content="{v_title} | Elesium" />', v_html)
        v_html = re.sub(r'<meta name="twitter:description" content="[^"]*"\s*/?>', f'<meta name="twitter:description" content="{html.escape(v_desc)}" />', v_html)

        # Pre-render semantic HTML DOM
        v_semantic = render_video_detail_semantic_html(video)
        root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
        if root_pattern.search(v_html):
            v_html = root_pattern.sub(lambda m: f'<div id="root">{v_semantic}</div>', v_html)
        else:
            v_html = v_html.replace('<div id="root"></div>', f'<div id="root">{v_semantic}</div>')

        # Rich VideoObject, TechArticle, and BreadcrumbList schemas
        video_schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "VideoObject",
                    "@id": f"{v_canonical}#video",
                    "name": v_title,
                    "description": v_desc,
                    "thumbnailUrl": [
                        "https://elesium.online/og-image.png",
                        f"https://img.youtube.com/vi/{v_youtube_id}/maxresdefault.jpg"
                    ],
                    "uploadDate": v_upload_date,
                    "duration": v_duration_iso,
                    "embedUrl": f"https://www.youtube-nocookie.com/embed/{v_youtube_id}",
                    "contentUrl": v_canonical,
                    "transcript": v_transcript,
                    "publisher": {
                        "@type": "Organization",
                        "name": "Elesium",
                        "url": "https://elesium.online",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://elesium.online/favicon.png"
                        }
                    },
                    "hasPart": [
                        {
                            "@type": "Clip",
                            "name": km.get("title", ""),
                            "startOffset": km.get("seconds", 0),
                            "url": f"{v_canonical}?t={km.get('seconds', 0)}"
                        }
                        for km in video.get("keyMoments", [])
                    ]
                },
                {
                    "@type": "TechArticle",
                    "headline": v_title,
                    "description": v_desc,
                    "author": {
                        "@type": "Organization",
                        "name": "Elesium AI Systems Architecture Team"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Elesium",
                        "url": "https://elesium.online"
                    },
                    "mainEntityOfPage": v_canonical,
                    "datePublished": v_upload_date
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://elesium.online/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Architecture Masterclasses",
                            "item": "https://elesium.online/videos"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": v_title,
                            "item": v_canonical
                        }
                    ]
                }
            ]
        }

        v_injections = [
            f'<script type="application/ld+json">{json.dumps(video_schema, ensure_ascii=False)}</script>'
        ]
        v_html = v_html.replace("</head>", "\n" + "\n".join(v_injections) + "\n</head>")

        v_out_file.write_text(v_html, encoding="utf-8")
        v_direct_file.write_text(v_html, encoding="utf-8")
        print(f"Generated SSG for: /videos/{v_slug}")

    # 2. Video Gallery Route (/videos)
    gallery_canonical = "https://elesium.online/videos"
    gallery_title = "Enterprise AI Architecture Masterclasses & Video Teardowns | Elesium"
    gallery_desc = "Watch technical engineering breakdowns on deterministic multi-agent systems, sovereign private VPC deployments, and production enterprise workflows by Elesium."

    gallery_out_dir = DIST_DIR / "videos"
    gallery_out_dir.mkdir(parents=True, exist_ok=True)
    gallery_out_file = gallery_out_dir / "index.html"
    gallery_direct_file = DIST_DIR / "videos.html"

    gallery_html = base_html
    gallery_html = re.sub(r"<title>.*?</title>", f"<title>{gallery_title}</title>", gallery_html)
    gallery_html = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', f'<meta name="description" content="{gallery_desc}" />', gallery_html)
    gallery_html = replace_canonical(gallery_html, gallery_canonical)
    gallery_html = re.sub(r'<meta property="og:title" content="[^"]*"\s*/?>', f'<meta property="og:title" content="{gallery_title}" />', gallery_html)
    gallery_html = re.sub(r'<meta property="og:description" content="[^"]*"\s*/?>', f'<meta property="og:description" content="{gallery_desc}" />', gallery_html)
    gallery_html = re.sub(r'<meta property="og:url" content="[^"]*"\s*/?>', f'<meta property="og:url" content="{gallery_canonical}" />', gallery_html)
    gallery_html = re.sub(r'<meta name="twitter:title" content="[^"]*"\s*/?>', f'<meta name="twitter:title" content="{gallery_title}" />', gallery_html)
    gallery_html = re.sub(r'<meta name="twitter:description" content="[^"]*"\s*/?>', f'<meta name="twitter:description" content="{gallery_desc}" />', gallery_html)

    gallery_semantic = render_video_gallery_semantic_html(videos)
    root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
    if root_pattern.search(gallery_html):
        gallery_html = root_pattern.sub(lambda m: f'<div id="root">{gallery_semantic}</div>', gallery_html)
    else:
        gallery_html = gallery_html.replace('<div id="root"></div>', f'<div id="root">{gallery_semantic}</div>')

    gallery_schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": f"{gallery_canonical}#collection",
                "name": "Enterprise AI Architecture Masterclasses & Video Teardowns",
                "description": gallery_desc,
                "url": gallery_canonical,
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium",
                    "url": "https://elesium.online"
                },
                "mainEntity": {
                    "@type": "ItemList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": i + 1,
                            "url": f"https://elesium.online/videos/{v['slug']}",
                            "name": v["title"]
                        }
                        for i, v in enumerate(videos)
                    ]
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Architecture Masterclasses",
                        "item": gallery_canonical
                    }
                ]
            }
        ]
    }

    gallery_injections = [
        f'<script type="application/ld+json">{json.dumps(gallery_schema, ensure_ascii=False)}</script>'
    ]
    gallery_html = gallery_html.replace("</head>", "\n" + "\n".join(gallery_injections) + "\n</head>")

    gallery_out_file.write_text(gallery_html, encoding="utf-8")
    gallery_direct_file.write_text(gallery_html, encoding="utf-8")
    print("Generated SSG for: /videos (Gallery)")
    print("✅ SSG complete for video routes.")

    print("Starting SSG Generation for static pages...")
    static_pages = {
        "ai-automation": {
            "title": "AI Automation Agency India",
            "desc": "Elesium builds custom AI automation workflows for Indian enterprises. From agentic AI to LLM integration — we automate what slows you down."
        },
        "how-we-work": {
            "title": "How Our AI Automation Works",
            "desc": "Elesium's proven 4-step AI implementation process delivers automation ROI in 90 days. See how India's top AI agency operates."
        },
        "markets": {
            "title": "AI Automation for Every Industry",
            "desc": "Elesium delivers AI automation across BFSI, Healthcare, SaaS, Manufacturing and more. India's trusted AI partner for enterprise automation."
        },
        "resources": {
            "title": "AI Automation Resources & Guides",
            "desc": "Free AI automation playbooks, case studies and implementation guides from Elesium — India's leading AI automation agency."
        },
        "ai-automation-agency-india": {
            "title": "AI Automation Agency India",
            "desc": "Elesium builds custom AI automation workflows for Indian enterprises. From agentic AI to LLM integration — we automate what slows you down."
        },
        "waitlist": {
            "title": "ele-in Early Access Waitlist | Autonomous AI LinkedIn Outreach",
            "desc": "Join the ele-in early access waitlist by Elesium. Autonomous AI agent taking over B2B LinkedIn outreach from lead generation to booked meetings."
        },
        "tools/enterprise-ai-roi-calculator": {
            "title": "Enterprise AI ROI Calculator: Model Labor Savings & Payback",
            "desc": "Calculate annual labor savings, payback breakeven period, and 3-year net ROI of deploying deterministic multi-agent AI systems in your enterprise. Based on audited production SLAs."
        },
        "embed/roi-calculator": {
            "title": "Enterprise AI ROI Calculator (Interactive Embed Widget)",
            "desc": "Embeddable interactive enterprise AI ROI and payback calculator. Compute labor savings, operational throughput, and capital payback periods."
        }
    }

    for route, meta in static_pages.items():
        title = meta["title"]
        desc = meta["desc"]
        canonical_url = f"https://elesium.online/{route}"

        out_dir = DIST_DIR / route
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "index.html"
        direct_file = DIST_DIR / f"{route}.html"

        html_out = base_html

        html_out = re.sub(r"<title>.*?</title>", f"<title>{title} | Elesium</title>", html_out)
        html_out = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', html_out)
        html_out = replace_canonical(html_out, canonical_url)
        html_out = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{title} | Elesium">', html_out)
        html_out = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{desc}">', html_out)
        html_out = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{canonical_url}">', html_out)
        html_out = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{title} | Elesium">', html_out)
        html_out = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{desc}">', html_out)

        if route == "ai-automation-agency-india":
            pricing_answer_capsule = (
                "The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic "
                "pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard "
                "90-day ROI mandate, private VPC zero-retention deployments, and sub-2s automated latency across SAP, "
                "Oracle, and legacy databases."
            )

            service_schema = {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Enterprise AI Automation Services",
                "serviceType": "AI Automation Agency",
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "Elesium - Enterprise AI Automation Agency India",
                    "url": "https://elesium.online",
                    "telephone": "+91-8317329312",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Koramangala 4th Block",
                        "addressLocality": "Bangalore",
                        "addressRegion": "Karnataka",
                        "postalCode": "560034",
                        "addressCountry": "IN"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 12.9352,
                        "longitude": 77.6245
                    },
                    "hasMap": "https://www.google.com/maps/place/Koramangala,+Bengaluru,+Karnataka",
                    "sameAs": [
                        "https://elesium.online",
                        "https://www.goodfirms.co/company/elesium-online",
                        "https://clutch.co",
                        "https://github.com/elesium-ai",
                        "https://www.linkedin.com/company/elesium",
                        "https://x.com/elesium_ai",
                        "https://ipfs.io/ipfs/Qma8a78232d60a0b7445f34cee63b4eb2bfe20d450346e",
                        "https://www.wikidata.org/wiki/Q11660"
                    ]
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "India"
                },
                "description": pricing_answer_capsule,
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Enterprise AI Automation Investment Tiers",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "name": "Pilot Architecture Sprint",
                            "description": "Single-Process Deterministic Agent, Private Cloud Staging Deployment, FastAPI + LangGraph Architecture, 14-Day Delivery Guarantee.",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "minPrice": "150000",
                                "maxPrice": "350000",
                                "priceCurrency": "INR"
                            }
                        },
                        {
                            "@type": "Offer",
                            "name": "Enterprise Multi-Agent Suite",
                            "description": "Multi-Agent Collaborative Triad (LangGraph), Private VPC / Zero-Data-Retention Deployment, Deep Legacy ERP/SAP & SQL Integration, 99.9% Production SLA & 90-Day ROI Guarantee.",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "minPrice": "600000",
                                "maxPrice": "1500000",
                                "priceCurrency": "INR"
                            }
                        },
                        {
                            "@type": "Offer",
                            "name": "Autonomous Engineering Pod",
                            "description": "3 Dedicated AI Systems Engineers + Architect, Continuous Fine-Tuning & Vector Optimization, Omnichannel Voice + WhatsApp Systems, 1-Hour Critical Incident Response SLA.",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "price": "450000",
                                "priceCurrency": "INR",
                                "unitText": "MONTH"
                            }
                        }
                    ]
                }
            }

            faq_schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is a leading AI automation agency in India?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "If you need basic Zapier workflows, hire a freelancer. If you require deterministic, autonomous multi-agent infrastructure that connects directly to SAP S/4HANA via SAP RFC connectors, reconciles 1,420+ ledger items in 1.9s, and complies with DPDP Act 2023 and ISO 27001, Elesium is India's leading AI automation agency. We engineer production Python LangGraph state machines delivering verified 3.5x ROI within 90 days."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How much does AI automation cost in India?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate, private VPC zero-retention deployments, and sub-2s automated latency across SAP, Oracle, and legacy databases. Ongoing engineering pods are retained at ₹4,50,000/month."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What AI automation services does Elesium offer?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Elesium deploys four production-grade AI services: Agentic AI Workflows via Python and LangGraph, air-gapped private VPC LLM deployments (Llama 3, DeepSeek) with zero data retention, automated ETL pipelines that cut document turnaround by 98%, and WhatsApp-first enterprise routing complying with RBI digital lending guidelines and DPDP Act 2023."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does AI automation implementation take?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Unlike legacy IT firms quoting 6 to 12 months, Elesium deploys production-ready pilot agents in 14 business days. Full multi-agent enterprise orchestration across SAP ERP, core banking, and CRM databases reaches complete production scale within 6 to 12 weeks, backed by 99.9% uptime SLAs and a strict 90-day cash-flow positive ROI guarantee."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Which industries benefit most from AI automation in India?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "High-compliance Indian sectors drowning in manual routing experience the highest ROI: BFSI (cutting credit underwriting latency from 14.5 hours to 1.9s under RBI guidelines), Manufacturing (averting ₹18.4L in stockout penalties via SAP RFC connectors), Healthcare (HIPAA/DPDP Act 2023 compliant medical extraction), and Enterprise SaaS (saving 10,000+ human operational hours)."
                        }
                    }
                ]
            }

            static_content = f"""
<div id="prerendered-service-content" style="max-width:900px;margin:0 auto;padding:2rem 1rem;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <header>
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em;margin-bottom:0.5rem;">Enterprise AI Engineering</div>
    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Automation Agency India</h1>
    <p style="font-size:1.25rem;line-height:1.6;color:#374151;margin-bottom:2rem;"><strong>{pricing_answer_capsule}</strong></p>
  </header>
  <main>
    <section style="margin:2rem 0;">
      <h2 style="font-size:1.75rem;font-weight:700;color:#111827;margin-bottom:1rem;">Production Investment Tiers & Deliverables</h2>
      <ul style="list-style-type:none;padding:0;">
        <li style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.5rem;margin-bottom:1rem;">
          <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-top:0;">Pilot Architecture Sprint — ₹1,50,000 to ₹3,50,000</h3>
          <p style="color:#4b5563;margin:0.5rem 0;">Single-Process Deterministic Agent, Private Cloud Staging Deployment, FastAPI + LangGraph Architecture, 14-Day Delivery Guarantee.</p>
        </li>
        <li style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.5rem;margin-bottom:1rem;">
          <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-top:0;">Enterprise Multi-Agent Suite — ₹6,00,000 to ₹15,00,000</h3>
          <p style="color:#4b5563;margin:0.5rem 0;">Multi-Agent Collaborative Triad (LangGraph), Private VPC / Zero-Data-Retention Deployment, Deep Legacy ERP/SAP & SQL Integration, 99.9% Production SLA & 90-Day ROI Guarantee.</p>
        </li>
        <li style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:0.5rem;padding:1.5rem;margin-bottom:1rem;">
          <h3 style="font-size:1.25rem;font-weight:700;color:#111827;margin-top:0;">Autonomous Engineering Pod — ₹4,50,000 / month</h3>
          <p style="color:#4b5563;margin:0.5rem 0;">3 Dedicated AI Systems Engineers + Architect, Continuous Fine-Tuning & Vector Optimization, Omnichannel Voice + WhatsApp Systems, 1-Hour Critical Incident Response SLA.</p>
        </li>
      </ul>
    </section>
  </main>
</div>
"""
            root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
            if root_pattern.search(html_out):
                html_out = root_pattern.sub(f'<div id="root">{static_content}</div>', html_out)
            else:
                html_out = html_out.replace('<div id="root"></div>', f'<div id="root">{static_content}</div>')

            service_schema_json = json.dumps(service_schema, ensure_ascii=False)
            faq_schema_json = json.dumps(faq_schema, ensure_ascii=False)
            html_out = html_out.replace("</head>", f'<script type="application/ld+json">{service_schema_json}</script>\n<script type="application/ld+json">{faq_schema_json}</script>\n</head>')

        elif route == "tools/enterprise-ai-roi-calculator":
            tool_content = render_roi_calculator_tool_semantic_html()
            root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
            if root_pattern.search(html_out):
                html_out = root_pattern.sub(lambda m: f'<div id="root">{tool_content}</div>', html_out)
            else:
                html_out = html_out.replace('<div id="root"></div>', f'<div id="root">{tool_content}</div>')

            tool_schema = {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Enterprise AI Automation ROI & Payback Calculator",
                "url": canonical_url,
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All modern browsers (HTML5/JavaScript)",
                "description": desc,
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "Elesium - Enterprise AI Automation Agency",
                    "url": "https://elesium.online"
                }
            }

            breadcrumb_schema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Tools",
                        "item": "https://elesium.online/tools/enterprise-ai-roi-calculator"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Enterprise AI ROI Calculator",
                        "item": canonical_url
                    }
                ]
            }

            faq_schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How does the Elesium Enterprise AI ROI model calculate net savings?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "The model calculates gross savings by multiplying team repetitive hours by the fully loaded hourly labor cost and target automation efficiency (typically 75%–92% in deterministic LangGraph state machines). It then subtracts a conservative 12% annual infrastructure and fine-tuning allocation from gross savings to arrive at true net cash-flow savings."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What infrastructure costs and operational overhead are included?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Unlike simplistic calculators, our model factors in initial architecture engineering (Python LangGraph orchestration, SAP/ERP connectors, private VPC containerization) and an ongoing 12% operational buffer covering dedicated cloud inferencing (AWS ap-south-1 / on-premise Ollama/vLLM) and telemetry audits."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How does private VPC deployment affect enterprise AI payback periods?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Private VPC and open-weights deployment (e.g. Llama 3 70B, DeepSeek) eliminates unpredictable commercial token fees ($0.03/1k tokens at scale). For teams processing 5,000+ monthly documents or 50,000+ database records, private VPC infrastructure lowers per-transaction inference costs by up to 88%, compressing payback periods to under 90 days."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can we embed this ROI calculator on our internal intranet or partner portal?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. You can embed the interactive widget directly using our verified embed snippet (<iframe src=\"https://elesium.online/embed/roi-calculator\" width=\"100%\" height=\"750\" frameborder=\"0\"></iframe>) without any licensing fees or external dependencies."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is Elesium's contractual 90-day ROI mandate?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Every enterprise engagement is engineered against predetermined throughput and error SLAs. If our deployed multi-agent state machines do not reach their contractual efficiency and cash-flow positive ROI threshold within 90 calendar days, we provide continuous engineering until verified SLAs are met."
                        }
                    }
                ]
            }

            injections = [
                f'<script type="application/ld+json">{json.dumps(tool_schema, ensure_ascii=False)}</script>',
                f'<script type="application/ld+json">{json.dumps(breadcrumb_schema, ensure_ascii=False)}</script>',
                f'<script type="application/ld+json">{json.dumps(faq_schema, ensure_ascii=False)}</script>'
            ]
            html_out = html_out.replace("</head>", "\n" + "\n".join(injections) + "\n</head>")

        elif route == "embed/roi-calculator":
            embed_content = render_roi_calculator_embed_semantic_html()
            root_pattern = re.compile(r'<div id="root">.*?</div>', re.DOTALL)
            if root_pattern.search(html_out):
                html_out = root_pattern.sub(lambda m: f'<div id="root">{embed_content}</div>', html_out)
            else:
                html_out = html_out.replace('<div id="root"></div>', f'<div id="root">{embed_content}</div>')

            embed_schema = {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "Enterprise AI ROI Calculator (Embed Widget)",
                "url": canonical_url,
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All modern browsers (HTML5/JavaScript)",
                "description": desc,
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "Elesium - Enterprise AI Automation Agency",
                    "url": "https://elesium.online"
                }
            }
            html_out = html_out.replace("</head>", f'\n<script type="application/ld+json">{json.dumps(embed_schema, ensure_ascii=False)}</script>\n</head>')

        direct_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(html_out, encoding="utf-8")
        direct_file.write_text(html_out, encoding="utf-8")
        print(f"Generated SSG for: /{route}")

    print("✅ SSG complete. All routes prerendered with semantic HTML and verified canonical tags.")

if __name__ == "__main__":
    generate_ssg()
