import React, { useState } from 'react';
import { 
    Copy, 
    Check, 
    ShieldCheck, 
    Download, 
    Maximize2, 
    Minimize2, 
    Code2 
} from 'lucide-react';

export interface CodeTab {
    label: string;
    language: string;
    content: string;
}

export interface InteractiveCodeBlockProps {
    title?: string;
    tabs: CodeTab[];
    complianceBadge?: string;
    onTelemetry?: (action: string, metadata?: Record<string, unknown>) => void;
}

export const InteractiveCodeBlock: React.FC<InteractiveCodeBlockProps> = ({
    title = "Production Architecture Payload",
    tabs,
    complianceBadge = "DPDP Act 2023 & RBI Compliant",
    onTelemetry
}) => {
    const [activeTabIdx, setActiveTabIdx] = useState(0);
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinified, setIsMinified] = useState(false);

    const activeTab = tabs[activeTabIdx] || tabs[0];

    const getProcessedCode = () => {
        if (!isMinified) return activeTab.content;
        try {
            return JSON.stringify(JSON.parse(activeTab.content));
        } catch {
            return activeTab.content.replace(/\s+/g, ' ');
        }
    };

    const handleCopy = () => {
        const textToCopy = getProcessedCode();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        onTelemetry?.('code_copied', {
            tabLabel: activeTab.label,
            language: activeTab.language,
            length: textToCopy.length
        });

        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const textToDownload = getProcessedCode();
        const extension = activeTab.language.toLowerCase() === 'python' ? 'py' 
            : activeTab.language.toLowerCase() === 'typescript' ? 'ts' 
            : 'json';

        const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `elesium_${activeTab.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onTelemetry?.('code_downloaded', { tabLabel: activeTab.label });
    };

    return (
        <div className={`interactive-asset my-8 rounded-2xl border border-white/10 bg-[#08090C] text-gray-200 overflow-hidden shadow-2xl transition-all duration-300 ${
            isExpanded ? 'fixed inset-4 z-50 max-w-6xl mx-auto flex flex-col' : 'relative'
        }`}>
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#0D0F14] border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>

                    <div className="h-4 w-[1px] bg-white/10" />

                    <span className="text-xs font-mono font-medium text-white/80 flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                        {title}
                    </span>
                </div>

                {/* Right badges & controls */}
                <div className="flex items-center gap-2">
                    {complianceBadge && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            <ShieldCheck className="h-3 w-3" />
                            {complianceBadge}
                        </span>
                    )}

                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                    >
                        {copied ? (
                            <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-3.5 w-3.5 text-white/70" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleDownload}
                        title="Download raw file"
                        className="p-1 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </button>

                    <button
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                            onTelemetry?.('code_expand_toggled', { expanded: !isExpanded });
                        }}
                        title={isExpanded ? "Collapse" : "Full Screen"}
                        className="p-1 rounded-lg text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Sub-tabs header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#090A0E] border-b border-white/5 text-xs font-mono">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {tabs.map((tab, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setActiveTabIdx(idx);
                                onTelemetry?.('code_tab_switched', { tabLabel: tab.label });
                            }}
                            className={`px-3 py-1 rounded-md transition-colors ${
                                activeTabIdx === idx
                                    ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30'
                                    : 'text-white/50 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab.language.toLowerCase() === 'json' && (
                    <button
                        onClick={() => setIsMinified(!isMinified)}
                        className="text-[11px] text-white/50 hover:text-white transition-colors"
                    >
                        {isMinified ? 'Format JSON' : 'Minify'}
                    </button>
                )}
            </div>

            {/* Code Body */}
            <div className={`p-4 font-mono text-xs overflow-x-auto bg-[#050608] ${
                isExpanded ? 'flex-1 overflow-y-auto' : 'max-h-[380px] overflow-y-auto'
            }`}>
                <pre className="text-gray-300 leading-relaxed">
                    <code>{getProcessedCode()}</code>
                </pre>
            </div>
        </div>
    );
};
