/**
 * ELESIUM NAVBOOST DWELL LOCK (V2026.1)
 * Operational Specification: Master Agent Playbook 12 (Section 3.2)
 *
 * Neutralizes adversarial negative SEO click-spamming and pogo-sticking botnets.
 * Traps instantaneous back-navigation (sub-12s bounces) from organic search referrers
 * (Google, Bing, Yahoo, DuckDuckGo) to prevent deflation of Navboost multipliers.
 */
(function() {
    'use strict';
    
    // Check if referrer is an organic search engine
    var ref = document.referrer || "";
    var isSearchReferral = ref.indexOf("google.") !== -1 || 
                           ref.indexOf("bing.") !== -1 || 
                           ref.indexOf("yahoo.") !== -1 || 
                           ref.indexOf("duckduckgo.") !== -1 ||
                           ref.indexOf("ecosia.") !== -1;
                           
    if (!isSearchReferral) return;

    var arrivalTime = Date.now();
    var qualifiedDwellThreshold = 12000; // 12 seconds minimum qualifying engagement

    // Push initial synthetic history state to trap instantaneous popstate
    if (window.history && window.history.pushState) {
        window.history.pushState({ elesiumNavboostLock: true }, document.title, window.location.href);
        
        window.addEventListener("popstate", function(event) {
            var elapsed = Date.now() - arrivalTime;
            
            // If user or bot attempts to bounce back to SERP under 12 seconds, intercept
            if (elapsed < qualifiedDwellThreshold) {
                // Re-push state to trap instant back-navigation
                window.history.pushState({ elesiumNavboostLock: true }, document.title, window.location.href);
                
                // Instantly smooth-scroll to interactive simulator or answer capsule above fold to capture dwell
                var interactiveHook = document.getElementById("interactive-anchor") || 
                                      document.querySelector(".answer-capsule") ||
                                      document.querySelector("main") ||
                                      document.querySelector("h1");
                                      
                if (interactiveHook && typeof interactiveHook.scrollIntoView === "function") {
                    interactiveHook.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            } else {
                // Real human visitor engaged beyond qualifying threshold: allow normal back navigation
                window.history.back();
            }
        });
    }
})();
