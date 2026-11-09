/**
 * ELESIUM NAVBOOST ENGAGEMENT TELEMETRY (V2026.2 - SAFEGUARDED)
 * Operational Specification: Google Search Essentials & Chromium Compliance Standard
 *
 * Measures genuine dwell time and scroll engagement without back-button hijacking or
 * history stack manipulation. 100% compliant with Chromium Abusive Experience policies.
 */
(function() {
    'use strict';
    
    var ref = document.referrer || "";
    var isSearchReferral = ref.indexOf("google.") !== -1 || 
                           ref.indexOf("bing.") !== -1 || 
                           ref.indexOf("yahoo.") !== -1 || 
                           ref.indexOf("duckduckgo.") !== -1 ||
                           ref.indexOf("ecosia.") !== -1;
                           
    var arrivalTime = Date.now();
    var qualifiedDwellThreshold = 12000; // 12 seconds minimum qualifying dwell threshold
    var token = "elesiumNavboostLock";
    var maxScrollDepth = 0;

    // Passive history awareness (safe inspection without back-button hijacking)
    if (window.history && window.history.pushState) {
        window.addEventListener("popstate", function(event) {
            // Passive telemetry on natural navigation event
        });
    }

    // Passive scroll depth tracking (zero performance overhead)
    window.addEventListener("scroll", function() {
        var h = document.documentElement, 
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        var percent = Math.round((h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100);
        if (percent > maxScrollDepth) {
            maxScrollDepth = percent;
        }
    }, { passive: true });

    // Passive engagement flush on unload/visibility change
    function reportEngagement() {
        var dwellSeconds = Math.round((Date.now() - arrivalTime) / 1000);
        var qualified = (Date.now() - arrivalTime) >= qualifiedDwellThreshold;
        if (window.navigator && typeof window.navigator.sendBeacon === "function") {
            var payload = JSON.stringify({
                path: window.location.pathname,
                dwellSeconds: dwellSeconds,
                qualified: qualified,
                token: token,
                scrollDepth: maxScrollDepth,
                isSearchReferral: isSearchReferral,
                timestamp: Date.now()
            });
            window.navigator.sendBeacon("/api/telemetry/dwell", payload);
        }
    }

    window.addEventListener("visibilitychange", function() {
        if (document.visibilityState === "hidden") {
            reportEngagement();
        }
    });
})();
