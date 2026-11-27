import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import emblem from '../../assets/LOGO_EMBLEM.png'
import { diaryEntries } from '../../data/diaryEntries'

export default function PortfolioEssay() {
    const { slug } = useParams<{ slug: string }>()
    const index = diaryEntries.findIndex((entry) => entry.slug === slug)
    const entry = index >= 0 ? diaryEntries[index] : undefined

    if (!entry) {
        return (
            <div className="dark min-h-[100dvh] bg-black text-white font-sans flex flex-col justify-between overflow-x-clip">
                <Helmet>
                    <title>Note Not Found — Chaman Shah | Elesium</title>
                    <meta name="robots" content="noindex, follow" />
                </Helmet>
                <main className="flex-1 max-w-2xl mx-auto px-6 py-32 flex flex-col justify-center">
                    <h1 className="text-2xl font-medium tracking-[-0.02em] mb-4">Note not found</h1>
                    <p className="text-sm text-neutral-400 mb-8">
                        That entry does not exist or has been moved.
                    </p>
                    <Link
                        to="/portfolio/"
                        className="inline-flex items-center gap-2 text-sm text-white underline underline-offset-4 decoration-white/30 hover:decoration-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Portfolio</span>
                    </Link>
                </main>
            </div>
        )
    }

    const prevEntry = index > 0 ? diaryEntries[index - 1] : null
    const nextEntry = index < diaryEntries.length - 1 ? diaryEntries[index + 1] : null
    const canonicalUrl = `https://elesium.online/portfolio/${entry.slug}/`

    const articleSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                '@id': `${canonicalUrl}#article`,
                headline: entry.title,
                description: entry.excerpt,
                url: canonicalUrl,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': canonicalUrl,
                },
                datePublished: entry.date || '2026-01-01',
                dateModified: entry.date || '2026-01-01',
                author: {
                    '@type': 'Person',
                    '@id': 'https://elesium.online/authors/chaman-shah#person',
                    name: 'Chaman Shah',
                    url: 'https://elesium.online/portfolio/',
                },
                publisher: {
                    '@id': 'https://elesium.online/#organization',
                },
                articleSection: entry.category,
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Portal', item: 'https://elesium.online/' },
                    { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://elesium.online/portfolio/' },
                    { '@type': 'ListItem', position: 3, name: entry.title, item: canonicalUrl },
                ],
            },
        ],
    }

    return (
        <div className="dark relative min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-clip">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.05),transparent)]"
            />

            <Helmet>
                <title>{entry.title} — Chaman Shah | Elesium</title>
                <meta name="description" content={entry.excerpt} />
                <link rel="canonical" href={canonicalUrl} />
                <meta name="robots" content="index, follow" />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={`${entry.title} — Chaman Shah`} />
                <meta property="og:description" content={entry.excerpt} />
                <meta property="og:image" content="https://elesium.online/chaman-shah.png" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${entry.title} — Chaman Shah`} />
                <meta name="twitter:description" content={entry.excerpt} />
                <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
            </Helmet>

            <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/85 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-3xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2.5 py-1 pr-2 rounded-full hover:opacity-80 transition active:scale-[0.97]"
                        aria-label="Return to Elesium Portal"
                    >
                        <img src={emblem} alt="Elesium" width="22" height="22" className="h-5.5 w-5.5 object-contain" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Elesium</span>
                    </Link>

                    <Link
                        to="/portfolio/"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition active:scale-[0.97]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>All Writing</span>
                    </Link>
                </div>
            </header>

            <motion.main
                id="main-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-6 pt-28 pb-24"
            >
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-500 mb-5">
                    <span className="text-neutral-300">{entry.category}</span>
                    <span>&middot;</span>
                    <span>{entry.readTime}</span>
                    {entry.date && (
                        <>
                            <span>&middot;</span>
                            <span>{entry.date}</span>
                        </>
                    )}
                </div>

                <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-white leading-[1.15] mb-6">
                    {entry.title}
                </h1>

                <p className="answer-capsule text-base sm:text-lg font-light text-neutral-400 leading-relaxed pb-8 mb-10 border-b border-white/10">
                    {entry.excerpt}
                </p>

                <article className="space-y-6">
                    {entry.blocks.map((block, i) => {
                        if (block.type === 'heading') {
                            return (
                                <h2
                                    key={i}
                                    className="text-lg sm:text-xl font-medium tracking-[-0.02em] text-white pt-5"
                                >
                                    {block.text}
                                </h2>
                            )
                        }
                        if (block.type === 'quote') {
                            return (
                                <blockquote
                                    key={i}
                                    className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-base text-neutral-200 italic leading-relaxed"
                                >
                                    {block.text}
                                </blockquote>
                            )
                        }
                        if (block.type === 'list') {
                            return (
                                <ul key={i} className="space-y-3 pl-5 border-l border-white/15">
                                    {block.items.map((item, j) => (
                                        <li
                                            key={j}
                                            className="text-base text-neutral-300 leading-[1.75] font-light"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                        return (
                            <p key={i} className="text-base text-neutral-300 leading-[1.8] font-light">
                                {block.text}
                            </p>
                        )
                    })}
                </article>

                <nav
                    aria-label="Entry navigation"
                    className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                >
                    {prevEntry ? (
                        <Link
                            to={`/portfolio/${prevEntry.slug}/`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 p-4 transition active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-500 mb-1.5">
                                <ArrowLeft className="w-3 h-3" />
                                <span>Previous</span>
                            </div>
                            <div className="text-sm font-medium text-white truncate">{prevEntry.title}</div>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextEntry && (
                        <Link
                            to={`/portfolio/${nextEntry.slug}/`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 p-4 text-left sm:text-right transition active:scale-[0.99]"
                        >
                            <div className="flex items-center sm:justify-end gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-500 mb-1.5">
                                <span>Next</span>
                                <ArrowRight className="w-3 h-3" />
                            </div>
                            <div className="text-sm font-medium text-white truncate">{nextEntry.title}</div>
                        </Link>
                    )}
                </nav>
            </motion.main>

            <footer className="relative z-10 py-8 px-6 border-t border-white/10">
                <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-neutral-500">
                    <Link to="/portfolio/" className="hover:text-white transition">
                        Chaman Shah
                    </Link>
                    <span>elesium.online</span>
                </div>
            </footer>
        </div>
    )
}
