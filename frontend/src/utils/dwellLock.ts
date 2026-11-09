/**
 * ELESIUM NAVBOOST DWELL LOCK (V2026.1)
 * TypeScript utility for client-side engagement locking and anti-pogo-stick protection.
 */
export function initNavboostDwellLock(qualifiedThresholdMs: number = 12000): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const ref = document.referrer || "";
  const isSearchReferral = 
    ref.includes("google.") || 
    ref.includes("bing.") || 
    ref.includes("yahoo.") || 
    ref.includes("duckduckgo.") || 
    ref.includes("ecosia.");

  if (!isSearchReferral) return;

  const arrivalTime = Date.now();

  if (window.history && window.history.pushState) {
    window.history.pushState({ elesiumNavboostLock: true }, document.title, window.location.href);

    window.addEventListener("popstate", () => {
      const elapsed = Date.now() - arrivalTime;
      if (elapsed < qualifiedThresholdMs) {
        window.history.pushState({ elesiumNavboostLock: true }, document.title, window.location.href);
        const hook = 
          document.getElementById("interactive-anchor") || 
          document.querySelector(".answer-capsule") || 
          document.querySelector("main") || 
          document.querySelector("h1");
        if (hook && typeof (hook as HTMLElement).scrollIntoView === "function") {
          (hook as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        window.history.back();
      }
    });
  }
}
