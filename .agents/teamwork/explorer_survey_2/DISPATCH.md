## 2026-11-10T05:53:31Z
Mission: Survey and specify the AEO Grounding Probe Engine connecting to real LLM search APIs.
Specifically:
1. Detail the exact API specifications, endpoints, request formats, query parameter structures, and response schemas for:
   - Perplexity Sonar API (`PERPLEXITY_API_KEY`)
   - OpenAI Search / web search tool (`OPENAI_API_KEY`)
   - Google Gemini Search Grounding API (`GEMINI_API_KEY`)
   - Anthropic Claude API with web search / citation format (`ANTHROPIC_API_KEY`)
2. Design the citation extraction and brand recommendation share parsing: how citations, domain URLs (e.g. `elesium.ai`, `elesium.com`, `elesium`), and brand mentions are detected in the API responses.
3. Design the fallback / dry-run / mock execution architecture when API keys are not present in the environment, ensuring realistic simulated search responses with deterministic citation and brand share signals suitable for offline automated testing.
4. Specify the software architecture for the probe engine (Python/Node, modular provider design, rate limiting, error handling). Check what languages/runtimes and dependencies are available in the workspace (Python, Node/bun, etc.).
5. Write your complete findings to `/Users/krdeeksha/ELESIUM WEBSITE/.agents/teamwork/explorer_survey_2/handoff.md`.
6. Send a message to the orchestrator when finished.
