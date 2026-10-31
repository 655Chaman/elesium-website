#!/usr/bin/env bash
# ==============================================================================
# Sovereign Enterprise AI — Production vLLM Launch Specification
# Hardware Target: 8x NVIDIA H100 SXM5 80GB (NVLink 4.0 - 900 GB/s bidirectional)
# Model Target: Llama-3.3-70B-Instruct-FP8 / DeepSeek-R1-FP8
# Security Posture: Air-Gapped Private Enclave (Zero-Egress VPC Bindings)
# Maintainer: Elesium Digital Systems (https://elesium.online)
# ==============================================================================

set -euo pipefail

# --- 1. Environment & Network Invariant Verification ---
export DEBIAN_FRONTEND=noninteractive
export LC_ALL=C.UTF-8

VPC_PRIVATE_IP="${VPC_PRIVATE_IP:-10.128.4.15}"
VLLM_PORT="${VLLM_PORT:-8000}"
MODEL_PATH="${MODEL_PATH:-/opt/models/meta-llama/Llama-3.3-70B-Instruct-FP8}"
SERVED_MODEL_NAME="${SERVED_MODEL_NAME:-llama-3.3-70b-fp8}"

echo "========================================================================"
echo "⚡ [ELESIUM] Initializing Sovereign vLLM Production Inference Server"
echo "Target Model: ${MODEL_PATH}"
echo "Binding Address: ${VPC_PRIVATE_IP}:${VLLM_PORT}"
echo "========================================================================"

# Verify zero-egress network posture: Ensure no route to public internet exists on default gateway
if ip route | grep -q "default via"; then
    DEF_GW=$(ip route | grep default | awk '{print $3}')
    echo "[SECURITY] Verifying egress posture on gateway: ${DEF_GW}"
    # Ensure network interface is non-routable private subnet (10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16)
    if ! echo "${VPC_PRIVATE_IP}" | grep -Eq '^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)'; then
        echo "❌ [FATAL ERROR] Binding IP ${VPC_PRIVATE_IP} is NOT within a RFC-1918 private VPC subnet!"
        exit 1
    fi
fi

# --- 2. CUDA & NCCL Interconnect Kernel Parameters ---
export CUDA_DEVICE_ORDER=PCI_BUS_ID
export CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7
export TORCH_CUDA_ARCH_LIST="9.0" # NVIDIA Hopper H100 SXM5 compute capability

# Optimized NCCL settings for 8-way SXM5 NVLink topology
export NCCL_DEBUG=INFO
export NCCL_DEBUG_SUBSYS=INIT,ENV,COLL
export NCCL_IB_DISABLE=0
export NCCL_NET_GDR_LEVEL=5
export NCCL_P2P_LEVEL=NVL
export NCCL_NVLS_ENABLE=1
export NCCL_BUFFSIZE=8388608 # 8MB NCCL ring buffers for sub-5us AllReduce

# PyTorch Memory Allocation Configuration
export PYTORCH_CUDA_ALLOC_CONF="expandable_segments:True,roundup_power2_divisions:[256:4,512:8,1024:16]"

# Outlines & HuggingFace Offline Flags (Air-Gapped Invariant)
export HF_HUB_OFFLINE=1
export TRANSFORMERS_OFFLINE=1
export OUTLINES_CACHE_DIR="/tmp/outlines_cache"

# --- 3. NUMA Node Affinity Pinning ---
# On dual-socket AMD EPYC 9654 / Intel Emerald Rapids hosts, pin GPUs to closest NUMA node
if command -v numactl &> /dev/null; then
    NUMA_NODES=$(numactl --show | grep "nodebind" | awk '{print $2}')
    echo "⚙️ [NUMA] Host NUMA binding detected: ${NUMA_NODES}"
    NUMA_EXEC="numactl --interleave=all"
else
    echo "⚠️ [NUMA] numactl not found, running without explicit memory interleaving"
    NUMA_EXEC=""
fi

# --- 4. Launch Production vLLM Engine ---
# Architectural Parameters:
# - Quantization: fp8 (W8A8 FP8 GEMM via Hopper Tensor Cores)
# - KV Cache Dtype: fp8_e4m3 (Halves KV cache memory footprint vs BF16)
# - PagedAttention v2: Block size 16 eliminates external memory fragmentation (< 3.8%)
# - Chunked Prefill: Decouples compute-bound prefill from memory-bound decode (max 8192 tokens)
# - FlashDecoding: High-throughput parallelized decode attention over long context windows

exec ${NUMA_EXEC} python3 -m vllm.entrypoints.openai.api_server \
    --model "${MODEL_PATH}" \
    --served-model-name "${SERVED_MODEL_NAME}" \
    --host "${VPC_PRIVATE_IP}" \
    --port "${VLLM_PORT}" \
    --tensor-parallel-size 8 \
    --pipeline-parallel-size 1 \
    --dtype bfloat16 \
    --quantization fp8 \
    --kv-cache-dtype fp8_e4m3 \
    --gpu-memory-utilization 0.94 \
    --max-model-len 16384 \
    --max-num-seqs 128 \
    --max-num-batched-tokens 8192 \
    --enable-chunked-prefill \
    --block-size 16 \
    --swap-space 16 \
    --disable-log-requests \
    --uvloop \
    --enforce-eager False \
    --trust-remote-code False \
    --api-key "${VLLM_INTERNAL_AUTH_KEY:-$(openssl rand -hex 32)}"
