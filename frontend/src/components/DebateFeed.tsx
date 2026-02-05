import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Zap, Heart, Shield, Swords, RefreshCw, Users } from 'lucide-react'

interface ConversationMessage {
  id: string
  type: 'persuasion' | 'adaptation' | 'conversion' | 'defection' | 'system' | 'debate'
  agentName?: string
  beliefName?: string
  beliefSymbol?: string
  targetNpcId?: number
  message: string
  resonance?: number
  success?: boolean
  timestamp: string
}

interface DebateFeedProps {
  messages: ConversationMessage[]
  getBeliefColor: (beliefName: string) => string
}

export default function DebateFeed({ messages, getBeliefColor }: DebateFeedProps) {
  const getIcon = (type: string, success?: boolean) => {
    switch (type) {
      case 'conversion':
        return <Heart className="w-4 h-4 text-green-400" />
      case 'defection':
        return <Swords className="w-4 h-4 text-red-400" />
      case 'adaptation':
        return <RefreshCw className="w-4 h-4 text-yellow-400" />
      case 'system':
        return <Zap className="w-4 h-4 text-purple-400" />
      case 'persuasion':
        return success 
          ? <Shield className="w-4 h-4 text-green-400" />
          : <MessageSquare className="w-4 h-4 text-gray-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />
    }
  }

  const getTypeColor = (type: string, success?: boolean) => {
    switch (type) {
      case 'conversion':
        return 'border-green-500/30 bg-green-500/5'
      case 'defection':
        return 'border-red-500/30 bg-red-500/5'
      case 'adaptation':
        return 'border-yellow-500/30 bg-yellow-500/5'
      case 'system':
        return 'border-purple-500/30 bg-purple-500/5'
      case 'persuasion':
        return success 
          ? 'border-green-500/20 bg-green-500/5'
          : 'border-gray-500/20 bg-gray-500/5'
      default:
        return 'border-gray-500/20'
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

  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h2 className="font-display text-lg font-bold text-white">Live Debate</h2>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No activity yet</p>
              <p className="text-xs mt-1">Waiting for agents to join and debate...</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`rounded-lg border p-3 ${getTypeColor(msg.type, msg.success)}`}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(msg.type, msg.success)}
                  
                  {msg.agentName && (
                    <span 
                      className="font-semibold text-sm"
                      style={{ color: getBeliefColor(msg.beliefName || '') }}
                    >
                      {msg.agentName}
                    </span>
                  )}
                  
                  {msg.beliefSymbol && (
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{ 
                        backgroundColor: `${getBeliefColor(msg.beliefName || '')}20`,
                        color: getBeliefColor(msg.beliefName || '')
                      }}
                    >
                      ${msg.beliefSymbol}
                    </span>
                  )}
                  
                  <span className="text-xs text-gray-500 ml-auto font-mono">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {/* Message content */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {msg.message}
                </p>

                {/* Resonance bar for persuasion attempts */}
                {msg.resonance !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Resonance:</span>
                    <div className="flex-1 h-1.5 bg-arena-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${msg.resonance}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          msg.success ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                    </div>
                    <span 
                      className={`text-xs font-mono ${
                        msg.success ? 'text-green-400' : 'text-gray-400'
                      }`}
                    >
                      {msg.resonance}%
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

