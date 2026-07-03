import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatCurrency } from '@/formatters/currency'
import type { FinancialComparisonResponse } from '@marmitaria/schemas/financial/financialComparisonResponse.schema'

interface ComparisonCardProps {
  comparison: FinancialComparisonResponse
}

function TrendRow({ label, current, percent, positiveIsGood }: { label: string; current: number; percent: number | null; positiveIsGood: boolean }) {
  const isUp = percent != null && percent > 0
  const isDown = percent != null && percent < 0
  const isGood = percent == null ? null : positiveIsGood ? percent > 0 : percent < 0

  const colorClass = isGood == null ? 'text-muted-foreground' : isGood ? 'text-pix' : 'text-terra'
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-heading font-bold text-base">{formatCurrency(current)}</span>
        <span className={`flex items-center gap-1 text-[13px] font-semibold ${colorClass}`}>
          <Icon size={14} />
          {percent == null ? '—' : `${percent > 0 ? '+' : ''}${percent.toFixed(0)}%`}
        </span>
      </div>
    </div>
  )
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  const { current, variation } = comparison

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Comparação com o período anterior</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-1">variação em relação ao período imediatamente anterior</p>

      <div className="divide-y divide-border">
        <TrendRow label="Faturamento" current={current.revenue} percent={variation.revenuePercent} positiveIsGood />
        <TrendRow label="Custo" current={current.cost} percent={variation.costPercent} positiveIsGood={false} />
        <TrendRow label="Lucro" current={current.profit} percent={variation.profitPercent} positiveIsGood />
      </div>
    </div>
  )
}
