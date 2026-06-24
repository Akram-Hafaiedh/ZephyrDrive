'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '@react-three/drei'

export default function Loader() {
    const { progress } = useProgress()
    const [show, setShow] = useState(true)

    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(() => setShow(false), 500)
            return () => clearTimeout(timeout)
        }
    }, [progress])

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold text-white mb-4"
                    >
                        {Math.round(progress)}%
                    </motion.div>
                    <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}