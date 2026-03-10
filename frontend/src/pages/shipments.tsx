import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import ShipmentRow from '../components/ShipmentRow'
import { useAuth } from '../context/AuthContext'
import { shipmentAPI, supplierAPI, riskAPI } from '../utils/api'

export default function ShipmentsPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  const [shipments,  setShipments]  = useState<any[]>([])
  const [suppliers,  setSuppliers]  = useState<any[]>([])
  const [risks,      setRisks]      = useState<any[]>([])
  const [filter,     setFilter]     = useState('all')
  const [loading,    setLoading]    = useState(false)
  const [showForm,   setShowForm]   = useState(false)
  const [form, setForm] = useState({
    supplier_id: '', origin: '', destination: '',
    date_sent: '', date_expected: '', status: 'in_transit'
  })

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login')
  }, [token, isLoading])

  useEffect(() => {
    if (!token) return
    setLoading(true)
    Promise.all([
      shipmentAPI.getAll(),
      supplierAPI.getAll(),
      riskAPI.getAll(),
    ])
      .then(([s, sup, r]) => {
        setShipments(s)
        setSuppliers(sup)
        setRisks(r)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const handleAdd = async () => {
    try {
      const newShipment = await shipmentAPI.create({
        supplier_id:   parseInt(form.supplier_id),
        origin:        form.origin,
        destination:   form.destination,
        date_sent:     form.date_sent,
        date_expected: form.date_expected,
        status:        form.status,
      })
      setShipments(prev => [...prev, newShipment])
      setShowForm(false)
      setForm({
        supplier_id: '', origin: '', destination: '',
        date_sent: '', date_expected: '', status: 'in_transit'
      })
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Error adding shipment')
    }
  }

  const shipmentsWithRisk = shipments.map(s => {
    const risk     = risks.find(r => r.origin === s.origin)
    const supplier = suppliers.find(sup => sup.id === s.supplier_id)
    return {
      ...s,
      risk_score:    risk?.risk_score    ?? 0,
      supplier_name: supplier?.name      ?? 'Unknown',
    }
  })

  const filtered = filter === 'all'
    ? shipmentsWithRisk
    : shipmentsWithRisk.filter(s => s.status === filter)

  const filters = [
    { label: 'All',           value: 'all'        },
    { label: '🚢 In Transit', value: 'in_transit' },
    { label: '✅ Delivered',  value: 'delivered'  },
    { label: '⚠️ Delayed',   value: 'delayed'    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
              Shipments
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
              {shipments.length} shipments tracked
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '10px 20px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
            }}
          >
            + Add Shipment
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{
            background: '#fff', borderRadius: '16px',
            border: '1px solid #e2e8f0', padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#0f172a' }}>
              Add New Shipment
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {/* Supplier dropdown */}
              <div>
                <label style={{
                  display: 'block', fontSize: '12px',
                  fontWeight: '600', color: '#64748b', marginBottom: '6px'
                }}>Supplier</label>
                <select
                  value={form.supplier_id}
                  onChange={e => setForm(p => ({ ...p, supplier_id: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px',
                    border: '1px solid #e2e8f0', borderRadius: '8px',
                    fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Other fields */}
              {[
                { label: 'Origin',        key: 'origin',        placeholder: 'Shanghai',    type: 'text' },
                { label: 'Destination',   key: 'destination',   placeholder: 'Kuala Lumpur',type: 'text' },
                { label: 'Date Sent',     key: 'date_sent',     placeholder: '',            type: 'date' },
                { label: 'Date Expected', key: 'date_expected', placeholder: '',            type: 'date' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{
                    display: 'block', fontSize: '12px',
                    fontWeight: '600', color: '#64748b', marginBottom: '6px'
                  }}>{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '10px 12px',
                      border: '1px solid #e2e8f0', borderRadius: '8px',
                      fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleAdd} style={{
                background: '#6366f1', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '10px 20px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>Save Shipment</button>
              <button onClick={() => setShowForm(false)} style={{
                background: '#f1f5f9', color: '#64748b', border: 'none',
                borderRadius: '8px', padding: '10px 20px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: '600',
                cursor: 'pointer', border: 'none',
                background: filter === f.value ? '#6366f1' : '#fff',
                color:      filter === f.value ? '#fff'    : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #f1f5f9', padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid #f1f5f9',
                  color: '#94a3b8', fontSize: '11px',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {['ID','Supplier','Route','Expected','Status','Risk'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 16px', fontWeight: '600'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{
                      textAlign: 'center', padding: '48px',
                      color: '#94a3b8', fontSize: '14px'
                    }}>⏳ Loading...</td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map(s => (
                    <ShipmentRow key={s.id} {...s} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{
                      textAlign: 'center', padding: '48px',
                      color: '#94a3b8', fontSize: '14px'
                    }}>No shipments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}