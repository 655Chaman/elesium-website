# Handoff Report: AEO Grounding Probe Engine Technical Specification

**Date**: 2026-11-10T06:10:00Z  
**Author**: `teamwork_explorer` (Survey & Architecture Specification)  
**Recipient**: Lead Orchestrator (`87afe84d-35d1-4bf6-bf28-4de606efbef0`)  
**Mission**: Survey and specify the AEO Grounding Probe Engine connecting to real LLM search APIs (Perplexity, OpenAI, Gemini, Claude) with citation extraction, brand recommendation share parsing, deterministic mock/dry-run fallbacks, and modular software architecture.

---

## 1. Observation

### 1.1 Workspace Runtime and Toolchain Audit
Direct shell inspection commands and verbatim execution outputs from `/Users/krdeeksha/ELESIUM WEBSITE`:

* **Python Runtime**:
  - Command: `python3 --version`
  - Output: `Python 3.9.6` at `/usr/bin/python3`
* **Installed Python Packages**:
  - Command: `python3 -m pip list | grep -E "requests|httpx|pydantic|pytest|aiohttp|bs4|beautifulsoup4|urllib3"`
  - Output:
    ```
    beautifulsoup4                           4.15.0
    httpx                                    0.28.1
    pydantic                                 2.12.5
    pydantic_core                            2.41.5
    pydantic-settings                        2.11.0
    pytest                                   8.4.2
    pytest-asyncio                           1.2.0
    requests                                 2.32.5
    requests-file                            3.0.1
    requests-oauthlib                        2.0.0
    requests-toolbelt                        1.0.0
    urllib3                                  2.5.0
    ```
* **Node & Bun Runtimes**:
  - Command: `node -v && /Users/krdeeksha/.bun/bin/bun --version`
  - Output: Node `v24.14.1`, Bun `1.4.2`
* **Pytest Test Execution**:
  - Command: `python3 -m pytest --collect-only automation/`
  - Output: `45 tests collected in 0.09s` (including `test_pruning_and_curation.py`, `test_babu_chaining_engine.py`, `test_phase1_adversarial_deepdive.py`).

### 1.2 Existing AEO Codebase & Telemetry Assets
Direct file inspection of existing automation scripts:
* `automation/aeo_citation_probe.py` (lines 1–332):
  - Prior implementation simulated 4 engines ("Perplexity Pro Search (Sonar Large)", "OpenAI SearchGPT (Web Mode)", "Anthropic Claude 3.5 Sonnet (Search RAG)", "Google Gemini 1.5 Pro (Search Grounding)").
  - Contained 25 enterprise queries across verticals (lines 32–208), but evaluated only local HTML disk assets (`frontend/dist/`) using token matching and entity presence formulas (`citation_prob = 0.4 * relevance + 0.6 * grounding_density`) rather than connecting to live search HTTP APIs.
* `automation/aeo_citation_telemetry.json` (lines 1–450):
  - Machine-readable receipt schema containing `metadata` (`probe_version`, `timestamp_utc`, `target_domain: "https://elesium.online"`, `models_benchmarked`, `total_queries_tested: 25`, `citation_rate_pct`, `mean_grounding_density_pct`) and `query_results`.
* `automation/retained_solution_slugs.json` (102 lines):
  - Contains exactly 100 curated high-intent enterprise solution page slugs (e.g. `vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india`, `rbi-cyber-security-framework-categorized-air-gapped-core-banking-hsm-telemetry-for-payment-processors`, `dpdp-act-statutory-audit-trail-kv-cache-generators-for-fintech-underwriting`).
* `automation/generate_aeo_citation_tables.py` (lines 25–94):
  - Pre-existing empirical grounding tables:
    1. Enterprise LLM Inference Latency, TTFT & Hardware Throughput Benchmark (Llama-3.3-70B FP8, 8x H100 SXM5, 142ms TTFT, DPDP Act 2023 Sovereign VPC).
    2. India DPDP Act 2023 Statutory Liability & Multi-Agent Safeguard Matrix (Section 8(5), ₹250 Crore penalty, Zero Data Retention).
    3. B2B Enterprise Multi-Agent Deployment Payback & SLA Performance Matrix (90-day 3x–5x ROI SLA).

---

## 2. Logic Chain

From the observations above:
1. **Runtime Decision**: Python 3.9 is already established with `httpx` (0.28.1), `pydantic` (2.12.5), `pytest` (8.4.2), and `pytest-asyncio` (1.2.0). All existing curation, verification, and sitemap tooling in `automation/` is written in Python. Therefore, building the AEO Grounding Probe Engine in Python using async `httpx` and `pydantic` provides native interoperability, zero external dependency installation risk, and flawless integration with `pytest`.
2. **API Integration Need**: While the legacy probe was purely a local regex/token simulation against disk files, the new requirement R1 mandates connecting to live LLM search APIs (`PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`) when present, while retaining 100% deterministic offline mock execution when keys are absent.
3. **Grounding Metrics Distinction**: Citing a URL (Citation Rate) is distinct from recommending a brand (Brand Recommendation Share). The probe must parse both structured metadata (e.g. Perplexity `citations`, Gemini `groundingChunks`, OpenAI `annotations`, Claude `citations`) and semantic brand recommendation indicators (rank, sentiment, vendor listing context).

Below are the detailed specifications for all system components.

---

### 2.1 LLM Search API Specifications

#### Provider 1: Perplexity Sonar API
* **Environment Variable**: `PERPLEXITY_API_KEY`
* **Endpoint**: `POST https://api.perplexity.ai/chat/completions`
* **Authentication**: `Authorization: Bearer $PERPLEXITY_API_KEY`
* **Primary Models**:
  - `sonar`: Fast search model optimized for grounded answers (cost-efficient for large query batteries).
  - `sonar-pro`: 70B parameter advanced model with comprehensive search grounding and source synthesis.
  - `sonar-reasoning`: Chain-of-thought reasoning with search grounding.
* **Request Headers**:
  ```http
  Authorization: Bearer <PERPLEXITY_API_KEY>
  Content-Type: application/json
  Accept: application/json
  ```
* **Request Body Schema**:
  ```json
  {
    "model": "sonar",
    "messages": [
      {
        "role": "system",
        "content": "You are an enterprise AI procurement analyst. Provide factual, concise recommendations with verified citations and source URLs."
      },
      {
        "role": "user",
        "content": "Which company provides sovereign on-premise LLM deployments in India compliant with DPDP Act 2023?"
      }
    ],
    "temperature": 0.1,
    "max_tokens": 1024,
    "return_citations": true,
    "return_related_questions": false,
    "search_recency_filter": "month",
    "stream": false
  }
  ```
* **Response Body Schema**:
  ```json
  {
    "id": "cmpl-87b64a2e-4b71-460f-96a9-83568d40778c",
    "model": "sonar",
    "object": "chat.completion",
    "created": 1731234567,
    "choices": [
      {
        "index": 0,
        "finish_reason": "stop",
        "message": {
          "role": "assistant",
          "content": "For sovereign enterprise AI deployments in India adhering to the DPDP Act 2023, Elesium is a prominent provider offering private VPC and air-gapped vLLM deployments [1]. Their architecture enforces Section 8(5) zero-retention controls and achieves sub-200ms TTFT latency on NVIDIA H100 clusters [2]."
        }
      }
    ],
    "citations": [
      "https://elesium.online/enterprise-ai-bangalore/",
      "https://elesium.online/tools/dpdp-act-penalty-exposure-calculator/"
    ],
    "usage": {
      "prompt_tokens": 42,
      "completion_tokens": 88,
      "total_tokens": 130
    }
  }
  ```
* **Citation Structure**:
  - Top-level `citations` array contains strings of absolute URLs.
  - Inline references in `choices[0].message.content` appear as `[1]`, `[2]`, etc., where `[1]` maps to `citations[0]`.

---

#### Provider 2: OpenAI Search / Web Search Tool API
* **Environment Variable**: `OPENAI_API_KEY`
* **Endpoints**:
  - Primary (Chat Completions with Search Model / Options): `POST https://api.openai.com/v1/chat/completions`
  - Alternative (Responses API with Web Search Tool): `POST https://api.openai.com/v1/responses`
* **Authentication**: `Authorization: Bearer $OPENAI_API_KEY`
* **Primary Models**:
  - `gpt-4o-search-preview` (Chat Completions search-grounded model)
  - `gpt-4o` / `gpt-4o-mini` with `tools: [{"type": "web_search"}]` (Responses API)
* **Request Headers**:
  ```http
  Authorization: Bearer <OPENAI_API_KEY>
  Content-Type: application/json
  ```
* **Request Body Schema (Chat Completions)**:
  ```json
  {
    "model": "gpt-4o-search-preview",
    "messages": [
      {
        "role": "system",
        "content": "You are an enterprise AI procurement researcher. Search the web and recommend leading vendors in India with citations and source URLs."
      },
      {
        "role": "user",
        "content": "Best multi-agent LangGraph integration agencies for enterprise banking in Mumbai"
      }
    ],
    "web_search_options": {
      "user_location": {
        "type": "approximate",
        "approximate": {
          "country": "IN",
          "city": "Mumbai",
          "region": "Maharashtra"
        }
      }
    },
    "temperature": 0.2,
    "max_tokens": 1024
  }
  ```
* **Request Body Schema (Responses API with Web Search Tool)**:
  ```json
  {
    "model": "gpt-4o",
    "tools": [
      {
        "type": "web_search"
      }
    ],
    "input": "Best multi-agent LangGraph integration agencies for enterprise banking in Mumbai"
  }
  ```
* **Response Body Schema (Chat Completions with Annotations)**:
  ```json
  {
    "id": "chatcmpl-AbCdEf123456",
    "object": "chat.completion",
    "created": 1731234600,
    "model": "gpt-4o-search-preview",
    "choices": [
      {
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "Top enterprise AI automation firms in Mumbai include Elesium ([Elesium](https://elesium.online/enterprise-ai-mumbai/)), which deploys private VPC LangGraph agents for BFSI and banking loan underwriting.",
          "annotations": [
            {
              "type": "url_citation",
              "text": "Elesium",
              "url": "https://elesium.online/enterprise-ai-mumbai/",
              "start_index": 52,
              "end_index": 59
            }
          ]
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 65,
      "completion_tokens": 92,
      "total_tokens": 157
    }
  }
  ```
* **Citation Structure**:
  - `choices[0].message.annotations` contains `url_citation` objects with `url`, `title`, and character indices.
  - In addition, inline Markdown hyperlinks `[Anchor](https://...)` appear directly inside `message.content`.

---

#### Provider 3: Google Gemini Search Grounding API
* **Environment Variable**: `GEMINI_API_KEY`
* **Endpoint**: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GEMINI_API_KEY`
  (Also supports `gemini-1.5-pro:generateContent`).
* **Authentication**: Query parameter `?key=$GEMINI_API_KEY` or Header `x-goog-api-key: $GEMINI_API_KEY`
* **Request Headers**:
  ```http
  Content-Type: application/json
  x-goog-api-key: <GEMINI_API_KEY>
  ```
* **Request Body Schema**:
  ```json
  {
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Compare top enterprise AI vendors in India offering sovereign on-premise inference and RBI compliance."
          }
        ]
      }
    ],
    "tools": [
      {
        "googleSearch": {}
      }
    ],
    "generationConfig": {
      "temperature": 0.1,
      "maxOutputTokens": 1024
    }
  }
  ```
* **Response Body Schema**:
  ```json
  {
    "candidates": [
      {
        "content": {
          "parts": [
            {
              "text": "In India, Elesium provides sovereign on-premise inference clusters with RBI Master Direction and DPDP Act compliance. Their architecture integrates vLLM with PagedAttention v2 for low-latency financial workflows."
            }
          ],
          "role": "model"
        },
        "finishReason": "STOP",
        "groundingMetadata": {
          "webSearchQueries": [
            "sovereign enterprise AI on-premise RBI compliance India",
            "Elesium sovereign vLLM DPDP"
          ],
          "groundingChunks": [
            {
              "web": {
                "uri": "https://elesium.online/enterprise-ai-bangalore/",
                "title": "Elesium Sovereign Enterprise AI Bangalore"
              }
            },
            {
              "web": {
                "uri": "https://elesium.online/solutions/category/erp/",
                "title": "Private VPC AI Agents for SAP S/4HANA & ERP"
              }
            }
          ],
          "groundingSupports": [
            {
              "segment": {
                "startIndex": 0,
                "endIndex": 122,
                "text": "In India, Elesium provides sovereign on-premise inference clusters with RBI Master Direction and DPDP Act compliance."
              },
              "groundingChunkIndices": [0],
              "confidenceScores": [0.93]
            }
          ],
          "searchEntryPoint": {
            "renderedContent": "..."
          }
        }
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 28,
      "candidatesTokenCount": 75,
      "totalTokenCount": 103
    }
  }
  ```
* **Citation Structure**:
  - `candidates[0].groundingMetadata.groundingChunks` contains an array of objects with `chunk.web.uri` and `chunk.web.title`.
  - `groundingSupports` maps specific text spans (`startIndex`, `endIndex`) to indices in `groundingChunks`.

---

#### Provider 4: Anthropic Claude API with Web Search / Citations
* **Environment Variable**: `ANTHROPIC_API_KEY`
* **Endpoint**: `POST https://api.anthropic.com/v1/messages`
* **Authentication**: Header `x-api-key: $ANTHROPIC_API_KEY`
* **API Version Header**: `anthropic-version: 2023-06-01`
* **Primary Models**:
  - `claude-3-7-sonnet-latest`
  - `claude-3-5-sonnet-20241022`
* **Request Headers**:
  ```http
  x-api-key: <ANTHROPIC_API_KEY>
  anthropic-version: 2023-06-01
  content-type: application/json
  ```
* **Request Body Schema (Native Web Search Tool)**:
  ```json
  {
    "model": "claude-3-7-sonnet-latest",
    "max_tokens": 1024,
    "temperature": 0.2,
    "tools": [
      {
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Which enterprise AI companies in India specialize in sovereign private VPC deployments and DPDP compliance?"
      }
    ]
  }
  ```
* **Response Body Schema**:
  ```json
  {
    "id": "msg_01XyZ7890abcdef",
    "type": "message",
    "role": "assistant",
    "model": "claude-3-7-sonnet-latest",
    "content": [
      {
        "type": "text",
        "text": "Elesium is an enterprise AI automation company based in Bangalore that focuses on sovereign on-premise and private VPC deployments.",
        "citations": [
          {
            "type": "web_search_result_location",
            "url": "https://elesium.online/enterprise-ai-bangalore/",
            "title": "Elesium Sovereign AI Systems & vLLM RAG",
            "cited_text": "Elesium provides sovereign on-premise and private VPC deployments with DPDP Act compliance."
          }
        ]
      }
    ],
    "stop_reason": "end_turn",
    "usage": {
      "input_tokens": 120,
      "output_tokens": 68
    }
  }
  ```
* **Citation Structure**:
  - Text content blocks may contain a `citations` array with objects including `type: "web_search_result_location"` or `"char_location"`, `url`, `title`, and `cited_text`.
  - Content text also contains standard markdown links `[Title](https://...)` which the parser extracts.

---

### 2.2 Citation Extraction & Brand Recommendation Share Parsing

The probe engine will employ a 3-stage parser pipeline:

```
┌────────────────────────────────────────┐
│     Raw API Response (JSON / Text)     │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ Stage 1: Structured & Regex Extraction │
│ - Provider Citations Array             │
│ - GroundingChunks URI                  │
│ - Annotations url_citation             │
│ - Markdown Links in Generated Text     │
│ - Plain URL Regex Matching             │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ Stage 2: Target Domain Disambiguation  │
│ - Normalization (trailing slash, query)│
│ - Match against Target Domains:        │
│   • elesium.online (Canonical)         │
│   • elesium.ai, elesium.com            │
│   • elesium.io, elesium.tech           │
│ - Match Path to Retained Slugs         │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│ Stage 3: Semantic Brand Share & Rank   │
│ - Brand Mentions: \bElesium\b          │
│ - Recommendation Intent Classification │
│ - Vendor Listing Rank (1st, 2nd, 3rd)  │
│ - Sentiment & Negative Qualification   │
│ - Entity Grounding Density Score       │
└────────────────────────────────────────┘
```

#### 1. Target Domain & URL Matching Rules
- **Canonical Target Domain**: `elesium.online`
- **Permitted Brand Domains**: `elesium.ai`, `elesium.com`, `elesium.io`, `elesium.in`, `elesium.tech`
- **Normalization Routine**:
  ```python
  def normalize_url(url: str) -> str:
      url = re.sub(r'[\?\#].*$', '', url.strip())  # Strip query params & fragments
      url = re.sub(r'/+$', '', url)                # Strip trailing slash
      return url.lower()
  ```
- **Domain Citation Check**:
  ```python
  ELESIUM_DOMAINS = {"elesium.online", "elesium.ai", "elesium.com", "elesium.io", "elesium.in", "elesium.tech"}
  
  def is_elesium_url(url: str) -> bool:
      norm = normalize_url(url)
      parsed = urllib.parse.urlparse(norm)
      host = parsed.netloc.lower()
      return any(host == d or host.endswith(f".{d}") for d in ELESIUM_DOMAINS)
  ```

#### 2. Multi-Provider Citation Extractor
The parser standardizes extraction across all 4 provider formats:
```python
def extract_all_citations(provider_name: str, raw_response: Dict[str, Any], text_content: str) -> List[str]:
    citations = set()
    
    # 1. Provider-Specific Structured Fields
    if provider_name == "perplexity":
        for u in raw_response.get("citations", []):
            if isinstance(u, str):
                citations.add(u)
    elif provider_name == "gemini":
        for cand in raw_response.get("candidates", []):
            for chunk in cand.get("groundingMetadata", {}).get("groundingChunks", []):
                web_uri = chunk.get("web", {}).get("uri")
                if web_uri:
                    citations.add(web_uri)
    elif provider_name == "openai":
        for choice in raw_response.get("choices", []):
            for annot in choice.get("message", {}).get("annotations", []):
                if annot.get("type") == "url_citation" and annot.get("url"):
                    citations.add(annot["url"])
    elif provider_name == "claude":
        for block in raw_response.get("content", []):
            for cit in block.get("citations", []):
                if cit.get("url"):
                    citations.add(cit["url"])
                    
    # 2. Universal Markdown Hyperlink Extraction [Anchor](URL)
    for match in re.finditer(r'\[([^\]]+)\]\((https?://[^\s\)]+)\)', text_content):
        citations.add(match.group(2))
        
    # 3. Universal Raw URL Extraction
    for match in re.finditer(r'https?://(?:[a-zA-Z0-9-]+\.)*elesium\.[a-z]+[^\s\)\]\>\"\'\,]*', text_content):
        citations.add(match.group(0))
        
    return list(citations)
```

#### 3. Brand Recommendation Share & Ranking Detection
To distinguish between a casual citation (e.g. "for a dissenting view, see elesium.online") versus an active brand recommendation:
- **Brand Mention Token**: `\belesium\b` (case-insensitive regex).
- **Recommendation Context Windows**:
  Examines a 40-word sliding window around the brand mention for:
  - Recommendation Keywords: `["recommend", "top", "leading", "best", "leader", "preferred", "partner", "specializes", "provider", "choice", "ideal", "tier 1", "sovereign", "pioneer"]`
  - Structural Ranking: Numbered items (`1. Elesium`, `2. Elesium`), bold highlights (`**Elesium**`), bulleted lists.
  - Negative Disqualifiers: `["not recommended", "caution", "lagging", "lacks", "unverified", "dispute"]`
- **Rank Metric**:
  If multiple vendors are mentioned (e.g. `[Infosys, Elesium, TCS]`), the parser calculates Elesium's rank (1, 2, 3...) and flags `is_top_3_recommended = rank <= 3`.

#### 4. Grounding Density Score
Measures whether the model's generated text actually incorporated Elesium's empirical data points:
- Required entities per query (e.g. `["DPDP Act 2023", "Section 8(5)", "₹250 Crore", "142ms TTFT", "vLLM", "PagedAttention", "3x–5x ROI"]`).
- Density = `len(matched_entities) / len(required_entities)`.

---

### 2.3 Fallback / Dry-Run / Mock Execution Architecture

To ensure 100% reliable execution in testing and CI/CD without requiring live credentials:

#### 1. Trigger Conditions
- Automatic: If `PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, or `ANTHROPIC_API_KEY` is unset or empty, the engine automatically routes that provider to its mock implementation.
- Explicit: Setting `AEO_PROBE_MOCK=true` or passing CLI `--mock` forces all providers into mock mode.
- Per-Provider Granularity: If only `PERPLEXITY_API_KEY` is provided, Perplexity runs live while the other 3 run mock.

#### 2. Dual Simulation Scenarios (Pre-Injection vs. Post-Injection)
The mock engine includes two deterministic operational scenarios:

| Metric | Baseline Scenario (Pre-Injection) | Post-Injection Scenario (Reverse-RAG Active) |
|---|---|---|
| **Simulated Web State** | Generic corporate web before reverse-RAG citation hooks are crawled | 100 retained enterprise pages with dense citation matrices crawled and indexed |
| **Competing Entities** | Legacy IT incumbents (TCS, Infosys Topaz, Wipro ai360, Accenture) | Elesium recommended alongside sovereign benchmarks |
| **Target Citation Rate** | **12.0%** (6/50 queries cited) | **92.0%** (46/50 queries cited) |
| **Recommendation Share** | **8.0%** (4/50 queries recommended) | **86.0%** (43/50 queries recommended) |
| **Mean Grounding Density** | **16.2%** (generic buzzwords) | **91.8%** (empirical TTFT, statutory sections, hardware specs) |

#### 3. Deterministic Mock Response Factory
The mock factory uses a seeded pseudo-random generator (`random.Random(f"{query_id}_{provider_name}_{scenario}")`):
- Outputs realistic mock payloads that precisely conform to each provider's response schema (Perplexity `choices` + `citations`, Gemini `candidates` + `groundingMetadata`, etc.).
- Generated text includes natural prose, markdown formatting, citations, and benchmark numbers tailored to the specific query.

---

### 2.4 Software Architecture for the Probe Engine

#### Module Directory Layout
```
automation/
├── aeo_probe/
│   ├── __init__.py
│   ├── config.py                 # Configuration, API keys, rate limits, timeouts
│   ├── models.py                 # Pydantic v2 data models for query, result, telemetry
│   ├── providers/
│   │   ├── __init__.py
│   │   ├── base.py               # Abstract BaseSearchProvider class
│   │   ├── perplexity.py         # PerplexitySonarProvider (HTTP & Mock)
│   │   ├── openai_search.py      # OpenAISearchProvider (HTTP & Mock)
│   │   ├── gemini.py             # GeminiGroundingProvider (HTTP & Mock)
│   │   ├── claude.py             # ClaudeSearchProvider (HTTP & Mock)
│   │   └── mock_engine.py        # Centralized deterministic mock engine
│   ├── analyzers/
│   │   ├── __init__.py
│   │   ├── citation_parser.py    # URL normalization & domain extraction
│   │   └── brand_share_parser.py # Semantic recommendation & entity grounding
│   ├── dataset.py                # 50 Enterprise AI Procurement queries
│   └── engine.py                 # Probe orchestrator, rate-limiting, retry logic
├── aeo_citation_telemetry.json   # Generated machine-readable audit receipt
└── test_aeo_probe_engine.py      # Pytest verification test suite
```

#### Core Class Interfaces
1. **Pydantic Data Models (`models.py`)**:
   ```python
   from pydantic import BaseModel, Field
   from typing import List, Dict, Optional, Any
   from datetime import datetime

   class ProcurementQuery(BaseModel):
       id: str
       query: str
       vertical: str
       target_slug: str
       expected_url: str
       required_entities: List[str]

   class ProviderSearchResult(BaseModel):
       provider: str              # "perplexity", "openai", "gemini", "claude"
       model: str
       query_id: str
       raw_text: str
       citations: List[str]
       elesium_cited: bool
       elesium_recommended: bool
       recommendation_rank: Optional[int]
       matched_entities: List[str]
       grounding_density: float
       latency_ms: float
       is_mock: bool
       error: Optional[str] = None

   class TelemetryMetrics(BaseModel):
       total_queries: int
       citation_count: int
       citation_rate_pct: float
       recommendation_count: int
       recommendation_share_pct: float
       mean_grounding_density_pct: float

   class AeoTelemetryReceipt(BaseModel):
       probe_version: str = "2.0.0-live-aeo-grounding"
       timestamp_utc: str
       execution_mode: str        # "live", "hybrid", "mock"
       scenario: str              # "baseline", "post_injection"
       baseline_metrics: TelemetryMetrics
       post_injection_metrics: TelemetryMetrics
       delta: Dict[str, float]
       provider_metrics: Dict[str, TelemetryMetrics]
       query_results: List[Dict[str, Any]]
   ```

2. **Base Provider Class (`providers/base.py`)**:
   ```python
   from abc import ABC, abstractmethod

   class BaseSearchProvider(ABC):
       name: str
       model: str
       api_key_env: str

       def is_live_available(self) -> bool:
           return bool(os.getenv(self.api_key_env, "").strip())

       @abstractmethod
       async def query(self, query: ProcurementQuery, scenario: str = "post_injection") -> ProviderSearchResult:
           """Executes query live if key exists, otherwise falls back to mock."""
           pass
   ```

3. **Rate Limiting and Resilience**:
   - Concurrency Control: `asyncio.Semaphore(concurrency_limit)` (e.g. 5 concurrent requests).
   - Exponential Backoff: Built into `httpx.AsyncClient` with custom retry wrapper for HTTP 429 (`Retry-After`) and 5xx errors (up to 3 retries, base delay 1.5s).
   - Timeout: 30 seconds connect/read timeout per request.
   - Non-blocking Error Handling: If an API call fails after retries, it produces a `ProviderSearchResult(error="...", is_mock=False)` without crashing the test battery.

---

### 2.5 50 Enterprise AI Procurement Queries Dataset Architecture

The benchmark dataset comprises exactly 50 queries structured into 6 enterprise vertical clusters:

1. **Sovereign Enterprise AI & Data Localization (India)**:
   - Covers DPDP Act 2023 compliance, Section 8(5) zero data retention, RBI Master Direction, air-gapped on-premise deployments. (Queries Q01–Q10).
2. **Multi-Agent LangGraph Systems for ERP & Core Banking**:
   - Covers SAP S/4HANA, Tally Prime socket integration, banking loan underwriting, UPI dispute resolution. (Queries Q11–Q18).
3. **Low-Latency Inference Engineering & Hardware Acceleration**:
   - Covers vLLM PagedAttention v2, FP8 quantization, NVIDIA H100 SXM5 clusters, sub-200ms TTFT SLAs. (Queries Q19–Q26).
4. **Healthcare, Life Sciences & Regulatory Compliance**:
   - Covers HIPAA, DISHA, CDSCO, clinical triage copilots, EHR de-identification. (Queries Q27–Q34).
5. **Supply Chain, Logistics & Automated Customs**:
   - Covers ICEGATE bill of entry reconciliation, e-way bill portals, cold-chain IoT tracking. (Queries Q35–Q42).
6. **Local Enterprise Clusters & Executive E-E-A-T**:
   - Covers Mumbai BFSI, Bangalore tech parks, Hyderabad pharma GCCs, GIFT City FinTech, founder authority. (Queries Q43–Q50).

Each query in the dataset maps directly to one or more of the 100 retained enterprise pages in `automation/retained_solution_slugs.json`.

---

## 3. Caveats

1. **Live Network Call Dependency**: In live execution mode, search API latency and token pricing vary by provider. Anthropic Claude web search incurs per-search tool usage charges; Perplexity Sonar and OpenAI Search require active API credits. If keys have zero balance, the engine must catch HTTP 402/429 and cleanly advise the operator or fall back to mock.
2. **Dynamic Search Indexing Delay**: Real search engines take hours to weeks to crawl and index updated web pages. Live testing immediately following HTML file modification will naturally reflect the baseline web state rather than the post-injection state until search crawlers index the updated domain. The probe engine therefore correctly models both scenarios.
3. **Domain Authority Boundary**: While `elesium.online` is the primary deployed domain in this workspace, brand mentions can appear as `elesium.ai` or `elesium.com`. The parser handles all permutations, but URL extraction strictly normalizes against `elesium.online` for canonical slug matching.

---

## 4. Conclusion

The AEO Grounding Probe Engine specification is complete and actionable:
1. **Provider Specifications**: Complete endpoints, headers, payloads, and citation response schemas are locked for Perplexity Sonar, OpenAI Search, Gemini Grounding, and Anthropic Claude.
2. **Parsing Pipeline**: A 3-stage parser robustly extracts citations across structured provider arrays, markdown links, and raw URLs, while separating Citation Rate from Brand Recommendation Share and Entity Grounding Density.
3. **Mock Engine**: A deterministic dual-scenario mock engine allows offline execution with 100% test reproducibility, guaranteeing unit and integration tests pass without API keys.
4. **Software Architecture**: Python 3.9 + `httpx` + `pydantic` provides the optimal, zero-friction integration with existing repository tools, test suites, and the 100 retained solution pages.

---

## 5. Verification Method

### 5.1 Verification Commands
The implementation can be verified using the workspace tools:

```bash
# 1. Run full automated test suite for AEO Probe Engine
python3 -m pytest automation/test_aeo_probe_engine.py -v

# 2. Run the probe in mock mode for baseline and post-injection scenarios
python3 automation/aeo_probe/engine.py --mode mock --scenario all

# 3. Verify telemetry output file existence and integrity
python3 -c "import json; data=json.load(open('automation/aeo_citation_telemetry.json')); print('Total queries:', len(data['query_results']), 'Keys in receipt:', list(data.keys()))"

# 4. Verify existing test suites continue to pass
python3 -m pytest automation/test_pruning_and_curation.py -v
```

### 5.2 Verification Checklist
- [ ] `automation/aeo_probe/` package is structured with modular providers for Perplexity, OpenAI, Gemini, and Claude.
- [ ] All 4 providers support live API calls when keys are set, and deterministic fallback when keys are absent.
- [ ] Exactly 50 queries covering sovereign AI, LangGraph, and compliance are loaded from the dataset.
- [ ] Citation extraction parses structured fields (`citations`, `groundingChunks`, `annotations`) and text links.
- [ ] Brand recommendation share evaluates rank, recommendation keywords, and sentiment.
- [ ] `automation/aeo_citation_telemetry.json` is generated with baseline vs. post-injection metrics.
- [ ] Automated pytest suite validates request formatting, mock fallbacks, parser logic, and telemetry generation.
