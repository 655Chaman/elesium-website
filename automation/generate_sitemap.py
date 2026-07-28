#!/usr/bin/env python3
"""
generate_sitemap.py

Reads all blog slugs from src/data/blogPosts.ts and generates a comprehensive
public/sitemap.xml for Elesium, optimizing SEO and indexing for AI search engines.
"""

import re
import datetime
from pathlib import Path

# Paths relative to this script
BASE_DIR = Path(__file__).parent
WEBSITE_ROOT = BASE_DIR.parent
TS_PATH = WEBSITE_ROOT / "src" / "data" / "blogPosts.ts"
SITEMAP_PATH = WEBSITE_ROOT / "public" / "sitemap.xml"

# Website URL
BASE_URL = "https://elesium.online"

def generate_sitemap():
    print(f"Generating sitemap.xml at {SITEMAP_PATH}...")
    
    # Base URLs that are static
    urls = [
        {"loc": f"{BASE_URL}/", "priority": "1.0", "changefreq": "daily"},
        {"loc": f"{BASE_URL}/solutions", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/industries", "priority": "0.9", "changefreq": "weekly"},
        {"loc": f"{BASE_URL}/signals", "priority": "0.9", "changefreq": "daily"},
    ]
    
    # Read dynamic blog slugs
    if TS_PATH.exists():
        content = TS_PATH.read_text(encoding="utf-8")
        slugs = re.findall(r"slug:\s*'([^']+)'", content)
        
        blocks = re.findall(r"slug:\s*'([^']+)'.*?date:\s*'([^']+)'", content, re.DOTALL)
        
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
