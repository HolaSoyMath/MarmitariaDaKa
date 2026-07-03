import { AlertTriangle, Info } from 'lucide-react'
import type { Insight } from './weeklyInsightsUtils'

interface WeeklyInsightsProps {
  insights: Insight[]
}

export function WeeklyInsights({ insights }: WeeklyInsightsProps) {
  if (insights.length === 0) return null

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border flex flex-col gap-2.5">
      <b className="text-lg">Resumo</b>
      {insights.map((insight, i) => {
        const Icon = insight.type === 'warning' ? AlertTriangle : Info
        const colorClass = insight.type === 'warning' ? 'text-terra' : 'text-mustard-dark'
        return (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <Icon size={16} className={`flex-none ${colorClass}`} />
            <span>{insight.text}</span>
          </div>
        )
      })}
    </div>
  )
}
