import os
import json
import argparse
import requests
import datetime
from pathlib import Path

BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SYNDICATIONS_DIR = BASE_DIR / "automation" / "syndications"
LOG_FILE = BASE_DIR / "automation" / "link_distribution_log.json"

def setup():
    SYNDICATIONS_DIR.mkdir(parents=True, exist_ok=True)
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

def generate_syndication_files(slug, title, url):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    # Dev.to
    dev_to = f"""---
title: {title}
published: false
canonical_url: {url}
---

# {title}

Read the full study at [{title}]({url}).
"""
    with open(slug_dir / "dev_to_article.md", "w") as f:
        f.write(dev_to)

    # Hashnode
    hashnode = f"""---
title: {title}
slug: {slug}
canonical_url: {url}
---

# {title}

Read the full study at [{title}]({url}).
"""
    with open(slug_dir / "hashnode_article.md", "w") as f:
        f.write(hashnode)

    # Medium
    medium = f"""# {title}

Read the full study at [{title}]({url}).
"""
    with open(slug_dir / "medium_article.md", "w") as f:
        f.write(medium)

    # LinkedIn
    linkedin = f"""# {title}

Executive Summary:
[Insert executive summary here]

Read the full study at [{title}]({url}).
"""
    with open(slug_dir / "linkedin_article.md", "w") as f:
        f.write(linkedin)

def generate_outreach_pitch(slug, title, url):
    slug_dir = SYNDICATIONS_DIR / slug
    pitch = f"""# Outreach Pitch for {title}

## Contextual Excerpt (250-350 words)
[Insert 250-350 word plain-text contextual excerpt here]

## Email Templates

### Template 1 (YourStory / Inc42)
Hi [Editor Name],
Loved your recent piece on [Topic]. I recently published a deep dive on {title} that might interest your readers: {url}.

### Template 2 (Analytics India Magazine)
Hi [Editor Name],
As a regular reader of AIM, I thought your audience would appreciate this new study: {title} ({url}).

### Template 3 (TechInAsia)
Hi [Editor Name],
We just published an extensive piece on {title} covering the Asian tech ecosystem. Read more: {url}.

## Anchor Text Recommendations
- [{title}]({url})
"""
    with open(slug_dir / "outreach_pitch.md", "w") as f:
        f.write(pitch)

def ping_search_engines(url):
    print(f"Pinging search engines for {url}...")
    try:
        requests.get(f"https://www.google.com/ping?sitemap={url}", timeout=5)
    except Exception as e:
        print(f"Google ping failed: {e}")
        
    try:
        requests.get(f"https://www.bing.com/ping?sitemap={url}", timeout=5)
    except Exception as e:
        print(f"Bing ping failed: {e}")
        
    # IndexNow
    try:
        indexnow_data = {
            "host": "elesium.online",
            "key": "your_indexnow_key", 
            "keyLocation": "https://elesium.online/your_indexnow_key.txt",
            "urlList": [url]
        }
        requests.post("https://api.indexnow.org/indexnow", json=indexnow_data, timeout=5)
    except Exception as e:
        print(f"IndexNow ping failed: {e}")

def update_log(slug, title, url):
    try:
        with open(LOG_FILE, "r") as f:
            log_data = json.load(f)
    except json.JSONDecodeError:
        log_data = []
    
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "slug": slug,
        "title": title,
        "url": url,
        "status": "generated"
    }
    log_data.append(log_entry)
    
    with open(LOG_FILE, "w") as f:
        json.dump(log_data, f, indent=4)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--latest", action="store_true", help="Process the latest post")
    parser.add_argument("--slug", type=str, help="Process a specific slug")
    parser.add_argument("--title", type=str, help="Title of the post", default="Auto-generated Post Title")
    args = parser.parse_args()

    setup()

    if args.latest:
        slug = "latest-post"
        title = "Latest Auto-generated Post Title"
    elif args.slug:
        slug = args.slug
        title = args.title
    else:
        print("Please specify --latest or --slug")
        return

    url = f"https://elesium.online/signals/{slug}"
    
    generate_syndication_files(slug, title, url)
    generate_outreach_pitch(slug, title, url)
    ping_search_engines(url)
    update_log(slug, title, url)

    print(f"Successfully processed syndications and pings for {slug}")

if __name__ == "__main__":
    main()
