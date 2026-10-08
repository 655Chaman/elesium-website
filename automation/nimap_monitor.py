import os
import re
import json
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import atexit
import datetime
import traceback
import sys

run_status = {
    "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "success": False,
    "posts_found": 0,
    "error_message": None
}

def save_status():
    status_path = os.path.join(os.path.dirname(__file__), "last_run_status.json")
    with open(status_path, "w", encoding="utf-8") as f:
        json.dump(run_status, f, indent=2)

atexit.register(save_status)

# Load local environment variables if available
load_dotenv()
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not NVIDIA_API_KEY and not GEMINI_API_KEY:
    msg = "Neither NVIDIA_API_KEY nor GEMINI_API_KEY was found in environment."
    print(f"❌ Error: {msg}")
    run_status["error_message"] = msg
    exit(1)

BLOG_URL = "https://nimapinfotech.com/blog/"
POSTS_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "blogPosts.ts")

# 1. Fetch Nimap blogs list
print(f"📡 Fetching latest articles from {BLOG_URL} ...")
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

try:
    response = requests.get(BLOG_URL, headers=headers, timeout=20)
    if response.status_code != 200:
        msg = f"Failed to fetch Nimap blogs. Status: {response.status_code}"
        print(f"⚠️ {msg}")
        run_status["error_message"] = msg
        exit(0)
except Exception as e:
    msg = f"Network error while fetching blog list: {e}"
    print(f"⚠️ {msg}")
    run_status["error_message"] = msg
    exit(0)

soup = BeautifulSoup(response.text, 'html.parser')

# Find article links
links = soup.find_all('a', href=True)
post_links = []
for a in links:
    href = a['href']
    if '/blog/' in href and href != BLOG_URL and href != 'https://nimapinfotech.com/blog':
        if not any(skip in href for skip in ['/category/', '/author/', '/page/', '#', '/tag/']):
            if href not in post_links:
                post_links.append(href)

if not post_links:
    print("ℹ️ No blog post links found on page.")
    run_status["success"] = True
    exit(0)

latest_post_url = post_links[0]
print(f"🎯 Latest post URL found: {latest_post_url}")
raw_slug = latest_post_url.strip('/').split('/')[-1]

# 2. Check if we already have this post in blogPosts.ts
try:
    with open(POSTS_FILE_PATH, 'r', encoding='utf-8') as f:
        posts_content = f.read()
except FileNotFoundError:
    msg = f"Could not find {POSTS_FILE_PATH}"
    print(f"❌ {msg}")
    run_status["error_message"] = msg
    exit(1)

# Check if slug exists
existing_slugs = re.findall(r"slug:\s*'([^']+)'", posts_content)
if any(raw_slug in s for s in existing_slugs):
    print(f"✅ Post with slug base '{raw_slug}' already exists in blogPosts.ts. No new post to import.")
    run_status["success"] = True
    exit(0)

# Extract highest ID
id_matches = re.findall(r'id:\s*(\d+)', posts_content)
highest_id = max([int(i) for i in id_matches]) if id_matches else 0
new_id = highest_id + 1
new_slug = f"{raw_slug}-{new_id}"

# Select 2 internal links for SEO link building
recent_slugs = existing_slugs[:2] if len(existing_slugs) >= 2 else []

# 3. Fetch the actual blog post content
print(f"📥 Fetching article content from {latest_post_url} ...")
try:
    post_response = requests.get(latest_post_url, headers=headers, timeout=25)
    if post_response.status_code != 200:
        msg = f"Failed to fetch post content. Status: {post_response.status_code}"
        print(f"⚠️ {msg}")
        run_status["error_message"] = msg
        exit(0)
except Exception as e:
    msg = f"Network error while fetching post content: {e}"
    print(f"⚠️ {msg}")
    run_status["error_message"] = msg
    exit(0)

post_soup = BeautifulSoup(post_response.text, 'html.parser')
title = post_soup.title.string.strip() if post_soup.title else raw_slug.replace('-', ' ').title()
title = title.split('|')[0].split('-')[0].strip()

# Remove scripts, styles, forms, and navigation elements
for s in post_soup(['script', 'style', 'nav', 'header', 'footer', 'form', 'aside']):
    s.decompose()

article_tag = post_soup.find('article') or post_soup.find('main') or post_soup.find('body')
raw_text = article_tag.get_text(separator='\n', strip=True) if article_tag else ""

if len(raw_text) < 200:
    msg = "Extracted text is too short to be a valid blog post."
    print(f"⚠️ {msg}")
    run_status["error_message"] = msg
    exit(0)

# 4. Generate with AI (Dual Engine: NVIDIA NIM or Google Gemini)
prompt = f"""
You are the founder and principal technical architect of Elesium (elesium.online), an enterprise intelligence and automation platform.
Read the following technical article from Nimap Infotech and rewrite it into a personalized, high-authority thought-leadership post as if it came directly from YOU.

GUIDELINES:
- Voice: Authoritative, pragmatic, deeply technical, founder-level perspective.
- Value Preservation: Keep ALL key architectural frameworks, metrics, security threat vectors, and engineering principles. Do NOT dumb down or dilute the technical substance.
- Remove Fluff: Eliminate any agency marketing pitches, "contact us to hire developers", or third-party promotional calls to action.
- Integration: Frame the takeaways around scalable enterprise architecture and operational excellence.

You MUST return ONLY valid JSON matching this TypeScript structure. Do not wrap in markdown or backticks.

{{
  "id": {new_id},
  "slug": "{new_slug}",
  "category": "Technology & Architecture",
  "title": "<Sharp, compelling, personalized title>",
  "date": "<Current date formatted as Month DD, YYYY>",
  "readTime": "6 min read",
  "excerpt": "<A compelling 2-sentence summary>",
  "intro": "Elesium architecture insights — 2026. Keywords: enterprise architecture, agentic systems, operational scale.",
  "metaDescription": "<Punchy SEO meta description under 155 characters>",
  "weeklyTheme": "Enterprise AI & Scalability",
  "faq": [
    {{ "q": "<Practical engineering question 1>", "a": "<Detailed, actionable response>" }},
    {{ "q": "<Practical engineering question 2>", "a": "<Detailed, actionable response>" }}
  ],
  "sections": [
    {{ "type": "paragraph", "value": "<First-person intro setting up the real-world problem>" }},
    {{ "type": "heading", "value": "<Section 1: The Core Technical Challenge>" }},
    {{ "type": "paragraph", "value": "<In-depth technical analysis>" }},
    {{ "type": "list", "value": ["Architecture Principle: Explanation", "Failure Mode: Concrete mitigation"] }},
    {{ "type": "heading", "value": "<Section 2: Blueprint & Implementation>" }},
    {{ "type": "paragraph", "value": "<Practical breakdown of layers, frameworks, and patterns>" }},
    {{ "type": "quote", "value": "<An incisive pull quote summarizing the philosophy>" }},
    {{ "type": "heading", "value": "<Section 3: Security & Operational Guardrails>" }},
    {{ "type": "paragraph", "value": "<Security vectors, least-privilege, and governance details>" }},
    {{ "type": "paragraph", "value": "<Actionable concluding thought for technical leaders>" }}
  ]
}}

Source Article Text:
===
Original Title: {title}
{raw_text[:9000]}
===
"""

def execute_ai_generation(prompt_text: str) -> str:
    # Option 1: Try NVIDIA NIM first if key available
    if os.getenv("NVIDIA_API_KEY"):
        try:
            print("🚀 Calling NVIDIA NIM (meta/llama-3.1-70b-instruct)...")
            from openai import OpenAI
            client = OpenAI(
                base_url="https://integrate.api.nvidia.com/v1",
                api_key=os.getenv("NVIDIA_API_KEY")
            )
            completion = client.chat.completions.create(
                model="meta/llama-3.1-70b-instruct",
                messages=[
                    {"role": "system", "content": "You are an expert technical editor. You MUST return strictly valid JSON matching the requested structure without any markdown blocks or conversational text."},
                    {"role": "user", "content": prompt_text}
                ],
                temperature=0.6,
                max_tokens=3000,
            )
            res = completion.choices[0].message.content.strip()
            if res:
                return res
        except Exception as err:
            print(f"⚠️ NVIDIA NIM call failed ({err}). Trying Gemini fallback...")

    # Option 2: Try Gemini
    if os.getenv("GEMINI_API_KEY"):
        try:
            print("🧠 Calling Google Gemini (gemini-1.5-flash)...")
            import google.generativeai as genai
            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            model = genai.GenerativeModel("gemini-1.5-flash")
            res = model.generate_content(prompt_text).text.strip()
            if res:
                return res
        except Exception as err:
            print(f"❌ Gemini API call failed: {err}")

    msg = "Both NVIDIA and Gemini generation failed or keys were missing."
    run_status["error_message"] = msg
    raise RuntimeError(msg)

output_text = execute_ai_generation(prompt)

# Clean markdown wrappers if present
if output_text.startswith("```json"):
    output_text = output_text[7:]
if output_text.startswith("```"):
    output_text = output_text[3:]
if output_text.endswith("```"):
    output_text = output_text[:-3]

output_text = output_text.strip()

try:
    new_post = json.loads(output_text)
except json.JSONDecodeError as e:
    msg = f"Failed to parse JSON from AI response: {e}"
    print(f"❌ {msg}")
    print("Response preview:", output_text[:300])
    run_status["error_message"] = msg
    exit(1)

# Ensure internalLinks
if recent_slugs:
    new_post["internalLinks"] = recent_slugs

# 5. Format and inject into blogPosts.ts
ts_object = json.dumps(new_post, indent=8)
ts_object_formatted = "    " + ts_object

array_start_match = re.search(r'export const blogPosts:\s*BlogPost\[\]\s*=\s*\[', posts_content)
if not array_start_match:
    msg = "Could not find 'export const blogPosts: BlogPost[] = [' in blogPosts.ts"
    print(f"❌ {msg}")
    run_status["error_message"] = msg
    exit(1)

insert_index = array_start_match.end()

new_posts_content = (
    posts_content[:insert_index] +
    "\n" + ts_object_formatted + "," +
    posts_content[insert_index:]
)

with open(POSTS_FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(new_posts_content)

run_status["success"] = True
run_status["posts_found"] = 1
print(f"🎉 Successfully injected new blog post (ID: {new_id}, Slug: '{new_slug}') into blogPosts.ts!")
