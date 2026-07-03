import { formatCurrency } from '@/formatters/currency'
import type { FinancialReportResponse } from '@marmitaria/schemas/financial/financialReportResponse.schema'

interface CostBreakdownCardProps {
  costBreakdown: FinancialReportResponse['costBreakdown']
}

export function CostBreakdownCard({ costBreakdown }: CostBreakdownCardProps) {
  const total = costBreakdown.ingredients + costBreakdown.generalCosts + costBreakdown.gas

  const rows = [
    { label: 'Ingredientes', value: costBreakdown.ingredients, className: 'bg-mustard' },
    { label: 'Custos gerais', value: costBreakdown.generalCosts, className: 'bg-terra' },
    { label: 'Gás (automático)', value: costBreakdown.gas, className: 'bg-pix' },
  ]

  return (
    <div className="bg-card rounded-sm p-5.5 border border-border">
      <b className="text-lg">Composição do custo</b>
      <p className="text-[13.5px] text-muted-foreground mt-0.5 mb-3">de onde saiu o dinheiro</p>

      <div className="flex flex-col gap-2.5">
        {rows.map((row) => {
          const percent = total > 0 ? (row.value / total) * 100 : 0
          return (
            <div key={row.label} className="grid grid-cols-[140px_1fr_90px] items-center gap-3">
              <span className="text-sm">{row.label}</span>
              <span className="h-3 rounded-full bg-muted overflow-hidden">
                <span className={`block h-full rounded-full ${row.className}`} style={{ width: `${percent}%` }} />
              </span>
              <span className="font-heading font-extrabold text-right text-sm">{formatCurrency(row.value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
