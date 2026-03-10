import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../hooks/useChat'
import { shipmentAPI } from '../utils/api'

export default function ChatPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  const [input, setInput]       = useState('')
  const [origins, setOrigins]   = useState<string[]>([])
  const [dests,   setDests]     = useState<string[]>([])
  const bottomRef               = useRef<HTMLDivElement>(null)

  const { messages, loading, error, sendMessage, clearChat } = useChat(origins, dests)

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login')
  }, [token, isLoading])

  // Load shipment cities for weather context
  useEffect(() => {
    if (!token) return
    shipmentAPI.getAll().then(shipments => {
      const o = shipments.map((s: any) => s.origin).slice(0, 3)
      const d = shipments.map((s: any) => s.destination).slice(0, 3)
      setOrigins(o)
      setDests(d)
    }).catch(() => {})
  }, [token])

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  const suggestions = [
    "Which supplier is most risky?",
    "Any shipping delays today?",
    "Summarize current supply chain risks",
    "What's the weather on my trade routes?",
    "Latest supply chain news?",
    "How can I reduce my risk score?",
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />

      <main style={{
        maxWidth: '900px', margin: '0 auto',
        padding: '24px', width: '100%',
        flex: 1, display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '24px',
        }}>
          <div>
            <h1 style={{
              fontSize: '24px', fontWeight: '800', color: '#0f172a',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              🤖 RiskCopilot AI
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
              Powered by Llama3 + Live Supply Chain Data
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Status indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              borderRadius: '20px', padding: '6px 12px',
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#22c55e',
                animation: 'pulse 2s infinite',
              }}/>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                Live Data Active
              </span>
            </div>
            <button
              onClick={clearChat}
              style={{
                background: '#f1f5f9', border: 'none',
                borderRadius: '8px', padding: '8px 16px',
                fontSize: '13px', color: '#64748b',
                cursor: 'pointer', fontWeight: '600',
              }}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Live data badge */}
        {origins.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
            border: '1px solid #c7d2fe',
            borderRadius: '12px', padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '18px' }}>🌍</span>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: '#4f46e5', margin: 0 }}>
                LIVE CONTEXT LOADED
              </p>
              <p style={{ fontSize: '12px', color: '#6366f1', margin: 0 }}>
                Monitoring weather for: {[...origins, ...dests].slice(0, 4).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '10px', padding: '12px 16px',
            marginBottom: '16px', color: '#dc2626', fontSize: '13px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Chat Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          background: '#fff', borderRadius: '16px',
          border: '1px solid #f1f5f9',
          padding: '24px', marginBottom: '16px',
          minHeight: '400px', maxHeight: '500px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
            }}>
              {/* Avatar */}
              {msg.role === 'assistant' && (
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px', marginRight: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px',
                  flexShrink: 0,
                }}>🤖</div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: '75%',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : '#f8fafc',
                color:  msg.role === 'user' ? '#fff' : '#1e293b',
                borderRadius: msg.role === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                padding: '12px 16px',
                fontSize: '14px', lineHeight: '1.6',
                border: msg.role === 'assistant'
                  ? '1px solid #e2e8f0' : 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                {msg.loading ? (
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      AI is thinking
                    </span>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px',
                        borderRadius: '50%', background: '#6366f1',
                        animation: `bounce 1s ${i * 0.2}s infinite`,
                      }}/>
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </p>
                )}
                <p style={{
                  margin: '6px 0 0',
                  fontSize: '10px',
                  opacity: 0.5,
                  textAlign: 'right',
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {/* User avatar */}
              {msg.role === 'user' && (
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px', marginLeft: '10px',
                  background: '#e0e7ff',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '16px',
                  flexShrink: 0,
                }}>👤</div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={{
          display: 'flex', gap: '8px',
          flexWrap: 'wrap', marginBottom: '12px',
        }}>
          {suggestions.slice(0, 4).map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              style={{
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: '20px', padding: '6px 12px',
                fontSize: '12px', color: '#6366f1',
                cursor: 'pointer', fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div style={{
          display: 'flex', gap: '12px',
          background: '#fff', borderRadius: '16px',
          border: '1px solid #e2e8f0', padding: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about supply chain risks, news, weather..."
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: '14px', color: '#1e293b',
              background: 'transparent',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              background: loading
                ? '#c7d2fe'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none',
              borderRadius: '10px', padding: '10px 20px',
              fontSize: '14px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳' : '→ Send'}
          </button>
        </div>

      </main>

      {/* CSS Animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}