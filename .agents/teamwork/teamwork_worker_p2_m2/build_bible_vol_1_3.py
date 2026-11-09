#!/usr/bin/env python3
"""
Builder and verifier for bible_vol_1_3.md
Generates high-density, deeply grounded, micro-paragraphed technical text
with high burstiness sigma (>= 8.0), low adjective density (<= 7.0%),
zero banned AI slop words, and >= 10,200 words.
"""

import sys
import re
import math
from pathlib import Path

# Add project root to path for imports
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

from automation.evaluate_phase2_deliverables import (
    evaluate_phase2_file,
    ALL_BANNED_WORDS,
    ADJECTIVE_SUFFIXES,
    ADJECTIVE_EXCLUSIONS
)

def check_text(text: str):
    # Check banned words
    findings = []
    for word in ALL_BANNED_WORDS:
        pat = re.compile(r"\b" + re.escape(word) + r"\b", re.IGNORECASE)
        for idx, line in enumerate(text.splitlines(), 1):
            if pat.search(line):
                findings.append((idx, word, line.strip()))
    
    # Check cadence
    clean_text = re.sub(r"#+.*", "", text)
    clean_text = re.sub(r"```.*?```", "", clean_text, flags=re.DOTALL)
    clean_text = re.sub(r"\[.*?\]\(.*?\)", "", clean_text)
    clean_text = re.sub(r"[*_`|]", "", clean_text)
    
    raw_sentences = re.split(r"(?<=[.!?])\s+", clean_text)
    sentences = [s.strip() for s in raw_sentences if len(s.strip().split()) >= 3]
    words = re.findall(r"\b[A-Za-z0-9_\-]+\b", clean_text)
    
    if sentences:
        lengths = [len(s.split()) for s in sentences]
        mean_len = sum(lengths) / len(lengths)
        variance = sum((l - mean_len) ** 2 for l in lengths) / len(lengths)
        std_dev = math.sqrt(variance)
    else:
        mean_len, std_dev = 0, 0
        
    adj_count = 0
    for w in words:
        wl = w.lower()
        if wl in ADJECTIVE_EXCLUSIONS:
            continue
        if wl.endswith(ADJECTIVE_SUFFIXES):
            adj_count += 1
    adj_density = (adj_count / len(words) * 100.0) if words else 0.0
    
    total_words = len(text.split())
    
    print(f"Total Words: {total_words}")
    print(f"Sentences: {len(sentences)}, Mean Length: {mean_len:.2f}, Sigma: {std_dev:.2f}")
    print(f"Words for Adj: {len(words)}, Adjectives: {adj_count}, Density: {adj_density:.2f}%")
    print(f"Banned Words Hits: {len(findings)}")
    for f in findings[:10]:
        print(f"  Line {f[0]}: '{f[1]}' -> {f[2][:60]}")
    return len(findings) == 0 and total_words >= 10000 and std_dev >= 8.0 and adj_density <= 7.0

print("Helper imported successfully")
