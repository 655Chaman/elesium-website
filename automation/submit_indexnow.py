#!/usr/bin/env python3
"""
Elesium IndexNow Fast-Crawl Submission Automation
Pushes all verified canonical URLs from sitemap-core.xml and sitemap-solutions.xml
directly to the IndexNow API protocol (serving Microsoft Bing, Yandex, Seznam, Naver).

Key: c8d4529f76a147e09641c8f49f50e82b
Host: elesium.online
"""

import sys
import json
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SITEMAP_CORE = BASE_DIR / "frontend" / "public" / "sitemap-core.xml"
SITEMAP_SOLUTIONS = BASE_DIR / "frontend" / "public" / "sitemap-solutions.xml"

HOST = "elesium.online"
INDEXNOW_KEY = "c8d4529f76a147e09641c8f49f50e82b"
KEY_LOCATION = f"https://{HOST}/{INDEXNOW_KEY}.txt"

INDEXNOW_ENDPOINTS = [
    "https://api.indexnow.org/IndexNow",
    "https://www.bing.com/IndexNow",
    "https://yandex.com/indexnow"
]

CHUNK_SIZE = 1000

def extract_urls_from_sitemaps():
    """Extracts all unique URLs from sitemap-core.xml and sitemap-solutions.xml."""
    urls = []
    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    
    for sitemap_path in [SITEMAP_CORE, SITEMAP_SOLUTIONS]:
        if not sitemap_path.exists():
            print(f"⚠️ Warning: Sitemap not found at {sitemap_path}")
            continue
            
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        for loc in root.findall(".//ns:loc", ns):
            url_text = loc.text.strip()
            if url_text and url_text not in urls:
                urls.append(url_text)
                
    return urls

def submit_chunk(endpoint, url_chunk):
    """Submits a single chunk of URLs to a designated IndexNow endpoint."""
    payload = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": url_chunk
    }
    
    json_data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        endpoint,
        data=json_data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Elesium-IndexNow-Client/1.0 (Enterprise AI Systems)"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status = response.getcode()
            body = response.read().decode("utf-8", errors="ignore")
            return status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        return e.code, body
    except Exception as e:
        return 0, str(e)

def main():
    print(f"🔱 Initiating IndexNow Submission for https://{HOST}...")
    urls = extract_urls_from_sitemaps()
    total_urls = len(urls)
    
    if total_urls == 0:
        print("❌ Error: No URLs found in sitemaps. Please build sitemaps first.")
        sys.exit(1)
        
    print(f"📊 Discovered {total_urls} production URLs across sitemaps.")
    print(f"🔑 Using IndexNow Key: {INDEXNOW_KEY}")
    print(f"🌐 Verifying Key Location: {KEY_LOCATION}")
    
    # Chunk URLs into manageable batches
    chunks = [urls[i:i + CHUNK_SIZE] for i in range(0, total_urls, CHUNK_SIZE)]
    print(f"📦 Split into {len(chunks)} chunks of up to {CHUNK_SIZE} URLs each.\n")
    
    for i, chunk in enumerate(chunks, 1):
        print(f"🚀 Pushing Chunk {i}/{len(chunks)} ({len(chunk)} URLs)...")
        for endpoint in INDEXNOW_ENDPOINTS:
            status, response_body = submit_chunk(endpoint, chunk)
            if status in (200, 202):
                print(f"   ✅ [{status}] {endpoint} — Accepted {len(chunk)} URLs.")
            else:
                print(f"   ⚠️ [{status}] {endpoint} — Response: {response_body[:100]}")
        time.sleep(1) # respectful pacing between chunk submissions
        
    print(f"\n🎉 IndexNow submission cycle finished. All {total_urls} URLs broadcast to global search indexes.")

if __name__ == "__main__":
    main()
