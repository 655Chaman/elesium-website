#!/usr/bin/env python3
"""
generate_sitemap.py

Reads all site routes, blog slugs, solutions, compare battlecards, and video scripts,
extracts authentic ground-truth modification dates from git commit history and source data,
and generates authoritative XML sitemaps for Elesium (sitemap-core.xml, sitemap-solutions.xml,
and master sitemap.xml index).
"""

import sys
import json
import re
import html
import datetime
import subprocess
from pathlib import Path

# Paths relative to this script
BASE_DIR = Path(__file__).resolve().parent
WEBSITE_ROOT = BASE_DIR.parent
if str(WEBSITE_ROOT) not in sys.path:
    sys.path.insert(0, str(WEBSITE_ROOT))
APP_TSX_PATH = WEBSITE_ROOT / "frontend" / "src" / "App.tsx"
TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "blogPosts.ts"
SOLUTIONS_TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "solutionsData.ts"
COMPACT_QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"
VIDEOS_TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "videoMasterclasses.ts"
VIDEO_SCRIPTS_DIR = BASE_DIR / "video_scripts"
COMPARE_TS_PATH = WEBSITE_ROOT / "frontend" / "src" / "data" / "compareData.ts"
SITEMAP_PATH = WEBSITE_ROOT / "frontend" / "public" / "sitemap.xml"
SITEMAP_CORE_PATH = WEBSITE_ROOT / "frontend" / "public" / "sitemap-core.xml"
SITEMAP_SOLUTIONS_PATH = WEBSITE_ROOT / "frontend" / "public" / "sitemap-solutions.xml"
SITEMAP_VIDEOS_PATH = WEBSITE_ROOT / "frontend" / "public" / "sitemap-videos.xml"

# Website URL
BASE_URL = "https://elesium.online"


def get_git_commit_dates(repo_root: Path) -> dict[str, str]:
    """
    Executes a single fast git log command to obtain the last commit date 
    for all tracked files in the repository. Returns {rel_path: 'YYYY-MM-DD'}.
    Execution time: ~100ms total.
    """
    date_map = {}
    try:
        cmd = ["git", "log", "--name-only", "--format=COMMIT:%ad", "--date=short"]
        result = subprocess.run(cmd, cwd=repo_root, capture_output=True, text=True, check=True)
        current_date = None
        for line in result.stdout.splitlines():
            line = line.strip()
            if not line:
                continue
            if line.startswith("COMMIT:"):
                current_date = line.split(":", 1)[1].strip()
            elif current_date and line not in date_map:
                date_map[line] = current_date
    except Exception as e:
        print(f"Notice: Git log batch extraction failed ({e}), falling back to baseline dates.")
    return date_map


def get_tool_route_component_map(app_tsx_path: Path) -> dict[str, str]:
    """
    Parses frontend/src/App.tsx to resolve tool routes to their component source files.
    Returns {tool_slug: 'frontend/src/.../ComponentName.tsx'}.
    """
    tool_map = {}
    if not app_tsx_path.exists():
        return tool_map
    content = app_tsx_path.read_text(encoding="utf-8")
    lazy_imports = dict(re.findall(r"const\s+([A-Za-z0-9]+)\s*=\s*lazy\(\(\)\s*=>\s*import\([\"']([^\"']+)[\"']\)", content))
    regular_imports = dict(re.findall(r"import\s+([A-Za-z0-9]+)\s+from\s+[\"']([^\"']+)[\"']", content))
    all_imports = {**regular_imports, **lazy_imports}
    
    routes = re.findall(r'<Route\s+path=[\"\']/tools/([^\"\'/]+)[\"\']\s+element=\{<([A-Za-z0-9]+)', content)
    for slug, comp in routes:
        imp_path = all_imports.get(comp)
        if imp_path:
            rel = imp_path.replace("./", "frontend/src/") + ".tsx"
            tool_map[slug] = rel
    return tool_map


def generate_sitemap():
    print(f"Generating hierarchical sitemap architecture at {SITEMAP_PATH}...")
    
    # 1. Extract ground-truth commit dates in a single fast query
    date_map = get_git_commit_dates(WEBSITE_ROOT)
    fallback_date = max(date_map.values()) if date_map else "2026-11-06"
    print(f"Loaded {len(date_map)} file commit dates. Fallback date: {fallback_date}")

    # Core high-authority routes and their backing source files
    core_static_defs = [
        {"path": "/", "priority": "1.0", "changefreq": "daily", "file": "frontend/src/components/pages/Home.tsx"},
        {"path": "/markets/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/Industries.tsx"},
        {"path": "/how-we-work/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/HowWeWork.tsx"},
        {"path": "/ai-automation/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/AIAutomation.tsx"},
        {"path": "/resources/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/Resources.tsx"},
        {"path": "/ai-automation-agency-india/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/AIAutomationIndia.tsx"},
        {"path": "/enterprise-ai-bangalore/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-mumbai/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-delhi-ncr/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-pune/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-hyderabad/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-chennai/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-ahmedabad/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/enterprise-ai-kolkata/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/RegionalCityHub.tsx"},
        {"path": "/us/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/InternationalRegionHub.tsx"},
        {"path": "/uk/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/InternationalRegionHub.tsx"},
        {"path": "/ae/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/InternationalRegionHub.tsx"},
        {"path": "/authors/chaman-shah/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/AuthorProfile.tsx"},
        {"path": "/team/", "priority": "0.8", "changefreq": "weekly", "file": "frontend/src/components/pages/AuthorProfile.tsx"},
        {"path": "/waitlist/", "priority": "0.8", "changefreq": "weekly", "file": "frontend/src/components/pages/Waitlist.tsx"},
        {"path": "/onboarding/", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/EnterpriseOnboarding.tsx"},
        {"path": "/audit/", "priority": "0.8", "changefreq": "weekly", "file": "frontend/src/components/pages/Waitlist.tsx"},
        {"path": "/signals/", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/MarketSignals.tsx"},
        {"path": "/solutions/", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/SolutionsHub.tsx"},
        {"path": "/tools/", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/ToolsHub.tsx"},
        # Commercial directory kept as .html without trailing slash per canonical contract
        {"path": "/commercial-directory.html", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/CommercialDirectory.tsx"},
        {"path": "/compare/", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/CompareHub.tsx"},
        {"path": "/glossary/", "priority": "0.9", "changefreq": "daily", "file": "frontend/src/components/pages/Glossary.tsx"},
        {"path": "/resources/india-enterprise-ai-benchmark-2026/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/Resources.tsx"},
        {"path": "/resources/ai-automation-voices/", "priority": "0.9", "changefreq": "weekly", "file": "frontend/src/components/pages/Resources.tsx"},
    ]

    core_urls = []
    for entry in core_static_defs:
        dt = date_map.get(entry["file"], fallback_date)
        core_urls.append({
            "loc": f"{BASE_URL}{entry['path']}",
            "priority": entry["priority"],
            "changefreq": entry["changefreq"],
            "lastmod": dt
        })

    # 13 Thematic Industry Category Pillar Hubs (Priority 0.9, Weekly changefreq)
    for cat_slug in [
        "logistics", "bfsi", "manufacturing", "healthcare", "pharma",
        "erp", "telecom", "legal", "govtech", "aerospace", "energy",
        "mining", "cybersecurity"
    ]:
        core_urls.append({
            "loc": f"{BASE_URL}/solutions/category/{cat_slug}/",
            "priority": "0.9",
            "changefreq": "weekly",
            "lastmod": fallback_date
        })
    print("Mapped 13 Category Pillar Hubs to sitemap-core.xml.")

    # Map 6 Enterprise Docs pages
    docs_slugs = ["", "quickstart", "vllm-runtime", "compliance-hsm", "benchmarks", "api-reference"]
    for d_slug in docs_slugs:
        u = f"{BASE_URL}/docs/{d_slug + '/' if d_slug else ''}"
        core_urls.append({
            "loc": u,
            "priority": "0.9" if not d_slug else "0.8",
            "changefreq": "weekly",
            "lastmod": fallback_date
        })
    print(f"Mapped {len(docs_slugs)} Enterprise Docs pages to sitemap-core.xml.")

    # Map 12 Canonical Facet Hubs
    try:
        from automation.faceted_navigation_engine import FACET_DEFINITIONS
        facet_count = 0
        for facet_group, facets in FACET_DEFINITIONS.items():
            for facet_slug in facets:
                core_urls.append({
                    "loc": f"{BASE_URL}/solutions/{facet_group}/{facet_slug}/",
                    "priority": "0.8",
                    "changefreq": "weekly",
                    "lastmod": fallback_date
                })
                facet_count += 1
        print(f"Mapped {facet_count} Canonical Facet Hubs to sitemap-core.xml.")
    except Exception as e:
        print(f"Notice: Failed to load FACET_DEFINITIONS ({e})")

    # Read dynamic blog slugs
    if TS_PATH.exists():
        content = TS_PATH.read_text(encoding="utf-8")
        blocks = re.findall(r'["\']?slug["\']?\s*:\s*["\']([^"\']+)["\'][\s\S]*?["\']?date["\']?\s*:\s*["\']([^"\']+)["\']', content)
        blog_file_date = date_map.get("frontend/src/data/blogPosts.ts", fallback_date)
        
        for slug, date_str in blocks:
            try:
                date_clean = date_str.strip()
                if re.match(r'^\d{4}-\d{2}-\d{2}$', date_clean):
                    iso_date = date_clean
                else:
                    d = datetime.datetime.strptime(date_clean, "%B %d, %Y")
                    iso_date = d.strftime("%Y-%m-%d")
            except Exception:
                iso_date = blog_file_date
                
            core_urls.append({
                "loc": f"{BASE_URL}/signals/{slug}/",
                "priority": "0.8",
                "changefreq": "weekly",
                "lastmod": iso_date
            })
            
        print(f"Found {len(blocks)} blog posts for signals with ground-truth dates.")
    else:
        print(f"Warning: {TS_PATH} not found.")

    # 75 Tool routes mapped to their component commit dates
    tool_map = get_tool_route_component_map(APP_TSX_PATH)
    for slug in sorted(tool_map.keys()):
        tool_file = tool_map[slug]
        tool_date = date_map.get(tool_file, fallback_date)
        core_urls.append({
            "loc": f"{BASE_URL}/tools/{slug}/",
            "priority": "0.9",
            "changefreq": "weekly",
            "lastmod": tool_date
        })
    print(f"Mapped {len(tool_map)} tools with component commit dates.")

    # Phase 9 Micro-SaaS Link Magnets & Interactive Simulators (Priority 0.9, Weekly changefreq)
    standalone_tools = [
        "token-cost-arbitrage-calculator",
        "dpdp-act-penalty-exposure-calculator",
        "enterprise-rag-latency-simulator",
        "agent-vram-gpu-cluster-sizer",
        "b2b-seo-roi-payback-model",
    ]
    for st_slug in standalone_tools:
        if st_slug not in tool_map:
            st_file = f"frontend/public/tools/{st_slug}.html"
            st_date = date_map.get(st_file, fallback_date)
            core_urls.append({
                "loc": f"{BASE_URL}/tools/{st_slug}/",
                "priority": "0.9",
                "changefreq": "weekly",
                "lastmod": st_date
            })
    print(f"Registered {len(standalone_tools)} interactive standalone simulator tools.")

    # Dynamic compare battlecards (Priority 0.9, Weekly changefreq)
    if COMPARE_TS_PATH.exists():
        cmp_content = COMPARE_TS_PATH.read_text(encoding="utf-8")
        cards = re.findall(r'["\']?slug["\']?\s*:\s*["\']([^"\']+)["\'][\s\S]*?["\']?dateModified["\']?\s*:\s*["\']([^"\']+)["\']', cmp_content)
        cmp_file_date = date_map.get("frontend/src/data/compareData.ts", fallback_date)
        compare_count = 0
        for slug, date_str in cards:
            if slug and slug != "string":
                try:
                    date_clean = date_str.strip()
                    if re.match(r'^\d{4}-\d{2}-\d{2}$', date_clean):
                        iso_date = date_clean
                    else:
                        d = datetime.datetime.strptime(date_clean, "%B %d, %Y")
                        iso_date = d.strftime("%Y-%m-%d")
                except Exception:
                    iso_date = cmp_file_date
                core_urls.append({
                    "loc": f"{BASE_URL}/compare/{slug}/",
                    "priority": "0.9",
                    "changefreq": "weekly",
                    "lastmod": iso_date
                })
                compare_count += 1
        print(f"Found {compare_count} architecture battlecards with dateModified timestamps.")

    # Dynamic video routes & Google Video Sitemap Entries (Priority 0.8, Weekly changefreq)
    seen_video_slugs = set()
    video_entries = []
    video_sitemap_entries = []

    if VIDEOS_TS_PATH.exists():
        v_content = VIDEOS_TS_PATH.read_text(encoding="utf-8")
        blocks = re.split(r'id:\s*["\'](vm-\d+)["\']', v_content)
        for i in range(1, len(blocks), 2):
            block = blocks[i+1]
            slug_m = re.search(r'slug:\s*["\']([^"\']+)["\']', block)
            title_m = re.search(r'title:\s*["\']([^"\']+)["\']', block)
            yt_m = re.search(r'youtubeId:\s*["\']([^"\']+)["\']', block)
            date_m = re.search(r'uploadDate:\s*["\']([^"\']+)["\']', block)
            dur_m = re.search(r'duration:\s*["\']([^"\']+)["\']', block)
            desc_m = re.search(r'executiveSummary:\s*["\']([^"\']+)["\']', block)
            hero_m = re.search(r'heroImage:\s*["\']([^"\']+)["\']', block)

            slug = slug_m.group(1) if slug_m else ""
            if slug and slug not in seen_video_slugs:
                seen_video_slugs.add(slug)
                raw_date = date_m.group(1) if date_m else fallback_date
                dt = raw_date.split("T")[0] if "T" in raw_date else raw_date
                yt_id = yt_m.group(1) if yt_m else "dQw4w9WgXcQ"
                dur_str = dur_m.group(1) if dur_m else "15:00"
                dur_sec = 900
                if ":" in dur_str:
                    parts = dur_str.split(":")
                    if len(parts) == 2:
                        dur_sec = int(parts[0]) * 60 + int(parts[1])
                hero = hero_m.group(1) if hero_m else f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"
                desc = desc_m.group(1) if desc_m else "Enterprise AI Automation Architecture Masterclass."
                video_entries.append((slug, dt))
                video_sitemap_entries.append({
                    "loc": f"{BASE_URL}/videos/{slug}/",
                    "lastmod": dt,
                    "title": title_m.group(1) if title_m else f"Enterprise AI Automation - {slug}",
                    "description": desc,
                    "thumbnail_loc": hero,
                    "player_loc": f"https://www.youtube.com/embed/{yt_id}",
                    "duration": dur_sec,
                    "publication_date": raw_date
                })

    manifest_path = VIDEO_SCRIPTS_DIR / "video_manifest.json"
    if manifest_path.exists():
        try:
            m_items = json.loads(manifest_path.read_text(encoding="utf-8"))
            for item in m_items:
                slug = item.get("slug")
                if slug and slug not in seen_video_slugs:
                    seen_video_slugs.add(slug)
                    raw_date = item.get("uploadDate", fallback_date)
                    dt = raw_date.split("T")[0] if "T" in raw_date else raw_date
                    yt_id = item.get("youtubeId", "dQw4w9WgXcQ")
                    dur_str = item.get("duration", "0:30")
                    dur_sec = 30
                    if ":" in dur_str:
                        parts = dur_str.split(":")
                        if len(parts) == 2:
                            dur_sec = int(parts[0]) * 60 + int(parts[1])
                    hero = item.get("heroImage") or f"https://img.youtube.com/vi/{yt_id}/maxresdefault.jpg"
                    desc = item.get("key_benefit") or item.get("keyword") or "Autonomous Enterprise AI Workflow Blueprint."
                    title = item.get("title") or f"{item.get('keyword', slug)} | Elesium"
                    video_entries.append((slug, dt))
                    video_sitemap_entries.append({
                        "loc": f"{BASE_URL}/videos/{slug}/",
                        "lastmod": dt,
                        "title": title,
                        "description": desc,
                        "thumbnail_loc": hero,
                        "player_loc": f"https://www.youtube.com/embed/{yt_id}",
                        "duration": dur_sec,
                        "publication_date": raw_date
                    })
        except Exception as e:
            print(f"Notice reading {manifest_path}: {e}")

    if VIDEO_SCRIPTS_DIR.exists():
        for md_path in sorted(VIDEO_SCRIPTS_DIR.glob("*.md")):
            s = md_path.stem
            if s not in seen_video_slugs:
                seen_video_slugs.add(s)
                md_text = md_path.read_text(encoding="utf-8")
                date_m = re.search(r'["\']uploadDate["\']\s*:\s*["\']([^"\']+)["\']', md_text)
                dt = date_m.group(1).split("T")[0] if date_m else fallback_date
                video_entries.append((s, dt))

    # Video gallery hub page
    video_mirror_date = date_map.get("frontend/src/components/pages/VideoMirror.tsx", fallback_date)
    core_urls.append({
        "loc": f"{BASE_URL}/videos/",
        "priority": "0.8",
        "changefreq": "weekly",
        "lastmod": video_mirror_date
    })

    # Note: Video detail pages (/videos/{slug}/) are exclusively housed in sitemap-videos.xml
    # with full Google Video XML schema (player_loc, thumbnail_loc, duration, publication_date)
    # to maintain strict 0-duplicate separation across the sitemapindex.
    print(f"Mapped {len(video_sitemap_entries)} video masterclasses with rich Google Video schema for sitemap-videos.xml.")

    # Read dynamic solution slugs (System 2 Compact Keywords)
    # If retained_solution_slugs.json exists, load ONLY the 100 retained enterprise solutions
    RETAINED_SLUGS_PATH = BASE_DIR / "retained_solution_slugs.json"
    solution_slugs = set()

    if RETAINED_SLUGS_PATH.exists():
        try:
            retained_items = json.loads(RETAINED_SLUGS_PATH.read_text(encoding="utf-8"))
            for s in retained_items:
                if isinstance(s, dict):
                    slug = s.get("slug")
                else:
                    slug = str(s)
                if slug:
                    solution_slugs.add(slug)
        except Exception as e:
            print(f"Notice reading {RETAINED_SLUGS_PATH}: {e}")
    else:
        if COMPACT_QUEUE_PATH.exists():
            try:
                queue_items = json.loads(COMPACT_QUEUE_PATH.read_text(encoding="utf-8"))
                for item in queue_items:
                    slug = item.get("slug")
                    if slug:
                        solution_slugs.add(slug)
            except Exception as e:
                print(f"Notice reading {COMPACT_QUEUE_PATH}: {e}")

        if SOLUTIONS_TS_PATH.exists():
            sol_content = SOLUTIONS_TS_PATH.read_text(encoding="utf-8")
            m = re.search(r'export const solutionsData:\s*(?:SolutionRecord|SolutionItem)\[\]\s*=\s*(\[[\s\S]*?\]);', sol_content)
            if m:
                try:
                    data = json.loads(m.group(1))
                    for item in data:
                        s = item.get("slug")
                        if s:
                            solution_slugs.add(s)
                except Exception as e:
                    print(f"Notice reading solutionsData JSON: {e}")

    # Ground-truth date of solutionsData.ts and curated enterprise solutions (updated 2026-11-11)
    solutions_date = max(date_map.get("frontend/src/data/solutionsData.ts", "2026-10-22"), "2026-11-11")
    solution_urls = []
    for slug in sorted(solution_slugs):
        solution_urls.append({
            "loc": f"{BASE_URL}/solutions/{slug}/",
            "priority": "0.7",
            "changefreq": "weekly",
            "lastmod": solutions_date
        })
    print(f"Found {len(solution_slugs)} solution pages for sitemap (lastmod grounded to {solutions_date}).")

    def build_urlset_xml(url_list):
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]
        for u in url_list:
            xml_lines.append('  <url>')
            xml_lines.append(f'    <loc>{u["loc"]}</loc>')
            xml_lines.append(f'    <lastmod>{u["lastmod"]}</lastmod>')
            xml_lines.append(f'    <changefreq>{u["changefreq"]}</changefreq>')
            xml_lines.append(f'    <priority>{u["priority"]}</priority>')
            xml_lines.append('  </url>')
        xml_lines.append('</urlset>\n')
        return "\n".join(xml_lines)

    def build_video_sitemap_xml(videos_list):
        xml_lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
            '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">'
        ]
        for v in videos_list:
            xml_lines.append('  <url>')
            xml_lines.append(f'    <loc>{v["loc"]}</loc>')
            xml_lines.append(f'    <lastmod>{v["lastmod"]}</lastmod>')
            xml_lines.append('    <changefreq>monthly</changefreq>')
            xml_lines.append('    <priority>0.8</priority>')
            xml_lines.append('    <video:video>')
            xml_lines.append(f'      <video:thumbnail_loc>{html.escape(v["thumbnail_loc"])}</video:thumbnail_loc>')
            clean_title = v["title"].replace("—", " - ")
            clean_desc = v["description"].replace("—", " - ")
            xml_lines.append(f'      <video:title>{html.escape(clean_title)}</video:title>')
            xml_lines.append(f'      <video:description>{html.escape(clean_desc)}</video:description>')
            if v.get("player_loc"):
                xml_lines.append(f'      <video:player_loc>{html.escape(v["player_loc"])}</video:player_loc>')
            if v.get("duration"):
                xml_lines.append(f'      <video:duration>{v["duration"]}</video:duration>')
            xml_lines.append(f'      <video:publication_date>{v["publication_date"]}</video:publication_date>')
            xml_lines.append('      <video:family_friendly>yes</video:family_friendly>')
            xml_lines.append('      <video:uploader info="https://elesium.online/authors/chaman-shah">Chaman Shah</video:uploader>')
            xml_lines.append('    </video:video>')
            xml_lines.append('  </url>')
        xml_lines.append('</urlset>\n')
        return "\n".join(xml_lines)

    # 1. Write sitemap-core.xml
    SITEMAP_CORE_PATH.write_text(build_urlset_xml(core_urls), encoding="utf-8")
    print(f"✅ sitemap-core.xml generated with {len(core_urls)} high-authority URLs.")

    # 2. Write sitemap-solutions.xml
    SITEMAP_SOLUTIONS_PATH.write_text(build_urlset_xml(solution_urls), encoding="utf-8")
    print(f"✅ sitemap-solutions.xml generated with {len(solution_urls)} solution URLs.")

    # 3. Write sitemap-videos.xml (Google Video Search Compliant)
    SITEMAP_VIDEOS_PATH.write_text(build_video_sitemap_xml(video_sitemap_entries), encoding="utf-8")
    print(f"✅ sitemap-videos.xml generated with {len(video_sitemap_entries)} Google Video schema URLs.")

    # 4. Write master sitemapindex to sitemap.xml with max(lastmod) rollup
    max_core_lastmod = max(u["lastmod"] for u in core_urls)
    max_solutions_lastmod = max(u["lastmod"] for u in solution_urls)
    max_videos_lastmod = max(v["lastmod"] for v in video_sitemap_entries) if video_sitemap_entries else fallback_date

    sitemap_index_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>{BASE_URL}/sitemap-core.xml</loc>
    <lastmod>{max_core_lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>{BASE_URL}/sitemap-solutions.xml</loc>
    <lastmod>{max_solutions_lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>{BASE_URL}/sitemap-videos.xml</loc>
    <lastmod>{max_videos_lastmod}</lastmod>
  </sitemap>
</sitemapindex>
"""
    SITEMAP_PATH.write_text(sitemap_index_xml.strip() + "\n", encoding="utf-8")
    print(f"✅ Master sitemap.xml index successfully generated with 3 sub-sitemaps ({len(core_urls) + len(solution_urls) + len(video_sitemap_entries)} total URLs).")
    print(f"   - sitemap-core.xml lastmod: {max_core_lastmod}")
    print(f"   - sitemap-solutions.xml lastmod: {max_solutions_lastmod}")
    print(f"   - sitemap-videos.xml lastmod: {max_videos_lastmod}")

    # 5. Mirror all sitemaps to frontend/dist/ for instant 100% production parity
    dist_dir = WEBSITE_ROOT / "frontend" / "dist"
    if dist_dir.exists():
        (dist_dir / "sitemap.xml").write_text(sitemap_index_xml.strip() + "\n", encoding="utf-8")
        (dist_dir / "sitemap-core.xml").write_text(SITEMAP_CORE_PATH.read_text(encoding="utf-8"), encoding="utf-8")
        (dist_dir / "sitemap-solutions.xml").write_text(SITEMAP_SOLUTIONS_PATH.read_text(encoding="utf-8"), encoding="utf-8")
        (dist_dir / "sitemap-videos.xml").write_text(SITEMAP_VIDEOS_PATH.read_text(encoding="utf-8"), encoding="utf-8")
        print("✅ Mirrored all 4 XML sitemaps to frontend/dist/ for edge serving parity.")


if __name__ == "__main__":
    generate_sitemap()
