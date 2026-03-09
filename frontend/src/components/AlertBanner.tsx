interface Alert {
    id:            number
    supplier_name: string
    origin:        string
    destination:   string
    risk_score:    number
    status:        string
  }
  
  interface AlertBannerProps {
    alerts: Alert[]
  }
  
  export default function AlertBanner({ alerts }: AlertBannerProps) {
    if (alerts.length === 0) return null
  
    return (
      <div className="space-y-3">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className="flex items-center justify-between
                       bg-red-50 border border-red-200
                       rounded-xl px-5 py-4"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              <span className="text-xl">🚨</span>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  High Risk Shipment Detected
                </p>
                <p className="text-xs text-red-500 mt-0.5">
                  {alert.supplier_name} — {alert.origin} → {alert.destination}
                </p>
              </div>
            </div>
  
            {/* Right */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                {alert.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-sm font-bold text-red-700">
                {Math.round(alert.risk_score * 100)}% Risk
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }