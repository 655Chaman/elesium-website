/**
 * ELESIUM NAVBOOST ENGAGEMENT TELEMETRY (V2026.2 - SAFEGUARDED)
 * Operational Specification: Google Search Essentials & Chromium Compliance Standard
 *
 * Measures genuine dwell time and scroll engagement without back-button hijacking or
 * history stack manipulation. 100% compliant with Chromium Abusive Experience policies.
 */
export function initNavboostDwellLock(qualifiedDwellThreshold: number = 12000): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const ref = document.referrer || "";
  const isSearchReferral = 
    ref.includes("google.") || 
    ref.includes("bing.") || 
    ref.includes("yahoo.") || 
    ref.includes("duckduckgo.") || 
    ref.includes("ecosia.");

  const arrivalTime = Date.now();
  let maxScrollDepth = 0;

  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const b = document.body;
    const st = "scrollTop";
    const sh = "scrollHeight";
    const percent = Math.round(((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100);
    if (percent > maxScrollDepth) {
      maxScrollDepth = percent;
    }
  }, { passive: true });

  const report = () => {
    const dwellSeconds = Math.round((Date.now() - arrivalTime) / 1000);
    const qualified = Date.now() - arrivalTime >= qualifiedDwellThreshold;
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const payload = JSON.stringify({
        path: window.location.pathname,
        dwellSeconds,
        qualified,
        token: "elesiumNavboostLock",
        scrollDepth: maxScrollDepth,
        isSearchReferral,
        timestamp: Date.now()
      });
      navigator.sendBeacon("/api/telemetry/dwell", payload);
    }
  };

  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      report();
    }
  });
}
