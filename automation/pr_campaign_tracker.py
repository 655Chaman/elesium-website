#!/usr/bin/env python3
"""
pr_campaign_tracker.py — Automated PR Outreach, Podcast & Directory Tracker
==========================================================================
Part of the Elesium Master Agent Operating Architecture.
Tracks journalist pitches, podcast booking campaigns, and directory disputes.
Zero external dependencies (Python 3.8+ standard library).

Usage:
    python3 pr_campaign_tracker.py init
    python3 pr_campaign_tracker.py add --type podcast --outlet "Latent Space" --target "Swyx & Alessio" --topic "Multi-Agent Latency" --da 75
    python3 pr_campaign_tracker.py list
    python3 pr_campaign_tracker.py followup
    python3 pr_campaign_tracker.py stats
    python3 pr_campaign_tracker.py update --id PR-1001 --status ACCEPTED --link "https://latentspace.pod/ep42"
    python3 pr_campaign_tracker.py export --format markdown
"""

import sys
import os
import json
import argparse
import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

DEFAULT_DB_PATH = Path(__file__).resolve().parent / "pr_campaign_data.json"

# ANSI Terminal Colors
class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    RED = "\033[91m"
    WHITE = "\033[97m"

STATUS_COLORS = {
    "PITCHED": Color.YELLOW,
    "FOLLOWUP_1": Color.MAGENTA,
    "FOLLOWUP_2": Color.MAGENTA,
    "ACCEPTED": Color.GREEN,
    "RECORDED": Color.CYAN,
    "PUBLISHED": Color.GREEN + Color.BOLD,
    "REJECTED": Color.RED,
    "DISPUTE_OPEN": Color.YELLOW,
    "DISPUTE_WON": Color.GREEN + Color.BOLD,
    "DISPUTE_LOST": Color.RED
}

DEFAULT_CADENCE_DAYS = {
    "PITCHED": 3,       # Follow-up 1 due after 3 days
    "FOLLOWUP_1": 4,    # Follow-up 2 due after 4 more days (Day 7 total)
    "FOLLOWUP_2": 7,    # Break-up due after 7 more days (Day 14 total)
    "DISPUTE_OPEN": 3   # Directory dispute check due every 3 days
}

def load_database(db_path: Path = DEFAULT_DB_PATH) -> Dict[str, Any]:
    if not db_path.exists():
        return {"campaigns": [], "metadata": {"created": datetime.date.today().isoformat(), "next_id": 1001}}
    try:
        with open(db_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"{Color.RED}[!] Error loading database at {db_path}: {e}{Color.RESET}")
        sys.exit(1)

def save_database(data: Dict[str, Any], db_path: Path = DEFAULT_DB_PATH) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def init_db(db_path: Path = DEFAULT_DB_PATH) -> None:
    if db_path.exists():
        print(f"{Color.YELLOW}[*] Database already exists at: {db_path}{Color.RESET}")
        return
    data = {
        "campaigns": [
            {
                "id": "PR-1001",
                "type": "JOURNALIST",
                "outlet": "TechCrunch",
                "target": "Enterprise Reporter",
                "topic": "Why 85% of Enterprise AI Pilots Fail",
                "angle": "Sovereign VPC vs Public API Latency",
                "da": 93,
                "status": "ACCEPTED",
                "date_sent": (datetime.date.today() - datetime.timedelta(days=12)).isoformat(),
                "last_action_date": (datetime.date.today() - datetime.timedelta(days=5)).isoformat(),
                "published_link": "https://techcrunch.com/enterprise-ai-sovereign-clusters",
                "notes": "Quoted Chaman Shah with link to India Enterprise AI Benchmark."
            },
            {
                "id": "PR-1002",
                "type": "PODCAST",
                "outlet": "Latent Space Podcast",
                "target": "Swyx & Alessio",
                "topic": "The Multi-Agent Latency Lie",
                "angle": "LangGraph StateGraph & AST Firewalls",
                "da": 78,
                "status": "FOLLOWUP_1",
                "date_sent": (datetime.date.today() - datetime.timedelta(days=4)).isoformat(),
                "last_action_date": (datetime.date.today() - datetime.timedelta(days=4)).isoformat(),
                "published_link": "",
                "notes": "Sent Script 1. Follow-up 1 due now."
            },
            {
                "id": "PR-1003",
                "type": "DIRECTORY_DISPUTE",
                "outlet": "Clutch.co",
                "target": "Review Moderation Board",
                "topic": "Overturn Flagged Review for BFSI Client",
                "angle": "Consumer Review Fairness Act & Redacted SOW",
                "da": 92,
                "status": "DISPUTE_WON",
                "date_sent": (datetime.date.today() - datetime.timedelta(days=15)).isoformat(),
                "last_action_date": (datetime.date.today() - datetime.timedelta(days=2)).isoformat(),
                "published_link": "https://clutch.co/profile/elesium-online#reviews",
                "notes": "Submitted Redacted SOW and SWIFT advice. Review reinstated."
            }
        ],
        "metadata": {
            "created": datetime.date.today().isoformat(),
            "next_id": 1004
        }
    }
    save_database(data, db_path)
    print(f"{Color.GREEN}[✓] Initialized PR Campaign Tracker database at: {db_path}{Color.RESET}")

def add_record(args, db_path: Path = DEFAULT_DB_PATH) -> None:
    data = load_database(db_path)
    next_id = data["metadata"].get("next_id", 1001)
    record_id = f"PR-{next_id}"
    data["metadata"]["next_id"] = next_id + 1

    today = datetime.date.today().isoformat()
    record = {
        "id": record_id,
        "type": args.type.upper(),
        "outlet": args.outlet,
        "target": args.target or "Editorial Team",
        "topic": args.topic,
        "angle": args.angle or "Empirical Benchmark / Case Study",
        "da": int(args.da) if args.da else 50,
        "status": args.status.upper() if args.status else "PITCHED",
        "date_sent": args.date or today,
        "last_action_date": args.date or today,
        "published_link": args.link or "",
        "notes": args.notes or ""
    }
    data["campaigns"].append(record)
    save_database(data, db_path)
    print(f"{Color.GREEN}[✓] Record Created: {record_id} -> {record['outlet']} ({record['type']}) | Status: {record['status']}{Color.RESET}")

def update_record(args, db_path: Path = DEFAULT_DB_PATH) -> None:
    data = load_database(db_path)
    found = False
    for rec in data["campaigns"]:
        if rec["id"].upper() == args.id.upper():
            found = True
            if args.status:
                rec["status"] = args.status.upper()
            if args.link:
                rec["published_link"] = args.link
            if args.notes:
                rec["notes"] = (rec.get("notes", "") + " | " + args.notes).strip(" | ")
            rec["last_action_date"] = datetime.date.today().isoformat()
            print(f"{Color.GREEN}[✓] Record {rec['id']} updated successfully. Status: {rec['status']}{Color.RESET}")
            break
    if not found:
        print(f"{Color.RED}[!] Record with ID {args.id} not found.{Color.RESET}")
    else:
        save_database(data, db_path)

def list_records(args, db_path: Path = DEFAULT_DB_PATH) -> None:
    data = load_database(db_path)
    campaigns = data.get("campaigns", [])
    if not campaigns:
        print(f"{Color.YELLOW}[*] No campaigns found in database.{Color.RESET}")
        return

    # Filter by type if provided
    if hasattr(args, 'filter_type') and args.filter_type:
        campaigns = [c for c in campaigns if c["type"].upper() == args.filter_type.upper()]

    print(f"\n{Color.BOLD}{Color.CYAN}=== ELESIUM PR, PODCAST & DIRECTORY OUTREACH TRACKER ==={Color.RESET}")
    header = f"{'ID':<9} | {'TYPE':<16} | {'OUTLET / SHOW':<22} | {'DA':<4} | {'STATUS':<15} | {'SENT DATE':<11} | {'TOPIC / ANGLE'}"
    print(Color.BOLD + header + Color.RESET)
    print("-" * 110)

    for c in campaigns:
        status_col = STATUS_COLORS.get(c['status'], Color.WHITE)
        status_str = f"{status_col}{c['status']:<15}{Color.RESET}"
        type_str = f"{c['type']:<16}"
        outlet_str = f"{c['outlet'][:20]:<22}"
        da_str = f"{c.get('da', 0):<4}"
        date_str = f"{c['date_sent']:<11}"
        topic_str = f"{c['topic'][:35]}"
        print(f"{c['id']:<9} | {type_str} | {outlet_str} | {da_str} | {status_str} | {date_str} | {topic_str}")
        if c.get("published_link"):
            print(f"          ↳ {Color.GREEN}Link:{Color.RESET} {c['published_link']}")

    print("-" * 110)
    print(f"Total Records: {len(campaigns)}\n")

def check_followups(db_path: Path = DEFAULT_DB_PATH) -> None:
    data = load_database(db_path)
    today = datetime.date.today()
    pending_followups = []

    print(f"\n{Color.BOLD}{Color.YELLOW}=== ACTION REQUIRED: DUE FOLLOW-UPS & HEURISTIC ALERTS ==={Color.RESET}")
    for c in data.get("campaigns", []):
        status = c["status"].upper()
        if status in DEFAULT_CADENCE_DAYS:
            cadence = DEFAULT_CADENCE_DAYS[status]
            last_date = datetime.date.fromisoformat(c.get("last_action_date", c["date_sent"]))
            days_elapsed = (today - last_date).days
            if days_elapsed >= cadence:
                pending_followups.append((c, days_elapsed, cadence))

    if not pending_followups:
        print(f"{Color.GREEN}[✓] All outreach sequences are up to date. No follow-ups currently due.{Color.RESET}\n")
        return

    for c, elapsed, cadence in pending_followups:
        rec_id = c["id"]
        outlet = c["outlet"]
        target = c["target"]
        status = c["status"]
        print(f"\n{Color.RED}[!] OVERDUE ({elapsed} days since last action, cadence: {cadence} days):{Color.RESET}")
        print(f"    Record ID:   {Color.BOLD}{rec_id}{Color.RESET} ({c['type']})")
        print(f"    Target:      {outlet} — {target}")
        print(f"    Topic:       {c['topic']}")
        print(f"    Current:     {STATUS_COLORS.get(status, '')}{status}{Color.RESET}")
        
        # Action suggestion
        if status == "PITCHED":
            print(f"    {Color.CYAN}Suggested Action:{Color.RESET} Send Touch 2: Counter-Intuitive Telemetry Drop (Pitch Pack Section 3.3).")
        elif status == "FOLLOWUP_1":
            print(f"    {Color.CYAN}Suggested Action:{Color.RESET} Send Touch 3: Complete 3-Part Episode / Quote Outline.")
        elif status == "FOLLOWUP_2":
            print(f"    {Color.CYAN}Suggested Action:{Color.RESET} Send Touch 4: Graceful Break-Up Note.")
        elif status == "DISPUTE_OPEN":
            print(f"    {Color.CYAN}Suggested Action:{Color.RESET} Check moderation status or escalate to legal notice (Dossier Section 2.5).")

    print(f"\nTotal Overdue Actions: {len(pending_followups)}\n")

def print_stats(db_path: Path = DEFAULT_DB_PATH) -> None:
    data = load_database(db_path)
    campaigns = data.get("campaigns", [])
    total = len(campaigns)
    if total == 0:
        print("[*] No campaign data available.")
        return

    status_counts = {}
    type_counts = {}
    total_da_published = 0
    published_count = 0

    for c in campaigns:
        st = c["status"]
        tp = c["type"]
        status_counts[st] = status_counts.get(st, 0) + 1
        type_counts[tp] = type_counts.get(tp, 0) + 1
        if st in ("PUBLISHED", "DISPUTE_WON"):
            published_count += 1
            total_da_published += c.get("da", 0)

    avg_da = (total_da_published / published_count) if published_count > 0 else 0
    win_rate = (published_count / total) * 100

    print(f"\n{Color.BOLD}{Color.CYAN}=== ELESIUM PR CAMPAIGN TELEMETRY & STATS ==={Color.RESET}")
    print(f"Total Campaigns Tracked:     {Color.BOLD}{total}{Color.RESET}")
    print(f"Published / Dispute Won:     {Color.GREEN}{published_count}{Color.RESET}")
    print(f"Conversion Win Rate:         {Color.BOLD}{win_rate:.1f}%{Color.RESET}")
    print(f"Average DA Acquired:         {Color.BOLD}{avg_da:.1f}{Color.RESET}")
    print("\n--- Breakdown By Campaign Type ---")
    for tp, count in type_counts.items():
        print(f"  • {tp:<18}: {count}")
    print("\n--- Breakdown By Pipeline Status ---")
    for st, count in status_counts.items():
        col = STATUS_COLORS.get(st, Color.WHITE)
        print(f"  • {col}{st:<18}{Color.RESET}: {count}")
    print("=============================================\n")

def export_report(args, db_path: Path = DEFAULT_DB_PATH) -> None:
    data = load_database(db_path)
    campaigns = data.get("campaigns", [])
    fmt = args.format.lower() if args.format else "markdown"

    if fmt == "csv":
        import csv
        out_file = db_path.parent / "pr_campaign_export.csv"
        with open(out_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["ID", "Type", "Outlet", "Target", "Topic", "Angle", "DA", "Status", "Date Sent", "Published Link", "Notes"])
            for c in campaigns:
                writer.writerow([c["id"], c["type"], c["outlet"], c["target"], c["topic"], c["angle"], c.get("da", ""), c["status"], c["date_sent"], c.get("published_link", ""), c.get("notes", "")])
        print(f"{Color.GREEN}[✓] Exported CSV to: {out_file}{Color.RESET}")

    else:
        out_file = db_path.parent / "pr_campaign_export.md"
        with open(out_file, "w", encoding="utf-8") as f:
            f.write("# Elesium PR, Podcast & Directory Outreach Audit Report\n\n")
            f.write(f"**Generated:** {datetime.date.today().isoformat()} | **Total Campaigns:** {len(campaigns)}\n\n")
            f.write("| ID | Type | Outlet | DA | Status | Date Sent | Topic | Published Link |\n")
            f.write("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n")
            for c in campaigns:
                link = f"[Link]({c['published_link']})" if c.get("published_link") else "—"
                f.write(f"| {c['id']} | {c['type']} | {c['outlet']} | {c.get('da', '—')} | **{c['status']}** | {c['date_sent']} | {c['topic']} | {link} |\n")
        print(f"{Color.GREEN}[✓] Exported Markdown report to: {out_file}{Color.RESET}")

def main():
    parser = argparse.ArgumentParser(description="Elesium PR Outreach, Podcast & Directory Dispute Tracker")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")

    # init
    subparsers.add_parser("init", help="Initialize database with starter records")

    # add
    p_add = subparsers.add_parser("add", help="Add a new outreach record")
    p_add.add_argument("--type", choices=["journalist", "podcast", "directory", "directory_dispute", "guest_post"], required=True)
    p_add.add_argument("--outlet", required=True, help="Publication, Podcast Name, or Directory")
    p_add.add_argument("--target", help="Specific Journalist, Host, or Editor")
    p_add.add_argument("--topic", required=True, help="Pitch Topic / Episode Title")
    p_add.add_argument("--angle", help="Core Contrarian Angle or Evidence Basis")
    p_add.add_argument("--da", type=int, help="Domain Authority / Rating")
    p_add.add_argument("--status", choices=["PITCHED", "FOLLOWUP_1", "FOLLOWUP_2", "ACCEPTED", "RECORDED", "PUBLISHED", "REJECTED", "DISPUTE_OPEN", "DISPUTE_WON", "DISPUTE_LOST"])
    p_add.add_argument("--date", help="Date Sent (YYYY-MM-DD)")
    p_add.add_argument("--link", help="Published URL")
    p_add.add_argument("--notes", help="Internal Notes / Action items")

    # update
    p_up = subparsers.add_parser("update", help="Update status or link of an existing record")
    p_up.add_argument("--id", required=True, help="Record ID (e.g. PR-1001)")
    p_up.add_argument("--status", help="New status")
    p_up.add_argument("--link", help="Published live backlink URL")
    p_up.add_argument("--notes", help="Append notes")

    # list
    p_list = subparsers.add_parser("list", help="List all campaigns")
    p_list.add_argument("--filter-type", help="Filter by type (journalist, podcast, etc.)")

    # followup
    subparsers.add_parser("followup", help="Check overdue follow-ups based on cadence rules")

    # stats
    subparsers.add_parser("stats", help="Show aggregated PR performance telemetry")

    # export
    p_exp = subparsers.add_parser("export", help="Export report to Markdown or CSV")
    p_exp.add_argument("--format", choices=["markdown", "csv"], default="markdown")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(0)

    if args.command == "init":
        init_db()
    elif args.command == "add":
        add_record(args)
    elif args.command == "update":
        update_record(args)
    elif args.command == "list":
        list_records(args)
    elif args.command == "followup":
        check_followups()
    elif args.command == "stats":
        print_stats()
    elif args.command == "export":
        export_report(args)

if __name__ == "__main__":
    main()
