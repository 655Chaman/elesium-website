import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ExternalLink, Cpu, Shield, Zap, Database, RefreshCw, ChevronRight } from 'lucide-react';
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

  const aeoAnswerCapsule = "The Elesium Sovereign AI Engineering Terminology Glossary is an authoritative technical lexicon codified for Enterprise CTOs, Lead Systems Architects, and Compliance Officers. It defines the formal mathematics, latency thresholds, memory paging primitives, and statutory standards governing deterministic multi-agent state machines, vLLM PagedAttention runtimes, private VPC isolation enclaves, and DPDP Act 2023 compliance protocols.";

  const schemaJson = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "DefinedTermSet",
          "@id": "https://elesium.online/glossary#definedtermset",
          "name": "Elesium Sovereign AI Systems & Enterprise Agentic Architecture Glossary",
          "description": aeoAnswerCapsule,
          "url": "https://elesium.online/glossary",
          "publisher": {
            "@type": "Organization",
            "@id": "https://elesium.online/#organization",
            "name": "Elesium",
            "url": "https://elesium.online"
          },
          "hasDefinedTerm": GLOSSARY_TERMS.map(t => ({
            "@type": "DefinedTerm",
            "name": t.acronym ? `${t.term} (${t.acronym})` : t.term,
            "description": t.shortDefinition,
            "url": `https://elesium.online/glossary#${t.slug}`,
            "inDefinedTermSet": "https://elesium.online/glossary#definedtermset"
          }))
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://elesium.online/glossary#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://elesium.online"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Glossary",
              "item": "https://elesium.online/glossary"
            }
          ]
        },
        {
          "@type": "WebPage",
          "@id": "https://elesium.online/glossary#webpage",
          "name": "Enterprise AI Systems & Agentic Architecture Glossary | Elesium",
          "description": aeoAnswerCapsule,
          "url": "https://elesium.online/glossary",
          "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".answer-capsule", ".glossary-term-def", "h1", "h2"]
          }
        }
      ]
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
    <main id="main-content" className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans transition-colors duration-300 pt-24 pb-20">
      <Helmet>
        <title>AI Architecture Glossary | Elesium</title>
        <meta 
          name="description" 
          content="Authoritative engineering glossary defining deterministic multi-agent systems, sovereign cloud enclaves, and enterprise low-latency inference fabrics." 
        />
        <link rel="canonical" href="https://elesium.online/glossary/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Architecture Glossary | Elesium" />
        <meta property="og:description" content="Authoritative engineering glossary defining deterministic multi-agent systems, sovereign cloud enclaves, and enterprise low-latency inference fabrics." />
        <meta property="og:image" content="https://elesium.online/og-image.png" />
        <meta property="og:url" content="https://elesium.online/glossary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@elesium_ai" />
        <meta name="twitter:title" content="AI Architecture Glossary | Elesium" />
        <meta name="twitter:description" content="Authoritative engineering glossary defining deterministic multi-agent systems, sovereign cloud enclaves, and enterprise low-latency inference fabrics." />
        <meta name="twitter:image" content="https://elesium.online/og-image.png" />
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
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 block mb-4">
            Technical Reference
          </span>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mb-5">
            AI &amp; Infrastructure Glossary
          </h1>

          <p className="answer-capsule text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Plain-English definitions of the infrastructure, compliance, and reliability concepts behind private enterprise AI.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search concepts, acronyms (e.g. EDAF, MLA, DPDP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-full text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-base sm:text-sm transition-all duration-300"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium active:scale-[0.97] transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/25'
                }`}
              >
                {getCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200 dark:border-white/10">
          <div className="text-xs uppercase tracking-wider font-semibold text-neutral-600 dark:text-neutral-400">
            Showing <span className="text-black dark:text-white font-bold">{filteredTerms.length}</span> of {GLOSSARY_TERMS.length} Architectural Definitions
          </div>
          <Link
            to="/ai-automation-agency-india/"
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white inline-flex items-center gap-1 transition-colors"
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
              className="group h-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/30 rounded-[28px] p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white dark:bg-black border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 mb-2">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                      {item.term}
                      {item.acronym && (
                        <span className="ml-2 font-mono text-xs px-2.5 py-0.5 bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 rounded-full">
                          {item.acronym}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* Short Definition */}
                <div className="glossary-term-def bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-[18px] p-4 mb-4 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                  {item.shortDefinition}
                </div>

                {/* Deep Dive */}
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {item.technicalDeepDive}
                </p>
              </div>

              {/* Benchmark SLA & Action links */}
              <div className="pt-4 border-t border-neutral-200 dark:border-white/10 mt-auto">
                <div className="flex items-center justify-between text-xs font-mono text-black dark:text-white bg-white dark:bg-black border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 mb-3">
                  <span className="text-neutral-600 dark:text-neutral-400 text-[11px] uppercase tracking-wider">Production SLA:</span>
                  <span className="font-semibold">{item.productionBenchmark}</span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  {item.relatedToolSlug ? (
                    <Link
                      to={`/tools/${item.relatedToolSlug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:underline transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-black dark:text-white" />
                      <span>Launch Interactive Simulator</span>
                    </Link>
                  ) : <span />}

                  {item.relatedSolutionUrl && (
                    <Link
                      to={item.relatedSolutionUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
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
          <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[28px] mb-16">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-black dark:text-white mb-1">No glossary terms matched your query</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">Try searching for broader keywords like &quot;VPC&quot;, &quot;agent&quot;, or &quot;cache&quot;.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-semibold active:scale-[0.97] transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
