import re
import json

with open('src/data/blogPosts.ts', 'r') as f:
    content = f.read()

# 1. First, find all ids and slugs
matches = re.finditer(r'id:\s*(\d+),[\s\S]*?slug:\s*\'([^\']+)\',', content)
id_to_new_slug = {}

for m in matches:
    id_val = m.group(1)
    slug_val = m.group(2)
    if not slug_val.endswith(f"-{id_val}"):
        new_slug = f"{slug_val.rstrip('-')}-{id_val}"
    else:
        new_slug = slug_val
    id_to_new_slug[id_val] = new_slug

# 2. Update slugs
def replace_slug(m):
    id_val = m.group(1)
    new_slug = id_to_new_slug[id_val]
    return f"id: {id_val},\n        slug: '{new_slug}',"

content = re.sub(r'id:\s*(\d+),\s*\n\s*slug:\s*\'([^\']+)\',', replace_slug, content)

# 3. Update internalLinks
def replace_internal_links(m):
    links_str = m.group(1)
    # Extract slugs
    slugs = re.findall(r"'([^']+)'", links_str)
    
    new_slugs = []
    for s in slugs:
        best_match = s
        for nid, nslug in id_to_new_slug.items():
            if nslug.startswith(s):
                best_match = nslug
                break
        new_slugs.append(f"'{best_match}'")
        
    return f"internalLinks: [{', '.join(new_slugs)}]"

content = re.sub(r'internalLinks:\s*\[([^\]]+)\]', replace_internal_links, content)

with open('src/data/blogPosts.ts', 'w') as f:
    f.write(content)

print("Fixed duplicate slugs and updated internalLinks.")
