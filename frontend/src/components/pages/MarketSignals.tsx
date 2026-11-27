import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, TrendingUp, Cpu, Network, Calendar, Clock, ChevronRight, ChevronDown, ExternalLink, MessageSquare, Terminal } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogPosts, getMatchedSolutionSlug, BlogPost } from '../../data/signalsHubData'
import { getSolutionSummaryBySlug, topHighLeverSolutions, SolutionSummaryItem as SolutionRecord } from '../../data/solutionsHubData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { 
    ArchitecturePlayground, 
    InteractiveRoiCalculator, 
    InteractiveCodeBlock, 
    InteractiveMermaid, 
    ExecutiveAudioBriefing, 
    BlueprintDownloadCard 
} from '../interactive'
import { useDwellTelemetry } from '../../hooks/useDwellTelemetry'

const signalsFaqs = [
    {
        q: "What are Elesium Technical Signals and Architecture Whitepapers?",
        a: "Elesium Technical Signals are peer-reviewed research blueprints and production telemetry reports on distributed multi-agent systems, sovereign private VPC deployments, vLLM PagedAttention optimization, and statutory compliance (DPDP Act 2023, RBI CSF, and HIPAA/DISHA)."
    },
    {
        q: "How does Elesium benchmark sub-200ms TTFT for enterprise agentic workflows?",
        a: "We benchmark inference on dedicated NVIDIA H100 and A100 SXM5 clusters utilizing custom FP8 GEMM microscaling kernels and vLLM PagedAttention page-table swapping. This reduces KV-cache memory fragmentation from 60-80% to under 4%, maintaining sub-200ms time-to-first-token even during heavy concurrent enterprise ERP reconciliation."
    },
    {
        q: "How do sovereign GPU clusters ensure compliance with India's DPDP Act 2023 Section 8(5)?",
        a: "Under Section 8(5), personal data must be erased immediately after processing. Elesium hosts all inference within client-owned private VPC subnets located in Yotta Shakti (Navi Mumbai) and CtrlS (Hyderabad/Mumbai) tier-IV datacenters, with zero external egress and zero third-party model provider data retention."
    },
    {
        q: "What contractual guarantees accompany implementations of these architectures?",
        a: "All production deployments derived from our technical signals carry a binding 90-day contractual SLA guaranteeing a 3x-5x audited cash-flow ROI, backed by proportional engineering fee rebate terms."
    },
    {
        q: "What are the commercial engagement tiers for implementing these architectures?",
        a: "Tier 1: Pilot Architecture Sprint (₹1,50,000 - ₹3,50,000, 14 days); Tier 2: Enterprise Multi-Agent Suite (₹6,00,000 - ₹15,00,000, 30-45 days); Tier 3: Autonomous AI Engineering Pod (₹4,50,000/month, dedicated pod with 1-hour critical production SLA)."
    }
]

declare global {
    interface Window {
        __INITIAL_SIGNAL__?: BlogPost;
    }
}

function getInitialSignal(slug?: string): BlogPost | null {
    if (!slug || typeof window === 'undefined') return null;
    const win = window as any;
    if (win.__INITIAL_SIGNAL__ && win.__INITIAL_SIGNAL__.slug === slug) {
        return win.__INITIAL_SIGNAL__;
    }
    try {
        const el = document.getElementById('__SIGNAL_DATA__');
        if (el && el.textContent) {
            const parsed = JSON.parse(el.textContent);
            if (parsed && parsed.slug === slug) {
                return parsed;
            }
        }
    } catch {
        // ignore parse error
    }
    return null;
}

export default function MarketSignals() {
    const { slug } = useParams();
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackInteraction } = useDwellTelemetry(slug || 'signals-directory');

    const [fullArticle, setFullArticle] = useState<BlogPost | null>(() => getInitialSignal(slug));

    useEffect(() => {
        window.scrollTo(0, 0);
        setOpenFaq(null);

        if (!slug) {
            setFullArticle(null);
            return;
        }

        const initial = getInitialSignal(slug);
        if (initial) {
            setFullArticle(initial);
            return;
        }

        let cancelled = false;
        fetch(`/data/signals/${slug}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: BlogPost) => {
                if (!cancelled) setFullArticle(data);
            })
            .catch(() => {
                // Keep fallback summary
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    const summaryArticle = slug ? blogPosts.find(post => post.slug === slug) : null;
    const activeArticle = fullArticle || (summaryArticle as any);

    // System 1 -> System 2 Topical Equity Bridge: Match signal to commercial solution
    const matchedSolution: SolutionRecord | undefined = React.useMemo(() => {
        if (!activeArticle) return undefined;
        const targetSlug = getMatchedSolutionSlug(activeArticle);
        return getSolutionSummaryBySlug(targetSlug) || topHighLeverSolutions[0];
    }, [activeArticle]);

    // Pillar 1: Find related posts for internal linking
    const relatedPosts = activeArticle?.internalLinks
        ? blogPosts.filter(p => activeArticle.internalLinks!.includes(p.slug))
        : [];

    useEffect(() => {
        window.scrollTo(0, 0);
        setOpenFaq(null);
    }, [slug]);

    const getIcon = (category: string) => {
        switch (category) {
            case 'Market Intelligence': return TrendingUp;
            case 'Operational Leverage': return Cpu;
            case 'Matchmaking Frameworks': return Network;
            default: return TrendingUp;
        }
    };

    const markdownComponents = {
        table: ({ node, ...props }: any) => (
            <div className="my-8 overflow-x-auto rounded-[24px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                <table className="w-full text-left text-xs sm:text-sm font-sans divide-y divide-neutral-200 dark:divide-white/10" {...props} />
            </div>
        ),
        thead: ({ node, ...props }: any) => (
            <thead className="bg-neutral-100 dark:bg-neutral-900 text-xs font-mono uppercase tracking-wider text-neutral-700 dark:text-neutral-300" {...props} />
        ),
        tbody: ({ node, ...props }: any) => (
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10 text-neutral-700 dark:text-neutral-300" {...props} />
        ),
        tr: ({ node, ...props }: any) => (
            <tr className="hover:bg-neutral-100/60 dark:hover:bg-white/[0.02] transition-colors" {...props} />
        ),
        th: ({ node, ...props }: any) => (
            <th className="px-4 py-3.5 font-semibold text-black dark:text-white" {...props} />
        ),
        td: ({ node, ...props }: any) => (
            <td className="px-4 py-3.5 leading-relaxed align-top" {...props} />
        ),
        blockquote: ({ node, children, ...props }: any) => (
            <blockquote className="my-6 border-l-2 border-black dark:border-white/40 bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-5 rounded-r-xl text-sm sm:text-base text-neutral-700 dark:text-neutral-300 italic" {...props}>
                {children}
            </blockquote>
        ),
        h2: ({ node, ...props }: any) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white mt-10 mb-4 pb-2 border-b border-neutral-200 dark:border-white/10" {...props} />
        ),
        h3: ({ node, ...props }: any) => (
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-black dark:text-white mt-6 mb-3" {...props} />
        ),
        p: ({ node, ...props }: any) => (
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal my-4" {...props} />
        ),
        ul: ({ node, ...props }: any) => (
            <ul className="space-y-2 my-4 pl-4 list-disc text-neutral-600 dark:text-neutral-400" {...props} />
        ),
        li: ({ node, ...props }: any) => (
            <li className="leading-relaxed" {...props} />
        ),
        code: ({ node, className, children, ...props }: any) => {
            const isInline = !className
            return isInline ? (
                <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-white/10 text-xs font-mono text-black dark:text-neutral-200" {...props}>
                    {children}
                </code>
            ) : (
                <pre className="p-4 my-6 rounded-xl bg-neutral-950 text-neutral-100 font-mono text-xs overflow-x-auto border border-white/10">
                    <code className={className} {...props}>{children}</code>
                </pre>
            )
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            {/* SEO Helmet - Pillar 2: JSON-LD Schema & GEO Meta Tags */}
            {activeArticle ? (
                <Helmet>
                    <title>{activeArticle.title.replace(/\*\*/g, '')} | Elesium</title>
                    <meta name="description" content={activeArticle.metaDescription} />
                    
                    {/* Open Graph */}
                    <meta property="og:title" content={activeArticle.title.replace(/\*\*/g, '')} />
                    <meta property="og:description" content={activeArticle.metaDescription} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={`https://elesium.online/signals/${activeArticle.slug}/`} />
                    <meta property="og:image" content="https://elesium.online/og-image.png" />
                    <meta property="og:site_name" content="Elesium" />
                    <meta property="og:locale" content="en_US" />

                    {/* Twitter Cards */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={activeArticle.title.replace(/\*\*/g, '')} />
                    <meta name="twitter:description" content={activeArticle.metaDescription} />
                    <meta name="twitter:image" content="https://elesium.online/og-image.png" />

                    <link rel="canonical" href={`https://elesium.online/signals/${activeArticle.slug}/`} />
                    
                    {/* Breadcrumb Schema for GEO/AEO */}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Home",
                                    "item": "https://elesium.online/"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Market Signals",
                                    "item": "https://elesium.online/signals/"
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": activeArticle.title.replace(/\*\*/g, ''),
                                    "item": `https://elesium.online/signals/${activeArticle.slug}/`
                                }
                            ]
                        })}
                    </script>

                    {activeArticle.jsonLdSchema && (
                        <script type="application/ld+json">
                            {activeArticle.jsonLdSchema}
                        </script>
                    )}
                </Helmet>
            ) : (
                <Helmet>
                    <title>Enterprise AI Architecture Whitepapers & Technical Signals | Elesium</title>
                    <meta name="description" content="Peer-reviewed technical whitepapers and architecture telemetry on private VPC LLMs, vLLM PagedAttention, FP8 GEMM kernels, and DPDP Act 2023 compliance." />
                    
                    {/* Open Graph */}
                    <meta property="og:title" content="Enterprise AI Architecture Whitepapers & Technical Signals | Elesium" />
                    <meta property="og:description" content="Peer-reviewed technical whitepapers and architecture telemetry on private VPC LLMs, vLLM PagedAttention, FP8 GEMM kernels, and DPDP Act 2023 compliance." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://elesium.online/signals/" />
                    <meta property="og:image" content="https://elesium.online/og-image.png" />

                    {/* Twitter Cards */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Enterprise AI Architecture Whitepapers & Technical Signals | Elesium" />
                    <meta name="twitter:description" content="Peer-reviewed technical whitepapers on sovereign multi-agent systems and private VPC deployments." />
                    <meta name="twitter:image" content="https://elesium.online/og-image.png" />

                    <link rel="canonical" href="https://elesium.online/signals/" />
                    
                    {/* Comprehensive JSON-LD Knowledge Graph for Signals Hub */}
                    <script type="application/ld+json">
                        {JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "CollectionPage",
                                    "@id": "https://elesium.online/signals/#collection",
                                    "name": "Enterprise AI Architecture Whitepapers & Technical Signals",
                                    "description": "Peer-reviewed technical whitepapers and architecture telemetry on private VPC LLMs, vLLM PagedAttention, FP8 GEMM kernels, and DPDP Act 2023 compliance.",
                                    "url": "https://elesium.online/signals/",
                                    "publisher": {
                                        "@type": "Organization",
                                        "@id": "https://elesium.online/#organization",
                                        "name": "Elesium",
                                        "url": "https://elesium.online/",
                                        "logo": {
                                            "@type": "ImageObject",
                                            "url": "https://elesium.online/assets/logo-square.png",
                                            "width": "512",
                                            "height": "512"
                                        }
                                    },
                                    "breadcrumb": {
                                        "@type": "BreadcrumbList",
                                        "@id": "https://elesium.online/signals/#breadcrumb",
                                        "itemListElement": [
                                            {
                                                "@type": "ListItem",
                                                "position": 1,
                                                "name": "Home",
                                                "item": "https://elesium.online/"
                                            },
                                            {
                                                "@type": "ListItem",
                                                "position": 2,
                                                "name": "Technical Signals",
                                                "item": "https://elesium.online/signals/"
                                            }
                                        ]
                                    }
                                },
                                {
                                    "@type": "ItemList",
                                    "@id": "https://elesium.online/signals/#itemlist",
                                    "name": "Enterprise AI Architecture Whitepapers & Technical Signals",
                                    "numberOfItems": blogPosts.length,
                                    "itemListElement": blogPosts.map((post, index) => ({
                                        "@type": "ListItem",
                                        "position": index + 1,
                                        "name": post.title.replace(/\*\*/g, ''),
                                        "item": `https://elesium.online/signals/${post.slug}/`
                                    }))
                                },
                                {
                                    "@type": "Blog",
                                    "@id": "https://elesium.online/signals/#blog",
                                    "name": "Elesium Market Signals & Intelligence Ledger",
                                    "description": "Technical intelligence ledger and engineering blueprints by Elesium Architects.",
                                    "url": "https://elesium.online/signals/",
                                    "publisher": {
                                        "@type": "Organization",
                                        "name": "Elesium",
                                        "url": "https://elesium.online/"
                                    }
                                },
                                {
                                    "@type": "FAQPage",
                                    "@id": "https://elesium.online/signals/#faq",
                                    "mainEntity": signalsFaqs.map(faq => ({
                                        "@type": "Question",
                                        "name": faq.q,
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": faq.a
                                        }
                                    }))
                                }
                            ]
                        })}
                    </script>
                </Helmet>
            )}

            <main className="max-w-5xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                    {slug ? (
                        <>
                            <Link to="/signals/" className="hover:text-black dark:hover:text-white transition-colors">
                                Market Signals
                            </Link>
                            <ChevronRight className="w-3 h-3 text-neutral-400" />
                            <span className="text-black dark:text-white font-medium truncate max-w-[200px] sm:max-w-sm">
                                {activeArticle ? activeArticle.title.replace(/\*\*/g, '') : slug}
                            </span>
                        </>
                    ) : (
                        <span className="text-black dark:text-white font-medium">Market Signals</span>
                    )}
                </nav>

                <AnimatePresence mode="wait">
                    {!slug ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Intro Section */}
                            <div className="mb-12 max-w-4xl">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400">
                                        Technical Intelligence Ledger • Peer-Reviewed Architecture
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-black dark:text-white leading-[1.1]">
                                    Enterprise AI Architecture Whitepapers &amp; Technical Signals
                                </h1>
                                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal mb-8">
                                    Peer-reviewed architectural blueprints on sovereign private VPC LLMs, KV-cache memory optimization, FP8 GEMM quantization, and statutory compliance for Chief Technology Officers and AI Systems Architects.
                                </p>

                                {/* AEO / Perplexity Definitive Answer Capsule */}
                                <div className="p-6 sm:p-8 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 mb-12">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-mono uppercase tracking-widest text-black dark:text-white font-semibold">
                                            AEO Answer Capsule • Perplexity Technical Grounding
                                        </span>
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-2">
                                        What Are Elesium Technical Signals and Architecture Whitepapers?
                                    </h2>
                                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                                        <strong>Elesium Technical Signals publish empirical systems telemetry, hardware benchmarks, and mathematical proofs for enterprise AI systems.</strong> Rather than high-level marketing overviews, our 119 whitepapers document production-proven methodologies for deploying LangGraph state machines, private VPC clusters, and custom vLLM kernels.
                                    </p>
                                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                                        Key specifications include sub-200ms time-to-first-token latency, FP8 GEMM microscaling quantization, PagedAttention memory fragmentation reduction (from 60-80% to &lt;4%), and zero external data retention compliant with Section 8(5) of India's DPDP Act 2023 on Yotta Shakti and CtrlS tier-IV datacenter clusters.
                                    </p>

                                    {/* Telemetry Matrix */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-[18px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black h-full flex flex-col justify-between">
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase">Inference SLA</div>
                                            <div className="text-base font-bold font-mono text-black dark:text-white mt-0.5">&lt; 200ms TTFT</div>
                                            <div className="text-[10px] text-neutral-400">FP8 GEMM Kernels</div>
                                        </div>
                                        <div className="p-4 rounded-[18px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black h-full flex flex-col justify-between">
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase">Memory Paging</div>
                                            <div className="text-base font-bold font-mono text-black dark:text-white mt-0.5">&lt; 4% Fragment</div>
                                            <div className="text-[10px] text-neutral-400">vLLM PagedAttention</div>
                                        </div>
                                        <div className="p-4 rounded-[18px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black h-full flex flex-col justify-between">
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase">Data Sovereignty</div>
                                            <div className="text-base font-bold font-mono text-black dark:text-white mt-0.5">Air-Gapped</div>
                                            <div className="text-[10px] text-neutral-400">DPDP Act Sec 8(5)</div>
                                        </div>
                                        <div className="p-4 rounded-[18px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black h-full flex flex-col justify-between">
                                            <div className="text-[10px] font-mono text-neutral-500 uppercase">GPU Cluster</div>
                                            <div className="text-base font-bold font-mono text-black dark:text-white mt-0.5">Yotta / CtrlS</div>
                                            <div className="text-[10px] text-neutral-400">Tier-IV Datacenters</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reproducible Open-Source Evidence */}
                                <div className="p-6 sm:p-8 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="space-y-2 max-w-2xl">
                                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500">
                                            <Terminal className="w-3.5 h-3.5" />
                                            <span>Reproducible Open-Source Evidence</span>
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                                            Public Inference Benchmarks &amp; Statutory Test Suites
                                        </h2>
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                            Audit raw 8x NVIDIA H100 telemetry, <span className="font-mono text-black dark:text-white">DPDP_2023_Compliance_Bench</span>, and <span className="font-mono text-black dark:text-white">Elesium-Indic-Sovereign-70B-FP8</span> reproducible evaluations.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                                        <a
                                            href="https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition"
                                        >
                                            <span>GitHub Benchmark Repo</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                        <a
                                            href="/docs/benchmarks/"
                                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-white/15 text-black dark:text-white text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                        >
                                            <span>Docs Benchmarks</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Articles Grid/List */}
                            <div className="grid grid-cols-1 gap-y-6">
                                {blogPosts.map((article, index) => {
                                    const Icon = getIcon(article.category);
                                    return (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 28, delay: Math.min(index * 0.03, 0.25) }}
                                        >
                                            <Link 
                                                to={`/signals/${article.slug}/`}
                                                className="group flex flex-col md:flex-row gap-4 md:gap-8 p-6 sm:p-8 rounded-[28px] bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all duration-300 cursor-pointer block"
                                            >
                                                <div className="md:w-1/4 flex flex-col gap-2">
                                                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-black dark:text-white">
                                                        <Icon className="h-3.5 w-3.5" />
                                                        <span className="uppercase tracking-wider">{article.category}</span>
                                                    </div>
                                                    <div className="text-xs text-neutral-500 font-mono">
                                                        {article.date} · {article.readTime}
                                                    </div>
                                                </div>

                                                <div className="md:w-3/4">
                                                    <h2 className="text-lg sm:text-2xl font-bold mb-3 text-black dark:text-white group-hover:underline transition-colors duration-200 leading-tight">
                                                        {article.title}
                                                    </h2>
                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-black dark:text-white font-mono">
                                                        <span>Read Intelligence Report</span>
                                                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Transparent Institutional Pricing Tiers */}
                            <div className="mt-20 p-8 sm:p-12 rounded-[32px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                <div className="text-center max-w-3xl mx-auto mb-12">
                                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-semibold mb-2 block">
                                        Direct Commercial Engagement
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
                                        Institutional AI Engineering Investment Tiers
                                    </h2>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                        Deploy any whitepaper architecture under contractual 90-day cash-flow ROI SLAs.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 sm:p-7 rounded-[24px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between h-full">
                                        <div>
                                            <span className="text-xs font-mono text-neutral-500 uppercase">Tier 01</span>
                                            <h3 className="text-lg font-bold text-black dark:text-white mt-1 mb-2">Pilot Architecture Sprint</h3>
                                            <div className="text-2xl font-bold font-mono text-black dark:text-white mb-1">₹1,50,000 - ₹3,50,000</div>
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-4">14-Day Delivery</div>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                                                Single-process deterministic agent validation on private VPC staging with sub-200ms latency baseline.
                                            </p>
                                        </div>
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full py-2.5 px-5 rounded-full border border-neutral-200 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-[0.97] font-semibold text-xs font-mono transition-all duration-300"
                                        >
                                            Inquire Tier 1 &rarr;
                                        </button>
                                    </div>

                                    <div className="p-6 sm:p-7 rounded-[24px] border-2 border-black dark:border-white bg-white dark:bg-black flex flex-col justify-between h-full relative">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">
                                            Most Deployed
                                        </div>
                                        <div>
                                            <span className="text-xs font-mono text-black dark:text-white uppercase">Tier 02</span>
                                            <h3 className="text-lg font-bold text-black dark:text-white mt-1 mb-2">Enterprise Multi-Agent Suite</h3>
                                            <div className="text-2xl font-bold font-mono text-black dark:text-white mb-1">₹6,00,000 - ₹15,00,000</div>
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-4">30-45 Day Implementation</div>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                                                Collaborative 3-agent triad with SAP/Oracle connectors, zero-data-retention VPC, and 90-day ROI SLA.
                                            </p>
                                        </div>
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full py-2.5 px-5 rounded-full bg-black text-white hover:opacity-90 dark:bg-white dark:text-black active:scale-[0.97] font-semibold text-xs font-mono transition-all duration-300"
                                        >
                                            Deploy Suite &rarr;
                                        </button>
                                    </div>

                                    <div className="p-6 sm:p-7 rounded-[24px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between h-full">
                                        <div>
                                            <span className="text-xs font-mono text-neutral-500 uppercase">Tier 03</span>
                                            <h3 className="text-lg font-bold text-black dark:text-white mt-1 mb-2">Autonomous Engineering Pod</h3>
                                            <div className="text-2xl font-bold font-mono text-black dark:text-white mb-1">₹4,50,000 / month</div>
                                            <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-4">Dedicated Team</div>
                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                                                3 AI engineers + 1 principal architect, continuous vLLM fine-tuning, and 1-hour critical production SLA.
                                            </p>
                                        </div>
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full py-2.5 px-5 rounded-full border border-neutral-200 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-[0.97] font-semibold text-xs font-mono transition-all duration-300"
                                        >
                                            Retain Pod &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Signals FAQ Section */}
                            <div className="mt-16">
                                <div className="text-center mb-10">
                                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-semibold mb-1 block">
                                        Architecture &amp; Procurement FAQ
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                                        Frequently Asked Questions About Technical Signals
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {signalsFaqs.map((faq, idx) => {
                                        const isOpen = openFaq === idx
                                        return (
                                            <div
                                                key={idx}
                                                className="border border-neutral-200 dark:border-white/10 rounded-[20px] overflow-hidden bg-white dark:bg-neutral-950"
                                            >
                                                <h3 className="m-0">
                                                    <button
                                                        type="button"
                                                        aria-expanded={isOpen}
                                                        aria-controls={`signals-faq-panel-${idx}`}
                                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                        className="w-full min-h-[44px] flex items-center justify-between gap-4 p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        <span>{faq.q}</span>
                                                        <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </h3>
                                                <div
                                                    id={`signals-faq-panel-${idx}`}
                                                    aria-hidden={!isOpen}
                                                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                    }`}
                                                >
                                                    <div className="overflow-hidden">
                                                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-white/10 pt-3">
                                                            {faq.a}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Direct Principal Systems Pairing Callout */}
                            <div className="mt-16 p-8 sm:p-12 rounded-[32px] bg-black text-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-center space-y-4">
                                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300">
                                    <span>Direct Principal Systems Pairing</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-xl mx-auto">
                                    Evaluate These Architectures with Principal Architect Chaman Shah
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
                                    Connect directly to evaluate your infrastructure topology, FP8 GEMM kernel suitability, and DPDP Act compliance boundaries.
                                </p>
                                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <button
                                        onClick={openWhatsApp}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 active:scale-[0.97] font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300 group"
                                    >
                                        <MessageSquare className="w-4 h-4 fill-current" />
                                        <span>Chat on WhatsApp with Lead Architect</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                    <Link
                                        to="/waitlist/"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 active:scale-[0.97] text-white font-medium px-6 py-3.5 rounded-full text-sm transition-all duration-300"
                                    >
                                        <span>ele-in SaaS Waitlist &rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        activeArticle ? (
                            <motion.article
                                key="article"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-4xl mx-auto"
                            >
                                {/* Meta Header */}
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-6 text-xs font-mono text-neutral-500 dark:text-neutral-400 tracking-wider uppercase">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-white/10 text-black dark:text-white rounded-lg font-semibold">
                                        {activeArticle.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {activeArticle.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {activeArticle.readTime}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                                        By {activeArticle.author?.name || 'Chaman Shah'} ({activeArticle.author?.role || 'Principal AI Systems Architect'})
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-6">
                                    {activeArticle.title}
                                </h1>

                                {/* Intro */}
                                <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal border-b border-neutral-200 dark:border-white/10 pb-8 mb-8">
                                    {activeArticle.intro}
                                </p>

                                {/* Behavioral Dwell Hook 1: Executive Timestamped Audio Synthesis Briefing */}
                                <ExecutiveAudioBriefing 
                                    postTitle={activeArticle.title.replace(/\*\*/g, '')}
                                    onTelemetry={trackInteraction} 
                                />

                                {/* Dynamic Sections with Interactive Assets */}
                                <div className="space-y-6 mt-8">
                                    {activeArticle.sections && Array.isArray(activeArticle.sections) ? (
                                        activeArticle.sections.map((section: any, sIdx: number) => {
                                        const shouldInjectPlayground = sIdx === 2 && !activeArticle.sections.some((s: any) => s.type === 'playground');
                                        const shouldInjectRoiCalculator = sIdx === Math.min(5, activeArticle.sections.length - 1) && !activeArticle.sections.some((s: any) => s.type === 'roi_calculator');

                                        const renderedSection = (() => {
                                            switch (section.type) {
                                                case 'heading':
                                                    return (
                                                        <h2 key={sIdx} className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight mt-10 mb-4 pb-2 border-b border-neutral-200 dark:border-white/10">
                                                            {section.value as string}
                                                        </h2>
                                                    );
                                                case 'paragraph':
                                                    return (
                                                        <div key={sIdx} className="my-4">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                                                {section.value as string}
                                                            </ReactMarkdown>
                                                        </div>
                                                    );
                                                case 'list':
                                                    return (
                                                        <ul key={sIdx} className="space-y-3 my-6 pl-1">
                                                            {(section.value as string[]).map((item, iIdx) => {
                                                                const [boldPart, rest] = item.includes(':') ? item.split(':', 2) : [null, item];
                                                                return (
                                                                    <li key={iIdx} className="flex items-start gap-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-black dark:bg-white" />
                                                                        <span>
                                                                            {boldPart ? (
                                                                                <>
                                                                                    <strong className="font-semibold text-black dark:text-white">{boldPart}</strong>:
                                                                                    {rest}
                                                                                </>
                                                                            ) : item}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    );
                                                case 'quote':
                                                    return (
                                                        <blockquote key={sIdx} className="border-l-2 border-black dark:border-white/40 bg-neutral-50 dark:bg-neutral-950 p-4 sm:p-5 rounded-r-xl my-6">
                                                            <p className="text-sm sm:text-base italic text-neutral-800 dark:text-neutral-200 leading-relaxed">
                                                                {section.value as string}
                                                            </p>
                                                        </blockquote>
                                                    );
                                                case 'metric':
                                                    return (
                                                        <div key={sIdx} className="grid grid-cols-1 md:grid-cols-3 gap-5 my-8">
                                                            {(section.value as { label: string; value: string; description: string }[]).map((metric, mIdx) => (
                                                                <div key={mIdx} className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[22px] p-5 flex flex-col justify-between h-full">
                                                                    <div>
                                                                        <div className="text-2xl sm:text-3xl font-bold font-mono text-black dark:text-white tracking-tight mb-1">
                                                                            {metric.value}
                                                                        </div>
                                                                        <div className="text-xs font-mono font-semibold text-black dark:text-white uppercase mb-2">
                                                                            {metric.label}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                                                                        {metric.description}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                case 'playground':
                                                    return (
                                                        <ArchitecturePlayground 
                                                            key={sIdx} 
                                                            defaultPreset={(section.preset as any) || (activeArticle.category.includes('India') ? 'bfsi' : 'supply_chain')}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'roi_calculator':
                                                    return (
                                                        <InteractiveRoiCalculator 
                                                            key={sIdx} 
                                                            defaultCurrency={activeArticle.category.includes('India') ? 'INR' : 'USD'}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'code_block':
                                                    return (
                                                        <InteractiveCodeBlock 
                                                            key={sIdx} 
                                                            tabs={section.props?.tabs || [{ label: 'Architecture Payload', language: 'json', content: typeof section.value === 'string' ? section.value : JSON.stringify(section.value, null, 2) }]}
                                                            title={section.props?.title}
                                                            complianceBadge={section.props?.complianceBadge}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'mermaid':
                                                    return (
                                                        <InteractiveMermaid 
                                                            key={sIdx} 
                                                            title={section.props?.title} 
                                                            diagramDsl={section.props?.diagramDsl} 
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'audio_briefing':
                                                    return (
                                                        <ExecutiveAudioBriefing 
                                                            key={sIdx} 
                                                            postTitle={activeArticle.title.replace(/\*\*/g, '')}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'blueprint_download':
                                                    return (
                                                        <BlueprintDownloadCard 
                                                            key={sIdx} 
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'faq':
                                                    return (
                                                        <div key={sIdx} className="my-8 space-y-3">
                                                            {(section.value as { q: string; a: string }[]).map((item, fIdx) => {
                                                                const isOpen = openFaq === fIdx
                                                                return (
                                                                    <div key={fIdx} className="border border-neutral-200 dark:border-white/10 rounded-[20px] overflow-hidden bg-neutral-50 dark:bg-neutral-950">
                                                                        <h3 className="m-0">
                                                                            <button
                                                                                type="button"
                                                                                aria-expanded={isOpen}
                                                                                aria-controls={`signal-sec-faq-${sIdx}-${fIdx}`}
                                                                                onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                                                                                className="w-full min-h-[44px] flex items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-colors"
                                                                            >
                                                                                <span>{item.q}</span>
                                                                                <ChevronDown className={`h-4 w-4 flex-shrink-0 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                                            </button>
                                                                        </h3>
                                                                        <div
                                                                            id={`signal-sec-faq-${sIdx}-${fIdx}`}
                                                                            aria-hidden={!isOpen}
                                                                            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                                                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                                            }`}
                                                                        >
                                                                            <div className="overflow-hidden">
                                                                                <p className="px-4 pb-4 pt-3 border-t border-neutral-200 dark:border-white/10 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.a}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })();

                                        return (
                                            <React.Fragment key={sIdx}>
                                                {renderedSection}
                                                {shouldInjectPlayground && (
                                                    <ArchitecturePlayground 
                                                        defaultPreset={activeArticle.category.includes('India') ? 'bfsi' : 'supply_chain'}
                                                        onTelemetry={trackInteraction} 
                                                    />
                                                )}
                                                {shouldInjectRoiCalculator && (
                                                    <InteractiveRoiCalculator 
                                                        defaultCurrency={activeArticle.category.includes('India') ? 'INR' : 'USD'}
                                                        onTelemetry={trackInteraction} 
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                    ) : (
                                        <div className="space-y-4 my-8 animate-pulse">
                                            <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-3/4"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-5/6"></div>
                                            <div className="h-4 bg-neutral-200 dark:bg-white/10 rounded w-2/3"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Behavioral Dwell Hook 4: Production Architecture Blueprint Download */}
                                <BlueprintDownloadCard onTelemetry={trackInteraction} />

                                {/* System 1 -> System 2 Topical Equity Bridge: Commercial Solution Callout */}
                                {matchedSolution && (
                                    <div className="my-10 p-6 sm:p-8 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black dark:text-white mb-3">
                                            <span className="font-semibold">Deploy This Architecture in Production</span>
                                            <span className="text-neutral-400 text-[10px] hidden sm:inline">| Sovereign Commercial Implementation</span>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-3">
                                            Operationalize This Architecture with Private VPC Isolation
                                        </h3>

                                        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                                            Need to operationalize this architecture? Deploy Elesium&apos;s{' '}
                                            <Link
                                                to={`/solutions/${matchedSolution.slug}/`}
                                                className="font-semibold text-black dark:text-white underline inline-flex items-center gap-1"
                                            >
                                                {matchedSolution.h1}
                                                <ExternalLink className="w-3.5 h-3.5 inline" />
                                            </Link>{' '}
                                            with dedicated private VPC isolation and an audited 90-day cash-flow ROI.
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-white/10 text-xs font-mono">
                                            <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-400">
                                                <span className="flex items-center gap-1.5"><span className="text-black dark:text-white">✓</span> Private VPC Isolated</span>
                                                <span className="flex items-center gap-1.5"><span className="text-black dark:text-white">✓</span> Sub-200ms Latency SLA</span>
                                                <span className="flex items-center gap-1.5"><span className="text-black dark:text-white">✓</span> DPDP Act 2023 Compliant</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    onClick={openWhatsApp}
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white hover:opacity-90 dark:bg-white dark:text-black active:scale-[0.97] font-semibold text-xs font-mono tracking-wide transition-all duration-300 group"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                                    <span>Chat on WhatsApp</span>
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </button>
                                                <Link
                                                    to={`/solutions/${matchedSolution.slug}/`}
                                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-white/20 hover:bg-neutral-100 dark:hover:bg-white/5 active:scale-[0.97] font-medium text-xs font-mono transition-all duration-300 text-neutral-700 dark:text-neutral-300"
                                                >
                                                    <span>View Architecture Details &rarr;</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Pillar 5: FAQ Section */}
                                {activeArticle.faq && activeArticle.faq.length > 0 && (
                                    <div className="mt-12 border-t border-neutral-200 dark:border-white/10 pt-8">
                                        <h2 className="text-xl font-bold text-black dark:text-white mb-6">Frequently Asked Questions</h2>
                                        <div className="space-y-3">
                                            {activeArticle.faq.map((item: any, fIdx: number) => {
                                                const isOpen = openFaq === fIdx + 100
                                                return (
                                                    <div key={fIdx} className="border border-neutral-200 dark:border-white/10 rounded-[20px] overflow-hidden bg-neutral-50 dark:bg-neutral-950">
                                                        <h3 className="m-0">
                                                            <button
                                                                type="button"
                                                                aria-expanded={isOpen}
                                                                aria-controls={`signal-art-faq-${fIdx}`}
                                                                onClick={() => setOpenFaq(isOpen ? null : fIdx + 100)}
                                                                className="w-full min-h-[44px] flex items-center justify-between gap-4 p-4 text-left text-sm font-semibold text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-colors"
                                                            >
                                                                <span>{item.q}</span>
                                                                <ChevronDown className={`h-4 w-4 flex-shrink-0 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </h3>
                                                        <div
                                                            id={`signal-art-faq-${fIdx}`}
                                                            aria-hidden={!isOpen}
                                                            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                                            }`}
                                                        >
                                                            <div className="overflow-hidden">
                                                                <p className="px-4 pb-4 pt-3 border-t border-neutral-200 dark:border-white/10 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.a}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Pillar 1: Related Posts - Internal Linking */}
                                {relatedPosts.length > 0 && (
                                    <div className="mt-12 border-t border-neutral-200 dark:border-white/10 pt-8">
                                        <h2 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4 text-black dark:text-white" />
                                            Related Intelligence
                                        </h2>
                                        <div className="space-y-3">
                                            {relatedPosts.map(rp => (
                                                <Link
                                                    key={rp.slug}
                                                    to={`/signals/${rp.slug}/`}
                                                    className="group flex items-start gap-3 p-4 rounded-[20px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 hover:border-black dark:hover:border-white/30 transition-all duration-300"
                                                >
                                                    <ChevronRight className="h-4 w-4 mt-0.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-black dark:text-white group-hover:underline transition-colors">{rp.title}</p>
                                                        <p className="text-xs text-neutral-500 mt-0.5">{rp.date} · {rp.readTime}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Architecture Action Card */}
                                <div className="mt-12 p-8 sm:p-12 rounded-[32px] bg-black text-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-center space-y-4">
                                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-300">
                                        <span>Direct Principal Systems Pairing</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-xl mx-auto">
                                        Evaluate This Whitepaper Architecture for Your Enterprise
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-300 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
                                        Connect directly with our Principal AI Systems Architect to model hardware sizing, latency envelopes, and private VPC deployment parameters.
                                    </p>
                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 active:scale-[0.97] font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300 group"
                                        >
                                            <MessageSquare className="w-4 h-4 fill-current" />
                                            <span>Chat on WhatsApp with Lead Architect</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                        <Link
                                            to="/waitlist/"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 active:scale-[0.97] text-white font-medium px-6 py-3.5 rounded-full text-sm transition-all duration-300"
                                        >
                                            <span>ele-in SaaS Waitlist &rarr;</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Article Footer Links */}
                                <div className="border-t border-neutral-200 dark:border-white/10 mt-12 pt-8 flex items-center justify-between">
                                    <Link
                                        to="/signals/"
                                        className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to All Signals
                                    </Link>
                                </div>
                            </motion.article>
                        ) : (
                            <div className="text-center py-20 text-neutral-500">Signal not found.</div>
                        )
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
