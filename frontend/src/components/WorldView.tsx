import { motion } from 'framer-motion'
import { MapPin, Users, Building2, ShoppingBag, Landmark, Beer, Hammer, Wallet } from 'lucide-react'

interface WorldState {
  totalCitizens: number
  onlineCitizens: number
  totalGold: number
  totalTransactions: number
  currentRuler: string | null
  rulerName: string | null
  taxRate: number
  electionActive: boolean
  epoch: number
  locations: Location[]
  government: {
    ruler: string | null
    taxRate: number
    electionActive: boolean
    councilSize: number
  }
}

interface Location {
  id: string
  name: string
  description: string
  citizens: number
}

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

interface WorldViewProps {
  worldState: WorldState | null
  citizens: Citizen[]
  selectedLocation: string | null
  onSelectLocation: (location: string | null) => void
}

const locationIcons: Record<string, typeof MapPin> = {
  town_square: Building2,
  marketplace: ShoppingBag,
  town_hall: Landmark,
  tavern: Beer,
  workshop: Hammer,
  bank: Wallet,
}

const locationColors: Record<string, string> = {
  town_square: 'from-emerald-500 to-teal-600',
  marketplace: 'from-amber-500 to-orange-600',
  town_hall: 'from-purple-500 to-indigo-600',
  tavern: 'from-rose-500 to-pink-600',
  workshop: 'from-slate-500 to-zinc-600',
  bank: 'from-yellow-500 to-amber-600',
}

const locationPositions: Record<string, { x: number; y: number }> = {
  town_square: { x: 50, y: 30 },
  marketplace: { x: 75, y: 45 },
  town_hall: { x: 25, y: 45 },
  tavern: { x: 65, y: 70 },
  workshop: { x: 35, y: 70 },
  bank: { x: 50, y: 85 },
}

export default function WorldView({ worldState, citizens, selectedLocation, onSelectLocation }: WorldViewProps) {
  if (!worldState) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading world...</div>
      </div>
    )
  }

  const getCitizensAtLocation = (locationId: string) => {
    const locationName = worldState.locations.find(l => l.id === locationId)?.name || ''
    return citizens.filter(c => c.location === locationName)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* World Map */}
      <div className="lg:col-span-2">
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 relative overflow-hidden">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            World Map
          </h2>

          {/* Map Background */}
          <div className="relative h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {/* Town Square to others */}
              <line x1="50%" y1="30%" x2="75%" y2="45%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="30%" x2="25%" y2="45%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="30%" x2="65%" y2="70%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="30%" x2="35%" y2="70%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              <line x1="50%" y1="30%" x2="50%" y2="85%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              {/* Marketplace to Tavern */}
              <line x1="75%" y1="45%" x2="65%" y2="70%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              {/* Town Hall to Workshop */}
              <line x1="25%" y1="45%" x2="35%" y2="70%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              {/* Workshop to Bank */}
              <line x1="35%" y1="70%" x2="50%" y2="85%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
              {/* Tavern to Bank */}
              <line x1="65%" y1="70%" x2="50%" y2="85%" stroke="#334155" strokeWidth="2" strokeDasharray="4" />
            </svg>

            {/* Locations */}
            {worldState.locations.map((location) => {
              const Icon = locationIcons[location.id] || MapPin
              const position = locationPositions[location.id] || { x: 50, y: 50 }
              const colorClass = locationColors[location.id] || 'from-slate-500 to-slate-600'
              const isSelected = selectedLocation === location.id
              const citizensHere = getCitizensAtLocation(location.id)

              return (
                <motion.div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${position.x}%`, top: `${position.y}%`, zIndex: 10 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onSelectLocation(isSelected ? null : location.id)}
                >
                  <div className={`relative ${isSelected ? 'z-20' : ''}`}>
                    {/* Glow effect */}
                    {location.citizens > 0 && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-2xl blur-xl opacity-40 animate-pulse`} />
                    )}
                    
                    {/* Main card */}
                    <div className={`relative bg-gradient-to-br ${colorClass} rounded-2xl p-4 shadow-xl ${
                      isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                    }`}>
                      <div className="flex flex-col items-center gap-2">
                        <Icon className="w-8 h-8 text-white" />
                        <span className="text-white font-semibold text-sm whitespace-nowrap">{location.name}</span>
                        <div className="flex items-center gap-1 bg-black/20 rounded-full px-2 py-0.5">
                          <Users className="w-3 h-3 text-white/80" />
                          <span className="text-white/90 text-xs font-medium">{location.citizens}</span>
                        </div>
                      </div>
                    </div>

                    {/* Citizens preview */}
                    {isSelected && citizensHere.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-800 rounded-lg p-3 shadow-xl border border-slate-700 min-w-[200px] z-30"
                      >
                        <div className="text-xs text-slate-400 mb-2">Citizens here:</div>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {citizensHere.map((citizen) => (
                            <div key={citizen.id} className="flex items-center justify-between text-sm">
                              <span className="text-slate-200">{citizen.name}</span>
                              <span className={`text-xs ${
                                citizen.role === 'ruler' ? 'text-amber-400' :
                                citizen.role === 'council' ? 'text-purple-400' :
                                'text-slate-500'
                              }`}>
                                {citizen.role === 'ruler' ? '👑' : citizen.role === 'council' ? '🏛️' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {/* World title */}
            <div className="absolute top-4 left-4 text-slate-500 text-sm font-medium">
              Agent World • Epoch {worldState.epoch}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* World Stats */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold mb-4">World Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Citizens</span>
              <span className="text-emerald-400 font-bold">{worldState.totalCitizens}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Online Now</span>
              <span className="text-cyan-400 font-bold">{worldState.onlineCitizens}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Gold</span>
              <span className="text-amber-400 font-bold">{worldState.totalGold.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Transactions</span>
              <span className="text-purple-400 font-bold">{worldState.totalTransactions}</span>
            </div>
          </div>
        </div>

        {/* Current Ruler */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">👑</span>
            Current Ruler
          </h3>
          {worldState.rulerName ? (
            <div className="space-y-3">
              <div className="text-xl font-bold text-amber-400">{worldState.rulerName}</div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax Rate</span>
                <span className="text-slate-200">{worldState.government.taxRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Council Size</span>
                <span className="text-slate-200">{worldState.government.councilSize}/3</span>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-center py-4">
              <div className="text-4xl mb-2">🗳️</div>
              <div>No ruler yet</div>
              <div className="text-sm mt-1">
                {worldState.electionActive ? 'Election in progress!' : 'Start an election!'}
              </div>
            </div>
          )}
        </div>

        {/* Location Details */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"
          >
            <h3 className="text-lg font-semibold mb-2">
              {worldState.locations.find(l => l.id === selectedLocation)?.name}
            </h3>
            <p className="text-slate-400 text-sm">
              {worldState.locations.find(l => l.id === selectedLocation)?.description}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

