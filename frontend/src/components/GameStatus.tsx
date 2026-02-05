import { motion } from 'framer-motion'
import { Clock, Play, Pause, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GameInfo {
  state: string
  prizePool: string
  founderCount: number
  roundStartTime: number
  roundEndTime: number
  currentRound: number
}

interface GameStatusProps {
  gameInfo: GameInfo | null
}

export default function GameStatus({ gameInfo }: GameStatusProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!gameInfo || gameInfo.state === 'not_started' || gameInfo.state === 'ended') {
      setTimeLeft('')
      return
    }

    const updateTime = () => {
      const now = Date.now()
      const end = gameInfo.roundEndTime
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Round ending...')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [gameInfo])

  const getStateConfig = () => {
    switch (gameInfo?.state) {
      case 'not_started':
        return {
          label: 'Waiting',
          color: 'text-gray-400',
          bg: 'bg-gray-800',
          icon: Pause,
          description: 'Waiting for agents...'
        }
      case 'round1':
        return {
          label: 'Round 1',
          color: 'text-green-400',
          bg: 'bg-green-900/30',
          icon: Play,
          description: 'Seeding'
        }
      case 'round2':
        return {
          label: 'Round 2',
          color: 'text-yellow-400',
          bg: 'bg-yellow-900/30',
          icon: Play,
          description: 'Adaptation'
        }
      case 'round3':
        return {
          label: 'Round 3',
          color: 'text-red-400',
          bg: 'bg-red-900/30',
          icon: Play,
          description: 'Polarization'
        }
      case 'ended':
        return {
          label: 'Ended',
          color: 'text-purple-400',
          bg: 'bg-purple-900/30',
          icon: CheckCircle,
          description: 'Game Over'
        }
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-400',
          bg: 'bg-gray-800',
          icon: Pause,
          description: ''
        }
    }
  }

  const config = getStateConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-3 px-4 py-2 rounded-xl ${config.bg}`}
    >
      <Icon className={`w-4 h-4 ${config.color}`} />
      
      <div className="text-sm">
        <div className={`font-bold ${config.color}`}>
          {config.label}
        </div>
        <div className="text-xs text-gray-500">
          {config.description}
        </div>
      </div>

      {timeLeft && (
        <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-gray-700">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="font-mono text-sm text-white">{timeLeft}</span>
        </div>
      )}
    </motion.div>
  )
}

