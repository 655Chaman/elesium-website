import { Helmet } from 'react-helmet-async';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Github, 
  Linkedin, 
  Twitter, 
  MapPin, 
  Award, 
  BookOpen, 
  Layers,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWhatsApp } from '../../hooks/useWhatsApp';

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
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

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
      'addressLocality': 'Shivamogga',
      'addressRegion': 'Karnataka',
      'postalCode': '577205',
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
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans pt-24 pb-20 selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
      <WhatsAppModal />
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

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/team" className="hover:text-black dark:hover:text-white transition-colors">Leadership</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 dark:text-white font-medium">Chaman Shah</span>
        </nav>

        {/* Hero Bio Card */}
        <div className="bg-gray-50/60 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar / Visual Placeholder with Monogram */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold shadow-md shrink-0">
              CS
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Author &amp; Systems Architect
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3.5 h-3.5" /> Shivamogga, Karnataka, India
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-950 dark:text-white mb-2">
                Chaman Shah
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium mb-4">
                Principal AI Systems Architect &amp; Founder, Elesium
              </p>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Chaman Shah leads architectural engineering at Elesium, designing production-grade multi-agent execution graphs and dedicated private VPC inference infrastructure. Over 8+ years, his engineering focus has centered on eliminating manual operational latency across supply chain logistics, core banking, and manufacturing plants via high-throughput LangGraph state machines and statutory DPDP Act 2023 compliance enclaves.
              </p>

              {/* Verified Links & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-4">
                  <a 
                    href="https://github.com/655Chaman" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" /> GitHub / 655Chaman
                  </a>
                  <a 
                    href="https://linkedin.com/in/chaman-shah-elesium" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn Profile
                  </a>
                  <a 
                    href="https://x.com/chamanshah_ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <Twitter className="w-4 h-4" /> @chamanshah_ai
                  </a>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={openWhatsApp}
                    className="inline-flex items-center gap-2 h-10 px-5 bg-black hover:opacity-90 text-white dark:bg-white dark:text-black font-semibold text-xs rounded-full transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Chat on WhatsApp</span>
                  </button>
                  <Link
                    to="/waitlist"
                    className="inline-flex items-center gap-1.5 h-10 px-5 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-xs rounded-full transition-all shadow-sm"
                  >
                    <span>ele-in SaaS Waitlist</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Technical Domain Competencies */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-gray-950 dark:text-white mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-500" /> Core Engineering &amp; Architecture Specializations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" /> Multi-Agent State Topologies
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Architecture of cyclic and acyclic LangGraph execution state machines with deterministic state boundaries, checkpoint rollback, and sub-200ms end-to-end execution latency.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-500">
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">LangGraph</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">FastAPI</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">PostgreSQL</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" /> Private High-Throughput Inference
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Design and optimization of air-gapped on-premise GPU clusters running vLLM with PagedAttention, FlashDecoding, and FP8 microscaling for zero-token-leakage compliance.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-500">
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">vLLM</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">Triton</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">NVIDIA TensorRT</span>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" /> DPDP Act 2023 Statutory Governance
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Engineering statutory consent artifacts, air-gapped data principal verification mechanisms, and zero-trust audit trails satisfying RBI, SEBI, and Indian data localization mandates.
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-gray-500">
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">DPDP Act</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">SOC-2</span>
                <span className="px-2 py-0.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">ISO 27001</span>
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
            <Link to="/signals" className="text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              View All 119 Whitepapers &rarr;
            </Link>
          </div>

          <div className="space-y-3.5">
            {FEATURED_WHITEPAPERS.map((paper) => (
              <Link
                key={paper.slug}
                to={`/signals/${paper.slug}`}
                className="block p-5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-2xl transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {paper.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <span>{paper.date}</span>
                    <span>•</span>
                    <span>{paper.readTime}</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-950 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">
                  {paper.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Direct Architecture Audit CTA */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.02] p-8 sm:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-mono text-gray-700 dark:text-gray-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Direct Systems Architect Consultation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            Consult Directly with Principal Architect Chaman Shah
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Review your enterprise system architecture, private VPC deployment parameters, and statutory DPDP Act 2023 compliance posture directly with the systems engineering lead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={openWhatsApp}
              className="w-full sm:w-auto h-11 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Chat on WhatsApp with Chaman</span>
            </button>
            <Link
              to="/waitlist"
              className="w-full sm:w-auto h-11 px-6 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>ele-in SaaS Waitlist</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
