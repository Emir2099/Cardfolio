'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface PackOpeningProps {
  pack: { id: number; name: string; color: string; bgColor: string }
  onPackOpen: () => void
}

export default function PackOpening({ pack, onPackOpen }: PackOpeningProps) {
  const [tearProgress, setTearProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const packRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && packRef.current) {
        const packRect = packRef.current.getBoundingClientRect()
        const progress = Math.max(0, Math.min(1, (e.clientX - packRect.left) / packRect.width))
        setTearProgress(progress)

        if (progress >= 1) {
          setIsDragging(false)
          onPackOpen()
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onPackOpen])

  const getPackDesign = () => {
    switch (pack.id) {
      case 1: // Skills
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 border-4 border-yellow-500 rounded-full animate-spin" />
            <div className="absolute w-16 h-16 border-4 border-yellow-300 rounded-full animate-spin-slow" />
          </div>
        )
      case 2: // About
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-yellow-500 animate-pulse">?</div>
          </div>
        )
      case 3: // Projects
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-yellow-500 animate-bounce" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        ref={packRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-80 h-[480px] cursor-pointer"
      >
        <div className="absolute inset-0 rounded-lg border-2 border-yellow-500 overflow-hidden" style={{ backgroundColor: pack.bgColor }}>
          {getPackDesign()}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
            <div className="absolute inset-0 rounded-full bg-yellow-600 flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border-4 border-yellow-400" />
              <p className="text-black font-bold text-2xl">{pack.name}</p>
            </div>
          </div>
        </div>
        <motion.div
          className="absolute top-[30px] left-0 right-0 h-1 bg-yellow-500"
          style={{ scaleX: tearProgress, transformOrigin: 'left' }}
        />
        <motion.div
          className="absolute top-[26px] left-0 right-0 h-8 flex items-center"
          style={{ x: tearProgress * 320 }}
        >
          <div
            className="bg-yellow-500 w-2 h-2 rounded-full"
            style={{ boxShadow: '0 0 8px 2px rgba(255, 215, 0, 0.8)' }}
          />
        </motion.div>
        <motion.div
          className="absolute top-[22px] left-0 right-0 h-6 flex items-center justify-start cursor-grab"
          onMouseDown={() => setIsDragging(true)}
        >
          <div className="bg-yellow-500 bg-opacity-20 px-2 py-1 rounded-full">
            <p className="text-xs font-bold text-yellow-500">Slide to open</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

