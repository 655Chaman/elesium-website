import os
import json
import urllib.request
import urllib.parse
from datetime import datetime
import re
from free_researcher import perform_free_research

def generate_content(keyword: str, research_data: dict) -> str:
    """Generate content using NVIDIA NIM or Gemini fallback"""
    nvidia_api_key = os.environ.get("NVIDIA_API_KEY")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    
    system_prompt = (
        "You are an elite Enterprise AI Automation Engineer and technical SEO writer based in Bangalore. "
        "Write a 1800-2400 word authoritative blog post. "
        "Do NOT use words like 'delve', 'seamless', 'tapestry', 'revolutionize', 'robust'. "
        "Use active voice, specific ROI data, and Bangalore/India enterprise context. "
        "Include structured sections: headings, paragraphs, lists, metrics. Format with HTML tags for content."
    )
    
    user_prompt = f"Keyword: {keyword}\nContext: {json.dumps(research_data)}\n"
    
    if nvidia_api_key:
        try:
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            data = {
                "model": "nvidia/llama-3.1-nemotron-70b-instruct",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 3000,
                "temperature": 0.7
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={
                    'Authorization': f'Bearer {nvidia_api_key}',
                    'Content-Type': 'application/json'
                }
            )
            response = urllib.request.urlopen(req, timeout=30)
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
        except Exception as e:
            print(f"NVIDIA API failed: {e}. Falling back to Gemini.")
    
    if gemini_api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={gemini_api_key}"
            data = {
                "contents": [{
                    "parts": [{"text": system_prompt + "\n" + user_prompt}]
                }]
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            response = urllib.request.urlopen(req, timeout=30)
            result = json.loads(response.read().decode('utf-8'))
            return result['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"Gemini API failed: {e}")
            
    return f"""
      <h3>Exploring the realities of {keyword}</h3>
      <p>This is a placeholder content block for the keyword {keyword}, generated via fallback.</p>
    """

def get_flux_image(keyword: str) -> str:
    prompt = urllib.parse.quote(f"Enterprise AI automation data visualization, high tech, corporate dashboard, clean minimal, relevant to {keyword}")
    return f"https://image.pollinations.ai/prompt/{prompt}?width=1200&height=630&nologo=true"

def inject_post(content: str, title: str, keyword: str, image_url: str):
    ts_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "blogPosts.ts")
    if not os.path.exists(ts_path):
        print(f"Could not find {ts_path} - generating mock file")
        os.makedirs(os.path.dirname(ts_path), exist_ok=True)
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write("export const blogPosts: BlogPost[] = [\n];\n")
            
    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()
        
    new_id = int(datetime.now().timestamp())
    date_str = datetime.now().strftime('%Y-%m-%d')
    
    safe_title = title.replace("'", "\\'")
    safe_slug = keyword.replace(" ", "-").lower()
    safe_content = content.replace('`', '\\`')
    
    new_post_obj = f'''
  {{
    id: '{new_id}',
    title: '{safe_title}',
    slug: '{safe_slug}',
    excerpt: 'Comprehensive guide on {keyword} for Indian enterprises.',
    date: '{date_str}',
    readTime: '8 min read',
    category: 'AI Automation',
    author: 'Elesium Engineering',
    image: '{image_url}',
    tags: ['AI', 'Enterprise', 'India'],
    content: `
      <h2>Introduction</h2>
      {safe_content}
    `
  }},'''

    match = re.search(r'export\s+const\s+blogPosts\s*(:\s*BlogPost\[\]\s*)?=\s*\[', ts_content)
    if match:
        insert_idx = match.end()
        new_ts = ts_content[:insert_idx] + "\n" + new_post_obj + ts_content[insert_idx:]
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(new_ts)
        print("Injected successfully into blogPosts.ts!")
    else:
        print("Could not parse blogPosts.ts")

def main():
    queue_path = os.path.join(os.path.dirname(__file__), "keywords_queue.json")
    with open(queue_path, 'r') as f:
        queue = json.load(f)
        
    for item in queue:
        if item.get("status") == "PENDING":
            keyword = item["keyword"]
            print(f"Processing: {keyword}")
            
            research = perform_free_research(keyword)
            content = generate_content(keyword, research)
            img = get_flux_image(keyword)
            
            inject_post(content, f"The Guide to {keyword.title()}", keyword, img)
            
            item["status"] = "USED"
            item["used_at"] = datetime.now().isoformat()
            
            with open(queue_path, 'w') as f_out:
                json.dump(queue, f_out, indent=2)
            
            # Run sitemap/SSG scripts if they exist (mock for now as per instructions)
            print("Running post-generation scripts...")
            
            break
            
if __name__ == "__main__":
    main()
