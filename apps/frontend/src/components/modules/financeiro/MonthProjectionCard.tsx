import { getISOWeek, getISOWeekYear } from 'date-fns'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialTimeseriesResponse } from '@marmitaria/schemas/financial/financialTimeseriesResponse.schema'

interface MonthProjectionCardProps {
  month: number
  year: number
  series: FinancialTimeseriesResponse
}

function weeksInMonth(month: number, year: number): number {
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0)
  const weekKeys = new Set<string>()
  for (const d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
    weekKeys.add(`${getISOWeekYear(d)}-${getISOWeek(d)}`)
  }
  return weekKeys.size
}

export function MonthProjectionCard({ month, year, series }: MonthProjectionCardProps) {
  if (series.length === 0) return null

  const totalWeeks = weeksInMonth(month, year)
  const avgRevenue = series.reduce((sum, point) => sum + point.revenue, 0) / series.length
  const projectedRevenue = avgRevenue * totalWeeks

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Projeção do mês</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">
        baseada na média de {series.length} semana{series.length !== 1 ? 's' : ''} já registrada{series.length !== 1 ? 's' : ''} nesse mês
      </p>
      <div className="font-heading font-extrabold text-3xl text-mustard-dark">{formatCurrency(projectedRevenue)}</div>
      <div className="text-[12.5px] text-ink-faint mt-1">estimativa para o mês inteiro ({totalWeeks} semanas)</div>
    </div>
  )
}
