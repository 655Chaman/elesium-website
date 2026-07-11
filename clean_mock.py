import re

path = '/Users/krdeeksha/ELESIUM WEBSITE/src/data/blogPosts.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

mock_str = "Cold outreach is not a pipeline strategy"

# We'll split the content into the prefix and the array
start_idx = content.find('export const blogPosts: BlogPost[] = [')
if start_idx != -1:
    prefix = content[:start_idx + 38]
    rest = content[start_idx + 38:]
    
    # We will use brace matching to find each object
    new_rest = ""
    brace_count = 0
    obj_text = ""
    for char in rest:
        if char == '{':
            if brace_count == 0:
                obj_text = "{"
            else:
                obj_text += "{"
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            obj_text += "}"
            if brace_count == 0:
                if mock_str not in obj_text:
                    new_rest += obj_text
                else:
                    print("Removed mock post.")
                obj_text = ""
        else:
            if brace_count > 0:
                obj_text += char
            else:
                new_rest += char

    # cleanup trailing commas
    new_rest = re.sub(r',\s*,', ',', new_rest)
    new_rest = re.sub(r'\[\s*,', '[', new_rest)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(prefix + new_rest)
    print("Cleanup complete.")
