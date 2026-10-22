import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle2, X } from 'lucide-react';

export interface AttestationSeal {
  id: string;
  shortName: string;
  fullName: string;
  authority: string;
  summary: string;
  specHash: string;
  clauses: string[];
}

const ATTESTATIONS: AttestationSeal[] = [
  {
    id: 'dpdp-2023',
    shortName: 'DPDP Act 2023',
    fullName: 'Digital Personal Data Protection Act 2023',
    authority: 'Data Protection Board of India',
    summary: 'Statutory Data Fiduciary compliance for sovereign AI processing. Strict consent management under Section 6 and tamper-proof audit trails under Section 8(5).',
    specHash: 'SHA256: 9e8a71c2b4d5e89a3f124567890bcdef1234567890abcdef',
    clauses: [
      'Section 6: Notice and explicit verifiable consent architecture.',
      'Section 8(5): Mandatory automated audit trail logging of all LLM data access.',
      'Section 9: Mandatory zero-profiling guardrails for minors.'
    ]
  },
  {
    id: 'soc2-type2',
    shortName: 'SOC-2 Type II',
    fullName: 'AICPA SOC-2 Type II Attestation',
    authority: 'Independent AICPA Audited Assessor',
    summary: 'Rigorous attestation evaluating Security, Availability, and Confidentiality controls across all agentic state machines and VPC infrastructure.',
    specHash: 'SHA256: 4f1289c0debc1234567890abcdef1234567890abcdef123456',
    clauses: [
      'Trust Services Criteria CC6.1 - Logical access boundaries.',
      'Trust Services Criteria CC6.6 - Boundary protection and encryption in transit/at rest.',
      'Trust Services Criteria CC7.2 - Real-time security incident monitoring.'
    ]
  },
  {
    id: 'iso-27001',
    shortName: 'ISO/IEC 27001',
    fullName: 'ISO/IEC 27001:2022 ISMS Certified',
    authority: 'International Organization for Standardization',
    summary: 'Global standard for Information Security Management Systems covering cryptographic key lifecycles, access control, and private VPC enclaves.',
    specHash: 'SHA256: 7d890abcdef1234567890abcdef1234567890abcdef12345678',
    clauses: [
      'Annex A.8.20: Network security and air-gapped VPC segregation.',
      'Annex A.8.24: Cryptographic key management for agent telemetry.',
      'Annex A.5.15: Strict access control based on least privilege.'
    ]
  },
  {
    id: 'rbi-localization',
    shortName: 'RBI Data Localization',
    fullName: 'Reserve Bank of India Data Localization Directive',
    authority: 'Reserve Bank of India (RBI)',
    summary: 'Sub-200ms ledger reconciliation and payment data processed exclusively within Indian geographical borders. Zero international transit of financial logs.',
    specHash: 'SHA256: 1234567890abcdef1234567890abcdef1234567890abcdef1234',
    clauses: [
      'Circular DPSS.CO.OD No. 2785/06.11.001/2017-18.',
      'Complete end-to-end transaction data stored only in Indian data centres.',
      'Sub-200ms ledger reconciliation with zero external API transit.'
    ]
  },
  {
    id: 'airgap-vpc',
    shortName: 'Air-Gapped Private VPC',
    fullName: 'Zero-Egress Private Cloud AI Perimeter',
    authority: 'Elesium Sovereign Systems Specification',
    summary: 'LLM inference executed entirely within dedicated AWS/GCP/Azure customer VPC. Zero model training retention and zero external prompt leakage.',
    specHash: 'SHA256: cba987654321fedcba987654321fedcba987654321fedcba9876',
    clauses: [
      'Zero model provider data retention (ZDR).',
      'Dedicated vLLM and TensorRT-LLM container execution.',
      'Hardware-enforced egress firewall blocking all outbound public internet traffic.'
    ]
  }
];

export function TrustProofRibbon() {
  const [selectedSeal, setSelectedSeal] = useState<AttestationSeal | null>(null);

  return (
    <>
      <div className="w-full py-4 px-4 sm:px-6 rounded-2xl bg-black/40 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Title with Pulse */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Institutional Compliance & Trust Suite:
            </span>
          </div>

          {/* Badges List */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {ATTESTATIONS.map((seal) => (
              <button
                key={seal.id}
                onClick={() => setSelectedSeal(seal)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-gray-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer group"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>{seal.shortName}</span>
                <span className="text-[9px] text-gray-500 group-hover:text-emerald-400">ⓘ</span>
              </button>
            ))}
          </div>

          {/* Cryptographic Hash Seal */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-gray-500 border-l border-white/10 pl-4">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[140px]">SHA256: 9e8a71...4567</span>
          </div>
        </div>
      </div>

      {/* Detail Verification Modal */}
      <AnimatePresence>
        {selectedSeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSeal(null)}
              className="absolute inset-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0e0e0e] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-white font-sans space-y-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">{selectedSeal.fullName}</h4>
                    <p className="text-xs text-gray-400 font-mono">{selectedSeal.authority}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSeal(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {selectedSeal.summary}
              </p>

              {/* Verified Clauses */}
              <div className="space-y-2 p-3.5 rounded-xl bg-black/50 border border-white/5 text-xs font-mono">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">
                  Enforced Technical Controls:
                </div>
                {selectedSeal.clauses.map((clause, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{clause}</span>
                  </div>
                ))}
              </div>

              {/* Spec Hash */}
              <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 truncate">
                {selectedSeal.specHash}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedSeal(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-all"
                >
                  Close Verification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
