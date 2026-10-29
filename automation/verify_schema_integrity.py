#!/usr/bin/env python3
"""
verify_schema_integrity.py — Zero-Defect Schema.org JSON-LD AST Gatekeeper

Production-grade CI/CD and pre-deployment gatekeeper for structured data.
Enforces strict JSON parsing, zero duplicate keys, canonical @context validation,
and Schema.org structural invariants across all pre-rendered and programmatic pages.

Checks enforced:
1. Strict JSON Syntax: Detects malformed JSON with exact line number reporting.
2. Duplicate Key Rejection: Uses json.loads(..., object_pairs_hook=...) to strictly reject
   any duplicate keys in any JSON-LD object (e.g. duplicate @context, duplicate name).
3. @context Validation: Ensures all JSON-LD contexts reference valid Schema.org endpoints.
4. Structural Invariants:
   - BreadcrumbList: itemListElement must be a non-empty list of ListItem objects,
     each possessing valid 'position', 'name', and 'item'.
   - Organization / LocalBusiness: Must have valid 'name' and 'url'.
   - VideoObject: Must have valid 'name', 'uploadDate', and 'thumbnailUrl'.
   - WebApplication / SoftwareApplication: Must have valid 'name' and 'url'.

Exits with returncode 1 on ANY error to halt CI/CD pipelines immediately.
"""

import sys
import os
import re
import json
import time
import argparse
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

# ANSI Color Codes
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
WHITE = "\033[97m"

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DEFAULT_DIST_DIR = PROJECT_ROOT / "frontend" / "dist"
DEFAULT_PAGES_DIR = PROJECT_ROOT / "PORTABLE_SEO_FACTORY" / "generated_pages"

# Regex matching <script type="application/ld+json"> regardless of attribute ordering
JSONLD_SCRIPT_PATTERN = re.compile(
    r'<script\b(?=[^>]*\btype=[\"\']application/ld\+json[\"\'])[^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE
)

VALID_CONTEXT_REGEX = re.compile(r'^https?://schema\.org/?$', re.IGNORECASE)

class DuplicateKeyError(ValueError):
    """Raised when an object in JSON-LD contains a duplicate key."""
    def __init__(self, key: str, line_no: int):
        super().__init__(f"Duplicate key '{key}' found on line {line_no}")
        self.key = key
        self.line_no = line_no

class SchemaIntegrityAuditor:
    def __init__(self, verbose: bool = False, quiet: bool = False):
        self.verbose = verbose
        self.quiet = quiet
        self.files_audited = 0
        self.blocks_validated = 0
        self.errors: List[Dict[str, Any]] = []
        self.warnings: List[Dict[str, Any]] = []

    def record_error(self, file_path: Path, line_no: int, message: str, node_type: str = ""):
        self.errors.append({
            "file": str(file_path),
            "line": line_no,
            "message": message,
            "node_type": node_type
        })
        if not self.quiet:
            rel_path = self._rel_path(file_path)
            print(f"  {RED}✖ [CRITICAL]{RESET} {rel_path}:{line_no} — {message}")

    def record_warning(self, file_path: Path, line_no: int, message: str):
        self.warnings.append({
            "file": str(file_path),
            "line": line_no,
            "message": message
        })
        if self.verbose:
            rel_path = self._rel_path(file_path)
            print(f"  {YELLOW}▲ [WARNING]{RESET} {rel_path}:{line_no} — {message}")

    def _rel_path(self, path: Path) -> str:
        try:
            return str(path.relative_to(PROJECT_ROOT))
        except ValueError:
            return str(path)

    def parse_json_strict(self, raw_json: str, file_path: Path, base_line: int) -> Optional[Any]:
        """
        Parses JSON enforcing strict key uniqueness and reporting accurate file line numbers.
        """
        def check_duplicate_keys(pairs):
            seen = set()
            for key, value in pairs:
                if key in seen:
                    # Find exact line number of duplicate key occurrence
                    key_pattern = re.compile(r'"' + re.escape(key) + r'"\s*:')
                    matches = list(key_pattern.finditer(raw_json))
                    line_offset = 0
                    if len(matches) >= 2:
                        line_offset = raw_json[:matches[1].start()].count('\n')
                    elif len(matches) == 1:
                        line_offset = raw_json[:matches[0].start()].count('\n')
                    exact_line = base_line + line_offset
                    raise DuplicateKeyError(key, exact_line)
                seen.add(key)
            return dict(pairs)

        try:
            return json.loads(raw_json, object_pairs_hook=check_duplicate_keys)
        except DuplicateKeyError as e:
            self.record_error(file_path, e.line_no, f"Duplicate JSON key '{e.key}' prohibited in schema definition.")
            return None
        except json.JSONDecodeError as e:
            exact_line = base_line + e.lineno - 1
            self.record_error(file_path, exact_line, f"JSON-LD syntax error: {e.msg} (col {e.colno}).")
            return None
        except Exception as e:
            self.record_error(file_path, base_line, f"Unexpected JSON parse failure: {str(e)}.")
            return None

    def validate_context(self, context_val: Any, file_path: Path, line_no: int):
        """Verifies that @context complies with Schema.org specifications."""
        if isinstance(context_val, str):
            if not VALID_CONTEXT_REGEX.match(context_val.strip()):
                self.record_error(file_path, line_no, f"Invalid @context value '{context_val}'. Must reference https://schema.org")
        elif isinstance(context_val, list):
            for item in context_val:
                self.validate_context(item, file_path, line_no)
        elif isinstance(context_val, dict):
            vocab = context_val.get("@vocab", "")
            if vocab and not VALID_CONTEXT_REGEX.match(vocab.strip()):
                self.record_error(file_path, line_no, f"Invalid @context @vocab '{vocab}'. Must reference https://schema.org")
        else:
            self.record_error(file_path, line_no, f"Unsupported @context format: {type(context_val).__name__}")

    def validate_node_invariants(self, node: Any, file_path: Path, line_no: int):
        """Recursively checks structural invariants for common Schema.org types."""
        if not isinstance(node, dict):
            if isinstance(node, list):
                for item in node:
                    self.validate_node_invariants(item, file_path, line_no)
            return

        # Check @context if present on node
        if "@context" in node:
            self.validate_context(node["@context"], file_path, line_no)

        types = node.get("@type", [])
        if isinstance(types, str):
            types = [types]
        elif not isinstance(types, list):
            types = []

        # 1. BreadcrumbList invariant
        if "BreadcrumbList" in types:
            items = node.get("itemListElement")
            if not isinstance(items, list) or len(items) == 0:
                self.record_error(
                    file_path, line_no,
                    "BreadcrumbList invariant violation: 'itemListElement' must be a non-empty list.",
                    "BreadcrumbList"
                )
            else:
                for idx, item in enumerate(items, 1):
                    if not isinstance(item, dict):
                        self.record_error(file_path, line_no, f"BreadcrumbList item #{idx} is not an object.", "BreadcrumbList")
                        continue
                    item_type = item.get("@type")
                    if item_type != "ListItem" and (isinstance(item_type, list) and "ListItem" not in item_type):
                        self.record_error(file_path, line_no, f"BreadcrumbList item #{idx} @type must be 'ListItem' (found '{item_type}').", "BreadcrumbList")
                    if "position" not in item:
                        self.record_error(file_path, line_no, f"BreadcrumbList item #{idx} missing required 'position'.", "BreadcrumbList")
                    if not item.get("name"):
                        self.record_error(file_path, line_no, f"BreadcrumbList item #{idx} missing required 'name'.", "BreadcrumbList")
                    if not item.get("item"):
                        self.record_error(file_path, line_no, f"BreadcrumbList item #{idx} missing required 'item' URL.", "BreadcrumbList")

        # 2. Organization / LocalBusiness invariants
        org_types = {"Organization", "LocalBusiness", "Corporation", "ProfessionalService"}
        matching_org_types = org_types.intersection(set(types))
        if matching_org_types:
            type_label = list(matching_org_types)[0]
            name = node.get("name")
            if not name or not str(name).strip():
                self.record_error(file_path, line_no, f"{type_label} invariant violation: missing required non-empty 'name'.", type_label)
            url = node.get("url")
            if not url or not str(url).strip():
                self.record_error(file_path, line_no, f"{type_label} invariant violation: missing required non-empty 'url'.", type_label)

        # 3. VideoObject invariant
        if "VideoObject" in types:
            name = node.get("name")
            if not name or not str(name).strip():
                self.record_error(file_path, line_no, "VideoObject invariant violation: missing required non-empty 'name'.", "VideoObject")
            upload_date = node.get("uploadDate")
            if not upload_date or not str(upload_date).strip():
                self.record_error(file_path, line_no, "VideoObject invariant violation: missing required 'uploadDate'.", "VideoObject")
            thumbnail = node.get("thumbnailUrl")
            if not thumbnail or (isinstance(thumbnail, list) and len(thumbnail) == 0):
                self.record_error(file_path, line_no, "VideoObject invariant violation: missing required 'thumbnailUrl'.", "VideoObject")

        # 4. WebApplication / SoftwareApplication invariants
        app_types = {"WebApplication", "SoftwareApplication"}
        matching_app_types = app_types.intersection(set(types))
        if matching_app_types:
            type_label = list(matching_app_types)[0]
            name = node.get("name")
            if not name or not str(name).strip():
                self.record_error(file_path, line_no, f"{type_label} invariant violation: missing required non-empty 'name'.", type_label)
            url = node.get("url")
            if not url or not str(url).strip():
                self.record_error(file_path, line_no, f"{type_label} invariant violation: missing required non-empty 'url'.", type_label)

        # 5. FAQPage invariant
        if "FAQPage" in types:
            main_entity = node.get("mainEntity")
            if not isinstance(main_entity, list) or len(main_entity) == 0:
                self.record_error(file_path, line_no, "FAQPage invariant violation: 'mainEntity' must be a non-empty list of Questions.", "FAQPage")
            else:
                for q_idx, q in enumerate(main_entity, 1):
                    if isinstance(q, dict):
                        q_name = q.get("name")
                        if not q_name or not str(q_name).strip():
                            self.record_error(file_path, line_no, f"FAQPage Question #{q_idx} missing required non-empty 'name'.", "FAQPage")
                        ans = q.get("acceptedAnswer")
                        if not isinstance(ans, dict) or not ans.get("text"):
                            self.record_error(file_path, line_no, f"FAQPage Question #{q_idx} missing required 'acceptedAnswer' with 'text'.", "FAQPage")

        # 6. Service invariant
        if "Service" in types:
            name = node.get("name") or node.get("serviceType")
            if not name or not str(name).strip():
                self.record_error(file_path, line_no, "Service invariant violation: missing required non-empty 'name' or 'serviceType'.", "Service")

        # 7. Article / TechArticle / BlogPosting invariant
        article_types = {"TechArticle", "Article", "BlogPosting"}
        matching_article_types = article_types.intersection(set(types))
        if matching_article_types:
            type_label = list(matching_article_types)[0]
            headline = node.get("headline") or node.get("name")
            if not headline or not str(headline).strip():
                self.record_error(file_path, line_no, f"{type_label} invariant violation: missing required non-empty 'headline'.", type_label)

        # Recurse into all properties
        for key, value in node.items():
            if isinstance(value, dict):
                self.validate_node_invariants(value, file_path, line_no)
            elif isinstance(value, list):
                for list_item in value:
                    if isinstance(list_item, dict):
                        self.validate_node_invariants(list_item, file_path, line_no)

    def audit_file(self, file_path: Path):
        """Audits a single HTML file for schema syntax, uniqueness, and structural validity."""
        self.files_audited += 1
        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            self.record_error(file_path, 1, f"Failed to read file: {e}")
            return

        for match in JSONLD_SCRIPT_PATTERN.finditer(content):
            self.blocks_validated += 1
            raw_script = match.group(1).strip()
            if not raw_script:
                base_line = content[:match.start()].count('\n') + 1
                self.record_warning(file_path, base_line, "Empty <script type=\"application/ld+json\"> block encountered.")
                continue

            # Compute start line of JSON content inside the HTML file
            base_line = content[:match.start(1)].count('\n') + 1

            parsed_data = self.parse_json_strict(raw_script, file_path, base_line)
            if parsed_data is None:
                continue

            # Verify root-level @context
            if isinstance(parsed_data, dict):
                if "@context" in parsed_data:
                    self.validate_context(parsed_data["@context"], file_path, base_line)
                elif "@graph" not in parsed_data:
                    self.record_error(file_path, base_line, "Root JSON-LD object missing required '@context'.")

                self.validate_node_invariants(parsed_data, file_path, base_line)

            elif isinstance(parsed_data, list):
                for item in parsed_data:
                    if isinstance(item, dict) and "@context" in item:
                        self.validate_context(item["@context"], file_path, base_line)
                    self.validate_node_invariants(item, file_path, base_line)

    def audit_directory(self, target_dir: Path):
        """Recursively audits all .html files within a directory."""
        if not target_dir.exists():
            if self.verbose:
                print(f"{DIM}Skipping non-existent directory: {target_dir}{RESET}")
            return

        for html_file in target_dir.rglob("*.html"):
            self.audit_file(html_file)

    def print_summary(self, elapsed: float) -> bool:
        """Prints a high-visibility terminal report and returns True if zero errors."""
        passed = len(self.errors) == 0
        status_color = GREEN if passed else RED
        status_text = "PASSED" if passed else "FAILED"

        print("\n" + "=" * 78)
        print(f" {CYAN}{BOLD}🔱 SCHEMA INTEGRITY & JSON-LD AST VERIFICATION GATEKEEPER 🔱{RESET}")
        print("=" * 78)
        print(f"  • Total HTML Files Audited:      {WHITE}{self.files_audited:,}{RESET}")
        print(f"  • Total JSON-LD Blocks Checked:  {WHITE}{self.blocks_validated:,}{RESET}")
        print(f"  • Critical Schema Errors:        {RED if self.errors else GREEN}{len(self.errors)}{RESET}")
        print(f"  • Non-Blocking Warnings:        {YELLOW if self.warnings else GREEN}{len(self.warnings)}{RESET}")
        print(f"  • Verification Time:             {WHITE}{elapsed:.2f}s{RESET}")
        print(f"  • Gatekeeper Verdict:            {status_color}{BOLD}{status_text}{RESET}")
        print("=" * 78)

        if not passed:
            print(f"\n{RED}{BOLD}🚨 BUILD HALTED: {len(self.errors)} critical schema syntax / invariant defect(s) detected.{RESET}")
            print(f"{RED}Fix the schema errors above to restore deterministic deployment integrity.{RESET}\n")
        else:
            print(f"\n{GREEN}{BOLD}✅ 100% ZERO-DEFECT SCHEMA VERIFIED across all pages and AST nodes.{RESET}")
            print(f"{GREEN}Deployment authorized. CI/CD pipeline unblocked.{RESET}\n")

        return passed

def run_gatekeeper(
    dist_dir: Optional[Path] = None,
    pages_dir: Optional[Path] = None,
    additional_paths: Optional[List[Path]] = None,
    verbose: bool = False,
    quiet: bool = False
) -> bool:
    """
    Entrypoint callable directly by Python pipelines (e.g. auto_pilot.py or SSG).
    Returns True if passed, False otherwise.
    """
    dist_dir = dist_dir or DEFAULT_DIST_DIR
    pages_dir = pages_dir or DEFAULT_PAGES_DIR
    auditor = SchemaIntegrityAuditor(verbose=verbose, quiet=quiet)

    start_time = time.time()
    if not quiet:
        print(f"{CYAN}{BOLD}🔍 [GATEKEEPER]{RESET} Commencing Schema.org AST and JSON-LD integrity audit...")

    if dist_dir.exists():
        if not quiet:
            print(f"  Scanning frontend distribution: {CYAN}{dist_dir}{RESET}")
        auditor.audit_directory(dist_dir)

    if pages_dir.exists():
        if not quiet:
            print(f"  Scanning programmatic SEO factory: {CYAN}{pages_dir}{RESET}")
        auditor.audit_directory(pages_dir)

    if additional_paths:
        for path in additional_paths:
            if path.is_file() and path.suffix.lower() == ".html":
                auditor.audit_file(path)
            elif path.is_dir():
                auditor.audit_directory(path)

    elapsed = time.time() - start_time
    passed = auditor.print_summary(elapsed)
    return passed

def main():
    parser = argparse.ArgumentParser(
        description="Verify Schema.org JSON-LD structured data syntax and structural integrity.",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--dist-dir",
        type=Path,
        default=DEFAULT_DIST_DIR,
        help="Path to frontend production build directory (default: frontend/dist)"
    )
    parser.add_argument(
        "--pages-dir",
        type=Path,
        default=DEFAULT_PAGES_DIR,
        help="Path to programmatic SEO generated pages (default: PORTABLE_SEO_FACTORY/generated_pages)"
    )
    parser.add_argument(
        "--path",
        type=Path,
        action="append",
        dest="extra_paths",
        help="Additional file or directory path to audit (can be specified multiple times)"
    )
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Display detailed per-file audit progress and non-blocking warnings"
    )
    parser.add_argument(
        "-q", "--quiet",
        action="store_true",
        help="Suppress banner and only print critical error findings"
    )

    args = parser.parse_args()

    passed = run_gatekeeper(
        dist_dir=args.dist_dir,
        pages_dir=args.pages_dir,
        additional_paths=args.extra_paths,
        verbose=args.verbose,
        quiet=args.quiet
    )

    if not passed:
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    main()
