/**
 * RouteProgressBar.tsx
 * Zero-CLS, non-blocking top progress line for route Suspense transitions.
 * Does not cover page content or shift layout (height: 2px, fixed top).
 */
export default function RouteProgressBar() {
    return (
        <div 
            className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            <div className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 animate-pulse w-full" />
        </div>
    )
}
