#!/usr/bin/env python3
"""
upgrade_ssg_fleet.py — Applies architectural scale upgrades to automation/generate_ssg.py
"""

import re
from pathlib import Path

SSG_PATH = Path("automation/generate_ssg.py")

def apply_upgrades():
    content = SSG_PATH.read_text(encoding="utf-8")
    original_len = len(content)

    # 1. Update render_solutions_hub_semantic_html header to include answer capsule and tools link
    old_hub_header = """  <header style="margin-bottom:3rem;text-align:center;">
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.875rem;letter-spacing:0.05em;margin-bottom:0.5rem;">Elesium Enterprise AI Solutions</div>
    <h1 style="font-size:2.75rem;font-weight:800;line-height:1.2;margin:0 0 1.25rem 0;color:#111827;">Enterprise AI Solutions &amp; Sovereign Automation Workflows</h1>
    <p style="font-size:1.25rem;line-height:1.6;color:#4b5563;max-width:750px;margin:0 auto;">Deterministic multi-agent systems and air-gapped VPC architectures engineered for enterprise decision-makers across logistics, BFSI, manufacturing, healthcare, and legacy ERP integration.</p>
  </header>"""

    new_hub_header = """  <header style="margin-bottom:3rem;text-align:center;">
    <div style="color:#2563eb;font-weight:600;text-transform:uppercase;font-size:0.875rem;letter-spacing:0.05em;margin-bottom:0.5rem;">Elesium Enterprise AI Solutions</div>
    <h1 style="font-size:2.75rem;font-weight:800;line-height:1.2;margin:0 0 1.25rem 0;color:#111827;">Enterprise AI Solutions &amp; Sovereign Automation Workflows</h1>
    <div class="answer-capsule" style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:0.5rem;padding:1.25rem 1.5rem;margin:1.5rem auto 2rem auto;max-width:850px;text-align:left;">
      <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#15803d;margin-bottom:0.35rem;">Enterprise Directory Executive Summary • Architectural Answer Capsule</div>
      <p style="font-size:1.1rem;line-height:1.6;color:#166534;margin:0;font-weight:600;">Elesium engineers production-grade deterministic multi-agent architectures, private sovereign cloud VPCs, and automated workflows across Logistics, BFSI, Healthcare, and Industrial Manufacturing with audited sub-200ms latency and hard 90-day ROI guarantees.</p>
    </div>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem;">
      <a href="/tools/enterprise-ai-roi-calculator" style="display:inline-block;background:#0284c7;color:#ffffff;padding:0.6rem 1.25rem;border-radius:0.375rem;text-decoration:none;font-weight:600;font-size:0.875rem;">Simulate AI Automation ROI &rarr;</a>
      <a href="/commercial-directory.html" style="display:inline-block;border:1px solid #d1d5db;background:#ffffff;color:#111827;padding:0.6rem 1.25rem;border-radius:0.375rem;text-decoration:none;font-weight:600;font-size:0.875rem;">Commercial Directory Index &rarr;</a>
    </div>
  </header>"""

    if old_hub_header in content:
        content = content.replace(old_hub_header, new_hub_header)
        print("✓ Upgraded render_solutions_hub_semantic_html header with Answer Capsule & Tools Link.")
    else:
        print("! Warning: old_hub_header not found in generate_ssg.py")

    # 2. Add speakable to hub_collection_schema
    old_hub_schema = """"hasPart": hub_has_part,
        "breadcrumb": {"""
    new_hub_schema = """"hasPart": hub_has_part,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".answer-capsule", "h1"]
        },
        "breadcrumb": {"""
    if old_hub_schema in content:
        content = content.replace(old_hub_schema, new_hub_schema)
        print("✓ Upgraded hub_collection_schema with SpeakableSpecification.")

    # 3. Upgrading Regional City Moats (render_regional_city_hub_semantic_html)
    old_city_capsule = """    <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:0.75rem;padding:1.5rem;margin-bottom:2rem;">
      <div style="font-size:0.75rem;font-family:monospace;text-transform:uppercase;color:#047857;font-weight:700;margin-bottom:0.5rem;">
        Regional Engineering Executive Summary
      </div>
      <p style="font-size:1.1rem;line-height:1.6;color:#065f46;margin:0;font-weight:500;"><strong>{answer_capsule}</strong></p>
    </div>"""

    new_city_capsule = """    <div class="answer-capsule" style="background:#ecfdf5;border:1px solid #a7f3d0;border-left:4px solid #059669;border-radius:0.75rem;padding:1.5rem;margin-bottom:2rem;">
      <div style="font-size:0.75rem;font-family:monospace;text-transform:uppercase;color:#047857;font-weight:700;margin-bottom:0.5rem;">
        Regional Engineering Executive Summary • AEO Answer Capsule
      </div>
      <p style="font-size:1.1rem;line-height:1.6;color:#065f46;margin:0;font-weight:600;">{answer_capsule}</p>
    </div>"""

    if old_city_capsule in content:
        content = content.replace(old_city_capsule, new_city_capsule)
        print("✓ Upgraded render_regional_city_hub_semantic_html with class='answer-capsule'.")
    else:
        print("! Warning: old_city_capsule not found in generate_ssg.py")

    # 4. Add speakable to get_regional_city_hub_schemas
    old_city_schema = """"description": city["answer_capsule"],
        "address": {"""
    new_city_schema = """"description": city["answer_capsule"],
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".answer-capsule", "h1"]
        },
        "address": {"""
    if old_city_schema in content:
        content = content.replace(old_city_schema, new_city_schema)
        print("✓ Upgraded get_regional_city_hub_schemas with SpeakableSpecification.")

    # 5. Upgrading Comparison Battlecards (render_compare_detail_semantic_html)
    old_cmp_verdict = """    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:1rem;padding:1.5rem;margin-bottom:2rem;">
      <h2 style="font-size:1.1rem;font-weight:700;color:#1e40af;margin:0 0 0.5rem 0;">Executive Engineering Verdict</h2>
      <p style="color:#1e3a8a;font-size:1rem;line-height:1.6;margin:0;">{html.escape(item.get("verdictSummary", ""))}</p>
    </div>"""

    new_cmp_verdict = """    <div class="answer-capsule" style="background:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #2563eb;border-radius:1rem;padding:1.5rem;margin-bottom:2rem;">
      <div style="font-size:0.75rem;font-family:monospace;text-transform:uppercase;color:#2563eb;font-weight:700;margin-bottom:0.5rem;">
        Executive Engineering Verdict • Architectural Answer Capsule
      </div>
      <p style="color:#1e3a8a;font-size:1.05rem;line-height:1.6;margin:0;font-weight:600;">{html.escape(item.get("verdictSummary", ""))}</p>
    </div>"""

    if old_cmp_verdict in content:
        content = content.replace(old_cmp_verdict, new_cmp_verdict)
        print("✓ Upgraded render_compare_detail_semantic_html with class='answer-capsule'.")
    else:
        print("! Warning: old_cmp_verdict not found in generate_ssg.py")

    # Add connected tools mesh in render_compare_detail_semantic_html
    old_cmp_footer = """  <footer style="background:#111827;color:#ffffff;border-radius:1rem;padding:2rem;text-align:center;">
    <h3 style="font-size:1.5rem;font-weight:700;margin:0 0 0.5rem 0;">Need an Architecture Audit for Your Enterprise Stack?</h3>"""

    new_cmp_footer = """  <section style="margin:2.5rem 0;padding:1.5rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.75rem;">
    <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin:0 0 0.5rem 0;">Connected Architecture Simulators &amp; Solutions</h3>
    <p style="font-size:0.9rem;color:#475569;margin:0 0 1rem 0;">Model your multi-agent architecture unit economics, latency boundaries, and DPDP Act compliance before implementation:</p>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;font-size:0.875rem;">
      <a href="/tools/agentic-architecture-grader" style="color:#2563eb;text-decoration:none;font-weight:600;">Architecture Readiness Grader &rarr;</a>
      <a href="/tools/enterprise-ai-roi-calculator" style="color:#2563eb;text-decoration:none;font-weight:600;">AI ROI &amp; Payback Calculator &rarr;</a>
      <a href="/solutions" style="color:#059669;text-decoration:none;font-weight:600;">Browse All Enterprise Solutions &rarr;</a>
      <a href="/commercial-directory.html" style="color:#0284c7;text-decoration:none;font-weight:600;">Commercial Directory &rarr;</a>
    </div>
  </section>
  <footer style="background:#111827;color:#ffffff;border-radius:1rem;padding:2rem;text-align:center;">
    <h3 style="font-size:1.5rem;font-weight:700;margin:0 0 0.5rem 0;">Need an Architecture Audit for Your Enterprise Stack?</h3>"""

    if old_cmp_footer in content:
        content = content.replace(old_cmp_footer, new_cmp_footer)
        print("✓ Added Connected Architecture Tools Link Mesh to compare detail.")

    # Update compare speakable schema
    old_cmp_speakable = """"speakable": {
                        "@type": "SpeakableSpecification",
                        "cssSelector": ["h1", "p"]
                    }"""
    new_cmp_speakable = """"speakable": {
                        "@type": "SpeakableSpecification",
                        "cssSelector": [".answer-capsule", "h1"]
                    }"""
    if old_cmp_speakable in content:
        content = content.replace(old_cmp_speakable, new_cmp_speakable)
        print("✓ Upgraded battlecard speakable schema to target .answer-capsule.")

    # 6. Compare hub answer capsule
    old_cmp_hub_header = """    <h1 style="font-size:2.75rem;font-weight:800;line-height:1.2;margin:0 0 1.25rem 0;color:#111827;">Enterprise AI Framework &amp; Architecture Comparisons</h1>
    <p style="font-size:1.2rem;line-height:1.6;color:#4b5563;max-width:800px;margin:0 auto;">Objective, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models. No vendor hype—only audited production latency benchmarks, token economics, and failure recovery protocols.</p>
  </header>"""

    new_cmp_hub_header = """    <h1 style="font-size:2.75rem;font-weight:800;line-height:1.2;margin:0 0 1.25rem 0;color:#111827;">Enterprise AI Framework &amp; Architecture Comparisons</h1>
    <div class="answer-capsule" style="background:#eff6ff;border:1px solid #bfdbfe;border-left:4px solid #2563eb;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:1.5rem auto 2rem auto;max-width:850px;text-align:left;">
      <div style="font-size:0.75rem;font-family:monospace;text-transform:uppercase;color:#2563eb;font-weight:700;margin-bottom:0.35rem;">
        Architecture Comparisons Executive Summary • AEO Answer Capsule
      </div>
      <p style="font-size:1.1rem;line-height:1.6;color:#1e3a8a;margin:0;font-weight:600;">Objective, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models. No vendor hype—only audited production latency benchmarks, token economics, and failure recovery protocols.</p>
    </div>
  </header>"""

    if old_cmp_hub_header in content:
        content = content.replace(old_cmp_hub_header, new_cmp_hub_header)
        print("✓ Upgraded render_compare_hub_semantic_html with class='answer-capsule'.")

    # 7. Video Detail answer capsule
    old_vid_summary = """    <h1 style="font-size:2.25rem;font-weight:800;line-height:1.25;margin:0 0 1rem 0;color:#111827;">{title}</h1>
    <p style="font-size:1.125rem;line-height:1.6;color:#374151;margin-bottom:1.5rem;">{summary}</p>"""

    new_vid_summary = """    <h1 style="font-size:2.25rem;font-weight:800;line-height:1.25;margin:0 0 1rem 0;color:#111827;">{title}</h1>
    <div class="answer-capsule" style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:0.5rem;padding:1.25rem 1.5rem;margin:1.5rem 0 2rem 0;">
      <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#15803d;margin-bottom:0.35rem;">Architectural Masterclass Answer Capsule • Technical Summary</div>
      <p style="font-size:1.1rem;line-height:1.6;color:#166534;margin:0;font-weight:600;">{summary}</p>
    </div>"""

    if old_vid_summary in content:
        content = content.replace(old_vid_summary, new_vid_summary)
        print("✓ Upgraded render_video_detail_semantic_html with class='answer-capsule'.")

    # Video detail speakable schema
    old_vid_speakable = """"mainEntityOfPage": v_canonical,
                    "datePublished": v_upload_date,
                    "speakable": {
                        "@type": "SpeakableSpecification",
                        "cssSelector": ["h1", "p"]
                    }"""
    new_vid_speakable = """"mainEntityOfPage": v_canonical,
                    "datePublished": v_upload_date,
                    "speakable": {
                        "@type": "SpeakableSpecification",
                        "cssSelector": [".answer-capsule", "h1"]
                    }"""
    if old_vid_speakable in content:
        content = content.replace(old_vid_speakable, new_vid_speakable)
        print("✓ Upgraded video_schema speakable to target .answer-capsule.")

    # Video gallery hub answer capsule
    old_vid_gallery = """    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Architecture Masterclasses &amp; Video Teardowns</h1>
    <p style="font-size:1.125rem;line-height:1.6;color:#374151;max-width:800px;">
      Explore technical engineering breakdowns, sovereign private VPC blueprints, deterministic multi-agent state machines (LangGraph), and audited 90-day ROI case studies across Indian enterprise sectors.
    </p>"""

    new_vid_gallery = """    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Architecture Masterclasses &amp; Video Teardowns</h1>
    <div class="answer-capsule" style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:0.5rem;padding:1.25rem 1.5rem;margin:1.5rem 0 2rem 0;">
      <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#15803d;margin-bottom:0.35rem;">Architectural Masterclass Gallery Summary • AEO Answer Capsule</div>
      <p style="font-size:1.1rem;line-height:1.6;color:#166534;margin:0;font-weight:600;">
        Explore technical engineering breakdowns, sovereign private VPC blueprints, deterministic multi-agent state machines (LangGraph), and audited 90-day ROI case studies across Indian enterprise sectors.
      </p>
    </div>"""

    if old_vid_gallery in content:
        content = content.replace(old_vid_gallery, new_vid_gallery)
        print("✓ Upgraded render_video_gallery_semantic_html with class='answer-capsule'.")

    # 8. Upgrading ROI Calculator Tool
    old_roi_capsule = """    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Automation ROI &amp; Payback Calculator</h1>
    <p style="font-size:1.25rem;line-height:1.6;color:#374151;margin-bottom:1.5rem;">
      <strong>The Elesium Enterprise AI ROI model calculates financial labor savings, operational capacity gains, and capital payback periods when replacing manual repetitive workflows with deterministic multi-agent state machines deployed in sovereign private VPCs. Indian and global enterprises achieve full capital payback in 0.8 to 1.4 months with 290% to 480% 3-year net cash-flow returns under verified 90-day production SLAs.</strong>
    </p>"""

    new_roi_capsule = """    <h1 style="font-size:2.5rem;font-weight:800;line-height:1.2;margin:0 0 1rem 0;color:#111827;">Enterprise AI Automation ROI &amp; Payback Calculator</h1>
    <div class="answer-capsule" style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:0.5rem;padding:1.25rem 1.5rem;margin:1.5rem 0 2rem 0;">
      <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#15803d;margin-bottom:0.35rem;">Architectural Answer Capsule • Financial &amp; Operational Modeling</div>
      <p style="font-size:1.15rem;line-height:1.6;color:#166534;margin:0;font-weight:600;">The Elesium Enterprise AI ROI model calculates financial labor savings, operational capacity gains, and capital payback periods when replacing manual repetitive workflows with deterministic multi-agent state machines deployed in sovereign private VPCs. Indian and global enterprises achieve full capital payback in 0.8 to 1.4 months with 290% to 480% 3-year net cash-flow returns under verified 90-day production SLAs.</p>
    </div>"""

    if old_roi_capsule in content:
        content = content.replace(old_roi_capsule, new_roi_capsule)
        print("✓ Upgraded render_roi_calculator_tool_semantic_html with class='answer-capsule'.")

    # 9. Tools in static_pages loop: Transform intro paragraph into answer capsule + add SpeakableSpecification schema
    old_tools_loop_marker = """        direct_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(html_out, encoding="utf-8")
        direct_file.write_text(html_out, encoding="utf-8")"""

    new_tools_loop_marker = """        if route.startswith("tools/"):
            # Ensure answer-capsule is present in tool semantic HTML
            if "answer-capsule" not in html_out:
                p_match = re.search(r'(<header[^>]*>.*?<h1[^>]*>.*?</h1>\s*(?:<div[^>]*>.*?</div>\s*)?)<p[^>]*>(.*?)</p>', html_out, re.DOTALL | re.IGNORECASE)
                if p_match:
                    intro_text = p_match.group(2).strip()
                    capsule_html = (
                        f'{p_match.group(1)}'
                        f'<div class="answer-capsule" style="background:rgba(15,23,42,0.85);border:1px solid #1e3a8a;border-left:4px solid #38bdf8;border-radius:0.5rem;padding:1.25rem 1.5rem;margin:1.5rem auto 2rem auto;max-width:850px;text-align:left;">'
                        f'<div style="font-size:0.7rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#38bdf8;margin-bottom:0.35rem;">Interactive Simulator Technical Summary • Architectural Answer Capsule</div>'
                        f'<p style="font-size:1.1rem;line-height:1.6;color:#f1f5f9;margin:0;font-weight:500;">{intro_text}</p>'
                        f'</div>'
                    )
                    html_out = html_out[:p_match.start()] + capsule_html + html_out[p_match.end():]
            
            # Ensure speakable schema is present for every interactive tool
            if '"SpeakableSpecification"' not in html_out:
                tool_speakable = {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": title,
                    "url": canonical_url,
                    "speakable": {
                        "@type": "SpeakableSpecification",
                        "cssSelector": [".answer-capsule", "h1"]
                    }
                }
                html_out = html_out.replace("</head>", f'\\n<script type="application/ld+json">{json.dumps(tool_speakable, ensure_ascii=False)}</script>\\n</head>')

        direct_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(html_out, encoding="utf-8")
        direct_file.write_text(html_out, encoding="utf-8")"""

    if old_tools_loop_marker in content:
        content = content.replace(old_tools_loop_marker, new_tools_loop_marker)
        print("✓ Upgraded static_pages loop for all 75 tools with Answer Capsule and SpeakableSpecification.")

    # 10. Update Redirect Wrappers to include <meta name="robots" content="noindex, follow">
    old_redirect_html = """        redirect_html = f\"\"\"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url={target_url}">
  <link rel="canonical" href="{target_url}">
  <title>Redirecting to {target_url}...</title>
</head>
<body>
  <p>Redirecting to <a href="{target_url}">{target_url}</a>...</p>
</body>
</html>
\"\"\""""

    new_redirect_html = """        redirect_html = f\"\"\"<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, follow">
  <meta http-equiv="refresh" content="0; url={target_url}">
  <link rel="canonical" href="{target_url}">
  <title>Redirecting to {target_url}...</title>
</head>
<body>
  <p>Redirecting to <a href="{target_url}">{target_url}</a>...</p>
</body>
</html>
\"\"\""""

    if old_redirect_html in content:
        content = content.replace(old_redirect_html, new_redirect_html)
        print("✓ Upgraded redirect_html template with <meta name='robots' content='noindex, follow'>.")

    # 11. Sanitize Signal post descriptions
    old_signal_desc = """        desc = post.get("metaDescription", "")"""
    new_signal_desc = """        raw_desc = post.get("metaDescription", "").strip().strip('"').strip("'")
        desc = html.escape(raw_desc, quote=True)"""

    if old_signal_desc in content:
        content = content.replace(old_signal_desc, new_signal_desc)
        print("✓ Upgraded Signal post meta description sanitization.")

    SSG_PATH.write_text(content, encoding="utf-8")
    print(f"Successfully updated {SSG_PATH} (delta: {len(content) - original_len:+} bytes).")

if __name__ == "__main__":
    apply_upgrades()
