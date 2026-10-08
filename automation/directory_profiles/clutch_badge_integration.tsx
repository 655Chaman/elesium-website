import React, { useEffect } from 'react';

/**
 * Clutch Review Badge Component
 * 
 * Instructions:
 * 1. Once your Clutch profile is live and has at least 1 review, go to your Clutch vendor dashboard.
 * 2. Navigate to the "Widgets" section and select a badge style.
 * 3. Replace the script src below with the actual URL provided by Clutch.
 * 4. Mount this component in your Footer or a dedicated "Trust" section on the landing page.
 */
export const ClutchBadge: React.FC = () => {
    useEffect(() => {
        // Dynamically load the Clutch widget script
        const script = document.createElement('script');
        
        // TODO: Replace this URL with your actual Clutch widget script src
        script.src = "https://widget.clutch.co/static/js/widget.js"; 
        
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="flex justify-center items-center py-6">
            {/* The data-url attribute must also be updated to match your exact Clutch profile URL */}
            <div 
                className="clutch-widget" 
                data-url="https://clutch.co" 
                data-widget-type="2" 
                data-height="45" 
                data-nofollow="true" 
                data-expandifr="true"
                // TODO: Add data-company-id attribute if required by the specific widget
            ></div>
        </div>
    );
};

export default ClutchBadge;
