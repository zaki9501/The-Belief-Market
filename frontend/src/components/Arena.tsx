import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface NPC {
  id: number
  currentBelief: string | null
  conviction: number
}

interface Belief {
  id: string
  name: string
  symbol: string
  followerCount: number
}

interface ArenaProps {
  npcs: NPC[]
  beliefs: Belief[]
  getBeliefColor: (index: number) => string
  selectedBelief: string | null
}

export default function Arena({ npcs, beliefs, getBeliefColor, selectedBelief }: ArenaProps) {
  // Position NPCs in concentric circles around their belief
  const npcPositions = useMemo(() => {
    const positions: { npc: NPC; x: number; y: number; color: string }[] = []
    const centerX = 300
    const centerY = 250
    
    // Group NPCs by belief
    const beliefGroups: Record<string, NPC[]> = { neutral: [] }
    beliefs.forEach(b => beliefGroups[b.id] = [])
    
    npcs.forEach(npc => {
      if (npc.currentBelief) {
        beliefGroups[npc.currentBelief]?.push(npc)
      } else {
        beliefGroups.neutral.push(npc)
      }
    })
    
    // Position belief clusters
    const beliefCount = beliefs.length
    beliefs.forEach((belief, beliefIndex) => {
      const angle = (beliefIndex / beliefCount) * 2 * Math.PI - Math.PI / 2
      const clusterCenterX = centerX + Math.cos(angle) * 150
      const clusterCenterY = centerY + Math.sin(angle) * 120
      
      const followers = beliefGroups[belief.id] || []
      followers.forEach((npc, i) => {
        const spiralAngle = i * 0.5
        const spiralRadius = 20 + i * 3
        positions.push({
          npc,
          x: clusterCenterX + Math.cos(spiralAngle) * spiralRadius,
          y: clusterCenterY + Math.sin(spiralAngle) * spiralRadius,
          color: getBeliefColor(beliefIndex)
        })
      })
    })
    
    // Position neutral NPCs in center
    beliefGroups.neutral.forEach((npc, i) => {
      const angle = (i / beliefGroups.neutral.length) * 2 * Math.PI
      const radius = 30 + (i % 3) * 15
      positions.push({
        npc,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        color: '#52525b'
      })
    })
    
    return positions
  }, [npcs, beliefs, getBeliefColor])

  return (
    <div className="glass rounded-2xl p-6 glow-purple">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-white">The Arena</h2>
        <span className="text-sm text-gray-400 font-mono">
          {npcs.filter(n => n.currentBelief).length} / {npcs.length} converted
        </span>
      </div>

      {/* Arena visualization */}
      <div className="relative bg-arena-900 rounded-xl overflow-hidden" style={{ height: '500px' }}>
        {/* Background grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#8b5cf6" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
          <span className="text-gray-600 text-xs font-mono uppercase tracking-wider">
            Neutral Zone
          </span>
        </div>

        {/* Belief cluster labels */}
        {beliefs.map((belief, index) => {
          const angle = (index / beliefs.length) * 2 * Math.PI - Math.PI / 2
          const x = 300 + Math.cos(angle) * 200
          const y = 250 + Math.sin(angle) * 170
          
          return (
            <motion.div
              key={belief.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center z-20"
              style={{ left: x, top: y }}
            >
              <div 
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ 
                  backgroundColor: `${getBeliefColor(index)}20`,
                  color: getBeliefColor(index),
                  border: `1px solid ${getBeliefColor(index)}40`
                }}
              >
                ${belief.symbol}
              </div>
              <div className="text-gray-500 text-xs mt-1 font-mono">
                {belief.followerCount} followers
              </div>
            </motion.div>
          )
        })}

        {/* NPC dots */}
        <svg className="absolute inset-0 w-full h-full">
          {npcPositions.map(({ npc, x, y, color }, index) => (
            <motion.g key={npc.id}>
              {/* Glow effect for converted */}
              {npc.currentBelief && (
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 12, opacity: 0.3 }}
                  transition={{ delay: index * 0.01, duration: 0.5 }}
                  cx={x}
                  cy={y}
                  fill={color}
                  className="blur-sm"
                />
              )}
              
              {/* Main dot */}
              <motion.circle
                initial={{ cx: 300, cy: 250, r: 0 }}
                animate={{ 
                  cx: x, 
                  cy: y, 
                  r: npc.currentBelief ? 4 + (npc.conviction / 25) : 3,
                  opacity: selectedBelief && npc.currentBelief !== selectedBelief ? 0.3 : 1
                }}
                transition={{ 
                  delay: index * 0.01,
                  type: 'spring',
                  stiffness: 100,
                  damping: 15
                }}
                fill={color}
                className="cursor-pointer hover:brightness-125 transition-all"
              />
              
              {/* Conviction ring for high-conviction followers */}
              {npc.conviction > 70 && (
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: 8, opacity: 0.5 }}
                  cx={x}
                  cy={y}
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              )}
            </motion.g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-gray-400">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-gray-400">Converted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-dashed" />
              <span className="text-gray-400">High conviction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

