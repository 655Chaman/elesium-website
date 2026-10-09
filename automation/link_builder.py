import os
import re
import json
import argparse
import requests
import datetime
from pathlib import Path

BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AUTOMATION_DIR = BASE_DIR / "automation"
SYNDICATIONS_DIR = AUTOMATION_DIR / "syndications"
SOCIAL_DRAFTS_DIR = AUTOMATION_DIR / "social_drafts"
LOG_FILE = AUTOMATION_DIR / "link_distribution_log.json"
ENV_FILE = AUTOMATION_DIR / ".env"

def setup():
    SYNDICATIONS_DIR.mkdir(parents=True, exist_ok=True)
    SOCIAL_DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

def load_env():
    env_vars = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r") as f:
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    env_vars[key] = val
    return env_vars

def generate_social_drafts(slug, title, url):
    draft_file = SOCIAL_DRAFTS_DIR / f"{slug}.md"
    content = f"""# Social Distribution Drafts for {title}

## LinkedIn Executive Post
[Hook] {title} is changing the game.

[Problem] The industry has been struggling with this for years.

[Architecture Breakdown] Here's how it works under the hood:
- Component 1
- Component 2

[Enterprise ROI Numbers] 
- 50% cost reduction
- 3x speed improvement

[Call-to-Action] Read the full architectural breakdown and signal at Elesium: {url}

---

## X (Twitter) 6-Part Thread
1/6 🧵 {title} is finally here. We've been analyzing the core technical insights. Here is what you need to know. 👇

2/6 The main challenge was scaling the data pipeline without breaking the bank.

3/6 By optimizing the architecture, we bypassed the usual bottlenecks. 

4/6 Enterprise ROI? Massive. We are seeing up to 50% cost reductions across the board.

5/6 The secret sauce lies in the integration strategy and the tech stack alignment.

6/6 Dive deep into the full architecture and technical breakdown. Read the complete signal at Elesium here: {url}
"""
    with open(draft_file, "w") as f:
        f.write(content)

def handle_devto_syndication(slug, title, url, env_vars):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    devto_key = env_vars.get("DEVTO_API_KEY") or os.environ.get("DEVTO_API_KEY")
    
    payload = {
        "article": {
            "title": title,
            "body_markdown": f"Read the full study at [{title}]({url}).",
            "published": True,
            "tags": ["tech", "architecture", "engineering"],
            "canonical_url": url
        }
    }
    
    if devto_key:
        print(f"Publishing to Dev.to for {slug}...")
        headers = {
            "Content-Type": "application/json",
            "api-key": devto_key
        }
        try:
            res = requests.post("https://dev.to/api/articles", json=payload, headers=headers)
            res.raise_for_status()
            print("Successfully published to Dev.to")
        except Exception as e:
            print(f"Failed to publish to Dev.to: {e}")
    else:
        print(f"No DEVTO_API_KEY found. Generating payload file.")
        payload_file = slug_dir / "dev_to_payload.json"
        
        output_data = {
            "curl_command": "curl -X POST -H 'Content-Type: application/json' -H 'api-key: YOUR_API_KEY' -d @dev_to_payload.json https://dev.to/api/articles",
            "payload": payload
        }
        with open(payload_file, "w") as f:
            json.dump(output_data, f, indent=4)

def handle_hashnode_syndication(slug, title, url):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    payload_file = slug_dir / "hashnode_payload.json"
    mutation = '''
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          title
          url
        }
      }
    }
    '''
    
    variables = {
        "input": {
            "title": title,
            "contentMarkdown": f"Read the full study at [{title}]({url}).",
            "tags": [],
            "isRepublished": True,
            "originalArticleURL": url
        }
    }
    
    with open(payload_file, "w") as f:
        json.dump({"query": mutation, "variables": variables}, f, indent=4)

def ping_search_engines(url):
    print(f"Pinging search engines for {url}...")
    
    sitemap_url = "https://elesium.online/sitemap.xml"
    try:
        requests.get(f"https://www.google.com/ping?sitemap={sitemap_url}", timeout=5)
    except Exception as e:
        print(f"Google ping failed: {e}")
        
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

def get_latest_post_from_codebase():
    ts_path = Path(__file__).resolve().parent.parent / "frontend" / "src" / "data" / "blogPosts.ts"
    if not ts_path.exists():
        return {"slug": "ai-automation-agency-india", "title": "Top AI Automation Agency in India", "excerpt": ""}
    
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slug_match = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", content)
    title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", content)
    excerpt_match = re.search(r"excerpt:\s*['\"`]([^'\"`]+)['\"`]", content)
    
    slug = slug_match.group(1) if slug_match else "ai-automation-agency-india"
    title = title_match.group(1) if title_match else "Enterprise AI Automation in India"
    excerpt = excerpt_match.group(1) if excerpt_match else ""
    return {"slug": slug, "title": title, "excerpt": excerpt}

def process_post(slug: str, title: str, excerpt: str = ""):
    setup()
    env_vars = load_env()
    url = f"https://elesium.online/signals/{slug}"
    
    handle_devto_syndication(slug, title, url, env_vars)
    handle_hashnode_syndication(slug, title, url)
    generate_social_drafts(slug, title, url)
    ping_search_engines(url)
    update_log(slug, title, url)
    print(f"Successfully processed syndications and pings for {slug} ('{title}')")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--latest", action="store_true", help="Process the latest post from blogPosts.ts")
    parser.add_argument("--slug", type=str, help="Process a specific slug")
    parser.add_argument("--title", type=str, help="Title of the post", default="")
    parser.add_argument("--excerpt", type=str, help="Excerpt of the post", default="")
    args = parser.parse_args()

    if args.latest:
        post = get_latest_post_from_codebase()
        slug = post["slug"]
        title = post["title"]
        excerpt = post["excerpt"]
    elif args.slug:
        slug = args.slug
        title = args.title or slug.replace("-", " ").title()
        excerpt = args.excerpt or ""
    else:
        print("Please specify --latest or --slug")
        return

    process_post(slug, title, excerpt)

if __name__ == "__main__":
    main()
