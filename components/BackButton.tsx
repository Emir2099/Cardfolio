import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  onClick: () => void
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-colors"
    >
      <ArrowLeft className="w-6 h-6 text-white" />
    </button>
  )
}

