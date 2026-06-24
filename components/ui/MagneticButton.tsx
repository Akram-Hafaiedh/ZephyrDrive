'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLButtonElement>(null)
    const [pos, setPos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const x = clientX - (left + width / 2)
        const y = clientY - (top + height / 2)
        setPos({ x: x * 0.3, y: y * 0.3 })
    }

    const handleMouseLeave = () => setPos({ x: 0, y: 0 })

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
            className="bg-white text-black font-semibold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-shadow"
        >
            {children}
        </motion.button>
    )
}