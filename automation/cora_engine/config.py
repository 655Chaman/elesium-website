"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — CONFIGURATION & THRESHOLDS
=============================================================================
Classification: Statistical Factor Correlation & Visibility-First Interaction Depth
Methodology: Ted Kubaitis (SEO Rockstars 2026 Day 1 - Cora 20,000+ Ranking Factors)
=============================================================================
"""

import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
WEBSITE_ROOT = BASE_DIR.parent
FRONTEND_DIR = WEBSITE_ROOT / "frontend"
DIST_DIR = FRONTEND_DIR / "dist"
SOLUTIONS_DIST_DIR = DIST_DIR / "solutions"
CURATED_SOLUTIONS_PATH = BASE_DIR / "curated_enterprise_solutions.json"
RETAINED_SLUGS_PATH = BASE_DIR / "retained_solution_slugs.json"
CORA_TELEMETRY_PATH = BASE_DIR / "cora_serp_correlation_telemetry.json"
CORA_REPORT_PATH = BASE_DIR / "cora_optimization_report.md"

# Statistical Correlation Thresholds (Cora Standard)
CORRELATION_SIGNIFICANCE_THRESHOLD = 0.25  # Absolute Spearman rs threshold for impactful factors
STRONG_CORRELATION_THRESHOLD = 0.40        # Factors with rs >= 0.40 are critical levers
NEGATIVE_CORRELATION_THRESHOLD = -0.25     # Spearman rs <= -0.25 indicates over-optimization penalty risk
ALPHA_SIGNIFICANCE = 0.05                  # Exact Type I error rate ceiling (replaces loose 0.20)
FDR_BH_Q_THRESHOLD = 0.10                  # Benjamini-Hochberg False Discovery Rate q-value ceiling
MIN_SAMPLE_SIZE = 5                        # Minimum competitor count required for valid correlation
MAX_DEFICIT_WORD_CAP = 1500.0              # Winsorization cap for single-pass word count additions
TOP_BENCHMARK_POSITIONS = 3                # Positions 1 to 3 define the winning factor baseline
MAX_SERP_COMPETITORS_MEASURED = 20         # Top 20 ranking URLs evaluated per SERP

# Ted Kubaitis 2026 Interaction Depth Thresholds (Viewport = 844px height)
VIEWPORT_HEIGHT_PX = 844                   # Standard mobile viewport height (iPhone / Pixel)
ATF_MAX_DEPTH_PX = 844                     # Above-The-Fold limit (Scroll action = 0)
MID_FOLD_MAX_DEPTH_PX = 1688               # 1 Scroll action (Scroll action = 1)
DEEP_FOLD_MAX_DEPTH_PX = 2532              # 2 Scroll actions (Scroll action = 2)
FUNCTIONALLY_DEAD_DEPTH_PX = 2533          # >= 3 Scroll actions (Functionally invisible)

# Environment Overrides
ENV_SERP_API_KEY = "SERP_API_KEY"
ENV_CORA_MOCK_MODE = "CORA_MOCK_MODE"
