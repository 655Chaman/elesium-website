import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import emblem from '../../assets/LOGO_EMBLEM.png'

export default function Gateway() {
    const [hovered, setHovered] = useState<'connector' | 'ai' | null>(null)

    return (
        <main className="relative h-[100dvh] w-full overflow-hidden bg-black text-white select-none font-sans">
            <Helmet>
                <title>Elesium</title>
                <meta
                    name="description"
                    content="Elesium Connector Model and AI & Automation Elesium."
                />
                <link rel="canonical" href="https://elesium.online/" />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            </Helmet>

            <div className="grid h-full w-full grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                {/* Left / Top: Elesium Connector Model */}
                <Link
                    to="/connector/"
                    onMouseEnter={() => setHovered('connector')}
                    onMouseLeave={() => setHovered(null)}
                    className={`group relative flex h-full w-full items-center justify-center px-8 transition-all duration-500 ease-out hover:bg-white/[0.025] focus:outline-none focus-visible:bg-white/[0.04] ${
                        hovered === 'ai' ? 'opacity-35' : 'opacity-100'
                    }`}
                >
                    <span className="text-center text-xl sm:text-2xl md:text-[26px] lg:text-[32px] font-light tracking-[-0.02em] text-white/80 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:text-white">
                        Elesium Connector Model
                    </span>
                </Link>

                {/* Right / Bottom: AI & Automation Elesium */}
                <Link
                    to="/ai/"
                    onMouseEnter={() => setHovered('ai')}
                    onMouseLeave={() => setHovered(null)}
                    className={`group relative flex h-full w-full items-center justify-center px-8 transition-all duration-500 ease-out hover:bg-white/[0.025] focus:outline-none focus-visible:bg-white/[0.04] ${
                        hovered === 'connector' ? 'opacity-35' : 'opacity-100'
                    }`}
                >
                    <span className="text-center text-xl sm:text-2xl md:text-[26px] lg:text-[32px] font-light tracking-[-0.02em] text-white/80 transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:text-white">
                        AI &amp; Automation Elesium
                    </span>
                </Link>
            </div>

            {/* Center Dividing Hairline (Vertical on Desktop, Horizontal on Mobile) */}
            <div
                aria-hidden="true"
                className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-white/[0.06] via-white/25 to-white/[0.06] z-10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none block md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-white/[0.06] via-white/25 to-white/[0.06] z-10"
            />

            {/* Centered Brand Logo */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-full bg-black p-4 sm:p-5"
            >
                <img
                    src={emblem}
                    alt="Elesium"
                    width="56"
                    height="56"
                    loading="eager"
                    fetchPriority="high"
                    className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
                />
            </div>
        </main>
    )
}
