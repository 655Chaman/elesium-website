import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShieldCheck, Terminal, ArrowRight, MessageSquare, ArrowUpRight } from 'lucide-react';
import logo from '../../assets/LOGO_NEW.png';

interface WhatsAppModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Real Elesium WhatsApp Engineering Desk
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '918317329312';

const MODAL_SPRING = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
};

export const WhatsAppModal = ({ isOpen, onClose }: WhatsAppModalProps) => {
    const [companyName, setCompanyName] = useState('');
    const [workflowType, setWorkflowType] = useState('Enterprise Process Automation');
    const [companyError, setCompanyError] = useState(false);
    const [shakeAttempt, setShakeAttempt] = useState(0);
    const companyInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen || typeof document === 'undefined') return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const openWhatsAppWindow = (includeCompany: boolean) => {
        let message = `Hello Elesium Engineering Team,\n\nI am requesting a Private AI Architecture Audit for our enterprise.`;
        if (includeCompany && companyName.trim()) {
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

    const handleInitiateWhatsApp = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!companyName.trim()) {
            setCompanyError(true);
            setShakeAttempt((prev) => prev + 1);
            companyInputRef.current?.focus();
            return;
        }

        setCompanyError(false);
        openWhatsAppWindow(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        aria-hidden="true"
                        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wa-modal-title"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={MODAL_SPRING}
                        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-black dark:text-white font-sans transition-colors duration-200"
                    >
                        {/* Faint static logo watermark */}
                        <div className="absolute -right-8 -top-8 pointer-events-none select-none opacity-[0.04] dark:opacity-[0.07] overflow-hidden">
                            <img
                                src={logo}
                                alt="Elesium Watermark"
                                width="220"
                                height="220"
                                loading="lazy"
                                className="w-48 h-48 sm:w-56 sm:h-56 object-contain select-none pointer-events-none grayscale"
                            />
                        </div>

                        {/* Monochrome engineering desk pill */}
                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400">
                                Direct Engineering Desk
                            </span>
                        </div>

                        {/* Modal Header */}
                        <div className="flex justify-between items-start gap-3 mb-5 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-black dark:text-white shrink-0">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 id="wa-modal-title" className="text-xl font-semibold tracking-tight text-black dark:text-white">
                                        Direct Engineering Intake
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Elesium Systems Architecture Desk &middot; Shivamogga, Karnataka
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close modal"
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Security / Quality SLA Card */}
                        <div className="mb-5 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 relative z-10">
                            <div className="flex items-center gap-2 text-xs font-semibold text-black dark:text-white mb-1">
                                <ShieldCheck className="w-4 h-4 shrink-0" />
                                <span>Zero-Sales Gate · Direct Founder &amp; Principal Architect SLA</span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Engagements are vetted directly by systems engineers to maintain high delivery fidelity. Direct WhatsApp communication routes you straight to our core architecture team.
                            </p>
                        </div>

                        {/* Intake Form */}
                        <form onSubmit={handleInitiateWhatsApp} noValidate className="space-y-4 relative z-10">
                            <div>
                                <label
                                    htmlFor="wa-company-name"
                                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider"
                                >
                                    Company / Enterprise Name
                                </label>
                                <div key={shakeAttempt} className={companyError ? 'animate-shake' : undefined}>
                                    <input
                                        id="wa-company-name"
                                        ref={companyInputRef}
                                        type="text"
                                        required
                                        aria-invalid={companyError}
                                        placeholder="e.g. Acme Corp / HDFC Credila / Titan"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            if (companyError && e.target.value.trim()) {
                                                setCompanyError(false);
                                            }
                                        }}
                                        className={`w-full px-4 py-3 rounded-xl border bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-colors text-base sm:text-sm ${
                                            companyError
                                                ? 'border-black dark:border-white ring-1 ring-black dark:ring-white'
                                                : 'border-neutral-200 dark:border-neutral-800'
                                        }`}
                                    />
                                </div>
                                {companyError && (
                                    <p className="mt-1.5 text-xs font-medium text-black dark:text-white">
                                        Please enter your company or enterprise name before initiating.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="wa-workflow-type"
                                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 uppercase tracking-wider"
                                >
                                    Automation Objective
                                </label>
                                <select
                                    id="wa-workflow-type"
                                    value={workflowType}
                                    onChange={(e) => setWorkflowType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-colors text-base sm:text-sm cursor-pointer"
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
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-3.5 rounded-full text-sm transition-colors shadow-md group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Connect via WhatsApp Desk</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>

                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-neutral-100 dark:border-neutral-900 text-xs text-neutral-500 dark:text-neutral-400">
                                <button
                                    type="button"
                                    onClick={() => openWhatsAppWindow(false)}
                                    className="py-1.5 hover:text-black dark:hover:text-white transition-colors underline-offset-2 hover:underline"
                                >
                                    Or launch direct chat without details
                                </button>
                                <Link
                                    to="/waitlist/"
                                    onClick={onClose}
                                    className="py-1.5 inline-flex items-center gap-1 text-black dark:text-white hover:opacity-75 transition-opacity font-medium"
                                >
                                    <span>Join ele-in SaaS waitlist</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
