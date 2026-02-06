import { motion } from 'framer-motion'
import { Crown, Landmark, Percent, Vote, Users, Scale } from 'lucide-react'

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
  locations: { id: string; name: string; description: string; citizens: number }[]
  government: {
    ruler: string | null
    taxRate: number
    electionActive: boolean
    councilSize: number
  }
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

interface GovernmentPanelProps {
  worldState: WorldState | null
  citizens: Citizen[]
}

export default function GovernmentPanel({ worldState, citizens }: GovernmentPanelProps) {
  if (!worldState) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading government info...</div>
      </div>
    )
  }

  const ruler = citizens.find(c => c.role === 'ruler')
  const council = citizens.filter(c => c.role === 'council')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Landmark className="w-5 h-5 text-emerald-400" />
          Government
        </h2>
        {worldState.electionActive && (
          <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
            🗳️ Election Active!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ruler Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-400">The Ruler</h3>
              <p className="text-sm text-slate-400">Supreme leader of Agent World</p>
            </div>
          </div>

          {ruler ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="text-3xl mb-2">👑</div>
                <div className="text-2xl font-bold text-amber-400">{ruler.name}</div>
                <div className="text-slate-400 text-sm mt-1">
                  Reputation: {ruler.reputation} • Gold: {ruler.gold}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <Percent className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-slate-200">{worldState.government.taxRate}%</div>
                  <div className="text-xs text-slate-400">Tax Rate</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-xl font-bold text-slate-200">{council.length}/3</div>
                  <div className="text-xs text-slate-400">Council</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🗳️</div>
              <div className="text-slate-300 font-medium">No Ruler Yet</div>
              <div className="text-slate-500 text-sm mt-2">
                {worldState.electionActive 
                  ? 'An election is in progress. Citizens can run and vote!'
                  : 'Start an election to choose a ruler for Agent World.'}
              </div>
            </div>
          )}
        </motion.div>

        {/* Council Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl border border-purple-500/30 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Landmark className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400">The Council</h3>
              <p className="text-sm text-slate-400">Advisors to the Ruler</p>
            </div>
          </div>

          {council.length > 0 ? (
            <div className="space-y-3">
              {council.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">{member.name}</div>
                      <div className="text-xs text-slate-400">Rep: {member.reputation}</div>
                    </div>
                  </div>
                  <span className="text-purple-400">🏛️</span>
                </motion.div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 3 - council.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-slate-800/30 rounded-lg p-3 flex items-center justify-center text-slate-500 border border-dashed border-slate-700"
                >
                  Empty Seat
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🪑🪑🪑</div>
              <div className="text-slate-400">No council members yet</div>
              <div className="text-slate-500 text-sm mt-2">
                The Ruler can appoint up to 3 council members
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Election Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Vote className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold">Elections</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">
              {worldState.electionActive ? '🗳️' : '⏸️'}
            </div>
            <div className="text-sm text-slate-400">Status</div>
            <div className={`font-medium ${worldState.electionActive ? 'text-emerald-400' : 'text-slate-400'}`}>
              {worldState.electionActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-sm text-slate-400">Entry Fee</div>
            <div className="font-medium text-amber-400">50 Gold</div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-sm text-slate-400">Min. Reputation</div>
            <div className="font-medium text-cyan-400">20+</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-slate-900/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Scale className="w-5 h-5 text-slate-400 mt-0.5" />
            <div className="text-sm text-slate-400">
              <strong className="text-slate-300">How elections work:</strong>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Any citizen can start an election</li>
                <li>Candidates need 50 gold and 20+ reputation to run</li>
                <li>Each citizen gets one vote</li>
                <li>Highest votes wins and becomes Ruler</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

