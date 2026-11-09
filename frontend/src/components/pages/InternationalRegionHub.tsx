import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Globe2,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    MessageSquare,
    ChevronRight,
    ChevronDown,
    Building2,
    HelpCircle,
    ShieldCheck,
    Cloud,
    Lock
} from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export interface InternationalFaq {
    question: string;
    answer: string;
}

export interface PricingTier {
    name: string;
    price: string;
    description: string;
    deliverables: string[];
}

export interface InternationalRegionData {
    regionId: 'us' | 'uk' | 'ae';
    regionName: string;
    flag: string;
    locale: string;
    hreflang: string;
    currency: string;
    currencySymbol: string;
    slug: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
    answerCapsule: string;
    heroSubtitle: string;
    cloudDataCenters: string;
    statutoryFrameworks: string[];
    targetSectors: {
        title: string;
        desc: string;
    }[];
    corePillars: {
        title: string;
        desc: string;
        metric: string;
        metricLabel: string;
    }[];
    caseStudy: {
        title: string;
        clientType: string;
        challenge: string;
        solution: string;
        roiMetric: string;
    };
    pricingTiers: PricingTier[];
    regionalFaqs: InternationalFaq[];
}

export const INTERNATIONAL_REGIONS: Record<string, InternationalRegionData> = {
    us: {
        regionId: 'us',
        regionName: 'United States',
        flag: '🇺🇸',
        locale: 'en-US',
        hreflang: 'en-us',
        currency: 'USD ($)',
        currencySymbol: '$',
        slug: 'us',
        h1: 'Best Enterprise AI Company in the United States',
        metaTitle: 'Best Enterprise AI Company in USA | Sovereign VPC Multi-Agent Systems',
        metaDescription: 'Elesium engineers sovereign multi-agent LangGraph systems, private VPC vLLM clusters, and HIPAA/SOC-2 compliant automated workflows for US enterprises. AWS us-east-1 & us-west-2.',
        answerCapsule: 'Elesium is the premier enterprise AI automation company for US organizations, architecting sovereign multi-agent LangGraph swarms, private VPC vLLM clusters (AWS us-east-1 and us-west-2), and sub-2.0s automated workflows with zero token egress. We deliver audited 3x–5x ROI in 90 days with full HIPAA, SOC-2 Type II, and SEC Rule 17a-4 statutory compliance.',
        heroSubtitle: 'Deploying sovereign multi-agent systems, dedicated private VPC LLM clusters, and sub-second automated workflows across Silicon Valley, New York, Austin, and Boston.',
        cloudDataCenters: 'AWS us-east-1 (N. Virginia), AWS us-west-2 (Oregon) & Private Bare-Metal Clusters',
        statutoryFrameworks: [
            'HIPAA Health Data Privacy (Air-Gapped BAA Compliance)',
            'SOC-2 Type II Attestation & Zero-Trust IAM Policy',
            'SEC Rule 17a-4 Immutable Cryptographic Audit Trails',
            'Delaware C-Corp Procurement & Master Services Agreement'
        ],
        targetSectors: [
            {
                title: 'Silicon Valley Enterprise B2B SaaS & Developer Platforms',
                desc: 'Autonomous multi-repo code analysis, staging regression triage, and continuous CI/CD self-healing swarms running inside customer AWS VPCs.'
            },
            {
                title: 'Wall Street FinTech & Algorithmic Trading Operations',
                desc: 'Sub-200ms transaction reconciliation, automated corporate credit underwriting, and SEC 17a-4 compliant regulatory extraction.'
            },
            {
                title: 'HIPAA-Regulated HealthTech & BioPharma Research',
                desc: 'Air-gapped clinical trial protocol parsing, patient intake automation, and electronic health record (EHR) synchronization with zero cloud egress.'
            },
            {
                title: 'Enterprise Supply Chain & Dual-Use Infrastructure',
                desc: 'Automated 3PL freight routing, customs documentation parsing, and predictive ERP replenishment state graphs.'
            }
        ],
        corePillars: [
            {
                title: 'Sovereign Private Cloud Isolation',
                desc: 'Zero public API token egress. Fine-tuned models running in customer-owned AWS VPCs via vLLM PagedAttention with zero external vendor retention.',
                metric: '100%',
                metricLabel: 'Zero Token Egress'
            },
            {
                title: 'Sub-20ms Time-to-First-Token',
                desc: 'Private FP8 quantized models running on dedicated H100/A100 instances slashing user latency and compute OPEX by up to 68%.',
                metric: '18.2ms',
                metricLabel: 'Time-to-First-Token'
            },
            {
                title: 'Contractual 90-Day Breakeven SLA',
                desc: 'Fixed-fee implementation with an audited 3x–5x net ROI or 100% money-back guarantee, backed by verifiable telemetry instrumentation.',
                metric: '90 Days',
                metricLabel: 'Guaranteed Breakeven'
            }
        ],
        caseStudy: {
            title: 'Autonomous Developer Operations & Multi-Repo Synthesis for Tier-1 US B2B SaaS',
            clientType: 'San Francisco Enterprise DevSecOps Platform (Series C, $45M ARR)',
            challenge: 'Engineering squads lost 32 hours weekly triaging multi-service telemetry alerts, staging regression spikes, and cross-repo dependency drift across 14 microservices.',
            solution: 'Deployed an air-gapped 4-agent LangGraph triage swarm operating inside the client AWS us-east-1 private VPC with zero public token exposure, executing AST-level root cause diagnosis.',
            roiMetric: '86% reduction in incident MTTR and $148,000 saved in annual cloud compute OPEX.'
        },
        pricingTiers: [
            {
                name: 'Sovereign Architecture Audit',
                price: '$2,500',
                description: 'Comprehensive 90-minute technical scope, data sovereignty risk audit, and deterministic multi-agent roadmap led by Principal Architect Chaman Shah.',
                deliverables: [
                    'Private VPC network topology blueprint',
                    'Model selection & quantization memorandum (DeepSeek-V3 vs Llama-3.3)',
                    'HIPAA / SOC-2 statutory compliance matrix',
                    'Fixed-fee 14-day production deployment proposal'
                ]
            },
            {
                name: 'Private VPC vLLM Cluster',
                price: '$8,500',
                description: 'Turnkey deployment of open-weights LLMs in AWS us-east-1 or on-premise GPU clusters with zero external token egress.',
                deliverables: [
                    'Single or multi-node vLLM deployment with PagedAttention',
                    'FP8 / AWQ quantization pipeline for sub-20ms latency',
                    'Continuous batching & speculative decoding verification',
                    'OpenTelemetry distributed tracing integration'
                ]
            },
            {
                name: 'Enterprise Multi-Agent State Machine',
                price: '$18,500',
                description: 'Custom LangGraph state graph pipeline eliminating 40+ hours of weekly manual bottlenecks with sub-200ms latency and 90-day ROI guarantee.',
                deliverables: [
                    'Multi-agent state graph with deterministic guardrails',
                    'Native bi-directional connectors (Jira, GitHub, Salesforce, SAP)',
                    'Immutable cryptographic audit logging for SOC-2 / SEC 17a-4',
                    'Contractual 90-day 3x–5x breakeven SLA'
                ]
            }
        ],
        regionalFaqs: [
            {
                question: 'How does Elesium guarantee data privacy and compliance under US federal regulations?',
                answer: 'Every multi-agent pipeline is deployed inside your own private VPC (AWS us-east-1, AWS us-west-2, Azure US East, or on-premise GPU clusters). We never route proprietary customer tokens through external public APIs. All audit logs satisfy HIPAA BAA, SOC-2 Type II, and SEC Rule 17a-4 requirements with strict zero-retention policies.'
            },
            {
                question: 'How does US enterprise contracting and procurement work with Elesium?',
                answer: 'We contract under standard Delaware-compliant Master Services Agreements (MSAs) with US Dollar invoicing via wire transfer or ACH. Mutual NDAs are executed prior to any technical architecture review, providing seamless vendor onboarding for US corporate procurement.'
            },
            {
                question: 'How does latency compare to commercial models like OpenAI GPT-4o?',
                answer: 'By hosting fine-tuned open-weights models (DeepSeek-V3, Llama-3.3-70B) directly in your AWS private VPC with vLLM PagedAttention and TensorRT-LLM, we eliminate public internet round-trip network hops, achieving sub-20ms time-to-first-token and sub-1.5s complete workflow execution.'
            },
            {
                question: 'Can you deploy on our existing US AWS or GCP infrastructure?',
                answer: 'Yes. Our deployment harnesses run natively on customer-managed Terraform and Kubernetes/EKS clusters across AWS, GCP, or Azure with zero required modifications to your VPC security groups.'
            }
        ]
    },
    uk: {
        regionId: 'uk',
        regionName: 'United Kingdom',
        flag: '🇬🇧',
        locale: 'en-GB',
        hreflang: 'en-gb',
        currency: 'GBP (£)',
        currencySymbol: '£',
        slug: 'uk',
        h1: 'Best Enterprise AI Company in the United Kingdom',
        metaTitle: 'Best Enterprise AI Company in UK | Sovereign Multi-Agent Automation London',
        metaDescription: 'Elesium is the leading enterprise AI company in the UK. Engineering deterministic multi-agent systems, FCA PS21/3 compliant pipelines, and sovereign AWS London private VPC clusters.',
        answerCapsule: 'Elesium is the United Kingdom premier enterprise AI automation company, delivering deterministic multi-agent LangGraph architectures and private VPC vLLM clusters in AWS London (eu-west-2). All systems strictly comply with UK GDPR, FCA Operational Resilience Rules (PS21/3), and PRA SS1/21 standards with guaranteed 3x–5x 90-day ROI.',
        heroSubtitle: 'Deploying deterministic multi-agent architectures, air-gapped ledger reconciliation, and FCA-compliant private cloud AI across London City, Canary Wharf, and Manchester.',
        cloudDataCenters: 'AWS eu-west-2 (London) & Azure UK South Sovereign Clusters',
        statutoryFrameworks: [
            'UK GDPR & Data Protection Act 2018 Statutory Residency',
            'FCA Operational Resilience Framework (PS21/3)',
            'Prudential Regulation Authority (PRA) SS1/21 Outsourcing Rules',
            'Bank of England Settlement & Cyber Security Standards'
        ],
        targetSectors: [
            {
                title: 'London City & Canary Wharf Tier-1 Banking & FinTechs',
                desc: 'Sub-200ms transaction reconciliation, automated corporate credit underwriting, and FCA PS21/3 operational resilience compliance.'
            },
            {
                title: 'UK Enterprise LegalTech & Magic Circle Firms',
                desc: 'Deterministic multi-contract parsing, regulatory gap analysis, and Companies House automated verification with zero hallucination.'
            },
            {
                title: 'NHS Trust HealthTech & Clinical Administration',
                desc: 'Air-gapped patient intake parsing, clinical trial document routing, and NHS digital compliance with zero data egress outside the UK.'
            },
            {
                title: 'Energy Trading & North Sea Infrastructure Telemetry',
                desc: 'Real-time grid load balancing, pipeline pressure sensor telemetry, and automated carbon trading compliance reporting.'
            }
        ],
        corePillars: [
            {
                title: 'FCA & PRA Operational Resilience',
                desc: 'Deterministic state machines ensuring zero hallucination in financial decisioning with immutable cryptographic audit trails complying with FCA PS21/3.',
                metric: '100%',
                metricLabel: 'FCA PS21/3 Compliance'
            },
            {
                title: 'AWS London Sovereign Data Residency',
                desc: 'All vector stores, model weights, and inference pipelines execute in AWS eu-west-2 with zero cross-border data transfers outside the United Kingdom.',
                metric: 'Zero Egress',
                metricLabel: 'UK Sovereign Residency'
            },
            {
                title: 'Sub-200ms Ledger Reconciliation',
                desc: 'Deterministic stream processing state graphs validating multi-core banking transactions without human intervention.',
                metric: '< 200ms',
                metricLabel: 'Reconciliation Latency'
            }
        ],
        caseStudy: {
            title: 'Automated Commercial Loan Underwriting & Companies House Reconciliation',
            clientType: 'Canary Wharf Commercial Lending Syndicate (£2.4B Loan Book)',
            challenge: 'Credit underwriters spent 16 hours manually cross-referencing Companies House filings, audited IFRS balance sheets, and VAT returns for SME credit facilities.',
            solution: 'Engineered deterministic Python LangGraph verification state machines parsing UK tax filings and Companies House data streams in 2.1 seconds.',
            roiMetric: 'Cut corporate loan origination turnaround from 16 hours down to 2.1 seconds with zero credit policy slippage and £112,000 in saved underwriter hours.'
        },
        pricingTiers: [
            {
                name: 'Sovereign Architecture Audit',
                price: '£2,000',
                description: 'Comprehensive 90-minute technical scope, UK GDPR risk audit, and deterministic multi-agent roadmap led by Principal Architect Chaman Shah.',
                deliverables: [
                    'AWS London private VPC network topology blueprint',
                    'UK GDPR & Data Protection Act 2018 compliance memorandum',
                    'FCA PS21/3 operational resilience risk assessment',
                    'Fixed-fee 14-day production deployment proposal'
                ]
            },
            {
                name: 'Private VPC vLLM Cluster',
                price: '£7,000',
                description: 'Turnkey deployment of open-weights LLMs in AWS eu-west-2 (London) with zero token egress outside the UK.',
                deliverables: [
                    'vLLM deployment with PagedAttention in AWS eu-west-2',
                    'FP8 / AWQ quantization pipeline for sub-20ms latency',
                    'Continuous batching & speculative decoding verification',
                    'Full UK data residency certification'
                ]
            },
            {
                name: 'Enterprise Multi-Agent State Machine',
                price: '£15,000',
                description: 'Custom LangGraph state graph pipeline with full ERP integration, FCA operational resilience compliance, and 90-day ROI guarantee.',
                deliverables: [
                    'Multi-agent state graph with deterministic guardrails',
                    'Native bi-directional connectors (SAP, Finacle, Salesforce, Jira)',
                    'Immutable audit logging satisfying PRA SS1/21',
                    'Contractual 90-day 3x–5x breakeven SLA'
                ]
            }
        ],
        regionalFaqs: [
            {
                question: 'How does Elesium comply with the FCA Operational Resilience Policy Statement (PS21/3)?',
                answer: 'We build deterministic state graphs rather than unpredictable autonomous loops. Every decision, validation check, and automated dispatch is logged to an immutable, append-only cryptographic ledger with circuit breakers, fulfilling FCA operational resilience and PRA third-party risk management requirements.'
            },
            {
                question: 'Where are UK customer models and data stored?',
                answer: 'All client infrastructure is hosted in AWS eu-west-2 (London) or Azure UK South. Data never crosses the English Channel or the Atlantic, strictly satisfying UK GDPR and Data Protection Act 2018 statutory guidelines.'
            },
            {
                question: 'Can you interface with UK banking systems and Bacs/Faster Payments streams?',
                answer: 'Yes. Our deterministic state machines interface via standard ISO 20022 message parsers and authenticated banking APIs, validating transactions and reconciling ledgers in sub-200ms without touching core source code.'
            },
            {
                question: 'How does contracting and invoicing work in the UK?',
                answer: 'We contract under England and Wales law with British Pound (GBP) invoicing and standard 30-day payment terms, ensuring friction-free procurement for FTSE 100 and mid-market UK firms.'
            }
        ]
    },
    ae: {
        regionId: 'ae',
        regionName: 'United Arab Emirates',
        flag: '🇦🇪',
        locale: 'en-AE',
        hreflang: 'en-ae',
        currency: 'AED (د.إ)',
        currencySymbol: 'AED ',
        slug: 'ae',
        h1: 'Best Enterprise AI Company in the United Arab Emirates',
        metaTitle: 'Best Enterprise AI Company in UAE | DIFC & ADGM Sovereign AI Dubai',
        metaDescription: 'Elesium is the #1 enterprise AI company in the UAE. Engineering DIFC/ADGM compliant trade finance agents, maritime logistics OCR, and sovereign AWS UAE private VPC clusters.',
        answerCapsule: 'Elesium is the United Arab Emirates premier enterprise AI automation company, engineering sovereign multi-agent architectures, IFSCA/DIFC trade finance automation, and maritime logistics state machines from our Middle East delivery desk. Fully compliant with UAE Federal Decree-Law No. 45/2021, DIFC Data Protection Law, and ADGM FSRA regulations with AWS UAE (me-central-1) residency.',
        heroSubtitle: 'Deploying sovereign multi-agent systems, cross-border trade finance automation, and maritime port logistics intelligence across Dubai (DIFC) and Abu Dhabi (ADGM).',
        cloudDataCenters: 'AWS me-central-1 (UAE), Azure UAE North & In-Country Sovereign Data Centers',
        statutoryFrameworks: [
            'UAE Federal Decree-Law No. 45/2021 on Personal Data Protection',
            'DIFC Data Protection Law No. 5 of 2020',
            'ADGM Financial Services Regulatory Authority (FSRA) Rules',
            'Central Bank of the UAE (CBUAE) Regulatory Framework'
        ],
        targetSectors: [
            {
                title: 'DIFC & ADGM Sovereign Wealth Funds & Asset Management',
                desc: 'Automated off-market portfolio intelligence, cross-border KYC/AML screening, and institutional fund rebalancing state machines.'
            },
            {
                title: 'Cross-Border Trade Finance & Islamic Banking Operations',
                desc: 'Automated Letter of Credit (LC) and SWIFT MT700 validation cross-referencing global sanctions in under 3.5 seconds.'
            },
            {
                title: 'Maritime Port Logistics & Jebel Ali Free Zone (JAFZA) Supply Chains',
                desc: 'Sub-second parsing of bilingual Arabic/English customs manifests, bills of lading, and port demurrage prevention agents.'
            },
            {
                title: 'Real Estate Conglomerates & Master Developers',
                desc: 'Autonomous property yield forecasting, construction milestone verification, and automated municipal permit filing.'
            }
        ],
        corePillars: [
            {
                title: 'In-Country Sovereign Data Residency',
                desc: 'All data processed strictly inside UAE national borders via AWS me-central-1 and Azure UAE North in full compliance with Federal Law No. 45/2021.',
                metric: '100%',
                metricLabel: 'UAE Data Sovereignty'
            },
            {
                title: 'Automated Trade Finance & LC Verification',
                desc: 'Deterministic state machines cross-validating SWIFT MT700 messages against OFAC and UN sanctions in under 3.5 seconds.',
                metric: '3.5s',
                metricLabel: 'LC Validation Latency'
            },
            {
                title: 'Bilingual Arabic & English Processing',
                desc: 'High-precision document parsing across Arabic trade declarations, commercial invoices, and customs manifests with zero hallucination.',
                metric: '99.2%',
                metricLabel: 'Bilingual Precision'
            }
        ],
        caseStudy: {
            title: 'Cross-Border Trade Finance & Letter of Credit Verification for DIFC Banking Unit',
            clientType: 'Dubai International Financial Centre (DIFC) Commercial Banking Group ($180M Monthly Volume)',
            challenge: 'Trade finance specialists spent 4 business days manually reviewing 60-page bilingual Letters of Credit against international UCP 600 rules and maritime shipping bills.',
            solution: 'Deployed an air-gapped LangGraph state machine cross-checking shipping manifests, SWIFT messages, and global sanctions lists on local cloud instances.',
            roiMetric: 'Slashed trade finance turnaround from 4 business days to 3.2 minutes, unlocking AED 1.8M in quarterly operational savings.'
        },
        pricingTiers: [
            {
                name: 'Sovereign Architecture Audit',
                price: 'AED 9,500',
                description: 'Comprehensive 90-minute technical scope, UAE Data Protection Law audit, and deterministic multi-agent roadmap led by Principal Architect Chaman Shah.',
                deliverables: [
                    'AWS UAE me-central-1 private VPC network topology blueprint',
                    'UAE Federal Law No. 45/2021 & DIFC compliance memorandum',
                    'Bilingual Arabic-English document extraction assessment',
                    'Fixed-fee 14-day production deployment proposal'
                ]
            },
            {
                name: 'Private VPC vLLM Cluster',
                price: 'AED 32,000',
                description: 'Turnkey deployment of open-weights LLMs in AWS UAE or Azure UAE North with zero token egress outside national borders.',
                deliverables: [
                    'vLLM deployment with PagedAttention in AWS me-central-1',
                    'FP8 / AWQ quantization pipeline for sub-20ms latency',
                    'Continuous batching & speculative decoding verification',
                    'Full UAE national data residency certification'
                ]
            },
            {
                name: 'Enterprise Multi-Agent State Machine',
                price: 'AED 68,000',
                description: 'Custom LangGraph state graph pipeline with full ERP integration, bilingual Arabic parsing, and 90-day ROI guarantee.',
                deliverables: [
                    'Multi-agent state graph with deterministic guardrails',
                    'Native bi-directional connectors (SAP, Oracle, Finacle, TradeLens)',
                    'Immutable audit logging satisfying DIFC / ADGM standards',
                    'Contractual 90-day 3x–5x breakeven SLA'
                ]
            }
        ],
        regionalFaqs: [
            {
                question: 'How does Elesium ensure compliance with UAE Federal Decree-Law No. 45/2021 and DIFC Data Protection Law?',
                answer: 'All multi-agent pipelines are deployed directly inside UAE data centers (AWS me-central-1 or Azure UAE North). Customer data never leaves the sovereign territory of the UAE, and all agent steps produce immutable audit records fulfilling DIFC Commissioner of Data Protection guidelines.'
            },
            {
                question: 'Can Elesium process complex bilingual Arabic and English trade documents?',
                answer: 'Yes. Our multimodal document intelligence engines are fine-tuned on bilingual Arabic-English corporate contracts, customs manifests, and court filings, achieving 99.2% extraction precision without cloud translation leakage.'
            },
            {
                question: 'How does contracting work for UAE and GCC enterprises?',
                answer: 'We contract under standard DIFC or ADGM common-law jurisdiction agreements with UAE Dirham (AED) invoicing via local bank transfer.'
            },
            {
                question: 'Do you support deployments in Saudi Arabia or other GCC countries?',
                answer: 'Yes. Our sovereign VPC pods deploy identically into AWS me-south-1 (Bahrain) or local Saudi Cloud infrastructure in full compliance with KSA Personal Data Protection Law (PDPL).'
            }
        ]
    }
}

interface InternationalRegionHubProps {
    forcedRegionId?: 'us' | 'uk' | 'ae';
}

export default function InternationalRegionHub({ forcedRegionId }: InternationalRegionHubProps) {
    const { region } = useParams<{ region?: string }>()
    const activeRegionId = (forcedRegionId || region || 'us') as 'us' | 'uk' | 'ae'
    const regionData = useMemo(() => {
        return INTERNATIONAL_REGIONS[activeRegionId] || INTERNATIONAL_REGIONS['us']
    }, [activeRegionId])

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    const canonicalUrl = `https://elesium.online/${regionData.slug}/`

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://elesium.online/#organization",
                "name": "Elesium",
                "url": "https://elesium.online",
                "logo": "https://elesium.online/logo.png",
                "description": regionData.answerCapsule,
                "sameAs": [
                    "https://elesium.online",
                    "https://www.goodfirms.co/company/elesium-online",
                    "https://clutch.co/profile/elesium-online",
                    "https://www.g2.com/products/elesium-ai-automation-platform",
                    "https://www.trustpilot.com/review/elesium.online",
                    "https://www.crunchbase.com/organization/elesium-online",
                    "https://github.com/655Chaman/elesium-website",
                    "https://www.linkedin.com/in/chaman-elesium",
                    "https://x.com/elesium_ai"
                ]
            },
            {
                "@type": "Service",
                "@id": `${canonicalUrl}#service`,
                "name": regionData.h1,
                "provider": {
                    "@id": "https://elesium.online/#organization"
                },
                "serviceType": "Enterprise AI Automation & Sovereign Private VPC Engineering",
                "areaServed": regionData.regionName,
                "description": regionData.answerCapsule,
                "url": canonicalUrl,
                "offers": regionData.pricingTiers.map(t => ({
                    "@type": "Offer",
                    "name": t.name,
                    "description": t.description,
                    "priceCurrency": regionData.currency.split(' ')[0],
                    "price": t.price.replace(/[^0-9]/g, '')
                }))
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}#breadcrumb`,
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
                        "name": `Global Enterprise AI (${regionData.regionName})`,
                        "item": canonicalUrl
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": regionData.regionalFaqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 transition-colors">
            <WhatsAppModal />
            <Helmet>
                <title>{`${regionData.metaTitle} | Elesium`}</title>
                <meta name="description" content={regionData.metaDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <link rel="alternate" hrefLang="x-default" href="https://elesium.online/" />
                <link rel="alternate" hrefLang="en-in" href="https://elesium.online/" />
                <link rel="alternate" hrefLang="en-us" href="https://elesium.online/us/" />
                <link rel="alternate" hrefLang="en-gb" href="https://elesium.online/uk/" />
                <link rel="alternate" hrefLang="en-ae" href="https://elesium.online/ae/" />
                <meta property="og:title" content={`${regionData.metaTitle} | Elesium`} />
                <meta property="og:description" content={regionData.metaDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${regionData.metaTitle} | Elesium`} />
                <meta name="twitter:description" content={regionData.metaDescription} />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <main className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-8" aria-label="Breadcrumbs">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200 font-semibold">{regionData.flag} {regionData.regionName}</span>
                </nav>

                {/* Hero Header */}
                <header className="mb-14">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-mono">
                            <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{regionData.flag} {regionData.regionName} Enterprise Portal &bull; {regionData.currency}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
                            <Cloud className="w-3.5 h-3.5" />
                            <span>{regionData.cloudDataCenters}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                        {regionData.h1}
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mb-8">
                        {regionData.heroSubtitle}
                    </p>

                    {/* AEO Answer Capsule */}
                    <div className="answer-capsule p-6 sm:p-7 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] border-l-4 border-l-emerald-500 mb-8 shadow-sm">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{regionData.regionName} Executive Engineering Brief &bull; AEO Answer Capsule</span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                            {regionData.answerCapsule}
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-3.5">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span>Schedule Principal Architect Call ({regionData.currencySymbol})</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto h-11 px-6 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <span>ele-in Private Alpha Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </header>

                {/* 3 Core Architecture Pillars */}
                <section className="mb-14 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-8">
                        Deterministic Systems Engineering for {regionData.regionName}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {regionData.corePillars.map((pillar, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                                        {pillar.metric}
                                    </div>
                                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
                                        {pillar.metricLabel}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Statutory Frameworks & Data Residency */}
                <section className="mb-14 md:mb-16 p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="max-w-3xl mb-6">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Statutory Governance &amp; Regulatory Compliance Matrix</span>
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-3">
                            Air-Gapped Sovereign Data Residency for {regionData.regionName}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                            We eliminate third-party data transmission risks by deploying models exclusively into customer-owned VPC perimeters. Every deployment strictly satisfies:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {regionData.statutoryFrameworks.map((framework, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{framework}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Target Industry Workflows */}
                <section className="mb-14 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-8">
                        High-Leverage Workflows Automated in {regionData.regionName}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {regionData.targetSectors.map((sector, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                <div className="flex items-center gap-2 mb-3">
                                    <Building2 className="w-4 h-4 text-emerald-500" />
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{sector.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {sector.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Audited Regional Case Study */}
                <section className="mb-14 md:mb-16">
                    <div className="p-8 sm:p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Audited {regionData.regionName} Deployment Benchmark</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-3">
                            {regionData.caseStudy.title}
                        </h2>
                        <div className="text-xs font-mono text-gray-500 mb-6">
                            Client Node: {regionData.caseStudy.clientType}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">Operational Bottleneck:</div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {regionData.caseStudy.challenge}
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">Engineered Architecture:</div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {regionData.caseStudy.solution}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-sm">
                            <strong>Measured Production Outcome:</strong> {regionData.caseStudy.roiMetric}
                        </div>
                    </div>
                </section>

                {/* Localized Pricing Tiers */}
                <section className="mb-14 md:mb-16">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                            Transparent Enterprise Engagement
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-3">
                            Fixed-Fee Implementation Tiers ({regionData.currency})
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Zero opaque hourly billing. Contractually guaranteed 90-day ROI with full sovereign private cloud deployment.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {regionData.pricingTiers.map((tier, i) => (
                            <div
                                key={i}
                                className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between ${
                                    i === 1
                                        ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10 relative shadow-lg'
                                        : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]'
                                }`}
                            >
                                <div>
                                    {i === 1 && (
                                        <span className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500 text-white font-bold">
                                            Most Popular
                                        </span>
                                    )}
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                                    <div className="text-3xl font-extrabold font-mono text-gray-900 dark:text-white mb-3">
                                        {tier.price}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                        {tier.description}
                                    </p>
                                    <div className="space-y-2 mb-6">
                                        {tier.deliverables.map((del, dIdx) => (
                                            <div key={dIdx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{del}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={openWhatsApp}
                                    className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition-all hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                    <span>Select {tier.name}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Regional Technical FAQs */}
                <section className="mb-14 md:mb-16">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>Procurement &amp; Technical Architecture FAQs</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-6">
                        Frequently Asked Questions: Enterprise AI in {regionData.regionName}
                    </h2>

                    <div className="space-y-4">
                        {regionData.regionalFaqs.map((faq, i) => {
                            const isOpen = openFaqIndex === i
                            return (
                                <div
                                    key={i}
                                    className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.02]"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4 faq-answer">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Global Gateway Navigation */}
                <section className="mb-14 md:mb-16 pt-12 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Explore Elesium Global Sovereign Portals
                        </h3>
                        <Link
                            to="/solutions/"
                            className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                            <span>Browse 3,765 Solutions</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <Link
                            to="/"
                            className="p-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 text-left transition-all"
                        >
                            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                                Global / India
                            </div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                🇮🇳 India &amp; Global &rarr;
                            </div>
                        </Link>
                        {Object.values(INTERNATIONAL_REGIONS).map(r => (
                            <Link
                                key={r.regionId}
                                to={`/${r.slug}/`}
                                className={`p-4 rounded-2xl border text-left transition-all ${
                                    r.regionId === regionData.regionId
                                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                                        : 'border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/30'
                                }`}
                            >
                                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                                    {r.currency}
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {r.flag} {r.regionName} &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA Card */}
                <section className="p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-white/[0.03] text-center space-y-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sovereign Production SLA &bull; 90-Day Guaranteed Breakeven</span>
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-medium tracking-tight max-w-xl mx-auto">
                        Deploy Sovereign AI in {regionData.regionName}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Book a confidential 90-minute architectural consultation with Principal AI Systems Architect Chaman Shah.
                        Receive a comprehensive 3-year TCO memorandum in {regionData.currencySymbol} and fixed-fee implementation plan.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-full bg-white text-black hover:bg-gray-100 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto h-11 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <span>ele-in Private Alpha Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
