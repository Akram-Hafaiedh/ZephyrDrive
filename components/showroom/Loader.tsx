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
  
  // r = 54 -> Circumference = 2 * Math.PI * 54 = 339.292
  const strokeDashoffset = useTransform(motionProgress, [0, 100], [339.29, 0])

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
      duration: 1.2, // Smooth duration for ticks
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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />

          {/* Central Circular Progress Area */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Ambient blur aura behind the ring */}
            <div className="absolute w-36 h-36 bg-white/[0.01] blur-2xl rounded-full pointer-events-none" />

            <svg className="w-full h-full" viewBox="0 0 120 120">
              <defs>
                {/* Silver Gradient for the progress ring */}
                <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#a1a1a1" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.9} />
                </linearGradient>
                {/* Drop-shadow glow filter */}
                <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Circular Track */}
              <circle
                cx="60"
                cy="60"
                r="54"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="1.5"
                fill="transparent"
              />

              {/* Animated Progress Ring */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#silverGradient)"
                strokeWidth="2.5"
                fill="transparent"
                strokeDasharray="339.29"
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                filter="url(#ringGlow)"
              />
            </svg>

            {/* Inner Percentage text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extralight tracking-wider text-white/95 tabular-nums">
                {display}
              </span>
              <span className="text-[8px] tracking-[0.3em] font-bold text-white/30 uppercase mt-1">
                Percent
              </span>
            </div>
          </div>

          {/* Luxury Branding Footer */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
            className="absolute bottom-16 flex flex-col items-center gap-1 text-center"
          >
            <span className="text-xs tracking-[0.4em] font-light text-white/60 uppercase">
              Zephyr Drive
            </span>
            <span className="text-[7px] tracking-[0.25em] text-white/20 uppercase font-medium">
              Virtual Showroom Experience
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}