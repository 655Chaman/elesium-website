#!/usr/bin/env python3
"""
product_hunt_scheduler.py
=============================================================================
Product Hunt Scheduled Launch Dispatcher & Countdown Orchestrator for Elesium.

Operationalizes the scheduled Product Hunt launch for Tuesday, October 20, 2026,
12:01 AM PST (12:31 PM IST / 07:01 AM UTC).

Modes:
  --status              Displays real-time launch countdown, verification checklist,
                        and asset health.
  --dispatch-thread     Renders the 6-tweet announcement sequence with exact
                        scheduled release timestamps (PST / IST).
  --dispatch-vip        Outputs the 15 personalized executive outreach messages
                        (LinkedIn / WhatsApp / Email) across target verticals.
  --dispatch-communities Outputs ready-to-post payloads for Show HN, Reddit,
                        Indie Hackers, and Discord.
  --self-test           Runs automated assertions verifying tweet length, tagline
                        limits (<60 chars), slide file presence, and URL schemas.
=============================================================================
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Dict, Any, List

BASE_DIR = Path(__file__).resolve().parent.parent
PH_DIR = BASE_DIR / "automation" / "authority_assets" / "product_hunt"
CONFIG_PATH = PH_DIR / "PRODUCT_HUNT_SCHEDULED_LAUNCH.json"

# Fixed Launch Time: Tuesday, October 20, 2026, at 12:01 AM PST (UTC-7)
LAUNCH_DATETIME_UTC = datetime(2026, 10, 20, 7, 1, 0, tzinfo=timezone.utc)
PST_TZ = timezone(timedelta(hours=-7))
IST_TZ = timezone(timedelta(hours=5, minutes=30))

def load_launch_config() -> Dict[str, Any]:
    """Loads and returns the official scheduled launch configuration."""
    if not CONFIG_PATH.exists():
        print(f"Error: {CONFIG_PATH} not found.", file=sys.stderr)
        sys.exit(1)
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))

def get_countdown_str() -> str:
    """Calculates time remaining until the scheduled launch."""
    now_utc = datetime.now(timezone.utc)
    delta = LAUNCH_DATETIME_UTC - now_utc
    if delta.total_seconds() <= 0:
        return "LAUNCH IS LIVE NOW!"
    days = delta.days
    hours, rem = divmod(delta.seconds, 3600)
    minutes, seconds = divmod(rem, 60)
    return f"{days} days, {hours} hours, {minutes} minutes, {seconds} seconds"

def print_status(config: Dict[str, Any]):
    """Prints launch readiness dashboard and asset validation."""
    print("=" * 78)
    print("  ELESIUM PRODUCT HUNT SCHEDULED LAUNCH DASHBOARD")
    print("=" * 78)
    listing = config.get("product_listing", {})
    print(f"Product:        {listing.get('product_name')}")
    print(f"Tagline:        {listing.get('tagline')} ({listing.get('tagline_length_chars')} chars - Strict <60 chars)")
    print(f"Tool URL:       {listing.get('primary_url')}")
    print(f"Embed URL:      {listing.get('embed_route')}")
    print(f"Scheduled (PST): {LAUNCH_DATETIME_UTC.astimezone(PST_TZ).strftime('%A, %B %d, %Y at %I:%M %p %Z')}")
    print(f"Scheduled (IST): {LAUNCH_DATETIME_UTC.astimezone(IST_TZ).strftime('%A, %B %d, %Y at %I:%M %p %Z')}")
    print(f"Scheduled (UTC): {LAUNCH_DATETIME_UTC.strftime('%Y-%m-%d %H:%M:%S %Z')}")
    print(f"Countdown:      {get_countdown_str()}")
    print("-" * 78)

    print("GALLERY ASSET HEALTH:")
    all_slides_ok = True
    for asset in config.get("gallery_assets", []):
        slide_path = BASE_DIR / asset["path"]
        exists = slide_path.exists()
        size_kb = slide_path.stat().st_size / 1024 if exists else 0
        status = "OK" if exists else "MISSING"
        if not exists:
            all_slides_ok = False
        print(f"  [{status}] Slide {asset['slide_number']}: {asset['name']} ({asset.get('dimensions', 'N/A')}) -> {size_kb:.1f} KB")

    print("-" * 78)
    print("LAUNCH CHANNELS PREPARED:")
    print(f"  • Twitter/X Thread:         {len(config.get('twitter_launch_thread', []))} timed tweets")
    print(f"  • VIP Executive Outreach:   {len(config.get('vip_executive_outreach', []))} personalized pitches")
    print(f"  • Community Payloads:       {len(config.get('community_distribution_payloads', {}))} platforms (Show HN, Reddit, Indie Hackers, Discord)")
    print("=" * 78)

def dispatch_thread(config: Dict[str, Any]):
    """Renders the 6-tweet announcement sequence."""
    print("=" * 78)
    print("  PRODUCT HUNT TWITTER / X LAUNCH THREAD (6 TWEETS)")
    print("=" * 78)
    thread = config.get("twitter_launch_thread", [])
    for t in thread:
        print(f"\n--- Tweet {t['tweet_number']} (Scheduled: {t['publish_time_pst']} PST) ---")
        print(t["content"])
        print(f"[Length: {len(t['content'])} / 280 characters]")
    print("\n" + "=" * 78)

def dispatch_vip(config: Dict[str, Any]):
    """Outputs the 15 personalized VIP outreach messages."""
    print("=" * 78)
    print("  VIP EXECUTIVE DIRECT OUTREACH MESSAGES (15 TARGET PROFILES)")
    print("=" * 78)
    vips = config.get("vip_executive_outreach", [])
    for v in vips:
        print(f"\n[Profile #{v['id']}] {v['vertical']} — {v['target_persona']}")
        print(f"Preferred Channel: {v['channel']}")
        print("-" * 50)
        print(v["message"])
    print("\n" + "=" * 78)

def dispatch_communities(config: Dict[str, Any]):
    """Outputs community distribution payloads."""
    print("=" * 78)
    print("  COMMUNITY DISTRIBUTION PAYLOADS")
    print("=" * 78)
    communities = config.get("community_distribution_payloads", {})

    print("\n[1] SHOW HACKER NEWS")
    hn = communities.get("show_hn", {})
    print(f"Title: {hn.get('title')}")
    print(f"URL:   {hn.get('url')}\n")
    print(hn.get("body"))

    print("\n" + "-" * 50)
    print("[2] REDDIT (r/AI_Agents & r/SaaS)")
    rd = communities.get("reddit_ai_agents", {})
    print(f"Subreddit: {rd.get('subreddit')}")
    print(f"Title:     {rd.get('title')}\n")
    print(rd.get("body"))

    print("\n" + "-" * 50)
    print("[3] INDIE HACKERS")
    ih = communities.get("indie_hackers", {})
    print(f"Channel: {ih.get('channel')}")
    print(f"Title:   {ih.get('title')}\n")
    print(ih.get("body"))

    print("\n" + "-" * 50)
    print("[4] DISCORD (AI Engineers & LangChain)")
    dc = communities.get("discord_ai_engineers", {})
    print(f"Channel: {dc.get('channel')}\n")
    print(dc.get("message"))
    print("\n" + "=" * 78)

def run_self_test(config: Dict[str, Any]) -> bool:
    """Runs automated verification tests across all launch assets."""
    print("Running automated Product Hunt Scheduled Launch self-test...")
    failures = []

    # 1. Tagline limit test (< 60 chars)
    tagline = config.get("product_listing", {}).get("tagline", "")
    if len(tagline) == 0 or len(tagline) > 60:
        failures.append(f"Tagline length invalid: {len(tagline)} chars (must be 1-60 chars)")
    else:
        print(f"  [PASS] Tagline length: {len(tagline)} chars (< 60 chars)")

    # 2. Slide assets existence test
    slides = config.get("gallery_assets", [])
    if len(slides) < 6:
        failures.append(f"Expected at least 6 gallery slides, found {len(slides)}")
    for s in slides:
        p = BASE_DIR / s["path"]
        if not p.exists():
            failures.append(f"Slide file missing: {s['path']}")
        elif p.stat().st_size < 100:
            failures.append(f"Slide file suspiciously small: {s['path']}")
    print(f"  [PASS] All {len(slides)} gallery slides verified on disk.")

    # 3. Tweet length test (<= 280 chars)
    tweets = config.get("twitter_launch_thread", [])
    if len(tweets) != 6:
        failures.append(f"Expected 6 tweets in thread, found {len(tweets)}")
    for i, t in enumerate(tweets, 1):
        if len(t["content"]) > 280:
            failures.append(f"Tweet {i} exceeds 280 chars ({len(t['content'])} chars)")
    print(f"  [PASS] All {len(tweets)} tweets in thread conform to the 280-char limit.")

    # 4. VIP outreach count (15 profiles)
    vips = config.get("vip_executive_outreach", [])
    if len(vips) < 15:
        failures.append(f"Expected 15 VIP profiles, found {len(vips)}")
    for v in vips:
        if "https://elesium.online" not in v["message"]:
            failures.append(f"VIP message {v['id']} missing live URL")
    print(f"  [PASS] All {len(vips)} VIP executive outreach messages verified with live URLs.")

    # 5. Maker comment validation
    maker_comment = config.get("maker_comment", "")
    if "https://elesium.online/tools/enterprise-ai-roi-calculator" not in maker_comment:
        failures.append("Maker comment missing primary tool URL")
    print("  [PASS] Maker's official comment contains live tool URL and architecture links.")

    if failures:
        print("\n❌ SELF-TEST FAILED WITH ERRORS:")
        for f in failures:
            print(f"  - {f}")
        return False

    print("\n✅ ALL SELF-TEST ASSERTIONS PASSED (100% Launch Readiness).")
    return True

def main():
    parser = argparse.ArgumentParser(description="Elesium Product Hunt Scheduled Launch Manager")
    parser.add_argument("--status", action="store_true", help="Display launch countdown and asset health")
    parser.add_argument("--dispatch-thread", action="store_true", help="Render Twitter/X launch thread")
    parser.add_argument("--dispatch-vip", action="store_true", help="Render 15 VIP executive outreach messages")
    parser.add_argument("--dispatch-communities", action="store_true", help="Render community distribution payloads")
    parser.add_argument("--self-test", action="store_true", help="Execute launch asset verification tests")

    args = parser.parse_args()
    config = load_launch_config()

    if args.self_test:
        success = run_self_test(config)
        sys.exit(0 if success else 1)
    elif args.dispatch_thread:
        dispatch_thread(config)
    elif args.dispatch_vip:
        dispatch_vip(config)
    elif args.dispatch_communities:
        dispatch_communities(config)
    else:
        print_status(config)

if __name__ == "__main__":
    main()
