import { useEffect, useRef, useState, useCallback } from 'react';

export interface DwellTelemetryState {
    activeDwellSeconds: number;
    scrollDepthPercent: number;
    interactionCount: number;
    isGoodClick: boolean;                // Navboost threshold: dwell > 120s
    isLastLongestClickEligible: boolean; // Navboost threshold: dwell > 180s + 75% scroll depth
    milestones: {
        quarterScroll: boolean;
        halfScroll: boolean;
        threeQuarterScroll: boolean;
        fullScroll: boolean;
        minuteOne: boolean;
        minuteTwoGoodClick: boolean;
        minuteThreeSuperDwell: boolean;
    };
}

export function useDwellTelemetry(pageIdentifier: string) {
    const [state, setState] = useState<DwellTelemetryState>({
        activeDwellSeconds: 0,
        scrollDepthPercent: 0,
        interactionCount: 0,
        isGoodClick: false,
        isLastLongestClickEligible: false,
        milestones: {
            quarterScroll: false,
            halfScroll: false,
            threeQuarterScroll: false,
            fullScroll: false,
            minuteOne: false,
            minuteTwoGoodClick: false,
            minuteThreeSuperDwell: false,
        }
    });

    const activeSecondsRef = useRef(0);
    const interactionsRef = useRef(0);
    const maxScrollRef = useRef(0);
    const isVisibleRef = useRef(!document.hidden);
    const lastActiveTimestampRef = useRef<number>(Date.now());

    // Register an active user interaction (clicks, drags, copies, etc.)
    const trackInteraction = useCallback((actionName: string, metadata?: Record<string, unknown>) => {
        interactionsRef.current += 1;
        const currentInteractions = interactionsRef.current;
        
        setState(prev => ({
            ...prev,
            interactionCount: currentInteractions
        }));

        // Broadcast to window for custom analytics / GTM listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('navboost:interaction', {
                detail: {
                    page: pageIdentifier,
                    action: actionName,
                    metadata: metadata || {},
                    activeSeconds: activeSecondsRef.current,
                    timestamp: new Date().toISOString()
                }
            }));
        }
    }, [pageIdentifier]);

    useEffect(() => {
        // Reset tracking on page change
        activeSecondsRef.current = 0;
        interactionsRef.current = 0;
        maxScrollRef.current = 0;
        isVisibleRef.current = !document.hidden;
        lastActiveTimestampRef.current = Date.now();

        // 1. High-precision active visibility timer
        const timerInterval = setInterval(() => {
            if (isVisibleRef.current) {
                activeSecondsRef.current += 1;
                const secs = activeSecondsRef.current;
                const scroll = maxScrollRef.current;

                const isGoodClick = secs >= 120;
                const isSuperDwell = secs >= 180 && scroll >= 75;

                setState(prev => ({
                    ...prev,
                    activeDwellSeconds: secs,
                    isGoodClick,
                    isLastLongestClickEligible: isSuperDwell,
                    milestones: {
                        ...prev.milestones,
                        minuteOne: prev.milestones.minuteOne || secs >= 60,
                        minuteTwoGoodClick: prev.milestones.minuteTwoGoodClick || secs >= 120,
                        minuteThreeSuperDwell: prev.milestones.minuteThreeSuperDwell || secs >= 180,
                    }
                }));

                // Trigger Navboost GoodClick event at exactly 120 seconds
                if (secs === 120 && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('navboost:goodClick', {
                        detail: {
                            page: pageIdentifier,
                            dwellSeconds: 120,
                            scrollDepth: scroll,
                            interactions: interactionsRef.current,
                            signal: 'NAVBOOST_GOOD_CLICK_ACHIEVED'
                        }
                    }));
                }

                // Trigger Navboost LastLongestClick eligibility at 180 seconds
                if (secs === 180 && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('navboost:lastLongestClickEligible', {
                        detail: {
                            page: pageIdentifier,
                            dwellSeconds: 180,
                            scrollDepth: scroll,
                            interactions: interactionsRef.current,
                            signal: 'NAVBOOST_LAST_LONGEST_CLICK_ELIGIBLE'
                        }
                    }));
                }
            }
        }, 1000);

        // 2. Visibility change listener (pause dwell timer when tab is hidden)
        const handleVisibilityChange = () => {
            isVisibleRef.current = !document.hidden;
            if (isVisibleRef.current) {
                lastActiveTimestampRef.current = Date.now();
            }
        };

        // 3. Scroll depth tracker
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (docHeight <= 0) return;

            const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));
            if (scrollPercent > maxScrollRef.current) {
                maxScrollRef.current = scrollPercent;

                setState(prev => ({
                    ...prev,
                    scrollDepthPercent: scrollPercent,
                    milestones: {
                        ...prev.milestones,
                        quarterScroll: prev.milestones.quarterScroll || scrollPercent >= 25,
                        halfScroll: prev.milestones.halfScroll || scrollPercent >= 50,
                        threeQuarterScroll: prev.milestones.threeQuarterScroll || scrollPercent >= 75,
                        fullScroll: prev.milestones.fullScroll || scrollPercent >= 95,
                    }
                }));
            }
        };

        // 4. Global micro-interaction listeners
        const handleUserClick = (e: MouseEvent) => {
            // Track deliberate clicks on links, buttons, inputs, canvas
            const target = e.target as HTMLElement | null;
            if (target && (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.interactive-asset'))) {
                trackInteraction('element_click', {
                    tagName: target.tagName,
                    className: target.className
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('click', handleUserClick, { passive: true });

        // Initial scroll calculation
        handleScroll();

        // 5. Beacon telemetry on unload / navigation
        const handleUnloadBeacon = () => {
            const payload = JSON.stringify({
                page: pageIdentifier,
                totalActiveDwellSeconds: activeSecondsRef.current,
                maxScrollDepthPercent: maxScrollRef.current,
                totalInteractions: interactionsRef.current,
                achievedGoodClick: activeSecondsRef.current >= 120,
                achievedLastLongestClick: activeSecondsRef.current >= 180 && maxScrollRef.current >= 75,
                exitTimestamp: new Date().toISOString()
            });

            // If an analytics beacon endpoint is configured, fire navigator.sendBeacon
            if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
                navigator.sendBeacon('/api/telemetry/navboost', payload);
            }
        };

        window.addEventListener('pagehide', handleUnloadBeacon);
        window.addEventListener('beforeunload', handleUnloadBeacon);

        return () => {
            clearInterval(timerInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('click', handleUserClick);
            window.removeEventListener('pagehide', handleUnloadBeacon);
            window.removeEventListener('beforeunload', handleUnloadBeacon);
            handleUnloadBeacon();
        };
    }, [pageIdentifier, trackInteraction]);

    return {
        ...state,
        trackInteraction
    };
}
