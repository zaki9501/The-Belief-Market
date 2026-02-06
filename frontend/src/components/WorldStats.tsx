import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface WorldState {
  epoch: number
  epochStartTime: number
  epochDuration: number
  totalNations: number
  totalRegions: number
  activeWars: number
  activeTreaties: number
}

interface WorldStatsProps {
  worldState: WorldState | null
}

export default function WorldStats({ worldState }: WorldStatsProps) {
  const [timeLeft, setTimeLeft] = useState<string>('--:--')

  useEffect(() => {
    if (!worldState) return

    const updateTimer = () => {
      const now = Date.now()
      const epochEnd = worldState.epochStartTime + worldState.epochDuration
      const remaining = Math.max(0, epochEnd - now)
      
      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor((remaining % 60000) / 1000)
      
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [worldState])

  if (!worldState) return null

  return (
    <div className="flex items-center gap-3 bg-arena-800/50 rounded-xl px-4 py-2">
      <div className="text-center">
        <p className="text-xs text-gray-500">Epoch</p>
        <p className="font-mono text-lg text-emerald-400">{worldState.epoch}</p>
      </div>
      <div className="w-px h-8 bg-arena-700" />
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <div>
          <p className="text-xs text-gray-500">Next epoch</p>
          <p className="font-mono text-sm text-white">{timeLeft}</p>
        </div>
      </div>
    </div>
  )
}

