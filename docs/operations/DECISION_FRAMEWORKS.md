# Elesium Operational Decision Frameworks & Technical Gates

> **Author:** Elesium Engineering & Architecture Pod  
> **Purpose:** Codified technical decision-making SOPs allowing autonomous engineering execution without founder bottleneck (Yosemite 90-Day Independence Standard).

---

## 1. Decision Gate 1: Agent Architecture Selection

When scoping enterprise client automation requirements, apply this deterministic routing logic:

```
                  ┌─────────────────────────────────────┐
                  │ Does workflow require multi-step,   │
                  │ non-linear routing or cyclical state?│
                  └──────────────────┬──────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                   YES                                NO
                    ▼                                 ▼
   ┌────────────────────────────────┐ ┌────────────────────────────────┐
   │ DEPLOY: LangGraph Multi-Agent  │ │ DEPLOY: Single-Process FastAPI │
   │ Triad (Supervisor + Worker Pod)│ │ Deterministic Pipeline         │
   ├────────────────────────────────┤ ├────────────────────────────────┤
   │ • StateGraph execution         │ │ • Linear DAG execution         │
   │ • Persistent checkpointer      │ │ • Pydantic v2 validation       │
   │ • Dynamic tool reflection loop │ │ • Async HTTP/Webhook workers   │
   │ • Minimum Tier: Tier 2 (₹6L+)  │ │ • Minimum Tier: Tier 1 (₹1.5L) │
   └────────────────────────────────┘ └────────────────────────────────┘
```

### Architectural Non-Negotiables:
1. **Never build with low-code wrappers (Zapier/Make.com):** All enterprise workflows must be pure Python/FastAPI with LangGraph state orchestration.
2. **Every LLM node must have deterministic type checking:** Utilize Instructor or Pydantic output schemas. Any model output failing schema validation must be caught by an internal reflexivity loop, never leaking raw strings to client databases.

---

## 2. Decision Gate 2: Data Sovereignty & Infrastructure Deployment

Evaluate client compliance constraints across three strict tiers:

| Tier | Client Industry | Infrastructure Target | Model Orchestration | Data Retention Policy |
| :--- | :--- | :--- | :--- | :--- |
| **Sovereign Tier** | BFSI, Defense, Core Banking | On-Premise GPU Cluster / Private VPC (AWS GovCloud / Client VPC) | Self-hosted vLLM (Llama 3 70B, Mistral Large) | **Zero External Data Leakage:** Air-gapped, zero logging, encrypted local pgvector. |
| **Enterprise Cloud Tier** | Healthcare, Large SaaS, Logistics | Client Dedicated AWS/GCP VPC | Azure OpenAI (Zero Data Retention agreement) or Bedrock Dedicated | **Strict Zero-Retention:** Private Endpoints only, no public internet gateway. |
| **Commercial Rapid Tier** | Mid-market retail, E-commerce | Elesium Managed Staging VPC | NVIDIA NIM / Gemini 1.5 Pro | Transient memory only; purged post-execution. |

---

## 3. Decision Gate 3: Commercial Qualification & Pricing Thresholds

To protect engineering focus and maintain a premium agency multiple, all inbound inquiries via the WhatsApp Desk (`+91 8317329312`) must pass these qualification gates:

1. **Hard Floor Investment Rule:**
   - Minimum engagement fee is **₹1,50,000 ($2,000 USD)** for the 14-Day Pilot Sprint.
   - Any client requesting "free discovery POCs" or "revenue share only" is politely declined with automated directory routing.
2. **The 90-Day Cash-Flow Positive ROI Mandate:**
   - Before signing Tier 2 (₹6,00,000+), engineers must calculate:
     $$\text{ROI Metric} = \frac{(\text{Manual Hours Saved} \times \text{Blended Hourly Rate}) + \text{Revenue Velocity Delta}}{\text{Total Contract Value}}$$
   - If projected first-year ROI is $< 3.0\text{x}$, the project scope is reduced to a high-density pilot sprint.
3. **Retainer Transition Protocol:**
   - 100% of custom build projects must include a mandatory 12-month Maintenance & Engineering Pod retainer option (₹4,50,000/month) presented at contract inception to maximize recurring revenue multiples.
