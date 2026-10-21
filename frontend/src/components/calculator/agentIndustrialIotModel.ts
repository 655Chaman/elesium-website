export type FieldbusProtocol = 
  | 'opc_ua' 
  | 'modbus_tcp' 
  | 'profinet' 
  | 'ethercat';

export type EdgeComputePlatform = 
  | 'nvidia_jetson_agx' 
  | 'industrial_x86_ipc' 
  | 'raspberry_pi_cm4' 
  | 'server_grade_edge';

export type AnomalyDetectionModel = 
  | 'temporal_autoencoder' 
  | 'spectral_fft_threshold' 
  | 'isolation_forest' 
  | 'raw_threshold';

export interface IndustrialIotInputs {
  connectedPlcCount: number; // 1 to 100 PLCs
  fieldbusProtocol: FieldbusProtocol;
  samplingFrequencyHz: number; // 10 to 1000 Hz
  edgeComputePlatform: EdgeComputePlatform;
  dataBufferingHours: number; // 1 to 72 hours
  anomalyDetectionModel: AnomalyDetectionModel;
  currency: 'INR' | 'USD';
}

export interface IndustrialLatencyPoint {
  plcCount: number;
  edgeLatencyMs: number;
}

export interface IndustrialIotOutputs {
  edgeP99LatencyMs: number;
  bandwidthConsumedKbps: number;
  anomalyDetectionAccuracyPct: number;
  unplannedDowntimeReductionPct: number;
  annualScrapCostSavings: number;
  annualToolingConservation: number;
  statusClassification: 'DETERMINISTIC_EDGE_HARDENED' | 'BANDWIDTH_CONSTRAINED' | 'LATENCY_EXCEEDED' | 'ANOMALY_OVERRUN';
  recommendationNote: string;
  latencyTrace: IndustrialLatencyPoint[];
}

export function calculateIndustrialIot(inputs: IndustrialIotInputs): IndustrialIotOutputs {
  const {
    connectedPlcCount,
    fieldbusProtocol,
    samplingFrequencyHz,
    edgeComputePlatform,
    anomalyDetectionModel,
    currency
  } = inputs;

  // Protocol latency overhead base (ms)
  let protocolBaseMs = 12.0;
  let protocolBandwidthFactor = 1.0;
  switch (fieldbusProtocol) {
    case 'ethercat':
      protocolBaseMs = 2.5;
      protocolBandwidthFactor = 0.6;
      break;
    case 'profinet':
      protocolBaseMs = 4.8;
      protocolBandwidthFactor = 0.8;
      break;
    case 'opc_ua':
      protocolBaseMs = 7.5;
      protocolBandwidthFactor = 1.0;
      break;
    case 'modbus_tcp':
      protocolBaseMs = 18.0;
      protocolBandwidthFactor = 1.35;
      break;
  }

  // Edge compute capability multiplier
  let computeMultiplier = 1.0;
  switch (edgeComputePlatform) {
    case 'nvidia_jetson_agx':
      computeMultiplier = 0.55;
      break;
    case 'server_grade_edge':
      computeMultiplier = 0.40;
      break;
    case 'industrial_x86_ipc':
      computeMultiplier = 0.75;
      break;
    case 'raspberry_pi_cm4':
      computeMultiplier = 2.40;
      break;
  }

  // Model latency and accuracy
  let modelLatencyMs = 6.0;
  let modelAccuracyPct = 96.5;
  switch (anomalyDetectionModel) {
    case 'temporal_autoencoder':
      modelLatencyMs = 14.0;
      modelAccuracyPct = 99.1;
      break;
    case 'spectral_fft_threshold':
      modelLatencyMs = 5.5;
      modelAccuracyPct = 97.4;
      break;
    case 'isolation_forest':
      modelLatencyMs = 8.0;
      modelAccuracyPct = 95.8;
      break;
    case 'raw_threshold':
      modelLatencyMs = 1.2;
      modelAccuracyPct = 84.5;
      break;
  }

  // Scaling latency calculation
  const contentionDelay = Math.pow(connectedPlcCount / 10, 1.2) * computeMultiplier * 1.8;
  const edgeP99LatencyMs = Number((protocolBaseMs + (modelLatencyMs * computeMultiplier) + contentionDelay).toFixed(1));

  // Bandwidth calculation (tags per PLC ~ 25 tags * 4 bytes float)
  const tagsPerPlc = 25;
  const rawDataRateKbps = (connectedPlcCount * tagsPerPlc * 4 * samplingFrequencyHz * 8) / 1024;
  // Edge compression compresses data by 85% before cloud sync
  const bandwidthConsumedKbps = Number((rawDataRateKbps * 0.15 * protocolBandwidthFactor).toFixed(1));

  // Accuracy adjustments
  let anomalyDetectionAccuracyPct = modelAccuracyPct;
  if (edgeComputePlatform === 'raspberry_pi_cm4' && connectedPlcCount > 20) {
    anomalyDetectionAccuracyPct = Math.max(78.0, modelAccuracyPct - 12.0);
  }
  anomalyDetectionAccuracyPct = Number(anomalyDetectionAccuracyPct.toFixed(1));

  // Downtime reduction calculation (%)
  let unplannedDowntimeReductionPct = 88.5;
  if (anomalyDetectionAccuracyPct > 98) unplannedDowntimeReductionPct = 94.2;
  else if (anomalyDetectionAccuracyPct < 90) unplannedDowntimeReductionPct = 68.0;

  // Economic calculations (Typical Indian Automotive Tier-1 Plant)
  const baselineScrapAnnualInr = 45000000; // ₹4.5 Crore annual scrap
  const baselineToolingAnnualInr = 28000000; // ₹2.8 Crore annual tooling
  const scrapSavingsInr = Math.round(baselineScrapAnnualInr * (unplannedDowntimeReductionPct / 100) * 0.42);
  const toolingSavingsInr = Math.round(baselineToolingAnnualInr * (unplannedDowntimeReductionPct / 100) * 0.35);

  const fxRate = 87.5;
  const annualScrapCostSavings = currency === 'INR' ? scrapSavingsInr : Math.round(scrapSavingsInr / fxRate);
  const annualToolingConservation = currency === 'INR' ? toolingSavingsInr : Math.round(toolingSavingsInr / fxRate);

  // Status classification
  let statusClassification: IndustrialIotOutputs['statusClassification'] = 'DETERMINISTIC_EDGE_HARDENED';
  let recommendationNote = 'Architecture is delivering sub-50ms deterministic edge closed-loop control across all connected fieldbuses.';

  if (edgeP99LatencyMs > 80.0) {
    statusClassification = 'LATENCY_EXCEEDED';
    recommendationNote = 'CRITICAL: Edge processing latency exceeds 80ms threshold. Upgrade edge IPC hardware or optimize sampling frequency to avoid feed-hold overrun.';
  } else if (bandwidthConsumedKbps > 5000) {
    statusClassification = 'BANDWIDTH_CONSTRAINED';
    recommendationNote = 'WARNING: Uncompressed telemetry is saturating local factory subnet. Enforce edge spectral FFT compression.';
  } else if (anomalyDetectionAccuracyPct < 90.0) {
    statusClassification = 'ANOMALY_OVERRUN';
    recommendationNote = 'ADVISORY: Anomaly model precision is sub-optimal. Deploy Temporal Autoencoder for acoustic and vibration channels.';
  }

  // 20-Point Latency Trace across increasing PLC scale (1 to 100)
  const latencyTrace: IndustrialLatencyPoint[] = [];
  for (let i = 1; i <= 20; i++) {
    const plcCount = Math.max(1, Math.round((i / 20) * connectedPlcCount));
    const delay = Math.pow(plcCount / 10, 1.2) * computeMultiplier * 1.8;
    const ptMs = protocolBaseMs + (modelLatencyMs * computeMultiplier) + delay;
    latencyTrace.push({
      plcCount,
      edgeLatencyMs: Number(ptMs.toFixed(1))
    });
  }

  return {
    edgeP99LatencyMs,
    bandwidthConsumedKbps,
    anomalyDetectionAccuracyPct,
    unplannedDowntimeReductionPct,
    annualScrapCostSavings,
    annualToolingConservation,
    statusClassification,
    recommendationNote,
    latencyTrace
  };
}
