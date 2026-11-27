import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, CheckCircle2, Lock, FileText, Loader2, AlertCircle } from 'lucide-react';
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [memoRefCode, setMemoRefCode] = useState('');

  // Handle external or internal open state
  const activeIsOpen = isOpenOverride !== undefined ? isOpenOverride : isOpen;

  const handleClose = useCallback(() => {
    if (onCloseOverride) {
      onCloseOverride();
    } else {
      setIsOpen(false);
    }
    // Suppress for 7 days
    try {
      localStorage.setItem('els_exit_memo_suppressed', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    } catch {
      // Ignore storage failures in restricted/private browsing contexts
    }
  }, [onCloseOverride]);

  // Escape key close and safe body scroll lock
  useEffect(() => {
    if (!activeIsOpen || typeof document === 'undefined') return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIsOpen, handleClose]);

  // Exit-Intent Mouse Movement Listener (Desktop)
  useEffect(() => {
    if (isOpenOverride !== undefined) return;

    // Check suppression
    try {
      const suppressedUntil = localStorage.getItem('els_exit_memo_suppressed');
      if (suppressedUntil && Date.now() < parseInt(suppressedUntil, 10)) {
        return;
      }
    } catch {
      // Ignore storage access failures in restricted browsing contexts
    }

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
    setSubmitError(null);
    if (val.length > 3) {
      setValidation(validateEnterpriseEmail(val));
    } else {
      setValidation(null);
    }
  };

  const handleDownloadLocalSummary = () => {
    const ref = memoRefCode || `ELS-MEMO-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;
    const lines = [
      `ELESIUM ARCHITECTURE EVALUATION SNAPSHOT (${ref})`,
      `Tool: ${toolName}`,
      `Organization: ${company.trim() || validation?.domain || 'Enterprise Prospect'}`,
      `Contact: ${email.trim() || 'Not specified'}`,
      `Generated: ${new Date().toISOString()}`,
      '',
      '--- SIMULATED TELEMETRY ---',
      ...simulatedMetrics.map((m) => `${m.label}: ${m.value}${m.detail ? ` (${m.detail})` : ''}`),
      '',
      'Contact Elesium Engineering Desk: contact@elesium.online | +91-8317329312',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ref.toLowerCase()}-summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation?.isAllowed || !email) return;

    setIsLoading(true);
    setSubmitError(null);
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

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://elesium.online';
      const response = await fetch(`${apiUrl}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      setIsSuccess(true);
    } catch (err) {
      const reason =
        err instanceof Error && err.name === 'AbortError'
          ? 'The dispatch server timed out.'
          : 'The live dispatch server is currently unreachable.';
      setSubmitError(
        `${reason} Your memo was not transmitted to ${email.trim()}. You can retry or download your local simulation summary directly below.`
      );
    } finally {
      window.clearTimeout(timeoutId);
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
            aria-hidden="true"
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-memo-title"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto overscroll-contain bg-neutral-950 border border-white/10 rounded-[28px] p-6 sm:p-10 shadow-2xl z-10 text-white font-sans"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white active:scale-[0.97] transition-all duration-300 text-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <div className="space-y-6">
                {/* Header Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 pr-4 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono font-semibold tracking-wider uppercase max-w-[calc(100%-3rem)]">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Architecture Evaluation Snapshot Ready</span>
                </div>

                <div>
                  <h3 id="exit-memo-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight pr-8">
                    Before You Go: Download Your Custom Architecture ROI &amp; Threat-Model Memo
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                    We have mapped your simulation parameters into a formal executive dossier containing your LangGraph DAG state machine topology and DPDP compliance risk factors.
                  </p>
                </div>

                {/* Simulated Metrics Card Preview */}
                <div className="p-4 rounded-[18px] bg-black border border-white/10 font-mono text-xs space-y-2.5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-1 flex justify-between gap-2">
                    <span>Active Simulation Digest</span>
                    <span className="text-white truncate">{toolName}</span>
                  </div>
                  {simulatedMetrics.slice(0, 3).map((metric, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-3 text-xs">
                      <span className="text-neutral-400">{metric.label}:</span>
                      <strong className="text-white font-semibold text-right">{metric.value}</strong>
                    </div>
                  ))}
                </div>

                {/* Intake Form */}
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  <div>
                    <label htmlFor="exit-memo-email" className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Corporate Work Email <span className="text-white">*</span>
                    </label>
                    <input
                      id="exit-memo-email"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="v.seth@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/30 outline-none text-base sm:text-sm font-sans transition-all"
                    />

                    {/* Live Domain Validation Feedback */}
                    {validation && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-mono">
                        {validation.category === 'enterprise' && (
                          <span className="text-white flex items-center gap-1">
                            &#10003; {validation.badgeText}
                          </span>
                        )}
                        {validation.category === 'consumer' && (
                          <span className="text-neutral-300 flex items-center gap-1">
                            ! {validation.badgeText}
                          </span>
                        )}
                        {validation.category === 'disposable' && (
                          <span className="text-neutral-400 flex items-center gap-1">
                            &times; {validation.badgeText}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="exit-memo-company" className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Organization / Enterprise Name (Optional)
                    </label>
                    <input
                      id="exit-memo-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Maersk Logistics, HDFC Securities"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black text-white placeholder-neutral-500 focus:ring-2 focus:ring-white/30 outline-none text-base sm:text-sm font-sans transition-all"
                    />
                  </div>

                  {submitError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-white/5 border border-white/20 text-xs text-neutral-200 space-y-2.5"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-white shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{submitError}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDownloadLocalSummary}
                        className="w-full py-2 px-4 rounded-full border border-white/20 hover:bg-white/10 text-white font-mono text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Instant Client-Side Summary (.txt)</span>
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || (validation !== null && !validation.isAllowed)}
                    className="w-full h-12 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.97] transition-all duration-300 cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Transmit Architecture Memo &amp; Executive Dossier</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-center text-[11px] text-neutral-500">
                    <Lock className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Protected by Mutual NDA. Zero third-party data egress.</span>
                  </div>
                </form>
              </div>
            ) : (
              /* Success Confirmation */
              <div className="py-6 text-center space-y-6">
                <div className="relative flex items-center justify-center h-16 w-16 mx-auto">
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-white tracking-tight">
                    Executive Architecture Memo Dispatched
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto">
                    Your simulation dossier (<span className="text-white font-mono">{memoRefCode}</span>) has been queued for transmission to <strong className="text-white">{email}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-[18px] bg-black border border-white/10 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-neutral-400">ESTIMATED DELIVERY</span>
                    <span className="text-white">&lt; 3 Minutes</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-1.5">
                    <span className="text-neutral-400">FORMAT</span>
                    <span className="text-white">Confidential PDF Memo (Mutual NDA)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">NEXT STEP</span>
                    <span className="text-white">Review with Chaman Shah</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-neutral-300 text-xs font-mono active:scale-[0.97] transition-all duration-300"
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
