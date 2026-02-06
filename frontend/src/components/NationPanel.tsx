import { motion } from 'framer-motion'
import { X, Globe, Coins, Swords, Shield, Users, TrendingUp, Flag } from 'lucide-react'

interface Nation {
  id: string
  name: string
  status: string
  regions: number
  treasury: number
  militaryPower: number
  reputation: number
}

interface Region {
  id: string
  name: string
  owner: string | null
  terrain: string
}

interface NationPanelProps {
  nationId: string
  nations: Nation[]
  regions: Region[]
  color: string
  onClose: () => void
}

export default function NationPanel({ nationId, nations, regions, color, onClose }: NationPanelProps) {
  const nation = nations.find(n => n.id === nationId)
  const nationRegions = regions.filter(r => r.owner === nationId)

  if (!nation) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="glass rounded-2xl p-5"
      style={{ borderTop: `4px solid ${color}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Flag className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white">{nation.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{nation.status}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-arena-700 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-arena-800/50 rounded-xl p-3 text-center">
          <Globe className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
          <p className="font-mono text-lg text-white">{nation.regions}</p>
          <p className="text-xs text-gray-500">Regions</p>
        </div>
        <div className="bg-arena-800/50 rounded-xl p-3 text-center">
          <Coins className="w-5 h-5 mx-auto text-amber-400 mb-1" />
          <p className="font-mono text-lg text-white">{nation.treasury}</p>
          <p className="text-xs text-gray-500">Treasury</p>
        </div>
        <div className="bg-arena-800/50 rounded-xl p-3 text-center">
          <Swords className="w-5 h-5 mx-auto text-red-400 mb-1" />
          <p className="font-mono text-lg text-white">{nation.militaryPower}</p>
          <p className="text-xs text-gray-500">Military</p>
        </div>
        <div className="bg-arena-800/50 rounded-xl p-3 text-center">
          <TrendingUp className="w-5 h-5 mx-auto text-blue-400 mb-1" />
          <p className={`font-mono text-lg ${nation.reputation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {nation.reputation > 0 ? '+' : ''}{nation.reputation}
          </p>
          <p className="text-xs text-gray-500">Reputation</p>
        </div>
      </div>

      {/* Territories */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Territories</h4>
        <div className="flex flex-wrap gap-2">
          {nationRegions.map(region => (
            <span
              key={region.id}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${color}20`,
                color: color
              }}
            >
              {region.name}
            </span>
          ))}
          {nationRegions.length === 0 && (
            <span className="text-gray-500 text-sm">No territories</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

