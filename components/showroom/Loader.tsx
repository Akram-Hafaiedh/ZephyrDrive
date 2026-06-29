'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useProgress } from '@react-three/drei'

export default function Loader() {
  const { progress } = useProgress()
  const [show, setShow] = useState(true)
  const [display, setDisplay] = useState(0)
  const motionProgress = useMotionValue(0)
  const lineWidth = useTransform(motionProgress, [0, 100], ['0%', '100%'])

  useEffect(() => {
    const controls = animate(motionProgress, progress, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [progress])

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setShow(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [progress])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: 'center' }}
          className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center"
        >
          <span className="text-5xl font-light tracking-widest text-white tabular-nums">
            {String(display).padStart(3, '0')}
          </span>

          <motion.div
            className="absolute bottom-0 left-0 h-[1px] bg-white/80"
            style={{ width: lineWidth }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}