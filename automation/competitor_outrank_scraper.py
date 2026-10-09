import os
import json
import logging
import argparse
import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
from urllib.parse import urlparse
import time
import re

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEYWORDS_FILE = os.path.join(BASE_DIR, "automation", "keywords_queue.json")
BLOG_POSTS_FILE = os.path.join(BASE_DIR, "frontend", "src", "data", "blogPosts.ts")

COMPETITOR_SITEMAPS = [
    "https://nimapinfotech.com/sitemap_index.xml",
    "https://marutitech.com/sitemap_index.xml",
    "https://www.invensis.net/sitemap.xml",
]

def load_json(filepath, default_val=None):
    if not os.path.exists(filepath):
        return default_val if default_val is not None else []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading {filepath}: {e}")
        return default_val if default_val is not None else []

def save_json(filepath, data):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        logger.error(f"Error saving {filepath}: {e}")

def get_existing_topics():
    existing = set()
    
    # Load from keywords queue
    keywords = load_json(KEYWORDS_FILE, [])
    for kw in keywords:
        if isinstance(kw, dict) and 'keyword' in kw:
            existing.add(kw['keyword'].lower())
        elif isinstance(kw, str):
            existing.add(kw.lower())

    # Try to extract from blogPosts.ts
    if os.path.exists(BLOG_POSTS_FILE):
        try:
            with open(BLOG_POSTS_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
                # Extremely basic extraction
                titles = re.findall(r"title:\s*['\"]([^'\"]+)['\"]", content)
                for t in titles:
                    existing.add(t.lower())
        except Exception as e:
            logger.error(f"Error reading {BLOG_POSTS_FILE}: {e}")
            
    return existing

def fetch_sitemap_urls(sitemap_url, max_urls=50):
    urls = []
    try:
        response = requests.get(sitemap_url, timeout=15)
        response.raise_for_status()
        
        # Determine if it's an index or standard sitemap
        root = ET.fromstring(response.content)
        # XML parsing can be tricky with namespaces, so let's strip them
        # or use a generic search
        
        # Try finding loc elements regardless of namespace
        for elem in root.iter():
            if 'loc' in elem.tag:
                url = elem.text
                if url:
                    if url.endswith('.xml') and url != sitemap_url:
                        # It's an index, fetch sub sitemaps
                        if len(urls) < max_urls:
                            urls.extend(fetch_sitemap_urls(url, max_urls=20))
                    elif '/blog/' in url or '/insights/' in url:
                        urls.append(url)
                    if len(urls) >= max_urls:
                        break
    except Exception as e:
        logger.warning(f"Could not fetch or parse sitemap {sitemap_url}: {e}")
    return urls[:max_urls]

def extract_topic_from_url(url):
    # Basic heuristic: get last path segment, replace dashes with spaces
    path = urlparse(url).path
    segments = [s for s in path.split('/') if s]
    if not segments:
        return ""
    last_segment = segments[-1].replace('-', ' ').replace('.html', '')
    return last_segment

def elevate_topic_to_enterprise_keyword(topic):
    """
    Transforms a basic competitor topic into a high-intent enterprise keyword for Elesium.
    Example: 'what is langchain' -> 'LangGraph vs Custom Agent Architecture for Indian Enterprise'
    """
    topic_lower = topic.lower()
    if 'langchain' in topic_lower or 'llm' in topic_lower or 'ai' in topic_lower:
        base = topic.title()
        return f"{base} vs Custom Agent Architecture for Indian Enterprise: 2026 Production Benchmark"
    elif 'automation' in topic_lower:
        return f"Enterprise Workflow Automation with AI in India: Overcoming Integration Challenges"
    else:
        # Generic enhancement
        return f"Enterprise {topic.title()} Solutions for Indian IT Leaders: 2026 Guide"

def run_scraper():
    logger.info("Starting competitor outrank scraper...")
    existing_topics = get_existing_topics()
    new_keywords_added = 0
    
    keywords_queue = load_json(KEYWORDS_FILE, [])
    
    for sitemap in COMPETITOR_SITEMAPS:
        logger.info(f"Processing sitemap: {sitemap}")
        urls = fetch_sitemap_urls(sitemap, max_urls=15)
        
        for url in urls:
            topic = extract_topic_from_url(url)
            if not topic or len(topic) < 5:
                continue
                
            # Basic gap check
            topic_words = set(topic.lower().split())
            is_covered = any(
                len(topic_words.intersection(set(ext.split()))) >= 2 
                for ext in existing_topics
            )
            
            if not is_covered:
                elevated_keyword = elevate_topic_to_enterprise_keyword(topic)
                
                # Check if we already added this elevated keyword
                if elevated_keyword.lower() not in [k.get('keyword', '').lower() if isinstance(k, dict) else (k.lower() if isinstance(k, str) else '') for k in keywords_queue]:
                    new_entry = {
                        "keyword": elevated_keyword,
                        "status": "PENDING",
                        "source": "COMPETITOR_OUTRANK",
                        "original_competitor_url": url,
                        "added_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
                    }
                    keywords_queue.append(new_entry)
                    existing_topics.add(elevated_keyword.lower())
                    new_keywords_added += 1
                    logger.info(f"Added new gap keyword: {elevated_keyword}")

    if new_keywords_added > 0:
        save_json(KEYWORDS_FILE, keywords_queue)
        logger.info(f"Successfully added {new_keywords_added} new keywords to {KEYWORDS_FILE}")
    else:
        logger.info("No new content gaps found.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Competitor Outrank Scraper")
    parser.add_argument("--run", action="store_true", help="Run the scraper")
    args = parser.parse_args()
    
    if args.run:
        run_scraper()
    else:
        logger.info("Use --run to execute the scraper. Imported functions are also available.")
