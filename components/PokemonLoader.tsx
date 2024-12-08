import { motion } from 'framer-motion'

export default function PokemonLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        className="w-16 h-16 bg-yellow-500 rounded-full border-8 border-t-8 border-black"
        animate={{
          rotate: 360,
          borderTopColor: ['#000000', '#FFD700', '#000000'],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

