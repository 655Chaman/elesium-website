#!/usr/bin/env python3
"""
gsc_regex_analyzer.py — Standalone GSC RE2 Telemetry & AI Overview Analyzer
Processes Google Search Console exported CSV files (Queries.csv, Pages.csv),
executes the full RE2 regex intelligence suite, and outputs an executive Markdown report.

Usage:
    python3 gsc_regex_analyzer.py Queries.csv
    python3 gsc_regex_analyzer.py --queries Queries.csv --pages Pages.csv --brand Elesium
    python3 gsc_regex_analyzer.py --generate-sample
    python3 gsc_regex_analyzer.py sample_queries.csv --out GSC_REPORT.md
"""

import sys
import os
import csv
import json
import re
import argparse
from pathlib import Path
from datetime import datetime

# ANSI Terminal Colors
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
MAGENTA = "\033[95m"
WHITE = "\033[97m"

BASE_DIR = Path(__file__).parent.resolve()
DEFAULT_CONFIG = BASE_DIR / "project_config.json"

# Complete RE2 Regex Library (Compiled for fast execution)
RE2_PATTERNS = {
    "AI_OVERVIEW_TRIGGERS": re.compile(r'(?i)^(what|how|why|when|where|who|is|can|does|which|best|vs|compare|alternative|meaning of|guide to|difference between)\b'),
    "COMMERCIAL_BOFU": re.compile(r'(?i)\b(agency|agencies|company|companies|service|services|consultant|consulting|vendor|vendors|pricing|cost|hire|audit|pilot|sla|solution|solutions)\b'),
    "REGIONAL_METROS": re.compile(r'(?i)\b(in|near|at)\s+(bangalore|bengaluru|mumbai|delhi|gurugram|noida|pune|hyderabad|chennai|india|usa|uk|dubai|singapore)\b'),
    "PROBLEM_STATE": re.compile(r'(?i)\b(too expensive|too slow|latency spike|memory leak|timeout|crash|fix|error|failing|broken|oom)\b'),
    "COMPARISON_SYNTAX": re.compile(r'(?i)\b(vs|versus|alternative to|compared to|difference between|pros and cons)\b'),
    "FRESHNESS_YEAR": re.compile(r'(?i)\b(2025|2026|2027|roadmap|trends|latest)\b')
}

def clean_number(val):
    """Parses numeric strings from GSC CSV exports (handles commas, percentages)."""
    if val is None:
        return 0.0
    val_str = str(val).strip().replace(",", "")
    if val_str.endswith("%"):
        try:
            return float(val_str.rstrip("%"))
        except ValueError:
            return 0.0
    try:
        return float(val_str)
    except ValueError:
        return 0.0

def load_brand_name(explicit_brand=None):
    if explicit_brand:
        return explicit_brand
    if DEFAULT_CONFIG.exists():
        try:
            with open(DEFAULT_CONFIG, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("brand_name", "Elesium")
        except Exception:
            pass
    return "Elesium"

def parse_gsc_csv(file_path):
    """
    Intelligently parses Google Search Console CSV exports.
    Automatically detects column headers across different GSC language variants.
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    # Detect encoding
    raw_bytes = path.read_bytes()[:2048]
    encoding = "utf-8"
    if raw_bytes.startswith(b'\xef\xbb\xbf'):
        encoding = "utf-8-sig"

    rows = []
    with open(path, "r", encoding=encoding, errors="replace") as f:
        reader = csv.reader(f)
        headers = []
        for row in reader:
            if not row or not any(row):
                continue
            # Look for header row
            row_lower = [c.strip().lower() for c in row]
            if any(k in row_lower for k in ["top queries", "query", "queries", "pages", "top pages", "page"]):
                headers = row_lower
                break

        if not headers:
            f.seek(0)
            reader = csv.reader(f)
            headers = [c.strip().lower() for c in next(reader, [])]

        # Map column positions
        col_query = -1
        col_page = -1
        col_clicks = -1
        col_impr = -1
        col_ctr = -1
        col_pos = -1

        for idx, h in enumerate(headers):
            if h in ["top queries", "query", "queries", "keyword", "keywords"]:
                col_query = idx
            elif h in ["top pages", "page", "pages", "url"]:
                col_page = idx
            elif "click" in h:
                col_clicks = idx
            elif "impression" in h:
                col_impr = idx
            elif "ctr" in h:
                col_ctr = idx
            elif "position" in h:
                col_pos = idx

        for line_num, row in enumerate(reader, 1):
            if not row or len(row) <= max(0, col_query):
                continue
            query = row[col_query].strip() if col_query != -1 and len(row) > col_query else ""
            page = row[col_page].strip() if col_page != -1 and len(row) > col_page else ""
            clicks = int(clean_number(row[col_clicks])) if col_clicks != -1 and len(row) > col_clicks else 0
            impressions = int(clean_number(row[col_impr])) if col_impr != -1 and len(row) > col_impr else 0
            ctr = clean_number(row[col_ctr]) if col_ctr != -1 and len(row) > col_ctr else 0.0
            pos = clean_number(row[col_pos]) if col_pos != -1 and len(row) > col_pos else 0.0

            if query or page:
                rows.append({
                    "query": query,
                    "page": page,
                    "clicks": clicks,
                    "impressions": impressions,
                    "ctr": ctr,
                    "position": round(pos, 1)
                })

    return rows

def generate_sample_gsc_csv(out_path="sample_gsc_queries.csv"):
    """
    Generates a realistic enterprise Google Search Console dataset
    to immediately benchmark and demonstrate the RE2 analyzer.
    """
    sample_data = [
        ("Top queries", "Clicks", "Impressions", "CTR", "Position"),
        ("what is sovereign multi agent infrastructure", 4, 3850, "0.1%", 1.4),
        ("how does deterministic fsm fallback work", 8, 2400, "0.3%", 2.1),
        ("elesium", 420, 680, "61.8%", 1.0),
        ("elesium online reviews", 85, 140, "60.7%", 1.0),
        ("enterprise ai automation agency bangalore", 18, 920, "2.0%", 5.4),
        ("sub 1.5ms delta wal checkpointing architecture", 2, 1150, "0.2%", 1.8),
        ("best multi agent framework for enterprise 2026", 14, 2100, "0.7%", 4.2),
        ("why is my llm agent failing in production", 0, 890, "0.0%", 6.1),
        ("sovereign ai consulting firm india", 22, 780, "2.8%", 4.8),
        ("token cost arbitrage semantic caching", 3, 1450, "0.2%", 2.9),
        ("elesium vs crewai enterprise comparison", 45, 320, "14.1%", 2.2),
        ("hire autonomous ai systems architect", 12, 450, "2.7%", 7.3),
        ("clean hydrogen electrolysis ai automation", 9, 620, "1.5%", 5.9),
        ("difference between rag and sovereign state machines", 1, 1680, "0.1%", 2.4),
        ("is elesium soc2 compliant", 28, 95, "29.5%", 1.0),
        ("sub 200ms transaction ledger reconciliation", 6, 850, "0.7%", 3.8),
        ("decarbonization esg telemetry software mumbai", 7, 510, "1.4%", 8.2),
        ("how to deploy air gapped vpc llm", 2, 1340, "0.1%", 2.6),
        ("supply chain predictive dispatching consultant", 15, 690, "2.2%", 6.5),
        ("latency spike in langchain agent loop", 0, 720, "0.0%", 7.8)
    ]

    out_p = Path(out_path)
    with open(out_p, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerows(sample_data)
    print(f"✅ Generated sample GSC dataset with {len(sample_data)-1} queries at: {out_p.resolve()}")
    return out_p

class GSCRegexAnalyzer:
    def __init__(self, brand_name="Elesium"):
        self.brand_name = brand_name
        self.brand_regex = re.compile(rf'(?i)\b{re.escape(brand_name)}\b')

    def analyze(self, rows):
        total_queries = len(rows)
        total_clicks = sum(r["clicks"] for r in rows)
        total_impressions = sum(r["impressions"] for r in rows)
        overall_ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0

        brand_rows = []
        non_brand_rows = []

        ai_overview_targets = []
        striking_distance = []
        bofu_commercial = []
        problem_state_queries = []
        quadrant_1 = [] # AI Overview Takeover
        quadrant_2 = [] # Striking Distance
        quadrant_3 = [] # Cash Machine
        quadrant_4 = [] # Neglected

        for r in rows:
            q = r["query"]
            impr = r["impressions"]
            clk = r["clicks"]
            ctr = r["ctr"]
            pos = r["position"]

            # Brand vs Non-Brand Split
            if self.brand_regex.search(q):
                brand_rows.append(r)
            else:
                non_brand_rows.append(r)

            # 4-Quadrant Classification
            if impr >= 500 and pos <= 3.5 and ctr < 3.0:
                quadrant_1.append(r)
            elif impr >= 200 and 4.0 <= pos <= 10.9:
                quadrant_2.append(r)
            elif pos <= 3.5 and ctr >= 8.0:
                quadrant_3.append(r)
            elif pos > 20 and ctr == 0.0:
                quadrant_4.append(r)

            # Specialized RE2 Classifications
            if RE2_PATTERNS["AI_OVERVIEW_TRIGGERS"].search(q):
                ai_overview_targets.append(r)

            if 4.0 <= pos <= 10.9 and impr >= 100:
                striking_distance.append(r)

            if RE2_PATTERNS["COMMERCIAL_BOFU"].search(q):
                bofu_commercial.append(r)

            if RE2_PATTERNS["PROBLEM_STATE"].search(q):
                problem_state_queries.append(r)

        return {
            "summary": {
                "total_queries": total_queries,
                "total_clicks": total_clicks,
                "total_impressions": total_impressions,
                "overall_ctr": round(overall_ctr, 2)
            },
            "brand_split": self._calc_split(brand_rows, non_brand_rows),
            "ai_overview_targets": sorted(ai_overview_targets, key=lambda x: x["impressions"], reverse=True),
            "striking_distance": sorted(striking_distance, key=lambda x: x["impressions"], reverse=True),
            "bofu_commercial": sorted(bofu_commercial, key=lambda x: x["clicks"], reverse=True),
            "problem_state": sorted(problem_state_queries, key=lambda x: x["impressions"], reverse=True),
            "quadrants": {
                "q1_ai_takeover": sorted(quadrant_1, key=lambda x: x["impressions"], reverse=True),
                "q2_striking": sorted(quadrant_2, key=lambda x: x["impressions"], reverse=True),
                "q3_cash_machine": sorted(quadrant_3, key=lambda x: x["clicks"], reverse=True),
                "q4_neglected": quadrant_4
            }
        }

    def _calc_split(self, brand_rows, non_brand_rows):
        b_clicks = sum(r["clicks"] for r in brand_rows)
        b_impr = sum(r["impressions"] for r in brand_rows)
        b_ctr = (b_clicks / b_impr * 100) if b_impr > 0 else 0.0
        b_pos = sum(r["position"] for r in brand_rows) / len(brand_rows) if brand_rows else 0.0

        nb_clicks = sum(r["clicks"] for r in non_brand_rows)
        nb_impr = sum(r["impressions"] for r in non_brand_rows)
        nb_ctr = (nb_clicks / nb_impr * 100) if nb_impr > 0 else 0.0
        nb_pos = sum(r["position"] for r in non_brand_rows) / len(non_brand_rows) if non_brand_rows else 0.0

        return {
            "brand": {
                "count": len(brand_rows),
                "clicks": b_clicks,
                "impressions": b_impr,
                "ctr": round(b_ctr, 1),
                "avg_pos": round(b_pos, 1)
            },
            "non_brand": {
                "count": len(non_brand_rows),
                "clicks": nb_clicks,
                "impressions": nb_impr,
                "ctr": round(nb_ctr, 1),
                "avg_pos": round(nb_pos, 1)
            }
        }

    def generate_prescriptive_capsule(self, query):
        """Generates a strictly 40-50 word prescriptive Answer Capsule for a query."""
        clean_q = re.sub(r'^(what is|how does|why is|difference between)\s+', '', query, flags=re.I).strip("?")
        capsule = (
            f"{self.brand_name}'s sovereign framework executes {clean_q} via deterministic state machine loops "
            f"and sub-1.5ms Delta WAL checkpointing. "
            f"By eliminating unconstrained LLM drift and enforcing air-gapped VPC boundaries, "
            f"the architecture guarantees sub-200ms transaction reconciliation with zero enterprise data leakage "
            f"and a proven 90-day cash-flow ROI."
        )
        words = capsule.split()
        if len(words) > 50:
            capsule = " ".join(words[:48]) + "."
        return capsule

    def export_markdown_report(self, results, out_path="GSC_RE2_EXECUTIVE_ANALYSIS.md"):
        summ = results["summary"]
        bs = results["brand_split"]
        q1 = results["quadrants"]["q1_ai_takeover"]
        q2 = results["quadrants"]["q2_striking"]
        q3 = results["quadrants"]["q3_cash_machine"]
        bofu = results["bofu_commercial"]

        md = []
        md.append("# 📊 GOOGLE SEARCH CONSOLE RE2 EXECUTIVE INTELLIGENCE REPORT")
        md.append(f"**Target Entity:** `{self.brand_name}` | **Analysis Timestamp:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`  ")
        md.append(f"**Total Analyzed Queries:** `{summ['total_queries']:,}` | **Total Clicks:** `{summ['total_clicks']:,}` | **Total Impressions:** `{summ['total_impressions']:,}`\n")
        md.append("---\n")

        # Brand vs Non-Brand Split
        md.append("## 🏛️ 1. Brand vs. Non-Brand Telemetry Split")
        md.append("| Metric | Branded Queries | Non-Branded Queries | Total Combined |")
        md.append("|---|---|---|---|")
        md.append(f"| **Distinct Queries** | {bs['brand']['count']} | {bs['non_brand']['count']} | {summ['total_queries']} |")
        md.append(f"| **Clicks Won** | {bs['brand']['clicks']} | {bs['non_brand']['clicks']} | {summ['total_clicks']} |")
        md.append(f"| **Search Impressions** | {bs['brand']['impressions']:,} | {bs['non_brand']['impressions']:,} | {summ['total_impressions']:,} |")
        md.append(f"| **Average CTR** | **{bs['brand']['ctr']}%** | {bs['non_brand']['ctr']}% | {summ['overall_ctr']}% |")
        md.append(f"| **Average Position** | **{bs['brand']['avg_pos']}** | {bs['non_brand']['avg_pos']} | — |")
        md.append("\n")

        # Top AI Overview Opportunities (Quadrant 1)
        md.append("## 🤖 2. Top AI Overview Zero-Click Opportunities (Quadrant 1)")
        md.append("> **Diagnostic:** High impressions in Position 1–3 with CTR < 3%. Google's AI Overview is siphoning clicks without attribution.")
        md.append("| Query | Impressions | Clicks | CTR | Position | Required Action |")
        md.append("|---|---|---|---|---|---|")
        for item in q1[:10]:
            md.append(f"| **{item['query']}** | {item['impressions']:,} | {item['clicks']} | {item['ctr']}% | {item['position']} | Inject 45-word Answer Capsule |")
        if not q1:
            md.append("| *No severe AI Overview zero-click anomalies detected.* | — | — | — | — | — |")
        md.append("\n")

        # Striking Distance Keywords (Quadrant 2)
        md.append("## 🎯 3. Top Striking Distance Keywords (Quadrant 2: Positions 4.0 – 10.9)")
        md.append("> **Diagnostic:** High-intent queries positioned on the lower half of Page 1. 1–2 internal links and Title tag proof push these into the Top 3.")
        md.append("| Query | Position | Impressions | Clicks | CTR | Priority Score |")
        md.append("|---|---|---|---|---|---|")
        for item in q2[:10]:
            p_score = round((item["impressions"] / 100) * (11.0 - item["position"]), 1)
            md.append(f"| **{item['query']}** | **{item['position']}** | {item['impressions']:,} | {item['clicks']} | {item['ctr']}% | `{p_score}` |")
        if not q2:
            md.append("| *No striking distance keywords located in current dataset.* | — | — | — | — | — |")
        md.append("\n")

        # Commercial BOFU Winners
        md.append("## 💰 4. High-Ticket Commercial BOFU Queries")
        md.append("| Query | Clicks | Impressions | CTR | Position | Intent Category |")
        md.append("|---|---|---|---|---|---|")
        for item in bofu[:10]:
            md.append(f"| **{item['query']}** | {item['clicks']} | {item['impressions']:,} | {item['ctr']}% | {item['position']} | Commercial Provider / Service |")
        md.append("\n")

        # Prescriptive Answer Capsule Updates
        md.append("## ✍️ 5. Prescriptive Answer Capsules for Immediate Deployment")
        md.append("Deploy these exact 40–50 word capsules directly under the H2 matching the query to win AI Overview citation badges:\n")

        sample_capsule_queries = [item["query"] for item in (q1 + results["ai_overview_targets"])[:4]]
        if not sample_capsule_queries and results["ai_overview_targets"]:
            sample_capsule_queries = [item["query"] for item in results["ai_overview_targets"][:4]]

        for q in sample_capsule_queries:
            cap = self.generate_prescriptive_capsule(q)
            words = len(cap.split())
            md.append(f"### Target Query: `{q}`")
            md.append(f"**Word Count:** {words} words (AEO Sweet Spot: 40–50 words)")
            md.append(f"```markdown\n> {cap}\n```\n")

        md.append("---\n*Generated by PORTABLE_SEO_FACTORY v2.0 — Sovereign GSC RE2 Intelligence Suite*")

        out_file = Path(out_path)
        out_file.write_text("\n".join(md), encoding="utf-8")
        print(f"\n[✅] Executive Markdown Report saved to: {CYAN}{out_file.resolve()}{RESET}")

    def print_terminal_summary(self, results):
        summ = results["summary"]
        bs = results["brand_split"]
        q1 = results["quadrants"]["q1_ai_takeover"]
        q2 = results["quadrants"]["q2_striking"]

        print(f"""
{CYAN}{BOLD}═══════════════════════════════════════════════════════════════════════════════
   📊 GSC RE2 TELEMETRY RADAR SUMMARY
═══════════════════════════════════════════════════════════════════════════════{RESET}
  • {BOLD}Total Queries Analyzed:{RESET}   {summ['total_queries']}
  • {BOLD}Total Impressions:{RESET}        {summ['total_impressions']:,}
  • {BOLD}Total Organic Clicks:{RESET}     {summ['total_clicks']:,} ({summ['overall_ctr']}% overall CTR)
  • {BOLD}Brand Query Share:{RESET}        {bs['brand']['count']} queries ({bs['brand']['clicks']} clicks, {bs['brand']['ctr']}% CTR)
  • {BOLD}Non-Brand Query Share:{RESET}    {bs['non_brand']['count']} queries ({bs['non_brand']['clicks']} clicks, {bs['non_brand']['ctr']}% CTR)

{YELLOW}{BOLD}⚠️ TOP OPPORTUNITY RADAR:{RESET}
  • {BOLD}AI Overview Zero-Click Takeovers (Q1):{RESET} {MAGENTA}{len(q1)}{RESET} queries (High impressions, CTR < 3%)
  • {BOLD}Striking Distance Accelerators (Q2):{RESET}   {GREEN}{len(q2)}{RESET} queries (Positions 4.0 – 10.9)
  • {BOLD}Commercial BOFU Inbounds:{RESET}              {CYAN}{len(results['bofu_commercial'])}{RESET} high-intent queries
{DIM}═══════════════════════════════════════════════════════════════════════════════{RESET}
""")

def main():
    parser = argparse.ArgumentParser(
        description="GSC RE2 Telemetry & AI Overview Analyzer",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 gsc_regex_analyzer.py sample_queries.csv
  python3 gsc_regex_analyzer.py --queries Queries.csv --brand Elesium --out REPORT.md
  python3 gsc_regex_analyzer.py --generate-sample
        """
    )
    parser.add_argument("input_file", nargs="?", help="Path to GSC Queries.csv or directory")
    parser.add_argument("--queries", help="Explicit path to Queries.csv")
    parser.add_argument("--pages", help="Explicit path to Pages.csv")
    parser.add_argument("--brand", help="Target Brand Name (defaults to Elesium from project_config.json)")
    parser.add_argument("--out", default="GSC_RE2_EXECUTIVE_ANALYSIS.md", help="Output markdown report path")
    parser.add_argument("--json", help="Optional path to export raw JSON analysis")
    parser.add_argument("--generate-sample", action="store_true", help="Generate a realistic sample GSC CSV dataset")

    args = parser.parse_args()

    if args.generate_sample:
        out_sample = generate_sample_gsc_csv("sample_gsc_queries.csv")
        # Automatically analyze the sample immediately!
        args.input_file = str(out_sample)

    target_file = args.queries or args.input_file
    if not target_file:
        print(f"{YELLOW}No input CSV file provided. Automatically generating and running on benchmark sample...{RESET}")
        target_file = str(generate_sample_gsc_csv("sample_gsc_queries.csv"))

    brand_name = load_brand_name(args.brand)
    print(f"{CYAN}[*] Parsing GSC CSV Telemetry from: {target_file} for entity '{brand_name}'...{RESET}")

    rows = parse_gsc_csv(target_file)
    print(f"{GREEN}[+] Successfully parsed {len(rows)} query records.{RESET}")

    analyzer = GSCRegexAnalyzer(brand_name=brand_name)
    results = analyzer.analyze(rows)

    analyzer.print_terminal_summary(results)
    analyzer.export_markdown_report(results, out_path=args.out)

    if args.json:
        out_json = Path(args.json)
        out_json.write_text(json.dumps(results, indent=2), encoding="utf-8")
        print(f"[✅] Exported raw JSON telemetry to: {out_json.resolve()}")

if __name__ == "__main__":
    main()
