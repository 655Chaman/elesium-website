import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ExternalLink, Cpu, Shield, Zap, Database, RefreshCw, MessageSquare, ChevronRight } from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../../data/glossaryData';
import { useWhatsApp } from '../../hooks/useWhatsApp';

const CATEGORIES = [
  'All',
  'Agentic Systems',
  'Sovereign & DPDP',
  'Inference & Serving',
  'Data & Vector',
  'Legacy Integration'
] as const;

export default function Glossary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((item: GlossaryTerm) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.term.toLowerCase().includes(q) || 
        (item.acronym && item.acronym.toLowerCase().includes(q)) ||
        item.shortDefinition.toLowerCase().includes(q) ||
        item.technicalDeepDive.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const schemaJson = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": "https://elesium.online/glossary#definedtermset",
      "name": "Elesium Sovereign AI Systems & Enterprise Agentic Architecture Glossary",
      "description": "Authoritative engineering glossary defining deterministic multi-agent systems, sovereign cloud enclaves, DPDP Act compliance protocols, and low-latency inference fabrics.",
      "url": "https://elesium.online/glossary",
      "publisher": {
        "@type": "Organization",
        "name": "Elesium",
        "url": "https://elesium.online"
      },
      "hasDefinedTerm": GLOSSARY_TERMS.map(t => ({
        "@type": "DefinedTerm",
        "name": t.acronym ? `${t.term} (${t.acronym})` : t.term,
        "description": t.shortDefinition,
        "url": `https://elesium.online/glossary#${t.slug}`,
        "inDefinedTermSet": "https://elesium.online/glossary#definedtermset"
      })),
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".glossary-term-def", "h1"]
      }
    };
  }, []);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Agentic Systems': return <Cpu className="w-3.5 h-3.5" />;
      case 'Sovereign & DPDP': return <Shield className="w-3.5 h-3.5" />;
      case 'Inference & Serving': return <Zap className="w-3.5 h-3.5" />;
      case 'Data & Vector': return <Database className="w-3.5 h-3.5" />;
      case 'Legacy Integration': return <RefreshCw className="w-3.5 h-3.5" />;
      default: return <BookOpen className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300 pt-24 pb-20">
      <WhatsAppModal />
      <Helmet>
        <title>Enterprise AI Systems & Agentic Architecture Glossary | Elesium</title>
        <meta 
          name="description" 
          content="Authoritative engineering glossary defining deterministic multi-agent systems, sovereign cloud enclaves, DPDP Act compliance protocols, and low-latency inference fabrics." 
        />
        <link rel="canonical" href="https://elesium.online/glossary" />
        <meta property="og:title" content="Enterprise AI Systems & Agentic Architecture Glossary | Elesium" />
        <meta property="og:description" content="50+ definitive engineering terms for Chief Technology Officers, AI Systems Architects, and Engineering Directors." />
        <meta property="og:url" content="https://elesium.online/glossary" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(schemaJson)}
        </script>
      </Helmet>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 dark:text-gray-200">Glossary</span>
        </nav>

        {/* Hero Header */}
        <header className="mb-14 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            <span>Sovereign Knowledge Graph • Lexicon</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            Enterprise AI Systems Glossary
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            A peer-reviewed architectural reference for CTOs and Systems Architects. Grounded definitions of deterministic state machines, private VPC enclaves, and high-concurrency LLM serving fabrics.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search concepts, acronyms (e.g. EDAF, MLA, DPDP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-full text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-sm transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-white/10">
          <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
            Showing <span className="text-black dark:text-white font-bold">{filteredTerms.length}</span> of {GLOSSARY_TERMS.length} Architectural Definitions
          </div>
          <Link
            to="/ai-automation-agency-india"
            className="text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <span>Explore Sovereign India Pods</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Term Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredTerms.map((item: GlossaryTerm) => (
            <article
              key={item.slug}
              id={item.slug}
              className="group bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 rounded-3xl p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-gray-200/60 dark:bg-white/10 text-gray-800 dark:text-gray-200 mb-2">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {item.term}
                      {item.acronym && (
                        <span className="ml-2 font-mono text-xs px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-full">
                          {item.acronym}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* Short Definition */}
                <div className="glossary-term-def bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-4 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  {item.shortDefinition}
                </div>

                {/* Deep Dive */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {item.technicalDeepDive}
                </p>
              </div>

              {/* Benchmark SLA & Action links */}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-auto">
                <div className="flex items-center justify-between text-xs font-mono text-gray-900 dark:text-white bg-gray-100/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2 mb-3">
                  <span className="text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-wider">Production SLA:</span>
                  <span className="font-semibold">{item.productionBenchmark}</span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {item.relatedToolSlug ? (
                    <Link
                      to={`/tools/${item.relatedToolSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Launch Interactive Simulator</span>
                    </Link>
                  ) : <span />}

                  {item.relatedSolutionUrl && (
                    <Link
                      to={item.relatedSolutionUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <span>Architecture Docs</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filteredTerms.length === 0 && (
          <div className="text-center py-16 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl mb-16">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">No glossary terms matched your query</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Try searching for broader keywords like "VPC", "agent", or "cache".</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Institutional Bottom CTA */}
        <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.02] p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Need Custom Multi-Agent Architecture for Your Enterprise?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Review your production workloads with Principal AI Systems Architect Chaman Shah. Contractually backed 14-day production pilot SLA with a 90-day ROI guarantee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={openWhatsApp}
              className="w-full sm:w-auto h-11 px-6 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Chat on WhatsApp</span>
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
