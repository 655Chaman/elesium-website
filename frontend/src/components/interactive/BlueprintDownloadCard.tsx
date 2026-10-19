import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Download, 
    ShieldCheck, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    Layers
} from 'lucide-react';

export interface BlueprintSpec {
    id: string;
    version: string;
    title: string;
    description: string;
    compliance: string;
    sla: string;
    stack: string[];
    specsSummary: {
        runtime: string;
        vpcSubnet: string;
        failoverRecovery: string;
        auditTrail: string;
    };
}

export interface BlueprintDownloadCardProps {
    blueprint?: BlueprintSpec;
    onTelemetry?: (action: string, metadata?: Record<string, unknown>) => void;
}

const DEFAULT_BLUEPRINT: BlueprintSpec = {
    id: "ELE-ARCH-2026-BFSI",
    version: "v2.4.1 Production LTS",
    title: "Multi-Agent Autonomous Underwriting & ERP Synchronization Blueprint",
    description: "Production architectural specification for deterministic loan underwriting, GST/ITR reconciliation, and zero-retention private VPC deployment.",
    compliance: "DPDP Act 2023, RBI Digital Lending, SOC2 Type II",
    sla: "Sub-1,900ms P99 Latency / 99.95% Availability",
    stack: ["LangGraph 0.2", "Azure Doc AI", "AWS Mumbai (ap-south-1)", "SAP RFC Connector", "FastAPI"],
    specsSummary: {
        runtime: "Python 3.12 / Private Docker Container with zero public ingress",
        vpcSubnet: "Private Isolated Subnet (10.0.4.0/24) via AWS Direct Connect",
        failoverRecovery: "Automatic circuit-breaker failover with Redis State Checkpointer",
        auditTrail: "SHA-256 cryptographically chained immutable ledger"
    }
};

export const BlueprintDownloadCard: React.FC<BlueprintDownloadCardProps> = ({
    blueprint = DEFAULT_BLUEPRINT,
    onTelemetry
}) => {
    const [isSpecsOpen, setIsSpecsOpen] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = () => {
        // Generate SVG blueprint file dynamically
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#050811"/>
  <text x="60" y="80" fill="#38bdf8" font-family="monospace" font-size="20" font-weight="bold">ELESIUM ONLINE — ENTERPRISE ARCHITECTURE BLUEPRINT</text>
  <text x="60" y="120" fill="#94a3b8" font-family="sans-serif" font-size="16">Blueprint ID: ${blueprint.id} | ${blueprint.version}</text>
  <text x="60" y="150" fill="#64748b" font-family="sans-serif" font-size="14">Compliance: ${blueprint.compliance}</text>
  
  <rect x="60" y="200" width="300" height="160" rx="12" fill="#0c1322" stroke="#0284c7" stroke-width="2"/>
  <text x="90" y="240" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">STAGE 1: INGESTION</text>
  <text x="90" y="270" fill="#ffffff" font-family="sans-serif" font-size="13">Azure Document Intelligence</text>
  <text x="90" y="300" fill="#94a3b8" font-family="sans-serif" font-size="11">OCR / Scanned PDF Vectorization</text>
  
  <rect x="440" y="200" width="300" height="160" rx="12" fill="#0c1322" stroke="#10b981" stroke-width="2"/>
  <text x="470" y="240" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold">STAGE 2: DPDP PII GATE</text>
  <text x="470" y="270" fill="#ffffff" font-family="sans-serif" font-size="13">Zero-Retention Masking</text>
  <text x="470" y="300" fill="#94a3b8" font-family="sans-serif" font-size="11">Deterministic PAN / Aadhaar Strip</text>
  
  <rect x="820" y="200" width="320" height="160" rx="12" fill="#0c1322" stroke="#6366f1" stroke-width="2"/>
  <text x="850" y="240" fill="#818cf8" font-family="monospace" font-size="14" font-weight="bold">STAGE 3: LANGGRAPH VPC</text>
  <text x="850" y="270" fill="#ffffff" font-family="sans-serif" font-size="13">Multi-Agent State Router</text>
  <text x="850" y="300" fill="#94a3b8" font-family="sans-serif" font-size="11">Debt Service Ratio Calculation</text>
  
  <line x1="360" y1="280" x2="440" y2="280" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,6"/>
  <line x1="740" y1="280" x2="820" y2="280" stroke="#10b981" stroke-width="3" stroke-dasharray="6,6"/>
  
  <text x="60" y="740" fill="#475569" font-family="monospace" font-size="12">Confidential &amp; Proprietary — Elesium Online Institutional Engineering</text>
</svg>`;

        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${blueprint.id}_Architecture_Blueprint.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloaded(true);
        onTelemetry?.('blueprint_downloaded', { blueprintId: blueprint.id });
        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <div className="interactive-asset my-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-950 via-[#0a0f1d] to-[#04060c] border border-cyan-500/30 shadow-2xl text-white font-sans">
            {/* Header / ID Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        {blueprint.id}
                    </span>
                    <span className="text-xs font-mono text-white/50">
                        {blueprint.version}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="h-3 w-3" />
                        {blueprint.compliance}
                    </span>
                </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mb-2 leading-snug">
                {blueprint.title}
            </h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed mb-6">
                {blueprint.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
                {blueprint.stack.map((item, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 text-white/80 border border-white/10">
                        {item}
                    </span>
                ))}
            </div>

            {/* SLA Callout */}
            <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-6 text-xs font-mono text-white/60">
                <span>Production SLA: <strong className="text-emerald-400">{blueprint.sla}</strong></span>
                <span className="text-[10px] text-white/40">Air-Gapped VPC Architecture</span>
            </div>

            {/* Actions: Download + Collapsible Specs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                >
                    {downloaded ? (
                        <>
                            <CheckCircle2 className="h-4 w-4 text-black" />
                            Blueprint Downloaded (.SVG)
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4" />
                            Download Production Architecture Blueprint (.SVG)
                        </>
                    )}
                </button>

                <button
                    onClick={() => {
                        setIsSpecsOpen(!isSpecsOpen);
                        onTelemetry?.('blueprint_specs_toggled', { open: !isSpecsOpen });
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-colors"
                >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Technical Deployment Specs</span>
                    {isSpecsOpen ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
                </button>
            </div>

            {/* Collapsible Specs Drawer */}
            <AnimatePresence>
                {isSpecsOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-5 border-t border-white/10 text-xs font-mono space-y-3"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="text-[10px] text-white/40 mb-1">Runtime Specification</div>
                                <div className="text-white/80">{blueprint.specsSummary.runtime}</div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="text-[10px] text-white/40 mb-1">Network &amp; Subnet Isolation</div>
                                <div className="text-white/80">{blueprint.specsSummary.vpcSubnet}</div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="text-[10px] text-white/40 mb-1">Circuit-Breaker Recovery</div>
                                <div className="text-white/80">{blueprint.specsSummary.failoverRecovery}</div>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="text-[10px] text-white/40 mb-1">Immutable Audit Cryptography</div>
                                <div className="text-white/80">{blueprint.specsSummary.auditTrail}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
