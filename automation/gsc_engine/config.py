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
TOP_3_POS_MAX = 3.0
SUBOPTIMAL_CTR_THRESHOLD = 0.030  # 3.0% max CTR for striking distance identification
MIN_IMPRESSIONS_THRESHOLD = 500   # Minimum impressions to qualify for prioritization

# Answer Capsule Constraints (Edward Sturm Moz Sweet Spot: 96-98 score)
CAPSULE_MIN_WORDS = 42
CAPSULE_MAX_WORDS = 48

# Google Search Console API Constants
GSC_API_SCOPE = ["https://www.googleapis.com/auth/webmasters.readonly"]
GSC_SEARCH_TYPE = "web"
GSC_DEFAULT_ROW_LIMIT = 25000

# Environment variables for authentication
ENV_GSC_SERVICE_ACCOUNT_JSON = "GSC_SERVICE_ACCOUNT_JSON"
ENV_GSC_SERVICE_ACCOUNT_FILE = "GSC_SERVICE_ACCOUNT_FILE"
ENV_GSC_CLIENT_ID = "GSC_CLIENT_ID"
ENV_GSC_CLIENT_SECRET = "GSC_CLIENT_SECRET"
ENV_GSC_REFRESH_TOKEN = "GSC_REFRESH_TOKEN"
ENV_GSC_MOCK_MODE = "GSC_MOCK_MODE"
