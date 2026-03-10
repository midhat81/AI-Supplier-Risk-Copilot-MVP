import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import AlertBanner from '../components/AlertBanner'
import ShipmentRow from '../components/ShipmentRow'
import { useAuth } from '../context/AuthContext'
import { useFetchRisk } from '../hooks/useFetchRisk'
import { supplierAPI, shipmentAPI } from '../utils/api'

export default function DashboardPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  const { risks, summary, loading } = useFetchRisk(token)

  const [shipments, setShipments] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login')
  }, [token, isLoading])

  useEffect(() => {
    if (!token) return
    shipmentAPI.getAll().then(setShipments).catch(console.error)
    supplierAPI.getAll().then(setSuppliers).catch(console.error)
  }, [token])

  // Merge risk scores into shipments
  const shipmentsWithRisk = shipments.map(s => {
    const risk = risks.find(r => r.origin === s.origin && r.destination === s.destination)
    const supplier = suppliers.find(sup => sup.id === s.supplier_id)
    return {
      ...s,
      risk_score:    risk?.risk_score    ?? 0,
      supplier_name: supplier?.name      ?? 'Unknown',
    }
  })

  const highRiskShipments = shipmentsWithRisk.filter(s => s.risk_score >= 0.7)

  if (isLoading || loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <p style={{ color: '#6366f1', fontSize: '16px' }}>⏳ Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
            Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            Supply chain risk overview
          </p>
        </div>

        {/* Alerts */}
        {highRiskShipments.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <AlertBanner alerts={highRiskShipments} />
          </div>
        )}

        {/* Stats Row 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <StatCard
            title="Total Suppliers"
            value={suppliers.length}
            icon="🏭"
            color="blue"
          />
          <StatCard
            title="Total Shipments"
            value={shipments.length}
            icon="🚢"
            color="blue"
          />
          <StatCard
            title="High Risk"
            value={summary?.high_risk ?? 0}
            icon="🔴"
            color="red"
          />
          <StatCard
            title="Avg Risk Score"
            value={`${Math.round((summary?.avg_score ?? 0) * 100)}%`}
            icon="📊"
            color="yellow"
          />
        </div>

        {/* Stats Row 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="Low Risk"
            value={summary?.low_risk ?? 0}
            icon="🟢"
            color="green"
          />
          <StatCard
            title="Medium Risk"
            value={summary?.medium_risk ?? 0}
            icon="🟡"
            color="yellow"
          />
          <StatCard
            title="High Risk"
            value={summary?.high_risk ?? 0}
            icon="🔴"
            color="red"
          />
        </div>

        {/* Shipments Table */}
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          padding: '24px',
        }}>
          <h2 style={{
            fontSize: '16px', fontWeight: '700',
            color: '#0f172a', marginBottom: '20px'
          }}>
            Recent Shipments
          </h2>
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
                      textAlign: 'left', padding: '8px 16px',
                      fontWeight: '600'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shipmentsWithRisk.length > 0 ? (
                  shipmentsWithRisk.map(s => (
                    <ShipmentRow key={s.id} {...s} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{
                      textAlign: 'center', padding: '48px',
                      color: '#94a3b8', fontSize: '14px'
                    }}>
                      No shipments found
                    </td>
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