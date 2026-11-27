/**
 * ELESIUM NAVBOOST ENGAGEMENT TELEMETRY (V2026.2 - SAFEGUARDED)
 * Operational Specification: Google Search Essentials & Chromium Compliance Standard
 *
 * Measures genuine dwell time and scroll engagement without back-button hijacking or
 * history stack manipulation. 100% compliant with Chromium Abusive Experience policies.
 */
export function initNavboostDwellLock(qualifiedDwellThreshold: number = 12000): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const ref = document.referrer || "";
  const isSearchReferral = 
    ref.includes("google.") || 
    ref.includes("bing.") || 
    ref.includes("yahoo.") || 
    ref.includes("duckduckgo.") || 
    ref.includes("ecosia.");

  const arrivalTime = Date.now();
  let maxScrollDepth = 0;

  const handleScroll = () => {
    const h = document.documentElement;
    const b = document.body;
    const st = "scrollTop";
    const sh = "scrollHeight";
    const denominator = (h[sh] || b[sh]) - h.clientHeight;
    if (denominator <= 0) return;

    const percent = Math.min(100, Math.max(0, Math.round(((h[st] || b[st]) / denominator) * 100)));
    if (percent > maxScrollDepth) {
      maxScrollDepth = percent;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  const apiUrl = import.meta.env.VITE_API_URL;
  const report = () => {
    if (!apiUrl || typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") {
      return;
    }
    const dwellSeconds = Math.round((Date.now() - arrivalTime) / 1000);
    const qualified = Date.now() - arrivalTime >= qualifiedDwellThreshold;
    const payload = JSON.stringify({
      path: window.location.pathname,
      dwellSeconds,
      qualified,
      token: "elesiumNavboostLock",
      scrollDepth: maxScrollDepth,
      isSearchReferral,
      timestamp: Date.now()
    });
    navigator.sendBeacon(`${apiUrl.replace(/\/$/, "")}/api/telemetry/dwell`, payload);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      report();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
