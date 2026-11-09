import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root')!

const app = (
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)

if (rootElement.hasChildNodes()) {
    ReactDOM.hydrateRoot(rootElement, app, {
        onRecoverableError(error) {
            // Suppress benign formatting/whitespace differences in production
            if (import.meta.env.DEV) {
                console.warn('Hydration recovery note:', error);
            }
        }
    })
} else {
    ReactDOM.createRoot(rootElement).render(app)
}
