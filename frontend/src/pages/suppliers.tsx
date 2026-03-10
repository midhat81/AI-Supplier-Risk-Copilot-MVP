import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import SupplierCard from '../components/SupplierCard'
import { useAuth } from '../context/AuthContext'
import { supplierAPI } from '../utils/api'

export default function SuppliersPage() {
  const { token, isLoading } = useAuth()
  const router = useRouter()

  const [suppliers, setSuppliers] = useState<any[]>([])
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [showForm,  setShowForm]  = useState(false)
  const [form, setForm] = useState({
    name: '', contact_info: '', reliability_score: '0.8'
  })

  useEffect(() => {
    if (!isLoading && !token) router.replace('/login')
  }, [token, isLoading])

  useEffect(() => {
    if (!token) return
    setLoading(true)
    supplierAPI.getAll()
      .then(setSuppliers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [token])

  const handleAdd = async () => {
    try {
      const newSupplier = await supplierAPI.create({
        name:              form.name,
        contact_info:      form.contact_info,
        reliability_score: parseFloat(form.reliability_score),
      })
      setSuppliers(prev => [...prev, newSupplier])
      setShowForm(false)
      setForm({ name: '', contact_info: '', reliability_score: '0.8' })
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Error adding supplier')
    }
  }

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_info.toLowerCase().includes(search.toLowerCase())
  )

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
              Suppliers
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
              {suppliers.length} suppliers registered
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
            + Add Supplier
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
              Add New Supplier
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Name',              key: 'name',              placeholder: 'FastShip Co'      },
                { label: 'Contact Email',     key: 'contact_info',      placeholder: 'email@company.com'},
                { label: 'Reliability (0-1)', key: 'reliability_score', placeholder: '0.8'              },
              ].map(field => (
                <div key={field.key}>
                  <label style={{
                    display: 'block', fontSize: '12px',
                    fontWeight: '600', color: '#64748b', marginBottom: '6px'
                  }}>{field.label}</label>
                  <input
                    value={(form as any)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
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
              }}>Save Supplier</button>
              <button onClick={() => setShowForm(false)} style={{
                background: '#f1f5f9', color: '#64748b', border: 'none',
                borderRadius: '8px', padding: '10px 20px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="🔍  Search suppliers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '400px',
            border: '1px solid #e2e8f0', borderRadius: '10px',
            padding: '10px 16px', fontSize: '14px',
            outline: 'none', marginBottom: '24px',
            boxSizing: 'border-box',
          }}
        />

        {/* Cards */}
        {loading ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '48px' }}>
            ⏳ Loading suppliers...
          </p>
        ) : filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            {filtered.map(s => (
              <SupplierCard
                key={s.id}
                name={s.name}
                contactInfo={s.contact_info}
                reliabilityScore={s.reliability_score}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px', color: '#94a3b8' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</p>
            <p style={{ fontSize: '14px' }}>No suppliers found</p>
          </div>
        )}

      </main>
    </div>
  )
}