#!/usr/bin/env python3
"""
portable_instant_indexer.py — Zero-Dependency IndexNow & Search Engine Pinger

Broadcasts newly created or updated URLs to the live IndexNow API network
(Bing, Yandex, Seznam, and participating AI search engines) for instant discovery.
"""

import json
import sys
import urllib.request
import urllib.error
from pathlib import Path

BASE_DIR = Path(__file__).parent
CONFIG_PATH = BASE_DIR / "project_config.json"

def main():
    print("=" * 70)
    print("   PORTABLE INSTANT INDEXNOW & SEARCH ENGINE PINGER")
    print("=" * 70)

    if not CONFIG_PATH.exists():
        print(f"Error: {CONFIG_PATH} not found. Run setup_wizard.py first.")
        sys.exit(1)

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)

    domain_url = config.get("domain_url", "https://example.com")
    host = domain_url.replace("https://", "").replace("http://", "").split("/")[0]
    key = config.get("indexnow_key", "c8d4529f76a147e09641c8f49f50e82b")

    queue_file = BASE_DIR / "keywords_queue.json"
    urls = [f"{domain_url}/", f"{domain_url}/solutions"]
    if queue_file.exists():
        with open(queue_file, "r", encoding="utf-8") as f:
            queue = json.load(f)
            for item in queue:
                urls.append(f"{domain_url}/solutions/{item['slug']}")

    print(f"Target Host: {host}")
    print(f"IndexNow Key: {key}")
    print(f"Total URLs to Broadcast: {len(urls)}")

    payload = {
        "host": host,
        "key": key,
        "keyLocation": f"{domain_url}/{key}.txt",
        "urlList": urls
    }

    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            status = resp.status
            print(f"✅ IndexNow API Response: HTTP {status} - OK (URLs submitted successfully!)")
    except urllib.error.HTTPError as e:
        print(f"IndexNow API Response: HTTP {e.code} - {e.reason}")
    except Exception as e:
        print(f"Network error during IndexNow broadcast: {e}")

if __name__ == "__main__":
    main()
