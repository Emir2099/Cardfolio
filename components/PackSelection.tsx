'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Pack {
  id: number
  name: string
  color: string
  bgColor: string
}

interface PackSelectionProps {
  onSelectPack: (packId: number) => void
  packs: Pack[]
}

const packVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.5,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.5,
    transition: {
      duration: 0.5,
    },
  }),
}

export default function PackSelection({ onSelectPack, packs }: PackSelectionProps) {
  const [[page, direction], setPage] = useState([0, 0])

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const currentPack = packs[Math.abs(page) % packs.length]

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      <div className="relative w-80 h-[480px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={packVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full h-full"
          >
            <div className="w-full h-full rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-gray-900 to-black border-2 border-yellow-500">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48">
                <div className="absolute inset-0 rounded-full bg-yellow-600 flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full border-4 border-yellow-400" />
                  <p className="text-black font-bold text-3xl">{currentPack.name}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(-1)}
          className="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelectPack(currentPack.id)}
          className="bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors font-bold"
        >
          Select
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => paginate(1)}
          className="bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  )
}

