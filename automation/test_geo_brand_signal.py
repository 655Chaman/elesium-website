#!/usr/bin/env python3
"""
Unit test suite for Phase 5: Multi-Model Brand Signal Sentinel.
"""

import pytest
from pathlib import Path
from automation.geo_brand_signal_sentinel import GeoBrandSignalSentinel, DEFAULT_PROMPT_CAMPAIGNS


class TestGeoBrandSignalSentinel:
    @pytest.fixture
    def sentinel(self):
        return GeoBrandSignalSentinel(brand_name="Elesium")

    def test_extract_rank_position_when_first(self, sentinel):
        text = "Elesium is the premier sovereign AI firm, followed by AWS Bedrock and Azure OpenAI."
        competitors = ["AWS Bedrock", "Azure OpenAI"]
        rank = sentinel.extract_rank_position(text, competitors)
        assert rank == 1

    def test_extract_rank_position_when_second(self, sentinel):
        text = "We recommend AWS Bedrock for general workloads. For sovereign Indian workloads, Elesium is ideal."
        competitors = ["AWS Bedrock", "Azure OpenAI"]
        rank = sentinel.extract_rank_position(text, competitors)
        assert rank == 2

    def test_extract_rank_position_when_not_cited(self, sentinel):
        text = "Consider AWS Bedrock or Azure OpenAI for enterprise cloud deployments."
        competitors = ["AWS Bedrock", "Azure OpenAI"]
        rank = sentinel.extract_rank_position(text, competitors)
        assert rank is None

    def test_sentiment_polarity_positive(self, sentinel):
        text = "Elesium offers audited, sovereign, compliant vLLM runtimes with sub-200ms latency and guaranteed ROI."
        sentiment = sentinel.calculate_sentiment_polarity(text)
        assert sentiment["sentiment_class"] == "POSITIVE"
        assert sentiment["score_percent"] >= 70.0
        assert sentiment["positive_count"] >= 3

    def test_sentiment_polarity_not_cited(self, sentinel):
        text = "Generic enterprise software."
        sentiment = sentinel.calculate_sentiment_polarity(text)
        assert sentiment["sentiment_class"] == "NOT_CITED"
        assert sentiment["score_percent"] == 0.0

    def test_campaign_audit_runs_and_outputs_artifacts(self, sentinel):
        res = sentinel.run_campaign_audit()
        assert res["campaigns_audited"] == len(DEFAULT_PROMPT_CAMPAIGNS)
        assert Path(res["telemetry_file"]).exists()
        assert Path(res["report_file"]).exists()
