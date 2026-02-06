import { motion } from 'framer-motion'
import { Trophy, Crown, Swords, Coins, Globe, TrendingUp } from 'lucide-react'

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

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  getNationColor: (nationId: string) => string
  selectedNation: string | null
  onSelectNation: (nationId: string | null) => void
}

export default function Leaderboard({ entries, getNationColor, selectedNation, onSelectNation }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-300" />
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />
    return <span className="text-gray-500 font-mono text-sm">#{rank}</span>
  }

  return (
    <div className="glass rounded-2xl p-5 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h2 className="font-display text-lg font-bold text-white">Leaderboard</h2>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No nations yet</p>
          <p className="text-xs mt-1">Waiting for agents to join...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const color = getNationColor(entry.nationId)
            const isSelected = selectedNation === entry.nationId
            
            return (
              <motion.button
                key={entry.nationId}
                onClick={() => onSelectNation(isSelected ? null : entry.nationId)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  w-full text-left rounded-xl p-3 transition-all
                  ${isSelected 
                    ? 'bg-arena-700 ring-2' 
                    : 'bg-arena-800/50 hover:bg-arena-700/50'
                  }
                `}
                style={{ 
                  borderLeft: `4px solid ${color}`,
                  ringColor: isSelected ? color : undefined
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  {/* Nation Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{entry.nationName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
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
                    <p className="font-mono text-sm" style={{ color }}>
                      {entry.score}
                    </p>
                    <p className="text-xs text-gray-500">score</p>
                  </div>
                </div>
                
                {/* Reputation bar */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rep:</span>
                  <div className="flex-1 h-1.5 bg-arena-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, (entry.reputation + 100) / 2)}%` }}
                      className={`h-full rounded-full ${
                        entry.reputation >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-mono ${
                    entry.reputation >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {entry.reputation > 0 ? '+' : ''}{entry.reputation}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
