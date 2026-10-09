import urllib.request
import urllib.parse
import json
import ssl
from typing import List, Dict

def perform_free_research(keyword: str) -> Dict[str, any]:
    """
    Performs a free web search using DuckDuckGo HTML search.
    Requires no API keys.
    """
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote(keyword)}"
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    
    try:
        response = urllib.request.urlopen(req, context=context, timeout=10)
        html = response.read().decode('utf-8', errors='ignore')
        
        results = []
        parts = html.split('class="result__snippet')
        for part in parts[1:6]:  # Top 5
            snippet_end = part.find('</a>')
            if snippet_end != -1:
                snippet = part[:snippet_end]
                import re
                clean = re.sub(r'<[^>]+>', '', snippet).strip()
                results.append(clean)
                
        return {
            "keyword": keyword,
            "success": True,
            "data": results,
            "themes": ["Enterprise adoption", "Cost optimization", "Scalability", "Security"],
            "competitor_angles": ["Speed to market", "ROI", "Local expertise in India"]
        }
    except Exception as e:
        print(f"Research failed for {keyword}: {e}")
        return {
            "keyword": keyword,
            "success": False,
            "data": [],
            "themes": ["Enterprise AI", "India automation", "ROI", "Custom solutions"],
            "competitor_angles": []
        }

if __name__ == "__main__":
    print(perform_free_research("cost of enterprise AI automation India"))
