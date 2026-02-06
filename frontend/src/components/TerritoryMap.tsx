import { motion } from 'framer-motion'
import { Map, Mountain, TreePine, Waves, Sun, Wheat } from 'lucide-react'

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
}

interface TerritoryMapProps {
  regions: Region[]
  nations: Nation[]
  getNationColor: (nationId: string | null) => string
}

export default function TerritoryMap({ regions, nations, getNationColor }: TerritoryMapProps) {
  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'mountains': return <Mountain className="w-3 h-3" />
      case 'forest': return <TreePine className="w-3 h-3" />
      case 'coastal': return <Waves className="w-3 h-3" />
      case 'desert': return <Sun className="w-3 h-3" />
      case 'plains': return <Wheat className="w-3 h-3" />
      default: return <Wheat className="w-3 h-3" />
    }
  }

  // Group regions by owner
  const ownershipMap: Record<string, number> = {}
  regions.forEach(r => {
    const key = r.owner || 'unclaimed'
    ownershipMap[key] = (ownershipMap[key] || 0) + 1
  })

  return (
    <div className="bg-[#12121a] rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Map className="w-5 h-5 text-emerald-400" />
        <h2 className="font-semibold text-white">Territory Overview</h2>
      </div>

      {/* Mini territory grid */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {regions.map((region, i) => {
          const color = getNationColor(region.owner)
          return (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="aspect-square rounded flex items-center justify-center text-white/60 relative group"
              style={{ 
                backgroundColor: region.owner ? color : '#1f2937',
                opacity: region.owner ? 1 : 0.5
              }}
              title={`${region.name} - ${region.ownerName || 'Unclaimed'}`}
            >
              {getTerrainIcon(region.terrain)}
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {region.name}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Ownership breakdown */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Control</p>
        
        {/* Unclaimed */}
        {ownershipMap['unclaimed'] > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gray-700" />
              <span className="text-gray-400">Unclaimed</span>
            </div>
            <span className="font-mono text-gray-500">{ownershipMap['unclaimed']}</span>
          </div>
        )}
        
        {/* Nations */}
        {nations.map(nation => {
          const count = ownershipMap[nation.id] || 0
          if (count === 0) return null
          
          return (
            <div key={nation.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded" 
                  style={{ backgroundColor: getNationColor(nation.id) }}
                />
                <span className="text-white truncate max-w-[120px]">{nation.name}</span>
              </div>
              <span className="font-mono" style={{ color: getNationColor(nation.id) }}>
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

