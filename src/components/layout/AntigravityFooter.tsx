export default function AntigravityFooter() {
    const footerLinks = {
        Product: ['Platform', 'Industries', 'Pricing', 'Case Studies'],
        Company: ['About', 'Careers', 'Contact', 'Blog'],
        Resources: ['Documentation', 'Help Center', 'Partners', 'Community'],
        Legal: ['Privacy', 'Terms', 'Cookies', 'GDPR'],
    }

    return (
        <footer id="resources" className="bg-white pt-40 pb-20 px-[72px]">
            <div className="max-w-[1200px] mx-auto">
                {/* Massive Brand Name */}
                <div className="mb-20">
                    <h2 className="footer-massive opacity-10">
                        ELESIUM
                    </h2>
                </div>

                {/* Experience liftoff heading */}
                <div className="mb-16">
                    <h3 className="section-heading mb-4">
                        Start connecting
                    </h3>
                    <p className="body-text max-w-2xl">
                        Join the platform connecting verified manufacturers with global buyers.
                    </p>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold mb-4 text-base text-[#121317]">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-[14.5px] text-[#45474D] hover:text-[#4285F4] transition-colors duration-200"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8">
                    <p className="text-[14.5px] text-[#45474D]">
                        © 2026 Elesium. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
