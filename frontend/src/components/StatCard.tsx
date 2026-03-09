interface StatCardProps {
    title: string
    value: string | number
    icon: string
    color?: 'blue' | 'green' | 'yellow' | 'red'
  }
  
  export default function StatCard({
    title,
    value,
    icon,
    color = 'blue'
  }: StatCardProps) {
  
    const colors = {
      blue:   'bg-blue-50   text-blue-600   border-blue-100',
      green:  'bg-green-50  text-green-600  border-green-100',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
      red:    'bg-red-50    text-red-600    border-red-100',
    }
  
    const iconColors = {
      blue:   'bg-blue-100',
      green:  'bg-green-100',
      yellow: 'bg-yellow-100',
      red:    'bg-red-100',
    }
  
    return (
      <div className={`rounded-xl border p-5 ${colors[color]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`${iconColors[color]} rounded-full p-3 text-2xl`}>
            {icon}
          </div>
        </div>
      </div>
    )
  }