import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, ShieldCheck, Terminal, ArrowRight, MessageSquare } from 'lucide-react';

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Configurable WhatsApp Business number (defaults to Elesium intake)
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919886000000';

export const WhatsAppModal = ({ isOpen, onClose }: WhatsAppModalProps) => {
    const [companyName, setCompanyName] = useState('');
    const [workflowType, setWorkflowType] = useState('Enterprise Process Automation');

    const handleInitiateWhatsApp = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        let message = `Hello Elesium Engineering Team,\n\nI am requesting a Private AI Architecture Audit for our enterprise.`;
        if (companyName.trim()) {
            message += `\n\nCompany: ${companyName.trim()}`;
        }
        if (workflowType) {
            message += `\nPrimary Focus: ${workflowType}`;
        }
        message += `\n\nLooking to evaluate deterministic agentic workflows and ROI feasibility.`;

        const encodedMessage = encodeURIComponent(message);
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 15 }}
                        className="relative w-full max-w-lg bg-[#0D0D0D] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl z-10 text-white font-sans overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white tracking-tight">Direct Engineering Intake</h3>
                                    <p className="text-xs text-gray-400">Bangalore Enterprise AI Architecture Desk</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Zero-Sales Gate · Direct Founder & Engineering SLA</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                We do not use calendar booking links. Engagements are strictly vetted to maintain high delivery fidelity. Direct WhatsApp communication routes you straight to our core systems architects.
                            </p>
                        </div>

                        <form onSubmit={handleInitiateWhatsApp} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                                    Company / Enterprise Name
                                </label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Acme Corp / HDFC Credila"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                                    Automation Objective
                                </label>
                                <select 
                                    value={workflowType}
                                    onChange={(e) => setWorkflowType(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                                >
                                    <option value="Enterprise Process Automation">Enterprise Process Automation (ERP/SAP)</option>
                                    <option value="Private VPC Multi-Agent Deployment">Private VPC Multi-Agent Deployment</option>
                                    <option value="BFSI / Underwriting Document Reasoning">BFSI / Underwriting Document Reasoning</option>
                                    <option value="Custom LangGraph / Local LLM Systems">Custom LangGraph / Local LLM Systems</option>
                                    <option value="Legacy Stack Modernization">Legacy Stack Modernization</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01]"
                            >
                                <MessageSquare className="w-4 h-4 fill-black" />
                                <span>Connect via WhatsApp Desk</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleInitiateWhatsApp()}
                                className="w-full text-center text-xs text-gray-400 hover:text-gray-200 transition-colors py-1"
                            >
                                Or skip details and launch direct chat
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
