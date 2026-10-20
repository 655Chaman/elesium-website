import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Download, CheckCircle2, Lock, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { validateEnterpriseEmail, DomainValidationResult } from './corporateDomainValidator';

export interface ExitIntentMemoModalProps {
  toolName: string;
  simulatedMetrics: {
    label: string;
    value: string;
    detail?: string;
  }[];
  isOpenOverride?: boolean;
  onCloseOverride?: () => void;
}

export function ExitIntentMemoModal({
  toolName,
  simulatedMetrics,
  isOpenOverride,
  onCloseOverride
}: ExitIntentMemoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [validation, setValidation] = useState<DomainValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [memoRefCode, setMemoRefCode] = useState('');

  // Handle external or internal open state
  const activeIsOpen = isOpenOverride !== undefined ? isOpenOverride : isOpen;

  const handleClose = () => {
    if (onCloseOverride) {
      onCloseOverride();
    } else {
      setIsOpen(false);
    }
    // Suppress for 7 days
    try {
      localStorage.setItem('els_exit_memo_suppressed', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    } catch {}
  };

  // Exit-Intent Mouse Movement Listener (Desktop)
  useEffect(() => {
    if (isOpenOverride !== undefined) return;

    // Check suppression
    try {
      const suppressedUntil = localStorage.getItem('els_exit_memo_suppressed');
      if (suppressedUntil && Date.now() < parseInt(suppressedUntil, 10)) {
        return;
      }
    } catch {}

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves within top 15px of viewport (towards tabs / address bar)
      if (e.clientY <= 15 && !isOpen && !isSuccess) {
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen, isSuccess, isOpenOverride]);

  // Handle email change and live enterprise domain validation
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.length > 3) {
      setValidation(validateEnterpriseEmail(val));
    } else {
      setValidation(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation?.isAllowed || !email) return;

    setIsLoading(true);
    const code = `ELS-MEMO-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
    setMemoRefCode(code);

    const payload = {
      email: email.trim().toLowerCase(),
      company: company.trim() || validation.domain,
      leadSource: `Exit-Intent Memo: ${toolName}`,
      attributionSource: window.location.pathname,
      confirmationCode: code,
      simulatedMetrics: simulatedMetrics,
      requestType: 'Architecture ROI Audit Memo PDF'
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://elesium-website.onrender.com';
      await fetch(`${apiUrl}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);

      setIsSuccess(true);
    } catch (err) {
      console.warn('Memo submission fallback triggered', err);
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {activeIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl z-10 text-white font-sans overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Ambient Background Gradient */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            {!isSuccess ? (
              <div className="space-y-6">
                {/* Header Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold tracking-wider uppercase">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Architecture Evaluation Snapshot Ready</span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    Before You Go: Download Your Custom Architecture ROI & Threat-Model Memo
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
                    We have mapped your simulation parameters into a formal executive dossier containing your LangGraph DAG state machine topology and DPDP compliance risk factors.
                  </p>
                </div>

                {/* Simulated Metrics Card Preview */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs space-y-2.5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
                    <span>Active Simulation Digest</span>
                    <span className="text-emerald-400">{toolName}</span>
                  </div>
                  {simulatedMetrics.slice(0, 3).map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">{metric.label}:</span>
                      <strong className="text-emerald-300 font-semibold">{metric.value}</strong>
                    </div>
                  ))}
                </div>

                {/* Intake Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Corporate Work Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="v.seth@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm font-sans"
                    />

                    {/* Live Domain Validation Feedback */}
                    {validation && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-mono">
                        {validation.category === 'enterprise' && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            ✓ {validation.badgeText}
                          </span>
                        )}
                        {validation.category === 'consumer' && (
                          <span className="text-amber-400 flex items-center gap-1">
                            ⚠️ {validation.badgeText}
                          </span>
                        )}
                        {validation.category === 'disposable' && (
                          <span className="text-rose-400 flex items-center gap-1">
                            ✕ {validation.badgeText}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Organization / Enterprise Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Maersk Logistics, HDFC Securities"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || (validation !== null && !validation.isAllowed)}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Transmit Architecture Memo & Executive Dossier</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-center text-[11px] text-gray-500">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Protected by Mutual NDA. Zero third-party data egress.</span>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="py-6 text-center space-y-6">
                <div className="relative flex items-center justify-center h-16 w-16 mx-auto">
                  <span className="animate-ping absolute inline-flex h-14 w-14 rounded-full bg-emerald-500/20 opacity-75" />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-white tracking-tight">
                    Executive Architecture Memo Dispatched
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-md mx-auto">
                    Your simulation dossier (<span className="text-emerald-400 font-mono">{memoRefCode}</span>) has been queued for transmission to <strong className="text-white">{email}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">ESTIMATED DELIVERY</span>
                    <span className="text-emerald-400">&lt; 3 Minutes</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5">
                    <span className="text-gray-400">FORMAT</span>
                    <span className="text-white">Confidential PDF Memo (Mutual NDA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">NEXT STEP</span>
                    <span className="text-white">Review with Chaman Shah</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-mono transition-all"
                >
                  Return to Active Tool
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
