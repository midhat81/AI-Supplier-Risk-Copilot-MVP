import { useState } from 'react'
import Navbar from '@/components/Navbar'
import ShipmentRow from '@/components/ShipmentRow'
import { mockShipments } from '@/utils/mockData'

export default function ShipmentsPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? mockShipments
    : mockShipments.filter(s => s.status === filter)

  const filters = [
    { label: 'All',        value: 'all'        },
    { label: '🚢 In Transit', value: 'in_transit' },
    { label: '✅ Delivered',  value: 'delivered'  },
    { label: '⚠️ Delayed',    value: 'delayed'    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
            <p className="text-gray-500 text-sm mt-1">
              {mockShipments.length} shipments tracked
            </p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <span>+</span> Add Shipment
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${filter === f.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Shipments Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400
                               uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 px-4">ID</th>
                  <th className="pb-3 px-4">Supplier</th>
                  <th className="pb-3 px-4">Route</th>
                  <th className="pb-3 px-4">Expected</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map(shipment => (
                    <ShipmentRow
                      key={shipment.id}
                      {...shipment}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
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