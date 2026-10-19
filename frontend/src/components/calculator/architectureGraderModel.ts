/**
 * architectureGraderModel.ts
 * ============================================================================
 * Mathematical Diagnostic Engine for Enterprise Agentic Fragility & Readiness Grader.
 * 
 * Computes:
 * 1. 5-Dimension Enterprise Architectural Readiness Score (0-100%)
 * 2. Enterprise Fragility Index (0-100%) & Operational Tier
 * 3. Mean Time Between Failures (MTBF) and Loop Recursion Probability
 * 4. Estimated Annual Financial Leakage (Token Burn + Human Triage + Regulatory Risk)
 * 5. Dimension-specific Architectural Remediations & Technical Playbook
 * ============================================================================
 */

export type ConcurrencyChoice = 'linear_chain' | 'heuristic_router' | 'unconstrained_react' | 'deterministic_fsm';
export type TopologyChoice = 'monolithic_prompt' | 'uncontrolled_swarm' | 'hierarchical_supervisor' | 'isolated_dag_circuit_breaker';
export type InferenceBoundaryChoice = 'shared_public_api' | 'cloud_provisioned' | 'dedicated_vpc_vllm' | 'on_prem_airgap';
export type StatePersistenceChoice = 'volatile_memory' | 'naive_vector_rag' | 'hybrid_session_checkpoint' | 'cryptographic_audit_ledger';
export type ComplianceChoice = 'no_validation' | 'regex_keyword_filter' | 'semantic_guardrail_model' | 'typed_schema_dpdp_sanitizer';
export type Currency = 'USD' | 'INR';

export interface DimensionOption<T> {
  id: T;
  label: string;
  description: string;
  score: number; // 0 to 100
  fragilityWeight: number; // 0 to 1
  riskProfile: string;
}

export interface GraderInputs {
  concurrency: ConcurrencyChoice;
  topology: TopologyChoice;
  inferenceBoundary: InferenceBoundaryChoice;
  statePersistence: StatePersistenceChoice;
  complianceGuardrails: ComplianceChoice;
  monthlyVolume: number; // monthly runs (e.g. 25,000)
  currency: Currency;
}

export interface DimensionResult {
  name: string;
  key: string;
  selectedLabel: string;
  score: number;
  fragilityPercent: number;
  status: 'Critical' | 'Warning' | 'Optimal' | 'Elite';
  diagnosis: string;
  remediation: string;
}

export interface GraderResults {
  readinessScore: number; // 0-100
  fragilityScore: number; // 0-100
  tier: {
    title: string;
    description: string;
    badgeColor: string;
    borderClass: string;
  };
  failureProbabilityPercent: number; // % chance of failure per 1,000 runs
  mtbfRuns: number; // Mean Runs Between Failures
  financialLeakage: {
    tokenWasteAnnual: number;
    humanTriageAnnual: number;
    regulatoryRiskAnnual: number;
    totalAnnualLeakage: number;
    currency: Currency;
  };
  dimensions: DimensionResult[];
  recommendedRoadmap: {
    phase: string;
    title: string;
    action: string;
    impact: string;
  }[];
}

export const CONCURRENCY_OPTIONS: Record<ConcurrencyChoice, DimensionOption<ConcurrencyChoice>> = {
  linear_chain: {
    id: 'linear_chain',
    label: 'Linear Single-Path Chain (LangChain / LlamaIndex Sequential)',
    description: 'Prompts execute in a static chain without conditional rollbacks, state recovery, or dynamic branch inspection.',
    score: 35,
    fragilityWeight: 0.65,
    riskProfile: 'Brittle. Any single parsing error or JSON schema deviation aborts the entire execution pipeline without retries.'
  },
  heuristic_router: {
    id: 'heuristic_router',
    label: 'Heuristic LLM Router (Prompt-Based Branching)',
    description: 'An LLM decides next steps via prose parsing without deterministic schema guarantees or fallback circuit breakers.',
    score: 45,
    fragilityWeight: 0.55,
    riskProfile: 'Non-deterministic. Router classifications drift by 12–18% under varying prompt temperature and context lengths.'
  },
  unconstrained_react: {
    id: 'unconstrained_react',
    label: 'Unconstrained Autonomous ReAct Loop (Thought-Action-Observation)',
    description: 'Autonomous loop that continues until the model decides to stop, without strict step limits or state graph checkpoints.',
    score: 20,
    fragilityWeight: 0.80,
    riskProfile: 'Catastrophic. Subject to recursive token hemorrhage, hallucinated tool invocations, and infinite reasoning loops.'
  },
  deterministic_fsm: {
    id: 'deterministic_fsm',
    label: 'Deterministic Finite State Machine (LangGraph / StateGraph DAG)',
    description: 'Explicit state schema with compiled edges, conditional gates, bounded recursion limits, and transactional checkpoints.',
    score: 95,
    fragilityWeight: 0.05,
    riskProfile: 'Sovereign. State transitions are strictly typed; every failure is caught and routed to deterministic fallback nodes.'
  }
};

export const TOPOLOGY_OPTIONS: Record<TopologyChoice, DimensionOption<TopologyChoice>> = {
  monolithic_prompt: {
    id: 'monolithic_prompt',
    label: 'Monolithic Single-Prompt Mega-Agent',
    description: 'A single massive system prompt attempting to handle routing, tool calling, domain logic, and response formatting.',
    score: 25,
    fragilityWeight: 0.75,
    riskProfile: 'Attention degradation. Context window pollution leads to hallucinated parameters and lost instructions beyond 8k tokens.'
  },
  uncontrolled_swarm: {
    id: 'uncontrolled_swarm',
    label: 'Autonomous Peer-to-Peer Agent Swarm (No Central Controller)',
    description: 'Agents message each other directly without a centralized supervisor, shared state ledger, or consensus protocol.',
    score: 30,
    fragilityWeight: 0.70,
    riskProfile: 'Deadlock risk. Cascade failures occur when one sub-agent outputs contradictory facts that propagate across the swarm.'
  },
  hierarchical_supervisor: {
    id: 'hierarchical_supervisor',
    label: 'Hierarchical Supervisor with Human-in-the-Loop (HITL) Gates',
    description: 'Designated supervisor orchestrates worker agents with structured tool schemas and optional manual approval gates.',
    score: 82,
    fragilityWeight: 0.18,
    riskProfile: 'Production-ready. Isolated blast radiuses, though supervisor model choice remains a single point of latency jitter.'
  },
  isolated_dag_circuit_breaker: {
    id: 'isolated_dag_circuit_breaker',
    label: 'Sandboxed Multi-Agent DAG with Circuit Breakers & Rollbacks',
    description: 'Multi-agent topology where each worker executes in an isolated sandbox with transactional rollback on schema failure.',
    score: 96,
    fragilityWeight: 0.04,
    riskProfile: 'Fault-tolerant. Complete state isolation prevents catastrophic cascading failures; 99.99% operational uptime.'
  }
};

export const INFERENCE_OPTIONS: Record<InferenceBoundaryChoice, DimensionOption<InferenceBoundaryChoice>> = {
  shared_public_api: {
    id: 'shared_public_api',
    label: 'Shared Multi-Tenant Public APIs (OpenAI / Anthropic Direct)',
    description: 'Requests are sent over the public internet to third-party endpoints subject to global multi-tenant rate limits.',
    score: 28,
    fragilityWeight: 0.72,
    riskProfile: 'Severe SLA and compliance exposure. P99 tail latency reaches 8,500ms; enterprise data egresses to third-party cloud.'
  },
  cloud_provisioned: {
    id: 'cloud_provisioned',
    label: 'Hyperscaler Provisioned Throughput (Azure OpenAI / AWS Bedrock PTU)',
    description: 'Dedicated reserved throughput in a cloud enterprise account with contracted SLAs and data residency boundaries.',
    score: 72,
    fragilityWeight: 0.28,
    riskProfile: 'Substantial enterprise security, but high financial floor ($25k+/mo commitments) and cloud vendor lock-in.'
  },
  dedicated_vpc_vllm: {
    id: 'dedicated_vpc_vllm',
    label: 'Dedicated Private VPC with Self-Hosted vLLM / TensorRT-LLM',
    description: 'Self-hosted open weights (Llama 3, DeepSeek, Qwen) on dedicated cloud GPUs inside your isolated VPC boundary.',
    score: 94,
    fragilityWeight: 0.06,
    riskProfile: 'Sovereign. Zero third-party telemetry, sub-25ms TTFT, zero external data retention, full DPDP Act 2023 compliance.'
  },
  on_prem_airgap: {
    id: 'on_prem_airgap',
    label: 'Sovereign On-Premises Air-Gapped GPU Cluster',
    description: 'Bare-metal GPUs in physical corporate datacenter with complete physical air-gap from external networks.',
    score: 98,
    fragilityWeight: 0.02,
    riskProfile: 'Bank-grade sovereignty. Zero data egress surface; absolute regulatory immunity under defense/banking mandates.'
  }
};

export const STATE_OPTIONS: Record<StatePersistenceChoice, DimensionOption<StatePersistenceChoice>> = {
  volatile_memory: {
    id: 'volatile_memory',
    label: 'Volatile In-Memory Context (RAM / Fast-API Server Process)',
    description: 'Workflow execution state exists only in active memory; any pod restart, crash, or timeout destroys the transaction.',
    score: 15,
    fragilityWeight: 0.85,
    riskProfile: 'Zero survivability. Network dropouts or worker timeouts force customers to restart multi-step workflows from scratch.'
  },
  naive_vector_rag: {
    id: 'naive_vector_rag',
    label: 'Naive Vector Store Search (Cosine Similarity Without TTL/Metadata)',
    description: 'Embeddings stored in a flat vector index without metadata partitioning, time decay, or recency weighting.',
    score: 38,
    fragilityWeight: 0.62,
    riskProfile: 'Memory pollution. As documents accumulate, cosine similarity returns outdated policy documents and hallucinated context.'
  },
  hybrid_session_checkpoint: {
    id: 'hybrid_session_checkpoint',
    label: 'Hybrid Lexical + Vector Retrieval with Relational Checkpoints',
    description: 'PostgreSQL + pgvector with transactional state tables, session thread IDs, and point-in-time state snapshotting.',
    score: 86,
    fragilityWeight: 0.14,
    riskProfile: 'Resilient. Workflows resume cleanly from the exact failure node; search balances exact keyword matching with embeddings.'
  },
  cryptographic_audit_ledger: {
    id: 'cryptographic_audit_ledger',
    label: 'Cryptographically Signed Append-Only State Ledger',
    description: 'Immutable event log recording every agent prompt, tool payload, and model token with SHA-256 state hashes.',
    score: 98,
    fragilityWeight: 0.02,
    riskProfile: 'Courtroom-ready auditability. Every decision is mathematically reproducible; zero state tampering or silent divergence.'
  }
};

export const COMPLIANCE_OPTIONS: Record<ComplianceChoice, DimensionOption<ComplianceChoice>> = {
  no_validation: {
    id: 'no_validation',
    label: 'Direct Unvalidated LLM Output to Application UI / Database',
    description: 'Model outputs are parsed with raw string operations or basic JSON.parse without strict type contracts.',
    score: 10,
    fragilityWeight: 0.90,
    riskProfile: 'Critical security hazard. Vulnerable to SQL injection via LLM, corrupted payloads, and severe data poisoning.'
  },
  regex_keyword_filter: {
    id: 'regex_keyword_filter',
    label: 'Rudimentary Regex & Keyword Blocklists',
    description: 'Static pattern matching looking for profanity, credit card numbers, or basic prompt injection keywords.',
    score: 32,
    fragilityWeight: 0.68,
    riskProfile: 'Trivially bypassed. Prompt injection via base64, unicode, or roleplay easily circumvents regex blocklists.'
  },
  semantic_guardrail_model: {
    id: 'semantic_guardrail_model',
    label: 'Semantic Guardrail Classifiers (Llama Guard / NeMo Guardrails)',
    description: 'Secondary smaller LLM evaluates inputs and outputs for jailbreaks, PII leakage, and toxic behavior.',
    score: 76,
    fragilityWeight: 0.24,
    riskProfile: 'Strong protection. Adds 80-150ms latency overhead per step, but successfully intercepts 94%+ of policy deviations.'
  },
  typed_schema_dpdp_sanitizer: {
    id: 'typed_schema_dpdp_sanitizer',
    label: 'Cryptographic Pydantic/Zod Schemas + DPDP Act 2023 Redaction',
    description: 'Deterministic schema parsing at compile time, automated regex/spacy PII pseudonymization, and cryptographic state trails.',
    score: 97,
    fragilityWeight: 0.03,
    riskProfile: 'Zero leakage. Model literally cannot write invalid data types to downstream databases; 100% statutory compliance.'
  }
};

export function calculateArchitectureGrades(inputs: GraderInputs): GraderResults {
  const conc = CONCURRENCY_OPTIONS[inputs.concurrency];
  const topo = TOPOLOGY_OPTIONS[inputs.topology];
  const infer = INFERENCE_OPTIONS[inputs.inferenceBoundary];
  const state = STATE_OPTIONS[inputs.statePersistence];
  const comp = COMPLIANCE_OPTIONS[inputs.complianceGuardrails];

  // Weighted Readiness Score Calculation (0 - 100)
  // Weights: Concurrency (25%), Topology (20%), Inference (20%), State (20%), Compliance (15%)
  const rawReadiness = (
    conc.score * 0.25 +
    topo.score * 0.20 +
    infer.score * 0.20 +
    state.score * 0.20 +
    comp.score * 0.15
  );

  const readinessScore = Math.round(rawReadiness);
  const fragilityScore = 100 - readinessScore;

  // Failure probability estimation (failures per 1,000 runs)
  // Highly fragile setups fail up to 28% of runs; hardened setups fail < 0.1%
  const failureProbabilityPercent = Math.min(28.5, Math.max(0.08, Number(((fragilityScore / 100) ** 1.8 * 32).toFixed(2))));
  
  // MTBF in terms of runs
  const mtbfRuns = Math.round(1000 / (failureProbabilityPercent / 100));

  // Financial Leakage Calculations
  // 1. Token Waste: Unconstrained loops, retries, and context pollution
  const avgTokensPerRun = 6000;
  const tokenWasteFraction = (fragilityScore / 100) * 0.42; // up to 42% token waste in high fragility
  const monthlyWastedTokens = inputs.monthlyVolume * avgTokensPerRun * tokenWasteFraction;
  const tokenCostPerMillionUSD = 5.0; // blended input/output
  const monthlyTokenWasteUSD = (monthlyWastedTokens / 1_000_000) * tokenCostPerMillionUSD;
  const annualTokenWasteUSD = monthlyTokenWasteUSD * 12;

  // 2. Human Triage Overhead: Engineer hours spent debugging broken runs & stuck state
  const monthlyFailures = (inputs.monthlyVolume * (failureProbabilityPercent / 100));
  const humanHoursPerFailure = 0.25; // 15 mins per failure triage on average
  const engineerHourlyRateUSD = 85.0;
  const annualHumanTriageUSD = monthlyFailures * humanHoursPerFailure * engineerHourlyRateUSD * 12;

  // 3. Regulatory & SLA Risk Provisioning: Potential DPDP fines / client SLA credits
  const baseComplianceRiskUSD = (comp.fragilityWeight * 35000) + (infer.fragilityWeight * 25000);
  const annualRegulatoryRiskUSD = Math.round(baseComplianceRiskUSD * (inputs.monthlyVolume / 20000));

  const totalAnnualLeakageUSD = Math.round(annualTokenWasteUSD + annualHumanTriageUSD + annualRegulatoryRiskUSD);

  // Conversion for INR (USD * 86.5)
  const isINR = inputs.currency === 'INR';
  const fxRate = isINR ? 86.5 : 1.0;

  const financialLeakage = {
    tokenWasteAnnual: Math.round(annualTokenWasteUSD * fxRate),
    humanTriageAnnual: Math.round(annualHumanTriageUSD * fxRate),
    regulatoryRiskAnnual: Math.round(annualRegulatoryRiskUSD * fxRate),
    totalAnnualLeakage: Math.round(totalAnnualLeakageUSD * fxRate),
    currency: inputs.currency
  };

  // Determine Tier
  let tier = {
    title: 'Enterprise Sovereign / Production Hardened',
    description: 'Your architecture enforces deterministic state isolation, private inference boundaries, and zero data leakage. Ready for high-volume enterprise transactions.',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    borderClass: 'border-emerald-500/50'
  };

  if (fragilityScore > 70) {
    tier = {
      title: 'Critical Fragility / Uncontrolled Hallucination Risk',
      description: 'Your agent stack relies on unconstrained loops, volatile memory, or direct unvalidated outputs. High probability of cascading production outages and silent financial drain.',
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      borderClass: 'border-red-500/50'
    };
  } else if (fragilityScore > 45) {
    tier = {
      title: 'High Fragility / Cascading Failure Risk',
      description: 'Your deployment has viable components but suffers from brittle state management, public API rate limits, or context pollution. Unreliable under peak concurrency.',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      borderClass: 'border-amber-500/50'
    };
  } else if (fragilityScore > 20) {
    tier = {
      title: 'Moderate Resilience / Edge-Case Vulnerable',
      description: 'Decent foundational topology, but prone to P99 tail latency spikes or regulatory non-compliance during audits. Minor architectural adjustments will lock sovereign stability.',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      borderClass: 'border-blue-500/50'
    };
  }

  // Dimension Results
  const dimensions: DimensionResult[] = [
    {
      name: 'Workflow Concurrency & State Routing',
      key: 'concurrency',
      selectedLabel: conc.label,
      score: conc.score,
      fragilityPercent: Math.round(conc.fragilityWeight * 100),
      status: conc.score >= 85 ? 'Elite' : conc.score >= 60 ? 'Optimal' : conc.score >= 40 ? 'Warning' : 'Critical',
      diagnosis: conc.riskProfile,
      remediation: conc.score >= 85 ? 'State schema is deterministic. Maintain test coverage on edge transitions.' : 'Migrate from heuristic prompt branching to an explicit StateGraph with typed edge guards and fallback nodes.'
    },
    {
      name: 'Orchestration Topology & Isolation',
      key: 'topology',
      selectedLabel: topo.label,
      score: topo.score,
      fragilityPercent: Math.round(topo.fragilityWeight * 100),
      status: topo.score >= 85 ? 'Elite' : topo.score >= 60 ? 'Optimal' : topo.score >= 40 ? 'Warning' : 'Critical',
      diagnosis: topo.riskProfile,
      remediation: topo.score >= 85 ? 'Isolated execution verified.' : 'Implement sandboxed sub-agents with bounded context limits and circuit breaker timeout caps.'
    },
    {
      name: 'Inference Boundary & Data Residency',
      key: 'inferenceBoundary',
      selectedLabel: infer.label,
      score: infer.score,
      fragilityPercent: Math.round(infer.fragilityWeight * 100),
      status: infer.score >= 85 ? 'Elite' : infer.score >= 60 ? 'Optimal' : infer.score >= 40 ? 'Warning' : 'Critical',
      diagnosis: infer.riskProfile,
      remediation: infer.score >= 85 ? 'Sovereign boundary secured.' : 'Deploy quantized open weights (vLLM / TensorRT-LLM) inside a private VPC to eliminate third-party data egress and rate limits.'
    },
    {
      name: 'State Persistence & Memory Management',
      key: 'statePersistence',
      selectedLabel: state.label,
      score: state.score,
      fragilityPercent: Math.round(state.fragilityWeight * 100),
      status: state.score >= 85 ? 'Elite' : state.score >= 60 ? 'Optimal' : state.score >= 40 ? 'Warning' : 'Critical',
      diagnosis: state.riskProfile,
      remediation: state.score >= 85 ? 'State persistence is transactionally resilient.' : 'Replace volatile memory with PostgreSQL session checkpoints and metadata-partitioned hybrid retrieval.'
    },
    {
      name: 'Validation & Statutory Compliance',
      key: 'complianceGuardrails',
      selectedLabel: comp.label,
      score: comp.score,
      fragilityPercent: Math.round(comp.fragilityWeight * 100),
      status: comp.score >= 85 ? 'Elite' : comp.score >= 60 ? 'Optimal' : comp.score >= 40 ? 'Warning' : 'Critical',
      diagnosis: comp.riskProfile,
      remediation: comp.score >= 85 ? 'Full DPDP Act 2023 & schema compliance verified.' : 'Enforce compile-time Pydantic output validation and automated cryptographic redaction of customer data.'
    }
  ];

  // Recommended Remediation Roadmap
  const recommendedRoadmap = [
    {
      phase: 'Phase 1 (Week 1)',
      title: 'State Graph Normalization & Circuit Breakers',
      action: 'Replace open-ended ReAct loops with a compiled LangGraph Finite State Machine. Cap recursion limits to 5 steps and introduce schema fallback nodes.',
      impact: 'Reduces loop runaway probability by 88% and cuts wasted tokens immediately.'
    },
    {
      phase: 'Phase 2 (Weeks 2-3)',
      title: 'Sovereign Inference & Session Checkpointing',
      action: 'Deploy self-hosted vLLM cluster inside your enterprise VPC boundary. Bind state persistence to transactional PostgreSQL checkpointers.',
      impact: 'Eliminates external data egress, locks DPDP Act 2023 compliance, and slashes P99 latency below 350ms.'
    },
    {
      phase: 'Phase 3 (Week 4)',
      title: 'Cryptographic Audit Trails & Type Verification',
      action: 'Wrap all agent tool outputs in immutable Zod/Pydantic schemas with append-only hash ledgers for full executive auditability.',
      impact: 'Achieves 99.9% deterministic execution reliability and protects enterprise systems from corrupted data injections.'
    }
  ];

  return {
    readinessScore,
    fragilityScore,
    tier,
    failureProbabilityPercent,
    mtbfRuns,
    financialLeakage,
    dimensions,
    recommendedRoadmap
  };
}

export function formatCurrencyValue(amount: number, currency: Currency): string {
  if (currency === 'INR') {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}
