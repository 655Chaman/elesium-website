
interface FooterProps {
    onNavigate?: (page: 'home' | 'how-we-work' | 'industries') => void;
}

export default function DownloadFooter({ onNavigate }: FooterProps) {
    const handleNavigation = (name: string, id: string) => {
        if (name === 'How We Work') {
            onNavigate?.('how-we-work');
        } else if (name === 'Industries') {
            onNavigate?.('industries');
        } else if (name === 'Case Studies') {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const footerSections = [
        { name: 'How We Work', id: 'how-we-work' },
        { name: 'Industries', id: 'industries' },
        { name: 'Case Studies', id: 'case-studies' },
    ];

    return (
        <footer className="relative bg-white dark:bg-black text-black dark:text-white py-12 md:py-24 lg:py-32 overflow-hidden font-sans border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-[95%] mx-auto px-5 md:px-6 flex flex-col min-h-[40vh] md:min-h-[80vh] justify-between">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between w-full items-start gap-8 md:gap-0">

                    <div className="flex gap-24 md:gap-32 pr-4 md:pr-12">
                        <div className="flex flex-col gap-6">
                            <h4 className="font-normal text-lg text-gray-900 dark:text-white">Explore</h4>
                            <ul className="flex flex-col gap-4">
                                {footerSections.map((item) => (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => handleNavigation(item.name, item.id)}
                                            className="text-[#3C4043] dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-[15px] text-left"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: tagline */}
                    <div className="hidden md:flex flex-col items-end gap-2 text-right max-w-xs">
                        <span className="text-xs font-mono tracking-[0.18em] uppercase text-gray-400 dark:text-gray-600">
                            Strategic Mandate Firm
                        </span>
                        <p className="text-sm text-gray-400 dark:text-gray-600 leading-relaxed">
                            Exclusive intake. Verified introductions.<br />
                            Aerospace & Industrial Sectors.
                        </p>
                    </div>
                </div>

                {/* Massive Text Section */}
                <div className="w-full flex justify-center items-center py-8 md:py-12 flex-grow overflow-hidden">
                    <h1 className="text-[18vw] md:text-[18vw] leading-none font-medium tracking-tighter select-none -mb-[0.05em] text-center text-black dark:text-white transition-colors">
                        Elesium
                    </h1>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-8 pb-4 pt-8 border-t border-gray-100 dark:border-white/5 transition-colors">
                    <div className="text-2xl font-medium text-[#5F6368] dark:text-gray-600">
                        Elesium.online
                    </div>

                    <div className="flex flex-wrap gap-8 text-[13px] text-[#5F6368] dark:text-gray-600 font-medium">
                        <span className="cursor-default">© 2026 Elesium</span>
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
