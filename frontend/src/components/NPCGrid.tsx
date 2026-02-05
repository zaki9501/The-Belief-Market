import { motion } from 'framer-motion'
import { User, Brain } from 'lucide-react'

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

interface Belief {
  id: string
  name: string
  symbol: string
}

interface NPCGridProps {
  npcs: NPC[]
  beliefs: Belief[]
  getBeliefColor: (index: number) => string
}

export default function NPCGrid({ npcs, beliefs, getBeliefColor }: NPCGridProps) {
  const neutral = npcs.filter(n => !n.currentBelief)
  const converted = npcs.filter(n => n.currentBelief)

  const getColor = (npc: NPC) => {
    if (!npc.currentBelief) return '#52525b'
    const beliefIndex = beliefs.findIndex(b => b.id === npc.currentBelief)
    return beliefIndex >= 0 ? getBeliefColor(beliefIndex) : '#52525b'
  }

  const getBiasBar = (value: number, color: string) => (
    <div className="w-full h-1 bg-arena-800 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-gray-400" />
        <h2 className="font-display text-lg font-bold text-white">NPCs</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-arena-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-400">{neutral.length}</div>
          <div className="text-xs text-gray-500">Neutral</div>
        </div>
        <div className="bg-arena-800 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{converted.length}</div>
          <div className="text-xs text-gray-500">Converted</div>
        </div>
      </div>

      {/* NPC List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {npcs.map((npc, index) => (
          <motion.div
            key={npc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-arena-800 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getColor(npc) }}
                />
                <span className="text-xs font-mono text-gray-300">
                  NPC #{npc.id}
                </span>
              </div>
              {npc.currentBelief && (
                <span 
                  className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ 
                    backgroundColor: `${getColor(npc)}20`,
                    color: getColor(npc)
                  }}
                >
                  ${beliefs.find(b => b.id === npc.currentBelief)?.symbol || '?'}
                </span>
              )}
            </div>

            {/* Biases (if revealed) */}
            {npc.biases ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-gray-500">Authority</span>
                  {getBiasBar(npc.biases.authority, '#8b5cf6')}
                  <span className="w-6 text-right text-gray-400">{npc.biases.authority}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-gray-500">Fairness</span>
                  {getBiasBar(npc.biases.fairness, '#3b82f6')}
                  <span className="w-6 text-right text-gray-400">{npc.biases.fairness}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-gray-500">Risk</span>
                  {getBiasBar(npc.biases.risk, '#ec4899')}
                  <span className="w-6 text-right text-gray-400">{npc.biases.risk}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-gray-500">Optimism</span>
                  {getBiasBar(npc.biases.optimism, '#f97316')}
                  <span className="w-6 text-right text-gray-400">{npc.biases.optimism}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-gray-500">Individual</span>
                  {getBiasBar(npc.biases.individualism, '#22c55e')}
                  <span className="w-6 text-right text-gray-400">{npc.biases.individualism}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                <Brain className="w-3 h-3" />
                <span>Biases hidden - interact to reveal</span>
              </div>
            )}

            {/* Conviction bar for converted */}
            {npc.currentBelief && (
              <div className="mt-2 pt-2 border-t border-arena-700">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Conviction</span>
                  <span style={{ color: getColor(npc) }}>{npc.conviction}%</span>
                </div>
                <div className="w-full h-1.5 bg-arena-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${npc.conviction}%`,
                      backgroundColor: getColor(npc)
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {npcs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No NPCs spawned yet</p>
            <p className="text-xs mt-1">Start the game to spawn NPCs</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

