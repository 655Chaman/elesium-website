"use client"

import React, { useEffect, useState } from "react"
import { cn } from "../../lib/utils"

interface MeteorsProps {
    number?: number
    minDelay?: number
    maxDelay?: number
    minDuration?: number
    maxDuration?: number
    angle?: number
    className?: string
}

export const Meteors = ({
    number = 40,
    minDelay = 0.2,
    maxDelay = 1.2,
    minDuration = 2,
    maxDuration = 10,
    angle = 215,
    className,
}: MeteorsProps) => {
    const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
        []
    )

    useEffect(() => {
        const styles = [...new Array(number)].map(() => ({
            "--angle": -angle + "deg",
            top: "-5%",
            left: `calc(0% + ${Math.floor(Math.random() * window.innerWidth)}px)`,
            animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
            animationDuration:
                Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
                "s",
        }))
        setMeteorStyles(styles)
    }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

    return (
        <>
            {[...meteorStyles].map((style, idx) => (
                // Meteor Head
                <span
                    key={idx}
                    style={{
                        ...style,
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        backgroundColor: '#000000',
                        borderRadius: '9999px',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                        zIndex: 10,
                    }}
                    className={cn(
                        "animate-meteor pointer-events-none rotate-[var(--angle)]",
                        className
                    )}
                >
                    {/* Meteor Tail */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '100px',
                            height: '1px',
                            background: 'linear-gradient(to right, #000000, transparent)',
                            zIndex: -1,
                        }}
                        className="pointer-events-none"
                    />
                </span>
            ))}
        </>
    )
}
