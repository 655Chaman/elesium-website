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
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-5xl h-[92vh] bg-neutral-950 border border-white/10 rounded-xl shadow-2xl z-10 flex flex-col overflow-hidden text-white font-sans"
          >
            {/* Top Navigation & Status Bar */}
            <div className="px-6 py-4 border-b border-white/10 bg-black flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                      Principal Systems Architecture Discovery
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-neutral-300 text-[10px] font-mono border border-white/10">
                      Chaman Shah
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    90-Minute Technical Scope &middot; Mutual NDA Governed &middot; LangGraph DAG Delivery
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white active:scale-[0.97] transition-all text-xs font-mono"
              >
                &times; Close [ESC]
              </button>
            </div>

            {/* Context Notification Ribbon */}
            {(context.solutionSlug || context.simulatedRoi) && (
              <div className="px-6 py-2 bg-white/5 border-b border-white/10 text-xs font-mono flex items-center justify-between">
                <span className="text-neutral-200 flex items-center gap-2">
                  Context Ingested: {context.solutionSlug || context.toolSource}
                </span>
                {context.simulatedRoi && (
                  <span className="text-neutral-300">
                    Projected Savings Target: <strong className="text-white">₹{context.simulatedRoi} Lakhs/yr</strong>
                  </span>
                )}
              </div>
            )}

            {/* Embed Frame */}
            <div className="flex-1 w-full bg-black relative overflow-hidden">
              <iframe
                src={embedUrl}
                title="Direct Scoping Calendar - Elesium"
                className="w-full h-full border-0"
                allow="camera; microphone; autoplay; fullscreen"
              />
            </div>

            {/* Footer Trust Bar */}
            <div className="px-6 py-3 border-t border-white/10 bg-black flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-3.5 h-3.5" /> Mutual NDA Pre-Executed
                </span>
                <span className="hidden sm:inline text-neutral-600">|</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-300" /> Instant Calendar Confirmation
                </span>
              </div>
              <div className="text-[11px] text-neutral-500">
                Sovereign Data Perimeter Guaranteed &middot; DPDP Act 2023 Conforming
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
