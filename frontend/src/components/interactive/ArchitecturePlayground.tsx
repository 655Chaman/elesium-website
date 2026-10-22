import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Play, 
    RotateCcw, 
    AlertTriangle, 
    Server, 
    CheckCircle2, 
    Activity, 
    Zap
} from 'lucide-react';

interface NodeSpec {
    id: string;
    title: string;
    type: 'ingestion' | 'security' | 'orchestration' | 'execution' | 'audit';
    latencyMs: number;
    tokens: number;
    status: 'idle' | 'processing' | 'success' | 'failed' | 'fallback';
    description: string;
    payloadPreview: string;
}

const PRESET_WORKFLOWS = {
    bfsi: {
        name: "BFSI Multi-Agent Loan Underwriting",
        compliance: "RBI Digital Lending & DPDP 2023",
        nodes: [
            {
                id: 'n1',
                title: 'VLM Ingestion Node',
                type: 'ingestion' as const,
                latencyMs: 140,
                tokens: 850,
                status: 'idle' as const,
                description: 'Parses 48-page GST + ITR returns via Azure Document Intelligence OCR with zero hallucination.',
                payloadPreview: '{\n  "doc_type": "GST_3B_AUDITED",\n  "pages": 48,\n  "checksum": "sha256:8f41e..."\n}'
            },
            {
                id: 'n2',
                title: 'DPDP PII Sanitizer',
                type: 'security' as const,
                latencyMs: 35,
                tokens: 0,
                status: 'idle' as const,
                description: 'Masks Aadhaar, PAN & promoter personal identifiers prior to semantic router dispatch.',
                payloadPreview: '{\n  "pan_masked": "XXXXX1234F",\n  "pii_leak_risk": 0.000,\n  "encryption": "AES-256-GCM"\n}'
            },
            {
                id: 'n3',
                title: 'LangGraph State Router',
                type: 'orchestration' as const,
                latencyMs: 290,
                tokens: 1420,
                status: 'idle' as const,
                description: 'Deterministic state machine reconciling 1,420 bank statement items with reported GST.',
                payloadPreview: '{\n  "reconciled_items": 1420,\n  "dscr": 1.428,\n  "litigation_hits": 0\n}'
            },
            {
                id: 'n4',
                title: 'Private VPC Sandbox',
                type: 'execution' as const,
                latencyMs: 180,
                tokens: 320,
                status: 'idle' as const,
                description: 'Runs financial stress tests inside air-gapped AWS Mumbai VPC (ap-south-1).',
                payloadPreview: '{\n  "vpc_id": "vpc-091a82f",\n  "risk_rating": "Tier-1 Prime",\n  "max_exposure": "₹4.50 Cr"\n}'
            },
            {
                id: 'n5',
                title: 'Core Banking API Sync',
                type: 'audit' as const,
                latencyMs: 110,
                tokens: 0,
                status: 'idle' as const,
                description: 'Writes immutable audit trail and dispatches prime approval memo to CRO WhatsApp.',
                payloadPreview: '{\n  "status": "APPROVED",\n  "audit_hash": "b2c9d...",\n  "dispatched_to": "CRO_SIGNING"\n}'
            }
        ]
    },
    supply_chain: {
        name: "Autonomous SAP RFC Sync & Stockout Prevention",
        compliance: "ISO-27001 & SOC2 Type II",
        nodes: [
            {
                id: 'n1',
                title: 'ERP Telemetry Feed',
                type: 'ingestion' as const,
                latencyMs: 95,
                tokens: 410,
                status: 'idle' as const,
                description: 'Monitors real-time bin levels across 14 manufacturing depots via SAP S/4HANA.',
                payloadPreview: '{\n  "depot": "PUNE_PLANT_04",\n  "sku": "SIC-MOSFET-1200V",\n  "current_stock": 42\n}'
            },
            {
                id: 'n2',
                title: 'Macro Threat Filter',
                type: 'security' as const,
                latencyMs: 40,
                tokens: 0,
                status: 'idle' as const,
                description: 'Cross-checks global shipping lane transit delays and port congestion indices.',
                payloadPreview: '{\n  "route_risk": "RED SEA SURCHARGE",\n  "lead_time_delta": "+14d"\n}'
            },
            {
                id: 'n3',
                title: 'Algorithmic Sourcing Agent',
                type: 'orchestration' as const,
                latencyMs: 310,
                tokens: 1840,
                status: 'idle' as const,
                description: 'Evaluates 8 pre-vetted Tier-1 suppliers for batch pricing, lead time, and warranty terms.',
                payloadPreview: '{\n  "supplier_selected": "SEMICORE_TECH",\n  "unit_cost": "₹1,420",\n  "sla_days": 4\n}'
            },
            {
                id: 'n4',
                title: 'Automated PO Dispatch',
                type: 'execution' as const,
                latencyMs: 220,
                tokens: 280,
                status: 'idle' as const,
                description: 'Executes programmatic purchase order with cryptographic signature on private VPN.',
                payloadPreview: '{\n  "po_id": "SAP-PO-941029",\n  "total_val": "₹18,46,000",\n  "ledger": "COMMITTED"\n}'
            },
            {
                id: 'n5',
                title: 'Ledger Reconciliation',
                type: 'audit' as const,
                latencyMs: 85,
                tokens: 0,
                status: 'idle' as const,
                description: 'Updates SAP material ledger and notifies CFO mobile dashboard.',
                payloadPreview: '{\n  "reconciled": true,\n  "downtime_avoided_value": "₹42.5L"\n}'
            }
        ]
    }
};

type PresetKey = keyof typeof PRESET_WORKFLOWS;

export interface ArchitecturePlaygroundProps {
    defaultPreset?: PresetKey;
    onTelemetry?: (action: string, metadata?: Record<string, unknown>) => void;
}

export const ArchitecturePlayground: React.FC<ArchitecturePlaygroundProps> = ({ 
    defaultPreset = 'bfsi',
    onTelemetry 
}) => {
    const [selectedWorkflow, setSelectedWorkflow] = useState<PresetKey>(defaultPreset);
    const [nodes, setNodes] = useState<NodeSpec[]>(PRESET_WORKFLOWS[defaultPreset].nodes);
    const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
    const [selectedNodeDetails, setSelectedNodeDetails] = useState<NodeSpec>(PRESET_WORKFLOWS[defaultPreset].nodes[0]);
    const [isRunning, setIsRunning] = useState(false);
    const [chaosMode, setChaosMode] = useState(false);
    const [throughputReqPerSec, setThroughputReqPerSec] = useState(250);
    const [totalLatency, setTotalLatency] = useState(0);

    useEffect(() => {
        setNodes(PRESET_WORKFLOWS[selectedWorkflow].nodes);
        setSelectedNodeDetails(PRESET_WORKFLOWS[selectedWorkflow].nodes[0]);
        setActiveNodeIndex(null);
        setIsRunning(false);
    }, [selectedWorkflow]);

    const handleRunSimulation = () => {
        if (isRunning) return;
        setIsRunning(true);
        setActiveNodeIndex(0);

        onTelemetry?.('playground_simulation_started', {
            workflow: selectedWorkflow,
            chaosMode,
            throughputReqPerSec
        });

        const currentNodes = [...PRESET_WORKFLOWS[selectedWorkflow].nodes];
        let cumulativeLatency = 0;

        const runStep = (index: number) => {
            if (index >= currentNodes.length) {
                setIsRunning(false);
                setActiveNodeIndex(null);
                onTelemetry?.('playground_simulation_completed', {
                    workflow: selectedWorkflow,
                    totalLatencyMs: cumulativeLatency
                });
                return;
            }

            setActiveNodeIndex(index);
            setSelectedNodeDetails(currentNodes[index]);

            // Calculate step latency with chaos factor
            let stepLatency = currentNodes[index].latencyMs;
            if (chaosMode && index === 2) {
                // Introduce simulated API latency spike & fallback
                stepLatency += 450;
            }
            cumulativeLatency += stepLatency;
            setTotalLatency(cumulativeLatency);

            // Update node status
            setNodes(prev => prev.map((n, i) => {
                if (i < index) return { ...n, status: 'success' };
                if (i === index) return { ...n, status: chaosMode && index === 2 ? 'fallback' : 'processing' };
                return { ...n, status: 'idle' };
            }));

            setTimeout(() => {
                setNodes(prev => prev.map((n, i) => {
                    if (i <= index) return { ...n, status: chaosMode && index === 2 ? 'fallback' : 'success' };
                    return { ...n, status: 'idle' };
                }));

                runStep(index + 1);
            }, 600);
        };

        runStep(0);
    };

    const handleReset = () => {
        setIsRunning(false);
        setActiveNodeIndex(null);
        setTotalLatency(0);
        setNodes(PRESET_WORKFLOWS[selectedWorkflow].nodes.map(n => ({ ...n, status: 'idle' })));
        onTelemetry?.('playground_reset', { workflow: selectedWorkflow });
    };

    return (
        <div className="interactive-asset my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-b from-gray-950 via-[#0a0a0c] to-black border border-cyan-500/20 shadow-2xl text-white font-sans overflow-hidden">
            {/* Header with Title and Mode Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                            <Activity className="h-3 w-3 " />
                            Live Architecture Simulator
                        </span>
                        <span className="text-xs text-white/50 font-mono">
                            {PRESET_WORKFLOWS[selectedWorkflow].compliance}
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        {PRESET_WORKFLOWS[selectedWorkflow].name}
                    </h3>
                </div>

                {/* Workflow Switcher */}
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
                    <button
                        onClick={() => setSelectedWorkflow('bfsi')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedWorkflow === 'bfsi'
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        BFSI Underwriting
                    </button>
                    <button
                        onClick={() => setSelectedWorkflow('supply_chain')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            selectedWorkflow === 'supply_chain'
                                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25'
                                : 'text-white/60 hover:text-white'
                        }`}
                    >
                        SAP Supply Chain
                    </button>
                </div>
            </div>

            {/* Pipeline Visual Canvas */}
            <div className="my-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative z-10">
                    {nodes.map((node, idx) => {
                        const isActive = activeNodeIndex === idx;
                        const isSelected = selectedNodeDetails.id === node.id;

                        let statusColor = "border-white/10 bg-white/[0.03]";
                        if (node.status === 'processing' || isActive) {
                            statusColor = "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20";
                        } else if (node.status === 'success') {
                            statusColor = "border-emerald-500/60 bg-emerald-950/20";
                        } else if (node.status === 'fallback') {
                            statusColor = "border-amber-500/60 bg-amber-950/30";
                        }

                        return (
                            <motion.button
                                key={node.id}
                                onClick={() => {
                                    setSelectedNodeDetails(node);
                                    onTelemetry?.('playground_node_inspected', { nodeId: node.id, title: node.title });
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`text-left p-4 rounded-xl border transition-all duration-300 relative flex flex-col justify-between min-h-[140px] ${statusColor} ${
                                    isSelected ? 'ring-2 ring-cyan-400/80' : ''
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-2">
                                        <span>0{idx + 1}. STAGE</span>
                                        {node.status === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                                        {node.status === 'processing' && <Zap className="h-3.5 w-3.5 text-cyan-400 animate-spin" />}
                                        {node.status === 'fallback' && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                                    </div>
                                    <div className="text-sm font-bold text-white mb-1 leading-snug">
                                        {node.title}
                                    </div>
                                    <div className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                                        {node.description}
                                    </div>
                                </div>

                                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                                    <span>{node.latencyMs}ms</span>
                                    <span>{node.tokens > 0 ? `${node.tokens} tok` : '0 PII'}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Interactive Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white/[0.02] border border-white/10 rounded-xl p-5">
                {/* Simulation Triggers */}
                <div className="space-y-4">
                    <div className="text-xs font-mono text-white/50 uppercase tracking-wider">
                        Telemetry & Execution Triggers
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleRunSimulation}
                            disabled={isRunning}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all ${
                                isRunning
                                    ? 'bg-cyan-500/30 text-white/50 cursor-not-allowed'
                                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 active:scale-95'
                            }`}
                        >
                            <Play className={`h-4 w-4 ${isRunning ? '' : 'fill-current'}`} />
                            {isRunning ? 'Executing Pipeline...' : 'Run Live Transaction'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all border border-white/10"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </button>
                    </div>

                    {/* Chaos Toggle */}
                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={chaosMode}
                                onChange={(e) => {
                                    setChaosMode(e.target.checked);
                                    onTelemetry?.('playground_chaos_toggled', { enabled: e.target.checked });
                                }}
                                className="rounded bg-black border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                            />
                            <span className="flex items-center gap-1.5">
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                                Inject API Latency & Chaos Fallback
                            </span>
                        </label>
                    </div>

                    {/* Throughput Slider */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-1.5">
                            <span>Target Concurrency:</span>
                            <span className="text-cyan-400 font-bold">{throughputReqPerSec} req/sec</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="2000"
                            step="20"
                            value={throughputReqPerSec}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setThroughputReqPerSec(val);
                                onTelemetry?.('playground_concurrency_adjusted', { reqPerSec: val });
                            }}
                            className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-white/40 mt-1">
                            <span>20 rps (Pilot)</span>
                            <span>2,000 rps (Enterprise High-Load)</span>
                        </div>
                    </div>
                </div>

                {/* Node Inspector Payload */}
                <div className="lg:col-span-2 bg-black/60 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                            <div className="flex items-center gap-2">
                                <Server className="h-4 w-4 text-cyan-400" />
                                <span className="text-xs font-bold font-mono text-white">
                                    Stage Inspector: {selectedNodeDetails.title}
                                </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                                DPDP Compliant (Private Subnet)
                            </span>
                        </div>

                        <p className="text-xs text-white/70 mb-3 leading-relaxed">
                            {selectedNodeDetails.description}
                        </p>

                        <div className="bg-gray-950 rounded-lg p-3 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-[110px]">
                            <pre>{selectedNodeDetails.payloadPreview}</pre>
                        </div>
                    </div>

                    {/* Live Telemetry Summary */}
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-white/60">
                        <div className="flex items-center gap-4">
                            <span>Pipeline Latency: <strong className="text-emerald-400">{totalLatency > 0 ? `${totalLatency}ms` : '665ms nominal'}</strong></span>
                            <span>SLA Target: <strong className="text-white">&lt; 1,800ms</strong></span>
                        </div>
                        <span className="text-[10px] text-white/40">Zero Model Training on Customer Data</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
