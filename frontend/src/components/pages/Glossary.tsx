import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ExternalLink, Cpu, Shield, Zap, Database, RefreshCw } from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../../data/glossaryData';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
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

      {/* Hero Header */}
      <header className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-950/40 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sovereign Engineering Knowledge Graph • Definitive Lexicon</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Enterprise AI Systems &amp; Agentic Architecture Glossary
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            A peer-reviewed architectural reference for Chief Technology Officers, Systems Architects, and Engineering Directors. Grounded definitions of deterministic state machines, private VPC enclaves, DPDP Act compliance, and high-concurrency LLM serving fabrics.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, acronyms (e.g. EDAF, MLA, DPDP), or architectural mechanics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base shadow-lg shadow-black/40"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Glossary Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Showing <span className="text-sky-400 font-bold">{filteredTerms.length}</span> of {GLOSSARY_TERMS.length} Architectural Definitions
          </div>
          <Link
            to="/ai-automation-agency-india"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            <span>Explore Sovereign India Pods</span>
            <span>&rarr;</span>
          </Link>
        </div>

        {/* Term Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((item: GlossaryTerm) => (
            <article
              key={item.slug}
              id={item.slug}
              className="group relative bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-800 text-sky-400 border border-slate-700 mb-2">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                      {item.term}
                      {item.acronym && (
                        <span className="ml-2 font-mono text-xs px-2 py-0.5 bg-sky-950/70 text-sky-400 border border-sky-800 rounded">
                          {item.acronym}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* Short Definition (for answer capsules) */}
                <div className="glossary-term-def bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 mb-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {item.shortDefinition}
                </div>

                {/* Deep Dive */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                  {item.technicalDeepDive}
                </p>
              </div>

              {/* Benchmark SLA & Action links */}
              <div className="pt-4 border-t border-slate-800/80 mt-auto">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-3 py-1.5 mb-3">
                  <span className="text-slate-400 text-[11px] uppercase">Telemetry SLA:</span>
                  <span className="font-semibold">{item.productionBenchmark}</span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {item.relatedToolSlug ? (
                    <Link
                      to={`/tools/${item.relatedToolSlug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Launch Interactive Simulator</span>
                    </Link>
                  ) : <span />}

                  {item.relatedSolutionUrl && (
                    <Link
                      to={item.relatedSolutionUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
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
          <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-2xl">
            <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No glossary terms matched your query</h3>
            <p className="text-xs text-slate-400 mb-4">Try searching for broader keywords like "VPC", "agent", or "cache".</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Institutional Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Need Custom Multi-Agent Architecture for Your Enterprise?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mb-6">
            Review your production workloads with Principal AI Systems Architect Chaman Shah. Contractually backed 14-day production pilot SLA with a 90-day ROI guarantee.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/918317329312"
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg transition-colors shadow-lg shadow-sky-600/30"
            >
              <span>Schedule Architecture Audit</span>
              <span>&rarr;</span>
            </a>
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg transition-colors border border-slate-700"
            >
              <span>Browse 3,765 Workflows</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
