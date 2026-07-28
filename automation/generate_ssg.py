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
DIST_DIR = BASE_DIR / "dist"
DIST_INDEX = DIST_DIR / "index.html"
TS_PATH = BASE_DIR / "src" / "data" / "blogPosts.ts"

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

    print("✅ SSG complete. GitHub Pages will now serve 200 OK for all signals routes.")

if __name__ == "__main__":
    generate_ssg()
