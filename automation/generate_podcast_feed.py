#!/usr/bin/env python3
"""
================================================================================
GENERATE PODCAST FEED (MODULE 14) — MULTI-MODAL AUDIO & PODCAST RSS 2.0 ENGINE
================================================================================
Classification: Multi-Modal Search Optimization & Podcast Syndication
Compliance:
  - Apple Podcasts RSS 2.0 Specifications
  - Google Podcasts & YouTube Music RSS Protocol
  - PodcastIndex Namespace 1.0 (podcast:transcript & podcast:chapters)
Generates:
  - frontend/public/podcast.xml
  - frontend/dist/podcast.xml
================================================================================
"""

import sys
import os
import re
import html
import subprocess
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
VIDEOS_TS_PATH = ROOT_DIR / "frontend" / "src" / "data" / "videoMasterclasses.ts"
PUBLIC_DIR = ROOT_DIR / "frontend" / "public"
DIST_DIR = ROOT_DIR / "frontend" / "dist"

def load_videos():
    if not VIDEOS_TS_PATH.exists():
        print(f"Error: {VIDEOS_TS_PATH} not found.")
        return []
    
    content = VIDEOS_TS_PATH.read_text(encoding="utf-8")
    code = content
    code = re.sub(r'export\s+interface[\s\S]*?(?=export\s+const\s+videoMasterclasses)', '', code)
    code = re.sub(r'export\s+const\s+videoMasterclasses:\s*VideoMasterclass\[\]\s*=', 'var videoMasterclasses =', code)
    end_idx = code.find('];')
    if end_idx != -1:
        code = code[:end_idx + 2]
    code += '\nconsole.log(JSON.stringify(videoMasterclasses));\n'
    
    tmp_bridge = ROOT_DIR / "frontend" / "src" / "data" / ".tmp_bridge_podcast.cjs"
    tmp_bridge.write_text(code, encoding="utf-8")
    videos = []
    try:
        res = subprocess.run(["node", str(tmp_bridge)], capture_output=True, text=True, check=True)
        videos = json.loads(res.stdout)
    finally:
        if tmp_bridge.exists():
            tmp_bridge.unlink()
    return videos

def build_podcast_xml(videos) -> str:
    pub_date = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S +0000")
    
    items_xml = []
    for idx, v in enumerate(videos):
        title = html.escape(v.get("title", ""))
        slug = html.escape(v.get("slug", ""))
        summary = html.escape(v.get("executiveSummary", ""))
        duration = html.escape(v.get("duration", "20:00"))
        link = f"https://elesium.online/videos/{slug}/"
        guid = f"elesium-podcast-{slug}"
        audio_url = f"https://elesium.online/audio/{slug}.mp3"
        
        # Convert duration to seconds or MM:SS format
        dur_clean = duration if ":" in duration else "20:00"

        # Format uploadDate to RFC 822
        raw_date = v.get("uploadDate", "2026-10-19")
        try:
            d_obj = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
            ep_date = d_obj.strftime("%a, %d %b %Y %H:%M:%S +0000")
        except Exception:
            ep_date = pub_date

        item_xml = f"""    <item>
      <title>{title}</title>
      <link>{link}</link>
      <guid isPermaLink="false">{guid}</guid>
      <pubDate>{ep_date}</pubDate>
      <description>{summary}</description>
      <enclosure url="{audio_url}" length="24500000" type="audio/mpeg" />
      <itunes:duration>{dur_clean}</itunes:duration>
      <itunes:author>Chaman Shah</itunes:author>
      <itunes:summary>{summary}</itunes:summary>
      <itunes:explicit>no</itunes:explicit>
      <podcast:transcript url="{link}" type="text/html" />
    </item>"""
        items_xml.append(item_xml)

    items_block = "\n".join(items_xml)

    rss = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:podcast="https://podcastindex.org/namespace/1.0"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Elesium Enterprise AI Architecture Masterclasses</title>
    <link>https://elesium.online/videos/</link>
    <atom:link href="https://elesium.online/podcast.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <copyright>© 2026 Elesium Digital Systems Private Limited</copyright>
    <description>Technical engineering breakdowns, sovereign private VPC blueprints, deterministic multi-agent state machines (LangGraph), and audited 90-day ROI case studies across Indian enterprise sectors by Elesium.</description>
    <itunes:author>Chaman Shah</itunes:author>
    <itunes:summary>Technical engineering breakdowns on deterministic multi-agent systems, sovereign private VPC deployments, and production enterprise workflows by Elesium.</itunes:summary>
    <itunes:owner>
      <itunes:name>Chaman Shah</itunes:name>
      <itunes:email>contact@elesium.online</itunes:email>
    </itunes:owner>
    <itunes:category text="Technology">
      <itunes:category text="Tech News" />
    </itunes:category>
    <itunes:image href="https://elesium.online/og-image.png" />
    <itunes:explicit>no</itunes:explicit>
    <lastBuildDate>{pub_date}</lastBuildDate>
{items_block}
  </channel>
</rss>
"""
    return rss

def generate_podcast_feed():
    print("=" * 80)
    print(" 🔱 GENERATING MULTI-MODAL PODCAST RSS FEED (MODULE 14) 🔱")
    print("=" * 80)

    videos = load_videos()
    print(f"[*] Loaded {len(videos)} video masterclasses for audio podcast syndication.")

    rss_xml = build_podcast_xml(videos)

    pub_file = PUBLIC_DIR / "podcast.xml"
    dist_file = DIST_DIR / "podcast.xml"

    pub_file.write_text(rss_xml, encoding="utf-8")
    dist_file.write_text(rss_xml, encoding="utf-8")

    print(f"✅ Generated {pub_file.relative_to(ROOT_DIR)} ({pub_file.stat().st_size:,} bytes, {len(videos)} episodes)")
    print(f"✅ Generated {dist_file.relative_to(ROOT_DIR)} ({dist_file.stat().st_size:,} bytes, {len(videos)} episodes)")

if __name__ == "__main__":
    generate_podcast_feed()
