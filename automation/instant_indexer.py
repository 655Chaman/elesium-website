#!/usr/bin/env python3
"""
instant_indexer.py — Instant IndexNow & Search Engine Pinging Engine

Phase 6.2 of the Elesium Master SEO Engine.
Implements the official IndexNow protocol (Microsoft Bing, Yandex, Seznam, Naver)
and automated sitemap ping notifications for search engines.

Features:
- Dynamic 32-character hexadecimal IndexNow key management & verification file hosting
- ElementTree XML sitemap parser extracting all active production URLs
- Batch IndexNow JSON submission to https://api.indexnow.org/indexnow
- Sitemap ping dispatch for Google and Bing with modern status interpretation
- Comprehensive CLI flags: --dry-run, --force, --verbose, --limit, --urls
"""

import os
import sys
import json
import secrets
import argparse
import datetime
import urllib.request
import urllib.error
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

# Base directories
BASE_DIR = Path(__file__).parent.resolve()
ROOT_DIR = BASE_DIR.parent
DEFAULT_PUBLIC_DIR = ROOT_DIR / "frontend" / "public"
DEFAULT_SITEMAP_PATH = DEFAULT_PUBLIC_DIR / "sitemap.xml"
DEFAULT_HOST = "elesium.online"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

# 32-character hex regex pattern
HEX_32_PATTERN = re = __import__("re").compile(r"^[0-9a-fA-F]{32}$")


class InstantIndexer:
    """
    Autonomous IndexNow and Search Engine Ping Controller.
    """

    def __init__(
        self,
        host: str = DEFAULT_HOST,
        public_dir: Optional[Path] = None,
        sitemap_path: Optional[Path] = None,
        key: Optional[str] = None,
        force_new_key: bool = False,
        verbose: bool = False,
        dry_run: bool = False,
    ):
        self.host = host.strip().lower()
        self.public_dir = Path(public_dir) if public_dir else DEFAULT_PUBLIC_DIR
        self.sitemap_path = Path(sitemap_path) if sitemap_path else DEFAULT_SITEMAP_PATH
        self.key = key
        self.force_new_key = force_new_key
        self.verbose = verbose
        self.dry_run = dry_run
        self.active_key: Optional[str] = None
        self.key_file_path: Optional[Path] = None

    def log(self, message: str, level: str = "INFO"):
        """Standardized console logging."""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        prefix = {
            "INFO": "[\033[94mINFO\033[0m]",
            "SUCCESS": "[\033[92mSUCCESS\033[0m]",
            "WARNING": "[\033[93mWARNING\033[0m]",
            "ERROR": "[\033[91mERROR\033[0m]",
            "DRY": "[\033[95mDRY-RUN\033[0m]",
            "VERBOSE": "[\033[90mDEBUG\033[0m]",
        }.get(level, f"[{level}]")
        print(f"[{timestamp}] {prefix} {message}")

    def debug(self, message: str):
        """Verbose debug logging."""
        if self.verbose:
            self.log(message, level="VERBOSE")

    # ─────────────────────────────────────────────────────────────
    # 1. KEY MANAGEMENT & VERIFICATION
    # ─────────────────────────────────────────────────────────────

    def find_existing_key(self) -> Optional[str]:
        """
        Scan public directory for existing 32-hex verification files.
        """
        if not self.public_dir.exists():
            return None

        # Check explicit environment variable
        env_key = os.getenv("INDEXNOW_KEY", "").strip()
        if env_key and HEX_32_PATTERN.match(env_key):
            self.debug(f"Found INDEXNOW_KEY in environment: {env_key}")
            return env_key

        # Scan for <32-hex>.txt files
        for txt_file in self.public_dir.glob("*.txt"):
            stem = txt_file.stem.strip()
            if HEX_32_PATTERN.match(stem):
                try:
                    content = txt_file.read_text(encoding="utf-8").strip()
                    if content.lower() == stem.lower():
                        self.debug(f"Found valid existing key file: {txt_file.name}")
                        return stem
                except Exception as e:
                    self.debug(f"Error reading {txt_file.name}: {e}")

        return None

    def generate_key(self) -> str:
        """
        Generate an authentic cryptographically secure 32-character hexadecimal key.
        """
        return secrets.token_hex(16).lower()

    def resolve_key(self) -> str:
        """
        Determine active IndexNow key and write/verify local verification file.
        """
        chosen_key = None

        if self.key:
            clean_key = self.key.strip().lower()
            if not HEX_32_PATTERN.match(clean_key):
                raise ValueError(f"Supplied key '{self.key}' is not a valid 32-character hex string.")
            chosen_key = clean_key
            self.log(f"Using explicitly specified key: {chosen_key}")
        elif not self.force_new_key:
            existing = self.find_existing_key()
            if existing:
                chosen_key = existing
                self.log(f"Reusing verified existing IndexNow key: {chosen_key}", level="INFO")

        if not chosen_key or self.force_new_key:
            chosen_key = self.generate_key()
            self.log(f"Generated fresh 32-character IndexNow key: {chosen_key}", level="INFO")

        self.active_key = chosen_key
        self.key_file_path = self.public_dir / f"{chosen_key}.txt"

        # Write or verify verification file
        if not self.dry_run:
            self.public_dir.mkdir(parents=True, exist_ok=True)
            self.key_file_path.write_text(f"{chosen_key}\n", encoding="utf-8")
            self.log(f"Verification file verified at: {self.key_file_path}", level="SUCCESS")
        else:
            self.log(f"Would write key file to: {self.key_file_path}", level="DRY")

        return chosen_key

    @property
    def key_location_url(self) -> str:
        """Public URL where the search engine accesses the verification key."""
        if not self.active_key:
            raise RuntimeError("Key not resolved. Call resolve_key() first.")
        return f"https://{self.host}/{self.active_key}.txt"

    # ─────────────────────────────────────────────────────────────
    # 2. SITEMAP PARSING
    # ─────────────────────────────────────────────────────────────

    def extract_sitemap_urls(self, limit: Optional[int] = None) -> List[str]:
        """
        Dynamically parse sitemap.xml to extract all production URLs.
        """
        if not self.sitemap_path.exists():
            raise FileNotFoundError(f"Sitemap file not found at {self.sitemap_path}")

        self.log(f"Parsing sitemap from {self.sitemap_path}...")
        try:
            tree = ET.parse(self.sitemap_path)
            root = tree.getroot()
        except ET.ParseError as e:
            raise ValueError(f"Malformed XML in sitemap: {e}")

        # Support both standard sitemap namespace and un-namespaced tags
        namespaces = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        loc_elements = root.findall(".//sm:loc", namespaces)
        if not loc_elements:
            loc_elements = root.findall(".//loc")

        extracted_urls: List[str] = []
        seen = set()

        for elem in loc_elements:
            if elem.text:
                url = elem.text.strip()
                if url and url.startswith(f"https://{self.host}") and url not in seen:
                    seen.add(url)
                    extracted_urls.append(url)

        self.log(f"Discovered {len(extracted_urls)} active URLs for host '{self.host}' in sitemap.", level="SUCCESS")

        if limit and limit > 0:
            extracted_urls = extracted_urls[:limit]
            self.log(f"Applied URL limit: submitting first {len(extracted_urls)} URLs.", level="INFO")

        if self.verbose:
            self.debug("Discovered URLs Sample:")
            for u in extracted_urls[:5]:
                self.debug(f"  - {u}")
            if len(extracted_urls) > 5:
                self.debug(f"  ... and {len(extracted_urls) - 5} more.")

        return extracted_urls

    # ─────────────────────────────────────────────────────────────
    # 3. INDEXNOW SUBMISSION
    # ─────────────────────────────────────────────────────────────

    def submit_indexnow(self, urls: List[str]) -> Dict[str, Any]:
        """
        Submit URLs to the official IndexNow API endpoint.
        """
        if not self.active_key:
            self.resolve_key()

        if not urls:
            self.log("No URLs to submit to IndexNow.", level="WARNING")
            return {"status": "skipped", "reason": "empty_url_list"}

        payload = {
            "host": self.host,
            "key": self.active_key,
            "keyLocation": self.key_location_url,
            "urlList": urls,
        }

        json_bytes = json.dumps(payload, indent=2).encode("utf-8")

        self.log(
            f"Preparing IndexNow batch: {len(urls)} URLs | Key: {self.active_key[:8]}... | Endpoint: {INDEXNOW_ENDPOINT}"
        )

        if self.dry_run:
            self.log(
                f"[DRY-RUN] Would POST {len(json_bytes)} bytes to {INDEXNOW_ENDPOINT}",
                level="DRY",
            )
            if self.verbose:
                self.debug(f"Payload preview:\n{json.dumps(payload, indent=2)}")
            return {
                "status": "dry_run",
                "http_status": 200,
                "url_count": len(urls),
                "endpoint": INDEXNOW_ENDPOINT,
                "key_location": self.key_location_url,
            }

        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Elesium-InstantIndexer/1.0 (+https://elesium.online)",
            "Accept": "application/json, text/plain, */*",
        }

        req = urllib.request.Request(
            INDEXNOW_ENDPOINT,
            data=json_bytes,
            headers=headers,
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                status_code = response.status
                body = response.read().decode("utf-8", errors="replace").strip()
                
                # Interpret status according to official IndexNow protocol
                if status_code == 200:
                    interpretation = "OK (URLs submitted successfully)"
                    level = "SUCCESS"
                elif status_code == 202:
                    interpretation = "Accepted (Key pending verification or URLs queued)"
                    level = "SUCCESS"
                else:
                    interpretation = f"HTTP {status_code}"
                    level = "INFO"

                self.log(
                    f"IndexNow API Response: HTTP {status_code} - {interpretation}",
                    level=level,
                )
                if body:
                    self.debug(f"Response Body: {body}")

                return {
                    "status": "success",
                    "http_status": status_code,
                    "interpretation": interpretation,
                    "url_count": len(urls),
                    "response_body": body,
                }

        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8", errors="replace").strip()
            # Status explanations based on IndexNow specifications
            explanations = {
                400: "Bad Request (Invalid format)",
                403: "Forbidden (Key invalid or verification key file not found at keyLocation)",
                422: "Unprocessable Entity (URLs do not match host or key schema invalid)",
                429: "Too Many Requests (Rate limit exceeded)",
            }
            reason_text = explanations.get(e.code, e.reason)
            self.log(
                f"IndexNow API Error: HTTP {e.code} ({reason_text}). Body: {error_body}",
                level="ERROR",
            )
            return {
                "status": "error",
                "http_status": e.code,
                "reason": reason_text,
                "error_body": error_body,
            }
        except Exception as e:
            self.log(f"IndexNow network exception: {e}", level="ERROR")
            return {
                "status": "exception",
                "error": str(e),
            }

    # ─────────────────────────────────────────────────────────────
    # 4. SEARCH ENGINE PINGING
    # ─────────────────────────────────────────────────────────────

    def ping_search_engines(self, sitemap_url: Optional[str] = None) -> Dict[str, Any]:
        """
        Notify Google and Bing of sitemap updates.
        Handles legacy/deprecated ping endpoints gracefully.
        """
        target_sitemap = sitemap_url or f"https://{self.host}/sitemap.xml"
        encoded_sitemap = urllib.parse.quote(target_sitemap, safe="")

        endpoints = [
            ("Google Sitemap Ping", f"https://www.google.com/ping?sitemap={encoded_sitemap}"),
            ("Bing Sitemap Ping", f"https://www.bing.com/ping?sitemap={encoded_sitemap}"),
        ]

        results = {}

        for name, url in endpoints:
            self.log(f"Notifying {name}: {url}")
            if self.dry_run:
                self.log(f"[DRY-RUN] Would GET {url}", level="DRY")
                results[name] = {"status": "dry_run", "http_status": 200, "url": url}
                continue

            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (compatible; ElesiumIndexer/1.0; +https://elesium.online)",
                    "Accept": "*/*",
                },
            )

            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    status = resp.status
                    self.log(f"{name} Response: HTTP {status} OK", level="SUCCESS")
                    results[name] = {"status": "success", "http_status": status, "url": url}
            except urllib.error.HTTPError as e:
                # Clarify deprecated ping endpoints
                if e.code == 404 and "google" in url.lower():
                    note = "Google deprecated anonymous /ping endpoint in late 2023. Relying on IndexNow & lastmod."
                    self.log(f"{name} Response: HTTP 404 ({note})", level="WARNING")
                elif e.code == 410 and "bing" in url.lower():
                    note = "Bing retired /ping in favor of IndexNow protocol. Handled via primary IndexNow push."
                    self.log(f"{name} Response: HTTP 410 ({note})", level="WARNING")
                else:
                    note = f"HTTP {e.code} - {e.reason}"
                    self.log(f"{name} Response: {note}", level="WARNING")

                results[name] = {
                    "status": "deprecated_or_failed",
                    "http_status": e.code,
                    "reason": str(e.reason),
                    "note": note,
                    "url": url,
                }
            except Exception as e:
                self.log(f"{name} Exception: {e}", level="ERROR")
                results[name] = {"status": "exception", "error": str(e), "url": url}

        return results

    # ─────────────────────────────────────────────────────────────
    # 5. MASTER EXECUTION PIPELINE
    # ─────────────────────────────────────────────────────────────

    def run(
        self,
        custom_urls: Optional[List[str]] = None,
        limit: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Execute full instant indexing pipeline.
        """
        self.log("=" * 68)
        self.log(f"🚀 ELESIUM INSTANT INDEXER & SEARCH ENGINE PING ENGINE")
        self.log(f"Host: {self.host} | Mode: {'DRY-RUN' if self.dry_run else 'LIVE PRODUCTION'}")
        self.log("=" * 68)

        # Step 1: Resolve Key & Verification File
        key = self.resolve_key()
        key_url = self.key_location_url

        # Step 2: Extract URLs
        if custom_urls:
            urls = custom_urls
            self.log(f"Using {len(urls)} custom provided URLs.", level="INFO")
        else:
            urls = self.extract_sitemap_urls(limit=limit)

        # Step 3: IndexNow Batch Push
        indexnow_result = self.submit_indexnow(urls)

        # Step 4: Search Engine Pings
        ping_results = self.ping_search_engines()

        self.log("=" * 68)
        self.log("🏁 INDEXING PIPELINE EXECUTION SUMMARY")
        self.log(f"  • Verified Key:         {key}")
        self.log(f"  • Key Verification URL: {key_url}")
        self.log(f"  • Active URLs Processed: {len(urls)}")
        self.log(f"  • IndexNow Status:      HTTP {indexnow_result.get('http_status', 'N/A')}")
        for engine, res in ping_results.items():
            self.log(f"  • {engine:22}: HTTP {res.get('http_status', 'N/A')}")
        self.log("=" * 68)

        return {
            "host": self.host,
            "key": key,
            "key_verification_url": key_url,
            "url_count": len(urls),
            "urls": urls,
            "indexnow": indexnow_result,
            "pings": ping_results,
            "dry_run": self.dry_run,
        }


def run_instant_indexer(
    host: str = DEFAULT_HOST,
    key: Optional[str] = None,
    force: bool = False,
    dry_run: bool = False,
    verbose: bool = False,
    limit: Optional[int] = None,
    custom_urls: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Programmatic entrypoint for external orchestrators."""
    indexer = InstantIndexer(
        host=host,
        key=key,
        force_new_key=force,
        dry_run=dry_run,
        verbose=verbose,
    )
    return indexer.run(custom_urls=custom_urls, limit=limit)


def main():
    parser = argparse.ArgumentParser(
        description="Instant IndexNow & Search Engine Pinging Engine for Elesium",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Simulate execution without sending live HTTP requests or altering files.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force generation of a new 32-character hexadecimal IndexNow key.",
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose output including full payload details and debug traces.",
    )
    parser.add_argument(
        "--host",
        default=DEFAULT_HOST,
        help="Target host domain name.",
    )
    parser.add_argument(
        "--key",
        default=None,
        help="Provide a specific 32-character hexadecimal IndexNow key.",
    )
    parser.add_argument(
        "--sitemap",
        default=str(DEFAULT_SITEMAP_PATH),
        help="Custom path to sitemap.xml.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit number of sitemap URLs submitted in this run.",
    )
    parser.add_argument(
        "--url",
        action="append",
        dest="urls",
        help="Specific URL to submit (can be specified multiple times).",
    )

    args = parser.parse_args()

    indexer = InstantIndexer(
        host=args.host,
        sitemap_path=Path(args.sitemap),
        key=args.key,
        force_new_key=args.force,
        verbose=args.verbose,
        dry_run=args.dry_run,
    )

    try:
        indexer.run(custom_urls=args.urls, limit=args.limit)
    except Exception as e:
        indexer.log(f"Fatal error during indexing execution: {e}", level="ERROR")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
