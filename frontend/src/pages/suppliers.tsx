import { useState } from 'react'
import Navbar from '@/components/Navbar'
import SupplierCard from '@/components/SupplierCard'
import { mockSuppliers } from '@/utils/mockData'

export default function SuppliersPage() {
  const [search, setSearch] = useState('')

  const filtered = mockSuppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_info.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-500 text-sm mt-1">
              {mockSuppliers.length} suppliers registered
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span>+</span> Add Supplier
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍  Search suppliers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-200 rounded-lg
                       px-4 py-2.5 text-sm focus:outline-none
                       focus:ring-2 focus:ring-primary-500 transition"
          />
        </div>

        {/* Supplier Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(supplier => (
              <SupplierCard
                key={supplier.id}
                name={supplier.name}
                contactInfo={supplier.contact_info}
                reliabilityScore={supplier.reliability_score}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">No suppliers found</p>
          </div>
        )}

      </main>
    </div>
  )
}