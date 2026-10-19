#!/usr/bin/env python3
"""
product_hunt_launcher.py — Product Hunt & BetaList Launch Asset Generator for Elesium Micro-SaaS
==============================================================================================
Framework: Edward Sturm Complete Masterclass (Modules 11 & 12: Micro-SaaS Launch Engine)
Target: Elesium Enterprise AI ROI Calculator (/tools/enterprise-ai-roi-calculator)
Embed Route: /embed/roi-calculator

Key Capabilities:
1. Product Hunt Complete Asset Generation:
   - Tagline with strict character count assertion (< 60 chars).
   - Authoritative Maker Comment by Chaman Shah (Principal AI Systems Architect).
   - High-converting gallery asset dimensions and visual wireframe specs (5 slides + thumbnail).
   - Hour-by-hour launch day execution protocol (PST timezone schedule).
2. Multi-Channel Launch Outreach Suite:
   - 6-Tweet viral Twitter/X announcement thread with live links and hard metrics.
   - LinkedIn executive thought-leadership launch post.
   - Technical community copy for Slack, Discord (LangChain, AI Engineers), and Indie Hackers.
   - VIP 1-on-1 CTO & Founder outreach template.
3. BetaList & Early-Stage Directory Bundle:
   - Formatted submission payload matching BetaList strict submission guidelines.
4. Export Suite & Programmatic Validation:
   - Exports JSON bundle and structured markdown playbooks.
   - Built-in self-test asserting tagline length, required URLs, slide count, and backlink integrity.
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, asdict, field
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple

# Base Directories
BASE_DIR = Path(__file__).resolve().parent.parent
AUTOMATION_DIR = BASE_DIR / "automation"
PH_ASSETS_DIR = AUTOMATION_DIR / "authority_assets" / "product_hunt"

# Launch Configuration & Entity Grounding
LAUNCH_CONFIG = {
    "product_name": "Enterprise AI ROI Calculator",
    "tagline": "Calculate enterprise AI labor savings, payback & TCO",  # 52 chars (< 60 chars)
    "short_description": (
        "Interactive micro-SaaS calculating true labor savings, error reduction payback, "
        "and 3-year TCO for deterministic multi-agent systems vs fragile SaaS wrappers."
    ),
    "primary_tool_url": "https://elesium.online/tools/enterprise-ai-roi-calculator",
    "embed_tool_url": "https://elesium.online/embed/roi-calculator",
    "solutions_hub": "https://elesium.online/solutions",
    "signals_hub": "https://elesium.online/signals",
    "root_url": "https://elesium.online",
    "maker_name": "Chaman Shah",
    "maker_title": "Principal AI Systems Architect",
    "maker_company": "Elesium",
    "maker_twitter": "@ElesiumAI",
    "maker_linkedin": "https://www.linkedin.com/in/chaman-elesium",
    "topics": [
        "Artificial Intelligence",
        "Developer Tools",
        "Productivity",
        "Tech",
        "Fintech"
    ]
}


@dataclass
class GalleryAssetSpec:
    slide_index: int
    asset_name: str
    dimensions: str
    filename: str
    visual_headline: str
    layout_description: str
    target_emotion: str


@dataclass
class ProductHuntLaunchBundle:
    product_name: str
    tagline: str
    primary_url: str
    embed_url: str
    solutions_hub: str
    maker_comment: str
    gallery_assets: List[GalleryAssetSpec]
    twitter_thread: List[str]
    linkedin_post: str
    community_templates: Dict[str, str]
    betalist_payload: Dict[str, Any]
    launch_day_schedule: List[Dict[str, str]]


class ProductHuntLauncher:
    """Generates complete Product Hunt and BetaList launch asset bundles with programmatic validation."""

    def __init__(self, config: Dict[str, Any] = LAUNCH_CONFIG):
        self.config = config

    def validate_tagline(self, tagline: str) -> bool:
        """Strictly asserts that tagline is non-empty and under 60 characters."""
        clean = tagline.strip()
        return 0 < len(clean) < 60

    def generate_maker_comment(self) -> str:
        """First-person origin story by Chaman Shah adhering to Sturm Module 11 rules."""
        return (
            f"Hey Product Hunt community! 👋 I'm {self.config['maker_name']}, {self.config['maker_title']} at {self.config['maker_company']}.\n\n"
            "Over the last 18 months, our engineering team has deployed production-grade multi-agent systems for mid-market and enterprise firms across India, the US, and Europe.\n\n"
            "Here is the brutal reality of enterprise AI in 2026: 80% of companies are hemorrhaging capital trying to patch together brittle Zapier wrappers and generic conversational chatbots. The moment transaction volumes surge or invoice formats drift, those systems fail silently, generating massive API bills and zero operational ROI.\n\n"
            "We built the **Enterprise AI ROI Calculator** directly into our public engineering platform to give CFOs and CTOs an unvarnished, mathematical evaluation of agentic automation.\n\n"
            "🧮 **What the calculator computes in 60 seconds:**\n"
            "1. **Net Annual Savings:** Models manual analyst hours eliminated across underwriting, invoice parsing, and logistics manifests.\n"
            "2. **Payback Period (Months):** Compares initial VPC deployment capital against monthly labor savings and error penalty cuts.\n"
            "3. **3-Year TCO Comparison:** Visualizes deterministic LangGraph private VPC hosting versus cumulative multi-tenant SaaS fees.\n"
            "4. **CFO Investment Memo:** Instantly generates a clean, downloadable business case summary for executive approval.\n\n"
            f"It is 100% free with zero paywalls or mandatory sign-ups:\n"
            f"👉 Test the live calculator: {self.config['primary_tool_url']}\n"
            f"👉 Embed it on your own blog or docs: {self.config['embed_tool_url']}\n"
            f"👉 Explore our open architectural blueprints: {self.config['solutions_hub']}\n\n"
            "I will be here all day answering deep technical questions on deterministic state machines, private VPC open-weights LLMs, and real-world deployment telemetry. Let's discuss in the comments below!"
        )

    def generate_gallery_specs(self) -> List[GalleryAssetSpec]:
        """Defines the 5 high-converting gallery slides plus thumbnail."""
        return [
            GalleryAssetSpec(
                slide_index=0,
                asset_name="Product Hunt Glyph / Icon",
                dimensions="240 x 240 px",
                filename="ph_thumbnail_glyph.png",
                visual_headline="Elesium Sovereign Hex Glyph",
                layout_description="Monochrome high-contrast dark navy hex glyph with emerald data pulse.",
                target_emotion="Enterprise Authority & Mathematical Precision"
            ),
            GalleryAssetSpec(
                slide_index=1,
                asset_name="Gallery Slide 1 (Hero Value Prop)",
                dimensions="1270 x 760 px",
                filename="ph_slide_1_hero.webp",
                visual_headline="Compute True Enterprise AI ROI, Labor Savings & Payback in 60s",
                layout_description="High-fidelity 3D UI mockup of the calculator with dynamic sliders and net annual savings counter.",
                target_emotion="Immediate Value & Institutional Polish"
            ),
            GalleryAssetSpec(
                slide_index=2,
                asset_name="Gallery Slide 2 (The Problem)",
                dimensions="1270 x 760 px",
                filename="ph_slide_2_problem.webp",
                visual_headline="Why 80% of Enterprise AI Fails: Brittle Wrappers vs Deterministic State Machines",
                layout_description="Side-by-side architectural comparison: Collapsed low-code zapier flow vs fault-tolerant LangGraph state machine.",
                target_emotion="Pain Relatability & Urgent Need"
            ),
            GalleryAssetSpec(
                slide_index=3,
                asset_name="Gallery Slide 3 (Interactive Engine)",
                dimensions="1270 x 760 px",
                filename="ph_slide_3_calculator.webp",
                visual_headline="Fine-Tune Team Size, Salary & Error Rates with Real-Time TCO Modeling",
                layout_description="Close-up of interactive input sliders (1-500 team members, ₹25k-₹5L monthly salary) with live payback curve.",
                target_emotion="Empowerment & Customizability"
            ),
            GalleryAssetSpec(
                slide_index=4,
                asset_name="Gallery Slide 4 (Sovereign VPC Architecture)",
                dimensions="1270 x 760 px",
                filename="ph_slide_4_architecture.webp",
                visual_headline="Private VPC & On-Premise LLMs: Zero Data Retention under DPDP Act",
                layout_description="Network topology diagram showing customer VPC isolation in AWS Mumbai, local Llama 3 weights, and SAP ERP sync.",
                target_emotion="Security Confidence & Compliance Grounding"
            ),
            GalleryAssetSpec(
                slide_index=5,
                asset_name="Gallery Slide 5 (CFO Investment Memo)",
                dimensions="1270 x 760 px",
                filename="ph_slide_5_memo.webp",
                visual_headline="One-Click Executive Business Case Export for Boardroom Approval",
                layout_description="Preview of institutional 2-page PDF summary with audited cash-flow metrics and SLA guarantees.",
                target_emotion="Actionable Decision Readiness"
            )
        ]

    def generate_twitter_thread(self) -> List[str]:
        """6-tweet promotional thread for launch day."""
        return [
            # Tweet 1
            f"Tired of AI hype that produces zero cash-flow ROI? 📉\n\n"
            f"Today we're launching the Enterprise AI ROI Calculator on @ProductHunt! 🚀\n\n"
            f"Compute true labor savings, error reduction payback, and 3-year TCO in 60s:\n"
            f"👉 {self.config['primary_tool_url']}\n\n"
            f"Thread on why 80% of enterprise AI breaks at scale 🧵👇",
            # Tweet 2
            "1/ Here is the dirty secret of enterprise automation in 2026: Low-code tools like Zapier break the second transaction volume hits 10,000/mo.\n\n"
            "Stochastic LLMs treated as linear API triggers fail on format variations, leading to silent data corruption and runaway cloud bills.",
            # Tweet 3
            "2/ We built a deterministic mathematical model that evaluates 3 critical variables:\n\n"
            "• Manual analyst hours spent verifying invoices or underwriting loans\n"
            "• Error penalty costs & regulatory fines (e.g. DPDP Act compliance)\n"
            "• Infrastructure cost: Sovereign private VPCs vs public multi-tenant APIs",
            # Tweet 4
            "3/ Our calculator doesn't just output a vanity number. It computes:\n\n"
            "✓ Net Annual Cash Savings (₹ and $)\n"
            "✓ Exact Payback Horizon in Months\n"
            "✓ 3-Year Total Cost of Ownership Comparison\n"
            "✓ Instant CFO-ready investment memo export",
            # Tweet 5
            f"4/ We also engineered a zero-friction embed route for bloggers, analysts, and tech publishers.\n\n"
            f"Embed the interactive tool directly onto your site with a single line of HTML:\n"
            f"{self.config['embed_tool_url']}",
            # Tweet 6
            f"5/ The tool is 100% free with ZERO paywalls or registration gates.\n\n"
            f"Check it out on Product Hunt today, drop your technical questions, and let's discuss deterministic multi-agent architectures:\n"
            f"https://www.producthunt.com/posts/enterprise-ai-roi-calculator\n\n"
            f"Engineering hub: {self.config['solutions_hub']}"
        ]

    def generate_linkedin_post(self) -> str:
        """Thought-leadership launch post for LinkedIn."""
        return f"""Most enterprise AI initiatives stall at the CFO's desk because engineering teams cannot prove hard cash-flow payback.

Today, my engineering team at Elesium is releasing our internal financial audit model to the public.

We just launched the **Enterprise AI ROI Calculator** on Product Hunt 🚀

Why did we build this?
Over the past 18 months deploying sovereign multi-agent systems, we found that 80% of enterprises waste millions trying to scale fragile Zapier wrappers. When transactions hit scale, stochastic wrappers fail. 

What the calculator evaluates:
🔹 Operational team size & hourly reconciliation overhead
🔹 Error penalties and manual rework costs
🔹 Payback period (months) and 3-year TCO of private VPC LangGraph agent pods vs. public SaaS subscriptions
🔹 One-click export of an executive business case memo

Test the interactive tool live (zero registration walls):
👉 {self.config['primary_tool_url']}

Join the discussion and share your feedback on Product Hunt today:
👉 https://www.producthunt.com/posts/enterprise-ai-roi-calculator

#ArtificialIntelligence #EnterpriseAI #ProductHunt #CTO #SaaS #Automation #LangGraph
"""

    def generate_community_outreach_templates(self) -> Dict[str, str]:
        """Outreach copy for Slack/Discord technical groups and VIP email."""
        slack_discord = (
            f"Hey everyone! 👋 We just open-sourced an interactive **Enterprise AI ROI Calculator** on Product Hunt today.\n\n"
            "If your team is deploying multi-agent systems or evaluating private VPC hosting vs public APIs, this tool models "
            "exact labor savings, payback periods, and 3-year TCO without any fluff.\n\n"
            f"Check it out live: {self.config['primary_tool_url']}\n"
            "We'd love your technical feedback and critiques on Product Hunt: https://www.producthunt.com/posts/enterprise-ai-roi-calculator"
        )

        vip_email = (
            f"Subject: New tool: Compute true enterprise agentic AI ROI & payback\n\n"
            f"Hi [Name],\n\n"
            f"I wanted to share a new interactive tool our engineering team at Elesium just released: the **Enterprise AI ROI Calculator** ({self.config['primary_tool_url']}).\n\n"
            "We built it to help technical leaders prove hard cash-flow payback to CFOs and risk committees. It models labor elimination, "
            "error reduction, and private VPC infrastructure costs in under 60 seconds with an instant PDF memo export.\n\n"
            "We are live on Product Hunt today! If you have a minute to check out the live calculator and share your thoughts in the comments, I would be deeply grateful:\n"
            "👉 https://www.producthunt.com/posts/enterprise-ai-roi-calculator\n\n"
            f"Best regards,\n"
            f"{self.config['maker_name']}\n"
            f"{self.config['maker_title']}, {self.config['maker_company']}\n"
            f"{self.config['solutions_hub']}"
        )

        return {
            "slack_discord": slack_discord,
            "vip_email": vip_email
        }

    def generate_betalist_payload(self) -> Dict[str, Any]:
        """BetaList formatted submission payload."""
        return {
            "startup_name": self.config["product_name"],
            "url": self.config["primary_tool_url"],
            "tagline": self.config["tagline"],
            "pitch": (
                "The Enterprise AI ROI Calculator allows CTOs, CFOs, and operations leaders to compute the exact net annual labor "
                "savings, payback period (months), and 3-year Total Cost of Ownership of deploying deterministic, sovereign "
                "multi-agent AI systems into private VPCs instead of fragile low-code wrappers."
            ),
            "target_audience": "Enterprise CFOs, CTOs, VPs of Operations, Supply Chain Directors, and B2B Revenue Leaders",
            "markets": ["Artificial Intelligence", "Enterprise Software", "B2B", "Productivity", "Fintech"],
            "pricing": "Free Micro-SaaS Tool / Enterprise Retainer Services",
            "founder": {
                "name": self.config["maker_name"],
                "role": self.config["maker_title"],
                "twitter": self.config["maker_twitter"],
                "linkedin": self.config["maker_linkedin"]
            },
            "solutions_hub_link": self.config["solutions_hub"],
            "embed_route": self.config["embed_tool_url"]
        }

    def generate_launch_schedule(self) -> List[Dict[str, str]]:
        """Hour-by-hour launch day timeline (PST timezone)."""
        return [
            {
                "time_pst": "12:01 AM PST",
                "action": "Listing goes live sharp. Publish Maker's Comment within 60s. Verify UTM links (?ref=producthunt)."
            },
            {
                "time_pst": "12:05 AM - 04:00 AM PST",
                "action": "Golden Hour Surge. Notify APAC networks (Bangalore, Singapore, Tokyo). Reply to all comments within 3 mins."
            },
            {
                "time_pst": "04:00 AM - 08:00 AM PST",
                "action": "European Morning. Publish Twitter launch thread and dispatch LinkedIn announcement."
            },
            {
                "time_pst": "08:00 AM - 12:00 PM PST",
                "action": "US East Coast Prime. Target Top 3 Product of the Day. Send VIP email blast to partner CTOs."
            },
            {
                "time_pst": "12:00 PM - 05:00 PM PST",
                "action": "US West Coast / Silicon Valley. Engage developers on LangChain/AI Engineers Discord."
            },
            {
                "time_pst": "05:00 PM - 11:59 PM PST",
                "action": "Final Sprint. Consolidate inbound enterprise leads on /solutions hub. Thank the community."
            }
        ]

    def build_launch_bundle(self) -> ProductHuntLaunchBundle:
        """Assembles complete launch bundle with verified tagline and asset specs."""
        assert self.validate_tagline(self.config["tagline"]), f"Tagline exceeds 60 characters: '{self.config['tagline']}'"

        return ProductHuntLaunchBundle(
            product_name=self.config["product_name"],
            tagline=self.config["tagline"],
            primary_url=self.config["primary_tool_url"],
            embed_url=self.config["embed_tool_url"],
            solutions_hub=self.config["solutions_hub"],
            maker_comment=self.generate_maker_comment(),
            gallery_assets=self.generate_gallery_specs(),
            twitter_thread=self.generate_twitter_thread(),
            linkedin_post=self.generate_linkedin_post(),
            community_templates=self.generate_community_outreach_templates(),
            betalist_payload=self.generate_betalist_payload(),
            launch_day_schedule=self.generate_launch_schedule()
        )

    def export_all(self, output_dir: Path) -> Tuple[List[Path], Path]:
        """Exports master JSON bundle and structured markdown asset files."""
        output_dir.mkdir(parents=True, exist_ok=True)
        created_files = []

        bundle = self.build_launch_bundle()

        # 1. Master JSON bundle
        json_path = output_dir / "product_hunt_launch_bundle.json"
        bundle_dict = asdict(bundle)
        json_path.write_text(json.dumps(bundle_dict, indent=2), encoding="utf-8")
        created_files.append(json_path)

        # 2. Complete Product Hunt Asset Guide (Markdown)
        ph_md = output_dir / "PRODUCT_HUNT_LAUNCH_ASSETS.md"
        ph_content = [
            f"# Product Hunt Official Launch Kit — {bundle.product_name}",
            f"> **Tagline:** {bundle.tagline} ({len(bundle.tagline)} chars — Strict < 60 chars verified)",
            f"> **Tool URL:** {bundle.primary_url}",
            f"> **Embed Iframe Route:** {bundle.embed_url}",
            f"> **Maker:** {self.config['maker_name']} ({self.config['maker_title']})\n",
            "---\n",
            "## 1. Product Hunt Listing Fields",
            f"- **Product Name:** {bundle.product_name}",
            f"- **Tagline:** {bundle.tagline}",
            f"- **Main Website:** {bundle.primary_url}",
            f"- **Solutions Hub:** {bundle.solutions_hub}",
            f"- **Topics:** {', '.join(self.config['topics'])}",
            f"- **Pricing:** Free Micro-SaaS / Enterprise Implementation Services\n",
            "---\n",
            "## 2. Maker's Official Comment",
            bundle.maker_comment,
            "\n---\n",
            "## 3. Gallery Asset Specifications (6 Slides)",
            "| Slide | Name | Dimensions | Filename | Description |",
            "| :--- | :--- | :--- | :--- | :--- |"
        ]
        for a in bundle.gallery_assets:
            ph_content.append(f"| {a.slide_index} | {a.asset_name} | {a.dimensions} | `{a.filename}` | {a.visual_headline} |")

        ph_content.append("\n---\n## 4. Twitter / X Launch Thread (6 Tweets)")
        for i, tweet in enumerate(bundle.twitter_thread, 1):
            ph_content.append(f"### Tweet {i}\n```\n{tweet}\n```\n")

        ph_content.append("---\n## 5. LinkedIn Executive Post\n```\n" + bundle.linkedin_post + "\n```\n")

        ph_content.append("---\n## 6. Community & VIP Outreach Templates")
        ph_content.append("### Slack & Discord Channel Announcement\n```\n" + bundle.community_templates["slack_discord"] + "\n```\n")
        ph_content.append("### VIP 1-on-1 Founder / CTO Email\n```\n" + bundle.community_templates["vip_email"] + "\n```\n")

        ph_content.append("---\n## 7. Hour-by-Hour Launch Day Protocol (PST)")
        for step in bundle.launch_day_schedule:
            ph_content.append(f"- **{step['time_pst']}:** {step['action']}")

        ph_md.write_text("\n".join(ph_content), encoding="utf-8")
        created_files.append(ph_md)

        # 3. BetaList Asset Guide (Markdown)
        bl_md = output_dir / "BETALIST_LAUNCH_ASSETS.md"
        bl_payload = bundle.betalist_payload
        bl_content = [
            f"# BetaList Official Submission Kit — {bundle.product_name}",
            f"> **Submission URL:** https://betalist.com/submit",
            f"> **Status:** Pre-Approved Ready\n",
            "---\n",
            "## 1. Submission Form Key-Value Fields",
            f"- **Startup Name:** {bl_payload['startup_name']}",
            f"- **URL:** {bl_payload['url']}",
            f"- **Tagline:** {bl_payload['tagline']}",
            f"- **Target Audience:** {bl_payload['target_audience']}",
            f"- **Markets:** {', '.join(bl_payload['markets'])}",
            f"- **Pricing:** {bl_payload['pricing']}",
            f"- **Founder Name:** {bl_payload['founder']['name']}",
            f"- **Founder Twitter:** {bl_payload['founder']['twitter']}\n",
            "---\n",
            "## 2. Extended Pitch Copy",
            bl_payload["pitch"],
            "\n---\n",
            "## 3. Backlinks & Embed Verification",
            f"- **Primary Canonical Tool:** {bl_payload['url']}",
            f"- **Embed Route:** {bl_payload['embed_route']}",
            f"- **Solutions Hub:** {bl_payload['solutions_hub_link']}"
        ]
        bl_md.write_text("\n".join(bl_content), encoding="utf-8")
        created_files.append(bl_md)

        return created_files, json_path


def run_self_test() -> bool:
    """Executes programmatic validation for ProductHuntLauncher."""
    print("======================================================================")
    print("RUNNING SELF-TEST: product_hunt_launcher.py (Sturm Modules 11 & 12)")
    print("======================================================================")

    launcher = ProductHuntLauncher()
    bundle = launcher.build_launch_bundle()

    # 1. Assert tagline < 60 characters
    tagline_len = len(bundle.tagline)
    print(f"Tagline: '{bundle.tagline}' ({tagline_len} chars)")
    assert tagline_len < 60, f"Tagline length ({tagline_len}) exceeds 60 characters!"
    assert tagline_len > 10, "Tagline is too short"
    print("✓ Tagline Length Verified: < 60 chars (Product Hunt strict standard)")

    # 2. Assert Maker Comment contains credentials and URLs
    assert "Chaman Shah" in bundle.maker_comment, "Missing maker name in comment"
    assert "https://elesium.online/tools/enterprise-ai-roi-calculator" in bundle.maker_comment, "Missing tool URL"
    assert "https://elesium.online/embed/roi-calculator" in bundle.maker_comment, "Missing embed URL"
    assert "https://elesium.online/solutions" in bundle.maker_comment, "Missing solutions hub URL"
    print("✓ Maker's Comment Verified: Contains Chaman Shah credentials and deep links")

    # 3. Assert Gallery Specs (at least 5 slides + thumbnail)
    assert len(bundle.gallery_assets) >= 6, f"Expected >= 6 gallery assets, got {len(bundle.gallery_assets)}"
    print(f"✓ Gallery Asset Specs Verified: {len(bundle.gallery_assets)} slides configured")

    # 4. Assert Tweet Thread (at least 6 tweets)
    assert len(bundle.twitter_thread) >= 6, f"Expected >= 6 tweets, got {len(bundle.twitter_thread)}"
    print(f"✓ Viral Twitter/X Launch Thread Verified: {len(bundle.twitter_thread)} tweets generated")

    # 5. Assert BetaList submission payload
    assert bundle.betalist_payload["startup_name"], "Missing startup name"
    assert bundle.betalist_payload["pitch"], "Missing pitch in BetaList payload"
    print("✓ BetaList Submission Payload Verified")

    # 6. Test File Export
    files, json_bundle = launcher.export_all(PH_ASSETS_DIR)
    assert len(files) == 3, f"Expected 3 exported files, got {len(files)}"
    assert json_bundle.exists(), "Master JSON bundle not found"
    for f in files:
        print(f"  - Created: {f.name}")

    print("✓ All Launch Artifacts Exported Successfully")
    print("\n======================================================================")
    print("ALL PRODUCT HUNT LAUNCHER SELF-TESTS PASSED (100% SUCCESS)")
    print("======================================================================\n")
    return True


def main():
    parser = argparse.ArgumentParser(description="Product Hunt & BetaList Launch Asset Generator")
    parser.add_argument("--test", action="store_true", help="Run self-tests")
    parser.add_argument("--output-dir", type=str, default=str(PH_ASSETS_DIR), help="Output directory")
    args = parser.parse_args()

    if args.test:
        success = run_self_test()
        sys.exit(0 if success else 1)

    launcher = ProductHuntLauncher()
    out_dir = Path(args.output_dir)
    print(f"Generating Product Hunt & BetaList Launch Bundles into: {out_dir}")
    files, json_bundle = launcher.export_all(out_dir)
    print(f"Successfully generated {len(files)} files:")
    for f in files:
        print(f"  - {f.name}")


if __name__ == "__main__":
    main()
