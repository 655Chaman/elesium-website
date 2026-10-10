#!/usr/bin/env python3
"""
generate_ssg.py

Runs AFTER vite build.
Reads dist/index.html and src/data/blogPosts.ts.
For each blog post, it generates a physical dist/signals/<slug>/index.html file.
This completely solves the GitHub Pages 404 indexing issue for crawlers.
"""

import os
import re
import json
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DIST_DIR = BASE_DIR / "frontend" / "dist"
DIST_INDEX = DIST_DIR / "index.html"
TS_PATH = BASE_DIR / "frontend" / "src" / "data" / "blogPosts.ts"

def extract_posts(ts_content):
    """
    Extracts basic SEO metadata from the TypeScript file using regex.
    We look for the pattern block:
    slug: '...',
    title: '...',
    metaDescription: '...',
    jsonLdSchema: `...`
    """
    posts = []
    
    # We use regex to find each block that contains a slug
    # This is a simple parser, assuming standard formatting by our generator
    
    # Split by "slug:" to chunk the file
    chunks = ts_content.split("slug:")[1:]
    
    for chunk in chunks:
        post = {}
        
        # Extract slug
        slug_match = re.search(r"^\s*'([^']+)'", chunk)
        if not slug_match:
            slug_match = re.search(r"^\s*\"([^\"]+)\"", chunk)
        if slug_match:
            post["slug"] = slug_match.group(1)
        else:
            continue
            
        # Extract title
        title_match = re.search(r"title:\s*'((?:\\'|[^'])*)'", chunk)
        if not title_match:
            title_match = re.search(r"title:\s*\"((?:\\\"|[^\"])*)\"", chunk)
        if title_match:
            post["title"] = title_match.group(1).replace("\\'", "'").replace('\\"', '"').replace("**", "")
        
        # Extract metaDescription
        meta_match = re.search(r"metaDescription:\s*'((?:\\'|[^'])*)'", chunk)
        if not meta_match:
            meta_match = re.search(r"metaDescription:\s*\"((?:\\\"|[^\"])*)\"", chunk)
        if meta_match:
            post["metaDescription"] = meta_match.group(1).replace("\\'", "'").replace('\\"', '"')
            
        # Extract jsonLdSchema
        jsonld_match = re.search(r"jsonLdSchema:\s*`([\s\S]*?)`", chunk)
        if jsonld_match:
            post["jsonLdSchema"] = jsonld_match.group(1)
            
        if "slug" in post and "title" in post:
            posts.append(post)
            
    return posts

def generate_ssg():
    if not DIST_INDEX.exists():
        print(f"Error: {DIST_INDEX} not found. Must run after vite build.")
        return
        
    if not TS_PATH.exists():
        print(f"Error: {TS_PATH} not found.")
        return
        
    ts_content = TS_PATH.read_text(encoding="utf-8")
    posts = extract_posts(ts_content)
    
    base_html = DIST_INDEX.read_text(encoding="utf-8")
    
    print(f"Starting SSG Generation for {len(posts)} posts...")
    
    for post in posts:
        slug = post["slug"]
        title = post.get("title", "Market Signals | Elesium")
        desc = post.get("metaDescription", "")
        json_ld = post.get("jsonLdSchema", "")
        
        # Create output directory
        out_dir = DIST_DIR / "signals" / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "index.html"
        
        # Modify HTML
        html = base_html
        
        # Replace Title
        html = re.sub(r"<title>.*?</title>", f"<title>{title} | Elesium</title>", html)
        
        # Replace Description
        html = re.sub(r'<meta name="description" content="[^"]*">', 
                      f'<meta name="description" content="{desc}">', html)
                      
        # Replace Canonical
        html = re.sub(r'<link rel="canonical" href="[^"]*">', 
                      f'<link rel="canonical" href="https://elesium.online/signals/{slug}">', html)
                      
        # Replace OG Title
        html = re.sub(r'<meta property="og:title" content="[^"]*">', 
                      f'<meta property="og:title" content="{title}">', html)
                      
        # Replace OG Description
        html = re.sub(r'<meta property="og:description" content="[^"]*">', 
                      f'<meta property="og:description" content="{desc}">', html)
                      
        # Replace OG URL
        html = re.sub(r'<meta property="og:url" content="[^"]*">', 
                      f'<meta property="og:url" content="https://elesium.online/signals/{slug}">', html)
                      
        # Replace Twitter Title
        html = re.sub(r'<meta name="twitter:title" content="[^"]*">', 
                      f'<meta name="twitter:title" content="{title}">', html)
                      
        # Replace Twitter Description
        html = re.sub(r'<meta name="twitter:description" content="[^"]*">', 
                      f'<meta name="twitter:description" content="{desc}">', html)
                      
        # Change og:type to article
        html = html.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">')
        
        # Inject JSON-LD right before </head>
        if json_ld:
            # Also inject breadcrumb
            breadcrumb = f"""{{
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://elesium.online"
                }},{{
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Market Signals",
                    "item": "https://elesium.online/signals"
                }},{{
                    "@type": "ListItem",
                    "position": 3,
                    "name": "{title}",
                    "item": "https://elesium.online/signals/{slug}"
                }}]
            }}"""
            
            injection = f"""
            <script type="application/ld+json">{breadcrumb}</script>
            <script type="application/ld+json">{json_ld}</script>
            </head>"""
            
            html = html.replace("</head>", injection)
            
        out_file.write_text(html, encoding="utf-8")
        print(f"Generated SSG for: /signals/{slug}")

    print("✅ SSG complete for signals.")

    print("Starting SSG Generation for static pages...")
    static_pages = {
        "ai-automation": {
            "title": "AI Automation Agency India",
            "desc": "Elesium builds custom AI automation workflows for Indian enterprises. From agentic AI to LLM integration — we automate what slows you down."
        },
        "how-we-work": {
            "title": "How Our AI Automation Works",
            "desc": "Elesium's proven 4-step AI implementation process delivers automation ROI in 90 days. See how India's top AI agency operates."
        },
        "markets": {
            "title": "AI Automation for Every Industry",
            "desc": "Elesium delivers AI automation across BFSI, Healthcare, SaaS, Manufacturing and more. India's trusted AI partner for enterprise automation."
        },
        "resources": {
            "title": "AI Automation Resources & Guides",
            "desc": "Free AI automation playbooks, case studies and implementation guides from Elesium — India's leading AI automation agency."
        },
        "ai-automation-agency-india": {
            "title": "AI Automation Agency India",
            "desc": "Elesium builds custom AI automation workflows for Indian enterprises. From agentic AI to LLM integration — we automate what slows you down."
        }
    }
    
    for route, meta in static_pages.items():
        title = meta["title"]
        desc = meta["desc"]
        
        out_dir = DIST_DIR / route
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / "index.html"
        
        html = base_html
        
        html = re.sub(r"<title>.*?</title>", f"<title>{title} | Elesium</title>", html)
        html = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', html)
        html = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="https://elesium.online/{route}">', html)
        html = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{title} | Elesium">', html)
        html = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{desc}">', html)
        html = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="https://elesium.online/{route}">', html)
        html = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{title} | Elesium">', html)
        html = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{desc}">', html)
        
        if route == "ai-automation-agency-india":
            service_schema = {
                "@context": "https://schema.org",
                "@type": "Service",
                "name": "Enterprise AI Automation Services",
                "serviceType": "AI Automation Agency",
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "Elesium - Enterprise AI Automation Agency India",
                    "url": "https://elesium.online",
                    "telephone": "+91-8317329312",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Koramangala 4th Block",
                        "addressLocality": "Bangalore",
                        "addressRegion": "Karnataka",
                        "postalCode": "560034",
                        "addressCountry": "IN"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 12.9352,
                        "longitude": 77.6245
                    },
                    "hasMap": "https://www.google.com/maps/place/Koramangala,+Bengaluru,+Karnataka",
                    "sameAs": [
                        "https://elesium.online",
                        "https://github.com/elesium-ai",
                        "https://www.linkedin.com/company/elesium",
                        "https://x.com/elesium_ai",
                        "https://ipfs.io/ipfs/Qma8a78232d60a0b7445f34cee63b4eb2bfe20d450346e",
                        "https://www.wikidata.org/wiki/Q11660"
                    ]
                },
                "areaServed": {
                    "@type": "Country",
                    "name": "India"
                },
                "description": "The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate.",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Enterprise AI Automation Investment Tiers",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "name": "Pilot Architecture Sprint",
                            "description": "Single-Process Deterministic Agent, Private Cloud Staging Deployment, FastAPI + LangGraph Architecture, 14-Day Delivery Guarantee.",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "minPrice": "150000",
                                "maxPrice": "350000",
                                "priceCurrency": "INR"
                            }
                        },
                        {
                            "@type": "Offer",
                            "name": "Enterprise Multi-Agent Suite",
                            "description": "Multi-Agent Collaborative Triad (LangGraph), Private VPC / Zero-Data-Retention Deployment, Deep Legacy ERP/SAP & SQL Integration, 99.9% Production SLA & 90-Day ROI Guarantee.",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "minPrice": "600000",
                                "maxPrice": "1500000",
                                "priceCurrency": "INR"
                            }
                        },
                        {
                            "@type": "Offer",
                            "name": "Autonomous Engineering Pod",
                            "description": "3 Dedicated AI Systems Engineers + Architect, Continuous Fine-Tuning & Vector Optimization, Omnichannel Voice + WhatsApp Systems, 1-Hour Critical Incident Response SLA.",
                            "priceSpecification": {
                                "@type": "PriceSpecification",
                                "price": "450000",
                                "priceCurrency": "INR",
                                "unitText": "MONTH"
                            }
                        }
                    ]
                }
            }
            crawler_noscript = """
    <noscript>
        <section id="static-pricing-content">
            <h2>Enterprise AI Automation Pricing in India</h2>
            <p>The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate.</p>
            <ul>
                <li><strong>Tier 1: Pilot Architecture Sprint:</strong> ₹1,50,000 – ₹3,50,000 ($2,000 – $4,500 USD) • 14-Day Delivery</li>
                <li><strong>Tier 2: Enterprise Multi-Agent Suite:</strong> ₹6,00,000 – ₹15,00,000 ($7,500 – $18,000 USD) • 30–45 Days</li>
                <li><strong>Tier 3: Autonomous AI Engineering Pod:</strong> ₹4,50,000 / month ($5,500 / month USD) • 12-Month Retainer</li>
            </ul>
        </section>
    </noscript>
"""
            schema_json = json.dumps(service_schema, ensure_ascii=False)
            html = html.replace("</head>", f'<script type="application/ld+json">{schema_json}</script>\n</head>')
            html = html.replace("</body>", f'{crawler_noscript}\n</body>')
        
        out_file.write_text(html, encoding="utf-8")
        print(f"Generated SSG for: /{route}")
        
    print("✅ SSG complete. GitHub Pages will now serve 200 OK for all required routes.")

if __name__ == "__main__":
    generate_ssg()
