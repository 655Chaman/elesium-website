#!/usr/bin/env python3
"""
automation/inject_noindex_pruned.py

Injects <meta name="robots" content="noindex, follow"> and <meta name="googlebot" content="noindex, follow">
into all pre-rendered HTML files for pruned solution slugs in frontend/dist/solutions/ and frontend/public/solutions/.
Also updates <title> to '410 Gone | Content Retired | Elesium' and re-compresses .gz and .br assets.
"""

import json
import re
import gzip
import brotli
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

ROOT_DIR = Path(__file__).resolve().parent.parent
PRUNED_FILE = ROOT_DIR / "automation" / "pruned_solution_slugs.json"
DIST_SOL = ROOT_DIR / "frontend" / "dist" / "solutions"
PUB_SOL = ROOT_DIR / "frontend" / "public" / "solutions"

ROBOTS_REGEX1 = re.compile(r'<meta\s+[^>]*name=["\'](?:robots|googlebot)["\'][^>]*>', re.I)
ROBOTS_REGEX2 = re.compile(r'<meta\s+[^>]*content=[^>]*name=["\'](?:robots|googlebot)["\'][^>]*>', re.I)
TITLE_REGEX = re.compile(r'<title>.*?</title>', re.I | re.DOTALL)
HEAD_REGEX = re.compile(r'(<head[^>]*>)', re.I)


REPLACEMENT_ROOT_410 = '''<div id="root">
  <div id="prerendered-solution" style="max-width:48rem;margin:4rem auto;padding:2rem 1rem;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:600;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);margin-bottom:1.5rem;">
      HTTP 410 &bull; Content Retired
    </div>
    <h1 style="font-size:2.5rem;font-weight:800;letter-spacing:-0.025em;margin-bottom:1rem;color:#111;">
      410 Gone
    </h1>
    <p style="font-size:1.125rem;color:#6b7280;margin-bottom:2rem;line-height:1.625;">
      This programmatic specification has been permanently retired under Elesium's Algorithmic Quality &amp; Enterprise Architecture Curation mandate. The requested resource is no longer indexed or served.
    </p>
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem;">
      <a href="/solutions/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;background:#2563eb;color:#fff;font-weight:500;text-decoration:none;">
        Explore 100 Enterprise Architectures &rarr;
      </a>
      <a href="/" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;border-radius:0.75rem;background:rgba(0,0,0,0.05);color:#111;border:1px solid rgba(0,0,0,0.1);font-weight:500;text-decoration:none;">
        Return Home
      </a>
    </div>
  </div>
</div>'''


def update_html_content(content: str) -> str:
    content = TITLE_REGEX.sub("<title>410 Gone | Content Retired | Elesium</title>", content, count=1)
    content = re.sub(r'<meta\s+name=[\'\"]description[\'\"].*?>',
                     '<meta name="description" content="This programmatic specification has been permanently retired under Elesium\'s Algorithmic Quality & Enterprise Architecture Curation mandate." />',
                     content, count=1, flags=re.I)
    content = re.sub(r'<link\s+rel=[\'\"]canonical[\'\"].*?>', '', content, flags=re.I)
    content = ROBOTS_REGEX1.sub("", content)
    content = ROBOTS_REGEX2.sub("", content)
    new_tags = '\n  <meta name="robots" content="noindex, follow" />\n  <meta name="googlebot" content="noindex, follow" />'
    content = HEAD_REGEX.sub(r"\1" + new_tags, content, count=1)
    content = re.sub(r'<meta\s+property=[\'\"]og:title[\'\"].*?>', '<meta property="og:title" content="410 Gone | Content Retired | Elesium" />', content, flags=re.I)
    content = re.sub(r'<meta\s+property=[\'\"]og:description[\'\"].*?>', '<meta property="og:description" content="Content Retired." />', content, flags=re.I)
    content = re.sub(r'<meta\s+name=[\'\"]twitter:title[\'\"].*?>', '<meta name="twitter:title" content="410 Gone | Content Retired | Elesium" />', content, flags=re.I)
    content = re.sub(r'<meta\s+name=[\'\"]twitter:description[\'\"].*?>', '<meta name="twitter:description" content="Content Retired." />', content, flags=re.I)
    content = re.sub(r'<script\s+id=[\'\"]__SOLUTION_DATA__[\'\"].*?</script>', '', content, flags=re.I | re.DOTALL)
    content = re.sub(r'<script\s+type=[\'\"]application/ld\+json[\'\"].*?</script>', '', content, flags=re.I | re.DOTALL)
    content = re.sub(r'<div id="root">[\s\S]*?(?=<footer|\s*<script type="module"|\s*</body>)', REPLACEMENT_ROOT_410 + '\n', content, count=1)
    return content


def process_slug(slug: str) -> int:
    count = 0
    # 1. dist/solutions/{slug}/index.html
    p1 = DIST_SOL / slug / "index.html"
    if p1.exists():
        text = p1.read_text(encoding="utf-8", errors="ignore")
        new_text = update_html_content(text)
        p1.write_text(new_text, encoding="utf-8")
        b = new_text.encode("utf-8")
        gz_p = DIST_SOL / slug / "index.html.gz"
        br_p = DIST_SOL / slug / "index.html.br"
        if gz_p.exists():
            gz_p.write_bytes(gzip.compress(b, compresslevel=9))
        if br_p.exists():
            br_p.write_bytes(brotli.compress(b, quality=9))
        count += 1

    # 2. dist/solutions/{slug}.html
    p2 = DIST_SOL / f"{slug}.html"
    if p2.exists():
        text = p2.read_text(encoding="utf-8", errors="ignore")
        new_text = update_html_content(text)
        p2.write_text(new_text, encoding="utf-8")
        b = new_text.encode("utf-8")
        gz_p2 = DIST_SOL / f"{slug}.html.gz"
        br_p2 = DIST_SOL / f"{slug}.html.br"
        if gz_p2.exists():
            gz_p2.write_bytes(gzip.compress(b, compresslevel=9))
        if br_p2.exists():
            br_p2.write_bytes(brotli.compress(b, quality=9))
        count += 1

    # 3. public/solutions/{slug}/index.html
    p3 = PUB_SOL / slug / "index.html"
    if p3.exists():
        text = p3.read_text(encoding="utf-8", errors="ignore")
        new_text = update_html_content(text)
        p3.write_text(new_text, encoding="utf-8")
        count += 1

    return count


def main():
    if not PRUNED_FILE.exists():
        raise FileNotFoundError(f"Pruned slugs file not found: {PRUNED_FILE}")

    with open(PRUNED_FILE, "r", encoding="utf-8") as f:
        pruned_slugs = json.load(f)

    print(f"Injecting noindex, follow into {len(pruned_slugs)} pruned solution pages...")
    with ThreadPoolExecutor(max_workers=16) as executor:
        results = list(executor.map(process_slug, pruned_slugs))

    print(f"Successfully processed {len(pruned_slugs)} slugs across {sum(results)} total HTML files.")


if __name__ == "__main__":
    main()
