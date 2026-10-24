/**
 * Cloudflare Worker: AI Crawler & Markdown Content Negotiation Router
 * Deploy this on routes: yourdomain.com/solutions/* and yourdomain.com/llms.txt
 */

const AI_BOTS = [
  /gptbot/i,
  /chatgpt-user/i,
  /perplexitybot/i,
  /claudebot/i,
  /claude-web/i,
  /anthropic-ai/i,
  /google-extended/i,
  /bytespider/i,
  /cohere-ai/i,
  /oai-searchbot/i,
  /applebot-extended/i,
  /diffbot/i,
  /facebookbot/i,
  /meta-externalagent/i,
  /amazonbot/i,
  /duckassistbot/i
];

function isAiCrawler(request) {
  const userAgent = request.headers.get("User-Agent") || "";
  const accept = request.headers.get("Accept") || "";
  const url = new URL(request.url);

  if (AI_BOTS.some(pattern => pattern.test(userAgent))) return true;
  if (accept.includes("text/markdown") || accept.includes("text/x-markdown")) return true;
  if (url.searchParams.get("format") === "markdown" || url.searchParams.get("md") === "true") return true;

  return false;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (isAiCrawler(request)) {
      // If client is an AI crawler, request markdown version or transform response
      const originResponse = await fetch(request);
      
      // Pass-through if already markdown
      if (originResponse.headers.get("Content-Type")?.includes("text/markdown")) {
        return originResponse;
      }

      // Check for static markdown alternative (e.g. /solutions/slug.md)
      if (url.pathname.startsWith("/solutions/")) {
        const mdUrl = new URL(request.url);
        mdUrl.pathname = mdUrl.pathname.replace(/\/?$/, ".md");
        const mdResponse = await fetch(mdUrl);
        if (mdResponse.ok) {
          const newHeaders = new Headers(mdResponse.headers);
          newHeaders.set("Content-Type", "text/markdown; charset=utf-8");
          newHeaders.set("X-AEO-Transformer", "Elesium-Cloudflare-GEO");
          newHeaders.set("Vary", "User-Agent, Accept");
          return new Response(mdResponse.body, { status: 200, headers: newHeaders });
        }
      }
    }

    return fetch(request);
  }
};
