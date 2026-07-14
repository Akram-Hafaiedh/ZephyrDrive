'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ConfigPart } from '@/data/cars'
import { Check, ChevronRight } from 'lucide-react'

type ConfiguratorPanelProps = {
    parts: ConfigPart[]
    activeSelections: Record<string, string>
    onSelect: (partId: string, value: string) => void
    activeTab: string
    onTabChange: (tabId: string) => void
}

export default function ConfiguratorPanel({
    parts,
    activeSelections,
    onSelect,
    activeTab,
    onTabChange,
}: ConfiguratorPanelProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
            className="absolute top-28 left-10 z-30 flex flex-col w-80 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl pointer-events-auto"
        >
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 mb-5">
                Configure Design
            </h2>

            <div className="flex flex-col gap-4">
                {parts.map((part) => {
                    const isActive = activeTab === part.id
                    const selectedValue = activeSelections[part.id]
                    const selectedOption = part.options.find((opt) => opt.value === selectedValue)

                    return (
                        <div
                            key={part.id}
                            className={`border border-white/5 rounded-xl overflow-hidden transition-colors ${
                                isActive ? 'bg-white/[0.03] border-white/10' : 'hover:bg-white/[0.02]'
                            }`}
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => onTabChange(part.id)}
                                className="w-full flex items-center justify-between p-4 text-left cursor-pointer transition-all"
                            >
                                <div className="space-y-0.5">
                                    <span className="text-sm font-semibold tracking-wide text-white/90">
                                        {part.label}
                                    </span>
                                    {!isActive && selectedOption && (
                                        <span className="block text-xs text-white/40 font-medium">
                                            {selectedOption.name}
                                        </span>
                                    )}
                                </div>
                                <motion.div
                                    animate={{ rotate: isActive ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-white/40"
                                >
                                    <ChevronRight size={16} />
                                </motion.div>
                            </button>

                            {/* Accordion Content */}
                            <AnimatePresence initial={false}>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    >
                                        <div className="px-4 pb-4 pt-1 flex flex-col gap-3">
                                            {/* Grid of color options */}
                                            <div className="flex flex-wrap gap-3">
                                                {part.options.map((option, idx) => {
                                                    const isSelected = selectedValue === option.value
                                                    return (
                                                        <motion.button
                                                            key={option.name}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: idx * 0.04 }}
                                                            onClick={() => onSelect(part.id, option.value)}
                                                            className="group relative w-10 h-10 rounded-full border border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform"
                                                            style={{ backgroundColor: option.value }}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                                                                >
                                                                    <Check size={14} strokeWidth={3} />
                                                                </motion.div>
                                                            )}
                                                            {/* Tooltip */}
                                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border border-white/5 z-40">
                                                                {option.name}
                                                            </span>
                                                        </motion.button>
                                                    )
                                                })}
                                            </div>
                                            
                                            {/* Currently Selected Text details */}
                                            {selectedOption && (
                                                <div className="text-xs text-white/50 bg-white/[0.02] border border-white/5 rounded-lg px-2.5 py-1.5 font-medium tracking-wide">
                                                    Selected: <span className="text-white/80">{selectedOption.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}
