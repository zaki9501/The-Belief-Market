import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Arena from './components/Arena'
import Leaderboard from './components/Leaderboard'
import BeliefPanel from './components/BeliefPanel'
import DebateFeed from './components/DebateFeed'
import GameStatus from './components/GameStatus'
import { Flame, Trophy, Users, Zap, MessageSquare } from 'lucide-react'

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

interface ConversationMessage {
  id: string
  type: 'persuasion' | 'adaptation' | 'conversion' | 'defection' | 'system' | 'debate'
  agentName?: string
  beliefName?: string
  beliefSymbol?: string
  targetNpcId?: number
  message: string
  resonance?: number
  success?: boolean
  timestamp: string
}

// Railway backend URL
const API_BASE = 'https://web-production-b4d4.up.railway.app/api/v1'

export default function App() {
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null)
  const [beliefs, setBeliefs] = useState<Belief[]>([])
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [selectedBelief, setSelectedBelief] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDebate, setShowDebate] = useState(true)

  // Fetch game data
  const fetchData = async () => {
    try {
      const [gameRes, beliefsRes, npcsRes, convRes] = await Promise.all([
        fetch(`${API_BASE}/game/info`),
        fetch(`${API_BASE}/beliefs`),
        fetch(`${API_BASE}/game/npcs`),
        fetch(`${API_BASE}/game/conversation?limit=100`)
      ])

      const gameData = await gameRes.json()
      const beliefsData = await beliefsRes.json()
      const npcsData = await npcsRes.json()
      const convData = await convRes.json()

      if (gameData.success) setGameInfo(gameData.game)
      if (beliefsData.success) setBeliefs(beliefsData.beliefs)
      if (npcsData.success) setNpcs(npcsData.npcs)
      if (convData.success) setConversation(convData.conversation)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000) // Poll every 3s for live updates
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
  
  const getBeliefColorByName = (beliefName: string) => {
    const index = beliefs.findIndex(b => b.name === beliefName)
    return index >= 0 ? beliefColors[index % beliefColors.length] : '#8b5cf6'
  }

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
        <div className="max-w-[1600px] mx-auto px-6 py-4">
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

              {/* Toggle Debate View */}
              <button
                onClick={() => setShowDebate(!showDebate)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  showDebate 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Debate
              </button>

              {/* Game Status */}
              <GameStatus gameInfo={gameInfo} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className={`grid gap-6 ${showDebate ? 'grid-cols-12' : 'grid-cols-9'}`}>
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
          <div className={showDebate ? 'col-span-5' : 'col-span-6'}>
            <Arena 
              npcs={npcs}
              beliefs={beliefs}
              getBeliefColor={getBeliefColor}
              selectedBelief={selectedBelief}
            />
            
            {/* Belief Panel below arena when selected */}
            <AnimatePresence>
              {selectedBelief && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <BeliefPanel 
                    belief={beliefs.find(b => b.id === selectedBelief)!}
                    color={getBeliefColor(beliefs.findIndex(b => b.id === selectedBelief))}
                    followers={npcs.filter(n => n.currentBelief === selectedBelief)}
                    onClose={() => setSelectedBelief(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Debate Feed - Right */}
          {showDebate && (
            <div className="col-span-4">
              <DebateFeed 
                messages={conversation}
                getBeliefColor={getBeliefColorByName}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 py-6 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="font-mono">
            Built for Monad • OpenClaw Agents • 
            <a 
              href="https://web-production-b4d4.up.railway.app/skill.md" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 ml-1"
            >
              skill.md
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
