import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: '📊 Dashboard',  href: '/dashboard' },
  { label: '🏭 Suppliers',  href: '/suppliers' },
  { label: '🚢 Shipments',  href: '/shipments' },
  { label: '📦 Tracking',   href: '/tracking'  },
  { label: '🤖 AI Chat',    href: '/chat'       },
]

export default function Navbar() {
  const router           = useRouter()
  const { user, logout } = useAuth()

  return (
    <nav style={{
      background:     'linear-gradient(135deg, #1e1b4b, #312e81)',
      padding:        '0 24px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      height:         '64px',
      boxShadow:      '0 2px 12px rgba(0,0,0,0.2)',
      position:       'sticky',
      top:            0,
      zIndex:         100,
    }}>

      {/* Logo */}
      <Link href="/dashboard" style={{
        display:        'flex',
        alignItems:     'center',
        gap:            '10px',
        textDecoration: 'none',
      }}>
        <div style={{
          width:          '36px',
          height:         '36px',
          borderRadius:   '10px',
          background:     'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontSize:       '18px',
          boxShadow:      '0 4px 12px rgba(99,102,241,0.4)',
        }}>🤖</div>
        <span style={{
          color:         '#fff',
          fontWeight:    '800',
          fontSize:      '18px',
          letterSpacing: '-0.5px',
        }}>
          RiskCopilot
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {navItems.map(item => {
          const isActive  = router.pathname === item.href
          const isAI      = item.href === '/chat'
          const isTracking = item.href === '/tracking'

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                padding:        '8px 14px',
                borderRadius:   '8px',
                fontSize:       '13px',
                fontWeight:     '600',
                transition:     'all 0.2s',
                background: isActive
                  ? 'rgba(255,255,255,0.15)'
                  : isAI
                    ? 'rgba(99,102,241,0.3)'
                    : isTracking
                      ? 'rgba(34,197,94,0.2)'
                      : 'transparent',
                color: isActive
                  ? '#fff'
                  : isAI
                    ? '#c7d2fe'
                    : isTracking
                      ? '#86efac'
                      : 'rgba(255,255,255,0.6)',
                border: isAI
                  ? '1px solid rgba(99,102,241,0.4)'
                  : isTracking
                    ? '1px solid rgba(34,197,94,0.3)'
                    : '1px solid transparent',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Right side — user + logout */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '12px',
      }}>
        {user && (
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
          }}>
            <div style={{
              width:          '32px',
              height:         '32px',
              borderRadius:   '8px',
              background:     'rgba(255,255,255,0.1)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '14px',
            }}>👤</div>
            <span style={{
              color:      'rgba(255,255,255,0.7)',
              fontSize:   '13px',
              fontWeight: '500',
            }}>
              {user.full_name}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          style={{
            background:   'rgba(255,255,255,0.08)',
            border:       '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding:      '7px 14px',
            color:        'rgba(255,255,255,0.7)',
            fontSize:     '13px',
            fontWeight:   '600',
            cursor:       'pointer',
            transition:   'all 0.2s',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}