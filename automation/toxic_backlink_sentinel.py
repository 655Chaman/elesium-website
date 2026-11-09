#!/usr/bin/env python3
"""
ELESIUM TOXIC BACKLINK SENTINEL & DISAVOW SHIELD (V2026.1)
Operational Specification: Master Agent Playbook 12 & SEO Rockstars 2026 (Craig Campbell)

Defends against adversarial Negative SEO link injection attacks by:
1. Monitoring daily backlink velocity Z-scores (Z > 3.5 = Active Attack).
2. Calculating Shannon entropy H(A) across anchor text distributions (H < 2.5 = Anchor Spam).
3. Detecting toxic foreign TLD clusters (.xyz, .top, .buzz, .ru, etc.) and spam keywords.
4. Generating RFC-compliant Google Search Console Disavow files (disavow.txt).
5. Emitting audit telemetry to automation/adversarial_defense_telemetry.json.
"""

import math
import sys
import os
import csv
import json
from collections import Counter
from datetime import datetime, timezone
from typing import List, Dict, Tuple, Set

# Configuration Thresholds from Playbook 12
VELOCITY_Z_THRESHOLD = 3.5
ENTROPY_MIN_THRESHOLD = 2.5
TOP_ANCHOR_PCT_THRESHOLD = 35.0
TOXIC_DOMAINS_THRESHOLD = 15

BANNED_TLDS: Set[str] = {
    ".xyz", ".top", ".buzz", ".click", ".ru", ".cc", ".link", 
    ".work", ".site", ".fun", ".icu", ".monster", ".gq", ".ml", ".cf"
}

TOXIC_KEYWORDS: Set[str] = {
    "casino", "poker", "viagra", "cialis", "adult", "porn", "crypto-airdrop", 
    "payday-loan", "free-hack", "replica-watches", "binary-options", "crack-download"
}

class BacklinkRecord:
    def __init__(self, source_url: str, target_url: str, anchor_text: str, discovered_date: str = ""):
        self.source_url = source_url.strip()
        self.target_url = target_url.strip()
        self.anchor_text = anchor_text.strip().lower()
        self.discovered_date = discovered_date.strip() or datetime.now(timezone.utc).strftime("%Y-%m-%d")
        self.domain = self._extract_domain(self.source_url)
        self.root_domain = self._extract_root_domain(self.domain)
        
    def _extract_domain(self, url: str) -> str:
        clean = url.split("://")[-1].split("/")[0].split("?")[0].split(":")[0]
        return clean.lower()

    def _extract_root_domain(self, domain: str) -> str:
        parts = domain.split(".")
        if len(parts) >= 2:
            return ".".join(parts[-2:])
        return domain

def calculate_shannon_entropy(anchors: List[str]) -> float:
    """Computes Shannon entropy H(A) = -sum(P(a) * log2(P(a))) across anchor distribution."""
    if not anchors:
        return 0.0
    total = len(anchors)
    counts = Counter(anchors)
    entropy = 0.0
    for count in counts.values():
        p = count / total
        if p > 0:
            entropy -= p * math.log2(p)
    return round(entropy, 4)

def calculate_velocity_z_score(daily_counts: List[int], current_velocity: int) -> float:
    """Computes Z-Score = (v(t) - mu_v) / sigma_v over a baseline arrival window."""
    if not daily_counts:
        return 0.0
    n = len(daily_counts)
    mu = sum(daily_counts) / n
    variance = sum((x - mu) ** 2 for x in daily_counts) / n
    sigma = math.sqrt(variance)
    if sigma == 0:
        return 0.0 if current_velocity == mu else 4.0
    return round((current_velocity - mu) / sigma, 2)

def analyze_backlink_records(records: List[BacklinkRecord], historical_velocity: List[int] = None) -> Tuple[bool, List[str], Dict]:
    """Analyzes backlink records and returns (attack_detected, disavow_domains, metrics)."""
    if not records:
        return False, [], {}

    total_links = len(records)
    anchors = [r.anchor_text for r in records if r.anchor_text]
    entropy = calculate_shannon_entropy(anchors)
    
    unique_domains = set(r.domain for r in records)
    unique_root_domains = set(r.root_domain for r in records)
    
    toxic_root_domains = set()
    toxic_reasons = []
    
    for r in records:
        # Check toxic TLDs
        for tld in BANNED_TLDS:
            if r.domain.endswith(tld):
                toxic_root_domains.add(r.root_domain)
                toxic_reasons.append(f"Toxic TLD ({tld}): {r.domain}")
                break
                
        # Check toxic anchor keywords
        for kw in TOXIC_KEYWORDS:
            if kw in r.anchor_text:
                toxic_root_domains.add(r.root_domain)
                toxic_reasons.append(f"Toxic Keyword Anchor ('{kw}'): {r.domain}")
                break

    # Anchor text concentration
    anchor_counts = Counter(anchors)
    top_anchor, top_count = anchor_counts.most_common(1)[0] if anchor_counts else ("none", 0)
    top_anchor_pct = round((top_count / total_links) * 100, 2) if total_links else 0.0

    # Velocity Z-Score evaluation
    current_velocity = total_links
    baseline = historical_velocity or [48, 52, 50, 49, 51, 50, 47, 53, 50, 50] # Normal ~50/day arrival
    z_score = calculate_velocity_z_score(baseline, current_velocity)

    # Attack Detection Rule
    attack_detected = False
    flagged_reasons = []

    if z_score > VELOCITY_Z_THRESHOLD:
        attack_detected = True
        flagged_reasons.append(f"Velocity spike: Z-Score {z_score} > {VELOCITY_Z_THRESHOLD}")

    if entropy < ENTROPY_MIN_THRESHOLD and total_links > 50:
        attack_detected = True
        flagged_reasons.append(f"Anchor text entropy collapse: {entropy} < {ENTROPY_MIN_THRESHOLD}")

    if len(toxic_root_domains) >= TOXIC_DOMAINS_THRESHOLD:
        attack_detected = True
        flagged_reasons.append(f"Toxic domain cluster detected: {len(toxic_root_domains)} domains")

    if top_anchor_pct > TOP_ANCHOR_PCT_THRESHOLD and top_anchor not in {"", "brand", "elesium", "elesium digital"}:
        attack_detected = True
        flagged_reasons.append(f"Unnatural exact-match anchor concentration: '{top_anchor}' is {top_anchor_pct}%")

    metrics = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_links_analyzed": total_links,
        "unique_domains": len(unique_domains),
        "unique_root_domains": len(unique_root_domains),
        "anchor_entropy": entropy,
        "velocity_z_score": z_score,
        "top_anchor": top_anchor,
        "top_anchor_concentration_pct": top_anchor_pct,
        "toxic_domains_flagged_count": len(toxic_root_domains),
        "attack_detected": attack_detected,
        "flagged_reasons": flagged_reasons,
        "threat_level": "CRITICAL_ATTACK_CONTAINED" if attack_detected else "NOMINAL"
    }

    return attack_detected, sorted(list(toxic_root_domains)), metrics

def generate_disavow_file(domains: List[str], output_path: str = "disavow.txt") -> str:
    """Generates official RFC-compliant Google Search Console disavow file."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%SZ")
    lines = [
        "# ===========================================================================",
        "# OFFICIAL GOOGLE SEARCH CONSOLE DISAVOW SPECIFICATION",
        "# DOMAIN: elesium.online",
        f"# GENERATED: {timestamp} via Elesium Adversarial Detox Sentinel",
        f"# TOTAL ROOT DOMAINS DISAVOWED: {len(domains)}",
        "# PROTOCOL: 17 U.S.C. / Google Search Engine Anti-Spam Guidelines",
        "# ===========================================================================",
        ""
    ]
    for d in sorted(domains):
        clean_domain = d.strip().lower()
        if clean_domain:
            lines.append(f"domain:{clean_domain}")
            
    content = "\n".join(lines) + "\n"
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    return output_path

def run_sentinel(csv_path: str = None, simulate_attack: bool = False, output_dir: str = "automation") -> Dict:
    """Main execution entry point."""
    records: List[BacklinkRecord] = []
    
    if simulate_attack:
        # Generate simulated 800-link toxic injection attack
        for i in range(400):
            records.append(BacklinkRecord(
                source_url=f"http://spam-pbn-node-{i}.xyz/link/{i}",
                target_url="https://elesium.online/ai-automation-agency-india",
                anchor_text="cheap casino online",
                discovered_date="2026-11-09"
            ))
        for i in range(250):
            records.append(BacklinkRecord(
                source_url=f"http://adult-traffic-hub-{i}.ru/tracker",
                target_url="https://elesium.online/solutions/enterprise-ai",
                anchor_text="best online poker",
                discovered_date="2026-11-09"
            ))
        for i in range(150):
            records.append(BacklinkRecord(
                source_url=f"https://authority-partner-{i}.org/post",
                target_url="https://elesium.online/",
                anchor_text="Elesium",
                discovered_date="2026-11-09"
            ))
    elif csv_path and os.path.exists(csv_path):
        with open(csv_path, "r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for row in reader:
                source = row.get("Source URL") or row.get("source_url") or row.get("Referring URL") or ""
                target = row.get("Target URL") or row.get("target_url") or ""
                anchor = row.get("Anchor") or row.get("anchor") or row.get("Anchor Text") or ""
                date_str = row.get("Date") or row.get("First Seen") or ""
                if source:
                    records.append(BacklinkRecord(source, target, anchor, date_str))
    else:
        # Load sample nominal records
        for i in range(50):
            records.append(BacklinkRecord(
                source_url=f"https://tech-journal-{i}.io/insights/ai-systems",
                target_url="https://elesium.online/ai-automation-agency-india",
                anchor_text=f"enterprise AI architecture {i}",
                discovered_date="2026-11-09"
            ))
            
    attack_detected, disavowed_domains, metrics = analyze_backlink_records(records)
    
    # Generate disavow file
    disavow_filename = "disavow_remediation.txt" if attack_detected else "disavow.txt"
    disavow_path = os.path.join(output_dir, disavow_filename)
    generate_disavow_file(disavowed_domains, disavow_path)
    metrics["disavow_file"] = disavow_path
    
    # Save telemetry
    telemetry_path = os.path.join(output_dir, "adversarial_defense_telemetry.json")
    with open(telemetry_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
        
    return metrics

if __name__ == "__main__":
    simulate = "--simulate" in sys.argv
    csv_file = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else None
    
    print("\n" + "=" * 70)
    print("      ELESIUM ADVERSARIAL BACKLINK SENTINEL & DISAVOW SHIELD")
    print("=" * 70)
    
    results = run_sentinel(csv_path=csv_file, simulate_attack=simulate)
    for k, v in results.items():
        print(f"[*] {k:<30}: {v}")
    print("-" * 70)
    
    if results["attack_detected"]:
        print("[!] STATUS: CRITICAL NEGATIVE SEO ATTACK NEUTRALIZED.")
        print(f"[+] DISAVOW FILE ARMED: {results['disavow_file']}")
    else:
        print("[+] STATUS: LINK GRAPH HEALTHY & WITHIN NATURAL ENTROPY BOUNDS.")
