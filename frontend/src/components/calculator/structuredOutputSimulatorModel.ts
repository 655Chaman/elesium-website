/**
 * structuredOutputSimulatorModel.ts
 *
 * Mathematical and engineering simulation model comparing:
 * 1. Naive Prompt Engineering + Pydantic Retry Loops (Unconstrained Generation)
 * 2. Vendor Tool Calling / Function Calling API (Proprietary Cloud Masking)
 * 3. Deterministic Constrained Decoding / CFG Logit Masking (Outlines / vLLM XGrammar / GBNF)
 *
 * Models token wastage from retries, CUDA grammar compilation overhead,
 * inter-token latencies, monthly cloud API spend, and 100% schema compliance guarantees.
 */

export type SchemaComplexity = 'simple' | 'medium' | 'deep_ast';
export type HardwareDeployment = 'cloud_frontier' | 'sovereign_vllm';

export interface StructuredOutputInputs {
  monthlyRequests: number;           // 10,000 to 5,000,000 requests/mo
  schemaComplexity: SchemaComplexity;// 'simple' (flat), 'medium' (nested enums), 'deep_ast' (recursive unions)
  hardwareDeployment: HardwareDeployment; // 'cloud_frontier' (GPT-4o/Claude 3.5) vs 'sovereign_vllm' (Llama 3.3 70B/Qwen 2.5)
  avgOutputTokens: number;           // 150 to 2,000 tokens per structured payload
  pydanticRetryCountMax: number;     // 1 to 3 max retries on parse failure
}

export interface EngineBenchmarkMetrics {
  name: string;
  engineType: 'unconstrained' | 'vendor_tools' | 'xgrammar_cfg';
  parseErrorRatePct: number;         // Initial generation JSON parse failure rate (%)
  effectiveFailRatePct: number;      // Failure rate after all retry attempts (%)
  avgRetryCount: number;             // Expected retry cycles per request
  wastedRetryTokensPerReq: number;   // Wasted output + re-prompt tokens per request
  ttftMs: number;                    // Time-to-first-token (ms)
  interTokenLatencyMs: number;       // Average time per generated token (ms)
  totalExecutionLatencyMs: number;   // Full request turnaround time (ms)
  monthlyInputTokens: number;        // Total input token volume
  monthlyOutputTokens: number;       // Total output token volume (including retries)
  monthlyTokenCostUSD: number;       // Total monthly inferencing expenditure ($)
  annualizedCostUSD: number;         // 12-month projected spend ($)
  schemaComplianceGuarantee: string; // Deterministic guarantee description
}

export interface StructuredOutputSimulationResult {
  inputs: StructuredOutputInputs;
  unconstrainedEngine: EngineBenchmarkMetrics;
  vendorToolCalling: EngineBenchmarkMetrics;
  constrainedDecodingEngine: EngineBenchmarkMetrics;
  monthlyTokenSavingsUSD: number;    // Dollar savings between unconstrained vs constrained
  annualTokenSavingsUSD: number;
  costReductionPct: number;          // Percent cost reduction
  latencyReductionPct: number;       // Latency cut from avoiding retry roundtrips
  avoidedRetryTokensMonthly: number; // Millions of tokens saved from zero retries
}

/**
 * Base pricing parameters (per 1,000,000 tokens)
 */
const PRICING = {
  cloud_frontier: {
    inputPerM: 2.50,   // GPT-4o / Claude 3.5 Sonnet average
    outputPerM: 10.00,
  },
  sovereign_vllm: {
    inputPerM: 0.35,   // Private cluster Llama 3.3 70B amortized GPU compute
    outputPerM: 0.85,
  }
};

/**
 * Complexity multipliers and failure baselines
 */
const COMPLEXITY_METRICS = {
  simple: {
    promptInputTokens: 350,
    unconstrainedInitialFailPct: 3.2,
    vendorToolFailPct: 0.4,
    grammarFsmCompileMs: 1.2,
    maskingOverheadPerTokenMs: 0.08,
  },
  medium: {
    promptInputTokens: 850,
    unconstrainedInitialFailPct: 8.6,
    vendorToolFailPct: 1.2,
    grammarFsmCompileMs: 3.5,
    maskingOverheadPerTokenMs: 0.15,
  },
  deep_ast: {
    promptInputTokens: 1800,
    unconstrainedInitialFailPct: 18.4,
    vendorToolFailPct: 3.8,
    grammarFsmCompileMs: 8.2,
    maskingOverheadPerTokenMs: 0.28,
  }
};

export function simulateStructuredOutput(inputs: StructuredOutputInputs): StructuredOutputSimulationResult {
  const {
    monthlyRequests,
    schemaComplexity,
    hardwareDeployment,
    avgOutputTokens,
    pydanticRetryCountMax
  } = inputs;

  const comp = COMPLEXITY_METRICS[schemaComplexity];
  const pricing = PRICING[hardwareDeployment];

  // Baseline latencies based on hardware
  const baseTTFT = hardwareDeployment === 'cloud_frontier' ? 420 : 180;
  const baseInterTokenMs = hardwareDeployment === 'cloud_frontier' ? 18.5 : 8.2;

  // 1. Unconstrained Generation + Pydantic Retry Loops
  const unconstrainedInitialFail = comp.unconstrainedInitialFailPct;
  // Geometric series approximation of retry executions
  const failProb = unconstrainedInitialFail / 100.0;
  const avgRetries = failProb * (1 - Math.pow(failProb, pydanticRetryCountMax)) / (1 - failProb);
  const effectiveFailPct = Math.pow(failProb, pydanticRetryCountMax + 1) * 100.0;
  
  // Each retry re-sends prompt + error trace (~180 tokens) and re-generates output
  const wastedTokensPerRetry = comp.promptInputTokens + 180 + avgOutputTokens;
  const wastedTokensPerReq = avgRetries * wastedTokensPerRetry;
  
  const unconstrainedTTFT = baseTTFT;
  const unconstrainedLatency = baseTTFT + (avgOutputTokens * baseInterTokenMs) + (avgRetries * (baseTTFT + (avgOutputTokens * baseInterTokenMs) + 45)); // 45ms Pydantic parse/re-prompt overhead
  
  const unconstrainedMonthlyInput = monthlyRequests * (comp.promptInputTokens + avgRetries * (comp.promptInputTokens + 180));
  const unconstrainedMonthlyOutput = monthlyRequests * (avgOutputTokens + avgRetries * avgOutputTokens);
  const unconstrainedMonthlyCost = ((unconstrainedMonthlyInput / 1_000_000) * pricing.inputPerM) + 
                                  ((unconstrainedMonthlyOutput / 1_000_000) * pricing.outputPerM);

  const unconstrainedEngine: EngineBenchmarkMetrics = {
    name: 'Unconstrained Prompt + Pydantic Retry Loop',
    engineType: 'unconstrained',
    parseErrorRatePct: unconstrainedInitialFail,
    effectiveFailRatePct: Number(effectiveFailPct.toFixed(2)),
    avgRetryCount: Number(avgRetries.toFixed(3)),
    wastedRetryTokensPerReq: Math.round(wastedTokensPerReq),
    ttftMs: Math.round(unconstrainedTTFT),
    interTokenLatencyMs: Number(baseInterTokenMs.toFixed(1)),
    totalExecutionLatencyMs: Math.round(unconstrainedLatency),
    monthlyInputTokens: Math.round(unconstrainedMonthlyInput),
    monthlyOutputTokens: Math.round(unconstrainedMonthlyOutput),
    monthlyTokenCostUSD: Math.round(unconstrainedMonthlyCost),
    annualizedCostUSD: Math.round(unconstrainedMonthlyCost * 12),
    schemaComplianceGuarantee: 'Probabilistic (Retries on syntax/type violations; prone to failure on recursive schemas)'
  };

  // 2. Vendor Tool Calling / Function Calling API
  const vendorFailPct = comp.vendorToolFailPct;
  const vendorFailProb = vendorFailPct / 100.0;
  const vendorAvgRetries = vendorFailProb * 0.5; // usually 1 retry if vendor fails
  const vendorWastedTokens = vendorAvgRetries * (comp.promptInputTokens + avgOutputTokens);
  
  // Vendor adds proprietary JSON grammar masking overhead to TTFT
  const vendorTTFT = baseTTFT + 95;
  const vendorLatency = vendorTTFT + (avgOutputTokens * (baseInterTokenMs + 0.5));
  
  const vendorMonthlyInput = monthlyRequests * comp.promptInputTokens;
  const vendorMonthlyOutput = monthlyRequests * avgOutputTokens;
  // If vendor tool calling, cloud pricing applies
  const vendorPricing = PRICING['cloud_frontier'];
  const vendorMonthlyCost = ((vendorMonthlyInput / 1_000_000) * vendorPricing.inputPerM) + 
                            ((vendorMonthlyOutput / 1_000_000) * vendorPricing.outputPerM);

  const vendorToolCalling: EngineBenchmarkMetrics = {
    name: 'Cloud Vendor Function Calling API',
    engineType: 'vendor_tools',
    parseErrorRatePct: vendorFailPct,
    effectiveFailRatePct: Number((vendorFailPct * 0.2).toFixed(2)),
    avgRetryCount: Number(vendorAvgRetries.toFixed(3)),
    wastedRetryTokensPerReq: Math.round(vendorWastedTokens),
    ttftMs: Math.round(vendorTTFT),
    interTokenLatencyMs: Number((baseInterTokenMs + 0.5).toFixed(1)),
    totalExecutionLatencyMs: Math.round(vendorLatency),
    monthlyInputTokens: Math.round(vendorMonthlyInput),
    monthlyOutputTokens: Math.round(vendorMonthlyOutput),
    monthlyTokenCostUSD: Math.round(vendorMonthlyCost),
    annualizedCostUSD: Math.round(vendorMonthlyCost * 12),
    schemaComplianceGuarantee: 'Vendor Masking (High reliability; black-box schema constraints; high token markup)'
  };

  // 3. Deterministic Constrained Decoding (Outlines / vLLM XGrammar / GBNF)
  // 0% syntax failure rate mathematically enforced via token logit masking
  // FSM compilation overhead happens once or cached in sub-3ms; logit masking adds sub-0.2ms
  const constrainedTTFT = baseTTFT + comp.grammarFsmCompileMs;
  const constrainedInterToken = baseInterTokenMs + comp.maskingOverheadPerTokenMs;
  const constrainedLatency = constrainedTTFT + (avgOutputTokens * constrainedInterToken);

  const constrainedMonthlyInput = monthlyRequests * comp.promptInputTokens;
  const constrainedMonthlyOutput = monthlyRequests * avgOutputTokens;
  const constrainedPricing = PRICING[hardwareDeployment];
  const constrainedMonthlyCost = ((constrainedMonthlyInput / 1_000_000) * constrainedPricing.inputPerM) + 
                                ((constrainedMonthlyOutput / 1_000_000) * constrainedPricing.outputPerM);

  const constrainedDecodingEngine: EngineBenchmarkMetrics = {
    name: 'Elesium Constrained Decoding (XGrammar / Outlines)',
    engineType: 'xgrammar_cfg',
    parseErrorRatePct: 0.0,
    effectiveFailRatePct: 0.0,
    avgRetryCount: 0.0,
    wastedRetryTokensPerReq: 0,
    ttftMs: Math.round(constrainedTTFT),
    interTokenLatencyMs: Number(constrainedInterToken.toFixed(2)),
    totalExecutionLatencyMs: Math.round(constrainedLatency),
    monthlyInputTokens: Math.round(constrainedMonthlyInput),
    monthlyOutputTokens: Math.round(constrainedMonthlyOutput),
    monthlyTokenCostUSD: Math.round(constrainedMonthlyCost),
    annualizedCostUSD: Math.round(constrainedMonthlyCost * 12),
    schemaComplianceGuarantee: '100% Deterministic (Zero invalid tokens sampled; mathematically impossible to produce invalid JSON)'
  };

  // Comparisons
  const monthlySavingsUSD = Math.max(0, unconstrainedMonthlyCost - constrainedMonthlyCost);
  const annualSavingsUSD = monthlySavingsUSD * 12;
  const costReductionPct = unconstrainedMonthlyCost > 0 
    ? Math.round(((unconstrainedMonthlyCost - constrainedMonthlyCost) / unconstrainedMonthlyCost) * 100) 
    : 0;
  const latencyReductionPct = unconstrainedLatency > 0 
    ? Math.round(((unconstrainedLatency - constrainedLatency) / unconstrainedLatency) * 100) 
    : 0;
  const avoidedRetryTokensMonthly = Math.round((monthlyRequests * wastedTokensPerReq) / 1_000_000);

  return {
    inputs,
    unconstrainedEngine,
    vendorToolCalling,
    constrainedDecodingEngine,
    monthlyTokenSavingsUSD: Math.round(monthlySavingsUSD),
    annualTokenSavingsUSD: Math.round(annualSavingsUSD),
    costReductionPct,
    latencyReductionPct,
    avoidedRetryTokensMonthly
  };
}
