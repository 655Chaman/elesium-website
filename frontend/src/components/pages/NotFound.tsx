import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ShieldAlert, Home, Layers, Terminal } from 'lucide-react'

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-950 text-slate-100">
            <Helmet>
                <title>Page Not Found | Elesium Enterprise AI</title>
                <meta name="description" content="The requested page could not be located on Elesium. Explore our enterprise AI solutions and sovereign automation architecture." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="max-w-xl w-full text-center space-y-6">
                <div className="inline-flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-full mb-2">
                    <ShieldAlert className="w-10 h-10 text-red-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    404 - Page Not Found
                </h1>
                <p className="text-slate-400 text-base leading-relaxed">
                    The requested route does not exist or has been retired. Elesium provides deterministic air-gapped agent systems, sovereign VPC deployments, and verified enterprise automation solutions.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-sm"
                    >
                        <Home className="w-4 h-4" />
                        Return to Home
                    </Link>
                    <Link
                        to="/solutions/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors text-sm"
                    >
                        <Layers className="w-4 h-4" />
                        Explore Solutions
                    </Link>
                    <Link
                        to="/tools/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors text-sm"
                    >
                        <Terminal className="w-4 h-4" />
                        Interactive Tools
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound
