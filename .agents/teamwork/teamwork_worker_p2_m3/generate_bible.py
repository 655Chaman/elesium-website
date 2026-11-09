#!/usr/bin/env python3
"""
generate_bible.py
Script to author SEO SOURCE/phase2/bible_vol_4_6.md
Ensures:
- 10,000+ words
- Zero banned AI slop words (checked against evaluator dictionary)
- Micro-paragraphs (<= 3 sentences per paragraph)
- High burstiness (sigma >= 8.0)
- Low adjective density (<= 7.0%)
- Reciprocal link to ./index.md
- Grounded in Phase 1 modules (06, 07, 08, 09, 01)
"""

import sys
import re
from pathlib import Path

# Evaluator Banned words list
BANNED_WORDS = [
    "delve into", "delve", "tapestry of solutions", "tapestry", "beacon of", "beacon",
    "crucible of", "crucible", "dance of", "symphony of", "symphony", "realm of", "realm",
    "uncharted waters", "north star", "lighthouse", "cornerstone", "bedrock",
    "springboard", "nexus", "digital ecosystem", "labyrinth", "panoply",
    "kaleidoscope", "mirage", "renaissance",
    "seamlessly integrated", "seamlessly", "seamless", "groundbreaking",
    "cutting-edge", "bespoke", "revolutionary", "game-changer", "game-changing",
    "meticulous", "meticulously", "pioneering", "monumental", "testament to", "testament",
    "multifaceted", "paramount", "quintessential", "indispensable", "holistic",
    "robust", "frictionless", "unparalleled", "unrivaled", "unassailable",
    "state-of-the-art", "hyper-scalable", "world-class", "next-generation", "unprecedented",
    "revolutionize", "elevate", "unlock", "harness the power of", "harnessing", "harness",
    "foster", "spearhead", "unleash", "unleashing", "embark upon", "embark", "embarks",
    "navigate", "empower", "illuminate", "demystify", "supercharge", "streamline",
    "transform", "transformative", "catalyze", "galvanize", "transcend",
    "in today's fast-paced world", "in today's fast-paced digital world", "in today's digital age",
    "in the ever-evolving landscape", "look no further",
    "it's important to remember", "it is worth noting that", "it is worth noting",
    "at the forefront of", "push the envelope", "dive deep into", "dive deep",
    "without further ado", "the holy grail of", "the holy grail",
    "take your business to the next level", "a myriad of", "plethora of",
    "in conclusion", "in summary", "needless to say", "it goes without saying",
    "as an ai language model", "test the waters", "double down on", "par for the course",
    "paradigm shift", "synergy", "synergies", "disruptive innovation",
    "future-proof", "turnkey solution", "thought leadership", "value proposition",
    "core competency", "mission-critical", "low-hanging fruit", "move the needle",
    "wheelhouse", "boil the ocean", "table stakes", "flywheel effect",
    "bandwidth", "circle back", "touch base", "deep dive", "magic bullet", "silver bullet",
    "sovereign", "deterministic", "catastrophic", "ephemeral", "impenetrable", "synergistic", "vibrant tapestry"
]

def check_slop(text):
    hits = []
    for w in BANNED_WORDS:
        pattern = re.compile(r"\b" + re.escape(w) + r"\b", re.IGNORECASE)
        for m in pattern.finditer(text):
            hits.append((w, m.start()))
    return hits

print("Banned words check helper defined.")
