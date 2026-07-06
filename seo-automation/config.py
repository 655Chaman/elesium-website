"""
config.py — Central configuration for Elesium SEO Automation Pipeline
All API keys are loaded from environment variables (never hardcoded).
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
# API KEYS (set these in your .env file)
# ─────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "")
DATAFORSEO_LOGIN = os.getenv("DATAFORSEO_LOGIN", "")
DATAFORSEO_PASSWORD = os.getenv("DATAFORSEO_PASSWORD", "")
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")
MEDIUM_API_KEY = os.getenv("MEDIUM_API_KEY", "")

# ─────────────────────────────────────────────
# ELESIUM BUSINESS CONTEXT
# ─────────────────────────────────────────────
BUSINESS_NAME = "Elesium"
BUSINESS_URL = "https://elesium.online"
BUSINESS_DESCRIPTION = (
    "Elesium is a B2B buyer-matching and dealflow platform that connects "
    "businesses—especially manufacturers, enterprise companies, and growth-stage firms—"
    "with verified, high-ticket buyers through signal-driven outbound, strategic "
    "introductions, and proprietary data infrastructure. Elesium specialises in "
    "accelerating enterprise sales cycles, brokering exclusive B2B partnerships, "
    "and engineering high-conversion pipelines."
)

BUSINESS_TONE = "authoritative, data-driven, enterprise-grade, concise"

TARGET_AUDIENCE = (
    "B2B founders, sales directors, revenue leaders, manufacturing executives, "
    "enterprise procurement officers, and growth-stage operators"
)

# ─────────────────────────────────────────────
# ELESIUM TOPIC CLUSTERS (used to filter trends)
# ─────────────────────────────────────────────
# Keywords that define what's relevant to Elesium
TOPIC_CLUSTERS = {
    "B2B Sales & Dealflow": [
        "B2B sales", "enterprise sales", "B2B deals", "dealflow", "sales pipeline",
        "outbound sales", "cold outreach", "sales automation", "revenue growth",
        "high ticket sales", "enterprise contracts", "B2B partnership",
        "sales cycle", "pipeline generation", "sales intelligence",
    ],
    "Manufacturing & Industrial": [
        "manufacturing", "industrial automation", "supply chain", "OEM",
        "plant manager", "production capacity", "industrial B2B", "factory automation",
        "manufacturing buyers", "production scaling", "industrial procurement",
        "B2B manufacturing", "supplier network", "capacity planning",
    ],
    "Business Matchmaking & Partnerships": [
        "business matchmaking", "B2B marketplace", "buyer matching",
        "partner introductions", "strategic partnerships", "business network",
        "executive introductions", "verified buyers", "B2B connections",
        "business development", "partner program", "joint venture",
    ],
    "Revenue & Growth": [
        "revenue acceleration", "business growth", "customer acquisition",
        "CAC reduction", "revenue operations", "growth hacking", "lead generation",
        "demand generation", "go-to-market strategy", "market expansion",
        "revenue operations", "ARR growth", "MRR growth", "enterprise revenue",
    ],
    "Signal-Driven Outbound": [
        "signal based selling", "intent data", "buying signals", "trigger events",
        "sales triggers", "market signals", "buyer intent", "ICP targeting",
        "account based marketing", "ABM", "sales intelligence platform",
        "data driven sales", "predictive sales", "outbound intelligence",
    ],
    "Staffing & Talent": [
        "executive recruitment", "talent acquisition", "B2B staffing",
        "executive search", "headhunting", "placement agency", "talent matchmaking",
        "passive candidates", "talent pipeline", "high performance hiring",
    ],
    "SaaS & Tech B2B": [
        "SaaS sales", "enterprise software", "B2B SaaS", "software partnerships",
        "tech partnerships", "API integrations", "digital transformation",
        "enterprise tech", "software procurement", "SaaS growth",
    ],
}

# Flat list of all seed keywords for fast matching
ALL_SEED_KEYWORDS: list[str] = []
for cluster_keywords in TOPIC_CLUSTERS.values():
    ALL_SEED_KEYWORDS.extend(cluster_keywords)

# ─────────────────────────────────────────────
# PYTRENDS CONFIG
# ─────────────────────────────────────────────
# Geographic scope: worldwide = ""
TRENDS_GEO = ""  # "" = worldwide
TRENDS_TIMEFRAME = "now 7-d"   # past 7 days trending
TRENDS_LANGUAGE = "en-US"
TRENDS_CATEGORY = 0            # 0 = all categories

# How many trending topics to pull from Google Trends
TRENDS_TOP_N = 50

# ─────────────────────────────────────────────
# KEYWORD SCORING WEIGHTS
# ─────────────────────────────────────────────
# Google Trends interest score (0–100) is the PRIMARY signal.
# 100 = peak worldwide search interest right now.
# 0   = no measurable search interest.
INTEREST_SCORE_WEIGHT = 0.55  # Google Trends 0–100 interest (primary)
RELEVANCE_WEIGHT = 0.35       # How relevant to Elesium's business model
VOLUME_WEIGHT = 0.10          # Estimated absolute search volume (optional)

# Drop any keyword with a Google Trends interest score below this threshold
# (prevents low-momentum keywords from entering the content pipeline)
MIN_INTEREST_SCORE = 30        # 0–100 scale — below 30 = not trending enough

# Minimum business relevance score to include a keyword (0.0 – 1.0)
MIN_RELEVANCE_SCORE = 0.15

# Top N keywords to pass to the content generator (split: 10 AM + 10 PM)
TOP_KEYWORDS_FOR_CONTENT = 20

# ─────────────────────────────────────────────
# CONTENT GENERATION CONFIG
# ─────────────────────────────────────────────
AI_PROVIDER = "nvidia" # "gemini" or "nvidia"
NVIDIA_MODEL = "meta/llama-3.1-70b-instruct"
GEMINI_MODEL = "gemini-2.5-flash"
TARGET_WORD_COUNT = 550          # Words for each SEO block
TARGET_KEYWORD_DENSITY = 0.025   # ~2.5%
CONTENT_FORMAT = "markdown"      # Output format

# Two blocks per day: Block A uses top 10 keywords, Block B uses next 10
BLOCKS_PER_RUN = 2
BLOCK_KEYWORDS_EACH = 10   # keywords per block

# Current year for content generation
CURRENT_YEAR = 2026

# ─────────────────────────────────────────────
# PILLAR 3 — DYNAMIC TOPIC CLUSTERING (Themed Weeks)
# ─────────────────────────────────────────────
# The script rotates through these themes weekly (by ISO week number).
# This builds "Topical Authority" — Google rewards sites that go DEEP on a niche.
# Week 1 = B2B Sales & Dealflow, Week 2 = Manufacturing & Industrial, etc.
WEEKLY_THEME_ROTATION = [
    "B2B Sales & Dealflow",
    "Manufacturing & Industrial",
    "Signal-Driven Outbound",
    "Revenue & Growth",
    "Business Matchmaking & Partnerships",
    "SaaS & Tech B2B",
    "Staffing & Talent",
]

# ─────────────────────────────────────────────
# PILLAR 4 — E-E-A-T: ELESIUM CASE STUDIES
# ─────────────────────────────────────────────
# Google now aggressively filters AI-generated content that lacks first-hand
# experience (the first 'E' in E-E-A-T). These proof points are injected into
# every generated block to make content feel genuinely authored by Elesium.
#
# ⚠️  IMPORTANT: Replace these placeholder stats with your REAL client outcomes.
#    The more specific the number, the stronger the E-E-A-T signal.
ELESIUM_CASE_STUDIES = [
    "An OEM supplier in the mid-market segment reduced their average sales cycle by over 60% after Elesium facilitated three verified introductions to procurement directors within their target vertical.",
    "A growth-stage SaaS firm secured two enterprise pilots within 45 days of onboarding with Elesium, bypassing what would have been six months of cold outreach.",
    "A manufacturing buyer closed a high-ticket supply contract through a single Elesium-facilitated introduction — the buyer had an active mandate that standard lead generation tools never would have surfaced.",
    "Enterprise firms using Elesium's signal-driven model report that over 70% of introductions lead to a qualified first conversation, compared to an industry average of under 5% for cold outreach.",
    "Elesium's proprietary buyer-readiness signal has been shown to cut time-to-first-meeting from an average of 90 days (cold outreach) to under 14 days.",
]

# ─────────────────────────────────────────────
# OUTPUT PATHS
# ─────────────────────────────────────────────
import pathlib

BASE_DIR = pathlib.Path(__file__).parent
WEBSITE_ROOT = BASE_DIR.parent            # /Users/krdeeksha/ELESIUM WEBSITE
BLOGPOSTS_TS_PATH = WEBSITE_ROOT / "src" / "data" / "blogPosts.ts"

# Keyword logs are still stored locally for auditing
OUTPUT_KEYWORD_LOGS_DIR = BASE_DIR / "keyword_logs"

# Temp dir for transient .md (auto-deleted after injection — not stored)
OUTPUT_SEO_BLOCKS_DIR = BASE_DIR / "daily_seo_blocks"

OUTPUT_KEYWORD_LOGS_DIR.mkdir(exist_ok=True)
OUTPUT_SEO_BLOCKS_DIR.mkdir(exist_ok=True)

# ─────────────────────────────────────────────
# DATAFORSEO CONFIG (optional enrichment)
# ─────────────────────────────────────────────
DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3"
DATAFORSEO_LOCATION_CODE = 2840   # United States (global proxy)
DATAFORSEO_LANGUAGE_CODE = "en"

# ─────────────────────────────────────────────
# RATE LIMITING
# ─────────────────────────────────────────────
# Seconds to wait between Google Trends API calls (avoid rate limits)
PYTRENDS_SLEEP_MIN = 2.0
PYTRENDS_SLEEP_MAX = 5.0
