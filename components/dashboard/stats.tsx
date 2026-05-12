import { CheckSquare, Clock, AlertCircle, ListTodo } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    total: number
    inProgress: number
    completed: number
    late: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    {
      label: 'סה"כ משימות',
      value: stats.total,
      icon: ListTodo,
      color: 'bg-sand-100 text-sand-700',
    },
    {
      label: 'בתקופה',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-sky-100 text-sky-700',
    },
    {
      label: 'הושלמו',
      value: stats.completed,
      icon: CheckSquare,
      color: 'bg-sage-100 text-sage-700',
    },
    {
      label: 'באיחור',
      value: stats.late,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-700',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="calm-card">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-sand-800">
                  {item.value}
                </p>
                <p className="text-sm text-sand-500">{item.label}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
