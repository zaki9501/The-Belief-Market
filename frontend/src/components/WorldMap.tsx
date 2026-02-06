import { motion } from 'framer-motion'
import { Mountain, TreePine, Waves, Sun, Wheat, Shield, Users, Zap, Coins, Hammer } from 'lucide-react'

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

export default function WorldMap({ regions, getNationColor, selectedRegion, onSelectRegion }: WorldMapProps) {
  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'mountains': return <Mountain className="w-5 h-5" />
      case 'forest': return <TreePine className="w-5 h-5" />
      case 'coastal': return <Waves className="w-5 h-5" />
      case 'desert': return <Sun className="w-5 h-5" />
      case 'plains': return <Wheat className="w-5 h-5" />
      default: return <Wheat className="w-5 h-5" />
    }
  }

  const getTerrainBg = (terrain: string) => {
    switch (terrain) {
      case 'mountains': return 'from-slate-700 to-slate-800'
      case 'forest': return 'from-green-800 to-green-900'
      case 'coastal': return 'from-blue-700 to-blue-800'
      case 'desert': return 'from-amber-700 to-amber-800'
      case 'plains': return 'from-lime-700 to-lime-800'
      default: return 'from-gray-700 to-gray-800'
    }
  }

  const selected = selectedRegion ? regions.find(r => r.id === selectedRegion) : null

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-white">World Map</h2>
        <span className="text-xs text-gray-500 font-mono">{regions.length} regions</span>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {regions.map((region) => {
          const color = getNationColor(region.owner)
          const isSelected = selectedRegion === region.id
          
          return (
            <motion.button
              key={region.id}
              onClick={() => onSelectRegion(isSelected ? null : region.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative aspect-square rounded-lg p-2 transition-all
                bg-gradient-to-br ${getTerrainBg(region.terrain)}
                ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-arena-900' : ''}
              `}
              style={{
                borderColor: color,
                borderWidth: region.owner ? '3px' : '1px',
                borderStyle: 'solid'
              }}
            >
              {/* Owner indicator */}
              {region.owner && (
                <div 
                  className="absolute top-1 right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              
              {/* Terrain icon */}
              <div className="absolute top-1 left-1 text-white/60">
                {getTerrainIcon(region.terrain)}
              </div>
              
              {/* Region name */}
              <div className="absolute bottom-1 left-1 right-1">
                <p className="text-[10px] text-white/80 truncate font-medium">
                  {region.name.split(' ')[0]}
                </p>
              </div>
              
              {/* Defense indicator */}
              {region.defenseLevel > 50 && (
                <Shield className="absolute bottom-1 right-1 w-3 h-3 text-yellow-400" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Selected Region Details */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-arena-800/50 rounded-xl p-4 border border-arena-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getTerrainIcon(selected.terrain)}
              <h3 className="font-bold text-white">{selected.name}</h3>
            </div>
            <span 
              className="text-xs px-2 py-1 rounded-full font-mono"
              style={{ 
                backgroundColor: `${getNationColor(selected.owner)}20`,
                color: getNationColor(selected.owner)
              }}
            >
              {selected.ownerName || 'Unclaimed'}
            </span>
          </div>

          {/* Resources */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="text-center">
              <Zap className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
              <p className="text-xs text-gray-400">Energy</p>
              <p className="font-mono text-sm text-white">{selected.resources.energy}</p>
            </div>
            <div className="text-center">
              <Wheat className="w-4 h-4 mx-auto text-green-400 mb-1" />
              <p className="text-xs text-gray-400">Food</p>
              <p className="font-mono text-sm text-white">{selected.resources.food}</p>
            </div>
            <div className="text-center">
              <Coins className="w-4 h-4 mx-auto text-amber-400 mb-1" />
              <p className="text-xs text-gray-400">Gold</p>
              <p className="font-mono text-sm text-white">{selected.resources.gold}</p>
            </div>
            <div className="text-center">
              <Hammer className="w-4 h-4 mx-auto text-slate-400 mb-1" />
              <p className="text-xs text-gray-400">Minerals</p>
              <p className="font-mono text-sm text-white">{selected.resources.minerals}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{selected.population} pop</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-4 h-4" />
              <span>{selected.defenseLevel} defense</span>
            </div>
            <div className="text-gray-500 text-xs">
              {selected.terrain}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Mountain className="w-3 h-3" /> Mountains
        </div>
        <div className="flex items-center gap-1">
          <TreePine className="w-3 h-3" /> Forest
        </div>
        <div className="flex items-center gap-1">
          <Waves className="w-3 h-3" /> Coastal
        </div>
        <div className="flex items-center gap-1">
          <Sun className="w-3 h-3" /> Desert
        </div>
        <div className="flex items-center gap-1">
          <Wheat className="w-3 h-3" /> Plains
        </div>
      </div>
    </div>
  )
}

