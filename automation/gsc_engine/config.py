"""
=============================================================================
GSC STRIKING DISTANCE ENGINE — CONFIGURATION & THRESHOLDS (MODULE 4/6)
=============================================================================
Classification: Google Search Console (GSC) API v3 Striking Distance Optimization
Methodology: Brian Kato (SEO Rockstars 2026 Day 2) & Dan Kurtz Compounding AI Loop

Defines operational thresholds, API scopes, regex filters, and file paths.
=============================================================================
"""

import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
WEBSITE_ROOT = BASE_DIR.parent
FRONTEND_DIR = WEBSITE_ROOT / "frontend"
DIST_DIR = FRONTEND_DIR / "dist"
SOLUTIONS_DIST_DIR = DIST_DIR / "solutions"
CURATED_SOLUTIONS_PATH = BASE_DIR / "curated_enterprise_solutions.json"
RETAINED_SLUGS_PATH = BASE_DIR / "retained_solution_slugs.json"
TELEMETRY_OUTPUT_PATH = BASE_DIR / "gsc_striking_distance_telemetry.json"
REPORT_OUTPUT_PATH = BASE_DIR / "gsc_optimization_report.md"

# Site configuration
SITE_URL = os.environ.get("GSC_SITE_URL", "https://elesium.online")
DEFAULT_DATE_RANGE_DAYS = 90

# Striking Distance Boundaries (Brian Kato & Ted Kubaitis)
STRIKING_DISTANCE_POS_MIN = 8.0
STRIKING_DISTANCE_POS_MAX = 20.0
EXTENDED_STRIKING_MIN = 4.0
EXTENDED_STRIKING_MAX = 7.9
TIER_1_POS_MIN = 4.0
TIER_1_POS_MAX = 7.9
TIER_2_POS_MIN = 8.0
TIER_2_POS_MAX = 20.0
TOP_3_POS_MAX = 3.0
SUBOPTIMAL_CTR_THRESHOLD = 0.030  # 3.0% max CTR for striking distance identification
MIN_IMPRESSIONS_THRESHOLD = 500   # Minimum impressions to qualify for prioritization

# Empirical CTR Benchmarks & Statistical Significance
PROJECTED_TOP_3_CTR = 0.285       # Industry standard top 3 blended organic click-through rate (Positions 1-3)
WILSON_CONFIDENCE_LEVEL = 0.95    # Confidence level for Wilson score CTR confidence intervals

# Answer Capsule Constraints (Edward Sturm Moz Sweet Spot: 96-98 score)
CAPSULE_MIN_WORDS = 42
CAPSULE_MAX_WORDS = 48

# Google Search Console API Constants
GSC_API_SCOPE = ["https://www.googleapis.com/auth/webmasters.readonly"]
GSC_SEARCH_TYPE = "web"
GSC_DEFAULT_ROW_LIMIT = 25000
GSC_MAX_TOTAL_ROWS = 100000
GSC_RETRY_MAX_ATTEMPTS = 5
GSC_RETRY_STATUS_CODES = (429, 500, 502, 503, 504)

# Environment variables for authentication
ENV_GSC_SERVICE_ACCOUNT_JSON = "GSC_SERVICE_ACCOUNT_JSON"
ENV_GSC_SERVICE_ACCOUNT_FILE = "GSC_SERVICE_ACCOUNT_FILE"
ENV_GSC_CLIENT_ID = "GSC_CLIENT_ID"
ENV_GSC_CLIENT_SECRET = "GSC_CLIENT_SECRET"
ENV_GSC_REFRESH_TOKEN = "GSC_REFRESH_TOKEN"
ENV_GSC_MOCK_MODE = "GSC_MOCK_MODE"
