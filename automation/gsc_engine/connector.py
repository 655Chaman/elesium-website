"""
=============================================================================
GSC STRIKING DISTANCE ENGINE — GOOGLE SEARCH CONSOLE API V3 CONNECTOR
=============================================================================
Classification: API v3 Client with Service Account, OAuth2 & Mock Fallback
Methodology: Brian Kato (SEO Rockstars 2026 Day 2)
=============================================================================
"""

import os
import json
import logging
import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pathlib import Path

from automation.gsc_engine.config import (
    SITE_URL,
    GSC_API_SCOPE,
    GSC_DEFAULT_ROW_LIMIT,
    ENV_GSC_SERVICE_ACCOUNT_JSON,
    ENV_GSC_SERVICE_ACCOUNT_FILE,
    ENV_GSC_CLIENT_ID,
    ENV_GSC_CLIENT_SECRET,
    ENV_GSC_REFRESH_TOKEN,
    ENV_GSC_MOCK_MODE,
    CURATED_SOLUTIONS_PATH,
    RETAINED_SLUGS_PATH,
)
from automation.gsc_engine.models import GSCQueryRecord, IntentCategory
from automation.gsc_engine.regex_classifier import classify_query

logger = logging.getLogger(__name__)


class GSCConnector:
    """
    Connects to Google Search Console API v3 via:
    1. Service Account JSON file / env var
    2. OAuth2 Refresh Token credentials
    3. High-fidelity deterministic mock client (when live credentials are not set)
    """

    def __init__(self, site_url: str = SITE_URL):
        self.site_url = site_url
        self.auth_mode: str = "UNINITIALIZED"
        self.service = None
        self._init_client()

    def _init_client(self):
        """Initializes the live GSC client or falls back to mock client."""
        # Check explicit mock mode
        if os.environ.get(ENV_GSC_MOCK_MODE, "").lower() in ("1", "true", "yes"):
            self.auth_mode = "MOCK_SIMULATOR"
            logger.info("GSCConnector: Forced MOCK_SIMULATOR via GSC_MOCK_MODE.")
            return

        # 1. Try Service Account JSON String
        sa_json = os.environ.get(ENV_GSC_SERVICE_ACCOUNT_JSON)
        if sa_json:
            try:
                from google.oauth2.service_account import Credentials
                from googleapiclient.discovery import build
                info = json.loads(sa_json)
                creds = Credentials.from_service_account_info(info, scopes=GSC_API_SCOPE)
                self.service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
                self.auth_mode = "SERVICE_ACCOUNT_ENV_JSON"
                logger.info("GSCConnector: Connected via GSC_SERVICE_ACCOUNT_JSON.")
                return
            except Exception as e:
                logger.warning(f"GSCConnector: Failed to initialize via GSC_SERVICE_ACCOUNT_JSON: {e}")

        # 2. Try Service Account JSON File
        sa_file = os.environ.get(ENV_GSC_SERVICE_ACCOUNT_FILE, "service_account.json")
        sa_path = Path(sa_file)
        if sa_path.exists():
            try:
                from google.oauth2.service_account import Credentials
                from googleapiclient.discovery import build
                creds = Credentials.from_service_account_file(str(sa_path), scopes=GSC_API_SCOPE)
                self.service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
                self.auth_mode = "SERVICE_ACCOUNT_FILE"
                logger.info(f"GSCConnector: Connected via service account file: {sa_path}")
                return
            except Exception as e:
                logger.warning(f"GSCConnector: Failed to initialize via service account file: {e}")

        # 3. Try OAuth2 Refresh Token
        client_id = os.environ.get(ENV_GSC_CLIENT_ID)
        client_secret = os.environ.get(ENV_GSC_CLIENT_SECRET)
        refresh_token = os.environ.get(ENV_GSC_REFRESH_TOKEN)
        if client_id and client_secret and refresh_token:
            try:
                from google.oauth2.credentials import Credentials
                from googleapiclient.discovery import build
                creds = Credentials(
                    None,
                    refresh_token=refresh_token,
                    token_uri="https://oauth2.googleapis.com/token",
                    client_id=client_id,
                    client_secret=client_secret,
                    scopes=GSC_API_SCOPE,
                )
                self.service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
                self.auth_mode = "OAUTH2_REFRESH_TOKEN"
                logger.info("GSCConnector: Connected via OAuth2 refresh token.")
                return
            except Exception as e:
                logger.warning(f"GSCConnector: Failed to initialize via OAuth2: {e}")

        # 4. Fallback to High-Fidelity Mock Simulator
        self.auth_mode = "MOCK_SIMULATOR"
        logger.info("GSCConnector: No live credentials detected. Initialized high-fidelity MOCK_SIMULATOR.")

    def fetch_search_analytics(
        self,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        row_limit: int = GSC_DEFAULT_ROW_LIMIT,
    ) -> List[GSCQueryRecord]:
        """
        Pulls Search Analytics data from GSC API v3 or executes deterministic mock simulation.
        Returns a list of GSCQueryRecord instances.
        """
        if not start_date:
            start_date = (datetime.now() - timedelta(days=90)).strftime("%Y-%m-%d")
        if not end_date:
            end_date = datetime.now().strftime("%Y-%m-%d")

        if self.service and self.auth_mode != "MOCK_SIMULATOR":
            return self._fetch_live_api(start_date, end_date, row_limit)
        else:
            return self._fetch_mock_simulation()

    def _fetch_live_api(
        self, start_date: str, end_date: str, row_limit: int
    ) -> List[GSCQueryRecord]:
        """Executes actual Google Search Console Search Analytics API query."""
        request_body = {
            "startDate": start_date,
            "endDate": end_date,
            "dimensions": ["query", "page"],
            "searchType": "web",
            "rowLimit": row_limit,
        }
        logger.info(f"GSCConnector: Executing live GSC query for site: {self.site_url}")
        response = (
            self.service.searchanalytics()
            .query(siteUrl=self.site_url, body=request_body)
            .execute()
        )

        rows = response.get("rows", [])
        records: List[GSCQueryRecord] = []
        for row in rows:
            keys = row.get("keys", [])
            if len(keys) >= 2:
                query_str = keys[0]
                page_url = keys[1]
                clicks = int(row.get("clicks", 0))
                impressions = int(row.get("impressions", 0))
                ctr = float(row.get("ctr", 0.0))
                position = float(row.get("position", 0.0))

                intent, pattern = classify_query(query_str)
                records.append(
                    GSCQueryRecord(
                        query=query_str,
                        page=page_url,
                        clicks=clicks,
                        impressions=impressions,
                        ctr=ctr,
                        position=position,
                        intent=intent,
                        matched_intent_pattern=pattern,
                    )
                )
        logger.info(f"GSCConnector: Live GSC query returned {len(records)} query-page records.")
        return records

    def _fetch_mock_simulation(self) -> List[GSCQueryRecord]:
        """
        Generates deterministic, high-fidelity GSC Search Analytics data based on
        the 100 retained enterprise solutions and category hubs.
        """
        records: List[GSCQueryRecord] = []

        if not CURATED_SOLUTIONS_PATH.exists():
            logger.error(f"Cannot run simulation: {CURATED_SOLUTIONS_PATH} missing.")
            return records

        with open(CURATED_SOLUTIONS_PATH, "r", encoding="utf-8") as f:
            solutions = json.load(f)

        for sol in solutions:
            slug = sol.get("slug")
            page_url = f"{self.site_url}/solutions/{slug}"
            keyword = sol.get("keyword", "")
            title = sol.get("title", "")
            badges = sol.get("complianceBadges", [])
            primary_badge = badges[0] if badges else "Enterprise Architecture"

            # Deterministic hash seed from slug for repeatable metrics
            seed = int(hashlib.md5(slug.encode("utf-8")).hexdigest()[:8], 16)

            # Query 1: Top Striking Distance Query (Position 8.5 to 13.8)
            pos_1 = round(8.5 + (seed % 54) / 10.0, 1)  # 8.5 to 13.8
            imp_1 = 1800 + (seed % 4200)                 # 1,800 to 6,000
            ctr_1 = round(0.011 + (seed % 14) / 1000.0, 4) # 1.1% to 2.4%
            clicks_1 = max(1, int(imp_1 * ctr_1))
            query_1 = f"{keyword} benchmark latency"

            intent_1, pat_1 = classify_query(query_1)
            records.append(
                GSCQueryRecord(
                    query=query_1,
                    page=page_url,
                    clicks=clicks_1,
                    impressions=imp_1,
                    ctr=ctr_1,
                    position=pos_1,
                    intent=intent_1,
                    matched_intent_pattern=pat_1,
                )
            )

            # Query 2: Secondary Striking Distance Query (Position 14.2 to 19.8) - Conversational / Question
            pos_2 = round(14.2 + ((seed // 7) % 56) / 10.0, 1) # 14.2 to 19.8
            imp_2 = 950 + ((seed // 5) % 2400)                 # 950 to 3,350
            ctr_2 = round(0.005 + ((seed // 3) % 9) / 1000.0, 4) # 0.5% to 1.3%
            clicks_2 = max(1, int(imp_2 * ctr_2))
            query_2 = f"how to deploy {keyword} for {primary_badge}"

            intent_2, pat_2 = classify_query(query_2)
            records.append(
                GSCQueryRecord(
                    query=query_2,
                    page=page_url,
                    clicks=clicks_2,
                    impressions=imp_2,
                    ctr=ctr_2,
                    position=pos_2,
                    intent=intent_2,
                    matched_intent_pattern=pat_2,
                )
            )

            # Query 3: Commercial Comparison Striking Query (Position 9.1 to 16.5)
            pos_3 = round(9.1 + ((seed // 13) % 74) / 10.0, 1) # 9.1 to 16.5
            imp_3 = 1200 + ((seed // 11) % 2800)               # 1,200 to 4,000
            ctr_3 = round(0.008 + ((seed // 17) % 12) / 1000.0, 4) # 0.8% to 1.9%
            clicks_3 = max(1, int(imp_3 * ctr_3))
            query_3 = f"best {keyword} architecture vs cloud api"

            intent_3, pat_3 = classify_query(query_3)
            records.append(
                GSCQueryRecord(
                    query=query_3,
                    page=page_url,
                    clicks=clicks_3,
                    impressions=imp_3,
                    ctr=ctr_3,
                    position=pos_3,
                    intent=intent_3,
                    matched_intent_pattern=pat_3,
                )
            )

            # Query 4: Baseline Top 3 Query (Already ranking 1.8 to 2.8) - Elite leader
            pos_4 = round(1.8 + (seed % 11) / 10.0, 1)
            imp_4 = 450 + (seed % 650)
            ctr_4 = round(0.18 + (seed % 12) / 100.0, 4) # 18% to 30%
            clicks_4 = max(1, int(imp_4 * ctr_4))
            query_4 = f"elesium {keyword}"

            intent_4, pat_4 = classify_query(query_4)
            records.append(
                GSCQueryRecord(
                    query=query_4,
                    page=page_url,
                    clicks=clicks_4,
                    impressions=imp_4,
                    ctr=ctr_4,
                    position=pos_4,
                    intent=intent_4,
                    matched_intent_pattern=pat_4,
                )
            )

            # Query 5: Underperforming Long-Tail Query (Position 24.0 to 48.0)
            pos_5 = round(24.0 + (seed % 240) / 10.0, 1)
            imp_5 = 120 + (seed % 250)
            ctr_5 = round(0.001 + (seed % 4) / 1000.0, 4)
            clicks_5 = int(imp_5 * ctr_5)
            query_5 = f"general ai automation notes {slug[:20]}"

            intent_5, pat_5 = classify_query(query_5)
            records.append(
                GSCQueryRecord(
                    query=query_5,
                    page=page_url,
                    clicks=clicks_5,
                    impressions=imp_5,
                    ctr=ctr_5,
                    position=pos_5,
                    intent=intent_5,
                    matched_intent_pattern=pat_5,
                )
            )

        logger.info(f"GSCConnector: Generated {len(records)} deterministic simulation records across {len(solutions)} solutions.")
        return records
