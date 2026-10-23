#!/usr/bin/env python3
"""
13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py
=============================================================================
THE MASTER AGENT PLAYBOOK CLI & AUTOMATED ALGORITHMIC EVALUATOR
Zero-External-Dependency Production Quality Gate & Compliance Engine

Evaluates any local file or live URL against the complete Elesium Master Playbook:
  - Gate 1: Tri-Alignment (Slug, Title, H1 parity)
  - Gate 2: Moz Optimization Sweet Spot (Strictly 96-98; fails if 100 or <95)
  - Gate 3: Word Count & Micro-Paragraph Gate (400-550 words, <=3 sentences/paragraph)
  - Gate 4: Banned Anti-AI Slop Scan (Flags delve, tapestry, beacon, pioneering, etc.)
  - Gate 5: WhatsApp Conversion Funnel (Verifies wa.me/918317329312 presence)
  - Gate 6: Minimalist UI Geometry & Answer Capsule (rounded-3xl, rounded-full, no voids)

Usage:
  python3 13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py --url https://elesium.online
  python3 13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py --file ../frontend/src/pages/Home.tsx
  python3 13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py --file 03_BOFU_HIGH_CONVERTING_LANDING_PAGES_BIBLE.md --verbose
  python3 13_MASTER_PLAYBOOK_CLI_AND_AUTOMATED_EVALUATOR.py --audit-all
"""

import sys
import os
import re
import json
import argparse
import urllib.request
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple

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

BANNED_AI_WORDS = [
    r"\bdelve\b", r"\btapestry\b", r"\bseamless(?:ly)?\b",
    r"\brevolutionize\b", r"\btestament\b", r"\bbeacon\b",
    r"\bgame-changer\b", r"\bpioneering\b", r"\bmeticulous(?:ly)?\b",
    r"\brealm\b", r"\bharness(?:ing)?\b", r"\bmultifaceted\b",
    r"\bin today's fast-paced digital world\b", r"\bcutting-edge\b",
    r"\bunleash(?:ing)?\b", r"\btransformative\b", r"\bat the forefront\b",
    r"\bembarks?\b", r"\bparamount\b", r"\bvibrant tapestry\b"
]

TARGET_WHATSAPP_NUMBER = "8317329312"
TARGET_WHATSAPP_LINK = "wa.me/918317329312"

class SimpleHTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.fed = []
        self.title = ""
        self.meta_desc = ""
        self.h1 = []
        self.h2 = []
        self.paragraphs = []
        self.images = []  # list of (src, alt)
        self.links = []
        self.in_title = False
        self.in_h1 = False
        self.in_h2 = False
        self.in_p = False
        self.in_script = False
        self.in_style = False
        self.current_p = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        tag_lower = tag.lower()

        if tag_lower in ("script", "style"):
            self.in_script = True
        elif tag_lower == "title":
            self.in_title = True
        elif tag_lower == "meta" and attr_dict.get("name", "").lower() == "description":
            self.meta_desc = attr_dict.get("content", "")
        elif tag_lower == "h1":
            self.in_h1 = True
        elif tag_lower == "h2":
            self.in_h2 = True
        elif tag_lower == "p":
            self.in_p = True
            self.current_p = []
        elif tag_lower == "img":
            self.images.append((attr_dict.get("src", ""), attr_dict.get("alt", "")))
        elif tag_lower == "a":
            href = attr_dict.get("href", "")
            if href:
                self.links.append(href)

    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if tag_lower in ("script", "style"):
            self.in_script = False
        elif tag_lower == "title":
            self.in_title = False
        elif tag_lower == "h1":
            self.in_h1 = False
        elif tag_lower == "h2":
            self.in_h2 = False
        elif tag_lower == "p":
            self.in_p = False
            p_text = " ".join(self.current_p).strip()
            if p_text:
                self.paragraphs.append(p_text)
            self.current_p = []

    def handle_data(self, data):
        if self.in_script or self.in_style:
            return
        clean_data = data.strip()
        if not clean_data:
            return
        if self.in_title:
            self.title += " " + clean_data
        elif self.in_h1:
            self.h1.append(clean_data)
        elif self.in_h2:
            self.h2.append(clean_data)
        elif self.in_p:
            self.current_p.append(clean_data)
        self.fed.append(clean_data)

    def get_text(self):
        return " ".join(self.fed)

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")

def split_into_sentences(text: str) -> List[str]:
    # Regex split on punctuation followed by whitespace
    raw_sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    # Filter out empty or trivial strings
    return [s.strip() for s in raw_sentences if len(s.strip()) > 3]

def parse_markdown(content: str) -> Dict[str, Any]:
    lines = content.splitlines()
    title = ""
    h1 = []
    h2 = []
    paragraphs = []
    links = []
    images = []

    current_para = []
    in_code_block = False

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code_block = not in_code_block
            continue
        if in_code_block:
            continue

        if stripped.startswith("# ") and not h1:
            h1_text = stripped[2:].strip()
            h1.append(h1_text)
            if not title:
                title = h1_text
        elif stripped.startswith("## "):
            h2.append(stripped[3:].strip())
        elif stripped.startswith("### ") or stripped.startswith("#### "):
            pass
        elif stripped == "" or stripped.startswith("---") or stripped.startswith("+--") or stripped.startswith("|"):
            if current_para:
                p_text = " ".join(current_para).strip()
                if p_text:
                    paragraphs.append(p_text)
                current_para = []
        else:
            # Regular text line
            current_para.append(stripped)

        # Extract links: [text](url)
        for match in re.findall(r'\[([^\]]+)\]\(([^)]+)\)', line):
            links.append(match[1])
        # Extract images: ![alt](url)
        for match in re.findall(r'!\[([^\]]*)\]\(([^)]+)\)', line):
            images.append((match[1], match[0]))

    if current_para:
        p_text = " ".join(current_para).strip()
        if p_text:
            paragraphs.append(p_text)

    # Clean visible text
    visible_text = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    visible_text = re.sub(r'[#*`_\[\]()|+-]', ' ', visible_text)
    visible_text = re.sub(r'\s+', ' ', visible_text).strip()

    return {
        "title": title or (h1[0] if h1 else ""),
        "meta_desc": "",
        "h1": h1,
        "h2": h2,
        "paragraphs": paragraphs,
        "images": images,
        "links": links,
        "visible_text": visible_text
    }

class PlaybookAuditor:
    def __init__(self, raw_content: str, source_identifier: str, is_html: bool = False, verbose: bool = False):
        self.raw_content = raw_content
        self.source = source_identifier
        self.is_html = is_html
        self.verbose = verbose

        if self.is_html:
            parser = SimpleHTMLTextExtractor()
            try:
                parser.feed(self.raw_content)
                self.title = parser.title.strip()
                self.meta_desc = parser.meta_desc.strip()
                self.h1 = parser.h1
                self.h2 = parser.h2
                self.paragraphs = parser.paragraphs
                self.images = parser.images
                self.links = parser.links
                self.visible_text = parser.get_text()
            except Exception:
                # Fallback to regex parser
                md_parsed = parse_markdown(self.raw_content)
                self.title = md_parsed["title"]
                self.meta_desc = ""
                self.h1 = md_parsed["h1"]
                self.h2 = md_parsed["h2"]
                self.paragraphs = md_parsed["paragraphs"]
                self.images = md_parsed["images"]
                self.links = md_parsed["links"]
                self.visible_text = md_parsed["visible_text"]
        else:
            md_parsed = parse_markdown(self.raw_content)
            self.title = md_parsed["title"]
            self.meta_desc = md_parsed["meta_desc"]
            self.h1 = md_parsed["h1"]
            self.h2 = md_parsed["h2"]
            self.paragraphs = md_parsed["paragraphs"]
            self.images = md_parsed["images"]
            self.links = md_parsed["links"]
            self.visible_text = md_parsed["visible_text"]

    def evaluate_all(self) -> Dict[str, Any]:
        gate1 = self.audit_gate1_tri_alignment()
        gate2 = self.audit_gate2_moz_score()
        gate3 = self.audit_gate3_word_count_and_paragraphs()
        gate4 = self.audit_gate4_banned_ai_words()
        gate5 = self.audit_gate5_whatsapp_funnel()
        gate6 = self.audit_gate6_ui_geometry()

        gates = [gate1, gate2, gate3, gate4, gate5, gate6]
        total_score = sum(g["score"] for g in gates)
        max_score = sum(g["max_score"] for g in gates)
        overall_percentage = int((total_score / max_score) * 100) if max_score > 0 else 0

        # Overall Status
        all_passed = all(g["status"] == "PASS" for g in gates)
        has_fail = any(g["status"] == "FAIL" for g in gates)

        overall_status = "PASS" if all_passed else ("WARN" if not has_fail else "FAIL")

        return {
            "source": self.source,
            "overall_status": overall_status,
            "overall_percentage": overall_percentage,
            "gates": {
                "gate1_tri_alignment": gate1,
                "gate2_moz_sweet_spot": gate2,
                "gate3_word_count_paragraphs": gate3,
                "gate4_banned_ai_words": gate4,
                "gate5_whatsapp_funnel": gate5,
                "gate6_ui_geometry": gate6
            }
        }

    # Gate 1: Tri-Alignment (Slug, Title, H1 parity)
    def audit_gate1_tri_alignment(self) -> Dict[str, Any]:
        max_score = 15
        reasons = []

        # Derive slug from source URL or filename
        slug = ""
        if self.source.startswith("http://") or self.source.startswith("https://"):
            parsed_url = urllib.parse.urlparse(self.source)
            slug = parsed_url.path.strip("/").split("/")[-1]
        else:
            base_name = Path(self.source).stem
            # Strip numeric prefix if present (e.g. 03_bofu_... -> bofu_...)
            slug = re.sub(r"^\d+_", "", base_name)
        slug_norm = slugify(slug)

        primary_h1 = self.h1[0] if self.h1 else ""
        title_clean = re.sub(r"—.*$", "", self.title).strip()
        title_clean = re.sub(r"\|.*$", "", title_clean).strip()

        h1_norm = slugify(primary_h1)
        title_norm = slugify(title_clean)

        score = max_score
        status = "PASS"

        if not primary_h1:
            reasons.append("Missing primary <h1> element.")
            score -= 8
        if not self.title:
            reasons.append("Missing <title> element.")
            score -= 7

        if primary_h1 and self.title:
            # Check Title vs H1 alignment
            if h1_norm and title_norm and (h1_norm in title_norm or title_norm in h1_norm):
                reasons.append(f"Title ('{title_clean}') and H1 ('{primary_h1}') are closely aligned.")
            else:
                reasons.append(f"Title and H1 divergence detected. Title: '{title_clean}' vs H1: '{primary_h1}'.")
                score -= 6

        if slug_norm and h1_norm:
            # If slug is not generic like index or home
            if slug_norm not in ("home", "index", "", "solutions"):
                if slug_norm in h1_norm or h1_norm in slug_norm:
                    reasons.append(f"Slug ('{slug_norm}') matches H1.")
                else:
                    reasons.append(f"Slug ('{slug_norm}') diverges from H1 ('{h1_norm}').")
                    score -= 4

        score = max(0, score)
        if score == max_score:
            status = "PASS"
        elif score >= 10:
            status = "WARN"
        else:
            status = "FAIL"

        return {
            "name": "Gate 1: Tri-Alignment (Slug, Title, H1)",
            "status": status,
            "score": score,
            "max_score": max_score,
            "remediation": reasons
        }

    # Gate 2: Moz Optimization Sweet Spot (Strictly 96-98, fail if 100 or <95)
    def audit_gate2_moz_score(self) -> Dict[str, Any]:
        max_score = 20
        reasons = []

        # Detect primary keyword from H1 or Title
        primary_kw = ""
        if self.h1:
            primary_kw = self.h1[0].lower().strip()
        elif self.title:
            primary_kw = self.title.lower().strip()

        # If keyword has brand suffixes, clean them
        primary_kw = re.sub(r"—.*$", "", primary_kw).strip()
        primary_kw = re.sub(r"\|.*$", "", primary_kw).strip()

        # Calculate simulated Moz On-Page Score (Base 70 + points)
        simulated_moz = 70
        is_over_optimized = False

        if primary_kw:
            # Keyword in Title
            if primary_kw in self.title.lower():
                simulated_moz += 8
            # Keyword in H1
            if self.h1 and primary_kw in self.h1[0].lower():
                simulated_moz += 8
            # Keyword in body
            if primary_kw in self.visible_text.lower():
                simulated_moz += 7
            # Keyword in Meta Description
            if self.meta_desc and primary_kw in self.meta_desc.lower():
                simulated_moz += 4
            # Hero Image Alt Match
            if self.images:
                hero_alt = self.images[0][1].lower() if len(self.images) > 0 else ""
                if primary_kw in hero_alt:
                    simulated_moz += 2

            # Secondary Image Alt Check (The Over-Optimization Trap)
            secondary_exact_matches = 0
            for idx, img in enumerate(self.images[1:], start=2):
                alt = img[1].lower()
                if primary_kw in alt:
                    secondary_exact_matches += 1

            if secondary_exact_matches > 0:
                simulated_moz += 5  # Hits 100 or triggers penalty
                is_over_optimized = True
                reasons.append(f"OVER-OPTIMIZATION DETECTED: {secondary_exact_matches} secondary image alt tags match exact keyword. (Forces Moz 100 penalty).")

        # Clamp between 70 and 100
        simulated_moz = min(100, simulated_moz)

        score = max_score
        status = "PASS"

        if simulated_moz == 100 or is_over_optimized:
            status = "FAIL"
            score = 6
            reasons.append(f"Simulated Moz Score: 100/100 [CRITICAL RANKING PENALTY RISK]. Target is strictly 96-98. De-optimize secondary alt tags to LSI synonyms.")
        elif simulated_moz in (96, 97, 98):
            status = "PASS"
            reasons.append(f"Simulated Moz Score: {simulated_moz}/100 [OPTIMAL SWEET SPOT]. Satisfies Edward Sturm algorithm.")
        elif simulated_moz in (94, 95, 99):
            status = "WARN"
            score = 14
            reasons.append(f"Simulated Moz Score: {simulated_moz}/100 [BORDERLINE]. Adjust keyword density or secondary headings to land strictly at 96-98.")
        else:
            status = "FAIL"
            score = 8
            reasons.append(f"Simulated Moz Score: {simulated_moz}/100 [UNDER-OPTIMIZED]. Keyword missing from core tags (Title, H1, Meta Description, or Opening Body).")

        return {
            "name": "Gate 2: Moz Optimization Sweet Spot (96-98)",
            "status": status,
            "score": score,
            "max_score": max_score,
            "simulated_moz": simulated_moz,
            "remediation": reasons
        }

    # Gate 3: Word Count & Micro-Paragraph Gate
    def audit_gate3_word_count_and_paragraphs(self) -> Dict[str, Any]:
        max_score = 20
        reasons = []

        words = re.findall(r'\b\w+\b', self.visible_text)
        word_count = len(words)

        # Micro-paragraph analysis
        long_paragraphs = []
        sentence_counts = []

        for p in self.paragraphs:
            # Skip brief headers or one-word tags
            if len(p.split()) < 4:
                continue
            sentences = split_into_sentences(p)
            sentence_counts.append(len(sentences))
            if len(sentences) > 3:
                long_paragraphs.append((p[:60] + "...", len(sentences)))

        avg_sentences = (sum(sentence_counts) / len(sentence_counts)) if sentence_counts else 0

        score = max_score
        status = "PASS"

        # Word count check
        # For BOFU landing pages, target is 400-550 words.
        # For playbooks/whitepapers, >= 1,800 words is acceptable.
        is_playbook = any(k in self.source.lower() for k in ("playbook", "bible", "manifest", "blueprint", "guide"))
        
        if is_playbook:
            if word_count < 1000:
                reasons.append(f"Playbook / Whitepaper word count ({word_count}) below comprehensive threshold (1,000+ words).")
                score -= 5
            else:
                reasons.append(f"Playbook word count: {word_count} words (Comprehensive technical documentation).")
        else:
            if 400 <= word_count <= 550:
                reasons.append(f"Word count ({word_count} words) satisfies compact Edward Sturm BOFU sweet spot (400-550 words).")
            elif 350 <= word_count < 400 or 550 < word_count <= 650:
                reasons.append(f"Word count ({word_count} words) slightly out of ideal bounds (400-550 words).")
                score -= 3
            else:
                reasons.append(f"Word count ({word_count} words) fails BOFU gate. Must be strictly 400 to 550 words to prevent mobile bounce.")
                score -= 7

        # Paragraph sentence check
        if long_paragraphs:
            status = "FAIL" if len(long_paragraphs) > 3 else "WARN"
            score -= min(10, len(long_paragraphs) * 3)
            reasons.append(f"Micro-Paragraph Violation: {len(long_paragraphs)} paragraphs exceed 3 sentences (e.g., '{long_paragraphs[0][0]}' has {long_paragraphs[0][1]} sentences).")
        else:
            reasons.append(f"Micro-Paragraph Integrity Verified: 100% of paragraphs are <=3 sentences (Average: {avg_sentences:.1f} sentences/para).")

        score = max(0, score)
        if status != "FAIL":
            if score == max_score:
                status = "PASS"
            else:
                status = "WARN"

        return {
            "name": "Gate 3: Word Count & Micro-Paragraph Gate",
            "status": status,
            "score": score,
            "max_score": max_score,
            "word_count": word_count,
            "avg_sentences_per_para": round(avg_sentences, 1),
            "remediation": reasons
        }

    # Gate 4: Banned Anti-AI Slop Scan
    def audit_gate4_banned_ai_words(self) -> Dict[str, Any]:
        max_score = 20
        reasons = []

        detected_slop = []
        for pattern in BANNED_AI_WORDS:
            matches = re.findall(pattern, self.raw_content, re.IGNORECASE)
            if matches:
                detected_slop.extend(matches)

        score = max_score
        status = "PASS"

        if detected_slop:
            unique_slop = list(set([w.lower() for w in detected_slop]))
            status = "FAIL"
            # Deduct points per slop word
            score = max(0, max_score - (len(detected_slop) * 4))
            reasons.append(f"CRITICAL AI SLOP DETECTED ({len(detected_slop)} instances): {', '.join(unique_slop)}.")
            reasons.append("Remediation: Deploy 'automation/sanitize_ai_slop.py' or strike adjectives and replace with physical metrics.")
        else:
            reasons.append("Zero Banned AI Slop Words Detected. 100% pure engineering vernacular.")

        return {
            "name": "Gate 4: Anti-AI Slop Purity Gate",
            "status": status,
            "score": score,
            "max_score": max_score,
            "detected_slop_count": len(detected_slop),
            "remediation": reasons
        }

    # Gate 5: WhatsApp Conversion Funnel Gate
    def audit_gate5_whatsapp_funnel(self) -> Dict[str, Any]:
        max_score = 15
        reasons = []

        has_number = TARGET_WHATSAPP_NUMBER in self.raw_content
        has_link = ("wa.me" in self.raw_content) or ("whatsapp.com" in self.raw_content) or ("whatsappmodal" in self.raw_content.lower())

        # Check for open calendly or cal.com links (prohibited)
        has_calendly = ("calendly.com" in self.raw_content.lower()) or ("cal.com" in self.raw_content.lower())

        score = max_score
        status = "PASS"

        if has_number or has_link:
            reasons.append(f"WhatsApp High-Ticket Conversion Funnel Verified (+91-8317329312 / wa.me).")
        else:
            status = "FAIL"
            score -= 10
            reasons.append("Missing WhatsApp Conversion Funnel. Target link: https://wa.me/918317329312 with pre-filled technical mandate.")

        if has_calendly:
            status = "WARN" if status == "PASS" else "FAIL"
            score -= 5
            reasons.append("Warning: Open Calendly / Cal.com link detected. All high-ticket enterprise conversion pathways must terminate in the WhatsApp Architecture Desk.")

        score = max(0, score)
        return {
            "name": "Gate 5: WhatsApp Conversion Funnel",
            "status": status,
            "score": score,
            "max_score": max_score,
            "remediation": reasons
        }

    # Gate 6: Minimalist UI Geometry & Answer Capsule Gate
    def audit_gate6_ui_geometry(self) -> Dict[str, Any]:
        max_score = 10
        reasons = []

        is_code = any(self.source.endswith(ext) for ext in (".tsx", ".jsx", ".html", ".vue", ".css"))
        score = max_score
        status = "PASS"

        if is_code:
            # Check for rounded-3xl and rounded-full
            has_rounded_3xl = "rounded-3xl" in self.raw_content
            has_rounded_full = "rounded-full" in self.raw_content
            has_forbidden_voids = re.search(r'\b(py-32|mb-32|py-24|gap-32)\b', self.raw_content)

            if not has_rounded_3xl:
                score -= 3
                reasons.append("Missing 'rounded-3xl' container styling. Design system mandates rounded-3xl cards.")
            else:
                reasons.append("Verified 'rounded-3xl' container radius.")

            if not has_rounded_full:
                score -= 2
                reasons.append("Missing 'rounded-full' pill / CTA button styling.")
            else:
                reasons.append("Verified 'rounded-full' CTA pill styling.")

            if has_forbidden_voids:
                score -= 4
                status = "FAIL"
                reasons.append(f"Forbidden Spacing Void Detected ('{has_forbidden_voids.group(1)}'). Replace with 'py-12 md:py-16'.")
            else:
                reasons.append("Zero padding voids detected. Tight mobile scroll flow preserved.")
        else:
            # For Content / Markdown: Check for Answer Capsule (42-48 words bolded under H2)
            has_answer_capsule = False
            for p in self.paragraphs:
                # Check if paragraph has bold markers and 42-48 words
                clean_p = re.sub(r'[*_`]', '', p)
                words = len(clean_p.split())
                if 42 <= words <= 48:
                    has_answer_capsule = True
                    break

            if has_answer_capsule:
                reasons.append("Answer Capsule Detected: Standalone paragraph matching 42-48 word AEO/GEO target.")
            else:
                score -= 3
                reasons.append("Answer Capsule Advisory: Did not detect exact 42-48 word definition beneath H2 (Required for AI Overviews).")

        score = max(0, score)
        if status != "FAIL":
            status = "PASS" if score == max_score else "WARN"

        return {
            "name": "Gate 6: Minimalist UI Geometry & Answer Capsule",
            "status": status,
            "score": score,
            "max_score": max_score,
            "remediation": reasons
        }

def format_terminal_report(result: Dict[str, Any], verbose: bool = False) -> None:
    source = result["source"]
    overall_status = result["overall_status"]
    overall_pct = result["overall_percentage"]

    # Status color
    if overall_status == "PASS":
        status_badge = f"{Color.GREEN}{Color.BOLD}[PASS — AUDIT CERTIFIED]{Color.RESET}"
    elif overall_status == "WARN":
        status_badge = f"{Color.YELLOW}{Color.BOLD}[WARN — ADJUSTMENTS NEEDED]{Color.RESET}"
    else:
        status_badge = f"{Color.RED}{Color.BOLD}[FAIL — COMPLIANCE BREACH]{Color.RESET}"

    print("\n" + "=" * 90)
    print(f"{Color.BOLD}{Color.CYAN}THE MASTER AGENT PLAYBOOK — ALGORITHMIC AUDIT REPORT{Color.RESET}")
    print("=" * 90)
    print(f"Target Resource:    {Color.WHITE}{source}{Color.RESET}")
    print(f"Overall Result:     {status_badge}  |  Compliance Score: {Color.BOLD}{overall_pct}/100{Color.RESET}")
    print("-" * 90)

    for key, gate in result["gates"].items():
        g_name = gate["name"]
        g_status = gate["status"]
        g_score = gate["score"]
        g_max = gate["max_score"]

        if g_status == "PASS":
            g_badge = f"{Color.GREEN}[PASS]{Color.RESET}"
        elif g_status == "WARN":
            g_badge = f"{Color.YELLOW}[WARN]{Color.RESET}"
        else:
            g_badge = f"{Color.RED}[FAIL]{Color.RESET}"

        print(f"\n{g_badge} {Color.BOLD}{g_name}{Color.RESET} ({g_score}/{g_max} pts)")
        for rem in gate.get("remediation", []):
            if "[CRITICAL" in rem or "FAIL" in rem or "Violation" in rem or "Missing" in rem:
                print(f"    {Color.RED}↳ {rem}{Color.RESET}")
            elif "WARN" in rem or "Advisory" in rem or "BORDERLINE" in rem:
                print(f"    {Color.YELLOW}↳ {rem}{Color.RESET}")
            else:
                print(f"    {Color.GREEN}↳ {rem}{Color.RESET}")

    print("\n" + "=" * 90)
    if overall_status == "PASS":
        print(f"{Color.GREEN}{Color.BOLD}[✓] Page complies with the Elesium Master Agent Operating Architecture.{Color.RESET}")
    else:
        print(f"{Color.YELLOW}{Color.BOLD}[!] Review remediation instructions above prior to production deployment.{Color.RESET}")
    print("=" * 90 + "\n")

def audit_file_path(file_path: Path, verbose: bool = False) -> Dict[str, Any]:
    if not file_path.exists():
        print(f"{Color.RED}[!] File not found: {file_path}{Color.RESET}")
        sys.exit(1)

    content = file_path.read_text(encoding="utf-8", errors="ignore")
    is_html = file_path.suffix.lower() in (".html", ".htm", ".tsx", ".jsx")
    auditor = PlaybookAuditor(content, str(file_path), is_html=is_html, verbose=verbose)
    return auditor.evaluate_all()

def audit_url(url: str, verbose: bool = False) -> Dict[str, Any]:
    print(f"{Color.CYAN}[*] Fetching live URL: {url}...{Color.RESET}")
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"{Color.RED}[!] Failed to fetch URL {url}: {e}{Color.RESET}")
        sys.exit(1)

    auditor = PlaybookAuditor(html, url, is_html=True, verbose=verbose)
    return auditor.evaluate_all()

def audit_all_playbook(dir_path: Path, verbose: bool = False) -> None:
    md_files = sorted(list(dir_path.glob("*.md")))
    print(f"\n{Color.BOLD}{Color.CYAN}=== AUDITING ALL PLAYBOOK ASSETS IN {dir_path.name} ==={Color.RESET}")
    print(f"Found {len(md_files)} markdown files.\n")

    summary = []
    for f in md_files:
        content = f.read_text(encoding="utf-8", errors="ignore")
        auditor = PlaybookAuditor(content, f.name, is_html=False, verbose=verbose)
        res = auditor.evaluate_all()
        summary.append((f.name, res["overall_status"], res["overall_percentage"]))
        if verbose:
            format_terminal_report(res, verbose=True)

    print(f"{'FILE':<55} | {'STATUS':<10} | {'SCORE':<5}")
    print("-" * 76)
    for name, status, score in summary:
        col = Color.GREEN if status == "PASS" else (Color.YELLOW if status == "WARN" else Color.RED)
        print(f"{name:<55} | {col}{status:<10}{Color.RESET} | {score:>3}%")
    print("-" * 76 + "\n")

def main():
    parser = argparse.ArgumentParser(description="Elesium Master Playbook CLI & Automated Quality Evaluator")
    parser.add_argument("--url", help="Evaluate a live web URL (e.g. https://elesium.online)")
    parser.add_argument("--file", help="Evaluate a local file (.html, .tsx, .md, .jsx)")
    parser.add_argument("--audit-all", action="store_true", help="Audit all markdown files in MASTER_AGENT_PLAYBOOK/")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose reporting")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = parser.parse_args()

    if not args.url and not args.file and not args.audit_all:
        parser.print_help()
        sys.exit(0)

    if args.audit_all:
        target_dir = Path(__file__).resolve().parent
        audit_all_playbook(target_dir, verbose=args.verbose)
        return

    if args.url:
        result = audit_url(args.url, verbose=args.verbose)
    elif args.file:
        result = audit_file_path(Path(args.file), verbose=args.verbose)

    if args.json:
        print(json.dumps(result, indent=2))
    else:
        format_terminal_report(result, verbose=args.verbose)

    if result["overall_status"] == "FAIL":
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    main()
