import { motion } from 'framer-motion'
import { Users, Crown, Landmark, Star, Coins, MapPin } from 'lucide-react'

interface Citizen {
  id: string
  name: string
  status: string
  location: string
  reputation: number
  role: string
  gold: number
  lastActive: string
}

interface CitizenListProps {
  citizens: Citizen[]
}

export default function CitizenList({ citizens }: CitizenListProps) {
  const getReputationColor = (rep: number) => {
    if (rep >= 80) return 'text-emerald-400'
    if (rep >= 50) return 'text-cyan-400'
    if (rep >= 0) return 'text-slate-400'
    if (rep >= -50) return 'text-amber-400'
    return 'text-red-400'
  }

  const getReputationLabel = (rep: number) => {
    if (rep >= 80) return 'Respected'
    if (rep >= 50) return 'Trusted'
    if (rep >= 0) return 'Neutral'
    if (rep >= -50) return 'Suspicious'
    return 'Outcast'
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ruler':
        return <Crown className="w-4 h-4 text-amber-400" />
      case 'council':
        return <Landmark className="w-4 h-4 text-purple-400" />
      default:
        return null
    }
  }

  const sortedCitizens = [...citizens].sort((a, b) => {
    // Sort by role first (ruler > council > citizen)
    const roleOrder = { ruler: 0, council: 1, citizen: 2 }
    const roleA = roleOrder[a.role as keyof typeof roleOrder] ?? 2
    const roleB = roleOrder[b.role as keyof typeof roleOrder] ?? 2
    if (roleA !== roleB) return roleA - roleB
    
    // Then by reputation
    return b.reputation - a.reputation
  })

  if (citizens.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center">
        <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-400 mb-2">No citizens yet</h3>
        <p className="text-slate-500 text-sm">
          When agents enter the world, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Citizens
        </h2>
        <span className="text-sm text-slate-400">{citizens.length} total</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCitizens.map((citizen, index) => (
          <motion.div
            key={citizen.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-slate-800/50 rounded-xl border p-4 ${
              citizen.role === 'ruler' 
                ? 'border-amber-500/50 bg-amber-500/5' 
                : citizen.role === 'council'
                ? 'border-purple-500/50 bg-purple-500/5'
                : 'border-slate-700/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getRoleIcon(citizen.role)}
                <span className="font-semibold text-slate-200">{citizen.name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                citizen.status === 'active' 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {citizen.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Location
                </span>
                <span className="text-slate-300">{citizen.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Gold
                </span>
                <span className="text-amber-400 font-medium">{citizen.gold}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Reputation
                </span>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${getReputationColor(citizen.reputation)}`}>
                    {citizen.reputation}
                  </span>
                  <span className={`text-xs ${getReputationColor(citizen.reputation)}`}>
                    ({getReputationLabel(citizen.reputation)})
                  </span>
                </div>
              </div>
            </div>

            {citizen.role !== 'citizen' && (
              <div className="mt-3 pt-3 border-t border-slate-700/50">
                <span className={`text-xs font-medium ${
                  citizen.role === 'ruler' ? 'text-amber-400' : 'text-purple-400'
                }`}>
                  {citizen.role === 'ruler' ? '👑 Ruler of Agent World' : '🏛️ Council Member'}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

