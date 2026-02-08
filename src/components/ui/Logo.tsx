import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4169E1" /> {/* Royal Blue */}
                        <stop offset="50%" stopColor="#8A2BE2" /> {/* Blue Violet */}
                        <stop offset="100%" stopColor="#FF69B4" /> {/* Hot Pink */}
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Main Diamond Shape inspired by sparkles/stars */}
                <path
                    d="M50 5 
                       C50 30, 70 50, 95 50 
                       C70 50, 50 70, 50 95 
                       C50 70, 30 50, 5 50 
                       C30 50, 50 30, 50 5 Z"
                    fill="url(#logo-gradient)"
                    filter="url(#glow)"
                />

                {/* Inner White Shine for polish */}
                <path
                    d="M50 15 
                       C50 35, 65 50, 85 50 
                       C65 50, 50 65, 50 85 
                       C50 65, 35 50, 15 50 
                       C35 50, 50 35, 50 15 Z"
                    fill="white"
                    fillOpacity="0.2"
                />
            </svg>
            <span className="ml-3 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 font-heading">
                ELESIUM
            </span>
        </div>
    );
};
