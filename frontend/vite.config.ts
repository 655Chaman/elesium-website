import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Vite plugin to intercept requests for pruned solution doorway pages
 * and respond with HTTP 410 Gone and X-Robots-Tag: noindex, follow.
 */
function http410Plugin(): Plugin {
    let prunedSlugs: Set<string> = new Set()
    const prunedPath = path.resolve(__dirname, '../automation/pruned_solution_slugs.json')
    if (fs.existsSync(prunedPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(prunedPath, 'utf-8'))
            prunedSlugs = new Set(data)
        } catch (e) {
            console.error('Error loading pruned slugs in http410Plugin:', e)
        }
    }

    const html410Page = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex, follow">
    <meta name="googlebot" content="noindex, follow">
    <title>410 Gone | Content Retired | Elesium</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a0c; color: #f3f4f6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .container { max-width: 600px; text-align: center; border: 1px solid rgba(255,255,255,0.1); padding: 48px 32px; border-radius: 16px; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); }
        .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(239,68,68,0.15); color: #f87171; font-size: 13px; font-weight: 600; margin-bottom: 20px; border: 1px solid rgba(239,68,68,0.3); }
        h1 { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
        p { color: #9ca3af; line-height: 1.6; margin-bottom: 28px; }
        .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; background: #2563eb; color: #fff; text-decoration: none; font-weight: 500; transition: background 0.2s; }
        .btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">HTTP 410 • Content Retired</div>
        <h1>410 Gone</h1>
        <p>This automated solution specification has been permanently retired as part of Elesium's Algorithmic Quality & Enterprise Architecture Curation initiative. The requested resource is no longer maintained.</p>
        <a href="/solutions/" class="btn">Explore Enterprise Architectures</a>
    </div>
</body>
</html>`

    const middleware = (req: any, res: any, next: any) => {
        const url = req.url ? req.url.split('?')[0] : ''
        if (url.startsWith('/solutions/')) {
            const rawSlug = url.slice('/solutions/'.length).replace(/\/$/, '')
            if (rawSlug && (prunedSlugs.has(rawSlug) || prunedSlugs.size === 0)) {
                res.statusCode = 410
                res.setHeader('X-Robots-Tag', 'noindex, follow')
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(html410Page)
                return
            }
        }
        next()
    }

    return {
        name: 'vite-plugin-http410',
        configureServer(server) {
            server.middlewares.use(middleware)
        },
        configurePreviewServer(server) {
            server.middlewares.use(middleware)
        }
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), http410Plugin()],
    base: '/', // Custom domain (elesium.online)
    build: {
        target: 'es2020',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('framer-motion')) return 'vendor-motion';
                        if (id.includes('lucide-react')) return 'vendor-lucide';
                        if (id.includes('react-router-dom') || id.includes('react-router')) return 'vendor-router';
                        if (id.includes('react-helmet-async')) return 'vendor-helmet';
                        if (id.includes('react-markdown') || id.includes('remark-gfm')) return 'vendor-markdown';
                        if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react';
                        return 'vendor-core';
                    }
                }
            }
        }
    }
})
