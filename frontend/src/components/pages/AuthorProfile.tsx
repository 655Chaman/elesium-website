import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Calendar, 
  Github, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Award, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CalendarBookingEmbed } from '../cro/CalendarBookingEmbed';

const FEATURED_WHITEPAPERS = [
  {
    title: 'On-Premise Open-Source LLM Deployment in India: Sovereign Private Cloud, vLLM PagedAttention, and DPDP Act 2023',
    slug: 'open-source-llm-deployment-on-premise-india',
    category: 'Sovereign AI Infrastructure',
    readTime: '14 min read',
    date: 'October 2026'
  },
  {
    title: 'Enterprise AI-Driven Document Processing in India: Multimodal OCR, LayoutLMv3, and GST Rule 36(4) Reconciliation',
    slug: 'ai-driven-document-processing-india',
    category: 'Enterprise Automation',
    readTime: '12 min read',
    date: 'October 2026'
  },
  {
    title: 'Sub-200ms Ledger Reconciliation: Python LangGraph State Machines for Core Banking and RBI Compliance',
    slug: 'sub-200ms-ledger-reconciliation-agents-for-fintechs',
    category: 'BFSI & FinTech',
    readTime: '16 min read',
    date: 'September 2026'
  },
  {
    title: 'DPDP Act 2023 Technical Implementation: Consent Artifact Architecture, Data Principal Rights, and Air-Gapped VPCs',
    slug: 'dpdp-act-2023-ai-compliance-guide',
    category: 'Statutory Compliance',
    readTime: '15 min read',
    date: 'August 2026'
  }
];

export default function AuthorProfile() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://elesium.online/authors/chaman-shah#person',
    'name': 'Chaman Shah',
    'givenName': 'Chaman',
    'familyName': 'Shah',
    'jobTitle': 'Principal AI Systems Architect & Founder',
    'worksFor': {
      '@type': 'Organization',
      '@id': 'https://elesium.online/#organization',
      'name': 'Elesium',
      'url': 'https://elesium.online'
    },
    'url': 'https://elesium.online/authors/chaman-shah',
    'sameAs': [
      'https://github.com/655Chaman',
      'https://linkedin.com/in/chaman-shah-elesium',
      'https://x.com/chamanshah_ai'
    ],
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Bengaluru',
      'addressRegion': 'Karnataka',
      'addressCountry': 'IN'
    },
    'knowsAbout': [
      'Enterprise Multi-Agent Systems',
      'LangGraph State Topology',
      'vLLM PagedAttention Inference',
      'DPDP Act 2023 Statutory Compliance',
      'Dedicated Private VPC Cloud Infrastructure',
      'SAP S/4HANA RFC Middleware',
      'NVIDIA Triton Cluster Orchestration',
      'Sub-200ms Financial Ledger Reconciliation'
    ],
    'description': 'Chaman Shah is the Principal AI Systems Architect and Founder at Elesium, leading engineering teams deploying sovereign multi-agent architectures, air-gapped private VPC inference, and DPDP Act 2023 compliant automation for enterprise leaders across India.'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070707] text-gray-900 dark:text-gray-100 font-sans pt-28 pb-20 selection:bg-emerald-500 selection:text-white">
      <Helmet>
        <title>Chaman Shah — Principal AI Systems Architect & Founder | Elesium</title>
        <meta 
          name="description" 
          content="Chaman Shah is the Principal AI Systems Architect and Founder at Elesium. Engineering sovereign multi-agent systems, private VPC vLLM clusters, and DPDP Act 2023 enterprise infrastructure." 
        />
        <link rel="canonical" href="https://elesium.online/authors/chaman-shah" />
        <script type="application/ld+json">
          {JSON.stringify(authorSchema)}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/team" className="hover:text-emerald-500 transition-colors">Leadership</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">Chaman Shah</span>
        </nav>

        {/* Hero Bio Card */}
        <div className="bg-gray-50 dark:bg-[#0e0e0e] border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar / Visual Placeholder with Monogram */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-mono text-3xl sm:text-4xl font-bold shadow-lg shrink-0">
              CS
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Author & Systems Architect
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5" /> Bengaluru, Karnataka, India
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 dark:text-white mb-2">
                Chaman Shah
              </h1>
              <p className="text-lg text-emerald-600 dark:text-emerald-400 font-medium mb-4">
                Principal AI Systems Architect & Founder, Elesium
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Chaman Shah leads architectural engineering at Elesium, designing production-grade multi-agent execution graphs and dedicated private VPC inference infrastructure. Over 8+ years, his engineering focus has centered on eliminating manual operational latency across supply chain logistics, core banking, and manufacturing plants via high-throughput LangGraph state machines and statutory DPDP Act 2023 compliance enclaves.
              </p>

              {/* Verified Links & Social Footprint */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <a 
                  href="https://github.com/655Chaman" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub / 655Chaman
                </a>
                <a 
                  href="https://linkedin.com/in/chaman-shah-elesium" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn Profile
                </a>
                <a 
                  href="https://x.com/chamanshah_ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  <Twitter className="w-4 h-4" /> @chamanshah_ai
                </a>
                
                <button
                  onClick={() => setIsCalendarOpen(true)}
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-all shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book 30-Min Architecture Session
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Technical Domain Competencies */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-500" /> Core Engineering & Architecture Specializations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-2xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" /> Multi-Agent State Topologies
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Architecture of cyclic and acyclic LangGraph execution state machines with deterministic state boundaries, checkpoint rollback, and sub-200ms end-to-end execution latency.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-500">
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">LangGraph</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">FastAPI</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">PostgreSQL</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-2xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> Private High-Throughput Inference
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Design and optimization of air-gapped on-premise GPU clusters running vLLM with PagedAttention, FlashDecoding, and FP8 microscaling for zero-token-leakage compliance.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-500">
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">vLLM</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">Triton</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">NVIDIA TensorRT</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-2xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" /> DPDP Act 2023 Statutory Governance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Engineering statutory consent artifacts, air-gapped data principal verification mechanisms, and zero-trust audit trails satisfying RBI, SEBI, and Indian data localization mandates.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-500">
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">DPDP Act</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">SOC-2</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded border border-gray-200 dark:border-white/10">ISO 27001</span>
              </div>
            </div>

          </div>
        </div>

        {/* Authored Whitepapers & Research Catalog */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-950 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" /> Key Authored Technical Systems Whitepapers
            </h2>
            <Link to="/signals" className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline">
              View All 119 Whitepapers &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {FEATURED_WHITEPAPERS.map((paper) => (
              <Link
                key={paper.slug}
                to={`/signals/${paper.slug}`}
                className="block p-5 bg-gray-50 dark:bg-[#0c0c0c] hover:bg-gray-100 dark:hover:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-2xl transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {paper.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-500">
                    <span>{paper.date}</span>
                    <span>•</span>
                    <span>{paper.readTime}</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-950 dark:text-white group-hover:text-emerald-500 transition-colors">
                  {paper.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Direct Architecture Audit CTA */}
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Consult Directly with Principal Architect Chaman Shah
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Review your enterprise system architecture, private VPC deployment parameters, and statutory DPDP Act 2023 compliance posture in an exclusive 30-minute technical evaluation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="px-6 py-3 bg-white text-emerald-950 hover:bg-emerald-50 font-semibold text-sm rounded-xl transition-all shadow"
            >
              Book 30-Minute Architecture Audit
            </button>
            <Link
              to="/ai-automation-agency-india"
              className="px-6 py-3 bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-medium text-sm rounded-xl transition-all border border-emerald-600/50"
            >
              Explore India Enterprise Solutions Hub &rarr;
            </Link>
          </div>
        </div>

      </div>

      <CalendarBookingEmbed
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        calLink="chaman-shah-elesium/sovereign-ai-audit"
        context={{
          toolSource: 'Author Profile — Chaman Shah',
          solutionSlug: 'principal-architect-consultation'
        }}
      />
    </div>
  );
}
