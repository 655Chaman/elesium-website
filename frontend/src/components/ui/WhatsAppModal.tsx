import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Terminal, ArrowRight, MessageSquare, Calendar } from 'lucide-react';
import logo from '../../assets/LOGO_NEW.png';

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Real Elesium WhatsApp Engineering Desk
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918317329312';

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
                        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 16 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-200"
                    >
                        {/* Faint static logo watermark matching hero */}
                        <div className="absolute -right-8 -top-8 pointer-events-none select-none opacity-[0.04] dark:opacity-[0.07] overflow-hidden">
                            <img
                                src={logo}
                                alt="Elesium Watermark"
                                width="220"
                                height="220"
                                className="w-48 h-48 sm:w-56 sm:h-56 object-contain select-none pointer-events-none"
                            />
                        </div>

                        {/* Subtle ambient emerald glow */}
                        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Brand pill matching hero section */}
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                                #1 Enterprise AI In India • Direct Engineering Desk
                            </span>
                        </div>

                        {/* Modal Header */}
                        <div className="flex justify-between items-start mb-5 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        Direct Engineering Intake
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Bengaluru Sovereign AI Systems Architecture Desk
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                aria-label="Close modal"
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Security / Quality SLA Card */}
                        <div className="mb-5 p-4 rounded-2xl bg-gray-50/90 dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/10 relative z-10">
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>Zero-Sales Gate · Direct Founder &amp; Principal Architect SLA</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Engagements are vetted directly by systems engineers to maintain high delivery fidelity. Direct WhatsApp communication routes you straight to our core architecture team.
                            </p>
                        </div>

                        {/* Intake Form */}
                        <form onSubmit={handleInitiateWhatsApp} className="space-y-4 relative z-10">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                    Company / Enterprise Name
                                </label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Acme Corp / HDFC Credila / Titan"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
                                    Automation Objective
                                </label>
                                <select 
                                    value={workflowType}
                                    onChange={(e) => setWorkflowType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#111] text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all text-sm cursor-pointer"
                                >
                                    <option value="Enterprise Process Automation">Enterprise Process Automation (ERP / SAP S/4HANA)</option>
                                    <option value="Private VPC Multi-Agent Deployment">Private Air-Gapped VPC Multi-Agent Deployment</option>
                                    <option value="BFSI / Underwriting Document Reasoning">BFSI / Underwriting Document Reasoning &amp; KYC</option>
                                    <option value="Custom LangGraph / Local LLM Systems">Custom LangGraph / Local LLM Inference Engines</option>
                                    <option value="Legacy Stack Modernization">Legacy Stack Modernization &amp; API Integration</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Connect via WhatsApp Desk</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
                                <button
                                    type="button"
                                    onClick={() => handleInitiateWhatsApp()}
                                    className="hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-2 hover:underline"
                                >
                                    Or launch direct chat without details
                                </button>
                                <Link
                                    to="/waitlist"
                                    onClick={onClose}
                                    className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors text-emerald-600 dark:text-emerald-400 font-medium"
                                >
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Schedule calendar review &rarr;</span>
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
