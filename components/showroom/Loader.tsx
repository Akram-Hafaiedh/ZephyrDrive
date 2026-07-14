'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { useProgress } from '@react-three/drei'

export default function Loader() {
  const { active, progress } = useProgress()
  const [targetProgress, setTargetProgress] = useState(0)
  const [show, setShow] = useState(true)
  const [display, setDisplay] = useState(0)
  const motionProgress = useMotionValue(0)
  const lineWidth = useTransform(motionProgress, [0, 100], ['0%', '100%'])

  // Monitor loading progress and enforce monotonic updates (only increasing).
  // This ignores Drei's initial progress=100 idle state before the assets register.
  useEffect(() => {
    const updateProgress = () => {
      if (active) {
        setTargetProgress((prev) => Math.max(prev, progress))
      } else if (progress === 100) {
        setTargetProgress(100)
      }
    }
    
    // We defer the state update using requestAnimationFrame to prevent ESLint warnings
    // about synchronous cascading state updates inside effects.
    const frameId = requestAnimationFrame(updateProgress)
    return () => cancelAnimationFrame(frameId)
  }, [progress, active])

  // Animate the displayed progress number smoothly over time
  useEffect(() => {
    const controls = animate(motionProgress, targetProgress, {
      duration: 1.0, // Smooth duration for ticks
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [targetProgress, motionProgress])

  // Once the visual display counts all the way to 100, smoothly close the loading screen
  useEffect(() => {
    if (display === 100) {
      const timeout = setTimeout(() => setShow(false), 800)
      return () => clearTimeout(timeout)
    }
  }, [display])

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