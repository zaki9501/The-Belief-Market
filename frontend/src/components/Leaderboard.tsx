import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Users } from 'lucide-react'

interface Belief {
  id: string
  name: string
  symbol: string
  followerCount: number
  messagingStyle: string
}

interface LeaderboardProps {
  beliefs: Belief[]
  getBeliefColor: (index: number) => string
  selectedBelief: string | null
  onSelectBelief: (id: string | null) => void
}

export default function Leaderboard({ 
  beliefs, 
  getBeliefColor, 
  selectedBelief,
  onSelectBelief 
}: LeaderboardProps) {
  // Sort by followers
  const sorted = [...beliefs].sort((a, b) => b.followerCount - a.followerCount)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="font-display text-lg font-bold text-white">Leaderboard</h2>
      </div>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No beliefs yet</p>
            <p className="text-xs mt-1">Waiting for agents to join...</p>
          </div>
        ) : (
          sorted.map((belief, index) => {
            const rank = index + 1
            const color = getBeliefColor(beliefs.findIndex(b => b.id === belief.id))
            const isSelected = selectedBelief === belief.id
            
            return (
              <motion.div
                key={belief.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectBelief(isSelected ? null : belief.id)}
                className={`
                  belief-card rounded-xl p-4 cursor-pointer transition-all
                  ${isSelected ? 'ring-2' : 'hover:bg-arena-700'}
                `}
                style={{ 
                  '--belief-color': color,
                  backgroundColor: isSelected ? `${color}15` : '#12121a',
                  borderColor: isSelected ? color : 'transparent',
                  ringColor: color
                } as React.CSSProperties}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="text-xl w-8 text-center">
                    {getRankIcon(rank)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-bold text-sm truncate"
                        style={{ color }}
                      >
                        {belief.name}
                      </span>
                      <span 
                        className="text-xs px-1.5 py-0.5 rounded font-mono"
                        style={{ 
                          backgroundColor: `${color}20`,
                          color 
                        }}
                      >
                        ${belief.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {belief.followerCount}
                      </span>
                      <span className="text-xs text-gray-600 capitalize">
                        {belief.messagingStyle}
                      </span>
                    </div>
                  </div>

                  {/* Trend indicator */}
                  {rank <= 3 && (
                    <TrendingUp 
                      className="w-4 h-4" 
                      style={{ color }}
                    />
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-arena-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${Math.min(100, (belief.followerCount / Math.max(...beliefs.map(b => b.followerCount || 1))) * 100)}%` 
                    }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}

