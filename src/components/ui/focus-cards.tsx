"use client"

import React, { useState } from "react"
import { cn } from "../../lib/utils"

export const Card = React.memo(
    ({
        card,
        index,
        hovered,
        setHovered,
        onClick,
    }: {
        card: any
        index: number
        hovered: number | null
        setHovered: React.Dispatch<React.SetStateAction<number | null>>
        onClick: (card: any) => void
    }) => {
        return (
            <div
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onClick(card)}
                className={cn(
                    "rounded-2xl relative bg-white dark:bg-[#111] dark:border dark:border-white/5 border border-gray-100 overflow-hidden h-[350px] md:h-[400px] w-full transition-all duration-300 ease-out cursor-pointer",
                    hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
                    hovered === index && "scale-[1.02] ring-2 ring-blue-500/20 shadow-2xl"
                )}
            >
                <div className="relative z-10 p-8 h-full flex flex-col">
                    <h3 className={cn(
                        "text-2xl font-medium mb-4 text-[#121317] dark:text-white transition-colors",
                        hovered === index ? "text-blue-600 dark:text-blue-400" : ""
                    )}>
                        {card.title}
                    </h3>
                    <p className="body-text dark:text-gray-400 transition-opacity duration-300"
                        style={{ opacity: hovered === index ? 1 : 0.7 }}
                    >
                        {card.description}
                    </p>
                    <div className={cn(
                        "mt-auto flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 transition-all duration-300",
                        hovered === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}>
                        Read Case Study →
                    </div>
                </div>
            </div>
        )
    }
)

Card.displayName = "Card"

type CardType = {
    id: number
    title: string
    description: string
    details: any
}

export function FocusCards({
    cards,
    onCardClick
}: {
    cards: CardType[]
    onCardClick: (card: CardType) => void
}) {
    const [hovered, setHovered] = useState<number | null>(null)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
            {cards.map((card, index) => (
                <Card
                    key={card.id}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                    onClick={onCardClick}
                />
            ))}
        </div>
    )
}
