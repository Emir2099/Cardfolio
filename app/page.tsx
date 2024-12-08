'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PackSelection from '../components/PackSelection'
import PackOpening from '../components/PackOpening'
import CardStack from '../components/CardStack'
import BackButton from '../components/BackButton'
import PokemonLoader from '../components/PokemonLoader'

export default function Home() {
  const [selectedPack, setSelectedPack] = useState<number | null>(null)
  const [isPackOpened, setIsPackOpened] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const packs = [
    { id: 1, name: 'SKILLS', color: '#FFD700', bgColor: '#1a1a1a' },
    { id: 2, name: 'ABOUT', color: '#FFA500', bgColor: '#2a2a2a' },
    { id: 3, name: 'PROJECTS', color: '#DAA520', bgColor: '#3a3a3a' },
  ]

  const handlePackSelect = (packId: number) => {
    setSelectedPack(packId)
  }

  const handlePackOpen = () => {
    setIsPackOpened(true)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowCards(true)
    }, 2000)
  }

  const handleBack = () => {
    if (showCards) {
      setShowCards(false)
      setIsPackOpened(false)
    } else if (isPackOpened) {
      setIsPackOpened(false)
      setSelectedPack(null)
    } else if (selectedPack !== null) {
      setSelectedPack(null)
    }
  }

  return (
    <main className="min-h-screen bg-black text-yellow-500">
      {(selectedPack !== null || isPackOpened || showCards) && (
        <BackButton onClick={handleBack} />
      )}
      <AnimatePresence mode="wait">
        {!selectedPack && (
          <motion.div
            key="pack-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PackSelection onSelectPack={handlePackSelect} packs={packs} />
          </motion.div>
        )}
        {selectedPack && !isPackOpened && (
          <motion.div
            key="pack-opening"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <PackOpening 
              pack={packs.find(p => p.id === selectedPack)!} 
              onPackOpen={handlePackOpen} 
            />
          </motion.div>
        )}
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PokemonLoader />
          </motion.div>
        )}
        {showCards && (
          <motion.div
            key="card-stack"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <CardStack packId={selectedPack!} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

