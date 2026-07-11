const fs = require('fs');

const path = '/Users/krdeeksha/ELESIUM WEBSITE/src/data/blogPosts.ts';
let content = fs.readFileSync(path, 'utf8');

const mockStr = "Cold outreach is not a pipeline strategy";

let newContent = "";
let arrayStartIndex = content.indexOf('export const blogPosts: BlogPost[] = [');
if (arrayStartIndex !== -1) {
    newContent = content.substring(0, arrayStartIndex + 38);
    let rest = content.substring(arrayStartIndex + 38);
    
    let chars = rest.split('');
    let objText = "";
    let braceCount = 0;
    let i = 0;
    while (i < chars.length) {
        if (chars[i] === '{') {
            if (braceCount === 0) {
                objText = "{";
            } else {
                objText += "{";
            }
            braceCount++;
        } else if (chars[i] === '}') {
            braceCount--;
            objText += "}";
            if (braceCount === 0) {
                if (!objText.includes(mockStr)) {
                    newContent += objText;
                }
                objText = "";
            }
        } else {
            if (braceCount > 0) {
                objText += chars[i];
            } else {
                newContent += chars[i];
            }
        }
        i++;
    }
}

fs.writeFileSync(path, newContent, 'utf8');
console.log('Cleaned blogPosts.ts');
