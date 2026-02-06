import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scroll, Swords, Flag, Handshake, AlertTriangle, 
  Clock, Globe, Crown, Shield 
} from 'lucide-react'

interface WorldEvent {
  id: string
  type: string
  nationName?: string
  targetNationName?: string
  regionName?: string
  message: string
  timestamp: string
}

interface Nation {
  id: string
  name: string
}

interface EventFeedProps {
  events: WorldEvent[]
  getNationColor: (nationId: string | null) => string
  nations: Nation[]
}

export default function EventFeed({ events, getNationColor, nations }: EventFeedProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'nation_founded': return <Flag className="w-4 h-4 text-emerald-400" />
      case 'war_declared': return <Swords className="w-4 h-4 text-red-400" />
      case 'battle_result': return <Shield className="w-4 h-4 text-orange-400" />
      case 'region_captured': return <Crown className="w-4 h-4 text-yellow-400" />
      case 'treaty_signed': return <Handshake className="w-4 h-4 text-blue-400" />
      case 'treaty_broken': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'alliance_formed': return <Handshake className="w-4 h-4 text-purple-400" />
      case 'epoch_end': return <Clock className="w-4 h-4 text-cyan-400" />
      case 'system': return <Globe className="w-4 h-4 text-gray-400" />
      default: return <Scroll className="w-4 h-4 text-gray-400" />
    }
  }

  const getEventBg = (type: string) => {
    switch (type) {
      case 'nation_founded': return 'border-emerald-500/30 bg-emerald-500/5'
      case 'war_declared': return 'border-red-500/30 bg-red-500/5'
      case 'battle_result': return 'border-orange-500/30 bg-orange-500/5'
      case 'region_captured': return 'border-yellow-500/30 bg-yellow-500/5'
      case 'treaty_signed': return 'border-blue-500/30 bg-blue-500/5'
      case 'treaty_broken': return 'border-red-500/30 bg-red-500/5'
      case 'alliance_formed': return 'border-purple-500/30 bg-purple-500/5'
      case 'epoch_end': return 'border-cyan-500/30 bg-cyan-500/5'
      default: return 'border-gray-500/20 bg-gray-500/5'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getNationColorByName = (name: string | undefined) => {
    if (!name) return '#6b7280'
    const nation = nations.find(n => n.name === name)
    return nation ? getNationColor(nation.id) : '#6b7280'
  }

  return (
    <div className="glass rounded-2xl p-5 h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Scroll className="w-5 h-5 text-cyan-400" />
        <h2 className="font-display text-lg font-bold text-white">World Events</h2>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No events yet</p>
              <p className="text-xs mt-1">The world awaits...</p>
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={`rounded-lg border p-3 ${getEventBg(event.type)}`}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  {getEventIcon(event.type)}
                  
                  {event.nationName && (
                    <span 
                      className="font-semibold text-sm"
                      style={{ color: getNationColorByName(event.nationName) }}
                    >
                      {event.nationName}
                    </span>
                  )}
                  
                  <span className="text-xs text-gray-500 ml-auto font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {event.message}
                </p>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

