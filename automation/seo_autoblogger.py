import os
import json
import urllib.request
import urllib.parse
from datetime import datetime
import re
import math
from collections import Counter
from free_researcher import perform_free_research

def call_llm(system_prompt: str, user_prompt: str, expected_json: bool = False) -> str:
    nvidia_api_key = os.environ.get("NVIDIA_API_KEY")
    gemini_api_key = os.environ.get("GEMINI_API_KEY")

    if nvidia_api_key:
        try:
            url = "https://integrate.api.nvidia.com/v1/chat/completions"
            data = {
                "model": "nvidia/llama-3.1-nemotron-70b-instruct",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "max_tokens": 4000,
                "temperature": 0.7
            }
            if expected_json:
                data["response_format"] = {"type": "json_object"}

            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={
                    'Authorization': f'Bearer {nvidia_api_key}',
                    'Content-Type': 'application/json'
                }
            )
            response = urllib.request.urlopen(req, timeout=60)
            result = json.loads(response.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
        except Exception as e:
            print(f"NVIDIA API failed: {e}. Falling back to Gemini.")

    if gemini_api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={gemini_api_key}"
            data = {
                "contents": [{
                    "parts": [{"text": system_prompt + "\n\n" + user_prompt}]
                }]
            }
            if expected_json:
                data["generationConfig"] = {"responseMimeType": "application/json"}

            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={'Content-Type': 'application/json'}
            )
            response = urllib.request.urlopen(req, timeout=60)
            result = json.loads(response.read().decode('utf-8'))
            return result['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"Gemini API failed: {e}")

    # Fallback response
    if expected_json:
        return json.dumps({
            "title": f"The Guide to {user_prompt}",
            "intro": "Placeholder intro.",
            "metaDescription": "Placeholder meta.",
            "excerpt": "Placeholder excerpt.",
            "sections": [{"type": "paragraph", "value": "Placeholder content."}],
            "faq": []
        })
    return "Fallback content generated due to API errors."

def agent_architect(keyword: str, research_data: dict) -> str:
    system_prompt = (
        "You are the Stage 1: Outline & Information Gain Architect. "
        "Dissect the search query and create a comprehensive 6-8 section outline with unique data angles. "
        "Invent and include proprietary methodology names like 'Elesium Deterministic Agent Framework', 'VPC-Isolated Multi-Agent Triad'. "
        "Output ONLY the outline, structured clearly."
    )
    user_prompt = f"Keyword: {keyword}\nResearch Data: {json.dumps(research_data)}"
    return call_llm(system_prompt, user_prompt)

def agent_technical_writer(keyword: str, outline: str) -> str:
    system_prompt = (
        "You are the Stage 2: Technical Subject Matter Writer. "
        "Using the provided outline, generate full technical depth content. "
        "Include Python/LangGraph examples, enterprise architecture patterns, and real Indian enterprise ROI metrics like BFSI/manufacturing. "
        "Output the full article in Markdown format."
    )
    user_prompt = f"Keyword: {keyword}\nOutline:\n{outline}"
    return call_llm(system_prompt, user_prompt)

def agent_brutal_editor(keyword: str, draft: str) -> dict:
    system_prompt = (
        "You are the Stage 3: Brutal Editor & GEO Polish. "
        "Your job is to refine the article and output it strictly in JSON format compatible with a TypeScript 'BlogPost' interface. "
        "Follow these rules precisely:\n"
        "1. Add bolded 40-50 word 'Answer Capsules' directly beneath every H2 heading optimized for Google AI Overview / Perplexity direct answer citation.\n"
        "2. Insert structured comparative Markdown tables (e.g. Technology comparison, pricing tier, architecture matrix).\n"
        "3. Enforce the 'Elesium E-E-A-T' voice (coining proprietary frameworks: 'Elesium Deterministic Agent Framework', 'VPC-Isolated Multi-Agent Triad').\n"
        "4. Strip all generic AI buzzwords ('delve', 'tapestry', 'seamless', 'game-changer').\n"
        "5. Include at least one contextual link to `/ai-automation-agency-india` with natural anchor text (e.g., [India's leading enterprise AI engineering firm](/ai-automation-agency-india)) within a paragraph section.\n\n"
        "Output JSON with these keys:\n"
        "- title (string)\n"
        "- intro (string)\n"
        "- metaDescription (string)\n"
        "- excerpt (string)\n"
        "- sections (array of objects with 'type' and 'value'). 'type' must be one of: 'paragraph', 'heading', 'list', 'quote', 'metric', 'faq'. For 'heading', provide the H2 text. For answer capsules, tables, and code blocks, use 'paragraph'.\n"
        "- faq (array of objects with 'q' and 'a' string keys)\n"
        "Do NOT output markdown code block wrappers (like ```json). ONLY output the raw JSON."
    )
    user_prompt = f"Keyword: {keyword}\nDraft:\n{draft}"
    res = call_llm(system_prompt, user_prompt, expected_json=True)
    # Strip markdown backticks if present
    res = re.sub(r'^```json\s*', '', res)
    res = re.sub(r'^```\s*', '', res)
    res = re.sub(r'\s*```$', '', res)
    try:
        return json.loads(res)
    except Exception as e:
        print(f"Failed to parse JSON from editor agent: {e}")
        return {
            "title": f"The Guide to {keyword}",
            "intro": "Placeholder intro.",
            "metaDescription": "Placeholder meta.",
            "excerpt": "Placeholder excerpt.",
            "sections": [{"type": "paragraph", "value": "Failed to parse JSON content from LLM."}],
            "faq": []
        }

def get_cosine_similarity(vec1, vec2):
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])
    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)
    if not denominator: return 0.0
    return float(numerator) / denominator

def text_to_vector(text):
    words = re.compile(r'\w+').findall(text.lower())
    return Counter(words)

def get_related_posts(keyword: str, top_n: int = 2) -> list:
    ts_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "blogPosts.ts")
    if not os.path.exists(ts_path):
        return []
    
    try:
        with open(ts_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        slugs = re.findall(r"slug:\s*'([^']+)'", content)
        titles = re.findall(r"title:\s*'([^']+)'", content)
        
        posts = []
        for i in range(min(len(slugs), len(titles))):
            posts.append({'slug': slugs[i], 'title': titles[i]})
            
        keyword_vec = text_to_vector(keyword)
        similarities = []
        for p in posts:
            p_vec = text_to_vector(p['title'])
            sim = get_cosine_similarity(keyword_vec, p_vec)
            similarities.append((sim, p['slug']))
            
        similarities.sort(key=lambda x: x[0], reverse=True)
        return [s[1] for s in similarities[:top_n]]
    except Exception as e:
        print(f"Error finding related posts: {e}")
        return []

def get_flux_image(keyword: str) -> str:
    prompt = urllib.parse.quote(f"Enterprise AI automation data visualization, high tech, corporate dashboard, clean minimal, relevant to {keyword}")
    return f"https://image.pollinations.ai/prompt/{prompt}?width=1200&height=630&nologo=true"

def inject_post(final_data: dict, keyword: str, image_url: str, related_slugs: list):
    ts_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "blogPosts.ts")
    if not os.path.exists(ts_path):
        os.makedirs(os.path.dirname(ts_path), exist_ok=True)
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write("export const blogPosts: BlogPost[] = [\n];\n")
            
    with open(ts_path, 'r', encoding='utf-8') as f:
        ts_content = f.read()
        
    ids = [int(m) for m in re.findall(r'id:\s*(\d+)', ts_content)]
    new_id = (max(ids) + 1) if ids else 75
    date_str = datetime.now().strftime('%B %d, %Y')
    
    clean_kw = keyword.lower()
    clean_kw = re.sub(r'[^a-z0-9\s-]', '', clean_kw)
    safe_slug = re.sub(r'[\s_]+', '-', clean_kw).strip('-')
    if not safe_slug:
        safe_slug = f"ai-automation-signal-{new_id}"
    
    title_str = final_data.get('title', keyword).strip()
    excerpt_str = final_data.get('excerpt', '').strip()
    intro_str = final_data.get('intro', '').strip()
    meta_desc_str = final_data.get('metaDescription', excerpt_str).strip()
    
    title_json = json.dumps(title_str)
    slug_json = json.dumps(safe_slug)
    excerpt_json = json.dumps(excerpt_str)
    intro_json = json.dumps(intro_str)
    meta_json = json.dumps(meta_desc_str)
    image_json = json.dumps(image_url)
    
    sections_json = json.dumps(final_data.get('sections', []), indent=4)
    faq_json = json.dumps(final_data.get('faq', []), indent=4)
    internal_links_json = json.dumps(related_slugs)
    
    new_post_obj = f'''
    {{
        id: {new_id},
        slug: {slug_json},
        category: 'AI Automation',
        title: {title_json},
        date: '{date_str}',
        readTime: '8 min read',
        excerpt: {excerpt_json},
        intro: {intro_json},
        metaDescription: {meta_json},
        image: {image_json},
        internalLinks: {internal_links_json},
        faq: {faq_json},
        sections: {sections_json}
    }},'''

    match = re.search(r'export\s+const\s+blogPosts\s*(:\s*BlogPost\[\]\s*)?=\s*\[', ts_content)
    if match:
        insert_idx = match.end()
        new_ts = ts_content[:insert_idx] + "\n" + new_post_obj + ts_content[insert_idx:]
        with open(ts_path, 'w', encoding='utf-8') as f:
            f.write(new_ts)
        print(f"Injected successfully into blogPosts.ts! (ID: {new_id}, Slug: {safe_slug})")
        return {"id": new_id, "slug": safe_slug, "title": title_str, "excerpt": excerpt_str}
    else:
        print("Could not parse blogPosts.ts")
        return None

def generate_content(keyword: str, research_data: dict) -> dict:
    """3-Agent Pipeline"""
    print("Stage 1: Architecting outline...")
    outline = agent_architect(keyword, research_data)
    
    print("Stage 2: Writing technical content...")
    draft = agent_technical_writer(keyword, outline)
    
    print("Stage 3: Editing and formatting...")
    final_json = agent_brutal_editor(keyword, draft)
    
    return final_json

def main():
    queue_path = os.path.join(os.path.dirname(__file__), "keywords_queue.json")
    if not os.path.exists(queue_path):
        print("No keywords_queue.json found.")
        return

    with open(queue_path, 'r') as f:
        queue = json.load(f)
        
    for item in queue:
        if item.get("status") == "PENDING":
            keyword = item["keyword"]
            print(f"Processing: {keyword}")
            
            research = perform_free_research(keyword)
            final_data = generate_content(keyword, research)
            img = get_flux_image(keyword)
            related_slugs = get_related_posts(keyword, top_n=2)
            
            inject_post(final_data, keyword, img, related_slugs)
            
            item["status"] = "USED"
            item["used_at"] = datetime.now().isoformat()
            
            with open(queue_path, 'w') as f_out:
                json.dump(queue, f_out, indent=2)
            
            print("Running post-generation scripts...")
            break
            
if __name__ == "__main__":
    main()
