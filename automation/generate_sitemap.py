#!/usr/bin/env python3
"""
generate_sitemap.py

Reads all blog slugs from src/data/blogPosts.ts and generates a comprehensive
public/sitemap.xml for Elesium, optimizing SEO and indexing for AI search engines.
"""

import json
import re
import datetime
from pathlib import Path

# Paths relative to this script
BASE_DIR = Path(__file__).parent
WEBSITE_ROOT = BASE_DIR.parent
TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "blogPosts.ts"
SOLUTIONS_TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "solutionsData.ts"
COMPACT_QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"
VIDEOS_TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "videoMasterclasses.ts"
VIDEO_SCRIPTS_DIR = BASE_DIR / "video_scripts"
COMPARE_TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "compareData.ts"
SITEMAP_PATH = WEBSITE_ROOT / "frontend" / "public" / "sitemap.xml"

# Website URL
BASE_URL = "https://elesium.online"

def generate_sitemap():
    print(f"Generating sitemap.xml at {SITEMAP_PATH}...")
    
    # Base URLs that are static
    urls = [
        {"loc": f"{BASE_URL}/", "priority": "1.0", "changefreq": "daily"},
        {"loc": f"{BASE_URL}/markets", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/how-we-work", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/ai-automation", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/resources", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/ai-automation-agency-india", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/waitlist", "priority": "0.8", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/audit", "priority": "0.8", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/signals", "priority": "0.9", "changefreq": "daily"},
        {"loc": f"{BASE_URL}/solutions", "priority": "0.9", "changefreq": "daily"},
        {"loc": f"{BASE_URL}/compare", "priority": "0.9", "changefreq": "daily"},
        {"loc": f"{BASE_URL}/tools/enterprise-ai-roi-calculator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/multi-agent-latency-token-cost-estimator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/agentic-architecture-grader", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/multi-agent-token-leakage-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/dpdp-act-2023-audit-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-gpu-finops-cost-calculator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-vector-db-latency-benchmark", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-llm-context-kv-cache-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-voice-agent-latency-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-graphrag-memory-benchmark", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-event-sourcing-audit-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-prompt-injection-firewall-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-semantic-cache-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-model-routing-cost-arbitrage-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-structured-output-latency-simulator", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/tools/enterprise-agent-tracing-opentelemetry-simulator", "priority": "0.9", "changefreq": "weekly"},
    ]
    
    # Read dynamic blog slugs
    if TS_PATH.exists():
        content = TS_PATH.read_text(encoding="utf-8")
        # Robust regex matching both single/double quotes and keys with or without quotes
        blocks = re.findall(r'["\']?slug["\']?\s*:\s*["\']([^"\']+)["\'].*?["\']?date["\']?\s*:\s*["\']([^"\']+)["\']', content, re.DOTALL)
        
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        
        for slug, date_str in blocks:
            try:
                # Convert 'July 05, 2026' to '2026-07-05'
                d = datetime.datetime.strptime(date_str, "%B %d, %Y")
                iso_date = d.strftime("%Y-%m-%d")
            except ValueError:
                iso_date = today
                
            urls.append({
                "loc": f"{BASE_URL}/signals/{slug}",
                "priority": "0.8",
                "changefreq": "weekly",
                "lastmod": iso_date
            })
            
        print(f"Found {len(blocks)} blog posts.")
    else:
        print(f"Warning: {TS_PATH} not found.")

    # Read dynamic solution slugs (System 2 Compact Keywords)
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    solution_slugs = set()

    if COMPACT_QUEUE_PATH.exists():
        try:
            queue_items = json.loads(COMPACT_QUEUE_PATH.read_text(encoding="utf-8"))
            for item in queue_items:
                slug = item.get("slug")
                if slug:
                    solution_slugs.add(slug)
        except Exception as e:
            print(f"Notice reading {COMPACT_QUEUE_PATH}: {e}")

    if SOLUTIONS_TS_PATH.exists():
        sol_content = SOLUTIONS_TS_PATH.read_text(encoding="utf-8")
        m = re.search(r'export const solutionsData:\s*(?:SolutionRecord|SolutionItem)\[\]\s*=\s*(\[[\s\S]*?\]);', sol_content)
        if m:
            try:
                data = json.loads(m.group(1))
                for item in data:
                    s = item.get("slug")
                    if s:
                        solution_slugs.add(s)
            except Exception as e:
                print(f"Notice reading solutionsData JSON: {e}")

    for slug in sorted(solution_slugs):
        urls.append({
            "loc": f"{BASE_URL}/solutions/{slug}",
            "priority": "0.9",
            "changefreq": "weekly",
            "lastmod": today
        })
    print(f"Found {len(solution_slugs)} solution pages for sitemap.")

    # Dynamic compare battlecards (Priority 0.9, Weekly changefreq)
    compare_slugs = set()
    if COMPARE_TS_PATH.exists():
        cmp_content = COMPARE_TS_PATH.read_text(encoding="utf-8")
        raw_cmp_slugs = re.findall(r'slug["\']?\s*:\s*["\']([^"\']+)["\']', cmp_content)
        for s in raw_cmp_slugs:
            if s and s != "string":  # exclude interface definition
                compare_slugs.add(s)

    for s in sorted(compare_slugs):
        urls.append({
            "loc": f"{BASE_URL}/compare/{s}",
            "priority": "0.9",
            "changefreq": "weekly",
            "lastmod": today
        })
    print(f"Found {len(compare_slugs)} architecture battlecards for sitemap.")

    # Dynamic video routes (Priority 0.8, Weekly changefreq)
    seen_video_slugs = set()
    video_entries = []

    if VIDEOS_TS_PATH.exists():
        v_content = VIDEOS_TS_PATH.read_text(encoding="utf-8")
        matches = re.findall(r'slug["\']?\s*:\s*["\']([^"\']+)["\'][\s\S]*?uploadDate["\']?\s*:\s*["\']([^"\']+)["\']', v_content)
        for s, udate in matches:
            if s not in seen_video_slugs:
                seen_video_slugs.add(s)
                dt = udate.split("T")[0] if "T" in udate else today
                video_entries.append((s, dt))

    manifest_path = VIDEO_SCRIPTS_DIR / "video_manifest.json"
    if manifest_path.exists():
        try:
            m_items = json.loads(manifest_path.read_text(encoding="utf-8"))
            for item in m_items:
                s = item.get("slug")
                if s and s not in seen_video_slugs:
                    seen_video_slugs.add(s)
                    udate = item.get("uploadDate", today)
                    dt = udate.split("T")[0] if "T" in udate else today
                    video_entries.append((s, dt))
        except Exception as e:
            print(f"Notice reading {manifest_path}: {e}")

    if VIDEO_SCRIPTS_DIR.exists():
        for md_path in sorted(VIDEO_SCRIPTS_DIR.glob("*.md")):
            s = md_path.stem
            if s not in seen_video_slugs:
                seen_video_slugs.add(s)
                md_text = md_path.read_text(encoding="utf-8")
                date_m = re.search(r'["\']uploadDate["\']\s*:\s*["\']([^"\']+)["\']', md_text)
                dt = date_m.group(1).split("T")[0] if date_m else today
                video_entries.append((s, dt))

    # Gallery page
    urls.append({
        "loc": f"{BASE_URL}/videos",
        "priority": "0.8",
        "changefreq": "weekly",
        "lastmod": today
    })

    # Video detail pages
    for s, dt in video_entries:
        urls.append({
            "loc": f"{BASE_URL}/videos/{s}",
            "priority": "0.8",
            "changefreq": "weekly",
            "lastmod": dt
        })
    print(f"Found {len(video_entries)} video masterclasses/scripts for sitemap (priority 0.8, weekly).")

    today_default = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Build XML
    xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]
    
    for u in urls:
        xml.append('  <url>')
        xml.append(f'    <loc>{u["loc"]}</loc>')
        if "lastmod" in u:
            xml.append(f'    <lastmod>{u["lastmod"]}</lastmod>')
        else:
            xml.append(f'    <lastmod>{today_default}</lastmod>')
        xml.append(f'    <changefreq>{u["changefreq"]}</changefreq>')
        xml.append(f'    <priority>{u["priority"]}</priority>')
        xml.append('  </url>')
        
    xml.append('</urlset>\n')
    
    SITEMAP_PATH.write_text("\n".join(xml), encoding="utf-8")
    print(f"✅ Sitemap successfully generated with {len(urls)} total URLs.")

if __name__ == "__main__":
    generate_sitemap()
