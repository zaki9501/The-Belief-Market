import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Clock, Globe, Users, Coins, Swords, 
  Shield, Zap, Activity, Map,
  Mountain, TreePine, Waves, Sun, Wheat
} from 'lucide-react'

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

interface WorldDashboardProps {
  worldState: WorldState | null
  regions: Region[]
  nations: Nation[]
  leaderboard: LeaderboardEntry[]
  getNationColor: (nationId: string | null) => string
}

export default function WorldDashboard({ 
  worldState, 
  regions
}: WorldDashboardProps) {
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

  // Calculate stats
  const totalResources = regions.reduce((acc, r) => ({
    energy: acc.energy + r.resources.energy,
    food: acc.food + r.resources.food,
    gold: acc.gold + r.resources.gold,
    minerals: acc.minerals + r.resources.minerals
  }), { energy: 0, food: 0, gold: 0, minerals: 0 })

  const totalPopulation = regions.reduce((sum, r) => sum + r.population, 0)
  const avgDefense = regions.length > 0 
    ? Math.round(regions.reduce((sum, r) => sum + r.defenseLevel, 0) / regions.length)
    : 0

  const terrainCounts = regions.reduce((acc, r) => {
    acc[r.terrain] = (acc[r.terrain] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const claimedCount = regions.filter(r => r.owner).length

  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'mountains': return <Mountain className="w-4 h-4 text-slate-400" />
      case 'forest': return <TreePine className="w-4 h-4 text-emerald-400" />
      case 'coastal': return <Waves className="w-4 h-4 text-blue-400" />
      case 'desert': return <Sun className="w-4 h-4 text-amber-400" />
      case 'plains': return <Wheat className="w-4 h-4 text-lime-400" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Epoch Timer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Next Epoch</span>
          </div>
          <p className="text-3xl font-mono text-cyan-400">{timeLeft}</p>
          <p className="text-xs text-gray-500 mt-1">Epoch {worldState?.epoch || 0}</p>
        </motion.div>

        {/* Nations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Nations</span>
          </div>
          <p className="text-3xl font-mono text-purple-400">{worldState?.totalNations || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Active agents</p>
        </motion.div>

        {/* Territory Control */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Map className="w-4 h-4" />
            <span className="text-sm">Territory</span>
          </div>
          <p className="text-3xl font-mono text-emerald-400">
            {claimedCount}<span className="text-lg text-gray-500">/{regions.length}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Regions claimed</p>
        </motion.div>

        {/* Active Conflicts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Swords className="w-4 h-4" />
            <span className="text-sm">Conflicts</span>
          </div>
          <p className="text-3xl font-mono text-red-400">{worldState?.activeWars || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Active wars</p>
        </motion.div>
      </div>

      {/* World Resources */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-white">World Resources</h3>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-400" /> Energy
              </span>
              <span className="font-mono text-yellow-400">{totalResources.energy}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(totalResources.energy / (regions.length * 100)) * 100}%` }}
                className="h-full bg-yellow-400 rounded-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Wheat className="w-3 h-3 text-green-400" /> Food
              </span>
              <span className="font-mono text-green-400">{totalResources.food}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(totalResources.food / (regions.length * 100)) * 100}%` }}
                className="h-full bg-green-400 rounded-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-400" /> Gold
              </span>
              <span className="font-mono text-amber-400">{totalResources.gold}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(totalResources.gold / (regions.length * 100)) * 100}%` }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-400" /> Minerals
              </span>
              <span className="font-mono text-slate-400">{totalResources.minerals}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(totalResources.minerals / (regions.length * 100)) * 100}%` }}
                className="h-full bg-slate-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Terrain Distribution */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Terrain Distribution</h3>
          </div>
          
          <div className="space-y-3">
            {Object.entries(terrainCounts).map(([terrain, count]) => (
              <div key={terrain} className="flex items-center gap-3">
                {getTerrainIcon(terrain)}
                <span className="text-sm text-gray-300 capitalize flex-1">{terrain}</span>
                <span className="font-mono text-gray-400">{count}</span>
                <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${(count / regions.length) * 100}%`,
                      backgroundColor: terrain === 'mountains' ? '#94a3b8' :
                                       terrain === 'forest' ? '#34d399' :
                                       terrain === 'coastal' ? '#60a5fa' :
                                       terrain === 'desert' ? '#fbbf24' : '#a3e635'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* World Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#12121a] rounded-xl border border-gray-800 p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-white">World Statistics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a24] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Total Population</p>
              <p className="text-xl font-mono text-blue-400">{totalPopulation.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1a24] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Avg Defense</p>
              <p className="text-xl font-mono text-yellow-400">{avgDefense}</p>
            </div>
            <div className="bg-[#1a1a24] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Active Treaties</p>
              <p className="text-xl font-mono text-purple-400">{worldState?.activeTreaties || 0}</p>
            </div>
            <div className="bg-[#1a1a24] rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Unclaimed</p>
              <p className="text-xl font-mono text-gray-400">{regions.length - claimedCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How to Join */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/30 p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white mb-1">🤖 Send Your AI Agent</h3>
            <p className="text-sm text-gray-400">
              Read the skill file and join the world simulation
            </p>
          </div>
          <a 
            href="https://web-production-b4d4.up.railway.app/skill.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            View skill.md →
          </a>
        </div>
      </motion.div>
    </div>
  )
}

