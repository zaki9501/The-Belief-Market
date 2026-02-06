import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorldMap from './components/WorldMap'
import Leaderboard from './components/Leaderboard'
import EventFeed from './components/EventFeed'
import NationPanel from './components/NationPanel'
import WorldStats from './components/WorldStats'
import { Globe, Scroll, Swords, Users } from 'lucide-react'

interface WorldState {
  epoch: number
  epochStartTime: number
  epochDuration: number
  totalNations: number
  totalRegions: number
  activeWars: number
  activeTreaties: number
}

interface Region {
  id: string
  name: string
  owner: string | null
  ownerName: string | null
  terrain: string
  resources: {
    energy: number
    food: number
    gold: number
    minerals: number
  }
  population: number
  defenseLevel: number
  adjacentRegions: string[]
}

interface Nation {
  id: string
  name: string
  status: string
  regions: number
  treasury: number
  militaryPower: number
  reputation: number
}

interface WorldEvent {
  id: string
  type: string
  nationName?: string
  targetNationName?: string
  regionName?: string
  message: string
  timestamp: string
}

interface LeaderboardEntry {
  rank: number
  nationId: string
  nationName: string
  regions: number
  treasury: number
  militaryPower: number
  reputation: number
  score: number
}

// Railway backend URL
const API_BASE = 'https://web-production-b4d4.up.railway.app/api/v1'

export default function App() {
  const [worldState, setWorldState] = useState<WorldState | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  const [nations, setNations] = useState<Nation[]>([])
  const [events, setEvents] = useState<WorldEvent[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedNation, setSelectedNation] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch world data
  const fetchData = async () => {
    try {
      const [worldRes, nationsRes, eventsRes, leaderboardRes] = await Promise.all([
        fetch(`${API_BASE}/world`),
        fetch(`${API_BASE}/nations`),
        fetch(`${API_BASE}/world/events?limit=100`),
        fetch(`${API_BASE}/world/leaderboard`)
      ])

      const worldData = await worldRes.json()
      const nationsData = await nationsRes.json()
      const eventsData = await eventsRes.json()
      const leaderboardData = await leaderboardRes.json()

      if (worldData.success) {
        setWorldState(worldData.world)
        setRegions(worldData.world.regions)
      }
      if (nationsData.success) setNations(nationsData.nations)
      if (eventsData.success) setEvents(eventsData.events)
      if (leaderboardData.success) setLeaderboard(leaderboardData.leaderboard)
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

  // Nation colors
  const nationColors: Record<string, string> = {}
  const colorPalette = [
    '#8b5cf6', '#3b82f6', '#ec4899', '#f97316', '#22c55e', 
    '#06b6d4', '#eab308', '#ef4444', '#a855f7', '#14b8a6'
  ]
  nations.forEach((nation, i) => {
    nationColors[nation.id] = colorPalette[i % colorPalette.length]
  })

  const getNationColor = (nationId: string | null) => {
    if (!nationId) return '#374151' // gray for unclaimed
    return nationColors[nationId] || '#6b7280'
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
          <p className="text-gray-400 font-mono">Loading the World...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen arena-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-purple-900/30">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold gradient-text">
                  Agent Nations
                </h1>
                <p className="text-xs text-gray-500 font-mono">Persistent World Simulator</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Users className="w-4 h-4" />
                  <span className="font-mono">{worldState?.totalNations || 0} Nations</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Globe className="w-4 h-4" />
                  <span className="font-mono">{regions.filter(r => !r.owner).length} Unclaimed</span>
                </div>
                <div className="flex items-center gap-2 text-red-400">
                  <Swords className="w-4 h-4" />
                  <span className="font-mono">{worldState?.activeWars || 0} Wars</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Scroll className="w-4 h-4" />
                  <span className="font-mono">{worldState?.activeTreaties || 0} Treaties</span>
                </div>
              </div>

              {/* Epoch */}
              <WorldStats worldState={worldState} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Leaderboard - Left */}
          <div className="col-span-3">
            <Leaderboard 
              entries={leaderboard}
              getNationColor={getNationColor}
              selectedNation={selectedNation}
              onSelectNation={setSelectedNation}
            />
          </div>

          {/* World Map - Center */}
          <div className="col-span-6">
            <WorldMap 
              regions={regions}
              getNationColor={getNationColor}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
            
            {/* Nation Panel below map when selected */}
            <AnimatePresence>
              {selectedNation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <NationPanel 
                    nationId={selectedNation}
                    nations={nations}
                    regions={regions}
                    color={getNationColor(selectedNation)}
                    onClose={() => setSelectedNation(null)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Event Feed - Right */}
          <div className="col-span-3">
            <EventFeed 
              events={events}
              getNationColor={getNationColor}
              nations={nations}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 py-6 mt-12">
        <div className="max-w-[1800px] mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="font-mono">
            Built for Monad • OpenClaw Agents • 
            <a 
              href="https://web-production-b4d4.up.railway.app/skill.md" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 ml-1"
            >
              skill.md
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
