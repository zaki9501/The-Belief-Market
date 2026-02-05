import { motion } from 'framer-motion'
import { X, Users, Sparkles, Shield, AlertTriangle } from 'lucide-react'

interface NPC {
  id: number
  conviction: number
}

interface Belief {
  id: string
  name: string
  symbol: string
  coreValues: string[]
  messagingStyle: string
  followerCount: number
}

interface BeliefPanelProps {
  belief: Belief
  color: string
  followers: NPC[]
  onClose: () => void
}

export default function BeliefPanel({ belief, color, followers, onClose }: BeliefPanelProps) {
  const avgConviction = followers.length > 0
    ? Math.round(followers.reduce((sum, f) => sum + f.conviction, 0) / followers.length)
    : 0

  const highConviction = followers.filter(f => f.conviction > 70).length
  const lowConviction = followers.filter(f => f.conviction < 30).length

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass rounded-2xl overflow-hidden"
      style={{ borderTop: `3px solid ${color}` }}
    >
      {/* Header */}
      <div 
        className="p-5 relative"
        style={{ background: `linear-gradient(135deg, ${color}15 0%, transparent 100%)` }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: `${color}30`, color }}
          >
            {belief.symbol.slice(0, 2)}
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {belief.name}
            </h3>
            <span 
              className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${color}20`, color }}
            >
              ${belief.symbol}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-5 border-t border-purple-900/20">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-arena-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Users className="w-3 h-3" />
              <span>Followers</span>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>
              {belief.followerCount}
            </div>
          </div>
          <div className="bg-arena-800 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Avg Conviction</span>
            </div>
            <div className="text-2xl font-bold" style={{ color }}>
              {avgConviction}%
            </div>
          </div>
        </div>

        {/* Conviction breakdown */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-green-400">
              <Shield className="w-3 h-3" />
              High conviction ({'>'}70%)
            </span>
            <span className="font-mono text-green-400">{highConviction}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-yellow-400">
              <AlertTriangle className="w-3 h-3" />
              At risk ({'<'}30%)
            </span>
            <span className="font-mono text-yellow-400">{lowConviction}</span>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="p-5 border-t border-purple-900/20">
        <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Core Values
        </h4>
        <div className="flex flex-wrap gap-2">
          {belief.coreValues.map((value, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-full text-xs capitalize"
              style={{ 
                backgroundColor: `${color}15`,
                color,
                border: `1px solid ${color}30`
              }}
            >
              {value}
            </span>
          ))}
        </div>
      </div>

      {/* Messaging Style */}
      <div className="p-5 border-t border-purple-900/20">
        <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Messaging Style
        </h4>
        <div 
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg capitalize font-medium text-sm"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {belief.messagingStyle === 'authoritarian' && '👊'}
          {belief.messagingStyle === 'rational' && '🧠'}
          {belief.messagingStyle === 'emotional' && '💖'}
          {belief.messagingStyle === 'inclusive' && '🤝'}
          {belief.messagingStyle}
        </div>
      </div>

      {/* Followers list */}
      <div className="p-5 border-t border-purple-900/20">
        <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
          Recent Followers
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {followers.slice(0, 10).map((follower) => (
            <div 
              key={follower.id}
              className="flex items-center justify-between text-xs bg-arena-800 rounded-lg px-3 py-2"
            >
              <span className="text-gray-400 font-mono">NPC #{follower.id}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-arena-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${follower.conviction}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
                <span style={{ color }}>{follower.conviction}%</span>
              </div>
            </div>
          ))}
          {followers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No followers yet</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

