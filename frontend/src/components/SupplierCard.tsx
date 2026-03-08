interface SupplierCardProps {
    name: string
    contactInfo: string
    reliabilityScore: number
  }
  
  export default function SupplierCard({ 
    name, 
    contactInfo, 
    reliabilityScore 
  }: SupplierCardProps) {
  
    const getRiskLevel = (score: number) => {
      if (score >= 0.7) return { label: 'Low Risk',    cls: 'risk-badge-low'    }
      if (score >= 0.4) return { label: 'Medium Risk', cls: 'risk-badge-medium' }
      return             { label: 'High Risk',   cls: 'risk-badge-high'   }
    }
  
    const risk = getRiskLevel(reliabilityScore)
  
    return (
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">{contactInfo}</p>
          </div>
          <span className={risk.cls}>{risk.label}</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Reliability</span>
            <span>{Math.round(reliabilityScore * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${reliabilityScore * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }