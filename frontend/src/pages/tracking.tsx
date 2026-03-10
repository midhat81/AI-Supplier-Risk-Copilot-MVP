import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

interface Parcel {
  tracking_number:   string
  carrier:           string
  carrier_name:      string
  status:            string
  status_emoji:      string
  status_color:      string
  risk_level:        string
  origin:            string
  destination:       string
  expected_delivery: string | null
  last_update:       string
  last_location:     string
}

interface Summary {
  total:      number
  delivered:  number
  in_transit: number
  delayed:    number
  pending:    number
  high_risk:  number
}

interface Checkpoint {
  time:     string
  location: string
  message:  string
  status:   string
}

export default function TrackingPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  const [parcels,        setParcels]        = useState<Parcel[]>([])
  const [summary,        setSummary]        = useState<Summary | null>(null)
  const [trackingInput,  setTrackingInput]  = useState('')
  const [carrierInput,   setCarrierInput]   = useState('')
  const [loading,        setLoading]        = useState(false)
  const [addLoading,     setAddLoading]     = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [success,        setSuccess]        = useState<string | null>(null)
  const [selectedParcel, setSelectedParcel] = useState<any | null>(null)
  const [detailLoading,  setDetailLoading]  = useState(false)

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login')
  }, [token, isLoading])

  useEffect(() => {
    if (token) loadParcels()
  }, [token])

  const loadParcels = async () => {
    setLoading(true)
    try {
      const res = await api.get('/tracking/all')
      setParcels(res.data.trackings || [])
      setSummary(res.data.summary   || null)
    } catch (err) {
      setError('Failed to load parcels')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTracking = async () => {
    if (!trackingInput.trim()) return
    setAddLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await api.post('/tracking/add', {
        tracking_number: trackingInput.trim(),
        carrier_slug:    carrierInput.trim() || null,
      })
      setSuccess(`✅ Tracking ${trackingInput} added successfully!`)
      setTrackingInput('')
      setCarrierInput('')
      loadParcels()
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add tracking')
    } finally {
      setAddLoading(false)
    }
  }

  const handleViewDetail = async (parcel: Parcel) => {
    setDetailLoading(true)
    setSelectedParcel(parcel)
    try {
      const res = await api.get(`/tracking/${parcel.tracking_number}?carrier_slug=${parcel.carrier.toLowerCase()}`)
      setSelectedParcel(res.data)
    } catch {
      // keep basic parcel data
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDelete = async (parcel: Parcel) => {
    try {
      await api.delete(`/tracking/${parcel.tracking_number}?carrier_slug=${parcel.carrier.toLowerCase()}`)
      setSuccess('Tracking removed!')
      loadParcels()
    } catch {
      setError('Failed to remove tracking')
    }
  }

  const carriers = [
    { slug: '',            name: '🔍 Auto Detect' },
    { slug: 'dhl',         name: 'DHL' },
    { slug: 'fedex',       name: 'FedEx' },
    { slug: 'jt-express',  name: 'J&T Express' },
    { slug: 'ninja-van',   name: 'Ninja Van' },
    { slug: 'pos-malaysia',name: 'Pos Malaysia' },
    { slug: 'ups',         name: 'UPS' },
  ]

  return (
    <div style={{
      minHeight:  '100vh',
      background: '#f8fafc',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '26px', fontWeight: '800', color: '#0f172a',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            📦 Parcel Tracking
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Track real-time shipments across DHL, FedEx, J&T, Ninja Van and 1000+ carriers
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px', marginBottom: '24px',
          }}>
            {[
              { label: 'Total Parcels', value: summary.total,      emoji: '📦', color: '#6366f1' },
              { label: 'Delivered',     value: summary.delivered,  emoji: '✅', color: '#22c55e' },
              { label: 'In Transit',    value: summary.in_transit, emoji: '🚚', color: '#3b82f6' },
              { label: 'Delayed',       value: summary.delayed,    emoji: '⚠️', color: '#f59e0b' },
              { label: 'High Risk',     value: summary.high_risk,  emoji: '🔴', color: '#ef4444' },
            ].map(card => (
              <div key={card.label} style={{
                background: '#fff', borderRadius: '16px',
                padding: '20px', textAlign: 'center',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.emoji}</div>
                <div style={{
                  fontSize: '28px', fontWeight: '800', color: card.color,
                }}>{card.value}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>
                  {card.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Tracking */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '24px', marginBottom: '24px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <h2 style={{
            fontSize: '16px', fontWeight: '700',
            color: '#0f172a', marginBottom: '16px',
          }}>
            🔍 Track a New Parcel
          </h2>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Enter tracking number..."
              value={trackingInput}
              onChange={e => setTrackingInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTracking()}
              style={{
                flex: '2', minWidth: '200px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px', padding: '12px 16px',
                fontSize: '14px', outline: 'none',
              }}
            />
            <select
              value={carrierInput}
              onChange={e => setCarrierInput(e.target.value)}
              style={{
                flex: '1', minWidth: '150px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px', padding: '12px 16px',
                fontSize: '14px', outline: 'none',
                background: '#fff',
              }}
            >
              {carriers.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <button
              onClick={handleAddTracking}
              disabled={addLoading || !trackingInput.trim()}
              style={{
                background: addLoading
                  ? '#c7d2fe'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '14px', fontWeight: '700',
                cursor: addLoading ? 'not-allowed' : 'pointer',
              }}
            >
              {addLoading ? '⏳ Adding...' : '+ Track Parcel'}
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              marginTop: '12px', padding: '10px 14px',
              background: '#fef2f2', borderRadius: '8px',
              color: '#dc2626', fontSize: '13px',
            }}>⚠️ {error}</div>
          )}
          {success && (
            <div style={{
              marginTop: '12px', padding: '10px 14px',
              background: '#f0fdf4', borderRadius: '8px',
              color: '#16a34a', fontSize: '13px',
            }}>{success}</div>
          )}
        </div>

        {/* Parcels List */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '24px', border: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '16px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              📋 My Parcels {parcels.length > 0 && `(${parcels.length})`}
            </h2>
            <button
              onClick={loadParcels}
              style={{
                background: '#f1f5f9', border: 'none',
                borderRadius: '8px', padding: '8px 14px',
                fontSize: '13px', color: '#6366f1',
                cursor: 'pointer', fontWeight: '600',
              }}
            >🔄 Refresh</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              ⏳ Loading parcels...
            </div>
          ) : parcels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                No parcels tracked yet. Add a tracking number above!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {parcels.map(parcel => (
                <div key={parcel.tracking_number} style={{
                  border: '1px solid #f1f5f9',
                  borderLeft: `4px solid ${parcel.status_color}`,
                  borderRadius: '12px', padding: '16px',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: '12px',
                  transition: 'all 0.2s',
                }}>
                  {/* Left */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '28px' }}>{parcel.status_emoji}</div>
                    <div>
                      <div style={{
                        fontWeight: '700', fontSize: '15px', color: '#0f172a',
                      }}>
                        {parcel.tracking_number}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {parcel.carrier_name} •{' '}
                        {parcel.origin && parcel.destination
                          ? `${parcel.origin} → ${parcel.destination}`
                          : 'Route unknown'}
                      </div>
                      {parcel.last_location && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                          📍 {parcel.last_location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Status badge */}
                    <span style={{
                      background: `${parcel.status_color}20`,
                      color: parcel.status_color,
                      borderRadius: '20px', padding: '4px 12px',
                      fontSize: '12px', fontWeight: '700',
                      textTransform: 'capitalize',
                    }}>
                      {parcel.status.replace('_', ' ')}
                    </span>

                    {/* Risk badge */}
                    <span style={{
                      background: parcel.risk_level === 'HIGH'
                        ? '#fef2f2' : parcel.risk_level === 'MEDIUM'
                        ? '#fffbeb' : '#f0fdf4',
                      color: parcel.risk_level === 'HIGH'
                        ? '#dc2626' : parcel.risk_level === 'MEDIUM'
                        ? '#d97706' : '#16a34a',
                      borderRadius: '20px', padding: '4px 12px',
                      fontSize: '12px', fontWeight: '700',
                    }}>
                      {parcel.risk_level} RISK
                    </span>

                    {/* Buttons */}
                    <button
                      onClick={() => handleViewDetail(parcel)}
                      style={{
                        background: '#f1f5f9', border: 'none',
                        borderRadius: '8px', padding: '6px 12px',
                        fontSize: '12px', cursor: 'pointer',
                        color: '#6366f1', fontWeight: '600',
                      }}
                    >👁️ Details</button>
                    <button
                      onClick={() => handleDelete(parcel)}
                      style={{
                        background: '#fef2f2', border: 'none',
                        borderRadius: '8px', padding: '6px 12px',
                        fontSize: '12px', cursor: 'pointer',
                        color: '#dc2626', fontWeight: '600',
                      }}
                    >🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedParcel && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 999, padding: '24px',
          }}
            onClick={() => setSelectedParcel(null)}
          >
            <div style={{
              background: '#fff', borderRadius: '20px',
              padding: '28px', maxWidth: '560px', width: '100%',
              maxHeight: '80vh', overflowY: 'auto',
            }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '20px',
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                  📦 {selectedParcel.tracking_number}
                </h3>
                <button
                  onClick={() => setSelectedParcel(null)}
                  style={{
                    background: '#f1f5f9', border: 'none',
                    borderRadius: '8px', padding: '6px 12px',
                    cursor: 'pointer', fontSize: '16px',
                  }}
                >✕</button>
              </div>

              {detailLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  ⏳ Loading details...
                </div>
              ) : (
                <>
                  {/* Status */}
                  <div style={{
                    background: '#f8fafc', borderRadius: '12px',
                    padding: '16px', marginBottom: '20px',
                  }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>CARRIER</div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>{selectedParcel.carrier_name}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>STATUS</div>
                        <div style={{ fontWeight: '700', color: selectedParcel.status_color }}>
                          {selectedParcel.status_emoji} {selectedParcel.status?.replace('_', ' ')}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>RISK</div>
                        <div style={{ fontWeight: '700', color: selectedParcel.risk_level === 'HIGH' ? '#dc2626' : '#16a34a' }}>
                          {selectedParcel.risk_level}
                        </div>
                      </div>
                      {selectedParcel.expected_delivery && (
                        <div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>ETA</div>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>
                            {new Date(selectedParcel.expected_delivery).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Checkpoints */}
                  {selectedParcel.checkpoints?.length > 0 && (
                    <div>
                      <h4 style={{
                        fontSize: '14px', fontWeight: '700',
                        color: '#0f172a', marginBottom: '12px',
                      }}>
                        🗺️ Tracking History
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedParcel.checkpoints.map((cp: Checkpoint, i: number) => (
                          <div key={i} style={{
                            display: 'flex', gap: '12px',
                            padding: '10px', background: i === 0 ? '#f0fdf4' : '#f8fafc',
                            borderRadius: '8px', border: i === 0 ? '1px solid #bbf7d0' : 'none',
                          }}>
                            <div style={{
                              width: '8px', height: '8px',
                              borderRadius: '50%', marginTop: '5px', flexShrink: 0,
                              background: i === 0 ? '#22c55e' : '#cbd5e1',
                            }}/>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                {cp.message}
                              </div>
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                📍 {cp.location} • {cp.time ? new Date(cp.time).toLocaleString() : ''}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}