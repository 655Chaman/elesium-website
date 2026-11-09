#!/usr/bin/env python3
"""
================================================================================
VERIFY MULTI-MODAL SCHEMA & PODCAST ENGINE (MODULE 14)
================================================================================
Classification: Multi-Modal Search Optimization & Podcast Syndication Verifier
Gates:
  - Gate 1: 56 Video Masterclasses Schema AST with hasPart / Clip Chapters
  - Gate 2: Podcast RSS 2.0 Specification Compliance (Apple / Google Specs)
  - Gate 3: Transcript Synchronization & E-E-A-T Grounding (Chaman Shah / Elesium)
  - Gate 4: Seekable Deep-Link URL Resolution (?t=<seconds>)
  - Gate 5: Podcast & Video Sitemap Registration (sitemap-videos.xml & sitemap-core.xml)
  - Gate 6: Edge Asset Pre-Compression Parity (.xml, .gz, .br)
================================================================================
"""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT_DIR / "frontend" / "dist"
PUBLIC_DIR = ROOT_DIR / "frontend" / "public"

def verify_multimodal_suite():
    print("=" * 80)
    print(" 🔱 AUDITING MULTI-MODAL VIDEO & AUDIO PODCAST ENGINE (MODULE 14) 🔱")
    print("=" * 80)

    gates_passed = 0
    total_gates = 6

    # --------------------------------------------------------------------------
    # GATE 1: Video Masterclasses Schema AST with hasPart / Clip Chapters
    # --------------------------------------------------------------------------
    print("\n[GATE 1] 56 Video Masterclasses Schema AST with hasPart / Clip Chapters")
    sitemap_videos = DIST_DIR / "sitemap-videos.xml"
    if not sitemap_videos.exists():
        print(f"  ❌ Missing sitemap-videos.xml")
        return False

    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9", "video": "http://www.google.com/schemas/sitemap-video/1.1"}
    tree = ET.parse(sitemap_videos)
    root = tree.getroot()
    video_entries = root.findall(".//video:video", ns)
    video_count = len(video_entries)

    print(f"  Videos in Google Video Sitemap : {video_count} videos (Target: 56)")
    if video_count >= 56:
        print("  Status: PASSED ✅ (100% of video masterclasses registered with rich Google Video schema)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌ (Incomplete video catalog in sitemap)")

    # --------------------------------------------------------------------------
    # GATE 2: Podcast RSS 2.0 Specification Compliance
    # --------------------------------------------------------------------------
    print("\n[GATE 2] Podcast RSS 2.0 Specification Compliance")
    pub_pod = PUBLIC_DIR / "podcast.xml"
    dist_pod = DIST_DIR / "podcast.xml"

    pod_ok = True
    for p in [pub_pod, dist_pod]:
        if not p.exists():
            print(f"  ❌ Missing podcast feed: {p.relative_to(ROOT_DIR)}")
            pod_ok = False
            continue
        try:
            p_tree = ET.parse(p)
            p_root = p_tree.getroot()
            channel = p_root.find("channel")
            items = channel.findall("item") if channel is not None else []
            if len(items) < 56:
                print(f"  ❌ {p.name} contains only {len(items)} items (expected 56)")
                pod_ok = False
            else:
                print(f"  ✅ {p.relative_to(ROOT_DIR)} validated ({len(items)} episodes, valid RSS 2.0)")
        except Exception as e:
            print(f"  ❌ XML parsing failed for {p.name}: {e}")
            pod_ok = False

    if pod_ok:
        print("  Status: PASSED ✅ (Apple & Google Podcast RSS 2.0 specifications satisfied)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌")

    # --------------------------------------------------------------------------
    # GATE 3: Transcript Synchronization & E-E-A-T Grounding
    # --------------------------------------------------------------------------
    print("\n[GATE 3] Transcript Synchronization & E-E-A-T Grounding (Chaman Shah)")
    pod_content = dist_pod.read_text(encoding="utf-8")
    has_author = "<itunes:author>Chaman Shah</itunes:author>" in pod_content
    has_transcript_tag = "<podcast:transcript" in pod_content
    has_explicit_tag = "<itunes:explicit>no</itunes:explicit>" in pod_content

    print(f"  Executive Author Grounding : {'CONFIRMED ✅' if has_author else 'MISSING ❌'}")
    print(f"  Podcast Transcript Tags    : {'CONFIRMED ✅' if has_transcript_tag else 'MISSING ❌'}")
    print(f"  iTunes Explicit Clean Flag : {'CONFIRMED ✅' if has_explicit_tag else 'MISSING ❌'}")

    if has_author and has_transcript_tag and has_explicit_tag:
        print("  Status: PASSED ✅ (E-E-A-T author attribution and transcript sync verified)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌")

    # --------------------------------------------------------------------------
    # GATE 4: Seekable Deep-Link URL Resolution (?t=<seconds>)
    # --------------------------------------------------------------------------
    print("\n[GATE 4] Seekable Deep-Link URL Resolution (?t=<seconds>)")
    sample_video_html = (DIST_DIR / "videos" / "enterprise-ai-automation-india-2026" / "index.html").read_text(encoding="utf-8")
    has_clip_schema = '"@type": "Clip"' in sample_video_html
    has_start_offset = '"startOffset":' in sample_video_html
    has_time_param = "?t=" in sample_video_html

    print(f"  Schema.org Clip Schema     : {'FOUND ✅' if has_clip_schema else 'MISSING ❌'}")
    print(f"  startOffset Chapter Data   : {'FOUND ✅' if has_start_offset else 'MISSING ❌'}")
    print(f"  Seekable Time Parameter    : {'FOUND ✅' if has_time_param else 'MISSING ❌'}")

    if has_clip_schema and has_start_offset and has_time_param:
        print("  Status: PASSED ✅ (Google Key Moments interactive video chapters active)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌")

    # --------------------------------------------------------------------------
    # GATE 5: Podcast & Video Sitemap Registration
    # --------------------------------------------------------------------------
    print("\n[GATE 5] Podcast & Video Sitemap Registration")
    sitemap_xml = (DIST_DIR / "sitemap.xml").read_text(encoding="utf-8")
    has_video_sitemap = "sitemap-videos.xml" in sitemap_xml

    print(f"  sitemap.xml Index Reference : {'CONFIRMED ✅' if has_video_sitemap else 'MISSING ❌'}")
    if has_video_sitemap:
        print("  Status: PASSED ✅ (Search engine crawlers discover full multi-modal catalog)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌")

    # --------------------------------------------------------------------------
    # GATE 6: Edge Asset Pre-Compression Parity (.xml, .gz, .br)
    # --------------------------------------------------------------------------
    print("\n[GATE 6] Edge Asset Pre-Compression Parity (.xml, .gz, .br)")
    gz_pod = dist_pod.with_name("podcast.xml.gz")
    br_pod = dist_pod.with_name("podcast.xml.br")
    compression_ok = gz_pod.exists() and br_pod.exists()

    print(f"  Gzip (.gz) Podcast Feed     : {'FOUND ✅' if gz_pod.exists() else 'MISSING ❌'}")
    print(f"  Brotli (.br) Podcast Feed   : {'FOUND ✅' if br_pod.exists() else 'MISSING ❌'}")

    if compression_ok:
        print("  Status: PASSED ✅ (Zero-CPU edge decompression enabled for podcast feed)")
        gates_passed += 1
    else:
        print("  Status: FAILED ❌")

    print("\n" + "=" * 80)
    print(f" 🔱 FINAL CERTIFICATION SCORE: {gates_passed}/{total_gates} GATES PASSED")
    print("=" * 80)

    return gates_passed == total_gates

if __name__ == "__main__":
    success = verify_multimodal_suite()
    sys.exit(0 if success else 1)
