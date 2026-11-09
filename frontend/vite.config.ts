import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
