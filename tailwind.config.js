/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/components/ui/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#121317',
                    gray: '#202124',
                    light: '#E8EAED',
                    accent: '#4285F4',
                }
            },
            fontSize: {
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
            }
        },
    },
    plugins: [],
}
