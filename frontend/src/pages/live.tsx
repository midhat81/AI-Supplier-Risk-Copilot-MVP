import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useLiveTracking } from '../hooks/useLiveTracking'

export default function LiveDashboard() {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  const {
    parcels,
    summary,
    connected,
    loading,
    lastUpdate,
    refresh,
  } = useLiveTracking()

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login')
  }, [token, isLoading])

  return (
    <div style={{
      minHeight:  '100vh',
      background: '#0f0f1a',
      fontFamily: 'Segoe UI, sans-serif',
      color:      '#fff',
    }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>

        {/* Header */}
        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
          marginBottom:   '28px',
        }}>
          <div>
            <h1 style={{
              fontSize:   '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6366f1, #22c55e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display:    'flex',
              alignItems: 'center',
              gap:        '12px',
            }}>
              ⚡ Live Tracking Dashboard
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              Real-time parcel updates via WebSocket
            </p>
          </div>

          {/* Connection Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastUpdate && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Last update: {lastUpdate}
              </span>
            )}
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '8px',
              background:   connected ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border:       `1px solid ${connected ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: '20px',
              padding:      '8px 16px',
            }}>
              <div style={{
                width:      '8px',
                height:     '8px',
                borderRadius: '50%',
                background: connected ? '#22c55e' : '#ef4444',
                boxShadow:  connected
                  ? '0 0 8px rgba(34,197,94,0.8)'
                  : '0 0 8px rgba(239,68,68,0.8)',
                animation:  'pulse 1.5s infinite',
              }}/>
              <span style={{
                fontSize:   '13px',
                fontWeight: '600',
                color:      connected ? '#22c55e' : '#ef4444',
              }}>
                {connected ? '🟢 Live Connected' : '🔴 Reconnecting...'}
              </span>
            </div>
            <button
              onClick={refresh}
              style={{
                background:   'rgba(99,102,241,0.2)',
                border:       '1px solid rgba(99,102,241,0.3)',
                borderRadius: '10px',
                padding:      '8px 16px',
                color:        '#6366f1',
                fontSize:     '13px',
                fontWeight:   '600',
                cursor:       'pointer',
              }}
            >🔄 Refresh</button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap:                 '16px',
            marginBottom:        '28px',
          }}>
            {[
              { label: 'Total',      value: summary.total,      emoji: '📦', color: '#6366f1', glow: 'rgba(99,102,241,0.3)'  },
              { label: 'Delivered',  value: summary.delivered,  emoji: '✅', color: '#22c55e', glow: 'rgba(34,197,94,0.3)'   },
              { label: 'In Transit', value: summary.in_transit, emoji: '🚚', color: '#3b82f6', glow: 'rgba(59,130,246,0.3)'  },
              { label: 'Delayed',    value: summary.delayed,    emoji: '⚠️', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)'  },
              { label: 'High Risk',  value: summary.high_risk,  emoji: '🔴', color: '#ef4444', glow: 'rgba(239,68,68,0.3)'   },
            ].map(card => (
              <div key={card.label} style={{
                background:   'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding:      '20px',
                textAlign:    'center',
                border:       `1px solid rgba(255,255,255,0.06)`,
                boxShadow:    `0 0 20px ${card.glow}`,
                transition:   'all 0.3s',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{card.emoji}</div>
                <div style={{
                  fontSize:   '36px',
                  fontWeight: '800',
                  color:      card.color,
                  textShadow: `0 0 20px ${card.glow}`,
                }}>{card.value}</div>
                <div style={{
                  fontSize:   '12px',
                  color:      '#64748b',
                  fontWeight: '600',
                  marginTop:  '4px',
                }}>{card.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Live Parcels Feed */}
        <div style={{
          background:   'rgba(255,255,255,0.02)',
          borderRadius: '20px',
          border:       '1px solid rgba(255,255,255,0.06)',
          padding:      '24px',
          minHeight:    '400px',
        }}>
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            marginBottom:   '20px',
          }}>
            <h2 style={{
              fontSize:   '16px',
              fontWeight: '700',
              color:      '#e2e8f0',
              display:    'flex',
              alignItems: 'center',
              gap:        '8px',
            }}>
              📡 Live Parcel Feed
              {parcels.length > 0 && (
                <span style={{
                  background:   'rgba(99,102,241,0.2)',
                  color:        '#6366f1',
                  borderRadius: '20px',
                  padding:      '2px 10px',
                  fontSize:     '12px',
                }}>{parcels.length}</span>
              )}
            </h2>

            {connected && (
              <div style={{
                fontSize:   '12px',
                color:      '#22c55e',
                display:    'flex',
                alignItems: 'center',
                gap:        '6px',
              }}>
                <div style={{
                  width:        '6px',
                  height:       '6px',
                  borderRadius: '50%',
                  background:   '#22c55e',
                  animation:    'pulse 1s infinite',
                }}/>
                Watching for updates...
              </div>
            )}
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding:   '60px',
              color:     '#64748b',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p>Loading live tracking data...</p>
            </div>
          ) : parcels.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding:   '60px',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
              <p style={{ color: '#64748b', fontSize: '16px' }}>
                No parcels tracked yet.
              </p>
              <p style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>
                Go to{' '}
                <a href="/tracking" style={{ color: '#6366f1' }}>
                  📦 Tracking page
                </a>{' '}
                to add tracking numbers!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {parcels.map(parcel => (
                <div
                  key={parcel.tracking_number}
                  style={{
                    background:   parcel.isNew
                      ? 'rgba(34,197,94,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    borderRadius: '14px',
                    padding:      '16px 20px',
                    border:       parcel.isNew
                      ? '1px solid rgba(34,197,94,0.3)'
                      : '1px solid rgba(255,255,255,0.05)',
                    borderLeft:   `4px solid ${parcel.status_color}`,
                    display:      'flex',
                    justifyContent: 'space-between',
                    alignItems:   'center',
                    flexWrap:     'wrap',
                    gap:          '12px',
                    transition:   'all 0.5s',
                    boxShadow:    parcel.isNew
                      ? '0 0 20px rgba(34,197,94,0.15)'
                      : 'none',
                  }}
                >
                  {/* Left side */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{parcel.status_emoji}</div>
                    <div>
                      <div style={{
                        fontWeight: '700',
                        fontSize:   '15px',
                        color:      '#f1f5f9',
                        display:    'flex',
                        alignItems: 'center',
                        gap:        '8px',
                      }}>
                        {parcel.tracking_number}
                        {parcel.isNew && (
                          <span style={{
                            background:   'rgba(34,197,94,0.2)',
                            color:        '#22c55e',
                            borderRadius: '10px',
                            padding:      '2px 8px',
                            fontSize:     '10px',
                            fontWeight:   '700',
                            animation:    'pulse 1s infinite',
                          }}>
                            ⚡ UPDATED
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontSize:  '12px',
                        color:     '#64748b',
                        marginTop: '3px',
                      }}>
                        {parcel.carrier_name}
                        {parcel.origin && parcel.destination &&
                          ` • ${parcel.origin} → ${parcel.destination}`
                        }
                      </div>
                      {parcel.last_location && (
                        <div style={{
                          fontSize:  '12px',
                          color:     '#475569',
                          marginTop: '2px',
                        }}>
                          📍 {parcel.last_location}
                        </div>
                      )}
                      {parcel.last_message && (
                        <div style={{
                          fontSize:  '11px',
                          color:     '#334155',
                          marginTop: '2px',
                          fontStyle: 'italic',
                        }}>
                          {parcel.last_message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* ETA */}
                    {parcel.expected_delivery && (
                      <div style={{
                        background:   'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding:      '6px 10px',
                        fontSize:     '11px',
                        color:        '#94a3b8',
                        textAlign:    'center',
                      }}>
                        <div style={{ fontWeight: '600', color: '#cbd5e1' }}>ETA</div>
                        {new Date(parcel.expected_delivery).toLocaleDateString()}
                      </div>
                    )}

                    {/* Status badge */}
                    <span style={{
                      background:     `${parcel.status_color}20`,
                      color:           parcel.status_color,
                      borderRadius:   '20px',
                      padding:        '5px 12px',
                      fontSize:       '12px',
                      fontWeight:     '700',
                      textTransform:  'capitalize',
                      border:         `1px solid ${parcel.status_color}40`,
                    }}>
                      {parcel.status.replace('_', ' ')}
                    </span>

                    {/* Risk badge */}
                    <span style={{
                      background: parcel.risk_level === 'HIGH'
                        ? 'rgba(239,68,68,0.15)'
                        : parcel.risk_level === 'MEDIUM'
                          ? 'rgba(245,158,11,0.15)'
                          : 'rgba(34,197,94,0.15)',
                      color: parcel.risk_level === 'HIGH'
                        ? '#ef4444'
                        : parcel.risk_level === 'MEDIUM'
                          ? '#f59e0b'
                          : '#22c55e',
                      borderRadius: '20px',
                      padding:      '5px 12px',
                      fontSize:     '12px',
                      fontWeight:   '700',
                      border: `1px solid ${
                        parcel.risk_level === 'HIGH'
                          ? 'rgba(239,68,68,0.3)'
                          : parcel.risk_level === 'MEDIUM'
                            ? 'rgba(245,158,11,0.3)'
                            : 'rgba(34,197,94,0.3)'
                      }`,
                    }}>
                      {parcel.risk_level} RISK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}