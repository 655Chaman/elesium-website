import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ShieldCheck, MapPin, Github, Linkedin, Twitter, BookOpen, Layers, Terminal, Award, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const FEATURED_ARTICLES = [
  {
    title: 'Running Open-Source AI Models Privately Under DPDP Act 2023',
    path: '/signals/open-source-llm-deployment-on-premise-india/',
    category: 'Private AI Infrastructure',
    readTime: '14 min read',
    date: 'October 2026',
  },
  {
    title: 'Automated Enterprise Document Processing & GST Reconciliation',
    path: '/signals/ai-driven-document-processing-india/',
    category: 'Enterprise Automation',
    readTime: '12 min read',
    date: 'October 2026',
  },
  {
    title: 'Fast Ledger Reconciliation for Core Banking & Payments',
    path: '/solutions/upi-merchant-chargeback-dispute-arbitration-autonomous-agents-for-mumbai-payment-aggregators/',
    category: 'Finance & Banking',
    readTime: '16 min read',
    date: 'September 2026',
  },
  {
    title: 'Practical DPDP Act 2023 Compliance for Private Enterprise Clouds',
    path: '/solutions/compliance/dpdp-act-2023/',
    category: 'Compliance',
    readTime: '15 min read',
    date: 'August 2026',
  },
]

export default function AuthorProfile() {
  const bioSummary =
    'Chaman Shah is the Founder of Elesium, building private AI automation software and direct business partner pipelines from Bengaluru.'

  const authorSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://elesium.online/authors/chaman-shah#person',
        name: 'Chaman Shah',
        givenName: 'Chaman',
        familyName: 'Shah',
        jobTitle: 'Founder, Elesium',
        worksFor: {
          '@type': 'Organization',
          '@id': 'https://elesium.online/#organization',
          name: 'Elesium',
          url: 'https://elesium.online/',
        },
        url: 'https://elesium.online/authors/chaman-shah/',
        sameAs: [
          'https://github.com/655Chaman',
          'https://linkedin.com/in/chaman-shah-elesium',
          'https://x.com/chamanshah_ai',
          'https://elesium.online/portfolio/',
        ],
        description: bioSummary,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://elesium.online/authors/chaman-shah#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elesium.online/' },
          { '@type': 'ListItem', position: 2, name: 'Leadership', item: 'https://elesium.online/team/' },
          { '@type': 'ListItem', position: 3, name: 'Chaman Shah', item: 'https://elesium.online/authors/chaman-shah/' },
        ],
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://elesium.online/authors/chaman-shah#webpage',
        name: 'Chaman Shah | Founder, Elesium',
        description: bioSummary,
        url: 'https://elesium.online/authors/chaman-shah/',
        mainEntity: { '@id': 'https://elesium.online/authors/chaman-shah#person' },
      },
    ],
  }

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
      className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans pt-24 pb-20 transition-colors duration-300"
    >
      <Helmet>
        <title>Chaman Shah | Founder, Elesium</title>
        <meta name="description" content={bioSummary} />
        <link rel="canonical" href="https://elesium.online/authors/chaman-shah/" />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content="Chaman Shah | Founder, Elesium" />
        <meta property="og:description" content={bioSummary} />
        <meta property="og:image" content="https://elesium.online/chaman-shah.png" />
        <meta property="og:url" content="https://elesium.online/authors/chaman-shah/" />
        <script type="application/ld+json">{JSON.stringify(authorSchema)}</script>
      </Helmet>

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <nav className="mb-8 flex items-center gap-2 text-xs font-mono text-neutral-500" aria-label="Breadcrumb">
          <Link to="/ai/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black dark:text-white font-medium">Chaman Shah</span>
        </nav>

        {/* Bio Card */}
        <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[32px] p-8 sm:p-12 mb-14">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img
              src="/chaman-shah.png"
              alt="Chaman Shah"
              width="112"
              height="112"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-[24px] object-cover border border-neutral-200 dark:border-white/10 grayscale shrink-0"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-white dark:bg-black text-black dark:text-white border border-neutral-200 dark:border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5" /> Author &amp; Founder
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500">
                  <MapPin className="w-3.5 h-3.5" /> Bengaluru, India
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white mb-2">
                Chaman Shah
              </h1>
              <p className="text-base text-neutral-500 font-medium mb-4">
                Founder, Elesium
              </p>

              <p className="answer-capsule text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                Chaman leads engineering at Elesium, focused on private AI systems for business operations and direct B2B partner matching across finance, logistics, and manufacturing.
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-neutral-200 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-5">
                  <a href="https://github.com/655Chaman" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a href="https://linkedin.com/in/chaman-shah-elesium" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                  <a href="https://x.com/chamanshah_ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" /> X
                  </a>
                </div>

                <Link
                  to="/portfolio/"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs rounded-full active:scale-[0.97] transition-all"
                >
                  <span>View Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Core Focus */}
        <div className="mb-14">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">Focus Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[28px]">
              <Layers className="w-5 h-5 text-black dark:text-white mb-3" />
              <h3 className="font-semibold text-black dark:text-white mb-2">Workflow Automation</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Reliable multi-step automation integrated cleanly into ERP, billing, and customer operations.
              </p>
            </div>
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[28px]">
              <Terminal className="w-5 h-5 text-black dark:text-white mb-3" />
              <h3 className="font-semibold text-black dark:text-white mb-2">Private Hosting</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Self-hosted AI deployments inside client cloud enclaves with zero external data sharing.
              </p>
            </div>
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[28px]">
              <Award className="w-5 h-5 text-black dark:text-white mb-3" />
              <h3 className="font-semibold text-black dark:text-white mb-2">Data Governance</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Privacy controls, audit logs, and retention safeguards aligned with DPDP Act guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Selected Writing
            </h2>
            <Link to="/signals/" className="text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
              All Articles &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {FEATURED_ARTICLES.map(paper => (
              <Link
                key={paper.path}
                to={paper.path}
                className="block p-5 sm:p-6 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-black border border-neutral-200 dark:border-white/10 rounded-[24px] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5 text-xs font-mono text-neutral-500">
                  <span className="text-black dark:text-white uppercase tracking-wide">{paper.category}</span>
                  <span>{paper.date} &middot; {paper.readTime}</span>
                </div>
                <h3 className="text-base font-semibold text-black dark:text-white">{paper.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.main>
  )
}
