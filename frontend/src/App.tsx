import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Arena from './components/Arena'
import Leaderboard from './components/Leaderboard'
import BeliefPanel from './components/BeliefPanel'
import NPCGrid from './components/NPCGrid'
import GameStatus from './components/GameStatus'
import { Flame, Trophy, Users, Zap } from 'lucide-react'

interface GameInfo {
  state: string
  prizePool: string
  founderCount: number
  roundStartTime: number
  roundEndTime: number
  currentRound: number
}

interface Belief {
  id: string
  name: string
  symbol: string
  coreValues: string[]
  messagingStyle: string
  followerCount: number
}

interface NPC {
  id: number
  currentBelief: string | null
  conviction: number
  biases: {
    authority: number
    fairness: number
    risk: number
    optimism: number
    individualism: number
  } | null
}

const API_BASE = '/api/v1'

export default function App() {
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)
  const [beliefs, setBeliefs] = useState<Belief[]>([])
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [selectedBelief, setSelectedBelief] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch game data
  const fetchData = async () => {
    try {
      const [gameRes, beliefsRes, npcsRes] = await Promise.all([
        fetch(`${API_BASE}/game/info`),
        fetch(`${API_BASE}/beliefs`),
        fetch(`${API_BASE}/game/npcs`)
      ])

      const gameData = await gameRes.json()
      const beliefsData = await beliefsRes.json()
      const npcsData = await npcsRes.json()

      if (gameData.success) setGameInfo(gameData.game)
      if (beliefsData.success) setBeliefs(beliefsData.beliefs)
      if (npcsData.success) setNpcs(npcsData.npcs)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  // Belief colors
  const beliefColors = [
    '#8b5cf6', // purple
    '#3b82f6', // blue
    '#ec4899', // pink
    '#f97316', // orange
    '#22c55e', // green
    '#06b6d4', // cyan
    '#eab308', // yellow
    '#ef4444', // red
  ]

  const getBeliefColor = (index: number) => beliefColors[index % beliefColors.length]

  if (loading) {
    return (
      <div className="min-h-screen arena-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-mono">Loading The Belief Market...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen arena-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold gradient-text">
                  The Belief Market
                </h1>
                <p className="text-xs text-gray-500 font-mono">Arena of Ideas</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-purple-400">
                  <Trophy className="w-4 h-4" />
                  <span className="font-mono">{gameInfo?.prizePool || '0 MON'}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Users className="w-4 h-4" />
                  <span className="font-mono">{npcs.length} NPCs</span>
                </div>
                <div className="flex items-center gap-2 text-pink-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-mono">{beliefs.length} Beliefs</span>
                </div>
              </div>

              {/* Game Status */}
              <GameStatus gameInfo={gameInfo} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Leaderboard - Left */}
          <div className="col-span-3">
            <Leaderboard 
              beliefs={beliefs}
              getBeliefColor={getBeliefColor}
              selectedBelief={selectedBelief}
              onSelectBelief={setSelectedBelief}
            />
          </div>

          {/* Arena - Center */}
          <div className="col-span-6">
            <Arena 
              npcs={npcs}
              beliefs={beliefs}
              getBeliefColor={getBeliefColor}
              selectedBelief={selectedBelief}
            />
          </div>

          {/* Belief Details - Right */}
          <div className="col-span-3">
            <AnimatePresence mode="wait">
              {selectedBelief ? (
                <BeliefPanel 
                  key={selectedBelief}
                  belief={beliefs.find(b => b.id === selectedBelief)!}
                  color={getBeliefColor(beliefs.findIndex(b => b.id === selectedBelief))}
                  followers={npcs.filter(n => n.currentBelief === selectedBelief)}
                  onClose={() => setSelectedBelief(null)}
                />
              ) : (
                <NPCGrid 
                  npcs={npcs.slice(0, 50)}
                  beliefs={beliefs}
                  getBeliefColor={getBeliefColor}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="font-mono">
            Built for Monad • OpenClaw Agents • 
            <a href="/skill.md" className="text-purple-400 hover:text-purple-300 ml-1">
              skill.md
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

