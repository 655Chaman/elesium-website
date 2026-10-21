/**
 * Enterprise Autonomous Agent Tally ERP / Prime XML Gateway & Ledger Reconciliation Model (Tool #46)
 * Simulates TDL XML-over-HTTP port 9000 voucher ingestion, GST Rule 36(4) verification,
 * straight-through processing (STP) rate, and finance department OPEX savings.
 */

export type TallyIntegrationMode = 
  | 'xml_http_tdl'
  | 'odbc_sql_bridge'
  | 'json_rest_wrapper'
  | 'direct_tcp_stream';

export type LlmAgentArchitecture =
  | 'deterministic_langgraph'
  | 'local_vllm_airgapped'
  | 'hybrid_router'
  | 'direct_api_unbounded';

export type ReconciliationComplexity =
  | 'standard_invoicing'
  | 'gst_rule_36_4_itc'
  | 'multi_currency_forex'
  | 'bill_of_materials_mfg';

export interface TallyErpInputs {
  monthlyVoucherVolume: number; // 500 to 50,000
  tallyIntegrationMode: TallyIntegrationMode;
  llmAgentArchitecture: LlmAgentArchitecture;
  reconciliationComplexity: ReconciliationComplexity;
  humanInTheLoopThreshold: number; // 0.80 to 0.99
  currency: 'INR' | 'USD';
}

export interface TallyProcessingTracePoint {
  stage: number;
  latencyMs: number;
  label: string;
}

export interface TallyErpOutputs {
  voucherIngestionLatencyMs: number;
  reconciliationAccuracyPct: number;
  autoPostingSuccessRatePct: number;
  monthlyHumanHoursSaved: number;
  annualFinanceOpexSavings: string;
  gstMismatchAvoidanceValue: string;
  statusClassification: 'SOVEREIGN_AUTOMATED_LEDGER' | 'HIGH_CONFIDENCE_HYBRID' | 'MANUAL_TRIAGE_BOTTLENECK';
  voucherProcessingTrace: TallyProcessingTracePoint[];
}

export function calculateTallyErp(inputs: TallyErpInputs): TallyErpOutputs {
  const {
    monthlyVoucherVolume,
    tallyIntegrationMode,
    llmAgentArchitecture,
    reconciliationComplexity,
    humanInTheLoopThreshold,
    currency
  } = inputs;

  // 1. Integration Mode Base Latency & Reliability
  let baseProtocolLatencyMs = 28.0; // XML HTTP TDL default
  let protocolReliabilityMult = 1.0;

  switch (tallyIntegrationMode) {
    case 'xml_http_tdl':
      baseProtocolLatencyMs = 32.0;
      protocolReliabilityMult = 0.995;
      break;
    case 'odbc_sql_bridge':
      baseProtocolLatencyMs = 65.0;
      protocolReliabilityMult = 0.982;
      break;
    case 'json_rest_wrapper':
      baseProtocolLatencyMs = 45.0;
      protocolReliabilityMult = 0.998;
      break;
    case 'direct_tcp_stream':
      baseProtocolLatencyMs = 18.0;
      protocolReliabilityMult = 0.999;
      break;
  }

  // 2. LLM Architecture Latency & Accuracy
  let agentInferenceLatencyMs = 180.0;
  let baseAccuracy = 0.992;

  switch (llmAgentArchitecture) {
    case 'deterministic_langgraph':
      agentInferenceLatencyMs = 140.0;
      baseAccuracy = 0.996;
      break;
    case 'local_vllm_airgapped':
      agentInferenceLatencyMs = 85.0;
      baseAccuracy = 0.994;
      break;
    case 'hybrid_router':
      agentInferenceLatencyMs = 210.0;
      baseAccuracy = 0.998;
      break;
    case 'direct_api_unbounded':
      agentInferenceLatencyMs = 480.0;
      baseAccuracy = 0.942;
      break;
  }

  // 3. Reconciliation Complexity Impact
  let complexityMultiplier = 1.0;
  let accuracyPenalty = 0.0;

  switch (reconciliationComplexity) {
    case 'standard_invoicing':
      complexityMultiplier = 1.0;
      accuracyPenalty = 0.0;
      break;
    case 'gst_rule_36_4_itc':
      complexityMultiplier = 1.35;
      accuracyPenalty = 0.003;
      break;
    case 'multi_currency_forex':
      complexityMultiplier = 1.25;
      accuracyPenalty = 0.005;
      break;
    case 'bill_of_materials_mfg':
      complexityMultiplier = 1.50;
      accuracyPenalty = 0.008;
      break;
  }

  // Calculate Net Metrics
  const totalLatencyMs = Math.round((baseProtocolLatencyMs + agentInferenceLatencyMs) * complexityMultiplier);
  const netAccuracyPct = Math.min(99.9, Math.max(90.0, Number(((baseAccuracy - accuracyPenalty) * 100).toFixed(1))));

  // Auto-posting success rate depends on threshold & accuracy
  const autoPostingSuccessRate = Math.min(99.4, Math.max(75.0, Number((netAccuracyPct * protocolReliabilityMult * (humanInTheLoopThreshold > 0.95 ? 0.94 : 0.985)).toFixed(1))));

  // Operational Savings Calculation
  // Standard human AP clerk takes ~8 minutes per manual invoice verification & Tally voucher entry
  const manualMinutesPerVoucher = 8.0;
  const humanHoursRequiredManually = (monthlyVoucherVolume * manualMinutesPerVoucher) / 60.0;
  const monthlyHumanHoursSaved = Math.round(humanHoursRequiredManually * (autoPostingSuccessRate / 100.0));

  // Hourly cost of finance/accounting staff: ~₹450/hr ($18/hr)
  const hourlyRate = currency === 'INR' ? 450 : 18;
  const annualSavingsRaw = monthlyHumanHoursSaved * hourlyRate * 12;

  // GST mismatch avoidance: penalty mitigation on blocked ITC (estimated 1.5% of total voucher flow)
  const avgVoucherValue = currency === 'INR' ? 45000 : 600;
  const estimatedAnnualITCExposure = monthlyVoucherVolume * avgVoucherValue * 0.18 * 12;
  const rawGstMismatchSavings = estimatedAnnualITCExposure * 0.024 * (netAccuracyPct / 100);

  const formatCurrency = (val: number): string => {
    if (currency === 'INR') {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
      return `₹${Math.round(val).toLocaleString('en-IN')}`;
    } else {
      if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
      if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
      return `$${Math.round(val).toLocaleString('en-US')}`;
    }
  };

  let statusClassification: 'SOVEREIGN_AUTOMATED_LEDGER' | 'HIGH_CONFIDENCE_HYBRID' | 'MANUAL_TRIAGE_BOTTLENECK' = 'SOVEREIGN_AUTOMATED_LEDGER';
  if (totalLatencyMs > 400 || autoPostingSuccessRate < 85.0) {
    statusClassification = 'MANUAL_TRIAGE_BOTTLENECK';
  } else if (autoPostingSuccessRate < 95.0) {
    statusClassification = 'HIGH_CONFIDENCE_HYBRID';
  }

  // 12-point processing latency trace (Visual Telemetry)
  const stages = [
    { label: 'PDF Parsing (LayoutLMv3)', mult: 0.22 },
    { label: 'Vendor GSTIN Validation', mult: 0.12 },
    { label: 'Ledger Resolution (Vector)', mult: 0.18 },
    { label: 'GSTR-2B Rule 36(4) Check', mult: 0.15 },
    { label: 'XML Envelope Synthesis', mult: 0.10 },
    { label: 'Tally Port 9000 Post', mult: 0.13 },
    { label: 'Audit Hash Logging', mult: 0.10 }
  ];

  const voucherProcessingTrace: TallyProcessingTracePoint[] = stages.map((s, idx) => ({
    stage: idx + 1,
    latencyMs: Math.round(totalLatencyMs * s.mult),
    label: s.label
  }));

  return {
    voucherIngestionLatencyMs: totalLatencyMs,
    reconciliationAccuracyPct: netAccuracyPct,
    autoPostingSuccessRatePct: autoPostingSuccessRate,
    monthlyHumanHoursSaved,
    annualFinanceOpexSavings: formatCurrency(annualSavingsRaw),
    gstMismatchAvoidanceValue: formatCurrency(rawGstMismatchSavings),
    statusClassification,
    voucherProcessingTrace
  };
}
