import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, Terminal } from 'lucide-react';

export interface CalendarBookingEmbedProps {
  isOpen: boolean;
  onClose: () => void;
  calLink?: string; // e.g. "chaman-shah-elesium/sovereign-ai-audit"
  prefill?: {
    name?: string;
    email?: string;
    company?: string;
    notes?: string;
  };
  context?: {
    solutionSlug?: string;
    simulatedRoi?: string;
    toolSource?: string;
    complianceFrameworks?: string[];
  };
}

export function CalendarBookingEmbed({
  isOpen,
  onClose,
  calLink = 'chaman-shah-elesium/sovereign-ai-audit',
  prefill = {},
  context = {}
}: CalendarBookingEmbedProps) {
  // Compute embed URL with URL parameters
  const params = new URLSearchParams();
  if (prefill.name) params.set('name', prefill.name);
  if (prefill.email) params.set('email', prefill.email);
  if (prefill.company) params.set('company', prefill.company);
  
  // Format technical discovery notes for Cal.com custom questions
  const scopeNotes = [
    context.solutionSlug ? `Solution Scope: ${context.solutionSlug}` : '',
    context.simulatedRoi ? `Simulated ROI: ₹${context.simulatedRoi} Lakhs/yr` : '',
    context.toolSource ? `Originating Tool: ${context.toolSource}` : '',
    context.complianceFrameworks && context.complianceFrameworks.length > 0
      ? `Compliance: ${context.complianceFrameworks.join(', ')}`
      : '',
    prefill.notes ? `User Details: ${prefill.notes}` : ''
  ].filter(Boolean).join(' | ');

  if (scopeNotes) {
    params.set('notes', scopeNotes);
  }

  // Use Cal.com hosted embed URL or custom domain
  const embedUrl = `https://cal.com/${calLink}?embed=true&theme=dark&${params.toString()}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-5xl h-[92vh] bg-[#090909] border border-white/10 rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden text-white font-sans"
          >
            {/* Top Navigation & Status Bar */}
            <div className="px-6 py-4 border-b border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                      Principal Systems Architecture Discovery
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
                      Chaman Shah
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    90-Minute Technical Scope · Mutual NDA Governed · LangGraph DAG Delivery
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-xs font-mono"
              >
                ✕ Close [ESC]
              </button>
            </div>

            {/* Context Notification Ribbon */}
            {(context.solutionSlug || context.simulatedRoi) && (
              <div className="px-6 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-xs font-mono flex items-center justify-between">
                <span className="text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 " />
                  Context Ingested: {context.solutionSlug || context.toolSource}
                </span>
                {context.simulatedRoi && (
                  <span className="text-gray-300">
                    Projected Savings Target: <strong className="text-white">₹{context.simulatedRoi} Lakhs/yr</strong>
                  </span>
                )}
              </div>
            )}

            {/* Embed Frame */}
            <div className="flex-1 w-full bg-[#070707] relative overflow-hidden">
              <iframe
                src={embedUrl}
                title="Direct Scoping Calendar - Elesium"
                className="w-full h-full border-0"
                allow="camera; microphone; autoplay; fullscreen"
              />
            </div>

            {/* Footer Trust Bar */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/80 flex flex-wrap items-center justify-between text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Mutual NDA Pre-Executed
                </span>
                <span className="hidden sm:inline text-gray-600">|</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" /> Instant Calendar Confirmation
                </span>
              </div>
              <div className="text-[11px] text-gray-500">
                Sovereign Data Perimeter Guaranteed · DPDP Act 2023 Conforming
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
