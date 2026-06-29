'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConfigPart } from '@/data/cars'
import { Check } from 'lucide-react'

type ConfiguratorPanelProps = {
    parts: ConfigPart[]
    activeSelections: Record<string, string>
    onSelect: (partId: string, value: string) => void
    activeTab: string
    onTabChange: (tabId: string) => void
}

export default function ConfiguratorPanel({ parts, activeSelections, onSelect, activeTab, onTabChange }: ConfiguratorPanelProps) {
    const activePart = parts.find((p) => p.id === activeTab)

    return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-6 w-full max-w-xl px-4 pointer-events-none">
            {/* Tab Selector Bar */}
            <motion.div 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
                className="flex gap-2 p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full pointer-events-auto shadow-2xl"
            >
                {parts.map((part) => {
                    const isActive = activeTab === part.id
                    return (
                        <button
                            key={part.id}
                            onClick={() => onTabChange(part.id)}
                            className={`relative px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-colors ${
                                isActive ? 'text-black font-semibold' : 'text-white/60 hover:text-white'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-white rounded-full z-[-1]"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            {part.label}
                        </button>
                    )
                })}
            </motion.div>

            {/* Options List Container */}
            <div className="h-16 flex items-center justify-center pointer-events-auto">
                <AnimatePresence mode="wait">
                    {activePart && (
                        <motion.div
                            key={activePart.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="flex gap-4 items-center"
                        >
                            {activePart.options.map((option, idx) => {
                                const selectedValue = activeSelections[activePart.id]
                                const isSelected = selectedValue === option.value
                                
                                return (
                                    <motion.button
                                        key={option.name}
                                        initial={{ opacity: 0, scale: 0.7 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ 
                                            delay: idx * 0.05, 
                                            type: 'spring', 
                                            stiffness: 260, 
                                            damping: 20 
                                        }}
                                        onClick={() => onSelect(activePart.id, option.value)}
                                        className="group relative w-12 h-12 rounded-full border-2 border-white/20 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-pointer"
                                        style={{ backgroundColor: option.value }}
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                            >
                                                <Check size={18} strokeWidth={3} />
                                            </motion.div>
                                        )}
                                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border border-white/5">
                                            {option.name}
                                        </span>
                                    </motion.button>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
