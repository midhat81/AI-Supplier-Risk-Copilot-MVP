import Navbar from '@/components/Navbar'
import StatCard from '@/components/StatCard'
import AlertBanner from '@/components/AlertBanner'
import ShipmentRow from '@/components/ShipmentRow'
import { mockShipments, mockStats } from '@/utils/mockData'

export default function DashboardPage() {
  const highRiskShipments = mockShipments.filter(s => s.risk_score >= 0.7)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Supply chain risk overview
          </p>
        </div>

        {/* Alert Banners */}
        {highRiskShipments.length > 0 && (
          <div className="mb-8">
            <AlertBanner alerts={highRiskShipments} />
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Suppliers"
            value={mockStats.totalSuppliers}
            icon="🏭"
            color="blue"
          />
          <StatCard
            title="Total Shipments"
            value={mockStats.totalShipments}
            icon="🚢"
            color="blue"
          />
          <StatCard
            title="High Risk"
            value={mockStats.highRiskCount}
            icon="🔴"
            color="red"
          />
          <StatCard
            title="Avg Risk Score"
            value={`${Math.round(mockStats.avgRiskScore * 100)}%`}
            icon="📊"
            color="yellow"
          />
        </div>

        {/* Risk Summary Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Low Risk Shipments"
            value={mockStats.lowRiskCount}
            icon="🟢"
            color="green"
          />
          <StatCard
            title="Medium Risk Shipments"
            value={mockStats.mediumRiskCount}
            icon="🟡"
            color="yellow"
          />
          <StatCard
            title="High Risk Shipments"
            value={mockStats.highRiskCount}
            icon="🔴"
            color="red"
          />
        </div>

        {/* Shipments Table */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Shipments
          </h2>
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
                {mockShipments.map(shipment => (
                  <ShipmentRow
                    key={shipment.id}
                    {...shipment}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}