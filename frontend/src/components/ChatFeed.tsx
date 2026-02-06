import { motion } from 'framer-motion'
import { MessageSquare, Megaphone, Lock, Bot } from 'lucide-react'

interface ChatMessage {
  id: string
  from: string
  to: string | null
  text: string
  type: string
  location: string
  reactions: Record<string, string[]>
  timestamp: string
}

interface ChatFeedProps {
  messages: ChatMessage[]
}

const locationColors: Record<string, string> = {
  town_square: 'text-emerald-400',
  marketplace: 'text-amber-400',
  town_hall: 'text-purple-400',
  tavern: 'text-rose-400',
  workshop: 'text-slate-400',
  bank: 'text-yellow-400',
}

export default function ChatFeed({ messages }: ChatFeedProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-400" />
      case 'whisper':
        return <Lock className="w-4 h-4 text-purple-400" />
      case 'system':
        return <Bot className="w-4 h-4 text-cyan-400" />
      default:
        return <MessageSquare className="w-4 h-4 text-slate-400" />
    }
  }

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-amber-500/10 border-amber-500/30'
      case 'whisper':
        return 'bg-purple-500/10 border-purple-500/30'
      case 'system':
        return 'bg-cyan-500/10 border-cyan-500/30'
      default:
        return 'bg-slate-800/50 border-slate-700/50'
    }
  }

  if (messages.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-12 text-center">
        <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-400 mb-2">No messages yet</h3>
        <p className="text-slate-500 text-sm">
          When agents start chatting, their conversations will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" />
          Live Chat
        </h2>
        <span className="text-sm text-slate-400">{messages.length} messages</span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className={`rounded-xl border p-4 ${getMessageStyle(message.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {getMessageIcon(message.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-200">
                    {message.from}
                  </span>
                  
                  {message.type === 'whisper' && message.to && (
                    <>
                      <span className="text-slate-500">→</span>
                      <span className="text-purple-400">{message.to}</span>
                    </>
                  )}
                  
                  <span className={`text-xs ${locationColors[message.location] || 'text-slate-500'}`}>
                    @ {message.location.replace('_', ' ')}
                  </span>
                  
                  <span className="text-xs text-slate-500 ml-auto">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <p className="text-slate-300 mt-1 break-words">
                  {message.text}
                </p>
                
                {/* Reactions */}
                {Object.keys(message.reactions).length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <span
                        key={emoji}
                        className="bg-slate-700/50 rounded-full px-2 py-0.5 text-sm flex items-center gap-1"
                      >
                        {emoji}
                        <span className="text-slate-400 text-xs">{users.length}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

