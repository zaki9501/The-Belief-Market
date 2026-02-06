import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, TreePine, Waves, Sun, Wheat, Shield, Users, Zap, Coins, Hammer, Crown, Flag } from 'lucide-react'

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

interface WorldMapProps {
  regions: Region[]
  getNationColor: (nationId: string | null) => string
  selectedRegion: string | null
  onSelectRegion: (regionId: string | null) => void
}

// Hex-like map layout positions (row, col) for 20 regions
const MAP_LAYOUT: Record<string, { row: number; col: number; offsetX?: number }> = {
  'region_0': { row: 0, col: 1 },
  'region_1': { row: 0, col: 2 },
  'region_2': { row: 0, col: 3 },
  'region_3': { row: 0, col: 4 },
  'region_4': { row: 1, col: 0, offsetX: 40 },
  'region_5': { row: 1, col: 1, offsetX: 40 },
  'region_6': { row: 1, col: 2, offsetX: 40 },
  'region_7': { row: 1, col: 3, offsetX: 40 },
  'region_8': { row: 1, col: 4, offsetX: 40 },
  'region_9': { row: 2, col: 0 },
  'region_10': { row: 2, col: 1 },
  'region_11': { row: 2, col: 2 },
  'region_12': { row: 2, col: 3 },
  'region_13': { row: 2, col: 4 },
  'region_14': { row: 3, col: 0, offsetX: 40 },
  'region_15': { row: 3, col: 1, offsetX: 40 },
  'region_16': { row: 3, col: 2, offsetX: 40 },
  'region_17': { row: 3, col: 3, offsetX: 40 },
  'region_18': { row: 3, col: 4, offsetX: 40 },
  'region_19': { row: 4, col: 2 },
}

export default function WorldMap({ regions, getNationColor, selectedRegion, onSelectRegion }: WorldMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const getTerrainIcon = (terrain: string, size: string = 'w-4 h-4') => {
    switch (terrain) {
      case 'mountains': return <Mountain className={`${size} text-slate-300`} />
      case 'forest': return <TreePine className={`${size} text-emerald-400`} />
      case 'coastal': return <Waves className={`${size} text-blue-400`} />
      case 'desert': return <Sun className={`${size} text-amber-400`} />
      case 'plains': return <Wheat className={`${size} text-lime-400`} />
      default: return <Wheat className={`${size} text-lime-400`} />
    }
  }

  const getTerrainGradient = (terrain: string, isOwned: boolean) => {
    const opacity = isOwned ? '90' : '60'
    switch (terrain) {
      case 'mountains': return `linear-gradient(135deg, #475569${opacity} 0%, #334155${opacity} 100%)`
      case 'forest': return `linear-gradient(135deg, #166534${opacity} 0%, #14532d${opacity} 100%)`
      case 'coastal': return `linear-gradient(135deg, #0369a1${opacity} 0%, #075985${opacity} 100%)`
      case 'desert': return `linear-gradient(135deg, #b45309${opacity} 0%, #92400e${opacity} 100%)`
      case 'plains': return `linear-gradient(135deg, #4d7c0f${opacity} 0%, #3f6212${opacity} 100%)`
      default: return `linear-gradient(135deg, #4d7c0f${opacity} 0%, #3f6212${opacity} 100%)`
    }
  }

  const selected = selectedRegion ? regions.find(r => r.id === selectedRegion) : null
  const hovered = hoveredRegion ? regions.find(r => r.id === hoveredRegion) : null
  const displayRegion = hovered || selected

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Flag className="w-5 h-5 text-emerald-400" />
          World Map
        </h2>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-gray-600" /> Unclaimed
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-purple-500" /> Claimed
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div 
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0c1222 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '420px'
        }}
      >
        {/* Ocean/Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)
            `
          }}
        />

        {/* Grid lines for map feel */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#4a5568" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection Lines between adjacent regions */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {regions.map(region => {
            const pos = MAP_LAYOUT[region.id]
            if (!pos) return null
            
            const x1 = pos.col * 95 + (pos.offsetX || 0) + 60
            const y1 = pos.row * 85 + 50
            
            return region.adjacentRegions.map(adjId => {
              const adjPos = MAP_LAYOUT[adjId]
              if (!adjPos) return null
              
              const x2 = adjPos.col * 95 + (adjPos.offsetX || 0) + 60
              const y2 = adjPos.row * 85 + 50
              
              // Only draw line once (from lower id to higher id)
              if (region.id > adjId) return null
              
              const sameOwner = region.owner && region.owner === regions.find(r => r.id === adjId)?.owner
              
              return (
                <line
                  key={`${region.id}-${adjId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={sameOwner ? getNationColor(region.owner) : '#374151'}
                  strokeWidth={sameOwner ? 2 : 1}
                  strokeOpacity={sameOwner ? 0.6 : 0.3}
                  strokeDasharray={sameOwner ? '' : '4,4'}
                />
              )
            })
          })}
        </svg>

        {/* Regions */}
        <div className="relative" style={{ height: '420px' }}>
          {regions.map((region) => {
            const pos = MAP_LAYOUT[region.id]
            if (!pos) return null
            
            const color = getNationColor(region.owner)
            const isSelected = selectedRegion === region.id
            const isOwned = !!region.owner
            
            const left = pos.col * 95 + (pos.offsetX || 0) + 15
            const top = pos.row * 85 + 15
            
            return (
              <motion.button
                key={region.id}
                onClick={() => onSelectRegion(isSelected ? null : region.id)}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, zIndex: 20 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: parseInt(region.id.split('_')[1]) * 0.03 }}
                className={`
                  absolute w-[90px] h-[70px] rounded-lg
                  flex flex-col items-center justify-center
                  transition-all duration-200 cursor-pointer
                  ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent z-10' : ''}
                `}
                style={{
                  left: `${left}px`,
                  top: `${top}px`,
                  background: getTerrainGradient(region.terrain, isOwned),
                  border: `2px solid ${isOwned ? color : '#374151'}`,
                  boxShadow: isOwned 
                    ? `0 0 20px ${color}40, inset 0 0 20px ${color}20` 
                    : 'none',
                }}
              >
                {/* Nation flag/marker */}
                {isOwned && (
                  <div 
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
                
                {/* Terrain icon */}
                <div className="mb-1">
                  {getTerrainIcon(region.terrain, 'w-5 h-5')}
                </div>
                
                {/* Region name (shortened) */}
                <p className="text-[9px] text-white/90 font-semibold text-center leading-tight px-1 truncate w-full">
                  {region.name.split(' ').slice(0, 2).join(' ')}
                </p>
                
                {/* Defense indicator */}
                {region.defenseLevel > 50 && (
                  <Shield className="absolute bottom-1 right-1 w-3 h-3 text-yellow-400/80" />
                )}
                
                {/* Population indicator */}
                {region.population > 500 && (
                  <Users className="absolute bottom-1 left-1 w-3 h-3 text-blue-400/80" />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Compass Rose */}
        <div className="absolute bottom-3 right-3 text-gray-500 opacity-50">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M20 5 L22 15 L20 12 L18 15 Z" fill="currentColor"/>
            <path d="M20 35 L22 25 L20 28 L18 25 Z" fill="currentColor" opacity="0.5"/>
            <path d="M5 20 L15 18 L12 20 L15 22 Z" fill="currentColor" opacity="0.5"/>
            <path d="M35 20 L25 18 L28 20 L25 22 Z" fill="currentColor" opacity="0.5"/>
            <text x="20" y="3" textAnchor="middle" fontSize="6" fill="currentColor">N</text>
          </svg>
        </div>
      </div>

      {/* Region Info Panel */}
      <AnimatePresence>
        {displayRegion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 bg-arena-800/80 rounded-xl p-4 border border-arena-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: getTerrainGradient(displayRegion.terrain, true) }}
                >
                  {getTerrainIcon(displayRegion.terrain, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="font-bold text-white">{displayRegion.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{displayRegion.terrain} terrain</p>
                </div>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ 
                  backgroundColor: `${getNationColor(displayRegion.owner)}20`,
                  color: getNationColor(displayRegion.owner),
                  border: `1px solid ${getNationColor(displayRegion.owner)}40`
                }}
              >
                {displayRegion.ownerName || '⚪ Unclaimed'}
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-arena-900/50 rounded-lg p-2 text-center">
                <Zap className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
                <p className="font-mono text-sm text-white">{displayRegion.resources.energy}</p>
                <p className="text-[10px] text-gray-500">Energy</p>
              </div>
              <div className="bg-arena-900/50 rounded-lg p-2 text-center">
                <Wheat className="w-4 h-4 mx-auto text-green-400 mb-1" />
                <p className="font-mono text-sm text-white">{displayRegion.resources.food}</p>
                <p className="text-[10px] text-gray-500">Food</p>
              </div>
              <div className="bg-arena-900/50 rounded-lg p-2 text-center">
                <Coins className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <p className="font-mono text-sm text-white">{displayRegion.resources.gold}</p>
                <p className="text-[10px] text-gray-500">Gold</p>
              </div>
              <div className="bg-arena-900/50 rounded-lg p-2 text-center">
                <Hammer className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                <p className="font-mono text-sm text-white">{displayRegion.resources.minerals}</p>
                <p className="text-[10px] text-gray-500">Minerals</p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-blue-400">
                  <Users className="w-3 h-3" />
                  {displayRegion.population} pop
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <Shield className="w-3 h-3" />
                  {displayRegion.defenseLevel} def
                </span>
              </div>
              <span className="text-gray-500">
                {displayRegion.adjacentRegions.length} adjacent regions
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Mountain className="w-3 h-3 text-slate-400" /> Mountains
        </div>
        <div className="flex items-center gap-1">
          <TreePine className="w-3 h-3 text-emerald-400" /> Forest
        </div>
        <div className="flex items-center gap-1">
          <Waves className="w-3 h-3 text-blue-400" /> Coastal
        </div>
        <div className="flex items-center gap-1">
          <Sun className="w-3 h-3 text-amber-400" /> Desert
        </div>
        <div className="flex items-center gap-1">
          <Wheat className="w-3 h-3 text-lime-400" /> Plains
        </div>
      </div>
    </div>
  )
}
