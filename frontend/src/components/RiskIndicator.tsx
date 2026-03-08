interface RiskIndicatorProps {
    score: number
    label?: string
    size?: 'sm' | 'md' | 'lg'
  }
  
  export default function RiskIndicator({ 
    score, 
    label, 
    size = 'md' 
  }: RiskIndicatorProps) {
  
    const percentage = Math.round(score * 100)
    const color = score >= 0.7 ? '#ef4444' : score >= 0.4 ? '#f59e0b' : '#10b981'
    const level = score >= 0.7 ? 'HIGH'    : score >= 0.4 ? 'MEDIUM'  : 'LOW'
  
    const sizes = { sm: 60, md: 80, lg: 100 }
    const dim   = sizes[size]
    const r     = (dim / 2) - 8
    const circ  = 2 * Math.PI * r
    const dash  = circ * (1 - score)
  
    return (
      <div className="flex flex-col items-center gap-1">
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
          <circle
            cx={dim/2} cy={dim/2} r={r}
            fill="none" stroke="#e5e7eb" strokeWidth="6"
          />
          <circle
            cx={dim/2} cy={dim/2} r={r}
            fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            strokeLinecap="round"
            transform={`rotate(-90 ${dim/2} ${dim/2})`}
          />
          <text
            x="50%" y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill={color}
            fontSize={size === 'sm' ? 11 : 14}
            fontWeight="bold"
          >
            {percentage}%
          </text>
        </svg>
        {label && <span className="text-xs text-gray-500">{label}</span>}
        <span className="text-xs font-semibold" style={{ color }}>{level}</span>
      </div>
    )
  }