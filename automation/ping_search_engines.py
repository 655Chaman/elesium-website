#!/usr/bin/env python3
"""
Elesium Search Engine & IndexNow Ping Automation Suite
------------------------------------------------------
Automatically notifies search engines of sitemap updates and pushes high-priority
URLs to the IndexNow protocol (Microsoft Bing, Yandex, Seznam, Naver) for instant crawl.

Sitemaps Targeted:
  - https://elesium.online/sitemap.xml
  - https://elesium.online/sitemap-core.xml
  - https://elesium.online/sitemap-solutions.xml

IndexNow Protocol:
  - Endpoint: https://api.indexnow.org/IndexNow
  - Host: elesium.online
  - Key: c8d4529f76a147e09641c8f49f50e82b
  - KeyLocation: https://elesium.online/c8d4529f76a147e09641c8f49f50e82b.txt

CLI Options:
  --dry-run   Simulate all HTTP requests, validate payloads, and log planned actions.
  --execute   Transmit live ping requests to Google, Bing, and IndexNow API.
"""

import sys
import os
import json
import time
import logging
import argparse
import urllib.request
import urllib.parse
import urllib.error
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Dict, Tuple

# Base Paths & Constants
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_PUBLIC = BASE_DIR / "frontend" / "public"
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

HOST = "elesium.online"
INDEXNOW_KEY = "c8d4529f76a147e09641c8f49f50e82b"
KEY_LOCATION = f"https://{HOST}/{INDEXNOW_KEY}.txt"
INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow"

SITEMAPS = [
    f"https://{HOST}/sitemap.xml",
    f"https://{HOST}/sitemap-core.xml",
    f"https://{HOST}/sitemap-solutions.xml",
    f"https://{HOST}/sitemap-videos.xml"
]

SEARCH_ENGINE_PING_TEMPLATES = {
    "Google": "https://www.google.com/ping?sitemap={sitemap_url}",
    "Bing": "https://www.bing.com/ping?sitemap={sitemap_url}"
}

# Core priority URLs always included in IndexNow pushes
CORE_PRIORITY_URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/solutions/",
    f"https://{HOST}/signals/",
    f"https://{HOST}/how-we-work/",
    f"https://{HOST}/commercial-directory.html",
    f"https://{HOST}/tools/agentic-architecture-grader/",
    f"https://{HOST}/markets/"
]


def setup_logger(verbose: bool = False) -> logging.Logger:
    """Configures professional structured logging."""
    logger = logging.getLogger("SearchEnginePing")
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)
    
    # Avoid duplicate handlers if re-initialized
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.DEBUG if verbose else logging.INFO)
        formatter = logging.Formatter(
            fmt="%(asctime)s [%(levelname)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger


def find_sitemap_file(filename: str) -> Path:
    """Locates sitemap file across known project directories."""
    candidates = [
        FRONTEND_PUBLIC / filename,
        FRONTEND_DIST / filename,
        BASE_DIR / "authority_assets" / "indexation_acceleration" / filename,
        BASE_DIR / filename
    ]
    for p in candidates:
        if p.exists():
            return p
    return candidates[0]


def extract_top_priority_urls(limit: int = 100, logger: logging.Logger = None) -> List[str]:
    """
    Gathers top priority URLs:
    1. Core site entrypoints and simulators.
    2. Essential core URLs from sitemap-core.xml.
    3. High-intent solution URLs from sitemap-solutions.xml if below limit.
    """
    discovered: List[str] = list(CORE_PRIORITY_URLS)
    seen = set(discovered)
    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    
    # Ingest priority URLs from sitemap-core.xml
    core_sitemap = find_sitemap_file("sitemap-core.xml")
    if core_sitemap.exists():
        try:
            tree = ET.parse(core_sitemap)
            root = tree.getroot()
            for loc in root.findall(".//ns:loc", ns):
                url = loc.text.strip() if loc.text else ""
                if url and url not in seen:
                    discovered.append(url)
                    seen.add(url)
                    if len(discovered) >= limit:
                        break
        except Exception as e:
            if logger:
                logger.warning(f"Could not parse core sitemap ({core_sitemap}): {e}")

    # Fallback / fill to limit from sitemap-solutions.xml if below limit
    if len(discovered) < limit:
        solutions_sitemap = find_sitemap_file("sitemap-solutions.xml")
        if solutions_sitemap.exists():
            try:
                tree = ET.parse(solutions_sitemap)
                root = tree.getroot()
                for loc in root.findall(".//ns:loc", ns):
                    url = loc.text.strip() if loc.text else ""
                    if url and url not in seen:
                        discovered.append(url)
                        seen.add(url)
                        if len(discovered) >= limit:
                            break
            except Exception as e:
                if logger:
                    logger.warning(f"Could not parse solutions sitemap ({solutions_sitemap}): {e}")

    return discovered[:limit]


def ping_sitemap_endpoint(
    engine: str,
    sitemap_url: str,
    dry_run: bool,
    logger: logging.Logger
) -> Tuple[bool, int, str, float]:
    """
    Submits a GET ping request for a single sitemap to a search engine.
    Returns (success, status_code, message, elapsed_ms).
    """
    template = SEARCH_ENGINE_PING_TEMPLATES[engine]
    encoded_sitemap = urllib.parse.quote(sitemap_url, safe="")
    target_url = template.format(sitemap_url=encoded_sitemap)

    logger.info(f"[{engine}] Queuing sitemap ping: {sitemap_url}")
    logger.debug(f"[{engine}] Full Target URL: {target_url}")

    if dry_run:
        logger.info(f"[{engine}] [DRY-RUN] Simulated GET -> {target_url} (HTTP 200 Mocked)")
        return True, 200, "Simulated successful ping (dry-run)", 0.0

    start_time = time.time()
    req = urllib.request.Request(
        target_url,
        headers={
            "User-Agent": "Elesium-Sitemap-Ping-Bot/2.0 (+https://elesium.online)",
            "Accept": "*/*"
        },
        method="GET"
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            elapsed = (time.time() - start_time) * 1000
            status = resp.getcode()
            body_preview = resp.read(256).decode("utf-8", errors="ignore").strip()
            logger.info(f"[{engine}] HTTP {status} in {elapsed:.1f}ms - Ping registered successfully.")
            return True, status, body_preview, elapsed
    except urllib.error.HTTPError as e:
        elapsed = (time.time() - start_time) * 1000
        body_preview = e.read(256).decode("utf-8", errors="ignore").strip()
        logger.warning(f"[{engine}] HTTP {e.code} in {elapsed:.1f}ms - Response: {body_preview}")
        return False, e.code, f"HTTP Error {e.code}: {body_preview}", elapsed
    except Exception as e:
        elapsed = (time.time() - start_time) * 1000
        logger.error(f"[{engine}] Connection Failure: {e}")
        return False, 0, str(e), elapsed


def submit_indexnow(
    urls: List[str],
    dry_run: bool,
    logger: logging.Logger
) -> Tuple[bool, int, str, float]:
    """
    Submits a batch of high-priority URLs to the IndexNow API protocol.
    Returns (success, status_code, message, elapsed_ms).
    """
    payload = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls
    }

    payload_json = json.dumps(payload, indent=2)
    logger.info(f"[IndexNow] Preparing IndexNow payload for {len(urls)} top-priority URLs.")
    logger.info(f"[IndexNow] API Endpoint: {INDEXNOW_API_ENDPOINT}")
    logger.info(f"[IndexNow] Host: {HOST} | Key: {INDEXNOW_KEY[:8]}...{INDEXNOW_KEY[-4:]}")
    logger.info(f"[IndexNow] Key Location: {KEY_LOCATION}")

    if dry_run:
        logger.info("[IndexNow] [DRY-RUN] Sample URLs in payload:")
        for u in urls[:5]:
            logger.info(f"    - {u}")
        if len(urls) > 5:
            logger.info(f"    ... and {len(urls) - 5} more URLs.")
        logger.info(f"[IndexNow] [DRY-RUN] Payload size: {len(payload_json.encode('utf-8'))} bytes.")
        logger.info("[IndexNow] [DRY-RUN] Simulated POST -> api.indexnow.org (HTTP 200/202 Mocked).")
        return True, 202, "Simulated successful IndexNow submission (dry-run)", 0.0

    start_time = time.time()
    req_data = payload_json.encode("utf-8")
    req = urllib.request.Request(
        INDEXNOW_API_ENDPOINT,
        data=req_data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Elesium-IndexNow-Client/2.0 (+https://elesium.online)"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            elapsed = (time.time() - start_time) * 1000
            status = resp.getcode()
            body = resp.read().decode("utf-8", errors="ignore").strip()
            if status in (200, 202):
                logger.info(f"[IndexNow] HTTP {status} in {elapsed:.1f}ms - Submission Accepted by IndexNow.")
                return True, status, body or "Accepted", elapsed
            else:
                logger.warning(f"[IndexNow] HTTP {status} in {elapsed:.1f}ms - Response: {body}")
                return False, status, body, elapsed
    except urllib.error.HTTPError as e:
        elapsed = (time.time() - start_time) * 1000
        body = e.read().decode("utf-8", errors="ignore").strip()
        logger.error(f"[IndexNow] HTTP {e.code} in {elapsed:.1f}ms - Error: {body}")
        return False, e.code, body, elapsed
    except Exception as e:
        elapsed = (time.time() - start_time) * 1000
        logger.error(f"[IndexNow] Network Exception: {e}")
        return False, 0, str(e), elapsed


def main():
    parser = argparse.ArgumentParser(
        description="Elesium Search Engine & IndexNow Sitemap Ping Automation"
    )
    group = parser.add_mutually_exclusive_group(required=False)
    group.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate all pings and IndexNow submissions without live network requests (Default)."
    )
    group.add_argument(
        "--execute",
        action="store_true",
        help="Transmit real network requests to Google, Bing, and IndexNow."
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=100,
        help="Maximum top-priority URLs to include in IndexNow batch (default: 100)."
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable detailed debugging logs."
    )

    args = parser.parse_args()

    # Default to dry-run if neither flag is explicitly set
    dry_run = not args.execute
    logger = setup_logger(args.verbose)

    mode_label = "DRY-RUN SIMULATION (No Network Calls)" if dry_run else "LIVE PRODUCTION EXECUTION"
    logger.info("=" * 72)
    logger.info(f"🚀 ELESIUM SEARCH ENGINE PING AUTOMATION - {mode_label}")
    logger.info("=" * 72)

    # 1. Ping Search Engines with Sitemaps
    logger.info("\n--- PHASE 1: SITEMAP PINGS (Google & Bing) ---")
    ping_results = []
    for sitemap_url in SITEMAPS:
        for engine in SEARCH_ENGINE_PING_TEMPLATES.keys():
            success, code, msg, elapsed = ping_sitemap_endpoint(
                engine, sitemap_url, dry_run, logger
            )
            ping_results.append({
                "engine": engine,
                "sitemap": sitemap_url,
                "success": success,
                "code": code,
                "elapsed_ms": elapsed
            })

    # 2. Gather Top Priority URLs for IndexNow
    logger.info("\n--- PHASE 2: INDEXNOW FAST-CRAWL DISPATCH ---")
    priority_urls = extract_top_priority_urls(limit=args.limit, logger=logger)
    logger.info(f"[IndexNow] Selected {len(priority_urls)} high-authority URLs for submission.")

    # 3. Submit to IndexNow API
    indexnow_success, indexnow_code, indexnow_msg, indexnow_elapsed = submit_indexnow(
        priority_urls, dry_run, logger
    )

    # 4. Summary & Verification Audit
    logger.info("\n" + "=" * 72)
    logger.info("📊 EXECUTION SUMMARY AUDIT")
    logger.info("=" * 72)
    logger.info(f"Operating Mode: {mode_label}")
    logger.info(f"Sitemaps Processed: {len(SITEMAPS)}")
    for res in ping_results:
        status_flag = "✅ OK" if res["success"] else "⚠️ HTTP " + str(res["code"])
        logger.info(f"  [{res['engine']}] {res['sitemap']} -> {status_flag} ({res['elapsed_ms']:.1f}ms)")

    indexnow_flag = "✅ ACCEPTED" if indexnow_success else "❌ FAILED (HTTP " + str(indexnow_code) + ")"
    logger.info(f"IndexNow Protocol ({INDEXNOW_API_ENDPOINT}):")
    logger.info(f"  URLs Submitted: {len(priority_urls)}")
    logger.info(f"  Status: {indexnow_flag} ({indexnow_elapsed:.1f}ms)")
    logger.info("=" * 72)

    if dry_run:
        logger.info("💡 To transmit live requests across global endpoints, rerun with: python3 automation/ping_search_engines.py --execute")
        logger.info("=" * 72)


if __name__ == "__main__":
    main()
