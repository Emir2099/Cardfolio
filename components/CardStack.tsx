'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tilt } from 'react-tilt'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

interface Skill {
  id: number
  name: string
  level: number
  projects: number
  color: string
  gradientColors: string[]
}

interface Project {
  id: number
  name: string
  description: string
  technologies: string[]
  github: string
  live: string
}

interface About {
  id: number
  title: string
  content: string
}

const HolographicCard = ({ children, colors }: { children: React.ReactNode, colors: string[] }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    if (isHovered) {
      const interval = setInterval(() => {
        setSparkles(prev => [
          ...prev.filter(spark => Date.now() - spark.id < 1000),
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1
          }
        ])
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isHovered])

  return (
    <Tilt
      className="w-full h-full"
      options={{
        max: 25,
        scale: 1.05,
        speed: 1000,
        glare: true,
        'max-glare': 0.5,
        perspective: 1000,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setSparkles([])
      }}
      onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (cardRef.current) {
          const rect = cardRef.current.getBoundingClientRect()
          setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
          })
        }
      }}
    >
      <div ref={cardRef} className="relative w-full h-full group">
        {children}
        
        {/* Holographic overlay */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(
              ${mousePosition.x}deg,
              ${colors.map((color, index) => 
                `${color} ${index * (100 / colors.length)}%`
              ).join(', ')}
            )`,
            mixBlendMode: 'color-dodge',
            pointerEvents: 'none'
          }}
        />

        {/* Sparkle effects */}
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: 'white',
              boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.8)',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Prismatic edge effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            background: `conic-gradient(from ${mousePosition.x}deg at ${mousePosition.x}% ${mousePosition.y}%, 
              #ff0000, #ffd700, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}
        />
      </div>
    </Tilt>
  )
}

export default function CardStack({ packId }: { packId: number }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const constraintsRef = useRef(null)

  const skills: Skill[] = [
    { 
      id: 1, 
      name: 'PYTHON', 
      level: 3, 
      projects: 5, 
      color: '#3776AB',
      gradientColors: ['#FFD700', '#FFA500', '#FF4500']
    },
    { 
      id: 2, 
      name: 'JAVASCRIPT', 
      level: 4, 
      projects: 8, 
      color: '#F7DF1E',
      gradientColors: ['#4169E1', '#00BFFF', '#87CEEB']
    },
    { 
      id: 3, 
      name: 'REACT', 
      level: 3, 
      projects: 6, 
      color: '#61DAFB',
      gradientColors: ['#800080', '#4B0082', '#9400D3']
    },
  ]

  const projects: Project[] = [
    {
      id: 1,
      name: 'Portfolio Website',
      description: 'An interactive portfolio showcasing my skills and projects',
      technologies: ['React', 'Next.js', 'Tailwind CSS'],
      github: 'https://github.com/yourusername/portfolio',
      live: 'https://portfolio.yourusername.com'
    },
    {
      id: 2,
      name: 'Task Manager App',
      description: 'A full-stack task management application with user authentication',
      technologies: ['Node.js', 'Express', 'MongoDB', 'React'],
      github: 'https://github.com/yourusername/task-manager',
      live: 'https://task-manager.yourusername.com'
    },
    {
      id: 3,
      name: 'Weather Dashboard',
      description: 'Real-time weather information dashboard using external APIs',
      technologies: ['JavaScript', 'APIs', 'HTML/CSS'],
      github: 'https://github.com/yourusername/weather-dashboard',
      live: 'https://weather.yourusername.com'
    }
  ]

  const about: About[] = [
    {
      id: 1,
      title: 'Background',
      content: 'I am a passionate software developer with a strong foundation in computer science and a love for creating innovative solutions.'
    },
    {
      id: 2,
      title: 'Education',
      content: 'Bachelor of Science in Computer Science from XYZ University, graduated with honors in 2022.'
    },
    {
      id: 3,
      title: 'Interests',
      content: 'Outside of coding, I enjoy hiking, reading sci-fi novels, and contributing to open-source projects.'
    }
  ]

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: { offset: { x: number, y: number } }) => {
    if (info.offset.x > 100) {
      cycleCards(1)
    } else if (info.offset.x < -100) {
      cycleCards(-1)
    }
  }

  const cycleCards = (direction: number) => {
    setCurrentIndex((prevIndex) => {
      const items = packId === 1 ? skills : packId === 2 ? about : projects
      const newIndex = (prevIndex + direction + items.length) % items.length
      return newIndex
    })
  }

  const renderCard = (item: Skill | Project | About) => {
    if ('level' in item) {
      // Skill card
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 shadow-lg border-2" 
             style={{ borderColor: item.color }}>
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h2 className="text-3xl font-bold text-center tracking-wider" 
                style={{ color: item.color }}>
              {item.name}
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-xl font-bold mb-2 text-yellow-500">SKILL LEVEL</p>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-14 rounded ${
                      i < item.level ? 'bg-yellow-400' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xl font-bold mb-2 text-yellow-500">PROJECTS</p>
              <p className="text-4xl font-bold" style={{ color: item.color }}>{item.projects}</p>
            </div>
          </div>
        </div>
      )
    } else if ('technologies' in item) {
      // Project card
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 shadow-lg border-2 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">{item.name}</h2>
          <p className="text-white mb-4">{item.description}</p>
          <div className="mb-4">
            <p className="text-yellow-500 font-bold mb-2">Technologies:</p>
            <div className="flex flex-wrap gap-2">
              {item.technologies.map((tech, index) => (
                <span key={index} className="bg-gray-800 text-white px-2 py-1 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <a href={item.github} target="_blank" rel="noopener noreferrer" className="text-3xl text-white hover:text-yellow-500 transition-colors">
              <FaGithub />
            </a>
            <a href={item.live} target="_blank" rel="noopener noreferrer" className="text-3xl text-white hover:text-yellow-500 transition-colors">
              <FaLinkedin />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-3xl text-white hover:text-yellow-500 transition-colors">
              <FaTwitter />
            </a>
          </div>
        </div>
      )
    } else {
      // About card
      return (
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 shadow-lg border-2 border-yellow-500">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">{item.title}</h2>
          <p className="text-white">{item.content}</p>
        </div>
      )
    }
  }

  const items = packId === 1 ? skills : packId === 2 ? about : projects

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative w-80 h-[480px]" ref={constraintsRef}>
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              style={{
                zIndex: index === currentIndex ? items.length : items.length - Math.abs(index - currentIndex),
              }}
              drag="x"
              dragConstraints={constraintsRef}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.8, x: index === currentIndex ? 0 : index > currentIndex ? 300 : -300 }}
              animate={{ scale: index === currentIndex ? 1 : 0.8, x: 0 }}
              exit={{ x: index === currentIndex ? (currentIndex === 0 ? 300 : -300) : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full h-full"
            >
              <HolographicCard colors={packId === 1 ? (item as Skill).gradientColors : ['#FFD700', '#FFA500', '#FF4500']}>
                {renderCard(item)}
              </HolographicCard>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="absolute -bottom-20 left-0 right-0">
          <p className="text-center text-yellow-500 font-bold text-lg">
            Swipe left or right to view more
          </p>
        </div>
      </div>
    </div>
  )
}

