#!/usr/bin/env python3
"""
video_script_generator.py

Automates the production of Chad Michael 30-second vertical short-form video scripts
grounded in Google Vision entities, 3-prompt avatar consistency locking, and VideoObject schema.
"""

import os
import json
import argparse
from pathlib import Path

BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SCRIPTS_DIR = BASE_DIR / "automation" / "video_scripts"

AVATAR_CONSISTENCY_RECIPE = """# 3-Prompt Avatar Consistency Lock Recipe (Chad Michael Framework)

### Prompt 1: Persona & Character Definition (The Anchor Sheet)
"Ultra-realistic portrait photography of a 32-year-old South Asian male enterprise AI systems architect, short clean fade haircut, minimalist matte-black crewneck sweater, focused authoritative demeanor, seated at a modern dark concrete desk with soft ambient blue edge lighting, studio 85mm f/1.8 lens, shallow depth of field, 8k resolution, raw photo."

### Prompt 2: Multi-Angle Spatial Headshots
"Same character from Prompt 1: Generate 4 coherent camera angles maintaining identical facial bone structure, skin tone, and hairline:
1. Front-facing eye-level direct to camera (medium close-up)
2. 45-degree angle looking slightly off-camera toward an unseen monitor
3. Over-the-shoulder view with modern terminal code visible on display
4. Side profile with subtle rim lighting from workstation display"

### Prompt 3: LoRA / Seed Lock for Video Rendering
"Lock facial identity mesh with 0.85 face weight. Animate speech phonemes from audio transcript with natural micro-blinking, subtle head tilt on key technical terms, and zero facial jitter. Wardrobe remains matte-black throughout all scenes."
"""

def generate_video_script(slug: str, keyword: str, title: str = "") -> Path:
    SCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    if not title:
        title = keyword.title()
        
    script_path = SCRIPTS_DIR / f"{slug}.md"
    
    video_schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": f"{title} (30s Architectural Breakdown)",
        "description": f"An architectural breakdown of {keyword} for Indian enterprises, comparing pilot sprints, multi-agent suites, and dedicated pods.",
        "thumbnailUrl": f"https://elesium.online/video_thumbnails/{slug}.jpg",
        "uploadDate": "2026-10-10T08:00:00Z",
        "duration": "PT30S",
        "contentUrl": f"https://elesium.online/videos/{slug}.mp4",
        "embedUrl": f"https://elesium.online/embed/{slug}",
        "transcript": f"Stop paying 15 Lakhs for Zapier workflows that break on high API volumes. Legacy Indian agencies sell wrappers. When your ERP fails, they quote 4 months of billables. Elesium builds deterministic multi-agent pods in your private cloud. BFSI and manufacturing clients hit cash-flow positive ROI in under 90 days. Tap the link to speak directly with an AI systems engineer on WhatsApp."
    }

    content = f"""# 30-Second Short-Form Video Script: {title}

**Target Keyword:** `{keyword}`  
**Target Duration:** Exactly 30.0 Seconds  
**Channel Format:** 9:16 Vertical (YouTube Shorts, LinkedIn Video, Instagram Reels)  
**Conversion Destination:** WhatsApp Engineering Desk (`+91 8317329312`)  

---

## Second-by-Second Production Blueprint

| Timecode | Visual Segment | Spoken Voiceover (High-Ticket Authority) | On-Screen Text Graphic |
| :--- | :--- | :--- | :--- |
| **00 – 03s** | Pattern Interrupt Close-Up: Avatar looks directly into camera with intense focus. | *"Stop paying ₹15 Lakhs for Zapier workflows that break on high API volumes."* | **STOP PAYING ₹15L FOR FRAGILE WRAPPERS** |
| **03 – 08s** | Cutaway B-Roll: Red error console, timeout latency alert over legacy ERP dashboard. | *"Legacy Indian agencies sell wrappers. When your ERP fails, they quote 4 months of billables."* | **LEGACY AGENCIES = 4-MONTH BILLABLE TRAPS** |
| **08 – 18s** | Rapid Cutaways (every 2.5s): LangGraph state machine flow diagram $\\to$ Private VPC terminal. | *"Elesium builds deterministic multi-agent pods in your private cloud with zero data retention."* | **DETERMINISTIC LANGGRAPH PODS // PRIVATE VPC** |
| **18 – 26s** | Proof B-Roll: Production dashboard showing operational hours saved and cash-flow metrics. | *"BFSI & manufacturing clients hit cash-flow positive ROI in under 90 days. Guaranteed by SLA."* | **HARD 90-DAY CASH-FLOW POSITIVE ROI** |
| **26 – 30s** | Avatar Call-to-Action: Direct gaze with on-screen WhatsApp QR code and tap indicator. | *"Tap the link to speak directly with an AI systems engineer on WhatsApp."* | **TAP LINK // DIRECT WHATSAPP DESK (+91 8317329312)** |

---

## Chad Michael Avatar Consistency Lock

{AVATAR_CONSISTENCY_RECIPE}

---

## Embedded VideoObject Schema (Google Discover & Video Carousel Eligible)

```json
{json.dumps(video_schema, indent=2)}
```
"""

    script_path.write_text(content, encoding="utf-8")
    print(f"Generated 30s video script for '{slug}' at {script_path}")
    return script_path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", type=str, default="ai-automation-cost-india-2026-pricing")
    parser.add_argument("--keyword", type=str, default="AI automation cost India")
    parser.add_argument("--title", type=str, default="Enterprise AI Automation Cost in India Explained")
    args = parser.parse_args()
    
    generate_video_script(args.slug, args.keyword, args.title)

if __name__ == "__main__":
    main()
