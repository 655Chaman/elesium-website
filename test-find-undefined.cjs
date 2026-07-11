const { blogPosts } = require('./temp.cjs');
for (let i = 0; i < blogPosts.length; i++) {
    if (blogPosts[i] === undefined) console.log('UNDEFINED at index', i);
}
console.log('Length:', blogPosts.length);
