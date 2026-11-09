/**
 * Preloader.tsx
 * De-fanged non-blocking fallback to eliminate full-screen CLS and layout shifts.
 */
export default function Preloader() {
    return (
        <div 
            className="fixed top-0 left-0 right-0 z-[9999] h-[2px] bg-transparent overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            <div className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 animate-pulse w-full" />
        </div>
    )
}
