import RiskIndicator from './RiskIndicator'

interface ShipmentRowProps {
  id:            number
  supplier_name: string
  origin:        string
  destination:   string
  date_expected: string
  status:        string
  risk_score:    number
}

export default function ShipmentRow({
  id,
  supplier_name,
  origin,
  destination,
  date_expected,
  status,
  risk_score,
}: ShipmentRowProps) {

  const statusStyles: Record<string, string> = {
    delivered:  'bg-green-100  text-green-700',
    in_transit: 'bg-blue-100   text-blue-700',
    delayed:    'bg-red-100    text-red-700',
    cancelled:  'bg-gray-100   text-gray-700',
  }

  const statusIcons: Record<string, string> = {
    delivered:  '✅',
    in_transit: '🚢',
    delayed:    '⚠️',
    cancelled:  '❌',
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* ID */}
      <td className="py-3 px-4 text-sm text-gray-400 font-mono">
        #{id}
      </td>

      {/* Supplier */}
      <td className="py-3 px-4">
        <p className="text-sm font-medium text-gray-800">{supplier_name}</p>
      </td>

      {/* Route */}
      <td className="py-3 px-4">
        <p className="text-sm text-gray-600">
          {origin}
          <span className="mx-2 text-gray-300">→</span>
          {destination}
        </p>
      </td>

      {/* Expected Date */}
      <td className="py-3 px-4">
        <p className="text-sm text-gray-500">{date_expected}</p>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full
          ${statusStyles[status] ?? 'bg-gray-100 text-gray-600'}`}>
          {statusIcons[status]} {status.replace('_', ' ')}
        </span>
      </td>

      {/* Risk Score */}
      <td className="py-3 px-4">
        <RiskIndicator score={risk_score} size="sm" />
      </td>
    </tr>
  )
}