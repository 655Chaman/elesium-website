import React, { useState } from 'react';
import { 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    Maximize2, 
    Minimize2, 
    Copy, 
    Check, 
    Download, 
    GitBranch
} from 'lucide-react';

export interface MermaidNodeData {
    id: string;
    label: string;
    zone: string;
    latency: string;
    details: string;
}

export interface InteractiveMermaidProps {
    title?: string;
    diagramDsl?: string;
    nodes?: MermaidNodeData[];
    onTelemetry?: (action: string, metadata?: Record<string, unknown>) => void;
}

const DEFAULT_NODES: MermaidNodeData[] = [
    { id: '1', label: 'Inbound Multi-Modal VLM', zone: 'Public Edge (Cloudflare WAF)', latency: '120ms', details: 'Ingests unstructured financial PDFs, applies OCR normalizations, and checks cryptographic hash.' },
    { id: '2', label: 'Deterministic PII Gate', zone: 'Private AWS Mumbai Subnet', latency: '25ms', details: 'Masks PAN, Aadhaar, and credit hashes under DPDP Act 2023 regulations before semantic inference.' },
    { id: '3', label: 'LangGraph Dual-Loop Router', zone: 'Private VPC Isolated Node', latency: '310ms', details: 'Executes state machine with checkpointer memory; resolves debt service coverage ratios to 4 decimals.' },
    { id: '4', label: 'SAP / CBS Verification Bus', zone: 'Direct Connect Enterprise Tunnel', latency: '190ms', details: 'Synchronizes reconciled credit memo with SAP S/4HANA or Finacle core banking ledgers.' },
    { id: '5', label: 'Autonomous Sign-Off & Alert', zone: 'Encrypted Webhook (mTLS)', latency: '80ms', details: 'Dispatches signed memo to Chief Risk Officer dashboard and alerts executive team on WhatsApp.' }
];

export const InteractiveMermaid: React.FC<InteractiveMermaidProps> = ({
    title = "Multi-Agent Deterministic Architecture Diagram",
    diagramDsl = `graph LR
    A[VLM Ingestion Node] --> B[DPDP PII Sanitizer]
    B --> C[LangGraph State Router]
    C --> D[Private AWS Mumbai VPC]
    D --> E[Core Banking Ledger Commit]`,
    nodes = DEFAULT_NODES,
    onTelemetry
}) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [selectedNode, setSelectedNode] = useState<MermaidNodeData | null>(nodes[0]);

    const handleZoom = (delta: number) => {
        setZoomLevel(prev => {
            const next = Math.min(1.8, Math.max(0.7, Number((prev + delta).toFixed(2))));
            onTelemetry?.('mermaid_zoom_adjusted', { zoom: next });
            return next;
        });
    };

    const handleReset = () => {
        setZoomLevel(1);
        onTelemetry?.('mermaid_zoom_reset');
    };

    const handleCopyDsl = () => {
        navigator.clipboard.writeText(diagramDsl);
        setCopied(true);
        onTelemetry?.('mermaid_dsl_copied');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadSvg = () => {
        // Generate SVG download
        const svgElement = document.getElementById('interactive-mermaid-svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Elesium_Architecture_Diagram.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onTelemetry?.('mermaid_svg_downloaded');
    };

    return (
        <div className={`interactive-asset my-10 rounded-2xl border border-white/10 bg-[#080A0F] text-white overflow-hidden shadow-2xl transition-all duration-300 ${
            isExpanded ? 'fixed inset-4 z-50 max-w-6xl mx-auto flex flex-col' : 'relative'
        }`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0C0F17] border-b border-white/5">
                <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold text-white/90">
                        {title}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Interactive SVG
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => handleZoom(0.15)}
                        title="Zoom In"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                    >
                        <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={() => handleZoom(-0.15)}
                        title="Zoom Out"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                    >
                        <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={handleReset}
                        title="Reset Zoom"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>

                    <div className="h-4 w-[1px] bg-white/10 mx-1" />

                    <button
                        onClick={handleCopyDsl}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>Mermaid DSL</span>
                    </button>

                    <button
                        onClick={handleDownloadSvg}
                        title="Download SVG"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                            onTelemetry?.('mermaid_expand_toggled', { expanded: !isExpanded });
                        }}
                        title={isExpanded ? "Collapse" : "Full Screen"}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
                    >
                        {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Diagram Viewport */}
            <div className={`relative p-6 overflow-auto flex items-center justify-center bg-radial from-[#0e1422] to-[#06080d] ${
                isExpanded ? 'flex-1' : 'min-h-[300px]'
            }`}>
                <div 
                    style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
                    className="w-full max-w-4xl py-6"
                >
                    <svg
                        id="interactive-mermaid-svg"
                        viewBox="0 0 950 220"
                        className="w-full h-auto drop-shadow-2xl"
                    >
                        <defs>
                            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                            </linearGradient>
                            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                            </marker>
                        </defs>

                        {/* Connection Flow Lines */}
                        <line x1="160" y1="110" x2="220" y2="110" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                        <line x1="360" y1="110" x2="420" y2="110" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                        <line x1="560" y1="110" x2="620" y2="110" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                        <line x1="760" y1="110" x2="820" y2="110" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="4 4" markerEnd="url(#arrow)" />

                        {/* Node 1: Ingestion */}
                        <g onClick={() => setSelectedNode(nodes[0])} className="cursor-pointer">
                            <rect x="20" y="60" width="140" height="100" rx="12" fill="url(#cyanGrad)" stroke="#06b6d4" strokeWidth="1.5" />
                            <text x="90" y="95" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">STAGE 01</text>
                            <text x="90" y="115" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">VLM Parser</text>
                            <text x="90" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle">Azure Doc AI</text>
                        </g>

                        {/* Node 2: PII Sanitizer */}
                        <g onClick={() => setSelectedNode(nodes[1])} className="cursor-pointer">
                            <rect x="220" y="60" width="140" height="100" rx="12" fill="url(#cyanGrad)" stroke="#10b981" strokeWidth="1.5" />
                            <text x="290" y="95" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">STAGE 02</text>
                            <text x="290" y="115" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">DPDP Gate</text>
                            <text x="290" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle">Zero PII Leakage</text>
                        </g>

                        {/* Node 3: LangGraph Router */}
                        <g onClick={() => setSelectedNode(nodes[2])} className="cursor-pointer">
                            <rect x="420" y="60" width="140" height="100" rx="12" fill="url(#cyanGrad)" stroke="#6366f1" strokeWidth="1.5" />
                            <text x="490" y="95" fill="#818cf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">STAGE 03</text>
                            <text x="490" y="115" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">LangGraph State</text>
                            <text x="490" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle">Reconciliation</text>
                        </g>

                        {/* Node 4: Private VPC */}
                        <g onClick={() => setSelectedNode(nodes[3])} className="cursor-pointer">
                            <rect x="620" y="60" width="140" height="100" rx="12" fill="url(#cyanGrad)" stroke="#f59e0b" strokeWidth="1.5" />
                            <text x="690" y="95" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">STAGE 04</text>
                            <text x="690" y="115" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">AWS Mumbai</text>
                            <text x="690" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle">Air-Gapped VPC</text>
                        </g>

                        {/* Node 5: ERP Commit */}
                        <g onClick={() => setSelectedNode(nodes[4])} className="cursor-pointer">
                            <rect x="820" y="60" width="110" height="100" rx="12" fill="url(#cyanGrad)" stroke="#ec4899" strokeWidth="1.5" />
                            <text x="875" y="95" fill="#f472b6" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">STAGE 05</text>
                            <text x="875" y="115" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">SAP Commit</text>
                            <text x="875" y="135" fill="#94a3b8" fontSize="9" textAnchor="middle">mTLS Ledger</text>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Selected Node Details Drawer */}
            {selectedNode && (
                <div className="p-4 bg-[#0a0d14] border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono font-bold text-cyan-400">
                                Inspecting Node: {selectedNode.label}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                                Zone: {selectedNode.zone}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                {selectedNode.latency}
                            </span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed max-w-3xl">
                            {selectedNode.details}
                        </p>
                    </div>

                    <span className="text-[10px] font-mono text-white/40 self-end md:self-auto">
                        Click any stage node in the SVG to view execution specs
                    </span>
                </div>
            )}
        </div>
    );
};
