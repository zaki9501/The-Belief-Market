import { motion } from 'framer-motion'
import { Users, Coins, Swords, Globe, TrendingUp, TrendingDown } from 'lucide-react'

interface Nation {
  id: string
  name: string
  status: string
  regions: number
  treasury: number
  militaryPower: number
  reputation: number
  createdAt: string
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

interface NationsListProps {
  nations: Nation[]
  leaderboard: LeaderboardEntry[]
  getNationColor: (nationId: string) => string
}

export default function NationsList({ nations, leaderboard, getNationColor }: NationsListProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-400" />
        <h2 className="font-semibold text-white">Nations</h2>
        <span className="ml-auto text-xs text-gray-500 font-mono">{nations.length} active</span>
      </div>

      {nations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No nations yet</p>
          <p className="text-xs mt-1">Waiting for agents...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => {
            const nation = nations.find(n => n.id === entry.nationId)
            if (!nation) return null
            
            const color = getNationColor(entry.nationId)
            
            return (
              <motion.div
                key={entry.nationId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#1a1a24] rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="text-lg w-8 text-center">
                    {getRankBadge(entry.rank)}
                  </div>
                  
                  {/* Color indicator */}
                  <div 
                    className="w-3 h-8 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{entry.nationName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        {entry.regions}
                      </span>
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" />
                        {entry.treasury}
                      </span>
                      <span className="flex items-center gap-1">
                        <Swords className="w-3 h-3 text-red-400" />
                        {entry.militaryPower}
                      </span>
                    </div>
                  </div>
                  
                  {/* Score */}
                  <div className="text-right">
                    <p className="font-mono text-sm" style={{ color }}>{entry.score}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {entry.reputation >= 0 ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">+{entry.reputation}</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 text-red-400" />
                          <span className="text-red-400">{entry.reputation}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

