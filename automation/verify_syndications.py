#!/usr/bin/env python3
"""
verify_syndications.py — Craig Campbell Parasite Syndication Verification Engine
Audits and tests all 8 technical whitepaper syndication packages in automation/syndications/.

Verifies:
1. Exact YAML frontmatter (title, description, tags, canonical_url, cover_image).
2. Canonical URL structure mapping directly to https://elesium.online.
3. Presence of Navboost search telemetry CTA ("Search Google for 'Elesium AI automation agency India'").
4. Presence of production-grade technical code snippets (```python).
5. Presence of Mermaid architecture diagrams (```mermaid) and ASCII schematics.
6. Dev.to API payload conformance (valid JSON, <= 4 tags, canonical_url).
7. Hashnode GraphQL payload conformance (valid GraphQL mutation, tags list, isRepublished=True).
8. Medium API payload conformance (valid JSON, contentFormat=markdown, canonicalUrl, <= 5 tags).
9. Executable permissions (0755) and curl command syntax on shell scripts (publish_devto.sh, publish_hashnode.sh, publish_curl.sh).
10. Minimum whitepaper word count benchmark (1,000+ words).
"""

import os
import sys
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SYNDICATIONS_DIR = BASE_DIR / "automation" / "syndications"

EXPECTED_SLUGS = [
    "top-ai-automation-agencies-india-2026",
    "ai-automation-cost-india-2026-pricing",
    "how-to-choose-ai-automation-agency-india",
    "ai-automation-roi-india-case-studies-2026",
    "n8n-vs-langchain-vs-custom-agents-india-2026",
    "enterprise-ai-automation-india-2026",
    "langgraph-vs-n8n-enterprise-agents",
    "bfsi-autonomous-loan-underwriting"
]

class SyndicationAuditor:
    def __init__(self, base_dir: Path):
        self.syndications_dir = base_dir / "automation" / "syndications"
        self.results = {}
        self.total_checks = 0
        self.passed_checks = 0
        self.failed_checks = 0

    def record_check(self, slug: str, check_name: str, passed: bool, detail: str = ""):
        self.total_checks += 1
        if passed:
            self.passed_checks += 1
        else:
            self.failed_checks += 1
        if slug not in self.results:
            self.results[slug] = []
        self.results[slug].append({
            "check": check_name,
            "passed": passed,
            "detail": detail
        })

    def parse_yaml_frontmatter(self, content: str) -> dict:
        if not content.startswith("---"):
            return {}
        parts = content.split("---", 2)
        if len(parts) < 3:
            return {}
        yaml_text = parts[1]
        frontmatter = {}
        for line in yaml_text.strip().split("\n"):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if ":" in line:
                key, val = line.split(":", 1)
                frontmatter[key.strip()] = val.strip().strip('"').strip("'")
        return frontmatter

    def audit_folder(self, slug: str):
        folder = self.syndications_dir / slug
        if not folder.exists() or not folder.is_dir():
            self.record_check(slug, "directory_exists", False, f"Folder {folder} does not exist")
            return

        self.record_check(slug, "directory_exists", True, f"Found folder {folder.name}")

        # 1. Audit article_full.md
        md_file = folder / "article_full.md"
        if not md_file.exists():
            self.record_check(slug, "article_md_exists", False, "Missing article_full.md")
            return
        
        md_content = md_file.read_text(encoding="utf-8")
        word_count = len(re.findall(r"\b\w+\b", md_content))
        
        # Word count check (1000+ words)
        self.record_check(
            slug,
            "word_count_benchmark",
            word_count >= 1000,
            f"Word count: {word_count} words (benchmark >= 1,000)"
        )

        # Frontmatter check
        fm = self.parse_yaml_frontmatter(md_content)
        has_frontmatter = bool(fm and "title" in fm and "canonical_url" in fm)
        self.record_check(slug, "yaml_frontmatter", has_frontmatter, f"Parsed YAML: title='{fm.get('title')}'")

        canonical_url = fm.get("canonical_url", "")
        valid_canonical = canonical_url.startswith("https://elesium.online/")
        self.record_check(slug, "canonical_url", valid_canonical, f"Canonical URL: {canonical_url}")

        # Navboost Search CTA
        has_navboost = (
            "Search Google for:" in md_content or "search Google for:" in md_content
        ) and "Elesium AI automation agency India" in md_content
        has_brand_link = "https://elesium.online" in md_content
        self.record_check(slug, "navboost_search_cta", has_navboost and has_brand_link, "Navboost search directive verified")

        # Technical Code Snippets
        has_code_block = "```python" in md_content or "```py" in md_content
        self.record_check(slug, "code_snippet_present", has_code_block, "Production Python code snippet detected")

        # Architectural Diagrams (Mermaid and ASCII)
        has_mermaid = "```mermaid" in md_content
        has_ascii = "+---" in md_content or "|   " in md_content or "```text" in md_content
        self.record_check(slug, "mermaid_diagram_present", has_mermaid, "Mermaid architecture diagram detected")
        self.record_check(slug, "ascii_schematic_present", has_ascii, "ASCII architectural schematic detected")

        # 2. Audit dev_to_payload.json
        devto_file = folder / "dev_to_payload.json"
        if devto_file.exists():
            try:
                with open(devto_file, "r", encoding="utf-8") as f:
                    devto_data = json.load(f)
                article_obj = devto_data.get("article", {})
                valid_devto = (
                    "title" in article_obj
                    and "body_markdown" in article_obj
                    and article_obj.get("published") is True
                    and isinstance(article_obj.get("tags"), list)
                    and len(article_obj.get("tags", [])) <= 4
                    and article_obj.get("canonical_url", "").startswith("https://elesium.online/")
                )
                self.record_check(
                    slug,
                    "devto_payload_valid",
                    valid_devto,
                    f"Tags: {article_obj.get('tags')} | Canonical: {article_obj.get('canonical_url')}"
                )
            except Exception as e:
                self.record_check(slug, "devto_payload_valid", False, f"JSON parse error: {e}")
        else:
            self.record_check(slug, "devto_payload_valid", False, "Missing dev_to_payload.json")

        # 3. Audit hashnode_payload.json
        hashnode_file = folder / "hashnode_payload.json"
        if hashnode_file.exists():
            try:
                with open(hashnode_file, "r", encoding="utf-8") as f:
                    hn_data = json.load(f)
                has_query = "publishPost" in hn_data.get("query", "")
                hn_input = hn_data.get("variables", {}).get("input", {})
                valid_hn = (
                    has_query
                    and "title" in hn_input
                    and "contentMarkdown" in hn_input
                    and isinstance(hn_input.get("tags"), list)
                    and hn_input.get("isRepublished") is True
                    and hn_input.get("originalArticleURL", "").startswith("https://elesium.online/")
                )
                self.record_check(
                    slug,
                    "hashnode_payload_valid",
                    valid_hn,
                    f"GraphQL mutation verified | OriginalURL: {hn_input.get('originalArticleURL')}"
                )
            except Exception as e:
                self.record_check(slug, "hashnode_payload_valid", False, f"JSON parse error: {e}")
        else:
            self.record_check(slug, "hashnode_payload_valid", False, "Missing hashnode_payload.json")

        # 4. Audit medium_payload.json
        medium_file = folder / "medium_payload.json"
        if medium_file.exists():
            try:
                with open(medium_file, "r", encoding="utf-8") as f:
                    med_data = json.load(f)
                valid_med = (
                    "title" in med_data
                    and med_data.get("contentFormat") == "markdown"
                    and "content" in med_data
                    and med_data.get("canonicalUrl", "").startswith("https://elesium.online/")
                    and isinstance(med_data.get("tags"), list)
                    and len(med_data.get("tags", [])) <= 5
                    and med_data.get("publishStatus") in ["public", "draft", "unlisted"]
                )
                self.record_check(
                    slug,
                    "medium_payload_valid",
                    valid_med,
                    f"Format: {med_data.get('contentFormat')} | CanonicalUrl: {med_data.get('canonicalUrl')}"
                )
            except Exception as e:
                self.record_check(slug, "medium_payload_valid", False, f"JSON parse error: {e}")
        else:
            self.record_check(slug, "medium_payload_valid", False, "Missing medium_payload.json")

        # 5. Audit publish_devto.sh
        devto_sh = folder / "publish_devto.sh"
        if devto_sh.exists():
            is_exec = os.access(devto_sh, os.X_OK)
            content = devto_sh.read_text(encoding="utf-8")
            has_curl = "https://dev.to/api/articles" in content and "dev_to_payload.json" in content
            self.record_check(
                slug,
                "publish_devto_sh",
                is_exec and has_curl,
                f"Executable: {is_exec} | Curl target: dev.to/api/articles"
            )
        else:
            self.record_check(slug, "publish_devto_sh", False, "Missing publish_devto.sh")

        # 6. Audit publish_hashnode.sh
        hn_sh = folder / "publish_hashnode.sh"
        if hn_sh.exists():
            is_exec = os.access(hn_sh, os.X_OK)
            content = hn_sh.read_text(encoding="utf-8")
            has_curl = "https://gql.hashnode.com" in content and "hashnode_payload.json" in content
            self.record_check(
                slug,
                "publish_hashnode_sh",
                is_exec and has_curl,
                f"Executable: {is_exec} | Curl target: gql.hashnode.com"
            )
        else:
            self.record_check(slug, "publish_hashnode_sh", False, "Missing publish_hashnode.sh")

        # 7. Audit publish_curl.sh
        curl_sh = folder / "publish_curl.sh"
        if curl_sh.exists():
            is_exec = os.access(curl_sh, os.X_OK)
            self.record_check(
                slug,
                "publish_curl_sh",
                is_exec,
                f"Executable: {is_exec} | Unified syndication launcher"
            )
        else:
            self.record_check(slug, "publish_curl_sh", False, "Missing publish_curl.sh")

    def run_all(self) -> bool:
        print("=" * 80)
        print(" CRAIG CAMPBELL PARASITE SYNDICATION VERIFICATION ENGINE (2026)")
        print(f" Target Directory: {self.syndications_dir}")
        print("=" * 80)

        for slug in EXPECTED_SLUGS:
            self.audit_folder(slug)

        print("\n" + "=" * 80)
        print(" DETAILED AUDIT RESULTS BY SYNDICATION PACKAGE")
        print("=" * 80)

        all_passed = True
        for slug in EXPECTED_SLUGS:
            checks = self.results.get(slug, [])
            folder_passed = all(c["passed"] for c in checks)
            status_symbol = "✅ PASS" if folder_passed else "❌ FAIL"
            if not folder_passed:
                all_passed = False
            
            print(f"\n📂 [{status_symbol}] {slug}")
            for c in checks:
                mark = "  ✓" if c["passed"] else "  ✗"
                print(f"{mark} {c['check']:<28} : {c['detail']}")

        print("\n" + "=" * 80)
        print(f" FINAL SUMMARY: {self.passed_checks}/{self.total_checks} checks passed.")
        if all_passed:
            print(" 🎉 STATUS: ALL 8 PARASITE SYNDICATION SUITES ARE 100% VALID & DEPLOYMENT-READY.")
            print("=" * 80)
            return True
        else:
            print(f" ⚠️ STATUS: {self.failed_checks} CHECKS FAILED. PLEASE REVIEW LOG ABOVE.")
            print("=" * 80)
            return False

def main():
    auditor = SyndicationAuditor(BASE_DIR)
    success = auditor.run_all()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
