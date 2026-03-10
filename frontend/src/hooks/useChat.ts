import { useState } from 'react'
import api from '../utils/api'

export interface Message {
  id:        number
  role:      'user' | 'assistant'
  content:   string
  timestamp: string
  loading?:  boolean
}

export function useChat(origins: string[] = [], destinations: string[] = []) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id:        1,
      role:      'assistant',
      content:   "👋 Hi! I'm RiskCopilot AI powered by Llama3.\n\nI have access to live supply chain news and real-time weather on your trade routes.\n\nAsk me anything like:\n- Which supplier is most risky?\n- Any shipping delays from Shanghai today?\n- Summarize current supply chain risks",
      timestamp: new Date().toISOString(),
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id:        Date.now(),
      role:      'user',
      content:   text,
      timestamp: new Date().toISOString(),
    }

    const loadingMsg: Message = {
      id:        Date.now() + 1,
      role:      'assistant',
      content:   '',
      timestamp: new Date().toISOString(),
      loading:   true,
    }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setLoading(true)
    setError(null)

    try {
      const history = messages
        .filter(m => !m.loading)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await api.post('/ai/chat', {
        message:      text,
        history,
        origins,
        destinations,
      })

      const aiMsg: Message = {
        id:        Date.now() + 2,
        role:      'assistant',
        content:   res.data.response,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [
        ...prev.filter(m => !m.loading),
        aiMsg,
      ])
    } catch (err: any) {
      setError('Failed to get AI response. Is Ollama running?')
      setMessages(prev => prev.filter(m => !m.loading))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      id:        1,
      role:      'assistant',
      content:   "Chat cleared! Ask me anything about your supply chain. 🤖",
      timestamp: new Date().toISOString(),
    }])
  }

  return { messages, loading, error, sendMessage, clearChat }
}