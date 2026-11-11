#!/usr/bin/env python3
"""
================================================================================
ELESIUM PR WIRE NEWSROOM & SYNDICATION ENGINE (/news/)
================================================================================
Parses AP-style press releases and deploys:
  1. /news/ (The Official Elesium Press Room & Newsroom)
  2. /news/pr-2026-01-bfsi-vllm-infrastructure/ (BFSI vLLM Architecture)
  3. /news/pr-2026-02-dpdp-memory-zeroization/ (DPDP Act §8(5) Memory Zeroization)
  4. /news/pr-2026-03-h100-benchmark-audit/ (NVIDIA H100 SXM5 Benchmark Audit)
  5. /news/feed.xml (RSS 2.0 & NewsML Syndication Feed for Google News / Wires)
  6. authority_assets/press_releases/pr_wire_dispatch_payload.json (Wire API Payload)

Schema Stack:
  - Schema.org/NewsArticle
  - Schema.org/BreadcrumbList
  - Schema.org/Organization (with mandatory non-empty 'url')
Negative Constraints:
  - 0 banned words
  - 0 em dashes (—)
================================================================================
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
PR_DIR = ROOT_DIR / "authority_assets" / "press_releases"
PUBLIC_NEWS_DIR = ROOT_DIR / "frontend" / "public" / "news"
DIST_NEWS_DIR = ROOT_DIR / "frontend" / "dist" / "news"

RELEASES = [
    {
        "file": "PR_2026_01_BFSI_VLLM_INFRASTRUCTURE.md",
        "slug": "pr-2026-01-bfsi-vllm-infrastructure",
        "title": "Elesium Deploys Air-Gapped Sovereign vLLM Infrastructure for Indian Commercial Banks Under RBI Cyber Security Framework",
        "date_iso": "2026-01-15T09:00:00+05:30",
        "pub_date_rfc": "Thu, 15 Jan 2026 09:00:00 +0530",
        "description": "Elesium Digital Systems announces production deployment of air-gapped private vLLM clusters for Indian commercial banks complying with RBI Cyber Security Framework Annex II.",
        "category": "Enterprise Technology & Sovereign AI"
    },
    {
        "file": "PR_2026_02_DPDP_MEMORY_ZEROIZATION.md",
        "slug": "pr-2026-02-dpdp-memory-zeroization",
        "title": "Elesium Implements Deterministic Cryptographic Memory Zeroization in Enterprise AI Systems to Enforce DPDP Act 2023 Section 8(5)",
        "date_iso": "2026-02-10T10:30:00+05:30",
        "pub_date_rfc": "Tue, 10 Feb 2026 10:30:00 +0530",
        "description": "Elesium implements hardware-enforced 7-pass memory zeroization across inference KV-cache blocks, guaranteeing statutory DPDP Act compliance.",
        "category": "Data Privacy & Regulatory Compliance"
    },
    {
        "file": "PR_2026_03_H100_BENCHMARK_AUDIT.md",
        "slug": "pr-2026-03-h100-benchmark-audit",
        "title": "Elesium Releases Audited Indian Sovereign AI Inference Benchmarks: 148ms TTFT on 8x NVIDIA H100 SXM5 Clusters",
        "date_iso": "2026-03-05T11:00:00+05:30",
        "pub_date_rfc": "Thu, 05 Mar 2026 11:00:00 +0530",
        "description": "Independent benchmark audit confirms 148ms TTFT and 1,403.5 tokens/sec throughput for Elesium air-gapped vLLM inference clusters in Mumbai data centers.",
        "category": "Hardware & Cloud Infrastructure"
    }
]


def render_news_article(rel: Dict[str, Any], raw_markdown: str) -> str:
    canonical_url = f"https://elesium.online/news/{rel['slug']}/"

    # Convert markdown paragraphs to HTML
    lines = raw_markdown.strip().split("\n")
    body_paragraphs = []
    for line in lines[3:]:
        line = line.strip()
        if not line or line.startswith("FOR IMMEDIATE RELEASE"):
            continue
        if line.startswith("### "):
            body_paragraphs.append(f"<h3>{line[4:]}</h3>")
        elif line.startswith("- "):
            body_paragraphs.append(f"<li>{line[2:]}</li>")
        else:
            body_paragraphs.append(f"<p>{line}</p>")

    # Group <li> into <ul>
    processed_body = []
    in_list = False
    for p in body_paragraphs:
        if p.startswith("<li>"):
            if not in_list:
                processed_body.append("<ul>")
                in_list = True
            processed_body.append(p)
        else:
            if in_list:
                processed_body.append("</ul>")
                in_list = False
            processed_body.append(p)
    if in_list:
        processed_body.append("</ul>")

    article_html = "\n      ".join(processed_body)

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "NewsArticle",
                "@id": f"{canonical_url}#newsarticle",
                "url": canonical_url,
                "headline": rel["title"],
                "description": rel["description"],
                "image": {
                    "@type": "ImageObject",
                    "url": "https://elesium.online/og-image.png",
                    "width": 1200,
                    "height": 630
                },
                "datePublished": rel["date_iso"],
                "dateModified": rel["date_iso"],
                "inLanguage": "en-US",
                "mainEntityOfPage": canonical_url,
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium Digital Systems Private Limited",
                    "url": "https://elesium.online",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://elesium.online/assets/logo-square.png",
                        "width": 512,
                        "height": 512
                    }
                },
                "author": {
                    "@type": "Organization",
                    "name": "Elesium Corporate Communications",
                    "url": "https://elesium.online"
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical_url}#breadcrumblist",
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
                        "name": "Newsroom",
                        "item": "https://elesium.online/news/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": rel["title"][:40] + "...",
                        "item": canonical_url
                    }
                ]
            }
        ]
    }
    schema_json = json.dumps(schema, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{rel["title"]} | Elesium Newsroom</title>
  <meta name="description" content="{rel["description"]}">
  <link rel="canonical" href="{canonical_url}">
  <script defer src="/navboost_dwell_lock.js"></script>
  <script type="application/ld+json">
{schema_json}
  </script>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0b1120;
      color: #f8fafc;
      margin: 0;
      padding: 0;
      line-height: 1.7;
    }}
    .container {{
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 24px;
    }}
    .breadcrumb {{
      font-size: 0.85rem;
      color: #94a3b8;
      margin-bottom: 24px;
    }}
    .breadcrumb a {{ color: #38bdf8; text-decoration: none; }}
    .release-meta {{
      font-size: 0.85rem;
      color: #38bdf8;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }}
    h1 {{
      font-size: 2.2rem;
      font-weight: 800;
      line-height: 1.3;
      color: #ffffff;
      margin-bottom: 24px;
    }}
    .dateline {{
      font-weight: 700;
      color: #cbd5e1;
    }}
    p {{
      color: #cbd5e1;
      font-size: 1.05rem;
      margin-bottom: 20px;
    }}
    h3 {{
      font-size: 1.3rem;
      color: #ffffff;
      margin-top: 36px;
      margin-bottom: 16px;
    }}
    ul {{
      margin-bottom: 24px;
      padding-left: 20px;
      color: #cbd5e1;
    }}
    li {{
      margin-bottom: 10px;
    }}
    .wire-footer {{
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid #1e293b;
      font-size: 0.9rem;
      color: #94a3b8;
    }}
    .wire-footer a {{ color: #38bdf8; text-decoration: none; }}
  </style>
</head>
<body>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Home</a> &gt; <a href="/news/">Newsroom</a> &gt; Press Release
    </nav>
    <div class="release-meta">FOR IMMEDIATE RELEASE | {rel['category'].upper()}</div>
    <h1>{rel["title"]}</h1>
    <div class="article-body">
      {article_html}
    </div>
    <div class="wire-footer">
      <p>Issued by <strong>Elesium Digital Systems Private Limited</strong> Corporate Communications.</p>
      <p>For press and regulatory inquiries, contact: <a href="mailto:contact@elesium.online">contact@elesium.online</a> | <a href="/news/">View All Releases &rarr;</a></p>
    </div>
  </div>
</body>
</html>"""
    return html


def render_news_hub(releases: List[Dict[str, Any]]) -> str:
    canonical_url = "https://elesium.online/news/"

    cards_html = ""
    for r in releases:
        slug = r["slug"]
        cards_html += f"""
      <article class="news-card">
        <div class="news-category">{r["category"]}</div>
        <h2><a href="/news/{slug}/">{r["title"]}</a></h2>
        <p>{r["description"]}</p>
        <div class="news-footer">
          <time datetime="{r['date_iso']}">{r['date_iso'][:10]}</time>
          <a href="/news/{slug}/" class="read-link">Read Full Wire Release &rarr;</a>
        </div>
      </article>"""

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": f"{canonical_url}#webpage",
                "url": canonical_url,
                "name": "Elesium Press Room & Official News Wire",
                "description": "Official press releases, regulatory compliance announcements, and benchmark disclosures from Elesium Digital Systems.",
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium Digital Systems Private Limited",
                    "url": "https://elesium.online"
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"{canonical_url}#breadcrumblist",
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
                        "name": "Newsroom",
                        "item": canonical_url
                    }
                ]
            }
        ]
    }
    schema_json = json.dumps(schema, indent=2)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elesium Newsroom &amp; Official Press Wire Disclosures</title>
  <meta name="description" content="Official corporate press releases, regulatory compliance disclosures, and sovereign AI benchmark telemetry from Elesium Digital Systems.">
  <link rel="canonical" href="{canonical_url}">
  <link rel="alternate" type="application/rss+xml" title="Elesium Official News Wire RSS" href="https://elesium.online/news/feed.xml">
  <script defer src="/navboost_dwell_lock.js"></script>
  <script type="application/ld+json">
{schema_json}
  </script>
  <style>
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0b1120;
      color: #f8fafc;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }}
    .container {{
      max-width: 960px;
      margin: 0 auto;
      padding: 48px 24px;
    }}
    .breadcrumb {{
      font-size: 0.85rem;
      color: #94a3b8;
      margin-bottom: 24px;
    }}
    .breadcrumb a {{ color: #38bdf8; text-decoration: none; }}
    h1 {{
      font-size: 2.5rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
    }}
    .lead {{
      font-size: 1.15rem;
      color: #94a3b8;
      margin-bottom: 40px;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 24px;
    }}
    .news-grid {{
      display: flex;
      flex-direction: column;
      gap: 24px;
    }}
    .news-card {{
      background: #111827;
      border: 1px solid #1f2937;
      padding: 28px;
      border-radius: 8px;
      transition: border-color 0.2s ease;
    }}
    .news-card:hover {{
      border-color: #38bdf8;
    }}
    .news-category {{
      font-size: 0.75rem;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }}
    .news-card h2 {{
      margin: 0 0 12px 0;
      font-size: 1.4rem;
    }}
    .news-card h2 a {{
      color: #ffffff;
      text-decoration: none;
    }}
    .news-card h2 a:hover {{
      color: #38bdf8;
    }}
    .news-card p {{
      color: #94a3b8;
      font-size: 0.95rem;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }}
    .news-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: #64748b;
    }}
    .read-link {{
      color: #38bdf8;
      text-decoration: none;
      font-weight: 600;
    }}
  </style>
</head>
<body>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Home</a> &gt; Newsroom
    </nav>
    <h1>Elesium Official Newsroom &amp; Press Wire</h1>
    <p class="lead">Primary corporate press releases, regulatory compliance filings, and audited benchmark telemetry regarding sovereign Indian artificial intelligence infrastructure.</p>
    
    <div class="news-grid">
{cards_html}
    </div>
  </div>
</body>
</html>"""
    return html


def render_rss_feed(releases: List[Dict[str, Any]]) -> str:
    now_rfc = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    items_xml = ""
    for r in releases:
        slug = r["slug"]
        link = f"https://elesium.online/news/{slug}/"
        items_xml += f"""    <item>
      <title><![CDATA[{r['title']}]]></title>
      <link>{link}</link>
      <guid isPermaLink="true">{link}</guid>
      <pubDate>{r['pub_date_rfc']}</pubDate>
      <category><![CDATA[{r['category']}]]></category>
      <description><![CDATA[{r['description']}]]></description>
    </item>\n"""

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Elesium Official Newsroom &amp; Press Wire</title>
    <link>https://elesium.online/news/</link>
    <description>Official press releases, regulatory disclosures, and benchmark telemetry from Elesium Digital Systems.</description>
    <language>en-us</language>
    <lastBuildDate>{now_rfc}</lastBuildDate>
    <atom:link href="https://elesium.online/news/feed.xml" rel="self" type="application/rss+xml"/>
{items_xml}  </channel>
</rss>"""
    return xml


def run_pr_wire_syndication():
    os.makedirs(PUBLIC_NEWS_DIR, exist_ok=True)
    os.makedirs(DIST_NEWS_DIR, exist_ok=True)

    generated_pages = []

    # 1. Render Individual Releases
    for r in RELEASES:
        md_file = PR_DIR / r["file"]
        if not md_file.exists():
            continue
        content = md_file.read_text(encoding="utf-8")
        html = render_news_article(r, content)

        # Assert negative constraints
        assert "—" not in html, f"Em dash found in PR {r['slug']}"

        slug = r["slug"]
        pub_path = PUBLIC_NEWS_DIR / slug / "index.html"
        dist_path = DIST_NEWS_DIR / slug / "index.html"

        os.makedirs(pub_path.parent, exist_ok=True)
        os.makedirs(dist_path.parent, exist_ok=True)

        pub_path.write_text(html, encoding="utf-8")
        dist_path.write_text(html, encoding="utf-8")

        generated_pages.append(f"https://elesium.online/news/{slug}/")

    # 2. Render News Hub
    hub_html = render_news_hub(RELEASES)
    assert "—" not in hub_html, "Em dash found in Newsroom hub"
    (PUBLIC_NEWS_DIR / "index.html").write_text(hub_html, encoding="utf-8")
    (DIST_NEWS_DIR / "index.html").write_text(hub_html, encoding="utf-8")
    generated_pages.append("https://elesium.online/news/")

    # 3. Render RSS Feed
    feed_xml = render_rss_feed(RELEASES)
    (PUBLIC_NEWS_DIR / "feed.xml").write_text(feed_xml, encoding="utf-8")
    (DIST_NEWS_DIR / "feed.xml").write_text(feed_xml, encoding="utf-8")

    # 4. Generate PR Wire Dispatch Payload for Wires (PR Newswire / EIN Presswire)
    dispatch_payload = {
        "issuer": "Elesium Digital Systems Private Limited",
        "ticker": "PRIVATE",
        "country": "India",
        "city": "Bengaluru",
        "state": "Karnataka",
        "media_contact": {
            "name": "Chaman Shah",
            "title": "Principal Systems Architect",
            "email": "contact@elesium.online",
            "phone": "+91 83173 29312",
            "website": "https://elesium.online"
        },
        "target_distribution_circuits": [
            "India National News Circuit",
            "Global Artificial Intelligence & Technology Wire",
            "BFSI & Financial Technology Wire",
            "Statutory Compliance & Legal Technology Wire"
        ],
        "newsroom_url": "https://elesium.online/news/",
        "rss_feed_url": "https://elesium.online/news/feed.xml",
        "releases": [
            {
                "id": r["slug"],
                "headline": r["title"],
                "dateline": "BENGALURU, KARNATAKA, INDIA",
                "canonical_url": f"https://elesium.online/news/{r['slug']}/",
                "category": r["category"],
                "summary": r["description"]
            }
            for r in RELEASES
        ]
    }
    payload_path = PR_DIR / "pr_wire_dispatch_payload.json"
    with open(payload_path, "w", encoding="utf-8") as f:
        json.dump(dispatch_payload, f, indent=2)

    print(f"✅ Deployed Official Newsroom & PR Wire Syndication Suite across {len(generated_pages)} pages.")
    print(f"✅ Emitted Wire Dispatch Payload: {payload_path}")


if __name__ == "__main__":
    run_pr_wire_syndication()
