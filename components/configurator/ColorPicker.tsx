'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/store/useConfigStore'
import { Check } from 'lucide-react'

export default function ColorPicker() {
    const { colors, activeColor, setActiveColor } = useConfigStore()

    return (
        <div className="absolute bottom-10 left-10 z-10 flex gap-3">
            {colors.map((color, index) => (
                <motion.button
                    key={color.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }}
                    onClick={() => setActiveColor(color)}
                    className="relative w-10 h-10 rounded-full border-2 border-white/20 shadow-lg backdrop-blur-sm flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {activeColor.name === color.name && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-white drop-shadow-md"
                        >
                            <Check size={16} />
                        </motion.div>
                    )}
                    {/* Tooltip on hover */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        {color.name}
                    </span>
                </motion.button>
            ))}
        </div>
    )
}