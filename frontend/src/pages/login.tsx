import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const { login } = useAuth()
  const router    = useRouter()

  const handleLogin = async () => {
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    if (email === 'admin@test.com' && password === 'password123') {
      login('mock-token-123', {
        id: 1, email: 'admin@test.com',
        full_name: 'Admin User', role: 'admin',
      })
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Glowing background circles */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(99,102,241,0.2)', filter: 'blur(80px)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'fixed', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'rgba(139,92,246,0.2)', filter: 'blur(80px)',
        pointerEvents: 'none',
      }}/>

      {/* Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            fontSize: '28px', marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>🤖</div>
          <h1 style={{
            fontSize: '28px', fontWeight: '800',
            color: '#fff', letterSpacing: '-0.5px',
          }}>RiskCopilot</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '6px' }}>
            AI Supplier Risk Management
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#fca5a5', borderRadius: '10px',
            padding: '12px 16px', fontSize: '13px',
            marginBottom: '20px', textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.7)',
              fontSize: '13px', fontWeight: '500', marginBottom: '8px',
            }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@test.com"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px', color: '#fff',
                fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.7)',
              fontSize: '13px', fontWeight: '500', marginBottom: '8px',
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              style={{
                width: '100%', padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px', color: '#fff',
                fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading
                ? 'rgba(99,102,241,0.5)'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontSize: '15px',
              fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
              letterSpacing: '0.3px',
            }}
          >
            {loading ? '⏳ Signing in...' : '→ Sign In'}
          </button>
        </div>

        {/* Divider */}
        <div style={{
          margin: '28px 0 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}/>

        {/* Demo Credentials */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '14px 16px',
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '11px',
            fontWeight: '600', letterSpacing: '1px',
            textTransform: 'uppercase', marginBottom: '8px',
          }}>🔑 Demo Credentials</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px' }}>
            Email: <span style={{ color: '#a5b4fc' }}>admin@test.com</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            Password: <span style={{ color: '#a5b4fc' }}>password123</span>
          </p>
        </div>

      </div>
    </div>
  )
}