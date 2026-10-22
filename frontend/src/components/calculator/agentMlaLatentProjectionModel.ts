export type MlaModelArchitecture =
  | 'deepseek_v3_671b'
  | 'deepseek_r1_reasoning'
  | 'llama_3_1_70b_gqa_comp'
  | 'sovereign_100b_mla';

export type AttentionMechanismType =
  | 'mla_low_rank_latent'
  | 'gqa_grouped_query'
  | 'mha_standard_multi_head';

export type MlaPrecisionMode = 'fp16' | 'fp8' | 'int4';

export interface MlaLatentProjectionInputs {
  modelArchitecture: MlaModelArchitecture;
  attentionMechanism: AttentionMechanismType;
  contextLength: number;
  latentVectorDimension: number; // e.g. 512
  decoupledRopeDimension: number; // e.g. 64
  precisionMode: MlaPrecisionMode;
  currency: 'INR' | 'USD';
}

export interface MlaLatentProjectionResults {
  uncompressedMhaKvGb: number;
  gqaEquivalentKvGb: number;
  mlaCompressedKvGb: number;
  vramCompressionFactor: number;
  vramReclaimedGb: number;
  maxConcurrentStreamsPerNode: number;
  hardwareSavingsUsd: number;
  formattedHardwareSavings: string;
  statusClassification:
    | 'EXTREME_MLA_90_PERCENT_REDUCTION'
    | 'BALANCED_MLA_COMPRESSION'
    | 'GQA_STANDARD_OCCUPANCY'
    | 'MHA_OOM_VRAM_EXHAUSTION';
}

export function calculateMlaLatentProjection(
  inputs: MlaLatentProjectionInputs
): MlaLatentProjectionResults {
  const {
    modelArchitecture,
    attentionMechanism,
    contextLength,
    latentVectorDimension,
    decoupledRopeDimension,
    precisionMode,
    currency
  } = inputs;

  // Precision multiplier: FP16 = 2 bytes, FP8 = 1 byte, INT4 = 0.5 bytes
  let bytesPerElement = 2.0;
  if (precisionMode === 'fp8') bytesPerElement = 1.0;
  if (precisionMode === 'int4') bytesPerElement = 0.5;

  // Architecture parameters (num_layers, num_heads, head_dim)
  let numLayers = 61; // DeepSeek-V3
  let numQueryHeads = 128;
  let headDim = 128;
  let gqaKvHeads = 8;

  if (modelArchitecture === 'deepseek_r1_reasoning') {
    numLayers = 61;
    numQueryHeads = 128;
    headDim = 128;
    gqaKvHeads = 8;
  } else if (modelArchitecture === 'llama_3_1_70b_gqa_comp') {
    numLayers = 80;
    numQueryHeads = 64;
    headDim = 128;
    gqaKvHeads = 8;
  } else if (modelArchitecture === 'sovereign_100b_mla') {
    numLayers = 80;
    numQueryHeads = 96;
    headDim = 128;
    gqaKvHeads = 8;
  }

  // 1. Full Multi-Head Attention (MHA): 2 * num_layers * numQueryHeads * headDim * bytesPerElement
  const mhaBytesPerToken = 2 * numLayers * numQueryHeads * headDim * bytesPerElement;
  const uncompressedMhaKvGb = Number(
    ((contextLength * mhaBytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );

  // 2. Grouped-Query Attention (GQA): 2 * num_layers * gqaKvHeads * headDim * bytesPerElement
  const gqaBytesPerToken = 2 * numLayers * gqaKvHeads * headDim * bytesPerElement;
  const gqaEquivalentKvGb = Number(
    ((contextLength * gqaBytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );

  // 3. Multi-Head Latent Attention (MLA): num_layers * (latentVectorDimension + decoupledRopeDimension) * bytesPerElement
  const mlaBytesPerToken = numLayers * (latentVectorDimension + decoupledRopeDimension) * bytesPerElement;
  const mlaCompressedKvGb = Number(
    ((contextLength * mlaBytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );

  let activeKvGb = mlaCompressedKvGb;
  let vramCompressionFactor = Number((uncompressedMhaKvGb / Math.max(0.01, mlaCompressedKvGb)).toFixed(1));
  let vramReclaimedGb = Number((uncompressedMhaKvGb - mlaCompressedKvGb).toFixed(2));
  let statusClassification: MlaLatentProjectionResults['statusClassification'] =
    'EXTREME_MLA_90_PERCENT_REDUCTION';

  if (attentionMechanism === 'mha_standard_multi_head') {
    activeKvGb = uncompressedMhaKvGb;
    vramCompressionFactor = 1.0;
    vramReclaimedGb = 0.0;
    statusClassification = activeKvGb > 320 ? 'MHA_OOM_VRAM_EXHAUSTION' : 'GQA_STANDARD_OCCUPANCY';
  } else if (attentionMechanism === 'gqa_grouped_query') {
    activeKvGb = gqaEquivalentKvGb;
    vramCompressionFactor = Number((uncompressedMhaKvGb / Math.max(0.01, gqaEquivalentKvGb)).toFixed(1));
    vramReclaimedGb = Number((uncompressedMhaKvGb - gqaEquivalentKvGb).toFixed(2));
    statusClassification = activeKvGb > 320 ? 'MHA_OOM_VRAM_EXHAUSTION' : 'GQA_STANDARD_OCCUPANCY';
  } else {
    // MLA
    statusClassification = vramCompressionFactor >= 10.0
      ? 'EXTREME_MLA_90_PERCENT_REDUCTION'
      : 'BALANCED_MLA_COMPRESSION';
  }

  // Max concurrency on an 8-GPU node (640 GB total HBM3, reserving 280 GB for weights)
  const availableKvHbmGb = 360.0;
  const maxConcurrentStreamsPerNode = Math.max(1, Math.floor(availableKvHbmGb / Math.max(0.5, activeKvGb)));

  // Hardware TCO Savings vs standard MHA cluster requirements
  const equivalentNodesNeeded = Math.ceil((uncompressedMhaKvGb * 16) / availableKvHbmGb);
  const mlaNodesNeeded = Math.ceil((mlaCompressedKvGb * 16) / availableKvHbmGb);
  const nodeDelta = Math.max(0, equivalentNodesNeeded - mlaNodesNeeded);
  const hardwareSavingsUsd = nodeDelta * 280000;

  const formattedHardwareSavings =
    currency === 'INR'
      ? `₹${((hardwareSavingsUsd * 87.5) / 10000000).toFixed(2)} Cr`
      : `$${(hardwareSavingsUsd / 1000).toFixed(0)}k USD`;

  return {
    uncompressedMhaKvGb,
    gqaEquivalentKvGb,
    mlaCompressedKvGb,
    vramCompressionFactor,
    vramReclaimedGb,
    maxConcurrentStreamsPerNode,
    hardwareSavingsUsd,
    formattedHardwareSavings,
    statusClassification
  };
}
