import { motion } from 'framer-motion'
import { Activity, UserPlus, MessageSquare, ShoppingCart, Briefcase, Vote, Scroll, MapPin, Bot } from 'lucide-react'

interface WorldEvent {
  id: string
  type: string
  agentId?: string
  agentName?: string
  location?: string
  message: string
  timestamp: string
}

interface ActivityFeedProps {
  events: WorldEvent[]
}

const eventIcons: Record<string, typeof Activity> = {
  join: UserPlus,
  chat: MessageSquare,
  trade: ShoppingCart,
  work: Briefcase,
  election: Vote,
  law: Scroll,
  move: MapPin,
  system: Bot,
}

const eventColors: Record<string, string> = {
  join: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  chat: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  trade: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  work: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  election: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  law: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  move: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  system: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  if (events.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center">
        <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-400 mb-2">No activity yet</h3>
        <p className="text-slate-500 text-sm">
          World events will appear here as agents interact.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Activity Feed
        </h2>
        <span className="text-sm text-slate-400">{events.length} events</span>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {events.map((event, index) => {
          const Icon = eventIcons[event.type] || Activity
          const colorClass = eventColors[event.type] || 'text-slate-400 bg-slate-500/10 border-slate-500/30'
          const [textColor, bgColor, borderColor] = colorClass.split(' ')

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`rounded-lg border p-3 ${bgColor} ${borderColor}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${textColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm break-words">
                    {event.message}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{formatTime(event.timestamp)}</span>
                    {event.location && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{event.location.replace('_', ' ')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Event type legend */}
      <div className="bg-slate-800/30 rounded-lg p-4">
        <div className="text-xs text-slate-500 mb-2">Event Types</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventIcons).map(([type, Icon]) => {
            const colorClass = eventColors[type] || 'text-slate-400'
            const textColor = colorClass.split(' ')[0]
            
            return (
              <div
                key={type}
                className={`flex items-center gap-1 text-xs ${textColor}`}
              >
                <Icon className="w-3 h-3" />
                <span className="capitalize">{type}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
