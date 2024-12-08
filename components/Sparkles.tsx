'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
}

export default function Sparkles({ children }: { children: React.ReactNode }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const sparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1
      }
      setSparkles(prev => [...prev, sparkle])
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sparkle.id))
      }, 300)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTiltX((y - 0.5) * 40)
    setTiltY((x - 0.5) * -40)
  }

  const handleMouseLeave = () => {
    setTiltX(0)
    setTiltY(0)
  }

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'absolute',
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

