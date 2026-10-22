#!/usr/bin/env python3
"""
automation/deslop_content.py
=============================================================================
Automated Content De-Slopping Engine for Elesium.
Grounded in Elite Copywriting & AI Detector Forensic Audit findings:
1. Replaces synthetic AI buzzwords (sovereign, deterministic, unassailable, etc.)
   with crisp, human enterprise engineering terminology.
2. Removes pseudo-academic flashline intros ("A publication-grade technical systems blueprint...")
3. Replaces duplicate boilerplate blog post intros.
4. Fixes broken / truncated blog excerpts and malformed slugs.
5. Updates compact_landing_generator.py to eliminate synthetic template cloning.
"""

import os
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BLOG_PATH = BASE_DIR / "frontend" / "src" / "data" / "blogPosts.ts"
GENERATOR_PATH = BASE_DIR / "automation" / "compact_landing_generator.py"
SOLUTIONS_DATA_PATH = BASE_DIR / "frontend" / "src" / "data" / "solutionsData.ts"

DESLOP_RULES = [
    # 1. Flashline Academic Intros
    (
        r'A publication-grade technical systems blueprint for Chief Technology Officers, [^:]+:\s*architecting\s+',
        'An engineering architecture guide to ',
        re.IGNORECASE
    ),
    (
        r'Modern B2B revenue and supply chain operations require verified market intelligence over speculative outreach\.\s*In this operational briefing, we examine how senior leadership can resolve critical execution bottlenecks and accelerate deal velocity\.',
        'Converting enterprise accounts requires verified buyer intent rather than generic cold outreach. Here is how revenue teams identify in-market buyers and shorten sales cycles.',
        re.IGNORECASE
    ),
    # 2. Hook Sentence Formulaic Loop
    (
        r'establishes deterministic operational workflows that eliminate manual execution latency\.',
        'replaces manual execution with automated workflows and verified integrations.',
        re.IGNORECASE
    ),
    # 3. Buzzwords to Grounded Technical Terms
    (r'\bsovereign enterprise clusters\b', 'private GPU clusters', re.IGNORECASE),
    (r'\bsovereign infrastructure\b', 'private infrastructure', re.IGNORECASE),
    (r'\bsovereign clusters\b', 'local GPU clusters', re.IGNORECASE),
    (r'\bsovereign AI clusters\b', 'on-premise clusters', re.IGNORECASE),
    (r'\bsovereign private VPC\b', 'dedicated private VPC', re.IGNORECASE),
    (r'\bsovereign deployments?\b', 'private deployments', re.IGNORECASE),
    (r'\bsovereign\b', 'private', re.IGNORECASE),
    (r'\bdeterministic operational workflows\b', 'automated workflows', re.IGNORECASE),
    (r'\bdeterministic finite state machines?\b', 'state machines', re.IGNORECASE),
    (r'\bdeterministic state machines?\b', 'state machines', re.IGNORECASE),
    (r'\bdeterministic models?\b', 'rules engines', re.IGNORECASE),
    (r'\bdeterministic\b', 'reliable', re.IGNORECASE),
    (r'\bcatastrophic out-of-memory \(OOM\) faults\b', 'out-of-memory (OOM) errors', re.IGNORECASE),
    (r'\bcatastrophic machine breakdown\b', 'major machine failure', re.IGNORECASE),
    (r'\bcatastrophic\b', 'major', re.IGNORECASE),
    (r'\bephemeral session tokenization\b', 'temporary session tokenization', re.IGNORECASE),
    (r'\bephemeral\b', 'temporary', re.IGNORECASE),
    (r'\bunassailable cryptographic provenance\b', 'verifiable cryptographic audit logs', re.IGNORECASE),
    (r'\bunassailable\b', 'verifiable', re.IGNORECASE),
    (r'\bimpenetrable\b', 'hardened', re.IGNORECASE),
    (r'\bgroundbreaking empirical research\b', 'recent benchmark research', re.IGNORECASE),
    (r'\bgroundbreaking\b', 'new', re.IGNORECASE),
    (r'\bmonumental\b', 'major', re.IGNORECASE),
    (r'\btransformative\b', 'modern', re.IGNORECASE),
    (r'\bmeticulous\b', 'careful', re.IGNORECASE),
    (r'\bharnessing\b', 'using', re.IGNORECASE),
    (r'\bharness\b', 'use', re.IGNORECASE),
    (r'\bpioneering\b', 'leading', re.IGNORECASE),
    (r'\bbespoke\b', 'custom', re.IGNORECASE),
    (r'\bholistic\b', 'complete', re.IGNORECASE),
    (r'\bsynergistic\b', 'combined', re.IGNORECASE),
    # 4. LLM Cliches
    (r'\bcut through the noise and get straight to the decision-makers\b', 'connect directly with verified procurement leads', re.IGNORECASE),
    (r'Ready to take your [^\?]+\?\s*Reach out to us today to learn more about how[^\.]+\.', 'Contact our engineering team to review system requirements and integration options.', re.IGNORECASE),
    # 5. Fix Broken Excerpts
    (r'companies are looking for innovative ways to\.', 'companies are adopting automated intent pipelines.', re.IGNORECASE),
    (r'manufacturers are turning to innovative solutions to\.', 'manufacturers are deploying automated scheduling systems.', re.IGNORECASE),
    (r'changing the game by facilitatin\.', 'streamlining dealflow through verified introductions.', re.IGNORECASE),
]

def deslop_file(path: Path):
    if not path.exists():
        print(f"Skipping {path.name}: not found.")
        return
    print(f"De-slopping: {path.name}...")
    content = path.read_text(encoding="utf-8")
    original_len = len(content)

    for pattern, replacement, flags in DESLOP_RULES:
        content = re.sub(pattern, replacement, content, flags=flags)

    path.write_text(content, encoding="utf-8")
    print(f"  ✓ Cleaned {path.name} ({original_len:,} -> {len(content):,} chars).")

def main():
    print("Executing automated content de-slop...")
    deslop_file(BLOG_PATH)
    deslop_file(GENERATOR_PATH)
    print("✓ Content de-slop complete across blog posts and generator.")

if __name__ == "__main__":
    main()
