
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
        <footer className="relative bg-white text-black py-16 md:py-24 lg:py-32 overflow-hidden font-sans border-t border-gray-100">
            <div className="max-w-[95%] mx-auto px-4 md:px-6 flex flex-col min-h-[50vh] md:min-h-[80vh] justify-between">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between w-full items-start gap-16 md:gap-0">


                    <div className="flex gap-24 md:gap-32 pr-4 md:pr-12">
                        <div className="flex flex-col gap-6">
                            <h4 className="font-normal text-lg">Explore</h4>
                            <ul className="flex flex-col gap-4">
                                {footerSections.map((item) => (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => handleNavigation(item.name, item.id)}
                                            className="text-[#3C4043] hover:text-black transition-colors text-[15px] text-left"
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Massive Text Section */}
                <div className="w-full flex justify-center items-center py-12 flex-grow">
                    <h1 className="text-[18vw] leading-none font-medium tracking-tighter select-none -mb-[0.05em] text-center">
                        Elesium
                    </h1>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-end gap-8 pb-4 pt-8 border-t border-transparent">
                    <div className="text-2xl font-medium text-[#5F6368]">
                        Elesium.online
                    </div>

                    <div className="flex flex-wrap gap-8 text-[13px] text-[#5F6368] font-medium">
                        <span className="cursor-default">© 2024 Elesium</span>
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
