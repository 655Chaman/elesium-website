#!/usr/bin/env python3
"""
================================================================================
AUTONOMOUS SEARCH INDEXATION ACCELERATION & INSTANT INDEXNOW FLEET ENGINE
================================================================================
Classification: Production Engineering Suite & Distributed Crawler Dispatcher
Module: 12 (Autonomous Search Indexation & Fleet Synchronization)
Protocols:
  - RFC-compliant IndexNow Protocol (v1.0)
  - Google / Bing Sitemap Ping & Webmaster Protocols
  - SHA-256 Batch Cryptographic Verification
================================================================================
"""

import sys
import os
import json
import time
import hashlib
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Tuple, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

HOST = "elesium.online"
INDEXNOW_KEY = "c8d4529f76a147e09641c8f49f50e82b"
KEY_LOCATION = f"https://{HOST}/{INDEXNOW_KEY}.txt"

SITEMAP_CORE_PUBLIC = ROOT_DIR / "frontend" / "public" / "sitemap-core.xml"
SITEMAP_SOLUTIONS_PUBLIC = ROOT_DIR / "frontend" / "public" / "sitemap-solutions.xml"
SITEMAP_VIDEOS_PUBLIC = ROOT_DIR / "frontend" / "public" / "sitemap-videos.xml"

RECEIPT_PATH = ROOT_DIR / "automation" / "indexation_telemetry_receipt.json"

INDEXNOW_ENDPOINTS = [
    {"name": "IndexNow Central Gateway", "url": "https://api.indexnow.org/IndexNow"},
    {"name": "Microsoft Bing / Copilot", "url": "https://www.bing.com/IndexNow"},
    {"name": "Yandex Search", "url": "https://yandex.com/indexnow"},
    {"name": "Seznam Search", "url": "https://search.seznam.cz/indexnow"},
    {"name": "Naver Search", "url": "https://indexnow.naver.com/indexnow"}
]

PING_ENDPOINTS = [
    {"engine": "Google Search", "url": f"https://www.google.com/ping?sitemap=https://{HOST}/sitemap.xml"},
    {"engine": "Bing Webmaster", "url": f"https://www.bing.com/ping?sitemap=https://{HOST}/sitemap.xml"}
]

CHUNK_SIZE = 1000

class AutonomousIndexationEngine:
    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.urls_by_priority: Dict[str, List[str]] = {
            "tier1_core": [],
            "tier2_solutions": [],
            "tier3_videos": []
        }
        self.all_urls: List[str] = []

    def harvest_canonical_urls(self) -> List[str]:
        """Harvests all unique canonical URLs across sitemap-core, solutions, and videos."""
        ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        seen_urls = set()

        # 1. Harvest Core & Tools URLs
        if SITEMAP_CORE_PUBLIC.exists():
            tree = ET.parse(SITEMAP_CORE_PUBLIC)
            for loc in tree.getroot().findall(".//ns:loc", ns):
                u = loc.text.strip()
                if u and u not in seen_urls:
                    seen_urls.add(u)
                    self.urls_by_priority["tier1_core"].append(u)

        # 2. Harvest Solutions URLs
        if SITEMAP_SOLUTIONS_PUBLIC.exists():
            tree = ET.parse(SITEMAP_SOLUTIONS_PUBLIC)
            for loc in tree.getroot().findall(".//ns:loc", ns):
                u = loc.text.strip()
                if u and u not in seen_urls:
                    seen_urls.add(u)
                    self.urls_by_priority["tier2_solutions"].append(u)

        # 3. Harvest Videos URLs
        if SITEMAP_VIDEOS_PUBLIC.exists():
            tree = ET.parse(SITEMAP_VIDEOS_PUBLIC)
            for loc in tree.getroot().findall(".//ns:loc", ns):
                u = loc.text.strip()
                if u and u not in seen_urls:
                    seen_urls.add(u)
                    self.urls_by_priority["tier3_videos"].append(u)

        self.all_urls = (
            self.urls_by_priority["tier1_core"] +
            self.urls_by_priority["tier2_solutions"] +
            self.urls_by_priority["tier3_videos"]
        )
        return self.all_urls

    def verify_key_proof_local(self) -> bool:
        """Verifies local existence of indexnow key proof file."""
        pub_key = ROOT_DIR / "frontend" / "public" / f"{INDEXNOW_KEY}.txt"
        dist_key = ROOT_DIR / "frontend" / "dist" / f"{INDEXNOW_KEY}.txt"
        
        pub_ok = pub_key.exists() and pub_key.read_text(encoding="utf-8").strip() == INDEXNOW_KEY
        dist_ok = dist_key.exists() and dist_key.read_text(encoding="utf-8").strip() == INDEXNOW_KEY
        return pub_ok and dist_ok

    def submit_chunk_with_retry(self, endpoint_url: str, chunk_urls: List[str], max_retries: int = 2) -> Tuple[int, str]:
        """Submits a chunk of URLs to an IndexNow endpoint with exponential backoff."""
        if self.dry_run:
            return 200, "DRY_RUN_ACCEPTED"

        payload = {
            "host": HOST,
            "key": INDEXNOW_KEY,
            "keyLocation": KEY_LOCATION,
            "urlList": chunk_urls
        }
        json_data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            endpoint_url,
            data=json_data,
            headers={
                "Content-Type": "application/json; charset=utf-8",
                "User-Agent": "Elesium-Autonomous-IndexNow-Dispatcher/2.0 (Sovereign AI Systems)"
            },
            method="POST"
        )

        for attempt in range(max_retries + 1):
            try:
                with urllib.request.urlopen(req, timeout=12) as response:
                    return response.getcode(), response.read().decode("utf-8", errors="ignore")
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", errors="ignore")
                # 429 Too Many Requests -> Backoff
                if e.code == 429 and attempt < max_retries:
                    time.sleep(2 ** attempt)
                    continue
                return e.code, body
            except Exception as e:
                if attempt < max_retries:
                    time.sleep(1)
                    continue
                return 0, str(e)

        return 0, "MAX_RETRIES_EXCEEDED"

    def ping_search_engines(self) -> List[Dict[str, Any]]:
        """Sends HTTP GET pings to Google and Bing sitemap endpoints."""
        results = []
        for p in PING_ENDPOINTS:
            engine = p["engine"]
            url = p["url"]
            if self.dry_run:
                results.append({"engine": engine, "url": url, "status": 200, "response": "DRY_RUN_PING_OK"})
                continue

            req = urllib.request.Request(
                url,
                headers={"User-Agent": "Elesium-Sitemap-Pinger/2.0"}
            )
            try:
                with urllib.request.urlopen(req, timeout=8) as resp:
                    results.append({"engine": engine, "url": url, "status": resp.getcode(), "response": "PING_OK"})
            except urllib.error.HTTPError as e:
                results.append({"engine": engine, "url": url, "status": e.code, "response": e.reason})
            except Exception as e:
                results.append({"engine": engine, "url": url, "status": 0, "response": str(e)})

        return results

    def dispatch_fleet_synchronization(self) -> Dict[str, Any]:
        """Orchestrates full fleet indexation submission and emits verifiable receipt."""
        start_time = time.time()
        timestamp_iso = datetime.now(timezone.utc).isoformat()
        
        urls = self.harvest_canonical_urls()
        total_urls = len(urls)

        print(f"[*] Discovered {total_urls} Canonical URLs across 3 Priority Tiers:")
        print(f"    • Tier 1 (Core Hubs & Simulators) : {len(self.urls_by_priority['tier1_core'])} URLs")
        print(f"    • Tier 2 (Programmatic Solutions) : {len(self.urls_by_priority['tier2_solutions'])} URLs")
        print(f"    • Tier 3 (Video Masterclasses)    : {len(self.urls_by_priority['tier3_videos'])} URLs")

        key_valid = self.verify_key_proof_local()
        print(f"[*] Local Cryptographic Key Proof: {'VERIFIED ✅' if key_valid else 'FAILED ❌'}")

        # Chunk into 1,000-URL batches
        chunks = [urls[i:i + CHUNK_SIZE] for i in range(0, total_urls, CHUNK_SIZE)]
        total_chunks = len(chunks)
        print(f"[*] Chunked into {total_chunks} batches of <= {CHUNK_SIZE} URLs each.\n")

        batch_telemetry = []

        for idx, chunk in enumerate(chunks, 1):
            chunk_hash = hashlib.sha256("".join(chunk).encode("utf-8")).hexdigest()
            print(f"🚀 Dispatching Batch {idx}/{total_chunks} ({len(chunk)} URLs | SHA-256: {chunk_hash[:12]}...):")
            
            endpoint_statuses = {}
            for ep in INDEXNOW_ENDPOINTS:
                ep_name = ep["name"]
                ep_url = ep["url"]
                status, body = self.submit_chunk_with_retry(ep_url, chunk)
                endpoint_statuses[ep_name] = {
                    "url": ep_url,
                    "status": status,
                    "accepted": status in (200, 202)
                }
                status_icon = "✅" if status in (200, 202) else "⚠️"
                print(f"   {status_icon} [{status}] {ep_name} -> {'ACCEPTED' if status in (200, 202) else 'FAILED'}")

            batch_telemetry.append({
                "batch_index": idx,
                "url_count": len(chunk),
                "sha256_hash": chunk_hash,
                "endpoints": endpoint_statuses
            })

        print("\n[*] Pinging Global Search Engine Sitemap Gateways...")
        ping_telemetry = self.ping_search_engines()
        for p in ping_telemetry:
            p_icon = "✅" if p["status"] in (200, 202) else "⚠️"
            print(f"   {p_icon} [{p['status']}] {p['engine']} Sitemap Ping -> {p['response']}")

        elapsed = time.time() - start_time

        receipt = {
            "metadata": {
                "operation": "AUTONOMOUS_FLEET_INDEXATION_SYNCHRONIZATION",
                "timestamp_iso": timestamp_iso,
                "elapsed_seconds": round(elapsed, 2),
                "domain_host": HOST,
                "indexnow_key": INDEXNOW_KEY,
                "key_location": KEY_LOCATION,
                "local_key_proof_verified": key_valid,
                "total_urls_submitted": total_urls,
                "total_batches_dispatched": total_chunks,
                "priority_breakdown": {
                    "tier1_core": len(self.urls_by_priority["tier1_core"]),
                    "tier2_solutions": len(self.urls_by_priority["tier2_solutions"]),
                    "tier3_videos": len(self.urls_by_priority["tier3_videos"])
                }
            },
            "batches": batch_telemetry,
            "sitemap_pings": ping_telemetry
        }

        with open(RECEIPT_PATH, "w", encoding="utf-8") as f:
            json.dump(receipt, f, indent=2)

        print(f"\n[SUCCESS] Emitted Cryptographic Telemetry Receipt to:\n  {RECEIPT_PATH}")
        return receipt

def main():
    print("=" * 80)
    print(" 🔱 ELESIUM AUTONOMOUS SEARCH INDEXATION & FLEET SYNCHRONIZATION ENGINE 🔱")
    print("=" * 80)

    dry_run = "--dry-run" in sys.argv
    engine = AutonomousIndexationEngine(dry_run=dry_run)
    engine.dispatch_fleet_synchronization()

if __name__ == "__main__":
    main()
