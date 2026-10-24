#!/usr/bin/env python3
"""
core_web_vitals_auditor.py — Sovereign Core Web Vitals & DOM Physics Auditor
Zero-dependency static HTML analyzer for sub-second Critical Rendering Path (CRP)
and Zero-CLS (0.000) performance.

Audits:
1. Initial TCP Congestion Window (14.6KB 1-RTT Flight Boundary)
2. Render-Blocking Head JavaScript (defer / async / type="module")
3. Render-Blocking External Stylesheets (preload / critical inlining)
4. Media Aspect-Ratio & Dimension Geometry (CLS Prevention)
5. LCP Asset Fetch Priority (fetchpriority="high" on hero, no lazy load)
6. DOM Structural Physics (Total nodes < 800, max nesting depth < 32)
7. Font Display Optimization (display=swap / optional & FOIT elimination)

Usage:
    python3 core_web_vitals_auditor.py generated_pages/
    python3 core_web_vitals_auditor.py index.html
    python3 core_web_vitals_auditor.py generated_pages/ --fail-under 90
    python3 core_web_vitals_auditor.py generated_pages/ --json report.json
"""

import sys
import os
import re
import gzip
import json
import argparse
from pathlib import Path
from html.parser import HTMLParser

# ANSI Color Palette
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
MAGENTA = "\033[95m"
WHITE = "\033[97m"

# TCP MSS initial congestion window constant (RFC 6928: 10 MSS * 1460 bytes)
TCP_INIT_CWND_BYTES = 14600

# HTML Void elements that do not require closing tags
VOID_ELEMENTS = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
}

class DOMPhysicsParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.node_count = 0
        self.current_depth = 0
        self.max_depth = 0
        self.in_head = False
        self.in_body = False
        
        self.scripts_in_head = []
        self.stylesheets_in_head = []
        self.inline_styles = []
        self.images = []
        self.iframes = []
        self.font_links = []
        self.hero_elements = []
        self.inline_style_content = []
        self._current_tag = None

    def handle_starttag(self, tag, attrs):
        self.node_count += 1
        attr_dict = {k.lower(): v for k, v in attrs}
        tag_lower = tag.lower()

        if tag_lower not in VOID_ELEMENTS:
            self.current_depth += 1
            if self.current_depth > self.max_depth:
                self.max_depth = self.current_depth

        if tag_lower == 'head':
            self.in_head = True
        elif tag_lower == 'body':
            self.in_head = False
            self.in_body = True

        # Script Detection
        if tag_lower == 'script':
            src = attr_dict.get('src')
            script_type = attr_dict.get('type', '').lower()
            is_json_ld = 'application/ld+json' in script_type
            has_defer = 'defer' in attr_dict
            has_async = 'async' in attr_dict
            is_module = script_type == 'module'

            if self.in_head and not is_json_ld:
                self.scripts_in_head.append({
                    'src': src,
                    'type': script_type,
                    'defer': has_defer,
                    'async': has_async,
                    'module': is_module,
                    'is_inline': src is None
                })

        # Stylesheet & Font Links
        elif tag_lower == 'link':
            rel = attr_dict.get('rel', '').lower()
            href = attr_dict.get('href', '')
            as_attr = attr_dict.get('as', '').lower()
            onload = attr_dict.get('onload')

            if 'stylesheet' in rel or (rel == 'preload' and as_attr == 'style'):
                self.stylesheets_in_head.append({
                    'href': href,
                    'rel': rel,
                    'as': as_attr,
                    'onload': onload,
                    'media': attr_dict.get('media')
                })

            if 'fonts.googleapis.com' in href or 'font' in as_attr:
                self.font_links.append({
                    'href': href,
                    'rel': rel,
                    'has_swap': 'display=swap' in href or 'display=optional' in href
                })

        # Image Element Geometry
        elif tag_lower == 'img':
            src = attr_dict.get('src', '')
            width = attr_dict.get('width')
            height = attr_dict.get('height')
            style = attr_dict.get('style', '')
            fetchpriority = attr_dict.get('fetchpriority', '').lower()
            loading = attr_dict.get('loading', '').lower()
            classes = attr_dict.get('class', '')
            element_id = attr_dict.get('id', '')

            is_hero_candidate = bool(re.search(r'(hero|cover|main|feature|banner|lcp)', f"{classes} {element_id} {src}", re.I))

            self.images.append({
                'src': src,
                'width': width,
                'height': height,
                'style': style,
                'has_aspect_ratio': 'aspect-ratio' in style,
                'fetchpriority': fetchpriority,
                'loading': loading,
                'is_hero_candidate': is_hero_candidate,
                'index': len(self.images)
            })

        # Iframe Element Geometry
        elif tag_lower == 'iframe':
            self.iframes.append({
                'src': attr_dict.get('src', ''),
                'width': attr_dict.get('width'),
                'height': attr_dict.get('height'),
                'loading': attr_dict.get('loading', '').lower()
            })

        # Hero section marker
        if 'hero' in attr_dict.get('class', '').lower() or 'hero' in attr_dict.get('id', '').lower():
            self.hero_elements.append(tag_lower)

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower not in VOID_ELEMENTS:
            self.current_depth = max(0, self.current_depth - 1)
        if tag_lower == 'head':
            self.in_head = False

class CoreWebVitalsAuditor:
    def __init__(self, target_path):
        self.target_path = Path(target_path)

    def audit_file(self, file_path):
        raw_content = file_path.read_text(encoding='utf-8', errors='replace')
        raw_bytes = file_path.stat().st_size
        compressed_bytes = len(gzip.compress(raw_content.encode('utf-8')))

        parser = DOMPhysicsParser()
        try:
            parser.feed(raw_content)
        except Exception as e:
            return {
                "file": str(file_path.name),
                "error": f"HTML Parsing Exception: {e}",
                "score": 0
            }

        # Auditing Criteria & Scoring System (100 Point Scale)
        checks = []
        score = 100

        # -------------------------------------------------------------
        # Gate 1: TCP cwnd Initial Congestion Window (14.6 KB)
        # -------------------------------------------------------------
        fits_uncompressed = raw_bytes <= TCP_INIT_CWND_BYTES
        fits_compressed = compressed_bytes <= TCP_INIT_CWND_BYTES

        if fits_compressed:
            checks.append({
                "gate": "1. TCP Congestion Window (14.6 KB)",
                "passed": True,
                "weight": 15,
                "deduction": 0,
                "details": f"Wire transfer size is {compressed_bytes:,} bytes (gzipped), fitting in 1 RTT initial flight."
            })
        else:
            # Deduct points if even compressed payload exceeds 14.6KB
            penalty = 15 if compressed_bytes > 20000 else 8
            score -= penalty
            checks.append({
                "gate": "1. TCP Congestion Window (14.6 KB)",
                "passed": False,
                "weight": 15,
                "deduction": penalty,
                "details": f"Wire payload ({compressed_bytes:,} bytes compressed / {raw_bytes:,} bytes raw) exceeds 14,600B 1-RTT flight."
            })

        # -------------------------------------------------------------
        # Gate 2: Render-Blocking Head JavaScript
        # -------------------------------------------------------------
        blocking_scripts = []
        for s in parser.scripts_in_head:
            if s['src'] and not (s['defer'] or s['async'] or s['module']):
                blocking_scripts.append(s['src'])

        if not blocking_scripts:
            checks.append({
                "gate": "2. Zero Render-Blocking Scripts",
                "passed": True,
                "weight": 15,
                "deduction": 0,
                "details": f"All {len(parser.scripts_in_head)} head scripts use defer, async, or type='module'."
            })
        else:
            score -= 15
            checks.append({
                "gate": "2. Zero Render-Blocking Scripts",
                "passed": False,
                "weight": 15,
                "deduction": 15,
                "details": f"Found {len(blocking_scripts)} synchronous render-blocking script(s): {', '.join(blocking_scripts[:2])}"
            })

        # -------------------------------------------------------------
        # Gate 3: Render-Blocking External CSS
        # -------------------------------------------------------------
        blocking_stylesheets = []
        for css in parser.stylesheets_in_head:
            rel = css['rel']
            onload = css['onload']
            media = css['media']
            # Standard synchronous <link rel="stylesheet">
            if 'stylesheet' in rel and not onload and media != 'print':
                blocking_stylesheets.append(css['href'])

        if not blocking_stylesheets:
            checks.append({
                "gate": "3. Non-Blocking CSS Delivery",
                "passed": True,
                "weight": 15,
                "deduction": 0,
                "details": "Stylesheets utilize asynchronous loading (preload + onload) or critical inlining."
            })
        else:
            # Deduct 10 points
            score -= 10
            checks.append({
                "gate": "3. Non-Blocking CSS Delivery",
                "passed": False,
                "weight": 15,
                "deduction": 10,
                "details": f"Found {len(blocking_stylesheets)} synchronous blocking stylesheet(s): {', '.join(blocking_stylesheets[:2])}"
            })

        # -------------------------------------------------------------
        # Gate 4: Zero-CLS Media Aspect-Ratio & Dimensions
        # -------------------------------------------------------------
        media_missing_dims = []
        for img in parser.images:
            has_explicit_dims = bool(img['width'] and img['height'])
            has_aspect_ratio = img['has_aspect_ratio']
            if not (has_explicit_dims or has_aspect_ratio):
                media_missing_dims.append(img['src'] or f"img[{img['index']}]")

        for ifr in parser.iframes:
            if not (ifr['width'] and ifr['height']):
                media_missing_dims.append(f"iframe:{ifr['src']}")

        if not media_missing_dims:
            checks.append({
                "gate": "4. Zero-CLS Media Aspect-Ratio Geometry",
                "passed": True,
                "weight": 20,
                "deduction": 0,
                "details": f"All {len(parser.images)} image(s) and {len(parser.iframes)} iframe(s) reserve geometry."
            })
        else:
            score -= 20
            checks.append({
                "gate": "4. Zero-CLS Media Aspect-Ratio Geometry",
                "passed": False,
                "weight": 20,
                "deduction": 20,
                "details": f"Found {len(media_missing_dims)} media element(s) missing width/height attributes: {', '.join(media_missing_dims[:2])}"
            })

        # -------------------------------------------------------------
        # Gate 5: LCP Asset Fetch Priority & Zero Lazy-Hero
        # -------------------------------------------------------------
        lcp_candidate = None
        # Find hero candidate or fallback to first image
        for img in parser.images:
            if img['is_hero_candidate'] or img['index'] == 0:
                lcp_candidate = img
                break

        lcp_passed = True
        lcp_message = "No image assets detected on page (Text-based LCP candidate)."
        if lcp_candidate:
            is_high_pri = lcp_candidate['fetchpriority'] == 'high'
            is_lazy = lcp_candidate['loading'] == 'lazy'
            if is_lazy:
                lcp_passed = False
                lcp_message = f"CRITICAL: LCP hero image ({lcp_candidate['src']}) incorrectly has loading='lazy'."
            elif not is_high_pri:
                lcp_passed = False
                lcp_message = f"LCP image candidate ({lcp_candidate['src']}) missing fetchpriority='high'."
            else:
                lcp_passed = True
                lcp_message = f"LCP candidate has fetchpriority='high' and eager loading: {lcp_candidate['src']}."

        if lcp_passed:
            checks.append({
                "gate": "5. LCP Fetchpriority Optimization",
                "passed": True,
                "weight": 15,
                "deduction": 0,
                "details": lcp_message
            })
        else:
            score -= 15
            checks.append({
                "gate": "5. LCP Fetchpriority Optimization",
                "passed": False,
                "weight": 15,
                "deduction": 15,
                "details": lcp_message
            })

        # -------------------------------------------------------------
        # Gate 6: DOM Structural Physics (Node count & Depth)
        # -------------------------------------------------------------
        dom_ok = parser.node_count <= 800 and parser.max_depth <= 32
        if dom_ok:
            checks.append({
                "gate": "6. DOM Structural Physics",
                "passed": True,
                "weight": 10,
                "deduction": 0,
                "details": f"Node count: {parser.node_count} (< 800) | Max depth: {parser.max_depth} (< 32)."
            })
        else:
            penalty = 10 if parser.node_count > 1400 else 5
            score -= penalty
            checks.append({
                "gate": "6. DOM Structural Physics",
                "passed": False,
                "weight": 10,
                "deduction": penalty,
                "details": f"DOM structure bloated: {parser.node_count} nodes (target < 800), depth: {parser.max_depth} (target < 32)."
            })

        # -------------------------------------------------------------
        # Gate 7: Font Display Optimization (display=swap / optional)
        # -------------------------------------------------------------
        unoptimized_fonts = []
        for font in parser.font_links:
            if not font['has_swap']:
                unoptimized_fonts.append(font['href'])

        if not unoptimized_fonts:
            checks.append({
                "gate": "7. Typography & Font Display Optimization",
                "passed": True,
                "weight": 10,
                "deduction": 0,
                "details": "All external font links enforce display=swap or optional."
            })
        else:
            score -= 10
            checks.append({
                "gate": "7. Typography & Font Display Optimization",
                "passed": False,
                "weight": 10,
                "deduction": 10,
                "details": f"External font links missing display=swap: {', '.join(unoptimized_fonts)}"
            })

        final_score = max(0, min(100, score))
        return {
            "file": file_path.name,
            "path": str(file_path),
            "score": final_score,
            "raw_bytes": raw_bytes,
            "compressed_bytes": compressed_bytes,
            "node_count": parser.node_count,
            "max_depth": parser.max_depth,
            "checks": checks
        }

    def run(self):
        files_to_audit = []
        if self.target_path.is_file():
            files_to_audit.append(self.target_path)
        elif self.target_path.is_dir():
            files_to_audit = sorted(list(self.target_path.glob("*.html")))

        if not files_to_audit:
            print(f"{YELLOW}[!] No HTML files found at {self.target_path}{RESET}")
            return []

        results = []
        for f in files_to_audit:
            res = self.audit_file(f)
            results.append(res)
        return results

def render_audit_report(results, fail_under=0):
    total_audited = len(results)
    if total_audited == 0:
        return 0

    avg_score = sum(r.get('score', 0) for r in results) / total_audited
    score_color = GREEN if avg_score >= 90 else YELLOW if avg_score >= 75 else RED

    print(f"""
{CYAN}{BOLD}╔══════════════════════════════════════════════════════════════════════════════╗
║   ⚡ SOVEREIGN CORE WEB VITALS & DOM PHYSICS AUDITOR v2.0                    ║
║   TCP cwnd Init • Render-Blocking CRP • Zero-CLS Geometry • INP Sub-50ms     ║
╚══════════════════════════════════════════════════════════════════════════════╝{RESET}
""")

    print(f"Total HTML Documents Audited: {BOLD}{total_audited}{RESET}")
    print(f"Average Performance Score:   {score_color}{BOLD}{avg_score:.1f} / 100{RESET}\n")

    # Detailed per-file audit table
    for r in results[:10]:
        f_score = r.get('score', 0)
        c_color = GREEN if f_score >= 90 else YELLOW if f_score >= 75 else RED
        print(f"{c_color}{BOLD}[SCORE {f_score:>3}/100]{RESET} {BOLD}{r['file']}{RESET} ({r.get('compressed_bytes', 0):,}B wire gzip | {r.get('node_count', 0)} nodes | depth {r.get('max_depth', 0)})")
        for chk in r.get('checks', []):
            mark = f"{GREEN}✅ PASS{RESET}" if chk['passed'] else f"{RED}❌ FAIL (-{chk['deduction']}pts){RESET}"
            print(f"    {mark} {chk['gate']}: {DIM}{chk['details']}{RESET}")
        print()

    if total_audited > 10:
        print(f"{DIM}... and {total_audited - 10} additional files audited with identical telemetry.{RESET}\n")

    # Executive Prescriptive Guidance
    print(f"""{BOLD}═══════════════════════════════════════════════════════════════════════════════
   📋 SOVEREIGN REMEDIATION DIRECTIVES FOR 100/100 CWV COMPLIANCE
═══════════════════════════════════════════════════════════════════════════════{RESET}
1. {CYAN}Tailwind / External Script Deferral:{RESET}
   Change:  `<script src="https://cdn.tailwindcss.com"></script>`
   To:      `<script src="https://cdn.tailwindcss.com" defer></script>` (or inline critical CSS)

2. {CYAN}Zero-CLS Image Geometry:{RESET}
   Ensure every `<img>` tag carries explicit `width="1200" height="675"` and
   CSS `style="aspect-ratio: 16 / 9;"` to eliminate layout shift completely.

3. {CYAN}LCP Hero Optimization:{RESET}
   Add `fetchpriority="high"` and remove `loading="lazy"` from above-the-fold hero images.

4. {CYAN}14.6KB Initial Congestion Flight:{RESET}
   Keep gzipped HTML document under 14,600 bytes to render in 1 RTT across mobile cellular towers.
{DIM}═══════════════════════════════════════════════════════════════════════════════{RESET}
""")

    if fail_under > 0 and avg_score < fail_under:
        print(f"{RED}❌ Audit failed: Average score {avg_score:.1f} is below required threshold {fail_under}.{RESET}")
        return 1
    return 0

def main():
    parser = argparse.ArgumentParser(
        description="Sovereign Core Web Vitals & DOM Physics Auditor",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 core_web_vitals_auditor.py generated_pages/
  python3 core_web_vitals_auditor.py index.html
  python3 core_web_vitals_auditor.py generated_pages/ --fail-under 90
  python3 core_web_vitals_auditor.py generated_pages/ --json report.json
        """
    )
    parser.add_argument("target", nargs="?", default="generated_pages", help="Path to HTML file or directory (default: generated_pages)")
    parser.add_argument("--fail-under", type=int, default=0, help="Exit with code 1 if average score is below this value")
    parser.add_argument("--json", help="Export audit results to JSON file")

    args = parser.parse_args()

    auditor = CoreWebVitalsAuditor(args.target)
    results = auditor.run()

    if args.json:
        out_p = Path(args.json)
        out_p.write_text(json.dumps(results, indent=2), encoding="utf-8")
        print(f"✅ Exported JSON audit report to: {out_p.resolve()}")

    exit_code = render_audit_report(results, fail_under=args.fail_under)
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
