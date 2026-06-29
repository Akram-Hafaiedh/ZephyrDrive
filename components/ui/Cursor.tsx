'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
    const [hovering, setHovering] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)
    const springX = useSpring(cursorX, { stiffness: 800, damping: 50 })
    const springY = useSpring(cursorY, { stiffness: 800, damping: 50 })

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16)
            cursorY.set(e.clientY - 16)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[data-hover]')
            ) {
                setHovering(true)
            } else {
                setHovering(false)
            }
        }

        window.addEventListener('mousemove', move)
        window.addEventListener('mouseover', handleMouseOver)
        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [])

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
            style={{ x: springX, y: springY }}
        >
            <motion.div
                animate={{
                    width: hovering ? 64 : 16,
                    height: hovering ? 64 : 16,
                    backgroundColor: hovering ? 'rgba(255,255,255,0)' : '#fff',
                    borderColor: '#fff',
                    borderWidth: hovering ? 2 : 0,
                }}
                className="rounded-full bg-white flex items-center justify-center text-xs text-black pointer-events-none"
            >
                {hovering && 'View'}
            </motion.div>
        </motion.div>
    )
}