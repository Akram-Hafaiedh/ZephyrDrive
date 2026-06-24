'use client'

import { motion } from 'framer-motion'
import MagneticButton from '@/components/ui/MagneticButton'

export default function ProductInfo() {
    return (
        <div className="absolute top-10 right-10 z-10 text-right space-y-4">
            <motion.h1
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl font-bold text-white drop-shadow-lg"
            >
                Aether Runner
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl text-white/80 font-light"
            >
                $240
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <MagneticButton>Add to Cart — $240</MagneticButton>
            </motion.div>
        </div>
    )
}